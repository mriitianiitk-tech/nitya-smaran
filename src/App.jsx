// src/App.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

const DEFAULT_STATE = {
    syncKey: "sagar-nitya-smaran-108", // Changeable in Settings to link MacBook & Phone
    deityName: "🙏 श्री सीताराम (Sri Sita-Ram)",
    mantra: "श्री राम जय राम जय जय राम",
    arpanamWord: "श्री सीतारामार्पणमस्तु",
    lang: "mix",
    nudgeInterval: 30,
    theme: "light",
    currentBead: 0,
    todayMalas: 0,
    totalJapa: 0,
    likhitaList: [],
    karmas: []
};

const BHAVA_OPTIONS = [
    "Nimitta Matra (Instrument)",
    "Kartavya Puja (Duty as Worship)",
    "Seva Bhava (Selfless Service)",
    "Sakshi Bhava (Detached Witness)"
];

const PRESETS = {
    sitaram: {
        deityName: "🙏 श्री सीताराम (Sri Sita-Ram)",
        mantra: "श्री राम जय राम जय जय राम",
        arpanamWord: "श्री सीतारामार्पणमस्तु"
    },
    radhakrishna: {
        deityName: "🪈 श्री राधाकृष्ण (Sri Radha-Krishna)",
        mantra: "श्री कृष्ण शरणं मम | श्री राधा",
        arpanamWord: "श्री कृष्णार्पणमस्तु"
    },
    shiva: {
        deityName: "🔱 भगवान श्री काशी विश्वनाथ",
        mantra: "ॐ नमः शिवाय | हर हर महादेव",
        arpanamWord: "श्री शिवार्पणमस्तु"
    },
    narayana: {
        deityName: "🪷 श्री लक्ष्मी नारायण",
        mantra: "ॐ नमो भगवते वासुदेवाय",
        arpanamWord: "श्री नारायणार्पणमस्तु"
    },
    hanuman: {
        deityName: "🚩 श्री हनुमान जी महाराज",
        mantra: "ॐ श्री हनुमते नमः | जय सियाराम",
        arpanamWord: "श्री रामचंद्र चरणार्पणमस्तु"
    }
};

const I18N = {
    mix: {
        lblNewSankalpa: "🌺 New Karma Sankalpa (Dedicate Action)",
        descNewSankalpa: "Before starting a task, meeting, or duty, consciously anchor your Bhava in Bhagwan.",
        lblTaskInput: "What action are you about to begin?",
        lblSelectBhava: "Select Inner Attitude (Bhava):",
        btnBeginKarma: "Offer Sankalpa & Begin Task",
        lblTodaysYajna: "🔥 Today's Karma Yajna",
        descTodaysYajna: "When finished, click Arpanam to mentally offer both the effort and its result at Bhagwan's feet.",
        lblMalaTitle: "📿 Nitya Naam Japa & Smaran",
        lblTodayMalas: "Malas Today",
        lblTotalNaam: "Total Naam Count",
        navKarma: "Bhava & Karma",
        navMala: "Naam Japa",
        navSettings: "Settings"
    },
    hi: {
        lblNewSankalpa: "🌺 नया कर्म संकल्प (भगवद्-अर्पण)",
        descNewSankalpa: "कोई भी कार्य, बैठक या कर्तव्य प्रारम्भ करने से पूर्व अपने भाव को भगवान के चरणों में जोड़ें।",
        lblTaskInput: "आप कौन-सा कार्य प्रारम्भ करने जा रहे हैं?",
        lblSelectBhava: "अपना आन्तरिक भाव चुनें:",
        btnBeginKarma: "संकल्प करें और कार्य प्रारम्भ करें",
        lblTodaysYajna: "🔥 आज का कर्म-यज्ञ",
        descTodaysYajna: "कार्य पूर्ण होने पर 'अर्पणम्' दबाकर परिश्रम और फल दोनों भगवान को समर्पित करें।",
        lblMalaTitle: "📿 नित्य नाम जप एवं स्मरण",
        lblTodayMalas: "आज की माला",
        lblTotalNaam: "कुल नाम संख्या",
        navKarma: "भाव एवं कर्म",
        navMala: "नाम जप",
        navSettings: "सेटिंग्स"
    },
    en: {
        lblNewSankalpa: "🌺 New Karma Dedication",
        descNewSankalpa: "Before starting any work or duty, consciously dedicate your intention to the Divine.",
        lblTaskInput: "What task are you about to begin?",
        lblSelectBhava: "Select Inner Intention:",
        btnBeginKarma: "Dedicate & Begin Task",
        lblTodaysYajna: "🔥 Today's Dedicated Actions",
        descTodaysYajna: "Once complete, offer the action and its outcome back to the Divine.",
        lblMalaTitle: "📿 Digital Japa Counter",
        lblTodayMalas: "Malas Today",
        lblTotalNaam: "Total Chants",
        navKarma: "Karma Yoga",
        navMala: "Chant Counter",
        navSettings: "Settings"
    }
};

