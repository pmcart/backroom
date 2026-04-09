import { Component, signal } from '@angular/core';
import {
  METHODOLOGY_TAGS,
  GAME_MODEL_PHASES,
  DEVELOPMENT_FRAMEWORK,
  GameModelPhase,
  AgeGroupFramework,
} from '../../../core/constants/methodology.constants';

@Component({
  selector: 'app-methodology',
  standalone: true,
  templateUrl: './methodology.html',
  styleUrl: './methodology.scss',
})
export class Methodology {
  activeTab = signal<'identity' | 'game-model' | 'development' | 'tags'>('identity');
  expandedPrinciples = signal<Set<string>>(new Set());
  copiedTag = signal<string | null>(null);

  readonly tags = METHODOLOGY_TAGS;
  readonly phases: GameModelPhase[] = GAME_MODEL_PHASES;
  readonly framework: AgeGroupFramework[] = DEVELOPMENT_FRAMEWORK;

  readonly allTags = [
    ...METHODOLOGY_TAGS.principles,
    ...METHODOLOGY_TAGS.developmentPillars,
    ...METHODOLOGY_TAGS.values,
  ];

  readonly corePrinciples = [
    { title: 'Possession with Purpose', desc: 'We keep the ball to create, not to keep it safe. Every pass should have intent.' },
    { title: 'Press & Recover',          desc: 'Win the ball back quickly and high. When we lose it, we react immediately.' },
    { title: 'Play Through the Lines',   desc: 'Build from the back. Find midfield. Arrive in the final third with numbers.' },
    { title: 'Positional Play',          desc: 'Structure creates freedom. Players must understand their position and the positions around them.' },
    { title: 'Attack with Width & Depth',desc: 'Stretch the pitch. Create overloads. Use the full playing area.' },
  ];

  readonly nonNegotiables = [
    'Every player plays out from the back — no long balls to avoid pressure',
    'Counter-press within 5 seconds of losing possession',
    'Communication is constant — on and off the ball',
    'Respect the ball, your teammates, your opponents, and the officials',
    'Be on time, be prepared, be coachable',
    'Every training session is an opportunity to improve',
    'Support your teammates — on and off the pitch',
    'Lifestyle matters — nutrition, sleep, and education are part of development',
  ];

  // ── Accordion ───────────────────────────────────────────────────────────────

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

  // ── Styling helpers ──────────────────────────────────────────────────────────

  pillarBadgeClass(pillar: string): string {
    switch (pillar) {
      case 'Technical':            return 'text-bg-success';
      case 'Tactical':             return 'text-bg-primary';
      case 'Physical':             return 'text-bg-info';
      case 'Psychological':        return 'text-bg-warning text-dark';
      case 'Lifestyle & Education':return 'text-bg-secondary';
      default:                     return 'text-bg-secondary';
    }
  }

  pillarTagClass(label: string): string {
    switch (label) {
      case 'Technical':            return 'badge-tech';
      case 'Tactical':             return 'badge-tact';
      case 'Physical':             return 'badge-phys';
      case 'Psychological':        return 'badge-psych';
      case 'Lifestyle & Education':return 'badge-life';
      default:                     return '';
    }
  }
}
