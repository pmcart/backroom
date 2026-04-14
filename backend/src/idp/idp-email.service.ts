import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class IdpEmailService {
  private readonly logger = new Logger(IdpEmailService.name);

  constructor(private config: ConfigService) {}

  async sendIdpEmail(idp: any, toAddress: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.config.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.config.get<string>('SMTP_USER', ''),
        pass: this.config.get<string>('SMTP_PASS', ''),
      },
    });

    const playerName = `${idp.player?.firstName ?? ''} ${idp.player?.lastName ?? ''}`.trim();
    const subject = `IDP Report — ${playerName} (${idp.squad?.name ?? ''})`;
    const html = this.buildHtml(idp, playerName);

    try {
      await transporter.sendMail({
        from: this.config.get<string>('SMTP_FROM', 'Backroom IDP <noreply@backroom.app>'),
        to: toAddress,
        subject,
        html,
      });
      this.logger.log(`IDP email sent to ${toAddress} for player ${playerName}`);
    } catch (err) {
      this.logger.error(`Failed to send IDP email: ${err.message}`);
      throw err;
    }
  }

  private buildHtml(idp: any, playerName: string): string {
    const statusColors: Record<string, string> = {
      'active': '#10b981', 'review-due': '#f59e0b', 'completed': '#6b7280',
    };
    const statusColor = statusColors[idp.status] ?? '#6b7280';
    const statusLabel = idp.status === 'active' ? 'Active'
      : idp.status === 'review-due' ? 'Review Due' : 'Completed';

    const goalsHtml = this.buildGoalsHtml(idp.goals ?? []);
    const swotHtml  = this.buildSwotHtml(idp.swot);
    const notesHtml = this.buildNotesHtml(idp.notes ?? []);
    const eliteHtml = idp.mode === 'elite' ? this.buildEliteHtml(idp) : '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IDP Report — ${playerName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
    .wrapper { max-width: 680px; margin: 24px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header  { background: #4f46e5; padding: 28px 32px; color: white; }
    .header h1 { margin: 0 0 4px; font-size: 22px; }
    .header p  { margin: 0; opacity: 0.8; font-size: 13px; }
    .body { padding: 28px 32px; }
    .meta-row { display: flex; gap: 24px; flex-wrap: wrap; margin: 16px 0 24px; }
    .meta-item { display: flex; flex-direction: column; gap: 2px; }
    .meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600; }
    .meta-value { font-size: 13px; color: #1e293b; font-weight: 500; }
    .status-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; color: white; background: ${statusColor}; }
    .progress-bar-wrap { background: #e2e8f0; border-radius: 4px; height: 8px; overflow: hidden; margin: 4px 0; }
    .progress-bar-fill  { height: 100%; border-radius: 4px; }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #4f46e5; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #e0e7ff; }
    .goal-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin-bottom: 8px; }
    .goal-title { font-weight: 600; font-size: 13px; }
    .goal-meta  { font-size: 11px; color: #64748b; margin-top: 4px; }
    .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .swot-cell { border-radius: 8px; padding: 12px; }
    .swot-cell.s { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .swot-cell.w { background: #fef2f2; border: 1px solid #fecaca; }
    .swot-cell.o { background: #eef2ff; border: 1px solid #c7d2fe; }
    .swot-cell.t { background: #fffbeb; border: 1px solid #fde68a; }
    .swot-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
    .swot-cell.s .swot-label { color: #059669; }
    .swot-cell.w .swot-label { color: #dc2626; }
    .swot-cell.o .swot-label { color: #4f46e5; }
    .swot-cell.t .swot-label { color: #d97706; }
    .swot-text { font-size: 12px; color: #475569; white-space: pre-wrap; margin: 0; }
    .note-card { border-left: 3px solid #c7d2fe; padding: 8px 12px; margin-bottom: 8px; background: #f8fafc; border-radius: 0 6px 6px 0; }
    .note-status { font-size: 10px; font-weight: 700; }
    .note-content { font-size: 12px; color: #475569; margin: 4px 0 0; }
    .pillar-label { font-size: 11px; font-weight: 700; color: #334155; margin: 12px 0 4px; }
    .footer { background: #f1f5f9; padding: 16px 32px; text-align: center; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>${playerName}</h1>
    <p>${idp.squad?.name ?? ''} &nbsp;·&nbsp; ${idp.mode === 'elite' ? 'Elite IDP' : 'Standard IDP'}</p>
  </div>
  <div class="body">

    <!-- Player meta -->
    <div class="meta-row">
      <div class="meta-item"><span class="meta-label">Status</span><span><span class="status-badge">${statusLabel}</span></span></div>
      <div class="meta-item"><span class="meta-label">Progress</span><span class="meta-value">${idp.progress}%</span></div>
      ${idp.ageGroup ? `<div class="meta-item"><span class="meta-label">Age Group</span><span class="meta-value">${idp.ageGroup}</span></div>` : ''}
      ${idp.reviewDate ? `<div class="meta-item"><span class="meta-label">Review Date</span><span class="meta-value">${this.fmtDate(idp.reviewDate)}</span></div>` : ''}
      ${idp.targetCompletionDate ? `<div class="meta-item"><span class="meta-label">Target Completion</span><span class="meta-value">${this.fmtDate(idp.targetCompletionDate)}</span></div>` : ''}
    </div>

    <!-- Progress bar -->
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" style="width:${idp.progress}%; background:${idp.progress >= 70 ? '#10b981' : idp.progress >= 40 ? '#f59e0b' : '#ef4444'}"></div>
    </div>

    ${goalsHtml}
    ${swotHtml}
    ${notesHtml}
    ${eliteHtml}

    ${idp.coachComments ? `
    <div class="section">
      <div class="section-title">Coach Comments</div>
      <p style="font-size:13px; color:#475569; white-space:pre-wrap; margin:0">${idp.coachComments}</p>
    </div>` : ''}

  </div>
  <div class="footer">
    Generated by Backroom &nbsp;·&nbsp; ${new Date().toLocaleDateString('en-IE')} &nbsp;·&nbsp; Confidential
  </div>
</div>
</body>
</html>`;
  }

  private buildGoalsHtml(goals: any[]): string {
    if (!goals.length) return '';

    const pillars: Record<string, string> = {
      technical: '⚽ Technical', tactical: '🧠 Tactical',
      physical: '💪 Physical', psychological: '🎯 Psychological', lifestyle: '📚 Lifestyle',
    };
    const byPillar: Record<string, any[]> = {};
    for (const g of goals) {
      const key = g.category ?? 'other';
      if (!byPillar[key]) byPillar[key] = [];
      byPillar[key].push(g);
    }

    const statusColors: Record<string, string> = {
      'on-track': '#10b981', 'at-risk': '#ef4444', 'completed': '#6b7280',
      'in-progress': '#4f46e5', 'not-started': '#94a3b8',
    };

    let html = `<div class="section"><div class="section-title">Development Goals</div>`;
    for (const [pillar, pGoals] of Object.entries(byPillar)) {
      html += `<div class="pillar-label">${pillars[pillar] ?? pillar}</div>`;
      for (const goal of pGoals) {
        const gc = statusColors[goal.status] ?? '#94a3b8';
        const gl = this.goalStatusLabel(goal.status);
        const pct = goal.progress ?? 0;
        const pc = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
        html += `
        <div class="goal-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start">
            <div class="goal-title">${goal.title}</div>
            <span style="font-size:10px; font-weight:700; color:${gc}; white-space:nowrap; margin-left:8px">${gl}</span>
          </div>
          ${goal.description ? `<div class="goal-meta">${goal.description}</div>` : ''}
          ${goal.kpi ? `<div class="goal-meta"><strong>KPI:</strong> ${goal.kpi}</div>` : ''}
          ${goal.targetDate ? `<div class="goal-meta"><strong>Target:</strong> ${this.fmtDate(goal.targetDate)}</div>` : ''}
          <div style="margin-top:8px">
            <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8; margin-bottom:3px">
              <span>Progress</span><span>${pct}%</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" style="width:${pct}%; background:${pc}"></div>
            </div>
          </div>
        </div>`;
      }
    }
    html += `</div>`;
    return html;
  }

  private buildSwotHtml(swot: any): string {
    if (!swot || !Object.values(swot).some((v: any) => v?.trim())) return '';
    return `
    <div class="section">
      <div class="section-title">SWOT Analysis</div>
      <div class="swot-grid">
        <div class="swot-cell s"><div class="swot-label">💪 Strengths</div><p class="swot-text">${swot.strengths || '—'}</p></div>
        <div class="swot-cell w"><div class="swot-label">⚠ Weaknesses</div><p class="swot-text">${swot.weaknesses || '—'}</p></div>
        <div class="swot-cell o"><div class="swot-label">🚀 Opportunities</div><p class="swot-text">${swot.opportunities || '—'}</p></div>
        <div class="swot-cell t"><div class="swot-label">🔻 Threats</div><p class="swot-text">${swot.threats || '—'}</p></div>
      </div>
    </div>`;
  }

  private buildNotesHtml(notes: any[]): string {
    if (!notes.length) return '';
    const noteColors: Record<string, string> = {
      'on-track': '#10b981', 'needs-attention': '#f59e0b', 'exceeding': '#4f46e5',
    };
    const noteLabels: Record<string, string> = {
      'on-track': 'On Track', 'needs-attention': 'Needs Attention', 'exceeding': 'Exceeding',
    };
    let html = `<div class="section"><div class="section-title">Progress Notes</div>`;
    for (const note of notes.slice(0, 5)) {
      const nc = noteColors[note.status] ?? '#94a3b8';
      const nl = noteLabels[note.status] ?? note.status;
      html += `
      <div class="note-card">
        <div class="note-status" style="color:${nc}">${nl} — ${this.fmtDate(note.createdAt)}</div>
        <p class="note-content">${note.content}</p>
      </div>`;
    }
    html += `</div>`;
    return html;
  }

  private buildEliteHtml(idp: any): string {
    if (!idp.holisticEvaluation) return '';
    const pillars = ['Technical', 'Tactical', 'Physical', 'Mental', 'Social'];
    let rows = '';
    for (const pillar of pillars) {
      const val = idp.holisticEvaluation[pillar] ?? 0;
      const pct = val * 10;
      const pc = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
      rows += `
      <div style="margin-bottom:10px">
        <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px">
          <span style="font-weight:600">${pillar}</span><span style="color:#64748b">${val}/10</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${pct}%; background:${pc}"></div>
        </div>
      </div>`;
    }
    return `<div class="section"><div class="section-title">Holistic Evaluation</div>${rows}</div>`;
  }

  private fmtDate(d: string | null | undefined): string {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return String(d); }
  }

  private goalStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'not-started': 'Not Started', 'in-progress': 'In Progress',
      'on-track': 'On Track', 'at-risk': 'At Risk', 'completed': 'Completed',
    };
    return labels[status] ?? status;
  }
}
