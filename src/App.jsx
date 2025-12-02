import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, User, Shirt, MessageSquare, Guitar, 
  Target, Compass, Users, CheckSquare, Brain, 
  Trophy, AlertTriangle, Settings, ChevronLeft, 
  Plus, Trash2, Moon, Sun, Save, Star, ShieldAlert,
  Cloud, Loader2, Bell, Calendar as CalendarIcon, ExternalLink,
  Music, Mic, Search, Clock, Play, Wallet, Heart, Zap, BookOpen, 
  Leaf,  BarChart3, Activity, ArrowRight, X, Headphones
} from 'lucide-react';
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
// NOTE: In a real environment, ensure __firebase_config is defined globally or replace this with your config object.
const defaultFirebaseConfig = { apiKey: "demo", authDomain: "demo.firebaseapp.com", projectId: "demo" };
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : defaultFirebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'marco-tracker';

// --- INITIAL DATA STRUCTURE ---
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
    entries: [] // { id, text, type, evidenceFor, evidenceAgainst, reframe }
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

// --- HELPERS ---
const addToCalendar = (title, details = "") => {
  const text = encodeURIComponent(title);
  const det = encodeURIComponent(details);
  const now = new Date();
  const start = now.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = new Date(now.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${det}&dates=${start}/${end}`;
  window.open(url, '_blank');
};

const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };

const getEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes('spotify.com') && !url.includes('/embed')) {
    return url.replace('spotify.com', 'spotify.com/embed');
  }
  return url; // Return as is or handle SoundCloud differently if needed
};

// --- IOS UI COMPONENTS ---

const IOSCard = ({ children, className = "", onClick, style }) => (
  <div 
    onClick={onClick}
    style={style}
    className={`bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-sm rounded-3xl p-5 transition-all duration-300 active:scale-[0.98] ${className}`}
  >
    {children}
  </div>
);

const IOSButton = ({ children, onClick, variant = 'primary', className = "", size = 'md' }) => {
  const baseClass = "rounded-full font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700",
    secondary: "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600",
    danger: "bg-red-500 text-white shadow-lg shadow-red-500/30",
    ghost: "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base w-full"
  };

  return (
    <button onClick={(e) => { triggerHaptic(); onClick && onClick(e); }} className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const FitnessRing = ({ progress, color = "#3b82f6", size = 60, stroke = 6, icon: Icon }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="transparent" className="text-slate-200 dark:text-slate-700" />
        <circle 
          cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="transparent" 
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {Icon && <Icon size={size * 0.4} className="absolute text-slate-600 dark:text-slate-300" />}
    </div>
  );
};

const IOSHeader = ({ title, subtitle, rightAction, large = true }) => (
  <div className={`flex justify-between items-end mb-6 ${large ? 'pt-4' : ''}`}>
    <div>
      {subtitle && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{subtitle}</p>}
      <h1 className={`${large ? 'text-3xl' : 'text-xl'} font-bold tracking-tight text-slate-900 dark:text-white`}>{title}</h1>
    </div>
    {rightAction}
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeModule, setActiveModule] = useState(null); 
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // Worry Time Logic
  const [worryTimer, setWorryTimer] = useState(0);
  const [isWorrying, setIsWorrying] = useState(false);

  // Auth & Sync
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
        // Fallback for demo/offline mode if auth fails
        if (!user) {
            setUser({ uid: 'demo-user' });
        }
      }
    };
    initAuth();
    return onAuthStateChanged(auth, u => { setUser(u); });
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // If using demo config, just set initial data
    if (firebaseConfig.apiKey === 'demo') {
        setData(INITIAL_DATA);
        setLoading(false);
        return;
    }

    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'v3_state'); // Version 3 for new schema
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
        // Fallback to initial data on error
        setData(INITIAL_DATA);
        setLoading(false); 
    });
  }, [user]);

  // Timer Effect
  useEffect(() => {
    let interval;
    if (isWorrying && worryTimer > 0) {
      interval = setInterval(() => setWorryTimer(t => t - 1), 1000);
    } else if (worryTimer === 0) {
      setIsWorrying(false);
    }
    return () => clearInterval(interval);
  }, [isWorrying, worryTimer]);

  const updateData = async (path, value) => {
    if (!user || !data) return;
    const newData = { ...data, [path]: value };
    setData(newData); // Optimistic UI
    
    if (firebaseConfig.apiKey === 'demo') return;

    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'v3_state'), { [path]: value }, { merge: true });
    } catch (e) { console.error(e); }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNotificationRequest = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
           new Notification("Notificaciones Activas", { body: "Te avisaremos para tus checks de postura." });
        }
      });
    }
  };

  // --- MODULE RENDERERS ---

  const renderDashboard = () => {
    if (!data?.habits) return null;
    const h = data.habits;
    const completed = [h.gym, h.reading, h.meditation, h.sleep, h.skincare, h.emotional].filter(x => x.done).length + (h.water.current >= h.water.target ? 1 : 0);
    const progress = (completed / 7) * 100;

    return (
      <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center pt-2">
          <div>
            <h2 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">{new Date().toLocaleDateString(undefined, {weekday:'long', day:'numeric'})}</h2>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Resumen</h1>
          </div>
          <div onClick={toggleTheme} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center cursor-pointer">
             {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </div>
        </div>

        <IOSCard className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-300 text-sm font-medium">Progreso Diario</p>
              <h3 className="text-2xl font-bold">{progress === 100 ? '¡Imparable!' : 'Sigue así'}</h3>
            </div>
            <FitnessRing progress={progress} color="#4ade80" size={50} stroke={4} />
          </div>
          <div className="flex gap-6 mt-2">
             <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400">Gym</span>
                <span className={`font-bold ${h.gym.done ? 'text-green-400' : 'text-slate-500'}`}>{h.gym.done ? '✓' : '-'}</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400">Mente</span>
                <span className={`font-bold ${h.meditation.done ? 'text-purple-400' : 'text-slate-500'}`}>{h.meditation.done ? '✓' : '-'}</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400">Agua</span>
                <span className={`font-bold ${h.water.current >= 8 ? 'text-cyan-400' : 'text-slate-500'}`}>{h.water.current}/8</span>
             </div>
          </div>
        </IOSCard>

        <IOSCard className="border-l-4 border-l-indigo-500">
           <div className="flex items-start gap-3">
              <Star className="text-indigo-500 mt-1 shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">Afirmación del día</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 italic">
                  "{data.gratitude.affirmations[0] || 'Soy el arquitecto de mi destino.'}"
                </p>
              </div>
           </div>
        </IOSCard>

        <div className="grid grid-cols-2 gap-4">
           {[
             {id: 'gym', icon: Dumbbell, label: 'Gym Evo', color: 'text-orange-500', bg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20'},
             {id: 'habits', icon: Activity, label: 'Hábitos', color: 'text-green-500', bg: 'hover:bg-green-50 dark:hover:bg-green-900/20'},
             {id: 'security', icon: ShieldAlert, label: 'Seguridad', color: 'text-indigo-500', bg: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20'},
             {id: 'playlists', icon: Headphones, label: 'Música', color: 'text-pink-500', bg: 'hover:bg-pink-50 dark:hover:bg-pink-900/20'},
           ].map(item => (
             <IOSCard key={item.id} onClick={() => setActiveModule(item.id)} className={`flex flex-col items-center justify-center gap-2 h-32 ${item.bg}`}>
                <item.icon className={item.color} size={32} />
                <span className="font-semibold text-sm">{item.label}</span>
             </IOSCard>
           ))}
        </div>
      </div>
    );
  };

  const renderSecurity = () => (
    <div className="space-y-6 pb-24">
      <IOSHeader title="Seguridad" subtitle="Construcción de Confianza" />
      
      <IOSCard className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800">
        <h3 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-2">
           <Zap size={18} /> Ritual Diario (Pequeños Pasos)
        </h3>
        <div className="space-y-3">
          {data.security.dailyChecks.map((item, idx) => (
            <div key={item.id} 
               onClick={() => {
                 const newChecks = [...data.security.dailyChecks];
                 newChecks[idx].done = !item.done;
                 updateData('security', {...data.security, dailyChecks: newChecks});
                 triggerHaptic();
               }}
               className="flex items-center gap-3 p-2 bg-white/50 dark:bg-slate-800/50 rounded-xl cursor-pointer"
            >
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${item.done ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-400'}`}>
                 {item.done && <CheckSquare size={12} />}
               </div>
               <span className={`text-sm ${item.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{item.text}</span>
            </div>
          ))}
        </div>
      </IOSCard>

      <div className="space-y-4">
        <h3 className="font-bold text-lg px-2">Retos Semanales</h3>
        {data.security.weeklyGoals.map((goal, idx) => (
           <IOSCard key={goal.id} className="flex justify-between items-center">
              <div>
                 <p className="font-semibold text-sm">{goal.text}</p>
                 <button 
                   onClick={() => addToCalendar("Reto Social: " + goal.text, "Exposición al rechazo controlada.")}
                   className="text-xs text-blue-500 mt-1 flex items-center gap-1"
                 >
                   <CalendarIcon size={12} /> Agendar
                 </button>
              </div>
              <IOSButton 
                 size="sm" 
                 variant={goal.done ? 'primary' : 'secondary'}
                 onClick={() => {
                    const newGoals = [...data.security.weeklyGoals];
                    newGoals[idx].done = !goal.done;
                    updateData('security', {...data.security, weeklyGoals: newGoals});
                 }}
              >
                 {goal.done ? 'Hecho' : 'Hacer'}
              </IOSButton>
           </IOSCard>
        ))}
      </div>
      
      <IOSCard className="border-l-4 border-rose-500">
         <h4 className="font-bold text-rose-500 mb-1">Recordatorio de Rechazo</h4>
         <p className="text-sm text-slate-600 dark:text-slate-400">
            "El rechazo es información, no una sentencia. Si pides un café y dicen que no, aprendiste que ahí no hay café. Tú sigues valiendo lo mismo."
         </p>
      </IOSCard>
    </div>
  );

  const renderPlaylists = () => (
    <div className="space-y-6 pb-24">
       <IOSHeader title="Música & Focus" subtitle="Tus Playlists" />
       
       <div className="flex gap-2 mb-4">
          <input 
             id="plUrl" 
             placeholder="Link de Spotify..." 
             className="flex-1 bg-white dark:bg-slate-800 border-none rounded-xl p-3 text-sm shadow-sm focus:ring-2 ring-pink-500 outline-none"
          />
          <IOSButton onClick={() => {
             const url = document.getElementById('plUrl').value;
             if(!url) return;
             const newPl = { id: Date.now(), name: "Nueva Playlist", url, platform: 'spotify' };
             updateData('playlists', { items: [...(data.playlists.items || []), newPl] });
             document.getElementById('plUrl').value = '';
          }}>
             <Plus size={20} />
          </IOSButton>
       </div>

       <div className="space-y-4">
          {(data.playlists.items || []).map(item => (
             <div key={item.id} className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                {item.url.includes('spotify') ? (
                   <iframe 
                      style={{borderRadius: '12px'}} 
                      src={getEmbedUrl(item.url)} 
                      width="100%" 
                      height="80" 
                      frameBorder="0" 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                   ></iframe>
                ) : (
                   <IOSCard onClick={() => window.open(item.url, '_blank')} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Music className="text-pink-500" />
                         <span className="font-bold">{item.name}</span>
                      </div>
                      <ExternalLink size={16} className="text-slate-400" />
                   </IOSCard>
                )}
                <div className="bg-white dark:bg-slate-800 p-2 flex justify-end">
                   <button 
                     onClick={() => updateData('playlists', { items: data.playlists.items.filter(i => i.id !== item.id) })}
                     className="text-red-400 text-xs px-3 py-1"
                   >
                      Eliminar
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderOverthinking = () => (
    <div className={`h-full flex flex-col pb-24 transition-colors duration-500 ${data.overthinking.emergencyMode ? 'bg-red-50 dark:bg-red-950/30' : ''}`}>
       <IOSHeader title="Calma Mental" subtitle="Anti-Sobrepensar" />
       
       <IOSButton 
         onClick={() => updateData('overthinking', {...data.overthinking, emergencyMode: !data.overthinking.emergencyMode})}
         variant={data.overthinking.emergencyMode ? 'secondary' : 'danger'}
         size="lg"
         className="mb-8 shadow-xl"
       >
          {data.overthinking.emergencyMode ? "Desactivar SOS" : "🚨 MODO S.O.S."}
       </IOSButton>

       {data.overthinking.emergencyMode ? (
         <div className="animate-in zoom-in duration-300 space-y-4">
            <IOSCard className="border-l-4 border-red-500 bg-white dark:bg-slate-800">
               <h3 className="font-bold text-red-500 text-lg mb-2">Grounding 5-4-3-2-1</h3>
               <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                 <li>👀 5 cosas que ves ahora mismo.</li>
                 <li>✋ 4 cosas que puedes tocar.</li>
                 <li>👂 3 sonidos que escuchas.</li>
                 <li>👃 2 olores que percibes.</li>
                 <li>👅 1 sabor o sensación en tu boca.</li>
               </ul>
            </IOSCard>
            <IOSCard>
               <h3 className="font-bold mb-2 text-center">Respiración 4-4-4</h3>
               <div className="flex justify-center my-4">
                  <div className="w-32 h-32 border-4 border-blue-400 rounded-full animate-[pulse_4s_ease-in-out_infinite] flex items-center justify-center text-blue-500 font-bold text-xl bg-blue-50 dark:bg-blue-900/20">
                     Inhala
                  </div>
               </div>
               <p className="text-center text-xs text-slate-500">Sigue el ritmo del círculo</p>
            </IOSCard>
         </div>
       ) : (
         <div className="space-y-6">
            {/* Worry Time */}
            <IOSCard className="bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800">
               <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-orange-700 dark:text-orange-400 flex items-center gap-2">
                     <Clock size={18} /> Worry Time
                  </h3>
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">15 min</span>
               </div>
               <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Si te preocupas ahora, anótalo y déjalo para tu "Worry Time".
               </p>
               {isWorrying ? (
                  <div className="text-center">
                     <div className="text-4xl font-mono font-bold text-orange-600 mb-2">
                        {Math.floor(worryTimer / 60)}:{(worryTimer % 60).toString().padStart(2, '0')}
                     </div>
                     <IOSButton onClick={() => setIsWorrying(false)} variant="secondary" size="sm">Detener</IOSButton>
                  </div>
               ) : (
                  <IOSButton onClick={() => { setWorryTimer(900); setIsWorrying(true); }} className="w-full bg-orange-500 hover:bg-orange-600">
                     Iniciar Temporizador
                  </IOSButton>
               )}
            </IOSCard>

            {/* Thought Record */}
            <IOSCard>
               <h3 className="font-bold mb-4 flex gap-2 items-center"><Brain size={18} /> Registro de Pensamientos</h3>
               <div className="space-y-3">
                  <input placeholder="Pensamiento Intrusivo..." className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-none text-sm" />
                  <div className="grid grid-cols-2 gap-2">
                     <textarea placeholder="Evidencia A FAVOR" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-none text-xs h-20 resize-none" />
                     <textarea placeholder="Evidencia EN CONTRA" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-none text-xs h-20 resize-none" />
                  </div>
                  <IOSButton size="lg" variant="primary">Guardar Análisis</IOSButton>
               </div>
            </IOSCard>
         </div>
       )}
    </div>
  );

  const renderGymEvolution = () => (
    <div className="space-y-6 pb-24">
      <IOSHeader title="Gym Evolution" subtitle={`Semana ${data.gym.week}`} />
      <div className="space-y-4">
        {data.gym.dias.map((dia, idx) => (
           <IOSCard key={dia.id} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex justify-between items-center mb-3 pl-2">
                 <h4 className="font-bold text-lg">{dia.name}</h4>
                 <button 
                   onClick={() => addToCalendar(`Entreno: ${dia.name}`, "A darle duro.")}
                   className="text-blue-500"
                 >
                   <CalendarIcon size={20} />
                 </button>
              </div>
              <div className="space-y-2 pl-2">
                 {dia.exercises.map((ex, i) => (
                    <div key={i} className="flex justify-between text-sm text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700/50 last:border-0 pb-1">
                       <span>{ex.name}</span>
                       <span className="font-mono text-slate-400">{ex.sets}x{ex.reps} • {ex.weight}</span>
                    </div>
                 ))}
              </div>
           </IOSCard>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 pb-24">
      <IOSHeader title="Perfil" subtitle="Ajustes" />
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
         <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-700">
             <div className="flex items-center gap-3">
                <Bell size={20} className="text-slate-400" />
                <span>Notificaciones Push</span>
             </div>
             <button onClick={handleNotificationRequest} className="text-blue-500 text-sm font-bold">Activar</button>
         </div>
         <div className="p-4 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <Moon size={20} className="text-slate-400" />
                <span>Modo Oscuro</span>
             </div>
             <div onClick={toggleTheme} className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 cursor-pointer ${darkMode ? 'bg-green-500' : 'bg-slate-300'}`}>
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-5' : ''}`}></div>
             </div>
         </div>
      </div>
    </div>
  );

  // --- RENDERER ROUTER ---

  const renderActiveView = () => {
    if (activeModule) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 animate-in slide-in-from-right duration-300">
          <button onClick={() => setActiveModule(null)} className="mb-4 flex items-center gap-1 text-blue-600 font-medium active:opacity-50">
             <ChevronLeft size={20} /> Volver
          </button>
          {activeModule === 'gym' && renderGymEvolution()}
          {activeModule === 'security' && renderSecurity()}
          {activeModule === 'playlists' && renderPlaylists()}
          {activeModule === 'overthinking' && renderOverthinking()}
          {/* Add other modules here */}
          {!['gym', 'security', 'playlists', 'overthinking'].includes(activeModule) && (
             <div className="text-center pt-20 text-slate-400">
                <Activity size={48} className="mx-auto mb-4 opacity-50" />
                <p>Módulo {activeModule} en construcción</p>
             </div>
          )}
        </div>
      );
    }

    switch(activeTab) {
      case 'dashboard': return <div className="p-4">{renderDashboard()}</div>;
      case 'tools': return (
         <div className="p-4 space-y-4 pb-24">
            <IOSHeader title="Herramientas" subtitle="Todo lo que necesitas" />
            <div className="grid grid-cols-2 gap-4">
               {[
                  { id: 'gym', icon: Dumbbell, label: 'Gym', color: 'text-orange-500' },
                  { id: 'habits', icon: CheckSquare, label: 'Hábitos', color: 'text-green-500' },
                  { id: 'finance', icon: Wallet, label: 'Finanzas', color: 'text-blue-500' },
                  { id: 'overthinking', icon: Brain, label: 'Calma', color: 'text-purple-500' },
                  { id: 'playlists', icon: Headphones, label: 'Música', color: 'text-pink-500' },
                  { id: 'security', icon: ShieldAlert, label: 'Seguridad', color: 'text-indigo-500' },
                  { id: 'knowledge', icon: BookOpen, label: 'Saber', color: 'text-teal-500' },
                  { id: 'project', icon: Target, label: 'Proyecto', color: 'text-red-500' },
               ].map(mod => (
                  <IOSCard key={mod.id} onClick={() => setActiveModule(mod.id)} className="flex items-center gap-3 active:scale-95 cursor-pointer">
                     <mod.icon className={mod.color} size={24} />
                     <span className="font-semibold text-sm">{mod.label}</span>
                  </IOSCard>
               ))}
            </div>
         </div>
      );
      case 'profile': return <div className="p-4">{renderSettings()}</div>;
      default: return null;
    }
  };

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-200 dark:selection:bg-blue-900 transition-colors duration-300 ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-slate-50 dark:bg-slate-900 overflow-hidden">
         {renderActiveView()}
         {!activeModule && (
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
               <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-6 pt-2 px-6 flex justify-between items-center z-50">
                  <button onClick={() => { triggerHaptic(); setActiveTab('dashboard'); }} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-slate-400'}`}>
                     <Activity size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
                     <span className="text-[10px] font-medium">Hoy</span>
                  </button>
                  <button onClick={() => { triggerHaptic(); setActiveTab('tools'); }} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'tools' ? 'text-blue-500' : 'text-slate-400'}`}>
                     <Compass size={24} strokeWidth={activeTab === 'tools' ? 2.5 : 2} />
                     <span className="text-[10px] font-medium">Explorar</span>
                  </button>
                  <button onClick={() => { triggerHaptic(); setActiveTab('profile'); }} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-blue-500' : 'text-slate-400'}`}>
                     <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
                     <span className="text-[10px] font-medium">Perfil</span>
                  </button>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
