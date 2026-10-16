import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./App.css";

const DEFAULT_BHAVA_OPTIONS = [
    "Nimitta Matra (Instrument)",
    "Kartavya Puja (Duty as Worship)",
    "Seva Bhava (Selfless Service)",
    "Sakshi Bhava (Detached Witness)"
];

const PRESET_DEITIES = [
    "श्री विष्णु",
    "श्री राम",
    "भगवान शिव",
    "श्री राधाकृष्ण",
    "श्री हनुमान",
    "माँ ललिता / दुर्गा",
    "श्री गणेश",
    "सूर्य देव"
];

const INITIAL_SAHASRANAMAS = [
    {
        id: "vishnu-sahasranama",
        title: "श्री विष्णु सहस्रनाम (Vishnu Sahasranama)",
        deity: "श्री विष्णु",
        names: [
            { id: "v1", name: "विश्वम्", meaningHi: "समस्त विश्व ही जिनका साक्षात् स्वरूप है", meaningEn: "He whose very form is the universe" },
            { id: "v2", name: "विष्णुः", meaningHi: "जो सर्वव्यापी हैं, सबमें व्याप्त होकर रक्षा करते हैं", meaningEn: "The All-Pervading Supreme Protector" },
            { id: "v3", name: "वषट्कारः", meaningHi: "यज्ञ में जिनकी तृप्ति हेतु वषट् मन्त्र से आहुति दी जाती है", meaningEn: "He for whom the sacrificial oblations are poured" },
            { id: "v4", name: "भूतभव्यभवत्प्रभुः", meaningHi: "भूत, वर्तमान और भविष्य तीनों कालों के परम स्वामी", meaningEn: "The Lord of past, present, and future" },
            { id: "v5", name: "भूतकृत्", meaningHi: "समस्त चराचर प्राणियों के रचयिता", meaningEn: "The Creator of all beings" },
            { id: "v6", name: "भूतभृत्", meaningHi: "समस्त जीवों का पालन-पोषण और भरण करने वाले", meaningEn: "The Sustainer and Nourisher of all creatures" },
            { id: "v7", name: "भावः", meaningHi: "जो नित्य शुद्ध अस्तित्व और सत्-स्वरूप हैं", meaningEn: "Pure Unchanging Existence" },
            { id: "v8", name: "भूतात्मा", meaningHi: "समस्त प्राणियों के हृदय में वास करने वाली अन्तरात्मा", meaningEn: "The inmost Soul dwelling in every heart" },
            { id: "v9", name: "पुरुषोत्तमः", meaningHi: "क्षर और अक्षर दोनों से परे सर्वोच्च परमात्मा", meaningEn: "The Supreme Person beyond the perishable and imperishable" },
            { id: "v10", name: "केशवः", meaningHi: "ब्रह्मा, विष्णु और शिव के नियन्ता, एवं सुन्दर केशों वाले", meaningEn: "Master of creation, preservation, and dissolution" },
            { id: "v11", name: "माधवः", meaningHi: "माता महालक्ष्मी के प्रियतम प्रभु", meaningEn: "Lord and consort of Sri Lakshmi" },
            { id: "v12", name: "गोविन्दः", meaningHi: "गौ, वेदों और पृथ्वी के परम रक्षक एवं ज्ञाता", meaningEn: "Protector of the cows, sacred wisdom, and the earth" }
        ]
    },
    {
        id: "rama-sahasranama",
        title: "श्री राम सहस्रनाम (Sri Rama Sahasranama)",
        deity: "श्री राम",
        names: [
            { id: "r1", name: "रामः", meaningHi: "जिनके स्वरूप में योगीजन नित्य रमण करते हैं, परमानन्द स्वरूप", meaningEn: "The Supreme Bliss in whom enlightened yogis rejoice" },
            { id: "r2", name: "रामभद्रः", meaningHi: "सदा कल्याण करने वाले, परम मङ्गलमय प्रभु", meaningEn: "The Ever-Auspicious and Benevolent Lord" },
            { id: "r3", name: "रामचन्द्रः", meaningHi: "चन्द्रमा के समान शीतल, शान्तिदायक और मनमोहक", meaningEn: "Cool, radiant, and tranquil like the full moon" },
            { id: "r4", name: "शाश्वतः", meaningHi: "सदा एकरस रहने वाले, सनातन सत्य", meaningEn: "The Eternal and Unchanging Truth" },
            { id: "r5", name: "राजीवलोचनः", meaningHi: "कमल के समान कोमल और विशाल नेत्रों वाले", meaningEn: "The Lotus-Eyed Divine Lord" },
            { id: "r6", name: "धन्वी", meaningHi: "धर्म की रक्षा हेतु कोदण्ड धनुष धारण करने वाले", meaningEn: "Bearer of the sacred bow Kodanda" },
            { id: "r7", name: "धर्मधुरन्धरः", meaningHi: "मर्यादा और सत्य-धर्म के सर्वोच्च अधिष्ठाता", meaningEn: "Foremost upholder of Dharma and righteousness" },
            { id: "r8", name: "रघुपतिः", meaningHi: "सूर्यवंशी रघुकुल के शिरोमणि", meaningEn: "Sovereign Lord of the Raghu lineage" },
            { id: "r9", name: "सीतापतिः", meaningHi: "माता जानकी के प्राणप्रिय जीवन-धन", meaningEn: "Beloved consort of Janaki" },
            { id: "r10", name: "भक्तवत्सलः", meaningHi: "शरणागत भक्तों पर अहैतुकी कृपा करने वाले", meaningEn: "Tenderly affectionate to all devoted surrenderers" }
        ]
    },
    {
        id: "shiva-sahasranama",
        title: "श्री शिव सहस्रनाम (Sri Shiva Sahasranama)",
        deity: "भगवान शिव",
        names: [
            { id: "s1", name: "शिवः", meaningHi: "जो परम कल्याण स्वरूप और मङ्गलकारी हैं", meaningEn: "Pure Supreme Auspiciousness" },
            { id: "s2", name: "शम्भुः", meaningHi: "समस्त सुख और ब्रह्मानन्द के उद्गम", meaningEn: "The source and dispenser of divine joy" },
            { id: "s3", name: "शङ्करः", meaningHi: "कल्याण और शान्ति प्रदान करने वाले", meaningEn: "Bestower of peace and supreme welfare" },
            { id: "s4", name: "महेश्वरः", meaningHi: "समस्त ईश्वरों और लोकों के महान् ईश्वर", meaningEn: "The Great Supreme Lord of all lords" },
            { id: "s5", name: "गङ्गाधरः", meaningHi: "पवित्र गङ्गा जी को अपनी जटाओं में धारण करने वाले", meaningEn: "Bearer of the sacred celestial river Ganga" },
            { id: "s6", name: "नीलकण्ठः", meaningHi: "संसार के कल्याण हेतु कालकूट विष धारण करने वाले", meaningEn: "He who held cosmic poison in His throat out of mercy" },
            { id: "s7", name: "आशुतोषः", meaningHi: "क्षण मात्र की सच्ची भक्ति से शीघ्र प्रसन्न होने वाले", meaningEn: "Easily and swiftly pleased by sincere devotion" }
        ]
    }
];

const DEFAULT_STATE = {
    syncKey: "sagar-nitya-smaran-108",
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
    karmas: [],
    bhavaOptions: DEFAULT_BHAVA_OPTIONS,
    sahasranamas: INITIAL_SAHASRANAMAS,
    favoriteKeys: []
};

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
        lblNewSankalpa: "🌺 Dedicated Action (Sankalpa)",
        descNewSankalpa: "Anchor your inner attitude in Bhagwan before beginning any duty.",
        lblTaskInput: "What action are you offering? (Optional)",
        lblSelectBhava: "Choose Inner Attitude:",
        btnBeginKarma: "Dedicate & Begin Action",
        lblTodaysYajna: "🔥 Today's Dedicated Actions",
        descTodaysYajna: "Click Arpanam to offer the effort and outcome at Bhagwan's feet.",
        navNama: "Nama Smaran",
        navKarma: "Karma Yoga",
        navLibrary: "Library",
        navSettings: "Settings"
    },
    hi: {
        lblNewSankalpa: "🌺 भगवद्-अर्पित कर्म (संकल्प)",
        descNewSankalpa: "कोई भी कार्य प्रारम्भ करने से पूर्व अपने भाव को प्रभु से जोड़ें।",
        lblTaskInput: "कार्य का नाम (वैकल्पिक)",
        lblSelectBhava: "अपना आन्तरिक भाव चुनें:",
        btnBeginKarma: "संकल्प समर्पित करें",
        lblTodaysYajna: "🔥 आज का कर्म-यज्ञ",
        descTodaysYajna: "कार्य पूर्ण होने पर 'अर्पणम्' करके फल भगवान को समर्पित करें।",
        navNama: "नाम स्मरण",
        navKarma: "कर्म योग",
        navLibrary: "ग्रन्थ सूची",
        navSettings: "सेटिंग्स"
    },
    en: {
        lblNewSankalpa: "🌺 Dedicated Action (Sankalpa)",
        descNewSankalpa: "Anchor your inner intention in the Divine before taking action.",
        lblTaskInput: "Action name (Optional)",
        lblSelectBhava: "Select Attitude:",
        btnBeginKarma: "Dedicate & Begin",
        lblTodaysYajna: "🔥 Dedicated Actions Today",
        descTodaysYajna: "Offer your action and its fruit back to the Divine.",
        navNama: "Nama Smaran",
        navKarma: "Karma Yoga",
        navLibrary: "Library",
        navSettings: "Settings"
    }
};

