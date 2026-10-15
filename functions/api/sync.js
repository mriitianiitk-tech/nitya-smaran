// functions/api/sync.js

export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const syncKey = url.searchParams.get("key");

    if (!syncKey) {
        return Response.json({ error: "Missing sync key" }, { status: 400 });
    }

    try {
        const userState = await env.DB.prepare(
            "SELECT * FROM user_state WHERE sync_key = ?"
        ).bind(syncKey).first();

        const { results: karmas } = await env.DB.prepare(
            "SELECT * FROM karmas WHERE sync_key = ? AND deleted = 0 ORDER BY updated_at DESC LIMIT 100"
        ).bind(syncKey).all();

        return Response.json({
            userState: userState || null,
            karmas: karmas || []
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { syncKey, state, karmas } = body;

        if (!syncKey || !state) {
            return Response.json({ error: "Invalid payload" }, { status: 400 });
        }

        const now = Date.now();

        // 1. Upsert user_state (keeping maximum total_japa so counts never regress)
        await env.DB.prepare(`
      INSERT INTO user_state (
        sync_key, deity_name, mantra, arpanam_word, lang,
        nudge_interval, theme, current_bead, today_malas,
        total_japa, likhita_json, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(sync_key) DO UPDATE SET
        deity_name = excluded.deity_name,
        mantra = excluded.mantra,
        arpanam_word = excluded.arpanam_word,
        lang = excluded.lang,
        nudge_interval = excluded.nudge_interval,
        theme = excluded.theme,
        current_bead = excluded.current_bead,
        today_malas = MAX(user_state.today_malas, excluded.today_malas),
        total_japa = MAX(user_state.total_japa, excluded.total_japa),
        likhita_json = excluded.likhita_json,
        updated_at = excluded.updated_at
    `).bind(
            syncKey,
            state.deityName,
            state.mantra,
            state.arpanamWord,
            state.lang,
            state.nudgeInterval,
            state.theme,
            state.currentBead,
            state.todayMalas,
            state.totalJapa,
            JSON.stringify(state.likhitaList || []),
            now
        ).run();

        // 2. Batch Upsert Karmas
        if (Array.isArray(karmas) && karmas.length > 0) {
            const stmt = env.DB.prepare(`
        INSERT INTO karmas (id, sync_key, title, bhava, time_str, date_str, offered, updated_at, deleted)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          offered = MAX(karmas.offered, excluded.offered),
          deleted = MAX(karmas.deleted, excluded.deleted),
          updated_at = MAX(karmas.updated_at, excluded.updated_at)
      `);

            const batch = karmas.map(k =>
                stmt.bind(
                    String(k.id),
                    syncKey,
                    k.title,
                    k.bhava,
                    k.time,
                    k.date || new Date().toISOString().slice(0, 10),
                    k.offered ? 1 : 0,
                    k.updatedAt || now,
                    k.deleted ? 1 : 0
                )
            );
            await env.DB.batch(batch);
        }

        // 3. Return latest merged state back to client
        const updatedUser = await env.DB.prepare(
            "SELECT * FROM user_state WHERE sync_key = ?"
        ).bind(syncKey).first();

        const { results: mergedKarmas } = await env.DB.prepare(
            "SELECT * FROM karmas WHERE sync_key = ? AND deleted = 0 ORDER BY updated_at DESC LIMIT 100"
        ).bind(syncKey).all();

        return Response.json({
            ok: true,
            userState: updatedUser,
            karmas: mergedKarmas
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}