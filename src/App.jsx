import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./App.css";

const DEFAULT_BHAVA_OPTIONS = [
    "Nimitta Matra (Instrument)",
    "Kartavya Puja (Duty as Worship)",
    "Seva Bhava (Selfless Service)",
    "Sakshi Bhava (Detached Witness)"
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
    sahasranamas: INITIAL_SAHASRANAMAS
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
        lblNewSankalpa: "🌺 New Karma Sankalpa (Dedicate Action)",
        descNewSankalpa: "Before starting any task or duty, consciously anchor your Bhava in Bhagwan. (Task name is optional)",
        lblTaskInput: "What action are you about to begin? (Optional)",
        lblSelectBhava: "Select Inner Attitude (Bhava):",
        btnBeginKarma: "Offer Sankalpa & Begin Task",
        lblTodaysYajna: "🔥 Today's Karma Yajna",
        descTodaysYajna: "When finished, click Arpanam to mentally offer both the effort and its result at Bhagwan's feet.",
        lblMalaTitle: "📿 Nitya Naam Japa & Smaran",
        lblTodayMalas: "Malas Today",
        lblTotalNaam: "Total Naam Count",
        navKarma: "Bhava & Karma",
        navMala: "Naam Japa",
        navNamaSmaran: "Nama Smaran",
        navSettings: "Settings"
    },
    hi: {
        lblNewSankalpa: "🌺 नया कर्म संकल्प (भगवद्-अर्पण)",
        descNewSankalpa: "कोई भी कार्य प्रारम्भ करने से पूर्व अपने भाव को भगवान के चरणों में जोड़ें। (कार्य नाम वैकल्पिक है)",
        lblTaskInput: "आप कौन-सा कार्य प्रारम्भ करने जा रहे हैं? (वैकल्पिक)",
        lblSelectBhava: "अपना आन्तरिक भाव चुनें:",
        btnBeginKarma: "संकल्प करें और कार्य प्रारम्भ करें",
        lblTodaysYajna: "🔥 आज का कर्म-यज्ञ",
        descTodaysYajna: "कार्य पूर्ण होने पर 'अर्पणम्' दबाकर परिश्रम और फल दोनों भगवान को समर्पित करें।",
        lblMalaTitle: "📿 नित्य नाम जप एवं स्मरण",
        lblTodayMalas: "आज की माला",
        lblTotalNaam: "कुल नाम संख्या",
        navKarma: "भाव एवं कर्म",
        navMala: "नाम जप",
        navNamaSmaran: "नाम स्मरण",
        navSettings: "सेटिंग्स"
    },
    en: {
        lblNewSankalpa: "🌺 New Karma Dedication",
        descNewSankalpa: "Before starting any work or duty, consciously dedicate your intention to the Divine. (Task name is optional)",
        lblTaskInput: "What task are you about to begin? (Optional)",
        lblSelectBhava: "Select Inner Intention:",
        btnBeginKarma: "Dedicate & Begin Task",
        lblTodaysYajna: "🔥 Today's Dedicated Actions",
        descTodaysYajna: "Once complete, offer the action and its outcome back to the Divine.",
        lblMalaTitle: "📿 Digital Japa Counter",
        lblTodayMalas: "Malas Today",
        lblTotalNaam: "Total Chants",
        navKarma: "Karma Yoga",
        navMala: "Chant Counter",
        navNamaSmaran: "Names of God",
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
                    sahasranamas: parsed.sahasranamas?.length ? parsed.sahasranamas : INITIAL_SAHASRANAMAS
                };
            } catch {
                return DEFAULT_STATE;
            }
        }
        return DEFAULT_STATE;
    });

    const [activeTab, setActiveTab] = useState("karma");
    const [karmaInput, setKarmaInput] = useState("");
    const [selectedBhava, setSelectedBhava] = useState(() => state.bhavaOptions?.[0] || DEFAULT_BHAVA_OPTIONS[0]);
    const [likhitaInput, setLikhitaInput] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showQuickSankalpa, setShowQuickSankalpa] = useState(false);
    const [quickKarmaInput, setQuickKarmaInput] = useState("");
    const [syncStatus, setSyncStatus] = useState("Offline-Ready");
    const syncTimeoutRef = useRef(null);

    // Bhava Category Settings State
    const [newBhavaCategory, setNewBhavaCategory] = useState("");
    const [editingBhavaIndex, setEditingBhavaIndex] = useState(null);
    const [editingBhavaValue, setEditingBhavaValue] = useState("");

    // Nama Smaran Tab State
    const [smaranSubTab, setSmaranSubTab] = useState("collections"); // 'collections' | 'review' | 'quiz'
    const [selectedCollectionId, setSelectedCollectionId] = useState("");
    const [expandedCollectionId, setExpandedCollectionId] = useState(null);

    // Add Collection Modal
    const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
    const [newCollectionTitle, setNewCollectionTitle] = useState("");
    const [newCollectionDeity, setNewCollectionDeity] = useState("");

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

    // Review State
    const [reviewDeityFilter, setReviewDeityFilter] = useState("all");
    const [reviewSelectedCollectionIds, setReviewSelectedCollectionIds] = useState([]);
    const [reviewMode, setReviewMode] = useState("sequential"); // 'sequential' | 'random'
    const [reviewIndex, setReviewIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(false);

    // Quiz Game State
    const [quizDeityFilter, setQuizDeityFilter] = useState("all");
    const [quizQuestion, setQuizQuestion] = useState(null);
    const [quizSelectedOption, setQuizSelectedOption] = useState(null);
    const [quizAnswerChecked, setQuizAnswerChecked] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [quizStreak, setQuizStreak] = useState(0);
    // Fullscreen Minimal Focus Mode for Smartphones (Naam Japa + Sacred Names Review)
    const [showFullscreenFocus, setShowFullscreenFocus] = useState(false);
    const [fsSelectedCollectionId, setFsSelectedCollectionId] = useState("all");
    const [fsNameIndex, setFsNameIndex] = useState(0);
    const [fsShowMeaning, setFsShowMeaning] = useState(false);

    // PWA Install Prompt & Standalone Mode State
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showIOSInstallModal, setShowIOSInstallModal] = useState(false);

    const t = I18N[state.lang] || I18N.mix;

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
                    sahasranamas: s.sahasranamas?.length ? s.sahasranamas : prev.sahasranamas
                }));
            } else if (data.userState) {
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
                setSyncStatus("☁️ Synced with D1");
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

    const incrementJapa = useCallback(() => {
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
    }, [playBellSound]);

    // Active names list for Fullscreen Focus Mode in Japa
    const fsActiveNames = useMemo(() => {
        if (!state.sahasranamas || state.sahasranamas.length === 0) return [];
        if (fsSelectedCollectionId === "all") {
            return state.sahasranamas.flatMap(col =>
                (col.names || []).map(n => ({
                    ...n,
                    collectionTitle: col.title,
                    collectionDeity: col.deity
                }))
            );
        }
        const col = state.sahasranamas.find(c => c.id === fsSelectedCollectionId);
        if (!col || !col.names) return [];
        return col.names.map(n => ({
            ...n,
            collectionTitle: col.title,
            collectionDeity: col.deity
        }));
    }, [state.sahasranamas, fsSelectedCollectionId]);

    const fsChantAndNext = useCallback(() => {
        incrementJapa();
        if (fsActiveNames.length > 0) {
            setFsNameIndex(prev => (prev + 1) % fsActiveNames.length);
        }
    }, [fsActiveNames.length, incrementJapa]);

    const fsPrevName = useCallback(() => {
        if (fsActiveNames.length > 0) {
            setFsNameIndex(prev => (prev - 1 + fsActiveNames.length) % fsActiveNames.length);
        }
    }, [fsActiveNames.length]);

    const fsNextName = useCallback(() => {
        if (fsActiveNames.length > 0) {
            setFsNameIndex(prev => (prev + 1) % fsActiveNames.length);
        }
    }, [fsActiveNames.length]);

    // Spacebar & Arrow keys for Mala and Fullscreen Focus Mode
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

            if (showFullscreenFocus) {
                if (e.code === "Space") {
                    e.preventDefault();
                    fsChantAndNext();
                } else if (e.code === "ArrowRight") {
                    e.preventDefault();
                    fsNextName();
                } else if (e.code === "ArrowLeft") {
                    e.preventDefault();
                    fsPrevName();
                } else if (e.code === "Escape") {
                    e.preventDefault();
                    setShowFullscreenFocus(false);
                }
            } else if (activeTab === "mala" && e.code === "Space") {
                e.preventDefault();
                incrementJapa();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showFullscreenFocus, fsChantAndNext, fsNextName, fsPrevName, activeTab, incrementJapa]);

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
        setQuickKarmaInput("");
        setShowQuickSankalpa(false);

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
        const deity = newCollectionDeity.trim() || "भगवान";
        if (!title) return;

        const newCol = {
            id: `col-${Date.now()}`,
            title,
            deity,
            names: []
        };

        setState(prev => ({
            ...prev,
            sahasranamas: [...prev.sahasranamas, newCol]
        }));
        setNewCollectionTitle("");
        setNewCollectionDeity("");
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
            // Ignore markdown table header separators like |---|---|
            if (/^\|?[-:\s|]+\|?$/.test(line)) continue;

            // 1. Check for Markdown Table format: | Name | Hindi Meaning | English Meaning |
            if (line.includes("|")) {
                const parts = line.split("|").map(p => p.trim()).filter(Boolean);
                if (parts.length >= 2) {
                    const name = parts[0].replace(/[*_#]/g, "");
                    if (["name", "naam", "नाम", "sanskrit"].includes(name.toLowerCase())) continue; // Header row
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

            // 2. Check for Markdown List format: - **Name**: Meaning OR 1. Name - Meaning
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

            // 3. Fallback to CSV format: Name, Hindi, English OR Name, Meaning
            const csvCols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, "").trim());
            if (csvCols.length >= 2) {
                const name = csvCols[0];
                if (["name", "naam", "नाम"].includes(name.toLowerCase())) continue; // Header
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
            alert("No names could be recognized. Please check your file format (CSV or Markdown).");
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

        setUploadStatusMsg(`✨ Successfully imported ${parsedNames.length} names!`);
        setTimeout(() => {
            setUploadStatusMsg("");
            setUploadRawText("");
            setShowUploadModal(false);
        }, 1500);
    };

    // Review List Computation
    const getFilteredReviewNames = useCallback(() => {
        let pool = [];
        const collectionsToInspect = reviewSelectedCollectionIds.length > 0
            ? state.sahasranamas.filter(s => reviewSelectedCollectionIds.includes(s.id))
            : state.sahasranamas;

        for (let col of collectionsToInspect) {
            if (reviewDeityFilter !== "all" && col.deity !== reviewDeityFilter) {
                continue;
            }
            for (let n of col.names) {
                pool.push({ ...n, collectionTitle: col.title, deity: col.deity });
            }
        }

        return pool;
    }, [state.sahasranamas, reviewSelectedCollectionIds, reviewDeityFilter]);

    const reviewPool = getFilteredReviewNames();
    const currentReviewItem = reviewPool[reviewIndex] || reviewPool[0];

    const nextReviewName = () => {
        playBellSound();
        setShowMeaning(false);
        if (reviewPool.length <= 1) return;
        if (reviewMode === "random") {
            let nextRnd = Math.floor(Math.random() * reviewPool.length);
            if (nextRnd === reviewIndex && reviewPool.length > 1) {
                nextRnd = (nextRnd + 1) % reviewPool.length;
            }
            setReviewIndex(nextRnd);
        } else {
            setReviewIndex((reviewIndex + 1) % reviewPool.length);
        }
    };

    const prevReviewName = () => {
        setShowMeaning(false);
        if (reviewPool.length <= 1) return;
        setReviewIndex((reviewIndex - 1 + reviewPool.length) % reviewPool.length);
    };

    // MCQ Game Question Generator
    const generateQuizQuestion = useCallback(() => {
        let pool = [];
        for (let col of state.sahasranamas) {
            if (quizDeityFilter !== "all" && col.deity !== quizDeityFilter) continue;
            for (let n of col.names) {
                if (n.meaningHi || n.meaningEn) {
                    pool.push({ ...n, collectionTitle: col.title, deity: col.deity });
                }
            }
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

        // Randomize Option A vs Option B
        const options = Math.random() > 0.5
            ? [correctItem.name, distractorItem.name]
            : [distractorItem.name, correctItem.name];

        setQuizQuestion({
            meaning: correctItem.meaningHi || correctItem.meaningEn,
            meaningSecondary: correctItem.meaningHi && correctItem.meaningEn ? correctItem.meaningEn : "",
            correctName: correctItem.name,
            deity: correctItem.deity,
            collectionTitle: correctItem.collectionTitle,
            options
        });
        setQuizSelectedOption(null);
        setQuizAnswerChecked(false);
    }, [state.sahasranamas, quizDeityFilter]);

    useEffect(() => {
        if (smaranSubTab === "quiz" && !quizQuestion) {
            generateQuizQuestion();
        }
    }, [smaranSubTab, quizQuestion, generateQuizQuestion]);

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

    // Extract unique deities across all sahasranamas
    const allDeities = Array.from(new Set(state.sahasranamas.map(s => s.deity).filter(Boolean)));
    const offeredCount = state.karmas.filter(k => k.offered).length;
    const currentFsName = fsActiveNames.length > 0 ? fsActiveNames[fsNameIndex % fsActiveNames.length] : null;

    return (
        <div className="app-wrapper">
            {/* Header */}
            <header>
                <div className="deity-title">{state.deityName}</div>
                <div className="mantra-subtitle">{state.mantra}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                    {!isStandalone && (
                        <div className="install-pill" onClick={handleInstallClick} title="Install Nitya Smaran App">
                            <span>📲</span>
                            <span>Install App</span>
                        </div>
                    )}
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
                {/* TAB 1: BHAVA & KARMA */}
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
                                    placeholder="e.g., Reviewing files, Cooking, Family duty... (Optional)"
                                />
                            </div>

                            <label>{t.lblSelectBhava}</label>
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
                                    No tasks logged yet. Dedicate your current action above to turn everyday duty into worship.
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

                {/* TAB 2: MALA & LIKHITA */}
                {activeTab === "mala" && (
                    <section className="tab-content active">
                        {/* Minimal Fullscreen Focus Mode Launcher for Smartphone Chanting & Sacred Name Review */}
                        <div className="card" style={{ border: "2px solid var(--saffron)", background: "linear-gradient(135deg, var(--bg-card), var(--bg-accent))" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "8px" }}>
                                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--saffron)", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span>📱</span>
                                    <span>Review Names in Japa (Focus Mode)</span>
                                </div>
                                <button
                                    className="btn btn-small"
                                    style={{ padding: "6px 14px", fontSize: "0.82rem", background: "linear-gradient(135deg, var(--saffron), #e8590c)" }}
                                    onClick={() => {
                                        setShowFullscreenFocus(true);
                                        setFsShowMeaning(false);
                                    }}
                                >
                                    ✨ Fullscreen Focus
                                </button>
                            </div>
                            <div className="card-desc" style={{ marginBottom: "8px", fontSize: "0.82rem" }}>
                                Minimal, clear distraction-free chanting for smartphones. Chanting advances both your 108 beads and the divine names with meaning.
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0, whiteSpace: "nowrap" }}>Select Stotra/Names:</label>
                                <select
                                    value={fsSelectedCollectionId}
                                    onChange={e => {
                                        setFsSelectedCollectionId(e.target.value);
                                        setFsNameIndex(0);
                                    }}
                                    style={{ flex: 1, padding: "5px 8px", fontSize: "0.82rem" }}
                                >
                                    <option value="all">✨ All Sahasranamas & Stotras Combined</option>
                                    {state.sahasranamas.map(col => (
                                        <option key={col.id} value={col.id}>
                                            {col.title} ({col.names.length} names)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

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
                            <div className="card-title">✍️ Quick Likhita Japa / Smaran Note</div>
                            <div className="card-desc">Type the Divine Name or prayer to anchor your mind.</div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <input
                                    type="text"
                                    value={likhitaInput}
                                    onChange={e => setLikhitaInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && submitLikhita()}
                                    placeholder="Type श्री राम, राधे कृष्ण, ॐ..."
                                />
                                <button className="btn btn-small" onClick={submitLikhita}>Offer</button>
                            </div>
                            <div style={{ marginTop: "12px", fontSize: "0.88rem", color: "var(--saffron)", lineHeight: "1.6" }}>
                                {state.likhitaList.slice(-24).map((w, i) => (
                                    <span key={i} style={{ marginRight: "8px", display: "inline-block" }}>🌺 {w}</span>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* TAB 3: NAMA SMARAN (SAHASRANAMA, STOTRA, REVIEW, & MCQ GAME) */}
                {activeTab === "smaran" && (
                    <section className="tab-content active">
                        {/* Subtab Navigation */}
                        <div className="subtab-bar">
                            <button
                                className={`subtab-btn ${smaranSubTab === "collections" ? "active" : ""}`}
                                onClick={() => setSmaranSubTab("collections")}
                            >
                                <span>📚</span>
                                <span>Sahasranamas</span>
                            </button>
                            <button
                                className={`subtab-btn ${smaranSubTab === "review" ? "active" : ""}`}
                                onClick={() => { setSmaranSubTab("review"); setReviewIndex(0); setShowMeaning(false); }}
                            >
                                <span>🎴</span>
                                <span>Review Names</span>
                            </button>
                            <button
                                className={`subtab-btn ${smaranSubTab === "quiz" ? "active" : ""}`}
                                onClick={() => { setSmaranSubTab("quiz"); generateQuizQuestion(); }}
                            >
                                <span>🎮</span>
                                <span>MCQ Quiz Game</span>
                            </button>
                        </div>

                        {/* SUBTAB 1: COLLECTIONS & MANAGEMENT */}
                        {smaranSubTab === "collections" && (
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                        📖 Sacred Stotras & Sahasranamas
                                    </h3>
                                    <button
                                        className="btn btn-small"
                                        onClick={() => setShowAddCollectionModal(true)}
                                    >
                                        ➕ New Stotra
                                    </button>
                                </div>

                                {state.sahasranamas.map(col => {
                                    const isExpanded = expandedCollectionId === col.id;
                                    return (
                                        <div key={col.id} className="sahasranama-card">
                                            <div className="sahasranama-header">
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)" }}>
                                                        {col.title}
                                                    </div>
                                                    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                                                        <span className="deity-badge">{col.deity}</span>
                                                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", alignSelf: "center" }}>
                                                            {col.names.length} Names
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="icon-action-btn delete"
                                                    title="Delete collection"
                                                    onClick={() => handleDeleteCollection(col.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>

                                            <div className="collection-actions">
                                                <button
                                                    className="btn btn-secondary btn-small"
                                                    onClick={() => {
                                                        setTargetCollectionId(col.id);
                                                        setShowAddNameModal(true);
                                                    }}
                                                >
                                                    ➕ Add Name
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-small"
                                                    onClick={() => {
                                                        setUploadTargetCollectionId(col.id);
                                                        setShowUploadModal(true);
                                                    }}
                                                >
                                                    📥 Upload CSV/Markdown
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-small"
                                                    onClick={() => {
                                                        setReviewSelectedCollectionIds([col.id]);
                                                        setReviewDeityFilter("all");
                                                        setReviewIndex(0);
                                                        setSmaranSubTab("review");
                                                    }}
                                                >
                                                    🎴 Review ({col.names.length})
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-small"
                                                    onClick={() => setExpandedCollectionId(isExpanded ? null : col.id)}
                                                >
                                                    {isExpanded ? "▲ Hide List" : `▼ View All (${col.names.length})`}
                                                </button>
                                            </div>

                                            {/* Expandable Names List */}
                                            {isExpanded && (
                                                <div style={{ marginTop: "14px", borderTop: "1px solid var(--border)", maxHeight: "300px", overflowY: "auto" }}>
                                                    {col.names.length === 0 ? (
                                                        <div style={{ padding: "12px", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.84rem" }}>
                                                            No names added yet. Click 'Add Name' or upload CSV/Markdown above!
                                                        </div>
                                                    ) : (
                                                        col.names.map((n, idx) => (
                                                            <div key={n.id || idx} className="name-item-row">
                                                                <div>
                                                                    <div className="name-sanskrit">
                                                                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginRight: "6px" }}>
                                                                            {idx + 1}.
                                                                        </span>
                                                                        {n.name}
                                                                    </div>
                                                                    <div className="name-meanings">
                                                                        {n.meaningHi && <span>{n.meaningHi}</span>}
                                                                        {n.meaningHi && n.meaningEn && <span> • </span>}
                                                                        {n.meaningEn && <i>{n.meaningEn}</i>}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    className="icon-action-btn delete"
                                                                    onClick={() => handleDeleteName(col.id, n.id)}
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* SUBTAB 2: REVIEW NAMES (FLASHCARDS & STUDY) */}
                        {smaranSubTab === "review" && (
                            <div>
                                <div className="card" style={{ padding: "16px", marginBottom: "14px" }}>
                                    <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "10px", color: "var(--text-primary)" }}>
                                        🔍 Configure Review Pool
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                                        <div>
                                            <label style={{ fontSize: "0.78rem" }}>Filter by Deity:</label>
                                            <select
                                                value={reviewDeityFilter}
                                                onChange={e => { setReviewDeityFilter(e.target.value); setReviewIndex(0); }}
                                            >
                                                <option value="all">All Deities</option>
                                                {allDeities.map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: "0.78rem" }}>Review Order:</label>
                                            <select
                                                value={reviewMode}
                                                onChange={e => setReviewMode(e.target.value)}
                                            >
                                                <option value="sequential">Sequential (क्रमशः)</option>
                                                <option value="random">Random (यादृच्छिक)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "0.78rem", marginBottom: "6px" }}>
                                            Choose Sahasranamas (combine multiple):
                                        </label>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                            {state.sahasranamas.map(col => {
                                                const isSelected = reviewSelectedCollectionIds.includes(col.id);
                                                return (
                                                    <button
                                                        key={col.id}
                                                        type="button"
                                                        className={`bhava-chip ${isSelected ? "selected" : ""}`}
                                                        style={{ fontSize: "0.76rem", padding: "5px 10px" }}
                                                        onClick={() => {
                                                            setReviewSelectedCollectionIds(prev =>
                                                                isSelected
                                                                    ? prev.filter(id => id !== col.id)
                                                                    : [...prev, col.id]
                                                            );
                                                            setReviewIndex(0);
                                                        }}
                                                    >
                                                        {isSelected ? "✓ " : ""}{col.title.split("(")[0].trim()} ({col.names.length})
                                                    </button>
                                                );
                                            })}
                                            {reviewSelectedCollectionIds.length > 0 && (
                                                <button
                                                    type="button"
                                                    className="bhava-chip"
                                                    style={{ fontSize: "0.76rem", padding: "5px 10px" }}
                                                    onClick={() => { setReviewSelectedCollectionIds([]); setReviewIndex(0); }}
                                                >
                                                    Select All
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {reviewPool.length === 0 ? (
                                    <div className="card" style={{ textAlign: "center", padding: "28px" }}>
                                        <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📿</div>
                                        <div style={{ fontWeight: 600 }}>No names found in this selection.</div>
                                        <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                                            Select another deity or add names to your Sahasranama library.
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
                                            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                                                {currentReviewItem.collectionTitle}
                                            </span>
                                            <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--saffron)" }}>
                                                {reviewIndex + 1} / {reviewPool.length}
                                            </span>
                                        </div>

                                        {/* Flashcard Box */}
                                        <div className="flashcard-box" onClick={() => setShowMeaning(prev => !prev)}>
                                            <div className="card-deity-pill">
                                                🕉️ {currentReviewItem.deity}
                                            </div>
                                            <div className="flashcard-title">
                                                {currentReviewItem.name}
                                            </div>

                                            {!showMeaning ? (
                                                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "12px" }}>
                                                    👆 Tap to reveal meaning
                                                </div>
                                            ) : (
                                                <div className="flashcard-meaning-box">
                                                    {currentReviewItem.meaningHi && (
                                                        <div className="meaning-hi">
                                                            {currentReviewItem.meaningHi}
                                                        </div>
                                                    )}
                                                    {currentReviewItem.meaningEn && (
                                                        <div className="meaning-en">
                                                            {currentReviewItem.meaningEn}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Flashcard Controls */}
                                        <div className="flashcard-controls">
                                            <button className="btn btn-secondary" onClick={prevReviewName}>
                                                ◀ Previous
                                            </button>
                                            <button className="btn" onClick={nextReviewName}>
                                                Next Name ▶
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SUBTAB 3: MCQ NAMA REMINDER GAME */}
                        {smaranSubTab === "quiz" && (
                            <div className="quiz-card">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <div>
                                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                            🎮 Nama Smaran Reminder
                                        </h3>
                                        <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                                            Read the divine attribute & identify the Name
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <div className="score-badge">
                                            <span>⭐ Score:</span>
                                            <span>{quizScore}</span>
                                        </div>
                                        <div className="score-badge">
                                            <span>🔥 Streak:</span>
                                            <span>{quizStreak}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: "14px" }}>
                                    <label style={{ fontSize: "0.78rem" }}>Choose Deity for Quiz:</label>
                                    <select
                                        value={quizDeityFilter}
                                        onChange={e => {
                                            setQuizDeityFilter(e.target.value);
                                            setTimeout(() => generateQuizQuestion(), 50);
                                        }}
                                    >
                                        <option value="all">All Deities</option>
                                        {allDeities.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                {!quizQuestion ? (
                                    <div style={{ textAlign: "center", padding: "28px" }}>
                                        <p style={{ color: "var(--text-secondary)", marginBottom: "12px" }}>
                                            At least 2 names with meanings are required to play the quiz for this deity.
                                        </p>
                                        <button className="btn btn-small" onClick={() => generateQuizQuestion()}>
                                            Try Again
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="quiz-question-box">
                                            <div className="quiz-meaning-label">
                                                🌸 Divine Meaning / स्वरूप ({quizQuestion.deity}):
                                            </div>
                                            <div className="quiz-meaning-text">
                                                {quizQuestion.meaning}
                                            </div>
                                            {quizQuestion.meaningSecondary && (
                                                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "6px", fontStyle: "italic" }}>
                                                    {quizQuestion.meaningSecondary}
                                                </div>
                                            )}
                                        </div>

                                        <div className="quiz-options-grid">
                                            {quizQuestion.options.map((opt, i) => {
                                                let btnClass = "quiz-opt-btn";
                                                if (quizAnswerChecked) {
                                                    if (opt === quizQuestion.correctName) {
                                                        btnClass += " correct";
                                                    } else if (opt === quizSelectedOption) {
                                                        btnClass += " wrong";
                                                    }
                                                }
                                                return (
                                                    <button
                                                        key={i}
                                                        className={btnClass}
                                                        onClick={() => handleQuizOptionClick(opt)}
                                                    >
                                                        <span>{opt}</span>
                                                        {quizAnswerChecked && opt === quizQuestion.correctName && (
                                                            <span style={{ fontSize: "0.78rem", marginTop: "4px" }}>✓ Correct</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {quizAnswerChecked && (
                                            <div style={{ textAlign: "center", marginTop: "12px" }}>
                                                <button className="btn" onClick={() => generateQuizQuestion()}>
                                                    Next Question ▶
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 4: SETTINGS */}
                {activeTab === "settings" && (
                    <section className="tab-content active">
                        {/* PWA Install Card */}
                        <div className="card install-card-highlight">
                            <div className="card-title">
                                <span>📲 Install Nitya Smaran as App (PWA)</span>
                                <span style={{ fontSize: "0.8rem", color: isStandalone ? "var(--success)" : "var(--saffron)", fontWeight: 700 }}>
                                    {isStandalone ? "✓ Installed" : "Installable"}
                                </span>
                            </div>
                            <div className="card-desc">
                                Install on your smartphone (iPhone / Android) or PC. Runs in full-screen standalone mode with offline support, instant launch, and haptic feedback like a native app.
                            </div>
                            {!isStandalone ? (
                                <button className="btn" onClick={handleInstallClick} style={{ marginTop: "6px" }}>
                                    📲 Install App on this Device
                                </button>
                            ) : (
                                <div style={{ color: "var(--success)", fontWeight: 600, fontSize: "0.9rem", marginTop: "4px" }}>
                                    ✓ You are currently using Nitya Smaran in installed standalone mode.
                                </div>
                            )}
                        </div>

                        {/* Manage Bhava Categories */}
                        <div className="card">
                            <div className="card-title">
                                <span>🌺 Manage Bhava Categories (भाव श्रेणियाँ)</span>
                            </div>
                            <div className="card-desc">
                                Customize the attitudes you anchor before starting an action. Add, edit, or remove your personal Bhavas.
                            </div>

                            <div style={{ marginBottom: "14px" }}>
                                {state.bhavaOptions.map((bhava, index) => (
                                    <div key={index} className="category-manage-item">
                                        {editingBhavaIndex === index ? (
                                            <div style={{ display: "flex", gap: "6px", width: "100%" }}>
                                                <input
                                                    type="text"
                                                    value={editingBhavaValue}
                                                    onChange={e => setEditingBhavaValue(e.target.value)}
                                                    style={{ flex: 1, padding: "6px 8px" }}
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

                            <div style={{ display: "flex", gap: "8px" }}>
                                <input
                                    type="text"
                                    value={newBhavaCategory}
                                    onChange={e => setNewBhavaCategory(e.target.value)}
                                    placeholder="e.g., Ishwar Pranidhana (Surrender)..."
                                />
                                <button className="btn btn-small" onClick={handleAddBhavaCategory}>
                                    ➕ Add
                                </button>
                            </div>
                        </div>

                        {/* Ishta Dev Customization */}
                        <div className="card">
                            <div className="card-title">🕉️ Customize Ishta Dev & Mantra</div>
                            <div className="input-group" style={{ marginTop: "10px" }}>
                                <label>Quick Presets</label>
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

                        {/* Language, Nudge & Theme */}
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

            {/* FLOATING ACTION BUTTON (FAB) FOR EASY SANKALPA ADDITION */}
            <div
                className="fab-btn"
                title="Quick Karma Sankalpa"
                onClick={() => setShowQuickSankalpa(true)}
            >
                ➕
            </div>

            {/* QUICK SANKALPA FLOATING MODAL */}
            {showQuickSankalpa && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowQuickSankalpa(false)}>
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <div className="modal-title">🌺 Quick Karma Sankalpa</div>
                            <button className="modal-close-btn" onClick={() => setShowQuickSankalpa(false)}>✕</button>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
                            Dedicate your upcoming task. Text is optional—even if left blank, the sankalpa will be offered.
                        </p>

                        <div className="input-group">
                            <label>What action are you starting? (Optional)</label>
                            <input
                                type="text"
                                value={quickKarmaInput}
                                onChange={e => setQuickKarmaInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && addKarma(quickKarmaInput)}
                                placeholder="e.g., Answering emails, Commute, Duty..."
                                autoFocus
                            />
                        </div>

                        <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                            Select Attitude (Bhava):
                        </label>
                        <div className="bhava-chips" style={{ marginBottom: "16px" }}>
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

                        <button className="btn" onClick={() => addKarma(quickKarmaInput)}>
                            🙏 Offer Sankalpa & Begin
                        </button>
                    </div>
                </div>
            )}

            {/* ADD SAHASRANAMA MODAL */}
            {showAddCollectionModal && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowAddCollectionModal(false)}>
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <div className="modal-title">📖 Add New Sahasranama / Stotra</div>
                            <button className="modal-close-btn" onClick={() => setShowAddCollectionModal(false)}>✕</button>
                        </div>

                        <div className="input-group">
                            <label>Stotra / Sahasranama Title</label>
                            <input
                                type="text"
                                value={newCollectionTitle}
                                onChange={e => setNewCollectionTitle(e.target.value)}
                                placeholder="e.g., श्री ललिता सहस्रनाम (Lalita Sahasranama)"
                            />
                        </div>

                        <div className="input-group">
                            <label>Deity Name (for filtering & quiz)</label>
                            <input
                                type="text"
                                value={newCollectionDeity}
                                onChange={e => setNewCollectionDeity(e.target.value)}
                                placeholder="e.g., माता ललिता / श्री कृष्ण / श्री गणेश"
                            />
                        </div>

                        <button className="btn" onClick={handleAddCollection}>
                            Save Sahasranama Collection
                        </button>
                    </div>
                </div>
            )}

            {/* ADD NAME MANUALLY MODAL */}
            {showAddNameModal && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowAddNameModal(false)}>
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <div className="modal-title">➕ Add Sacred Name</div>
                            <button className="modal-close-btn" onClick={() => setShowAddNameModal(false)}>✕</button>
                        </div>

                        <div className="input-group">
                            <label>Name (Devanagari / Transliteration)</label>
                            <input
                                type="text"
                                value={newNameSanskrit}
                                onChange={e => setNewNameSanskrit(e.target.value)}
                                placeholder="e.g., दामोदरः / Damodara"
                            />
                        </div>

                        <div className="input-group">
                            <label>Meaning in Hindi (अर्थ - हिन्दी)</label>
                            <input
                                type="text"
                                value={newNameMeaningHi}
                                onChange={e => setNewNameMeaningHi(e.target.value)}
                                placeholder="e.g., जिनके उदर पर माता यशोदा ने प्रेम की रस्सी बांधी थी"
                            />
                        </div>

                        <div className="input-group">
                            <label>Meaning in English (Optional)</label>
                            <input
                                type="text"
                                value={newNameMeaningEn}
                                onChange={e => setNewNameMeaningEn(e.target.value)}
                                placeholder="e.g., Bound by mother Yashoda's loving rope"
                            />
                        </div>

                        <button className="btn" onClick={handleAddManualName}>
                            Save Sacred Name
                        </button>
                    </div>
                </div>
            )}

            {/* UPLOAD CSV / MARKDOWN MODAL */}
            {showUploadModal && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowUploadModal(false)}>
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <div className="modal-title">📥 Upload CSV or Markdown</div>
                            <button className="modal-close-btn" onClick={() => setShowUploadModal(false)}>✕</button>
                        </div>

                        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: "1.45" }}>
                            Upload a <b>.csv</b> or <b>.md</b> file, or paste raw text below. Supports:<br />
                            • CSV: <code>Name, Hindi Meaning, English Meaning</code><br />
                            • Markdown list: <code>- **Name**: Meaning</code><br />
                            • Markdown table: <code>| Name | Hindi | English |</code>
                        </p>

                        <div className="input-group">
                            <input type="file" accept=".csv,.md,.txt" onChange={handleFileUpload} />
                        </div>

                        <div className="input-group">
                            <label>Or Paste Raw Content:</label>
                            <textarea
                                rows={6}
                                value={uploadRawText}
                                onChange={e => setUploadRawText(e.target.value)}
                                placeholder="विष्णुः, जो सर्वव्यापी हैं, All-pervading&#10;माधवः, माता लक्ष्मी के पति, Lord of Lakshmi"
                            />
                        </div>

                        {uploadStatusMsg && (
                            <div style={{ color: "var(--success)", fontWeight: 700, marginBottom: "10px", fontSize: "0.9rem" }}>
                                {uploadStatusMsg}
                            </div>
                        )}

                        <button className="btn" onClick={parseAndImportContent}>
                            Import Names into Sahasranama
                        </button>
                    </div>
                </div>
            )}

            {/* FULLSCREEN MINIMAL SMARTPHONE FOCUS MODE */}
            {showFullscreenFocus && (
                <div className="fullscreen-focus-view">
                    {/* Top Bar */}
                    <div className="fs-top-bar">
                        <button
                            className="fs-exit-btn"
                            onClick={() => setShowFullscreenFocus(false)}
                            title="Exit Fullscreen Mode"
                        >
                            <span>✕</span>
                            <span>Exit</span>
                        </button>

                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <select
                                value={fsSelectedCollectionId}
                                onChange={e => {
                                    setFsSelectedCollectionId(e.target.value);
                                    setFsNameIndex(0);
                                }}
                                style={{
                                    fontSize: "0.76rem",
                                    padding: "4px 8px",
                                    maxWidth: "150px",
                                    borderRadius: "14px",
                                    border: "1px solid var(--border)",
                                    background: "var(--bg-accent)",
                                    color: "var(--saffron)",
                                    fontWeight: 600
                                }}
                            >
                                <option value="all">✨ All Sahasranamas</option>
                                {state.sahasranamas.map(col => (
                                    <option key={col.id} value={col.id}>
                                        {col.title}
                                    </option>
                                ))}
                            </select>

                            <div className="fs-badge">
                                📿 {state.currentBead}/108
                            </div>
                        </div>

                        <button
                            className="fs-exit-btn"
                            onClick={() => setFsShowMeaning(s => !s)}
                            title="Toggle Hindi/English Meaning"
                        >
                            <span>{fsShowMeaning ? "👁️ Hide" : "👁️ Meaning"}</span>
                        </button>
                    </div>

                    {/* Center Hero Name Area (Tap to chant & next) */}
                    <div className="fs-center-hero" onClick={fsChantAndNext}>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: 600 }}>
                            {currentFsName ? currentFsName.collectionTitle : state.deityName}
                            {fsActiveNames.length > 0 && ` • ${(fsNameIndex % fsActiveNames.length) + 1} / ${fsActiveNames.length}`}
                        </div>

                        <div className="fs-name-text">
                            {currentFsName ? currentFsName.name : state.mantra}
                        </div>

                        {fsShowMeaning && currentFsName && (
                            <div
                                className="fs-meaning-box"
                                onClick={e => e.stopPropagation()}
                            >
                                {currentFsName.meaningHi && (
                                    <div style={{ fontSize: "0.98rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                                        {currentFsName.meaningHi}
                                    </div>
                                )}
                                {currentFsName.meaningEn && (
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                                        {currentFsName.meaningEn}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="fs-tap-hint">
                            Tap name or button below to Chant (Bead +1) & advance
                        </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="fs-bottom-bar">
                        <div className="fs-controls-row">
                            <button
                                className="fs-nav-arrow-btn"
                                onClick={e => { e.stopPropagation(); fsPrevName(); }}
                                title="Previous Name"
                            >
                                ◀
                            </button>

                            <button
                                className="fs-chant-btn"
                                onClick={e => { e.stopPropagation(); fsChantAndNext(); }}
                                title="Chant & Count Bead"
                            >
                                <span>📿</span>
                                <span>Chant & Next</span>
                            </button>

                            <button
                                className="fs-nav-arrow-btn"
                                onClick={e => { e.stopPropagation(); fsNextName(); }}
                                title="Next Name"
                            >
                                ▶
                            </button>
                        </div>

                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", opacity: 0.8 }}>
                            Today: {state.todayMalas} Malas ({state.totalJapa} total chants)
                        </div>
                    </div>
                </div>
            )}

            {/* iOS / Manual Install Guide Modal */}
            {showIOSInstallModal && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowIOSInstallModal(false)}>
                    <div className="modal-sheet">
                        <div className="modal-header">
                            <div className="modal-title">📲 Install Nitya Smaran App</div>
                            <button className="modal-close-btn" onClick={() => setShowIOSInstallModal(false)}>✕</button>
                        </div>
                        <div style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
                            Install this app on your device for one-tap launch from your home screen, offline support, and distraction-free full-screen display.
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--saffron)", marginBottom: "8px" }}>
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
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--saffron)", marginBottom: "8px" }}>
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

                        <button className="btn" style={{ marginTop: "14px" }} onClick={() => setShowIOSInstallModal(false)}>
                            Got It
                        </button>
                    </div>
                </div>
            )}

            {/* 1-Breath Smaran Overlay */}
            {showModal && (
                <div className="overlay show" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
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

            {/* Bottom Navigation */}
            <nav>
                <button className={`nav-item ${activeTab === "karma" ? "active" : ""}`} onClick={() => setActiveTab("karma")}>
                    <span className="nav-icon">🌺</span>
                    <span>{t.navKarma}</span>
                </button>
                <button className={`nav-item ${activeTab === "mala" ? "active" : ""}`} onClick={() => setActiveTab("mala")}>
                    <span className="nav-icon">📿</span>
                    <span>{t.navMala}</span>
                </button>
                <button className={`nav-item ${activeTab === "smaran" ? "active" : ""}`} onClick={() => setActiveTab("smaran")}>
                    <span className="nav-icon">📖</span>
                    <span>{t.navNamaSmaran}</span>
                </button>
                <button className={`nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
                    <span className="nav-icon">⚙️</span>
                    <span>{t.navSettings}</span>
                </button>
            </nav>
        </div>
    );
}