export default function App() {
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem("nityaSmaranD1State");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    ...DEFAULT_STATE,
                    ...parsed,
                    bhavaOptions: parsed.bhavaOptions?.length ? parsed.bhavaOptions : DEFAULT_BHAVA_OPTIONS,
                    sahasranamas: parsed.sahasranamas?.length ? parsed.sahasranamas : INITIAL_SAHASRANAMAS,
                    favoriteKeys: Array.isArray(parsed.favoriteKeys) ? parsed.favoriteKeys : []
                };
            } catch {
                return DEFAULT_STATE;
            }
        }
        return DEFAULT_STATE;
    });

    // Default tab is the Fullscreen Nama Smaran & Japa chanter
    const [activeTab, setActiveTab] = useState("nama");

    // Ultra-Minimal Mode Toggle (switchable option)
    const [ultraMinimal, setUltraMinimal] = useState(() => {
        return localStorage.getItem("nityaSmaranUltraMinimal") === "true";
    });

    // Fullscreen Immersive Mode toggle
    const [isImmersiveMode, setIsImmersiveMode] = useState(false);

    // Fullscreen Nama Smaran State (supports 'all', 'deity:...', or 'col:...')
    const [fsSelectedSource, setFsSelectedSource] = useState("all");
    const [fsNameIndex, setFsNameIndex] = useState(0);
    const [fsShowMeaning, setFsShowMeaning] = useState(false);
    const [fsRandomMode, setFsRandomMode] = useState(false);

    // Karma Yoga State
    const [karmaInput, setKarmaInput] = useState("");
    const [selectedBhava, setSelectedBhava] = useState(() => state.bhavaOptions?.[0] || DEFAULT_BHAVA_OPTIONS[0]);

    // Modals
    const [showModal, setShowModal] = useState(false); // 1-breath smaran
    const [syncStatus, setSyncStatus] = useState("Offline-Ready");
    const syncTimeoutRef = useRef(null);

    // Bhava Category Settings State
    const [newBhavaCategory, setNewBhavaCategory] = useState("");
    const [editingBhavaIndex, setEditingBhavaIndex] = useState(null);
    const [editingBhavaValue, setEditingBhavaValue] = useState("");

    // Library Subtabs
    const [librarySubTab, setLibrarySubTab] = useState("collections"); // 'collections' | 'review' | 'quiz'
    const [expandedCollectionId, setExpandedCollectionId] = useState(null);

    // Add Collection Modal with existing/new Deity selection
    const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
    const [newCollectionTitle, setNewCollectionTitle] = useState("");
    const [selectedDeityChoice, setSelectedDeityChoice] = useState("श्री विष्णु");
    const [customDeityName, setCustomDeityName] = useState("");

    // Add Name Modal
    const [showAddNameModal, setShowAddNameModal] = useState(false);
    const [targetCollectionId, setTargetCollectionId] = useState("");
    const [newNameSanskrit, setNewNameSanskrit] = useState("");
    const [newNameMeaningHi, setNewNameMeaningHi] = useState("");
    const [newNameMeaningEn, setNewNameMeaningEn] = useState("");

    // Upload Modal
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadTargetCollectionId, setUploadTargetCollectionId] = useState("");
    const [uploadRawText, setUploadRawText] = useState("");
    const [uploadStatusMsg, setUploadStatusMsg] = useState("");

    // Review Subtab State
    const [reviewDeityFilter, setReviewDeityFilter] = useState("all");
    const [reviewMode, setReviewMode] = useState("sequential");
    const [reviewIndex, setReviewIndex] = useState(0);
    const [showReviewMeaning, setShowReviewMeaning] = useState(false);

    // Quiz Game State (supports 'all', 'deity:...', or 'col:...')
    const [quizSourceFilter, setQuizSourceFilter] = useState("all");
    const [quizQuestion, setQuizQuestion] = useState(null);
    const [quizSelectedOption, setQuizSelectedOption] = useState(null);
    const [quizAnswerChecked, setQuizAnswerChecked] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [quizStreak, setQuizStreak] = useState(0);

    // PWA Install Prompt & Standalone Mode State
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showIOSInstallModal, setShowIOSInstallModal] = useState(false);

    const t = I18N[state.lang] || I18N.mix;

    // All available deities list (presets + custom added)
    const allDeities = useMemo(() => {
        const fromCollections = state.sahasranamas.map(s => s.deity).filter(Boolean);
        return Array.from(new Set([...PRESET_DEITIES, ...fromCollections]));
    }, [state.sahasranamas]);

    // Haptic vibration helper
    const triggerHaptic = useCallback((pattern = 25) => {
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            try {
                window.navigator.vibrate(pattern);
            } catch {}
        }
    }, []);

    // Check if a name is in favorites
    const isNameFavorited = useCallback((colId, nameItemOrStr) => {
        if (!state.favoriteKeys || state.favoriteKeys.length === 0) return false;
        const nameStr = typeof nameItemOrStr === "string" ? nameItemOrStr : nameItemOrStr?.name;
        if (!nameStr) return false;
        const key = `${colId || ""}:${nameStr}`;
        return state.favoriteKeys.includes(key) || state.favoriteKeys.includes(nameStr);
    }, [state.favoriteKeys]);

    // Toggle favorite status for a name
    const toggleFavoriteName = useCallback((colId, nameItemOrStr, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        triggerHaptic(45);
        const nameStr = typeof nameItemOrStr === "string" ? nameItemOrStr : nameItemOrStr?.name;
        if (!nameStr) return;
        const key = `${colId || ""}:${nameStr}`;
        setState(prev => {
            const keys = prev.favoriteKeys || [];
            const isFav = keys.includes(key) || keys.includes(nameStr);
            const nextKeys = isFav
                ? keys.filter(k => k !== key && k !== nameStr)
                : [...keys, key];
            return {
                ...prev,
                favoriteKeys: nextKeys
            };
        });
    }, [triggerHaptic]);

    // Memoized list of all favorited names across all collections
    const allFavoriteNames = useMemo(() => {
        if (!state.favoriteKeys || state.favoriteKeys.length === 0 || !state.sahasranamas) return [];
        const list = [];
        state.sahasranamas.forEach(col => {
            (col.names || []).forEach(n => {
                const key = `${col.id}:${n.name}`;
                if (state.favoriteKeys.includes(key) || state.favoriteKeys.includes(n.name)) {
                    list.push({
                        ...n,
                        collectionId: col.id,
                        collectionTitle: col.title,
                        deity: col.deity,
                        collectionDeity: col.deity
                    });
                }
            });
        });
        return list;
    }, [state.sahasranamas, state.favoriteKeys]);

    // Toggle Ultra-Minimal Mode
    const toggleUltraMinimal = () => {
        setUltraMinimal(prev => {
            const next = !prev;
            localStorage.setItem("nityaSmaranUltraMinimal", String(next));
            return next;
        });
    };

    // Toggle Immersive Browser Fullscreen
    const toggleImmersive = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
            setIsImmersiveMode(true);
        } else {
            if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
            setIsImmersiveMode(false);
        }
    };

    // Keep selectedBhava valid
    useEffect(() => {
        if (!state.bhavaOptions.includes(selectedBhava)) {
            setSelectedBhava(state.bhavaOptions[0] || DEFAULT_BHAVA_OPTIONS[0]);
        }
    }, [state.bhavaOptions, selectedBhava]);

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
        } catch { }
    }, []);

    // Save to LocalStorage & Debounced Cloud Sync
    useEffect(() => {
        localStorage.setItem("nityaSmaranD1State", JSON.stringify(state));
        document.documentElement.setAttribute("data-theme", state.theme);

        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => {
            pushToCloud(state);
        }, 1200);
    }, [state]);

    // Pull from Cloudflare D1
    const pullFromCloud = useCallback(async (keyToUse) => {
        if (!navigator.onLine) return;
        try {
            setSyncStatus("Syncing...");
            const res = await fetch(`/api/sync?key=${encodeURIComponent(keyToUse)}`);
            if (!res.ok) throw new Error("Sync failed");
            const data = await res.json();

            if (data.state) {
                const s = data.state;
                setState(prev => ({
                    ...prev,
                    ...s,
                    todayMalas: Math.max(prev.todayMalas, s.todayMalas || 0),
                    totalJapa: Math.max(prev.totalJapa, s.totalJapa || 0),
                    bhavaOptions: s.bhavaOptions?.length ? s.bhavaOptions : prev.bhavaOptions,
                    sahasranamas: s.sahasranamas?.length ? s.sahasranamas : prev.sahasranamas,
                    favoriteKeys: Array.isArray(s.favoriteKeys) ? s.favoriteKeys : (prev.favoriteKeys || [])
                }));
            }
            setSyncStatus("☁️ Synced");
        } catch {
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
                setSyncStatus("☁️ Synced");
            }
        } catch {
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

    // PWA Detection and Installation Listeners
    useEffect(() => {
        const isStand = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
        setIsStandalone(isStand);

        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const handleAppInstalled = () => {
            setIsStandalone(true);
            setDeferredPrompt(null);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstall);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            try {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === "accepted") {
                    setDeferredPrompt(null);
                    setIsStandalone(true);
                }
            } catch {
                setShowIOSInstallModal(true);
            }
        } else {
            setShowIOSInstallModal(true);
        }
    };

    // Increment Japa Counter (Digital Mala)
    const incrementJapa = useCallback(() => {
        if (navigator.vibrate) navigator.vibrate(18);
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
    }, [playBellSound]);

    // Active names list for Fullscreen Nama Smaran (by Deity OR by Stotra OR All OR Favorites)
    const fsActiveNames = useMemo(() => {
        if (!state.sahasranamas || state.sahasranamas.length === 0) return [];
        if (fsSelectedSource === "favorites") {
            return allFavoriteNames;
        }
        if (fsSelectedSource === "all") {
            return state.sahasranamas.flatMap(col =>
                (col.names || []).map(n => ({
                    ...n,
                    collectionId: col.id,
                    collectionTitle: col.title,
                    collectionDeity: col.deity,
                    deity: col.deity
                }))
            );
        }
        if (fsSelectedSource.startsWith("deity:")) {
            const targetDeity = fsSelectedSource.replace("deity:", "");
            return state.sahasranamas
                .filter(col => col.deity === targetDeity)
                .flatMap(col =>
                    (col.names || []).map(n => ({
                        ...n,
                        collectionId: col.id,
                        collectionTitle: col.title,
                        collectionDeity: col.deity,
                        deity: col.deity
                    }))
                );
        }
        const colId = fsSelectedSource.startsWith("col:") ? fsSelectedSource.replace("col:", "") : fsSelectedSource;
        const col = state.sahasranamas.find(c => c.id === colId);
        if (!col || !col.names) return [];
        return col.names.map(n => ({
            ...n,
            collectionId: col.id,
            collectionTitle: col.title,
            collectionDeity: col.deity,
            deity: col.deity
        }));
    }, [state.sahasranamas, fsSelectedSource, allFavoriteNames]);

    const currentFsName = fsActiveNames.length > 0 ? fsActiveNames[fsNameIndex % fsActiveNames.length] : null;

    // Advance chant and name
    const handleChantAndNext = useCallback(() => {
        incrementJapa();
        if (fsActiveNames.length > 0) {
            if (fsRandomMode) {
                const nextRandom = Math.floor(Math.random() * fsActiveNames.length);
                setFsNameIndex(nextRandom);
            } else {
                setFsNameIndex(prev => (prev + 1) % fsActiveNames.length);
            }
        }
    }, [fsActiveNames.length, fsRandomMode, incrementJapa]);

    const handlePrevName = useCallback(() => {
        if (fsActiveNames.length > 0) {
            setFsNameIndex(prev => (prev - 1 + fsActiveNames.length) % fsActiveNames.length);
        }
    }, [fsActiveNames.length]);

    const handleNextName = useCallback(() => {
        if (fsActiveNames.length > 0) {
            if (fsRandomMode) {
                const nextRandom = Math.floor(Math.random() * fsActiveNames.length);
                setFsNameIndex(nextRandom);
            } else {
                setFsNameIndex(prev => (prev + 1) % fsActiveNames.length);
            }
        }
    }, [fsActiveNames.length, fsRandomMode]);

    // Keyboard navigation (Spacebar to chant, arrows to browse)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

            if (activeTab === "nama") {
                if (e.code === "Space") {
                    e.preventDefault();
                    handleChantAndNext();
                } else if (e.code === "ArrowRight") {
                    e.preventDefault();
                    handleNextName();
                } else if (e.code === "ArrowLeft") {
                    e.preventDefault();
                    handlePrevName();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeTab, handleChantAndNext, handleNextName, handlePrevName]);

    // Add Karma (Textbox is OPTIONAL: even if blank, entry is created)
    const addKarma = (customInputText, bhavaOverride) => {
        const text = (customInputText !== undefined ? customInputText : karmaInput).trim();
        const activeBhava = bhavaOverride || selectedBhava;
        const finalTitle = text || `${activeBhava.split("(")[0].trim()} Sankalpa`;

        const now = new Date();
        const newItem = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: finalTitle,
            bhava: activeBhava,
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

    // Category Management
    const handleAddBhavaCategory = () => {
        const cat = newBhavaCategory.trim();
        if (!cat) return;
        if (state.bhavaOptions.includes(cat)) {
            alert("Category already exists!");
            return;
        }
        setState(prev => ({
            ...prev,
            bhavaOptions: [...prev.bhavaOptions, cat]
        }));
        setNewBhavaCategory("");
    };

    const handleEditBhavaCategory = (index) => {
        setEditingBhavaIndex(index);
        setEditingBhavaValue(state.bhavaOptions[index]);
    };

    const handleSaveEditBhavaCategory = () => {
        const val = editingBhavaValue.trim();
        if (!val || editingBhavaIndex === null) return;
        setState(prev => {
            const updated = [...prev.bhavaOptions];
            updated[editingBhavaIndex] = val;
            return { ...prev, bhavaOptions: updated };
        });
        setEditingBhavaIndex(null);
        setEditingBhavaValue("");
    };

    const handleDeleteBhavaCategory = (catToDelete) => {
        if (state.bhavaOptions.length <= 1) {
            alert("At least one Bhava category must remain.");
            return;
        }
        setState(prev => ({
            ...prev,
            bhavaOptions: prev.bhavaOptions.filter(b => b !== catToDelete)
        }));
    };

    // Sahasranama Collection Helpers
    const handleAddCollection = () => {
        const title = newCollectionTitle.trim();
        const finalDeity = (selectedDeityChoice === "__new__" ? customDeityName.trim() : selectedDeityChoice) || "भगवान";
        if (!title) {
            alert("Please enter a title for the Sahasranama or Stotra.");
            return;
        }

        const newCol = {
            id: `col-${Date.now()}`,
            title,
            deity: finalDeity,
            names: []
        };

        setState(prev => ({
            ...prev,
            sahasranamas: [...prev.sahasranamas, newCol]
        }));
        setNewCollectionTitle("");
        setCustomDeityName("");
        setSelectedDeityChoice("श्री विष्णु");
        setShowAddCollectionModal(false);
    };

    const handleDeleteCollection = (id) => {
        if (!confirm("Are you sure you want to remove this Sahasranama / Stotra?")) return;
        setState(prev => ({
            ...prev,
            sahasranamas: prev.sahasranamas.filter(s => s.id !== id)
        }));
    };

    const handleAddManualName = () => {
        const name = newNameSanskrit.trim();
        if (!name || !targetCollectionId) return;

        const item = {
            id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            name,
            meaningHi: newNameMeaningHi.trim(),
            meaningEn: newNameMeaningEn.trim()
        };

        setState(prev => ({
            ...prev,
            sahasranamas: prev.sahasranamas.map(col =>
                col.id === targetCollectionId
                    ? { ...col, names: [...col.names, item] }
                    : col
            )
        }));

        setNewNameSanskrit("");
        setNewNameMeaningHi("");
        setNewNameMeaningEn("");
        setShowAddNameModal(false);
    };

    const handleDeleteName = (collectionId, nameId) => {
        setState(prev => ({
            ...prev,
            sahasranamas: prev.sahasranamas.map(col =>
                col.id === collectionId
                    ? { ...col, names: col.names.filter(n => n.id !== nameId) }
                    : col
            )
        }));
    };

    // CSV / Markdown Flexible Upload Parser
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const content = evt.target?.result;
            if (typeof content === "string") {
                setUploadRawText(content);
            }
        };
        reader.readAsText(file);
    };

    const parseAndImportContent = () => {
        if (!uploadTargetCollectionId) {
            alert("Please select a target Sahasranama / Stotra collection first.");
            return;
        }
        if (!uploadRawText.trim()) {
            alert("Please upload a file or paste content to import.");
            return;
        }

        const lines = uploadRawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const parsedNames = [];

        for (let line of lines) {
            if (/^\|?[-:\s|]+\|?$/.test(line)) continue;

            // 1. Markdown Table: | Name | Hindi | English |
            if (line.includes("|")) {
                const parts = line.split("|").map(p => p.trim()).filter(Boolean);
                if (parts.length >= 2) {
                    const name = parts[0].replace(/[*_#]/g, "");
                    if (["name", "naam", "नाम", "sanskrit"].includes(name.toLowerCase())) continue;
                    const meaningHi = parts[1] || "";
                    const meaningEn = parts[2] || "";
                    parsedNames.push({
                        id: `imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                        name,
                        meaningHi,
                        meaningEn
                    });
                    continue;
                }
            }

            // 2. Markdown List: - **Name**: Meaning
            const listMatch = line.match(/^[-*•\d.]+\s*(?:\*\*(.*?)\*\*|(.*?))\s*[:–—-]\s*(.*)$/);
            if (listMatch) {
                const name = (listMatch[1] || listMatch[2] || "").trim().replace(/[*_]/g, "");
                const fullMeaning = (listMatch[3] || "").trim();
                parsedNames.push({
                    id: `imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    name,
                    meaningHi: fullMeaning,
                    meaningEn: ""
                });
                continue;
            }

            // 3. CSV: Name, Hindi, English
            const csvCols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, "").trim());
            if (csvCols.length >= 2) {
                const name = csvCols[0];
                if (["name", "naam", "नाम"].includes(name.toLowerCase())) continue;
                parsedNames.push({
                    id: `imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    name,
                    meaningHi: csvCols[1] || "",
                    meaningEn: csvCols[2] || ""
                });
            } else if (csvCols.length === 1 && csvCols[0]) {
                parsedNames.push({
                    id: `imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    name: csvCols[0],
                    meaningHi: "",
                    meaningEn: ""
                });
            }
        }

        if (parsedNames.length === 0) {
            alert("Could not parse any valid names from the content. Please check formatting.");
            return;
        }

        setState(prev => ({
            ...prev,
            sahasranamas: prev.sahasranamas.map(col =>
                col.id === uploadTargetCollectionId
                    ? { ...col, names: [...col.names, ...parsedNames] }
                    : col
            )
        }));

        setUploadStatusMsg(`✓ Successfully imported ${parsedNames.length} names!`);
        setTimeout(() => {
            setUploadStatusMsg("");
            setShowUploadModal(false);
            setUploadRawText("");
        }, 1500);
    };

    // Review Subtab Names Filter
    const reviewFilteredNames = useMemo(() => {
        if (!state.sahasranamas || state.sahasranamas.length === 0) return [];
        if (reviewDeityFilter === "favorites") {
            return allFavoriteNames;
        }
        let pool = [];
        state.sahasranamas.forEach(col => {
            if (reviewDeityFilter === "all" || col.deity === reviewDeityFilter) {
                col.names.forEach(n => {
                    pool.push({
                        ...n,
                        collectionId: col.id,
                        collectionTitle: col.title,
                        deity: col.deity
                    });
                });
            }
        });
        return pool;
    }, [state.sahasranamas, reviewDeityFilter, allFavoriteNames]);

    const currentReviewItem = reviewFilteredNames.length > 0
        ? reviewFilteredNames[reviewIndex % reviewFilteredNames.length]
        : null;

    const nextReviewName = () => {
        if (reviewFilteredNames.length === 0) return;
        setShowReviewMeaning(false);
        if (reviewMode === "random") {
            const nextIdx = Math.floor(Math.random() * reviewFilteredNames.length);
            setReviewIndex(nextIdx);
        } else {
            setReviewIndex(i => (i + 1) % reviewFilteredNames.length);
        }
    };

    const prevReviewName = () => {
        if (reviewFilteredNames.length === 0) return;
        setShowReviewMeaning(false);
        setReviewIndex(i => (i - 1 + reviewFilteredNames.length) % reviewFilteredNames.length);
    };

    // MCQ Game Generator (Supports 'all', 'favorites', 'deity:...', or 'col:...')
    const generateQuizQuestion = useCallback((sourceOverride) => {
        const source = sourceOverride !== undefined ? sourceOverride : quizSourceFilter;
        let pool = [];

        if (source === "favorites") {
            pool = allFavoriteNames.filter(n => n.meaningHi || n.meaningEn);
        } else {
            state.sahasranamas.forEach(col => {
                let matches = false;
                if (source === "all") matches = true;
                else if (source.startsWith("deity:") && col.deity === source.replace("deity:", "")) matches = true;
                else if (source.startsWith("col:") && col.id === source.replace("col:", "")) matches = true;
                else if (col.id === source || col.deity === source) matches = true;

                if (matches) {
                    col.names.forEach(n => {
                        if (n.meaningHi || n.meaningEn) {
                            pool.push({
                                ...n,
                                collectionId: col.id,
                                collectionTitle: col.title,
                                deity: col.deity
                            });
                        }
                    });
                }
            });
        }

        if (pool.length < 2) {
            setQuizQuestion(null);
            return;
        }

        const correctIdx = Math.floor(Math.random() * pool.length);
        const correctItem = pool[correctIdx];

        let distractorIdx = Math.floor(Math.random() * pool.length);
        while (distractorIdx === correctIdx) {
            distractorIdx = Math.floor(Math.random() * pool.length);
        }
        const distractorItem = pool[distractorIdx];

        const options = Math.random() > 0.5
            ? [correctItem.name, distractorItem.name]
            : [distractorItem.name, correctItem.name];

        setQuizQuestion({
            collectionId: correctItem.collectionId,
            nameId: correctItem.id,
            meaning: correctItem.meaningHi || correctItem.meaningEn,
            meaningSecondary: correctItem.meaningHi && correctItem.meaningEn ? correctItem.meaningEn : "",
            correctName: correctItem.name,
            deity: correctItem.deity,
            collectionTitle: correctItem.collectionTitle,
            options,
            poolCount: pool.length
        });
        setQuizSelectedOption(null);
        setQuizAnswerChecked(false);
    }, [state.sahasranamas, quizSourceFilter, allFavoriteNames]);

    useEffect(() => {
        if (activeTab === "library" && librarySubTab === "quiz" && !quizQuestion) {
            generateQuizQuestion();
        }
    }, [activeTab, librarySubTab, quizQuestion, generateQuizQuestion]);

    const handleQuizOptionClick = (option) => {
        if (quizAnswerChecked || !quizQuestion) return;
        setQuizSelectedOption(option);
        setQuizAnswerChecked(true);

        if (option === quizQuestion.correctName) {
            playBellSound();
            setQuizScore(s => s + 1);
            setQuizStreak(s => s + 1);
            if (navigator.vibrate) navigator.vibrate(20);
        } else {
            setQuizStreak(0);
            if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
        }
    };

    const offeredCount = state.karmas.filter(k => k.offered).length;

    return (
        <div className={`app-wrapper ${ultraMinimal ? "ultra-minimal" : ""} ${isImmersiveMode ? "immersive-mode" : ""}`}>
            {/* Minimal App Header */}
            <header className="app-header">
                <div className="deity-title">
                    <span>{state.deityName}</span>
                </div>

                <div className="header-pills-row">
                    {!isStandalone && (
                        <div className="install-pill" onClick={handleInstallClick} title="Install as Web App">
                            <span>📲</span>
                            <span>Install App</span>
                        </div>
                    )}
                    <div
                        className={`nudge-pill ${ultraMinimal ? "active" : ""}`}
                        onClick={toggleUltraMinimal}
                        title="Toggle Ultra-Minimal mode to remove all clutter"
                    >
                        <span>✨</span>
                        <span>Minimal: {ultraMinimal ? "ON" : "OFF"}</span>
                    </div>
                    <div className="nudge-pill standard-only" onClick={() => { playBellSound(); setShowModal(true); }}>
                        <span>🔔</span>
                        <span>{state.nudgeInterval > 0 ? `${state.nudgeInterval}m` : "Smaran"}</span>
                    </div>
                    <div className="nudge-pill" onClick={() => pullFromCloud(state.syncKey)}>
                        <span>{syncStatus}</span>
                    </div>
                </div>
            </header>

            <main className="app-main">
                {/* ========================================================
                    TAB 1: FULLSCREEN NAMA SMARAN & JAPA CHANTING (DEFAULT)
                    Fits 100% into mobile viewport with ZERO vertical scrolling
                   ======================================================== */}
                {activeTab === "nama" && (
                    <section className="tab-pane active">
                        <div className="fullscreen-nama-view">
                            {/* Top Floating Controls */}
                            <div className="nama-top-bar">
                                <select
                                    className="nama-collection-select"
                                    value={fsSelectedSource}
                                    onChange={e => {
                                        setFsSelectedSource(e.target.value);
                                        setFsNameIndex(0);
                                    }}
                                    title="Choose Deity or Sahasranama source"
                                >
                                    <option value="all">✨ All Sahasranamas (Combined)</option>
                                    <option value="favorites">❤️ My Favorite Names ({allFavoriteNames.length})</option>
                                    <optgroup label="🔱 Filter by Deity">
                                        {allDeities.map(d => (
                                            <option key={`deity:${d}`} value={`deity:${d}`}>
                                                🔱 {d} (All Names)
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="📖 Specific Sahasranamas / Stotras">
                                        {state.sahasranamas.map(col => (
                                            <option key={`col:${col.id}`} value={`col:${col.id}`}>
                                                📖 {col.title} ({col.names.length})
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>

                                <div className="nama-bead-badge" title="Live 108 bead counter">
                                    <span>📿</span>
                                    <span>{state.currentBead}/108</span>
                                </div>

                                <button
                                    className="nama-icon-btn"
                                    onClick={() => setFsShowMeaning(s => !s)}
                                    title="Toggle Hindi/English Meaning"
                                >
                                    <span>{fsShowMeaning ? "👁️ Hide" : "👁️ Meaning"}</span>
                                </button>

                                <button
                                    className="nama-icon-btn"
                                    onClick={toggleImmersive}
                                    title="Toggle Immersive Fullscreen"
                                >
                                    <span>{isImmersiveMode ? "🗗" : "⛶"}</span>
                                </button>
                            </div>

                            {/* Center Tap-Anywhere Sacred Canvas */}
                            <div
                                className="sacred-chant-canvas"
                                onClick={handleChantAndNext}
                                title="Tap anywhere to chant & advance"
                            >
                                {currentFsName && (
                                    <button
                                        className={`floating-sacred-heart ${isNameFavorited(currentFsName.collectionId, currentFsName.name) ? "active" : ""}`}
                                        onClick={(e) => toggleFavoriteName(currentFsName.collectionId, currentFsName.name, e)}
                                        title={isNameFavorited(currentFsName.collectionId, currentFsName.name) ? "Favorited (Tap to remove)" : "Add to Favorites"}
                                        aria-label="Favorite Name"
                                    >
                                        <span>{isNameFavorited(currentFsName.collectionId, currentFsName.name) ? "❤️" : "🤍"}</span>
                                    </button>
                                )}

                                {fsSelectedSource === "favorites" && fsActiveNames.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "24px 12px" }}>
                                        <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>🤍</div>
                                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--saffron)", marginBottom: "6px" }}>
                                            No Favorite Names Yet
                                        </div>
                                        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                                            Tap the floating ❤️ on any name in <strong>Nama Smaran</strong>, <strong>Flashcards</strong>, or the <strong>Quiz</strong> to add favorites here!
                                        </div>
                                        <button
                                            className="btn btn-small"
                                            onClick={(e) => { e.stopPropagation(); setFsSelectedSource("all"); }}
                                        >
                                            Chant All Names
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="sacred-meta-row">
                                            <span>{currentFsName ? currentFsName.collectionTitle : state.deityName}</span>
                                            {fsActiveNames.length > 0 && (
                                                <span>• {(fsNameIndex % fsActiveNames.length) + 1} / {fsActiveNames.length}</span>
                                            )}
                                        </div>

                                        <div className="sacred-name-text">
                                            {currentFsName ? currentFsName.name : state.mantra}
                                        </div>

                                        {fsShowMeaning && currentFsName && (
                                            <div
                                                className="sacred-meaning-box"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {currentFsName.meaningHi && (
                                                    <div className="sacred-meaning-hi">{currentFsName.meaningHi}</div>
                                                )}
                                                {currentFsName.meaningEn && (
                                                    <div className="sacred-meaning-en">{currentFsName.meaningEn}</div>
                                                )}
                                            </div>
                                        )}

                                        <div className="sacred-tap-prompt">
                                            Tap anywhere to count bead & advance ({fsRandomMode ? "Random" : "Sequential"})
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Bottom Controls */}
                            <div className="sacred-bottom-panel">
                                <div className="sacred-controls-row">
                                    <button
                                        className="btn-nav-circle"
                                        onClick={e => { e.stopPropagation(); handlePrevName(); }}
                                        title="Previous Name"
                                    >
                                        ◀
                                    </button>

                                    <button
                                        className="btn-chant-primary"
                                        onClick={e => { e.stopPropagation(); handleChantAndNext(); }}
                                        title="Chant & count bead (Spacebar also works)"
                                    >
                                        <span>📿</span>
                                        <span>Chant & Next</span>
                                    </button>

                                    <button
                                        className="btn-nav-circle"
                                        onClick={e => { e.stopPropagation(); handleNextName(); }}
                                        title="Next Name"
                                    >
                                        ▶
                                    </button>
                                </div>

                                <div className="sacred-sub-stats">
                                    <span>Today: <strong>{state.todayMalas}</strong> Malas</span>
                                    <span>•</span>
                                    <span>Total: <strong>{state.totalJapa}</strong></span>
                                    <span>•</span>
                                    <button
                                        style={{ background: "none", border: "none", color: "var(--saffron)", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600 }}
                                        onClick={() => setState(s => ({ ...s, currentBead: 0 }))}
                                    >
                                        Reset Bead
                                    </button>
                                    <span>•</span>
                                    <button
                                        style={{ background: "none", border: "none", color: fsRandomMode ? "var(--saffron)" : "var(--text-muted)", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600 }}
                                        onClick={() => setFsRandomMode(r => !r)}
                                    >
                                        {fsRandomMode ? "🔀 Random" : "➡️ Seq"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ========================================================
                    TAB 2: KARMA YOGA (SCROLLABLE)
                   ======================================================== */}
                {activeTab === "karma" && (
                    <section className="tab-pane active scrollable">
                        {/* Gita Shloka (hidden in ultra-minimal mode) */}
                        <div className="shloka-box standard-only">
                            <div className="shloka-sanskrit">
                                यत्करोषि यदश्नासि यज्जुहोषि ददासि यत् । यत्तपस्यसि कौन्तेय तत्कुरुष्व मदर्पणम् ॥
                            </div>
                            <div className="shloka-meaning">
                                Whatever you do, whatever you offer or give away—dedicate that unto Me. (Gita 9.27)
                            </div>
                        </div>

                        {/* Dedicated Action Input Card */}
                        <div className="card">
                            <div className="card-title">{t.lblNewSankalpa}</div>
                            <div className="card-desc standard-only">{t.descNewSankalpa}</div>

                            <div className="input-group">
                                <input
                                    type="text"
                                    value={karmaInput}
                                    onChange={e => setKarmaInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && addKarma()}
                                    placeholder="Action name (e.g., Office task, Cooking, Service... Optional)"
                                />
                            </div>

                            <label style={{ marginBottom: "5px" }}>{t.lblSelectBhava}</label>
                            <div className="bhava-chips">
                                {state.bhavaOptions.map(b => (
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

                            <button className="btn" onClick={() => addKarma()}>
                                🙏 {t.btnBeginKarma}
                            </button>
                        </div>

                        {/* Today's Offerings List */}
                        <div className="card">
                            <div className="card-title">
                                <span>{t.lblTodaysYajna}</span>
                                <span style={{ fontSize: "0.8rem", color: "var(--saffron)", fontWeight: 700 }}>
                                    {offeredCount} / {state.karmas.length} Offered
                                </span>
                            </div>
                            <div className="card-desc standard-only">{t.descTodaysYajna}</div>

                            {state.karmas.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                                    No tasks logged today yet. Dedicate your current action above to begin.
                                </div>
                            ) : (
                                state.karmas.map(item => (
                                    <div key={item.id} className={`karma-item ${item.offered ? "offered" : ""}`}>
                                        <div className="karma-top">
                                            <div className="karma-title">{item.title}</div>
                                            <span className="karma-bhava-tag">{item.bhava}</span>
                                        </div>
                                        <div className="karma-bottom">
                                            <span>🕒 {item.time}</span>
                                            {item.offered ? (
                                                <span style={{ color: "var(--success)", fontWeight: 700 }}>
                                                    ✓ {state.arpanamWord}
                                                </span>
                                            ) : (
                                                <button
                                                    className="btn btn-secondary btn-small"
                                                    onClick={() => offerKarma(item.id)}
                                                >
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

                {/* ========================================================
                    TAB 3: SAHASRANAMA LIBRARY & REVIEW (SCROLLABLE)
                   ======================================================== */}
                {activeTab === "library" && (
                    <section className="tab-pane active scrollable">
                        {/* Subtab Switcher */}
                        <div className="subtab-bar">
                            <button
                                className={`subtab-btn ${librarySubTab === "collections" ? "active" : ""}`}
                                onClick={() => setLibrarySubTab("collections")}
                            >
                                <span>📚</span>
                                <span>Collections</span>
                            </button>
                            <button
                                className={`subtab-btn ${librarySubTab === "favorites" ? "active" : ""}`}
                                onClick={() => setLibrarySubTab("favorites")}
                            >
                                <span>❤️</span>
                                <span>Favorites ({allFavoriteNames.length})</span>
                            </button>
                            <button
                                className={`subtab-btn ${librarySubTab === "review" ? "active" : ""}`}
                                onClick={() => { setLibrarySubTab("review"); setReviewIndex(0); setShowReviewMeaning(false); }}
                            >
                                <span>🎴</span>
                                <span>Flashcards</span>
                            </button>
                            <button
                                className={`subtab-btn ${librarySubTab === "quiz" ? "active" : ""}`}
                                onClick={() => { setLibrarySubTab("quiz"); generateQuizQuestion(); }}
                            >
                                <span>🎮</span>
                                <span>Quiz Game</span>
                            </button>
                        </div>

                        {/* SUBTAB 1: COLLECTIONS LIST */}
                        {librarySubTab === "collections" && (
                            <div>
                                <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                                    <button
                                        className="btn btn-small"
                                        style={{ flex: 1 }}
                                        onClick={() => setShowAddCollectionModal(true)}
                                    >
                                        ➕ Add Sahasranama / Stotra
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-small"
                                        style={{ flex: 1 }}
                                        onClick={() => {
                                            if (state.sahasranamas.length > 0) {
                                                setUploadTargetCollectionId(state.sahasranamas[0].id);
                                            }
                                            setShowUploadModal(true);
                                        }}
                                    >
                                        📥 Upload CSV / Markdown
                                    </button>
                                </div>

                                {state.sahasranamas.map(col => {
                                    const isExpanded = expandedCollectionId === col.id;
                                    return (
                                        <div key={col.id} className="collection-card">
                                            <div
                                                className="collection-header"
                                                onClick={() => setExpandedCollectionId(isExpanded ? null : col.id)}
                                            >
                                                <div>
                                                    <div className="collection-title">{col.title}</div>
                                                    <div className="collection-meta">
                                                        Deity: {col.deity} • {col.names.length} Names
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                                    <button
                                                        className="btn btn-small"
                                                        style={{ padding: "4px 8px", fontSize: "0.74rem" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFsSelectedSource(`col:${col.id}`);
                                                            setActiveTab("nama");
                                                            setFsNameIndex(0);
                                                        }}
                                                        title="Chant this collection"
                                                    >
                                                        📿 Chant
                                                    </button>
                                                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                                        {isExpanded ? "▲" : "▼"}
                                                    </span>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div style={{ marginTop: "10px", borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
                                                    <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                                                        <button
                                                            className="btn btn-small"
                                                            style={{ padding: "3px 8px" }}
                                                            onClick={() => {
                                                                setTargetCollectionId(col.id);
                                                                setShowAddNameModal(true);
                                                            }}
                                                        >
                                                            ➕ Add Name
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary btn-small"
                                                            style={{ padding: "3px 8px" }}
                                                            onClick={() => {
                                                                setUploadTargetCollectionId(col.id);
                                                                setShowUploadModal(true);
                                                            }}
                                                        >
                                                            📥 Import
                                                        </button>
                                                        <button
                                                            className="icon-action-btn delete"
                                                            style={{ marginLeft: "auto" }}
                                                            onClick={() => handleDeleteCollection(col.id)}
                                                            title="Delete Collection"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>

                                                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                                        {col.names.length === 0 ? (
                                                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center", padding: "8px" }}>
                                                                No names added yet. Click 'Add Name' or 'Import' above.
                                                            </div>
                                                        ) : (
                                                            col.names.map(nameItem => (
                                                                <div
                                                                    key={nameItem.id}
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "space-between",
                                                                        alignItems: "center",
                                                                        padding: "5px 6px",
                                                                        borderBottom: "1px solid var(--border-light)",
                                                                        fontSize: "0.8rem"
                                                                    }}
                                                                >
                                                                    <div>
                                                                        <strong style={{ color: "var(--saffron)", marginRight: "6px" }}>{nameItem.name}</strong>
                                                                        <span style={{ color: "var(--text-secondary)" }}>{nameItem.meaningHi || nameItem.meaningEn}</span>
                                                                    </div>
                                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                                        <button
                                                                            className="icon-action-btn"
                                                                            onClick={(e) => toggleFavoriteName(col.id, nameItem.name, e)}
                                                                            title={isNameFavorited(col.id, nameItem.name) ? "Favorited (Tap to remove)" : "Add to favorites"}
                                                                            style={{ fontSize: "0.85rem", color: isNameFavorited(col.id, nameItem.name) ? "#ff4757" : "var(--text-muted)" }}
                                                                        >
                                                                            {isNameFavorited(col.id, nameItem.name) ? "❤️" : "🤍"}
                                                                        </button>
                                                                        <button
                                                                            className="icon-action-btn delete"
                                                                            onClick={() => handleDeleteName(col.id, nameItem.id)}
                                                                            title="Delete Name"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* SUBTAB: FAVORITES LIST */}
                        {librarySubTab === "favorites" && (
                            <div className="card">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
                                    <div>
                                        <div className="card-title" style={{ margin: 0 }}>❤️ My Favorite Names</div>
                                        <div className="card-desc" style={{ fontSize: "0.74rem", margin: "2px 0 0" }}>
                                            {allFavoriteNames.length} names selected across all Sahasranamas & Stotras
                                        </div>
                                    </div>
                                    {allFavoriteNames.length > 0 && (
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            <button
                                                className="btn btn-small"
                                                onClick={() => {
                                                    setFsSelectedSource("favorites");
                                                    setActiveTab("nama");
                                                    setFsNameIndex(0);
                                                }}
                                                title="Chant only favorite names"
                                            >
                                                📿 Chant
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-small"
                                                onClick={() => {
                                                    setQuizSourceFilter("favorites");
                                                    setLibrarySubTab("quiz");
                                                    generateQuizQuestion("favorites");
                                                }}
                                                title="Play quiz on favorite names"
                                            >
                                                🎮 Quiz
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {allFavoriteNames.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "24px 12px", color: "var(--text-muted)" }}>
                                        <div style={{ fontSize: "2rem", marginBottom: "6px" }}>🤍</div>
                                        <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text-primary)" }}>No Favorites Yet</div>
                                        <div style={{ fontSize: "0.78rem", marginTop: "4px" }}>
                                            Tap the floating heart (❤️) on any name in Nama Smaran chanting, Flashcards, or the Quiz to add it to your sacred favorites list.
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                                        {allFavoriteNames.map((n, idx) => (
                                            <div key={idx} className="favorite-name-item">
                                                <div style={{ flex: 1, minWidth: 0, paddingRight: "8px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <strong style={{ color: "var(--saffron)", fontSize: "0.94rem" }}>{n.name}</strong>
                                                        <span style={{ fontSize: "0.68rem", background: "var(--bg-accent)", padding: "1px 6px", borderRadius: "10px", color: "var(--text-muted)" }}>
                                                            {n.deity || n.collectionTitle}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                                                        {n.meaningHi || n.meaningEn}
                                                    </div>
                                                </div>
                                                <button
                                                    className="icon-action-btn"
                                                    onClick={(e) => toggleFavoriteName(n.collectionId, n.name, e)}
                                                    title="Remove from favorites"
                                                    style={{ fontSize: "1rem", color: "#ff4757" }}
                                                >
                                                    ❤️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SUBTAB 2: FLASHCARD REVIEW */}
                        {librarySubTab === "review" && (
                            <div className="card">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
                                    <div className="card-title" style={{ margin: 0 }}>🎴 Flashcard Review</div>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <select
                                            value={reviewDeityFilter}
                                            onChange={e => { setReviewDeityFilter(e.target.value); setReviewIndex(0); }}
                                            style={{ padding: "4px 6px", fontSize: "0.76rem" }}
                                        >
                                            <option value="all">All Deities</option>
                                            <option value="favorites">❤️ Favorites ({allFavoriteNames.length})</option>
                                            {allDeities.map(d => (
                                                <option key={d} value={d}>🔱 {d}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={reviewMode}
                                            onChange={e => { setReviewMode(e.target.value); setReviewIndex(0); }}
                                            style={{ padding: "4px 6px", fontSize: "0.76rem" }}
                                        >
                                            <option value="sequential">Sequential</option>
                                            <option value="random">Random</option>
                                        </select>
                                    </div>
                                </div>

                                {currentReviewItem ? (
                                    <div>
                                        <div
                                            className="sacred-chant-canvas"
                                            onClick={() => setShowReviewMeaning(s => !s)}
                                            style={{ minHeight: "200px", marginBottom: "10px" }}
                                        >
                                            <button
                                                className={`floating-sacred-heart ${isNameFavorited(currentReviewItem.collectionId, currentReviewItem.name) ? "active" : ""}`}
                                                onClick={(e) => toggleFavoriteName(currentReviewItem.collectionId, currentReviewItem.name, e)}
                                                title={isNameFavorited(currentReviewItem.collectionId, currentReviewItem.name) ? "Favorited (Tap to remove)" : "Add to Favorites"}
                                                aria-label="Favorite Name"
                                            >
                                                <span>{isNameFavorited(currentReviewItem.collectionId, currentReviewItem.name) ? "❤️" : "🤍"}</span>
                                            </button>

                                            <div className="sacred-meta-row">
                                                <span>{currentReviewItem.collectionTitle}</span>
                                                <span>• {(reviewIndex % reviewFilteredNames.length) + 1} / {reviewFilteredNames.length}</span>
                                            </div>

                                            <div className="sacred-name-text">
                                                {currentReviewItem.name}
                                            </div>

                                            {showReviewMeaning ? (
                                                <div className="sacred-meaning-box">
                                                    {currentReviewItem.meaningHi && (
                                                        <div className="sacred-meaning-hi">{currentReviewItem.meaningHi}</div>
                                                    )}
                                                    {currentReviewItem.meaningEn && (
                                                        <div className="sacred-meaning-en">{currentReviewItem.meaningEn}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="sacred-tap-prompt">Tap card to reveal meaning</div>
                                            )}
                                        </div>

                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button className="btn btn-secondary" onClick={prevReviewName}>
                                                ◀ Previous
                                            </button>
                                            <button className="btn" onClick={nextReviewName}>
                                                Next Name ▶
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)" }}>
                                        No names found for the selected filter.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SUBTAB 3: MCQ REMINDER GAME WITH SOURCE SELECTOR */}
                        {librarySubTab === "quiz" && (
                            <div className="quiz-card">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                    <div>
                                        <div className="card-title" style={{ margin: 0 }}>🎮 Nama Reminder Game</div>
                                        <div className="quiz-subtitle" style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                                            Identify Bhagwan's Name from the Divine Meaning
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "5px" }}>
                                        <div className="score-badge">⭐ {quizScore}</div>
                                        <div className="score-badge">🔥 {quizStreak}</div>
                                    </div>
                                </div>

                                {/* DEITY / STOTRA CHOOSER FOR QUIZ */}
                                <div className="quiz-source-bar" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "10px 0 12px", background: "var(--bg-accent)", padding: "6px 10px", borderRadius: "var(--radius-sm)" }}>
                                    <label style={{ margin: 0, fontSize: "0.76rem", fontWeight: 700, color: "var(--saffron)", whiteSpace: "nowrap" }}>
                                        🎯 Play From:
                                    </label>
                                    <select
                                        value={quizSourceFilter}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setQuizSourceFilter(val);
                                            generateQuizQuestion(val);
                                        }}
                                        style={{ flex: 1, padding: "4px 8px", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}
                                    >
                                        <option value="all">✨ All Sahasranamas & Deities</option>
                                        <option value="favorites">❤️ My Favorite Names Only ({allFavoriteNames.length} names)</option>
                                        <optgroup label="🔱 Filter by Deity">
                                            {allDeities.map(d => (
                                                <option key={`deity:${d}`} value={`deity:${d}`}>
                                                    🔱 {d} (All stotras)
                                                </option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="📖 Specific Sahasranama / Stotra">
                                            {state.sahasranamas.map(col => (
                                                <option key={`col:${col.id}`} value={`col:${col.id}`}>
                                                    📖 {col.title} ({col.names.length} names)
                                                </option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>

                                {quizQuestion ? (
                                    <div>
                                        <div className="quiz-question-box">
                                            <button
                                                className={`floating-sacred-heart ${isNameFavorited(quizQuestion.collectionId, quizQuestion.correctName) ? "active" : ""}`}
                                                onClick={(e) => toggleFavoriteName(quizQuestion.collectionId, quizQuestion.correctName, e)}
                                                title={isNameFavorited(quizQuestion.collectionId, quizQuestion.correctName) ? "Favorited (Tap to remove)" : "Add to Favorites"}
                                                aria-label="Favorite this Name"
                                            >
                                                <span>{isNameFavorited(quizQuestion.collectionId, quizQuestion.correctName) ? "❤️" : "🤍"}</span>
                                            </button>
                                            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginBottom: "3px" }}>
                                                {quizQuestion.collectionTitle} ({quizQuestion.deity})
                                            </div>
                                            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.35 }}>
                                                "{quizQuestion.meaning}"
                                            </div>
                                            {quizQuestion.meaningSecondary && (
                                                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontStyle: "italic", marginTop: "3px" }}>
                                                    ({quizQuestion.meaningSecondary})
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            {quizQuestion.options.map((opt, i) => {
                                                let btnClass = "quiz-option-btn";
                                                if (quizAnswerChecked) {
                                                    if (opt === quizQuestion.correctName) btnClass += " correct";
                                                    else if (opt === quizSelectedOption) btnClass += " wrong";
                                                }
                                                return (
                                                    <button
                                                        key={i}
                                                        className={btnClass}
                                                        onClick={() => handleQuizOptionClick(opt)}
                                                    >
                                                        <span>{opt}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {quizAnswerChecked && (
                                            <div style={{ textAlign: "center", marginTop: "10px" }}>
                                                <button className="btn" onClick={() => generateQuizQuestion()}>
                                                    Next Question ▶
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "center", padding: "18px", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                                        {quizSourceFilter === "favorites" ? (
                                            <span>
                                                ❤️ You need at least 2 favorited names with meanings to play the Quiz in Favorites mode.<br/>
                                                <span style={{ fontSize: "0.76rem" }}>
                                                    Tap the floating ❤️ on any name in <strong>Nama Smaran</strong>, <strong>Flashcards</strong>, or the <strong>Stotra Library</strong> to add favorites!
                                                </span>
                                            </span>
                                        ) : (
                                            "Not enough names with meanings found for this filter. Please choose another Deity/Stotram or add more names!"
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* ========================================================
                    TAB 4: SETTINGS & CUSTOMIZATION (SCROLLABLE)
                   ======================================================== */}
                {activeTab === "settings" && (
                    <section className="tab-pane active scrollable">
                        {/* Ultra-Minimal Mode Option */}
                        <div className="card">
                            <div className="card-title">
                                <span>✨ Ultra-Minimal Mode</span>
                                <input
                                    type="checkbox"
                                    checked={ultraMinimal}
                                    onChange={toggleUltraMinimal}
                                    style={{ width: "18px", height: "18px", accentColor: "var(--saffron)", cursor: "pointer" }}
                                />
                            </div>
                            <div className="card-desc">
                                When enabled, all secondary quotes, long descriptions, and verbose helper text are hidden across all screens, keeping ONLY the direct action visible.
                            </div>
                        </div>

                        {/* PWA Install Card */}
                        <div className="card install-card-highlight">
                            <div className="card-title">
                                <span>📲 Install Nitya Smaran as App (PWA)</span>
                                <span style={{ fontSize: "0.76rem", color: isStandalone ? "var(--success)" : "var(--saffron)", fontWeight: 700 }}>
                                    {isStandalone ? "✓ Installed" : "Installable"}
                                </span>
                            </div>
                            <div className="card-desc">
                                Install on your smartphone (iPhone / Android) or computer. Runs in full-screen standalone mode with offline support, instant launch, and haptic feedback like a native app.
                            </div>
                            {!isStandalone ? (
                                <button className="btn" onClick={handleInstallClick} style={{ marginTop: "4px" }}>
                                    📲 Install App on this Device
                                </button>
                            ) : (
                                <div style={{ color: "var(--success)", fontWeight: 600, fontSize: "0.82rem" }}>
                                    ✓ You are currently running Nitya Smaran in installed standalone mode.
                                </div>
                            )}
                        </div>

                        {/* Deity & Mantra Presets */}
                        <div className="card">
                            <div className="card-title">🙏 Deity & Mantra Preset</div>
                            <div className="card-desc standard-only">Select your Ishta Devata to customize the divine focus.</div>

                            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>
                                {Object.entries(PRESETS).map(([key, p]) => (
                                    <button
                                        key={key}
                                        className="btn btn-secondary btn-small"
                                        onClick={() => setState(s => ({ ...s, deityName: p.deityName, mantra: p.mantra, arpanamWord: p.arpanamWord }))}
                                    >
                                        {p.deityName.split(" ")[0]} {p.deityName.split(" ")[1]}
                                    </button>
                                ))}
                            </div>

                            <div className="input-group">
                                <label>Deity Name:</label>
                                <input
                                    type="text"
                                    value={state.deityName}
                                    onChange={e => setState(s => ({ ...s, deityName: e.target.value }))}
                                />
                            </div>

                            <div className="input-group">
                                <label>Mantra / Mahamantra:</label>
                                <input
                                    type="text"
                                    value={state.mantra}
                                    onChange={e => setState(s => ({ ...s, mantra: e.target.value }))}
                                />
                            </div>

                            <div className="input-group">
                                <label>Arpanam Offering Word:</label>
                                <input
                                    type="text"
                                    value={state.arpanamWord}
                                    onChange={e => setState(s => ({ ...s, arpanamWord: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Manage Bhava Categories */}
                        <div className="card">
                            <div className="card-title">
                                <span>🌺 Manage Bhava Categories</span>
                            </div>
                            <div className="card-desc standard-only">
                                Customize the attitudes you anchor before starting an action. Add, edit, or remove your personal Bhavas.
                            </div>

                            <div style={{ marginBottom: "10px" }}>
                                {state.bhavaOptions.map((bhava, index) => (
                                    <div key={index} className="category-manage-item">
                                        {editingBhavaIndex === index ? (
                                            <div style={{ display: "flex", gap: "5px", width: "100%" }}>
                                                <input
                                                    type="text"
                                                    value={editingBhavaValue}
                                                    onChange={e => setEditingBhavaValue(e.target.value)}
                                                    style={{ flex: 1, padding: "4px 6px" }}
                                                />
                                                <button className="btn btn-small" onClick={handleSaveEditBhavaCategory}>Save</button>
                                                <button className="btn btn-secondary btn-small" onClick={() => setEditingBhavaIndex(null)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{bhava}</span>
                                                <div style={{ display: "flex", gap: "4px" }}>
                                                    <button
                                                        className="icon-action-btn"
                                                        title="Edit category"
                                                        onClick={() => handleEditBhavaCategory(index)}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="icon-action-btn delete"
                                                        title="Delete category"
                                                        onClick={() => handleDeleteBhavaCategory(bhava)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: "flex", gap: "5px" }}>
                                <input
                                    type="text"
                                    value={newBhavaCategory}
                                    onChange={e => setNewBhavaCategory(e.target.value)}
                                    placeholder="e.g., Sharanagati Bhava (Surrender)"
                                    style={{ flex: 1 }}
                                />
                                <button className="btn btn-small" onClick={handleAddBhavaCategory}>
                                    ➕ Add
                                </button>
                            </div>
                        </div>

                        {/* Smaran Bell Interval & Theme */}
                        <div className="card">
                            <div className="card-title">🔔 Temple Bell Nudge & Theme</div>

                            <div className="input-group">
                                <label>Remembrance Bell Interval (Minutes):</label>
                                <select
                                    value={state.nudgeInterval}
                                    onChange={e => setState(s => ({ ...s, nudgeInterval: Number(e.target.value) }))}
                                >
                                    <option value={0}>Off (Manual only)</option>
                                    <option value={5}>Every 5 Minutes</option>
                                    <option value={15}>Every 15 Minutes</option>
                                    <option value={30}>Every 30 Minutes</option>
                                    <option value={60}>Every 60 Minutes (Hourly)</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Visual Aesthetic Theme:</label>
                                <select
                                    value={state.theme}
                                    onChange={e => setState(s => ({ ...s, theme: e.target.value }))}
                                >
                                    <option value="light">Sacred Ashram (Warm Ivory & Gold)</option>
                                    <option value="dark">Temple Midnight (OLED Dark & Amber)</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Cloudflare D1 Sync Key:</label>
                                <input
                                    type="text"
                                    value={state.syncKey}
                                    onChange={e => setState(s => ({ ...s, syncKey: e.target.value }))}
                                />
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* ========================================================
                COMPACT BOTTOM NAVIGATION DOCK (ZERO BOTTOM VOID)
               ======================================================== */}
            <nav className="bottom-dock">
                <button
                    className={`dock-item ${activeTab === "nama" ? "active" : ""}`}
                    onClick={() => setActiveTab("nama")}
                >
                    <span className="dock-icon">📿</span>
                    <span>{t.navNama}</span>
                </button>
                <button
                    className={`dock-item ${activeTab === "karma" ? "active" : ""}`}
                    onClick={() => setActiveTab("karma")}
                >
                    <span className="dock-icon">🌺</span>
                    <span>{t.navKarma}</span>
                </button>
                <button
                    className={`dock-item ${activeTab === "library" ? "active" : ""}`}
                    onClick={() => setActiveTab("library")}
                >
                    <span className="dock-icon">📚</span>
                    <span>{t.navLibrary}</span>
                </button>
                <button
                    className={`dock-item ${activeTab === "settings" ? "active" : ""}`}
                    onClick={() => setActiveTab("settings")}
                >
                    <span className="dock-icon">⚙️</span>
                    <span>{t.navSettings}</span>
                </button>
            </nav>

            {/* ========================================================
                MODALS: ADD COLLECTION (WITH DEITY DROPDOWN), ADD NAME, UPLOAD
               ======================================================== */}

            {/* Modal: Add Collection with Deity Dropdown & Add New Option */}
            {showAddCollectionModal && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowAddCollectionModal(false)}>
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <div className="modal-title">➕ Add Sahasranama / Stotra</div>
                            <button className="modal-close-btn" onClick={() => setShowAddCollectionModal(false)}>✕</button>
                        </div>
                        <div className="input-group">
                            <label>Title (with Devanagari/English):</label>
                            <input
                                type="text"
                                value={newCollectionTitle}
                                onChange={e => setNewCollectionTitle(e.target.value)}
                                placeholder="e.g., श्री ललिता सहस्रनाम (Lalita Sahasranama)"
                            />
                        </div>
                        <div className="input-group">
                            <label>Deity (Select existing or add new):</label>
                            <select
                                value={selectedDeityChoice}
                                onChange={e => setSelectedDeityChoice(e.target.value)}
                                style={{ marginBottom: selectedDeityChoice === "__new__" ? "6px" : "0" }}
                            >
                                {allDeities.map(d => (
                                    <option key={d} value={d}>🔱 {d}</option>
                                ))}
                                <option value="__new__">➕ Add New Deity...</option>
                            </select>

                            {selectedDeityChoice === "__new__" && (
                                <input
                                    type="text"
                                    value={customDeityName}
                                    onChange={e => setCustomDeityName(e.target.value)}
                                    placeholder="Type new Deity name (e.g., सूर्य देव, दत्तात्रेय)"
                                    autoFocus
                                />
                            )}
                        </div>
                        <button className="btn" onClick={handleAddCollection}>
                            Create Sahasranama
                        </button>
                    </div>
                </div>
            )}

            {/* Modal: Add Individual Name */}
            {showAddNameModal && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowAddNameModal(false)}>
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <div className="modal-title">➕ Add Divine Name</div>
                            <button className="modal-close-btn" onClick={() => setShowAddNameModal(false)}>✕</button>
                        </div>
                        <div className="input-group">
                            <label>Divine Name (in Sanskrit / Devanagari):</label>
                            <input
                                type="text"
                                value={newNameSanskrit}
                                onChange={e => setNewNameSanskrit(e.target.value)}
                                placeholder="e.g., दामोदरः"
                            />
                        </div>
                        <div className="input-group">
                            <label>Meaning in Hindi (अर्थ):</label>
                            <input
                                type="text"
                                value={newNameMeaningHi}
                                onChange={e => setNewNameMeaningHi(e.target.value)}
                                placeholder="e.g., यशोदा मैया ने जिनके उदर में रस्सी बाँधी थी"
                            />
                        </div>
                        <div className="input-group">
                            <label>Meaning in English:</label>
                            <input
                                type="text"
                                value={newNameMeaningEn}
                                onChange={e => setNewNameMeaningEn(e.target.value)}
                                placeholder="e.g., Bound by the rope of motherly love"
                            />
                        </div>
                        <button className="btn" onClick={handleAddManualName}>
                            Save Name to Sahasranama
                        </button>
                    </div>
                </div>
            )}

            {/* Modal: Upload CSV or Markdown */}
            {showUploadModal && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowUploadModal(false)}>
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <div className="modal-title">📥 Upload CSV or Markdown</div>
                            <button className="modal-close-btn" onClick={() => setShowUploadModal(false)}>✕</button>
                        </div>

                        <div className="input-group">
                            <label>Target Sahasranama / Stotra:</label>
                            <select
                                value={uploadTargetCollectionId}
                                onChange={e => setUploadTargetCollectionId(e.target.value)}
                            >
                                {state.sahasranamas.map(col => (
                                    <option key={col.id} value={col.id}>{col.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <input type="file" accept=".csv,.md,.txt" onChange={handleFileUpload} />
                        </div>

                        <div className="input-group">
                            <label>Or Paste Raw Content:</label>
                            <textarea
                                rows={5}
                                value={uploadRawText}
                                onChange={e => setUploadRawText(e.target.value)}
                                placeholder="विष्णुः, जो सर्वव्यापी हैं, All-pervading&#10;माधवः, माता लक्ष्मी के पति, Lord of Lakshmi"
                            />
                        </div>

                        {uploadStatusMsg && (
                            <div style={{ color: "var(--success)", fontWeight: 700, marginBottom: "10px", fontSize: "0.85rem" }}>
                                {uploadStatusMsg}
                            </div>
                        )}

                        <button className="btn" onClick={parseAndImportContent}>
                            Import Names
                        </button>
                    </div>
                </div>
            )}

            {/* Modal: iOS / Device PWA Install Guide */}
            {showIOSInstallModal && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowIOSInstallModal(false)}>
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <div className="modal-title">📲 Install Nitya Smaran App</div>
                            <button className="modal-close-btn" onClick={() => setShowIOSInstallModal(false)}>✕</button>
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: "1.4" }}>
                            Install this app on your device for one-tap launch from your home screen, offline support, and distraction-free full-screen display.
                        </div>

                        <div style={{ marginBottom: "12px" }}>
                            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--saffron)", marginBottom: "6px" }}>
                                On iPhone / iPad (Safari):
                            </div>
                            <div className="ios-step-row">
                                <div className="ios-step-num">1</div>
                                <div>Tap the <strong>Share</strong> button (⎋ with arrow) in Safari's bottom toolbar.</div>
                            </div>
                            <div className="ios-step-row">
                                <div className="ios-step-num">2</div>
                                <div>Scroll down and tap <strong>"Add to Home Screen"</strong> (➕).</div>
                            </div>
                            <div className="ios-step-row">
                                <div className="ios-step-num">3</div>
                                <div>Tap <strong>"Add"</strong> in top right. The Nitya Smaran app icon will be added!</div>
                            </div>
                        </div>

                        <div>
                            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--saffron)", marginBottom: "6px" }}>
                                On Android / Chrome:
                            </div>
                            <div className="ios-step-row">
                                <div className="ios-step-num">1</div>
                                <div>Tap the <strong>three dots menu (⋮)</strong> in Chrome.</div>
                            </div>
                            <div className="ios-step-row">
                                <div className="ios-step-num">2</div>
                                <div>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</div>
                            </div>
                        </div>

                        <button className="btn" style={{ marginTop: "12px" }} onClick={() => setShowIOSInstallModal(false)}>
                            Got It
                        </button>
                    </div>
                </div>
            )}

            {/* 1-Breath Smaran Overlay */}
            {showModal && (
                <div className="smaran-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="overlay-om">🕉️</div>
                    <div className="overlay-mantra">{state.mantra}</div>
                    <div className="overlay-prompt">
                        Pause for one deep breath. Remember Bhagwan's presence right here in the midst of your work.
                    </div>
                    <button
                        className="btn"
                        style={{ maxWidth: "220px" }}
                        onClick={() => {
                            setState(prev => ({ ...prev, totalJapa: prev.totalJapa + 1 }));
                            setShowModal(false);
                        }}
                    >
                        🙏 Smaran Done (Resume)
                    </button>
                </div>
            )}
        </div>
    );
}