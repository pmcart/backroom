import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { MethodologyService } from '../../../core/services/methodology.service';
import {
  METHODOLOGY_TAGS,
  GAME_MODEL_PHASES,
  DEVELOPMENT_FRAMEWORK,
  GameModelPhase,
  AgeGroupFramework,
} from '../../../core/constants/methodology.constants';

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface PlayerPosition {
  id: string;
  position: string;
  ageGroups: string;
  roles: string;
  responsibilities: string;
  playerType: string;
  keyAttributes: string;
}

export interface EditableMethodology {
  philosophy: string;
  corePrinciples: { title: string; desc: string }[];
  nonNegotiables: string[];
  playerDevelopmentPhilosophy: string;
  playerPositions: PlayerPosition[];
  customSections: Record<string, CustomSection[]>;
}

const DEFAULT_DATA: EditableMethodology = {
  philosophy:
    'Shelbourne FC Academy is committed to developing technically excellent, tactically intelligent footballers ' +
    'who are brave on the ball and relentless without it. We play a possession-based, attacking style built from ' +
    'the back, with high pressing and fast transitions. Every player, regardless of age group, learns to play ' +
    'the Shelbourne way.',
  corePrinciples: [
    { title: 'Possession with Purpose',  desc: 'We keep the ball to create, not to keep it safe. Every pass should have intent.' },
    { title: 'Press & Recover',          desc: 'Win the ball back quickly and high. When we lose it, we react immediately.' },
    { title: 'Play Through the Lines',   desc: 'Build from the back. Find midfield. Arrive in the final third with numbers.' },
    { title: 'Positional Play',          desc: 'Structure creates freedom. Players must understand their position and the positions around them.' },
    { title: 'Attack with Width & Depth',desc: 'Stretch the pitch. Create overloads. Use the full playing area.' },
  ],
  nonNegotiables: [
    'Every player plays out from the back — no long balls to avoid pressure',
    'Counter-press within 5 seconds of losing possession',
    'Communication is constant — on and off the ball',
    'Respect the ball, your teammates, your opponents, and the officials',
    'Be on time, be prepared, be coachable',
    'Every training session is an opportunity to improve',
    'Support your teammates — on and off the pitch',
    'Lifestyle matters — nutrition, sleep, and education are part of development',
  ],
  playerDevelopmentPhilosophy:
    'We develop complete footballers — technically proficient, tactically intelligent, and mentally resilient. ' +
    'Every position in our system demands both attacking and defensive contribution. Our positional profiles define ' +
    'the type of player we want to develop at each position, ensuring clarity for coaches and clear development ' +
    'pathways for players.',
  playerPositions: [
    {
      id: 'pos-gk',
      position: 'Goalkeeper',
      ageGroups: 'All Age Groups',
      roles: 'Sweeper-keeper · Distributor · Last line of defence',
      responsibilities: 'Organise the defensive line. Play out from the back with short distribution. Be comfortable receiving under pressure. Command the penalty area.',
      playerType: 'A goalkeeper as comfortable with the ball at their feet as with their hands. A communicator and leader at the back — the first attacker when we have the ball.',
      keyAttributes: 'Distribution · Commanding presence · Decision-making · Feet quality · Shot-stopping',
    },
    {
      id: 'pos-cb',
      position: 'Centre-Back',
      ageGroups: 'All Age Groups',
      roles: 'Ball-playing defender · Organiser · 1v1 defender',
      responsibilities: 'Win aerial duels. Play out from the back. Organise the defensive line. Step into midfield with the ball when space is available.',
      playerType: 'Comfortable in possession, reads the game well, and leads by example. Not afraid to play the short pass and carry the ball forward when the opportunity arises.',
      keyAttributes: 'Composure on the ball · Aerial ability · Leadership · Positioning · Passing quality',
    },
    {
      id: 'pos-fb',
      position: 'Full-Back',
      ageGroups: 'U15+',
      roles: 'Overlapping outlet · Defensive support · Width provider',
      responsibilities: 'Provide width in possession. Support the winger on combinations. Defend 1v1 against pace. Contribute to build-up from deep.',
      playerType: 'Athletic, two-footed, and brave. Equally dangerous going forward as defensively sound. A modern full-back who contributes in all phases of play.',
      keyAttributes: 'Athleticism · Crossing · Defensive positioning · Decision-making in final third',
    },
    {
      id: 'pos-cm',
      position: 'Central Midfielder',
      ageGroups: 'All Age Groups',
      roles: 'Press resistance · Tempo controller · Box-to-box engine',
      responsibilities: 'Connect defence and attack. Receive under pressure and maintain possession. Cover the defensive line. Arrive in the box to support attacks.',
      playerType: 'The engine of the team. Mobile, intelligent, and technically excellent. Controls the tempo of the game and is always available to receive in tight spaces.',
      keyAttributes: 'Press resistance · Passing range · Work rate · Decision-making · Movement off the ball',
    },
    {
      id: 'pos-am',
      position: 'Attacking Midfielder',
      ageGroups: 'U17+',
      roles: 'Link player · Goal threat · Pressing starter',
      responsibilities: 'Find pockets between lines. Create for teammates and arrive in the box. Initiate the press and disrupt opposition build-up.',
      playerType: 'A creative, unpredictable player who thrives in tight spaces. Can go past opponents and has an eye for goal as well as the killer pass.',
      keyAttributes: 'Creativity · Dribbling in tight spaces · Final ball · Press initiation · Goal contribution',
    },
    {
      id: 'pos-winger',
      position: 'Winger',
      ageGroups: 'All Age Groups',
      roles: 'Width provider · 1v1 threat · Defensive tracking',
      responsibilities: 'Stretch the pitch. Take on opponents in 1v1 situations. Deliver crosses and cut inside to shoot. Track back and defend from the front.',
      playerType: 'Electric in transition. Loves the 1v1 and is a constant threat. Creates chaos for the opposition defence and works hard out of possession.',
      keyAttributes: 'Pace · Dribbling · Decision-making in final third · Defensive work rate · Delivery',
    },
    {
      id: 'pos-st',
      position: 'Striker',
      ageGroups: 'All Age Groups',
      roles: 'Goal scorer · Pressing trigger · Link-up focal point',
      responsibilities: 'Score goals. Lead the press from the front. Hold the ball up and bring midfielders into play. Make clever runs to stretch the defence.',
      playerType: 'A natural goal scorer with hunger and desire. Smart movement, clinical in front of goal, and a relentless work rate out of possession.',
      keyAttributes: 'Finishing · Movement · Pressing intensity · Hold-up play · Big game mentality',
    },
  ],
  customSections: {
    identity: [],
    'game-model': [],
    development: [],
    tags: [],
    profiles: [],
  },
};

