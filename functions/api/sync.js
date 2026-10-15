// functions/api/sync.js
// Cloudflare Pages D1 state sync endpoint

export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const syncKey = url.searchParams.get("key");

    if (!syncKey) {
        return Response.json({ error: "Missing sync key" }, { status: 400 });
    }

    try {
        if (!env.DB) {
            return Response.json({ ok: false, message: "D1 not bound" });
        }

        const row = await env.DB.prepare(
            "SELECT state_json, updated_at FROM smaran_sync WHERE user_id = ?"
        ).bind(syncKey).first();

        if (row?.state_json) {
            return Response.json({
                ok: true,
                state: JSON.parse(row.state_json),
                updatedAt: row.updated_at
            });
        }

        return Response.json({ ok: true, state: null });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { syncKey, state } = body;

        if (!syncKey || !state) {
            return Response.json({ error: "Invalid payload" }, { status: 400 });
        }

        if (env.DB) {
            await env.DB.prepare(`
                INSERT INTO smaran_sync (user_id, state_json, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                  state_json = excluded.state_json,
                  updated_at = excluded.updated_at
            `).bind(syncKey, JSON.stringify(state), Date.now()).run();
        }

        return Response.json({ ok: true, timestamp: Date.now() });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}