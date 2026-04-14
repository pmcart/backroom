import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

@Injectable()
export class IdpPdfService {
  async generate(idp: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W = doc.page.width - 100; // usable width
      const ACCENT = '#4f46e5';
      const MUTED  = '#64748b';
      const DARK   = '#1e293b';
      const RED    = '#ef4444';
      const GREEN  = '#10b981';
      const AMBER  = '#f59e0b';

      const playerName = `${idp.player?.firstName ?? ''} ${idp.player?.lastName ?? ''}`.trim();

      // ── Header bar ─────────────────────────────────────────────────────────
      doc.rect(50, 50, W, 60).fill(ACCENT);
      doc.fillColor('white').fontSize(20).font('Helvetica-Bold')
        .text('Individual Development Plan', 60, 63, { width: W - 120 });
      doc.fontSize(10).font('Helvetica')
        .text(`${idp.squad?.name ?? ''} · ${idp.ageGroup ?? ''}`, 60, 88, { width: W - 120 });

      // Mode badge top-right
      const modeTxt = idp.mode === 'elite' ? 'ELITE IDP' : 'STANDARD IDP';
      doc.fontSize(8).font('Helvetica-Bold')
        .text(modeTxt, 60 + W - 80, 72, { width: 80, align: 'right' });

      doc.moveDown(3);

      // ── Player info row ───────────────────────────────────────────────────
      doc.fillColor(DARK).fontSize(16).font('Helvetica-Bold')
        .text(playerName || '—', 50, doc.y);
      if (idp.player?.position) {
        doc.fillColor(MUTED).fontSize(10).font('Helvetica')
          .text(idp.player.position, 50, doc.y + 2);
      }

      // Status chip inline
      const statusColors: Record<string, string> = {
        'active': GREEN, 'review-due': AMBER, 'completed': '#6b7280',
      };
      const statusColor = statusColors[idp.status] ?? MUTED;
      const statusLabel = idp.status === 'active' ? 'Active'
        : idp.status === 'review-due' ? 'Review Due' : 'Completed';

      doc.moveDown(0.3);
      const statusY = doc.y;
      doc.fillColor(statusColor).fontSize(9).font('Helvetica-Bold')
        .text(`● ${statusLabel}`, 50, statusY);
      doc.fillColor(MUTED).fontSize(9).font('Helvetica')
        .text(`  Progress: ${idp.progress}%`, 130, statusY);

      this.divider(doc, W, ACCENT);

      // ── Key dates ─────────────────────────────────────────────────────────
      const dates = [
        { label: 'Created', value: this.fmtDate(idp.createdAt) },
        { label: 'Start Date', value: this.fmtDate(idp.startDate) },
        { label: 'Review Date', value: this.fmtDate(idp.reviewDate) },
        { label: 'Target Completion', value: this.fmtDate(idp.targetCompletionDate) },
      ].filter(d => d.value !== '—');

      if (dates.length) {
        const colW = W / Math.min(dates.length, 4);
        const rowY = doc.y;
        dates.forEach((d, i) => {
          const x = 50 + i * colW;
          doc.fillColor(MUTED).fontSize(7).font('Helvetica-Bold')
            .text(d.label.toUpperCase(), x, rowY, { width: colW - 8 });
          doc.fillColor(DARK).fontSize(9).font('Helvetica')
            .text(d.value, x, rowY + 12, { width: colW - 8 });
        });
        doc.moveDown(2.5);
      }

      // ── Progress bar ──────────────────────────────────────────────────────
      this.sectionTitle(doc, 'Overall Progress', ACCENT);
      this.progressBar(doc, idp.progress, W);
      doc.moveDown(1.2);

      // ── Goals by pillar ───────────────────────────────────────────────────
      if (idp.goals?.length) {
        this.sectionTitle(doc, 'Development Goals', ACCENT);

        const pillars: Record<string, string> = {
          technical: '⚽ Technical', tactical: '🧠 Tactical',
          physical: '💪 Physical', psychological: '🎯 Psychological',
          lifestyle: '📚 Lifestyle & Education',
        };

        const byPillar: Record<string, any[]> = {};
        for (const goal of idp.goals) {
          const key = goal.category ?? 'other';
          if (!byPillar[key]) byPillar[key] = [];
          byPillar[key].push(goal);
        }

        for (const [pillar, goals] of Object.entries(byPillar)) {
          const pillarLabel = pillars[pillar] ?? pillar;
          doc.fillColor(DARK).fontSize(10).font('Helvetica-Bold')
            .text(pillarLabel, 50, doc.y);
          doc.moveDown(0.4);

          for (const goal of goals) {
            this.checkPageBreak(doc, 80);

            const gY = doc.y;
            // Goal card background
            doc.rect(50, gY, W, 1).fill('#e2e8f0');
            doc.moveDown(0.2);

            doc.fillColor(DARK).fontSize(9).font('Helvetica-Bold')
              .text(goal.title, 55, doc.y, { width: W - 120 });

            const goalStatusColors: Record<string, string> = {
              'on-track': GREEN, 'at-risk': RED, 'completed': '#6b7280',
              'in-progress': ACCENT, 'not-started': MUTED,
            };
            const gsColor = goalStatusColors[goal.status] ?? MUTED;
            const gsLabel = this.goalStatusLabel(goal.status);
            doc.fillColor(gsColor).fontSize(8).font('Helvetica-Bold')
              .text(gsLabel, 50 + W - 65, gY + 2, { width: 65, align: 'right' });

            doc.moveDown(0.3);
            if (goal.description) {
              doc.fillColor(MUTED).fontSize(8).font('Helvetica')
                .text(goal.description, 55, doc.y, { width: W - 10 });
              doc.moveDown(0.3);
            }
            if (goal.kpi) {
              doc.fillColor(MUTED).fontSize(8).font('Helvetica')
                .text(`KPI: ${goal.kpi}`, 55, doc.y, { width: W - 10 });
              doc.moveDown(0.3);
            }
            if (goal.targetDate) {
              doc.fillColor(MUTED).fontSize(8).font('Helvetica')
                .text(`Target: ${this.fmtDate(goal.targetDate)}`, 55, doc.y);
              doc.moveDown(0.3);
            }
            this.progressBar(doc, goal.progress, W - 10, 55, 5);
            doc.moveDown(0.9);
          }
          doc.moveDown(0.5);
        }
      }

      // ── SWOT ──────────────────────────────────────────────────────────────
      if (idp.swot && Object.values(idp.swot).some((v: any) => v?.trim())) {
        this.checkPageBreak(doc, 180);
        this.sectionTitle(doc, 'SWOT Analysis', ACCENT);

        const swotItems = [
          { label: 'Strengths', value: idp.swot.strengths, color: GREEN },
          { label: 'Weaknesses', value: idp.swot.weaknesses, color: RED },
          { label: 'Opportunities', value: idp.swot.opportunities, color: ACCENT },
          { label: 'Threats', value: idp.swot.threats, color: AMBER },
        ];

        const half = W / 2;
        const swotY = doc.y;
        let maxH = 0;
        swotItems.forEach((item, i) => {
          const x = 50 + (i % 2) * (half + 5);
          const y = swotY + Math.floor(i / 2) * (maxH + 10);
          doc.fillColor(item.color).fontSize(8).font('Helvetica-Bold')
            .text(item.label.toUpperCase(), x, y, { width: half - 5 });
          doc.fillColor(DARK).fontSize(8).font('Helvetica')
            .text(item.value || '—', x, y + 12, { width: half - 10 });
        });
        doc.moveDown(8);
      }

      // ── Coach Comments ────────────────────────────────────────────────────
      if (idp.coachComments) {
        this.checkPageBreak(doc, 80);
        this.sectionTitle(doc, 'Coach Comments', ACCENT);
        doc.fillColor(DARK).fontSize(9).font('Helvetica')
          .text(idp.coachComments, 50, doc.y, { width: W });
        doc.moveDown(1.2);
      }

      // ── Progress Notes ────────────────────────────────────────────────────
      if (idp.notes?.length) {
        this.checkPageBreak(doc, 60);
        this.sectionTitle(doc, 'Progress Notes', ACCENT);
        for (const note of idp.notes.slice(0, 6)) {
          this.checkPageBreak(doc, 50);
          const noteColors: Record<string, string> = {
            'on-track': GREEN, 'needs-attention': AMBER, 'exceeding': ACCENT,
          };
          const nc = noteColors[note.status] ?? MUTED;
          const nl = note.status === 'on-track' ? 'On Track'
            : note.status === 'needs-attention' ? 'Needs Attention' : 'Exceeding';
          doc.fillColor(nc).fontSize(8).font('Helvetica-Bold')
            .text(`${nl} — ${this.fmtDate(note.createdAt)}`, 50, doc.y);
          doc.fillColor(DARK).fontSize(8).font('Helvetica')
            .text(note.content, 50, doc.y + 2, { width: W });
          doc.moveDown(0.9);
        }
      }

      // ── Elite Profile ─────────────────────────────────────────────────────
      if (idp.mode === 'elite') {
        if (idp.holisticEvaluation && Object.keys(idp.holisticEvaluation).length) {
          this.checkPageBreak(doc, 120);
          this.sectionTitle(doc, 'Holistic Evaluation', ACCENT);
          const pillars = ['Technical', 'Tactical', 'Physical', 'Mental', 'Social'];
          for (const pillar of pillars) {
            const val = idp.holisticEvaluation[pillar] ?? 0;
            doc.fillColor(DARK).fontSize(9).font('Helvetica').text(pillar, 50, doc.y, { continued: false });
            this.progressBar(doc, val * 10, W, 50, 5, `${val}/10`);
            doc.moveDown(0.6);

            // Sub-skills
            const subSkills = idp.subSkillEvaluations?.[pillar];
            if (subSkills && Object.keys(subSkills).length) {
              for (const [skill, score] of Object.entries(subSkills) as [string, number][]) {
                doc.fillColor(MUTED).fontSize(7).font('Helvetica')
                  .text(`  ${skill}`, 60, doc.y, { continued: false });
                this.progressBar(doc, score * 10, W - 20, 60, 4, `${score}/10`);
                doc.moveDown(0.5);
              }
            }
          }
        }

        if (idp.primaryPosition || idp.secondaryPosition) {
          this.checkPageBreak(doc, 60);
          this.sectionTitle(doc, 'Positional Profile', ACCENT);
          if (idp.primaryPosition) {
            doc.fillColor(MUTED).fontSize(8).font('Helvetica-Bold').text('Primary: ', 50, doc.y, { continued: true });
            doc.fillColor(DARK).font('Helvetica').text(idp.primaryPosition);
          }
          if (idp.secondaryPosition) {
            doc.fillColor(MUTED).fontSize(8).font('Helvetica-Bold').text('Secondary: ', 50, doc.y, { continued: true });
            doc.fillColor(DARK).font('Helvetica').text(idp.secondaryPosition);
          }
          if (idp.positionalDemands?.length) {
            doc.fillColor(MUTED).fontSize(8).font('Helvetica-Bold').text('Demands: ', 50, doc.y, { continued: true });
            doc.fillColor(DARK).font('Helvetica').text(idp.positionalDemands.join(', '));
          }
          doc.moveDown(0.8);
        }

        if (idp.methodologyTags?.length) {
          this.checkPageBreak(doc, 50);
          this.sectionTitle(doc, 'Methodology Tags', ACCENT);
          doc.fillColor(ACCENT).fontSize(9).font('Helvetica')
            .text(idp.methodologyTags.join('  ·  '), 50, doc.y, { width: W });
          doc.moveDown(1);
        }
      }

      // ── Footer ────────────────────────────────────────────────────────────
      const pageH = doc.page.height;
      doc.fillColor(MUTED).fontSize(7).font('Helvetica')
        .text(
          `Generated by Backroom · ${new Date().toLocaleDateString('en-IE')}`,
          50, pageH - 40, { width: W, align: 'center' },
        );

      doc.end();
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private sectionTitle(doc: any, title: string, color: string) {
    doc.fillColor(color).fontSize(11).font('Helvetica-Bold')
      .text(title.toUpperCase(), 50, doc.y);
    doc.moveDown(0.4);
  }

  private divider(doc: any, w: number, color: string) {
    doc.moveDown(0.6);
    doc.rect(50, doc.y, w, 1).fill(color).fillOpacity(0.3);
    doc.fillOpacity(1);
    doc.moveDown(0.8);
  }

  private progressBar(doc: any, percent: number, width: number, x = 50, height = 7, label?: string) {
    const barW = label ? width - 35 : width;
    const y = doc.y;
    // background
    doc.rect(x, y, barW, height).fill('#e2e8f0');
    // fill
    const fill = Math.min(100, Math.max(0, percent));
    const fillColor = fill >= 70 ? '#10b981' : fill >= 40 ? '#f59e0b' : '#ef4444';
    if (fill > 0) doc.rect(x, y, barW * fill / 100, height).fill(fillColor);
    // label
    if (label) {
      doc.fillColor('#1e293b').fontSize(7).font('Helvetica-Bold')
        .text(label, x + barW + 4, y, { width: 32 });
    }
    doc.y = y + height + 2;
  }

  private checkPageBreak(doc: any, neededHeight: number) {
    if (doc.y + neededHeight > doc.page.height - 60) {
      doc.addPage();
    }
  }

  private fmtDate(d: string | null | undefined): string {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return d; }
  }

  private goalStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'not-started': 'Not Started', 'in-progress': 'In Progress',
      'on-track': 'On Track', 'at-risk': 'At Risk', 'completed': 'Completed',
    };
    return labels[status] ?? status;
  }
}
