// Shelbourne FC Academy — Full IDP sample data per age group
// Demo prototype — illustrative content only.

import type { IDPFull } from './idpData';

// ── U14 Example: Cian Murphy (Striker) ─────────────────
export const shelIDPCianMurphy: IDPFull = {
  id: 'sidp14',
  playerId: 'sb1',
  playerName: 'Cian Murphy',
  position: 'Striker',
  ageGroup: 'U14 Boys',
  mode: 'basic',
  createdDate: '2025-01-20',
  lastReviewDate: '2025-03-01',
  nextReviewDate: '2025-04-15',
  status: 'active',
  overallProgress: 35,
  goals: [
    {
      id: 'u14-g1', category: 'technical', title: 'Receiving on the Half-Turn',
      description: 'Develop the ability to receive the ball on the half-turn with both feet, creating forward momentum rather than turning back to goal.',
      targetDate: '2025-06-01', progress: 30, status: 'in-progress',
      actions: ['Focused receiving exercises in warm-up (daily)', 'Video clips of LOI first-team movement'],
      evidence: ['Showed improvement in last two small-sided games'], coachRating: 2, playerRating: 3,
    },
    {
      id: 'u14-g2', category: 'physical', title: 'Coordination & Balance',
      description: 'Improve body coordination during quick changes of direction. Focus on balance when striking the ball.',
      targetDate: '2025-05-15', progress: 40, status: 'on-track',
      actions: ['Agility ladder and balance drills (2x week)', 'Incorporate balance work into warm-up'],
      evidence: ['S&C coach noted improved change-of-direction speed'], coachRating: 3, playerRating: 3,
    },
    {
      id: 'u14-g3', category: 'lifestyle', title: 'Consistent Hydration',
      description: 'Drink at least 1.5 litres of water daily and bring a filled water bottle to every session.',
      targetDate: '2025-04-01', progress: 60, status: 'on-track',
      actions: ['Track daily water intake', 'Bring water bottle to school and training'],
      evidence: ['Improved check-in hydration scores over 4 weeks'], coachRating: 3, playerRating: 4,
    },
  ],
  coachComments: [
    { id: 'u14-cc1', author: 'Johnny McDonnell', role: 'coach', date: '2025-03-01', content: 'Cian is settling well into the academy environment. His enthusiasm is excellent — the key now is developing his technical foundation, particularly receiving under pressure. Physically he is developing well for his age.' },
  ],
  playerReflections: [
    { id: 'u14-pr1', date: '2025-03-07', weekNumber: 8, whatWentWell: 'Scored two goals in the small-sided game. Felt faster in the agility drill.', whatToImprove: 'Need to remember to turn with the ball instead of passing backwards.', focusForNextWeek: 'Try to receive on the half-turn in every drill.', mood: 4 },
  ],
};

// ── U15 Example: Conor Daly (Striker) ──────────────────
export const shelIDPConorDaly: IDPFull = {
  id: 'sidp10',
  playerId: 'sb7',
  playerName: 'Conor Daly',
  position: 'Striker',
  ageGroup: 'U15 Boys',
  mode: 'basic',
  createdDate: '2025-01-10',
  lastReviewDate: '2025-02-28',
  nextReviewDate: '2025-04-15',
  status: 'active',
  overallProgress: 48,
  goals: [
    {
      id: 'u15-g1', category: 'technical', title: 'Weak Foot Passing Accuracy',
      description: 'Improve left foot passing to become more comfortable playing with both feet in game situations.',
      targetDate: '2025-06-01', progress: 45, status: 'on-track',
      actions: ['Left foot only passing in rondos (2x week)', 'Extra 10 mins after training on left foot delivery'],
      evidence: ['Left foot pass completion up from 40% to 55% in training games'], coachRating: 3, playerRating: 3,
    },
    {
      id: 'u15-g2', category: 'tactical', title: 'Positional Awareness in Build-Up',
      description: 'Understand when to drop deep to link play and when to stay high to stretch the opposition defence.',
      targetDate: '2025-05-01', progress: 35, status: 'at-risk',
      actions: ['Study video clips of striker positioning', 'Coach cues during positional games'],
      evidence: ['Starting to recognise triggers but not yet consistent'], coachRating: 2, playerRating: 2,
    },
    {
      id: 'u15-g3', category: 'psychological', title: 'Resilience After Setbacks',
      description: 'Maintain focus and positive body language after missed chances or losing possession.',
      targetDate: '2025-05-15', progress: 50, status: 'on-track',
      actions: ['Mental reset routine after mistakes', 'Discuss with welfare officer'],
      evidence: ['Showed improved reaction in last match after early miss'], coachRating: 3, playerRating: 3,
    },
  ],
  coachComments: [
    { id: 'u15-cc1', author: 'Paul Doolin', role: 'coach', date: '2025-02-28', content: 'Conor is a natural finisher who needs to develop a broader game. Positional understanding is the key area — he tends to ball-watch rather than anticipate. Weak foot is improving with dedicated practice.' },
  ],
  playerReflections: [
    { id: 'u15-pr1', date: '2025-03-05', weekNumber: 9, whatWentWell: 'Scored with my left foot in training for the first time. Felt good.', whatToImprove: 'I drop too deep sometimes and then cannot get back in time for chances.', focusForNextWeek: 'Stay high unless the coach specifically asks me to come short.', mood: 4 },
  ],
};