@Component({
  selector: 'app-methodology',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet],
  templateUrl: './methodology.html',
  styleUrl: './methodology.scss',
})
export class Methodology implements OnInit {
  private methodologyService = inject(MethodologyService);

  activeTab = signal<'identity' | 'game-model' | 'development' | 'tags' | 'profiles'>('identity');
  expandedPrinciples = signal<Set<string>>(new Set());
  copiedTag = signal<string | null>(null);
  isEditing = signal(false);
  isSaving = signal(false);

  readonly tags = METHODOLOGY_TAGS;
  readonly phases: GameModelPhase[] = GAME_MODEL_PHASES;
  readonly framework: AgeGroupFramework[] = DEVELOPMENT_FRAMEWORK;

  readonly allTags = [
    ...METHODOLOGY_TAGS.principles,
    ...METHODOLOGY_TAGS.developmentPillars,
    ...METHODOLOGY_TAGS.values,
  ];

  data: EditableMethodology = structuredClone(DEFAULT_DATA);
  draft: EditableMethodology = structuredClone(DEFAULT_DATA);

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.methodologyService.get().subscribe({
      next: (config) => {
        // Merge API response over defaults so any missing fields fall back gracefully
        const merged = { ...structuredClone(DEFAULT_DATA), ...config };
        this.data = merged;
        this.draft = structuredClone(merged);
      },
    });
  }

  // ── Edit Mode ────────────────────────────────────────────────────────────────

  enterEditMode(): void {
    this.draft = structuredClone(this.data);
    this.isEditing.set(true);
  }

  saveChanges(): void {
    this.isSaving.set(true);
    this.methodologyService.save(this.draft).subscribe({
      next: (saved) => {
        this.data = { ...structuredClone(DEFAULT_DATA), ...saved };
        this.draft = structuredClone(this.data);
        this.isEditing.set(false);
        this.isSaving.set(false);
      },
      error: () => this.isSaving.set(false),
    });
  }

  cancelEdit(): void {
    this.draft = structuredClone(this.data);
    this.isEditing.set(false);
  }

  // ── Core Principles ──────────────────────────────────────────────────────────

  addPrinciple(): void {
    this.draft.corePrinciples.push({ title: 'New Principle', desc: '' });
  }

  removePrinciple(index: number): void {
    this.draft.corePrinciples.splice(index, 1);
  }

  // ── Non-Negotiables ──────────────────────────────────────────────────────────

  addNonNegotiable(): void {
    this.draft.nonNegotiables.push('');
  }

  removeNonNegotiable(index: number): void {
    this.draft.nonNegotiables.splice(index, 1);
  }

  // ── Custom Sections ──────────────────────────────────────────────────────────

  addCustomSection(tab: string): void {
    if (!this.draft.customSections[tab]) this.draft.customSections[tab] = [];
    this.draft.customSections[tab].push({ id: 'cs-' + Date.now(), title: 'New Section', content: '' });
  }

  removeCustomSection(tab: string, id: string): void {
    if (this.draft.customSections[tab]) {
      this.draft.customSections[tab] = this.draft.customSections[tab].filter(s => s.id !== id);
    }
  }

  getCustomSections(tab: string): CustomSection[] {
    return this.data.customSections[tab] ?? [];
  }

  getDraftCustomSections(tab: string): CustomSection[] {
    if (!this.draft.customSections[tab]) this.draft.customSections[tab] = [];
    return this.draft.customSections[tab];
  }

  // ── Player Profiles ──────────────────────────────────────────────────────────

  addPlayerPosition(): void {
    this.draft.playerPositions.push({
      id: 'pos-' + Date.now(),
      position: 'New Position',
      ageGroups: 'All Age Groups',
      roles: '',
      responsibilities: '',
      playerType: '',
      keyAttributes: '',
    });
  }

  removePlayerPosition(id: string): void {
    this.draft.playerPositions = this.draft.playerPositions.filter(p => p.id !== id);
  }

  // ── Accordion ────────────────────────────────────────────────────────────────

  togglePrinciple(key: string): void {
    const next = new Set(this.expandedPrinciples());
    next.has(key) ? next.delete(key) : next.add(key);
    this.expandedPrinciples.set(next);
  }

  isExpanded(key: string): boolean {
    return this.expandedPrinciples().has(key);
  }

  // ── Tags ─────────────────────────────────────────────────────────────────────

  copyTag(tagId: string): void {
    this.copiedTag.set(tagId);
    setTimeout(() => this.copiedTag.set(null), 1500);
  }

  isCopied(tagId: string): boolean {
    return this.copiedTag() === tagId;
  }

  // ── Print ────────────────────────────────────────────────────────────────────

  printMethodology(): void {
    window.print();
  }

  // ── Styling helpers ──────────────────────────────────────────────────────────

  pillarBadgeClass(pillar: string): string {
    switch (pillar) {
      case 'Technical':             return 'text-bg-success';
      case 'Tactical':              return 'text-bg-primary';
      case 'Physical':              return 'text-bg-info';
      case 'Psychological':         return 'text-bg-warning text-dark';
      case 'Lifestyle & Education': return 'text-bg-secondary';
      default:                      return 'text-bg-secondary';
    }
  }

  pillarTagClass(label: string): string {
    switch (label) {
      case 'Technical':             return 'badge-tech';
      case 'Tactical':              return 'badge-tact';
      case 'Physical':              return 'badge-phys';
      case 'Psychological':         return 'badge-psych';
      case 'Lifestyle & Education': return 'badge-life';
      default:                      return '';
    }
  }
}
