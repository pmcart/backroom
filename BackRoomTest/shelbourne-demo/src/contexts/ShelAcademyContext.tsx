// Shelbourne FC Academy — Shared Demo State Context
// Connects IDPs, Session Plans, Wellness Check-ins, and Dashboards.

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { IDPFull, IDPSummary } from '@data/idpData';
import type { ShelPlan } from '@data/shelbourneSessionData';
import { shelIDPSummaries } from '@data/shelbourneData';
import { shelDetailedIDPs } from '@data/shelbourneIDPData';
import { initialShelPlans } from '@data/shelbourneSessionData';

// ── Wellness Check-in Types ─────────────────────────────
export interface WellnessCheckin {
  id: string;
  playerId: string;
  playerName: string;
  ageGroup: string;
  date: string;
  wellness: { sleep: number; nutrition: number; hydration: number; recovery: number; mood: number };
  meals: { breakfast: string; lunch: string; dinner: string; snacks: string };
  waterLitres: string;
  sleepDetail: { hours: string; bedtime: string; wakeTime: string };
  notes: string;
  overallLevel: 'green' | 'amber' | 'red';
}

// ── Pre-filled wellness check-ins ───────────────────────
const defaultCheckins: WellnessCheckin[] = [
  { id: 'wc-1', playerId: 'sb13', playerName: 'Aaron Connolly', ageGroup: 'U17 Boys', date: '2025-03-10', wellness: { sleep: 4, nutrition: 4, hydration: 5, recovery: 4, mood: 5 }, meals: { breakfast: 'yes', lunch: 'yes', dinner: 'yes', snacks: 'healthy' }, waterLitres: '2.5', sleepDetail: { hours: '8', bedtime: '22:30', wakeTime: '06:30' }, notes: '', overallLevel: 'green' },
  { id: 'wc-2', playerId: 'sb14', playerName: 'Dylan Watts', ageGroup: 'U17 Boys', date: '2025-03-10', wellness: { sleep: 4, nutrition: 4, hydration: 4, recovery: 4, mood: 4 }, meals: { breakfast: 'yes', lunch: 'yes', dinner: 'yes', snacks: 'healthy' }, waterLitres: '2.0', sleepDetail: { hours: '8.5', bedtime: '22:00', wakeTime: '06:30' }, notes: '', overallLevel: 'green' },
  { id: 'wc-3', playerId: 'sb15', playerName: 'Jamie McGrath', ageGroup: 'U17 Boys', date: '2025-03-08', wellness: { sleep: 2, nutrition: 3, hydration: 3, recovery: 2, mood: 2 }, meals: { breakfast: 'yes', lunch: 'no', dinner: 'yes', snacks: 'mixed' }, waterLitres: '1.0', sleepDetail: { hours: '5.5', bedtime: '00:30', wakeTime: '06:00' }, notes: 'Knee still sore. Not sleeping well.', overallLevel: 'red' },
  { id: 'wc-4', playerId: 'sb16', playerName: 'Shane Farrell', ageGroup: 'U17 Boys', date: '2025-03-10', wellness: { sleep: 4, nutrition: 4, hydration: 4, recovery: 4, mood: 4 }, meals: { breakfast: 'yes', lunch: 'yes', dinner: 'yes', snacks: 'healthy' }, waterLitres: '2.0', sleepDetail: { hours: '7.5', bedtime: '23:00', wakeTime: '06:30' }, notes: '', overallLevel: 'green' },
  { id: 'wc-5', playerId: 'sb18', playerName: 'Daniel Grant', ageGroup: 'U17 Boys', date: '2025-03-10', wellness: { sleep: 3, nutrition: 3, hydration: 4, recovery: 3, mood: 4 }, meals: { breakfast: 'yes', lunch: 'yes', dinner: 'no', snacks: 'mixed' }, waterLitres: '1.5', sleepDetail: { hours: '6.5', bedtime: '23:30', wakeTime: '06:00' }, notes: '', overallLevel: 'amber' },
  { id: 'wc-6', playerId: 'sb17', playerName: 'Kevin O\'Connor', ageGroup: 'U17 Boys', date: '2025-03-09', wellness: { sleep: 2, nutrition: 3, hydration: 3, recovery: 3, mood: 3 }, meals: { breakfast: 'no', lunch: 'yes', dinner: 'yes', snacks: 'processed' }, waterLitres: '1.0', sleepDetail: { hours: '5', bedtime: '01:00', wakeTime: '06:00' }, notes: 'Stayed up late studying.', overallLevel: 'red' },
  // U14
  { id: 'wc-7', playerId: 'sb1', playerName: 'Cian Murphy', ageGroup: 'U14 Boys', date: '2025-03-10', wellness: { sleep: 5, nutrition: 4, hydration: 5, recovery: 5, mood: 5 }, meals: { breakfast: 'yes', lunch: 'yes', dinner: 'yes', snacks: 'healthy' }, waterLitres: '2.0', sleepDetail: { hours: '9', bedtime: '21:30', wakeTime: '06:30' }, notes: '', overallLevel: 'green' },
  // U19
  { id: 'wc-8', playerId: 'sb19', playerName: 'Liam Burt', ageGroup: 'U19 Boys', date: '2025-03-10', wellness: { sleep: 4, nutrition: 5, hydration: 5, recovery: 4, mood: 5 }, meals: { breakfast: 'yes', lunch: 'yes', dinner: 'yes', snacks: 'healthy' }, waterLitres: '3.0', sleepDetail: { hours: '8', bedtime: '22:00', wakeTime: '06:00' }, notes: '', overallLevel: 'green' },
];

