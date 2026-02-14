/**
 * gymService.js — Firebase CRUD para el módulo Gym
 * 
 * Colecciones:
 *   /artifacts/{appId}/users/{userId}/gym/currentCycle
 *   /artifacts/{appId}/users/{userId}/gym/evaluation
 *   /artifacts/{appId}/users/{userId}/gym/sessions/{sessionId}
 *   /artifacts/{appId}/users/{userId}/gym/prs/{exerciseId}
 */

import { db, APP_ID } from '../../../firebase/config';
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  addDoc, collection, query, orderBy, getDocs,
  where, serverTimestamp, Timestamp, limit
} from 'firebase/firestore';

// ── Base path ─────────────────────────────────────────────
const gymBase = (userId) => `artifacts/${APP_ID}/users/${userId}/gym`;

// ════════════════════════════════════════════════════════════
// EVALUACIÓN (perfil del usuario)
// ════════════════════════════════════════════════════════════

export const saveEvaluation = async (userId, evaluation) => {
  const ref = doc(db, gymBase(userId), 'evaluation');
  await setDoc(ref, {
    ...evaluation,
    lastUpdated: serverTimestamp()
  }, { merge: true });
};

export const getEvaluation = async (userId) => {
  const ref = doc(db, gymBase(userId), 'evaluation');
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

// ════════════════════════════════════════════════════════════
// CICLOS DE 30 DÍAS
// ════════════════════════════════════════════════════════════

export const createNewCycle = async (userId, cycleData) => {
  const ref = doc(db, gymBase(userId), 'currentCycle');
  await setDoc(ref, {
    ...cycleData,
    createdAt: serverTimestamp()
  });
};

export const getCurrentCycle = async (userId) => {
  const ref = doc(db, gymBase(userId), 'currentCycle');
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateCycle = async (userId, updates) => {
  const ref = doc(db, gymBase(userId), 'currentCycle');
  await updateDoc(ref, updates);
};

export const updateCycleStatus = async (userId, status) => {
  await updateCycle(userId, { status });
};

// ════════════════════════════════════════════════════════════
// SESIONES DE ENTRENAMIENTO
// ════════════════════════════════════════════════════════════

export const saveSession = async (userId, sessionData) => {
  const sessionsRef = collection(db, gymBase(userId), 'sessions', 'list');
  const docRef = await addDoc(sessionsRef, {
    ...sessionData,
    createdAt: serverTimestamp()
  });

  // Incrementar completedSessions en el ciclo
  const cycle = await getCurrentCycle(userId);
  if (cycle && cycle.status === 'active') {
    const completed = (cycle.completedSessions || 0) + 1;
    const total = cycle.totalSessions || 1;
    await updateCycle(userId, {
      completedSessions: completed,
      progressPercent: Math.round((completed / total) * 100)
    });
  }

  return { id: docRef.id, ...sessionData };
};

export const getSessions = async (userId) => {
  const sessionsRef = collection(db, gymBase(userId), 'sessions', 'list');
  const q = query(sessionsRef, orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getSessionsByMonth = async (userId, year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  const sessionsRef = collection(db, gymBase(userId), 'sessions', 'list');
  const q = query(
    sessionsRef,
    where('date', '>=', start.toISOString()),
    where('date', '<=', end.toISOString()),
    orderBy('date', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ════════════════════════════════════════════════════════════
// PERSONAL RECORDS (PRs)
// ════════════════════════════════════════════════════════════

export const updatePR = async (userId, exerciseId, weight) => {
  const ref = doc(db, gymBase(userId), 'prs', 'records', exerciseId);
  const snap = await getDoc(ref);
  const today = new Date().toISOString().split('T')[0];

  if (snap.exists()) {
    const existing = snap.data();
    const history = [...(existing.history || []), { weight, date: today }];
    await updateDoc(ref, { weight, date: today, history });
  } else {
    await setDoc(ref, {
      weight,
      date: today,
      history: [{ weight, date: today }]
    });
  }
};

export const getPRs = async (userId) => {
  const prsRef = collection(db, gymBase(userId), 'prs', 'records');
  const snap = await getDocs(prsRef);
  const prs = {};
  snap.docs.forEach(d => {
    prs[d.id] = { id: d.id, ...d.data() };
  });
  return prs;
};

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

export const getNextCycleNumber = async (userId) => {
  const cycle = await getCurrentCycle(userId);
  return cycle ? (cycle.cycleNumber || 0) + 1 : 1;
};
