import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot
} from 'firebase/firestore';

// --- FIREBASE CONFIGURATION ---
const defaultFirebaseConfig = { apiKey: "demo", authDomain: "demo.firebaseapp.com", projectId: "demo" };
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : defaultFirebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'marco-tracker';

const INITIAL_DATA = {
  habits: {
    water: { current: 0, target: 8, unit: 'vasos' },
    gym: { done: false },
    reading: { done: false },
    meditation: { done: false },
    sleep: { done: false },
    skincare: { done: false },
    emotional: { done: false }
  },
  gym: {
    week: 1,
    pbs: { bench: 60, squat: 80, deadlift: 100 },
    dias: [
      { id: 1, name: "Push (Pecho/Tríceps)", exercises: [{ name: "Press Banca", sets: "4", reps: "8-10", weight: "60kg", done: false }] },
      { id: 2, name: "Pull (Espalda/Bíceps)", exercises: [{ name: "Dominadas", sets: "4", reps: "Fallos", weight: "BW", done: false }] },
      { id: 3, name: "Legs (Pierna)", exercises: [{ name: "Sentadilla", sets: "4", reps: "8", weight: "80kg", done: false }] },
      { id: 4, name: "Upper (Hombro/Abs)", exercises: [{ name: "Press Militar", sets: "4", reps: "10", weight: "40kg", done: false }] }
    ]
  },
  finance: {
    budget: 2000,
    spent: 0,
    goals: [
      { id: 1, name: "Nuevo iPhone", target: 1200, saved: 300 }
    ],
    expenses: []
  },
  dialogue: {
    entries: [] 
  },
  gratitude: {
    affirmations: ["Soy suficiente", "Atraigo lo que soy", "Mis límites son respetados"]
  },
  project: {
    name: "Proyecto X",
    sprints: [{ id: 1, name: "Sprint 1: Bases", tasks: [{ id: 1, text: "Definir nicho", done: false }] }]
  },
  knowledge: {
    notes: [
      { id: 1, title: "Red Flags", content: "Si habla mal de todos sus ex, la red flag eres tú si te quedas.", tag: "Relaciones" }
    ]
  },
  playlists: {
    items: [
       { id: 1, name: "Modo Bestia", url: "https://open.spotify.com/playlist/37i9dQZF1DXdxcBWuJkbcy", platform: 'spotify' }
    ]
  },
  security: {
    dailyChecks: [
      { id: 1, text: "Postura (Pecho fuera)", done: false },
      { id: 2, text: "Mirada al espejo + Sonrisa (2 min)", done: false },
      { id: 3, text: "Hablar despacio y proyectar", done: false }
    ],
    weeklyGoals: [
      { id: 1, text: "Hablar con 1 persona nueva", done: false },
      { id: 2, text: "Exposición al rechazo (Pedir algo)", done: false }
    ]
  },
  overthinking: {
    emergencyMode: false,
    worryTimeStart: null 
  },
  posture: {
     checks: [
      { id: 1, text: "Espalda recta", done: false },
      { id: 2, text: "Mentón paralelo al suelo", done: false }
    ],
    reminderEnabled: false
  }
};

export const useAppData = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth Error:", error);
        if (!user) setUser({ uid: 'demo-user' });
      }
    };
    initAuth();
    return onAuthStateChanged(auth, u => { setUser(u); });
  }, []);

  useEffect(() => {
    if (!user) return;
    
    if (firebaseConfig.apiKey === 'demo') {
        setData(INITIAL_DATA);
        setLoading(false);
        return;
    }

    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'v3_state');
    return onSnapshot(docRef, snap => {
      if (snap.exists()) {
        const fetched = snap.data();
        setData({ 
           ...INITIAL_DATA, 
           ...fetched,
           habits: { ...INITIAL_DATA.habits, ...(fetched.habits || {}) },
           gym: { ...INITIAL_DATA.gym, ...(fetched.gym || {}) },
           security: { ...INITIAL_DATA.security, ...(fetched.security || {}) },
           playlists: { ...INITIAL_DATA.playlists, ...(fetched.playlists || {}) },
        });
      } else {
        setDoc(docRef, INITIAL_DATA).then(() => setData(INITIAL_DATA));
      }
      setLoading(false);
    }, (error) => { 
        console.error("Data Error:", error); 
        setData(INITIAL_DATA);
        setLoading(false); 
    });
  }, [user]);

  const updateData = async (path, value) => {
    if (!user || !data) return;
    const newData = { ...data, [path]: value };
    setData(newData); 
    
    if (firebaseConfig.apiKey === 'demo') return;

    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'v3_state'), { [path]: value }, { merge: true });
    } catch (e) { console.error(e); }
  };

  return { user, data, loading, updateData };
};