// ── Context Shape ────────────────────────────────────────
interface ShelAcademyState {
  // IDPs
  idpSummaries: IDPSummary[];
  detailedIDPs: Record<string, IDPFull>;
  updateIDP: (idp: IDPFull) => void;
  addIDP: (idp: IDPFull) => void;
  deleteIDP: (id: string) => void;

  // Session Plans
  plans: ShelPlan[];
  addPlan: (plan: ShelPlan) => void;
  updatePlan: (plan: ShelPlan) => void;
  deletePlan: (id: string) => void;
  setPlans: (plans: ShelPlan[]) => void;

  // Wellness Check-ins
  checkins: WellnessCheckin[];
  addCheckin: (checkin: WellnessCheckin) => void;
  getPlayerCheckin: (playerId: string) => WellnessCheckin | undefined;
  getPlayerWellnessLevel: (playerId: string) => 'green' | 'amber' | 'red' | 'none';

  // Cross-module queries
  getLinkedSessions: (idpGoalId: string) => ShelPlan[];
  getRedFlagPlayers: () => WellnessCheckin[];
}

const ShelAcademyContext = createContext<ShelAcademyState | null>(null);

export const useShelAcademy = () => {
  const ctx = useContext(ShelAcademyContext);
  if (!ctx) throw new Error('useShelAcademy must be used within ShelAcademyProvider');
  return ctx;
};

export const ShelAcademyProvider = ({ children }: { children: ReactNode }) => {
  const [idpSummaries, setIdpSummaries] = useState<IDPSummary[]>([...shelIDPSummaries]);
  const [detailedIDPs, setDetailedIDPs] = useState<Record<string, IDPFull>>({ ...shelDetailedIDPs });
  const [plans, setPlansState] = useState<ShelPlan[]>([...initialShelPlans]);
  const [checkins, setCheckins] = useState<WellnessCheckin[]>(defaultCheckins);

  // ── IDP operations ─────────────────────────────────────
  const updateIDP = useCallback((idp: IDPFull) => {
    setDetailedIDPs(prev => ({ ...prev, [idp.id]: idp }));
    setIdpSummaries(prev => prev.map(s => s.id === idp.id ? {
      ...s, status: idp.status,
      overallProgress: idp.goals.length > 0 ? Math.round(idp.goals.reduce((a, g) => a + g.progress, 0) / idp.goals.length) : 0,
      goalsAtRisk: idp.goals.filter(g => g.status === 'at-risk').length,
      goalsOnTrack: idp.goals.filter(g => g.status === 'on-track' || g.status === 'completed').length,
    } : s));
  }, []);

  const addIDP = useCallback((idp: IDPFull) => {
    setDetailedIDPs(prev => ({ ...prev, [idp.id]: idp }));
    const summary: IDPSummary = {
      id: idp.id, playerName: idp.playerName, position: idp.position,
      ageGroup: idp.ageGroup, overallProgress: 0, status: idp.status,
      nextReviewDate: idp.nextReviewDate, goalsAtRisk: 0, goalsOnTrack: 0, mode: idp.mode,
    };
    setIdpSummaries(prev => [summary, ...prev]);
  }, []);

  const deleteIDP = useCallback((id: string) => {
    setDetailedIDPs(prev => { const u = { ...prev }; delete u[id]; return u; });
    setIdpSummaries(prev => prev.filter(s => s.id !== id));
  }, []);

  // ── Plan operations ────────────────────────────────────
  const addPlan = useCallback((plan: ShelPlan) => setPlansState(prev => [plan, ...prev]), []);
  const updatePlan = useCallback((plan: ShelPlan) => setPlansState(prev => prev.map(p => p.id === plan.id ? plan : p)), []);
  const deletePlan = useCallback((id: string) => setPlansState(prev => prev.filter(p => p.id !== id)), []);
  const setPlans = useCallback((p: ShelPlan[]) => setPlansState(p), []);

  // ── Wellness operations ────────────────────────────────
  const addCheckin = useCallback((checkin: WellnessCheckin) => {
    setCheckins(prev => {
      // Replace existing for same player on same date, or add
      const existing = prev.findIndex(c => c.playerId === checkin.playerId && c.date === checkin.date);
      if (existing >= 0) { const u = [...prev]; u[existing] = checkin; return u; }
      return [checkin, ...prev];
    });
  }, []);

  const getPlayerCheckin = useCallback((playerId: string) => {
    return checkins.find(c => c.playerId === playerId);
  }, [checkins]);

  const getPlayerWellnessLevel = useCallback((playerId: string): 'green' | 'amber' | 'red' | 'none' => {
    const c = checkins.find(ch => ch.playerId === playerId);
    if (!c) return 'none';
    return c.overallLevel;
  }, [checkins]);

  // ── Cross-module queries ───────────────────────────────
  const getLinkedSessions = useCallback((idpGoalId: string): ShelPlan[] => {
    return plans.filter(p => {
      if (p.session?.linkedIDPObjectives?.includes(idpGoalId)) return true;
      if (p.weeklyPlan?.days?.some(d => d.linkedIDPObjectives.includes(idpGoalId))) return true;
      if (p.blockPlan?.weeks?.some(w => w.days.some(d => d.linkedIDPObjectives.includes(idpGoalId)))) return true;
      return false;
    });
  }, [plans]);

  const getRedFlagPlayers = useCallback((): WellnessCheckin[] => {
    return checkins.filter(c => c.overallLevel === 'red');
  }, [checkins]);

  return (
    <ShelAcademyContext.Provider value={{
      idpSummaries, detailedIDPs, updateIDP, addIDP, deleteIDP,
      plans, addPlan, updatePlan, deletePlan, setPlans,
      checkins, addCheckin, getPlayerCheckin, getPlayerWellnessLevel,
      getLinkedSessions, getRedFlagPlayers,
    }}>
      {children}
    </ShelAcademyContext.Provider>
  );
};