export default function App() {
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem("nityaSmaranD1State");
        return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE;
    });

    const [activeTab, setActiveTab] = useState("karma");
    const [karmaInput, setKarmaInput] = useState("");
    const [selectedBhava, setSelectedBhava] = useState(BHAVA_OPTIONS[0]);
    const [likhitaInput, setLikhitaInput] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [syncStatus, setSyncStatus] = useState("Offline-Ready");
    const syncTimeoutRef = useRef(null);

    const t = I18N[state.lang] || I18N.mix;

    // Synthesized Web Audio Temple Bell
    const playBellSound = useCallback(() => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = "sine";
            osc2.type = "triangle";
            osc1.frequency.setValueAtTime(528, ctx.currentTime);
            osc2.frequency.setValueAtTime(1056, ctx.currentTime);

            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start();
            osc2.start();
            osc1.stop(ctx.currentTime + 2.4);
            osc2.stop(ctx.currentTime + 2.4);
        } catch (err) { }
    }, []);

    // Save to LocalStorage & Trigger Debounced Cloud Sync
    useEffect(() => {
        localStorage.setItem("nityaSmaranD1State", JSON.stringify(state));
        document.documentElement.setAttribute("data-theme", state.theme);

        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => {
            pushToCloud(state);
        }, 1200);
    }, [state]);

    // Pull from Cloudflare D1 on initial load & window focus
    const pullFromCloud = useCallback(async (keyToUse) => {
        if (!navigator.onLine) return;
        try {
            setSyncStatus("Syncing...");
            const res = await fetch(`/api/sync?key=${encodeURIComponent(keyToUse)}`);
            if (!res.ok) throw new Error("Sync failed");
            const data = await res.json();

            if (data.userState) {
                const u = data.userState;
                const cloudKarmas = (data.karmas || []).map(k => ({
                    id: k.id,
                    title: k.title,
                    bhava: k.bhava,
                    time: k.time_str,
                    date: k.date_str,
                    offered: Boolean(k.offered),
                    updatedAt: k.updated_at
                }));

                setState(prev => ({
                    ...prev,
                    deityName: u.deity_name || prev.deityName,
                    mantra: u.mantra || prev.mantra,
                    arpanamWord: u.arpanam_word || prev.arpanamWord,
                    lang: u.lang || prev.lang,
                    nudgeInterval: u.nudge_interval ?? prev.nudgeInterval,
                    theme: u.theme || prev.theme,
                    todayMalas: Math.max(prev.todayMalas, u.today_malas || 0),
                    totalJapa: Math.max(prev.totalJapa, u.total_japa || 0),
                    likhitaList: JSON.parse(u.likhita_json || "[]"),
                    karmas: cloudKarmas.length > 0 ? cloudKarmas : prev.karmas
                }));
            }
            setSyncStatus("☁️ Synced with D1");
        } catch (e) {
            setSyncStatus("Local Mode");
        }
    }, []);

    const pushToCloud = async (currentState) => {
        if (!navigator.onLine || !currentState.syncKey) return;
        try {
            setSyncStatus("Syncing...");
            const res = await fetch("/api/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    syncKey: currentState.syncKey,
                    state: currentState,
                    karmas: currentState.karmas
                })
            });
            if (res.ok) {
                setSyncStatus("☁️ Synced with D1");
            }
        } catch (e) {
            setSyncStatus("Local Mode");
        }
    };

    useEffect(() => {
        pullFromCloud(state.syncKey);
        const onFocus = () => pullFromCloud(state.syncKey);
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, [pullFromCloud, state.syncKey]);

    // Smaran Nudge Interval Timer
    useEffect(() => {
        if (!state.nudgeInterval || state.nudgeInterval <= 0) return;
        const timer = setInterval(() => {
            playBellSound();
            setShowModal(true);
        }, state.nudgeInterval * 60 * 1000);
        return () => clearInterval(timer);
    }, [state.nudgeInterval, playBellSound]);

    // MacBook Spacebar Shortcut for Japa
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeTab === "mala" && e.code === "Space" && document.activeElement.tagName !== "INPUT") {
                e.preventDefault();
                incrementJapa();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    const incrementJapa = () => {
        if (navigator.vibrate) navigator.vibrate(15);
        setState(prev => {
            let nextBead = prev.currentBead + 1;
            let nextMalas = prev.todayMalas;
            if (nextBead >= 108) {
                nextBead = 0;
                nextMalas += 1;
                if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
                playBellSound();
            }
            return {
                ...prev,
                currentBead: nextBead,
                todayMalas: nextMalas,
                totalJapa: prev.totalJapa + 1
            };
        });
    };

    const addKarma = () => {
        if (!karmaInput.trim()) return;
        const now = new Date();
        const newItem = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: karmaInput.trim(),
            bhava: selectedBhava,
            time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            date: now.toISOString().slice(0, 10),
            offered: false,
            updatedAt: Date.now()
        };

        playBellSound();
        setKarmaInput("");
        setState(prev => ({
            ...prev,
            karmas: [newItem, ...prev.karmas]
        }));
    };

    const offerKarma = (id) => {
        playBellSound();
        setState(prev => ({
            ...prev,
            karmas: prev.karmas.map(k =>
                k.id === id ? { ...k, offered: true, updatedAt: Date.now() } : k
            )
        }));
    };

    const submitLikhita = () => {
        if (!likhitaInput.trim()) return;
        const word = likhitaInput.trim();
        setLikhitaInput("");
        setState(prev => ({
            ...prev,
            totalJapa: prev.totalJapa + 1,
            likhitaList: [...prev.likhitaList.slice(-30), word]
        }));
    };

    const offeredCount = state.karmas.filter(k => k.offered).length;

    return (
        <div className="app-wrapper">
            <header>
                <div className="deity-title">{state.deityName}</div>
                <div className="mantra-subtitle">{state.mantra}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
                    <div className="nudge-pill" onClick={() => { playBellSound(); setShowModal(true); }}>
                        <span>🔔</span>
                        <span>{state.nudgeInterval > 0 ? `Bell: ${state.nudgeInterval}m` : "1-Breath Smaran"}</span>
                    </div>
                    <div className="nudge-pill" onClick={() => pullFromCloud(state.syncKey)}>
                        <span>{syncStatus}</span>
                    </div>
                </div>
            </header>

            <main>
                {activeTab === "karma" && (
                    <section className="tab-content active">
                        <div className="shloka-box">
                            <div className="shloka-sanskrit">
                                यत्करोषि यदश्नासि यज्जुहोषि ददासि यत् । यत्तपस्यसि कौन्तेय तत्कुरुष्व मदर्पणम् ॥
                            </div>
                            <div className="shloka-meaning">
                                Whatever you do, whatever you eat, whatever you offer or give away—do that as an offering unto Me. (Gita 9.27)
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">{t.lblNewSankalpa}</div>
                            <div className="card-desc">{t.descNewSankalpa}</div>

                            <div className="input-group">
                                <label>{t.lblTaskInput}</label>
                                <input
                                    type="text"
                                    value={karmaInput}
                                    onChange={e => setKarmaInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && addKarma()}
                                    placeholder="e.g., Reviewing files, Inspection, Family duty..."
                                />
                            </div>

                            <label>{t.lblSelectBhava}</label>
                            <div className="bhava-chips">
                                {BHAVA_OPTIONS.map(b => (
                                    <button
                                        key={b}
                                        type="button"
                                        className={`bhava-chip ${selectedBhava === b ? "selected" : ""}`}
                                        onClick={() => setSelectedBhava(b)}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>

                            <button className="btn" onClick={addKarma}>
                                🙏 {t.btnBeginKarma}
                            </button>
                        </div>

                        <div className="card">
                            <div className="card-title">
                                <span>{t.lblTodaysYajna}</span>
                                <span style={{ fontSize: "0.82rem", color: "var(--saffron)" }}>
                                    {offeredCount} / {state.karmas.length} Offered
                                </span>
                            </div>
                            <div className="card-desc">{t.descTodaysYajna}</div>

                            {state.karmas.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "18px", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                                    No tasks logged yet. Dedicate your current task above to turn work into worship.
                                </div>
                            ) : (
                                state.karmas.map(item => (
                                    <div key={item.id} className={`karma-item ${item.offered ? "offered" : ""}`}>
                                        <div className="karma-top">
                                            <div className="karma-title">{item.title}</div>
                                            <span className="karma-bhava-tag">{item.bhava}</span>
                                        </div>
                                        <div className="karma-meta">
                                            <span>🕒 {item.time}</span>
                                            {item.offered ? (
                                                <span style={{ color: "var(--success)", fontWeight: 600 }}>
                                                    ✨ {state.arpanamWord}
                                                </span>
                                            ) : (
                                                <button className="btn btn-secondary btn-small" onClick={() => offerKarma(item.id)}>
                                                    🙏 Offer ({state.arpanamWord})
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {activeTab === "mala" && (
                    <section className="tab-content active">
                        <div className="card">
                            <div className="card-title">
                                <span>{t.lblMalaTitle}</span>
                                <button
                                    className="btn btn-secondary btn-small"
                                    onClick={() => setState(prev => ({ ...prev, currentBead: 0 }))}
                                >
                                    Reset Bead
                                </button>
                            </div>
                            <div className="card-desc">
                                Tap circle (or press Spacebar on MacBook). Automatically syncs across devices.
                            </div>

                            <div className="mala-circle-wrap">
                                <div className="mala-tap-btn" onClick={incrementJapa}>
                                    <div className="mala-count-num">{state.currentBead}</div>
                                    <div className="mala-sub">/ 108 Beads</div>
                                    <div className="mala-sub" style={{ color: "var(--saffron)", fontWeight: 600, marginTop: "8px" }}>
                                        {state.mantra}
                                    </div>
                                </div>
                            </div>

                            <div className="stats-row">
                                <div className="stat-box">
                                    <div className="stat-val">{state.todayMalas}</div>
                                    <div className="stat-lbl">{t.lblTodayMalas}</div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-val">{state.totalJapa}</div>
                                    <div className="stat-lbl">{t.lblTotalNaam}</div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">✍️ Quick Likhita Japa</div>
                            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                                <input
                                    type="text"
                                    value={likhitaInput}
                                    onChange={e => setLikhitaInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && submitLikhita()}
                                    placeholder="Type श्री राम, राधा, or ॐ..."
                                />
                                <button className="btn btn-small" onClick={submitLikhita}>Offer</button>
                            </div>
                            <div style={{ marginTop: "12px", fontSize: "0.88rem", color: "var(--saffron)", lineHeight: 1.6 }}>
                                {state.likhitaList.slice(-18).map((w, idx) => (
                                    <span key={idx} style={{ marginRight: "8px" }}>🌺 {w}</span>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === "settings" && (
                    <section className="tab-content active">
                        <div className="card">
                            <div className="card-title">☁️ Cloudflare D1 Sync Passkey</div>
                            <div className="card-desc">
                                Enter the exact same passkey on your iPhone/Android and MacBook to keep your Sadhana synced.
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={state.syncKey}
                                    onChange={e => setState(prev => ({ ...prev, syncKey: e.target.value.trim() }))}
                                />
                            </div>
                            <button className="btn btn-secondary btn-small" onClick={() => pullFromCloud(state.syncKey)}>
                                🔄 Force Pull from Cloud Now
                            </button>
                        </div>

                        <div className="card">
                            <div className="card-title">🕉️ Customize Ishta Dev & Mantra</div>
                            <div className="input-group" style={{ marginTop: "10px" }}>
                                <label>Quick Preset</label>
                                <select
                                    onChange={e => {
                                        const p = PRESETS[e.target.value];
                                        if (p) setState(prev => ({ ...prev, ...p }));
                                    }}
                                >
                                    <option value="">-- Choose Preset --</option>
                                    <option value="sitaram">श्री सीताराम | श्री राम जय राम जय जय राम</option>
                                    <option value="radhakrishna">श्री राधाकृष्ण | श्री कृष्ण शरणं मम</option>
                                    <option value="shiva">भगवान शिव | ॐ नमः शिवाय</option>
                                    <option value="narayana">श्री लक्ष्मी नारायण | ॐ नमो भगवते वासुदेवाय</option>
                                    <option value="hanuman">श्री हनुमान जी | ॐ श्री हनुमते नमः</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Ishta Dev Name</label>
                                <input
                                    type="text"
                                    value={state.deityName}
                                    onChange={e => setState(prev => ({ ...prev, deityName: e.target.value }))}
                                />
                            </div>

                            <div className="input-group">
                                <label>Primary Mantra</label>
                                <input
                                    type="text"
                                    value={state.mantra}
                                    onChange={e => setState(prev => ({ ...prev, mantra: e.target.value }))}
                                />
                            </div>

                            <div className="input-group">
                                <label>Dedication Phrase (Arpanam)</label>
                                <input
                                    type="text"
                                    value={state.arpanamWord}
                                    onChange={e => setState(prev => ({ ...prev, arpanamWord: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">🌐 Language, Nudge & Theme</div>
                            <div className="input-group" style={{ marginTop: "10px" }}>
                                <label>Interface Language (भाषा)</label>
                                <select
                                    value={state.lang}
                                    onChange={e => setState(prev => ({ ...prev, lang: e.target.value }))}
                                >
                                    <option value="mix">Mix (English + Devanagari Bhava)</option>
                                    <option value="hi">हिन्दी / संस्कृत (Pure Devanagari)</option>
                                    <option value="en">English</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Smaran Bell Interval</label>
                                <select
                                    value={state.nudgeInterval}
                                    onChange={e => setState(prev => ({ ...prev, nudgeInterval: Number(e.target.value) }))}
                                >
                                    <option value={0}>Off (Manual Only)</option>
                                    <option value={15}>Every 15 Minutes</option>
                                    <option value={30}>Every 30 Minutes</option>
                                    <option value={60}>Every 60 Minutes</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Theme</label>
                                <select
                                    value={state.theme}
                                    onChange={e => setState(prev => ({ ...prev, theme: e.target.value }))}
                                >
                                    <option value="light">Sandalwood Light (चन्दन)</option>
                                    <option value="dark">Brahma Muhurta Dark (ध्यान)</option>
                                </select>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {showModal && (
                <div className="overlay show">
                    <div className="overlay-om">🕉️</div>
                    <div className="overlay-mantra">{state.mantra}</div>
                    <div className="overlay-prompt">
                        Pause your thoughts for one deep breath. Remember Bhagwan's presence right here in the midst of your work.
                    </div>
                    <button
                        className="btn"
                        style={{ maxWidth: "240px" }}
                        onClick={() => {
                            setState(prev => ({ ...prev, totalJapa: prev.totalJapa + 1 }));
                            setShowModal(false);
                        }}
                    >
                        🙏 Smaran Done (Resume)
                    </button>
                </div>
            )}

            <nav>
                <button className={`nav-item ${activeTab === "karma" ? "active" : ""}`} onClick={() => setActiveTab("karma")}>
                    <span className="nav-icon">🌺</span>
                    <span>{t.navKarma}</span>
                </button>
                <button className={`nav-item ${activeTab === "mala" ? "active" : ""}`} onClick={() => setActiveTab("mala")}>
                    <span className="nav-icon">📿</span>
                    <span>{t.navMala}</span>
                </button>
                <button className={`nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
                    <span className="nav-icon">⚙️</span>
                    <span>{t.navSettings}</span>
                </button>
            </nav>
        </div>
    );
}