// ── U19 Example: Liam Burt (Winger) ────────────────────
export const shelIDPLiamBurt: IDPFull = {
  id: 'sidp6',
  playerId: 'sb19',
  playerName: 'Liam Burt',
  position: 'Winger',
  ageGroup: 'U19 Boys',
  mode: 'elite',
  createdDate: '2025-01-05',
  lastReviewDate: '2025-03-01',
  nextReviewDate: '2025-04-10',
  status: 'active',
  overallProgress: 70,
  goals: [
    {
      id: 'u19-g1', category: 'tactical', title: 'Decision-Making in the Final Third',
      description: 'Improve the quality and timing of decisions when arriving in the final third — when to cross, shoot, or combine.',
      targetDate: '2025-05-01', progress: 55, status: 'on-track',
      actions: ['Video review of final-third decisions (weekly)', 'In-game coaching cues from touchline', 'Practice crossing vs shooting scenarios'],
      evidence: ['Assist-to-cross ratio improved', 'Coach noted better decision-making vs Dundalk'], coachRating: 3, playerRating: 4,
    },
    {
      id: 'u19-g2', category: 'physical', title: 'Repeated Sprint Capacity',
      description: 'Maintain top-end speed throughout the full 90 minutes. Reduce drop-off in sprint output in the final 15 minutes.',
      targetDate: '2025-04-30', progress: 70, status: 'on-track',
      actions: ['Interval running 2x week with S&C', 'GPS data review after each match', 'Nutrition timing around training'],
      evidence: ['GPS data shows improved high-speed running in 75-90 min bracket', 'Sprint count in final 15 mins up by 18%'], coachRating: 4, playerRating: 4,
    },
    {
      id: 'u19-g3', category: 'technical', title: '1v1 Finishing',
      description: 'Improve composure and technique when through on goal in 1v1 situations with the goalkeeper.',
      targetDate: '2025-05-15', progress: 65, status: 'on-track',
      actions: ['Extra finishing sessions (2x week)', 'Video study of elite wingers in 1v1s', 'Practice different finishes: chip, side-foot, driven'],
      evidence: ['Scored in 1v1 vs Drogheda — composed finish', 'Conversion rate up from 20% to 35%'], coachRating: 4, playerRating: 3,
    },
    {
      id: 'u19-g4', category: 'psychological', title: 'Leadership & Communication',
      description: 'Develop on-pitch leadership as a senior academy player. Communicate more during defensive transitions.',
      targetDate: '2025-06-01', progress: 60, status: 'on-track',
      actions: ['Captain armband in selected matches', 'Pre-match team talk responsibility', 'Feedback from teammates monthly'],
      evidence: ['Positive feedback from squad survey', 'Led warm-up independently for first time'], coachRating: 3, playerRating: 3,
    },
    {
      id: 'u19-g5', category: 'lifestyle', title: 'Career Planning & Education',
      description: 'Balance football development with post-Leaving Cert education planning. Engage with career support services.',
      targetDate: '2025-06-30', progress: 80, status: 'on-track',
      actions: ['Monthly meeting with education officer', 'Explore Sports Science course options', 'Complete financial literacy module'],
      evidence: ['Applied to TU Dublin Sports Science programme', 'Completed financial literacy module'], coachRating: 5, playerRating: 5,
    },
  ],
  coachComments: [
    { id: 'u19-cc1', author: 'Joey O\'Brien', role: 'coach', date: '2025-03-01', content: "Liam is performing at a level that warrants first-team consideration. His final-third decision-making is the last piece — when that clicks consistently, he's ready. Excellent attitude and professionalism." },
    { id: 'u19-cc2', author: 'Damien Duff', role: 'head-of-academy', date: '2025-02-10', content: 'Liam sets the standard for the academy. His commitment to education alongside football is exactly the model we want. Keep pushing on the tactical side.' },
  ],
  playerReflections: [
    { id: 'u19-pr1', date: '2025-03-07', weekNumber: 10, whatWentWell: 'Felt sharp all game vs Dundalk. Made good decisions on when to go inside vs outside. Sprint data was strong.', whatToImprove: 'Still rushed one 1v1 — should have waited for the keeper to commit.', focusForNextWeek: 'Patience in 1v1s. Also need to prepare for the TU Dublin interview.', mood: 5 },
  ],
  holisticEvaluation: {
    technical: 8, tactical: 6, physical: 7, psychological: 7, lifestyle: 9,
    notes: 'Liam is the most complete academy player at U19 level. Technical ability is high. Tactical decision-making in the final third is the key development area before first-team transition.',
    date: '2025-03-01',
  },
  positionalProfile: {
    primaryPosition: 'Left Winger',
    secondaryPosition: 'Right Winger / Inside Forward',
    demands: [
      'Beat defender 1v1 consistently — both inside and outside',
      'End product in the final third — crosses, cut-backs, shots',
      'Defensive responsibility in transition — tracking back and pressing',
      'Off-the-ball movement to create overloads in wide areas',
    ],
  },
  performanceSupport: {
    physicalFocus: 'Repeated sprint capacity and high-speed endurance. Maintaining output in final 15 minutes of matches.',
    nutritionHabits: 'Excellent meal timing. Consistent pre-match and post-training nutrition. Well hydrated.',
    recoveryHabits: 'Consistent sleep (8+ hours). Uses ice baths post-match. Foam rolling and stretching daily.',
    psychologicalStrengthening: 'Building leadership confidence. Working on composure in high-pressure 1v1 situations in front of goal.',
  },
  offFieldDevelopment: {
    leadership: 'Captaining U19s regularly. Leading warm-ups and team meetings. Positive influence across the squad.',
    communication: 'Confident in group settings. Handles media interviews well. Supportive of younger players.',
    education: 'Applied to TU Dublin Sports Science. Leaving Certificate on track. Strong time management.',
    lifeSkills: 'Completed financial literacy module. Engaged with career planning support. Mature and professional.',
  },
  reviewHistory: [
    { id: 'u19-rh1', date: '2025-03-01', type: 'monthly', summary: 'Outstanding month. Sprint data improving. Decision-making in final third remains the primary focus. Education planning on track.', objectivesEdited: ['u19-g1'], archivedGoals: [] },
    { id: 'u19-rh2', date: '2025-02-01', type: 'monthly', summary: 'Strong pre-season block. 1v1 finishing showing improvement. Leadership growing naturally.', objectivesEdited: [], archivedGoals: [] },
  ],
  methodologyTags: ['mp-1', 'mp-5', 'mp-11', 'dp-tech', 'dp-tact', 'dp-phys', 'val-1', 'val-3'],
};

// Map of all detailed IDPs by id
export const shelDetailedIDPs: Record<string, IDPFull> = {};

// We also re-export shelMarcusIDP from shelbourneData as the U17 example
// and register all samples at import time.
import { shelMarcusIDP } from './shelbourneData';

// Register all sample IDPs
shelDetailedIDPs['sidp14'] = shelIDPCianMurphy;
shelDetailedIDPs['sidp10'] = shelIDPConorDaly;
shelDetailedIDPs['sidp1'] = shelMarcusIDP;
shelDetailedIDPs['sidp6'] = shelIDPLiamBurt;
