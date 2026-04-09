import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Club } from '../clubs/entities/club.entity';
import { Role } from '../common/enums/role.enum';
import { GoalStatus, IdpGoal } from '../idp/entities/idp-goal.entity';
import { Idp, IdpMode, IdpStatus } from '../idp/entities/idp.entity';
import { Player, PlayerStatus } from '../players/entities/player.entity';
import { ScheduleEntry, ScheduleEntryType } from '../schedule/entities/schedule-entry.entity';
import { CompetitionPhase, PlanStatus, PlanType, SessionPlan } from '../sessions/entities/session-plan.entity';
import { CoachAssignment } from '../squads/entities/coach-assignment.entity';
import { Squad } from '../squads/entities/squad.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Club) private readonly clubs: Repository<Club>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Squad) private readonly squads: Repository<Squad>,
    @InjectRepository(Player) private readonly players: Repository<Player>,
    @InjectRepository(CoachAssignment) private readonly assignments: Repository<CoachAssignment>,
    @InjectRepository(Idp) private readonly idps: Repository<Idp>,
    @InjectRepository(IdpGoal) private readonly idpGoals: Repository<IdpGoal>,
    @InjectRepository(SessionPlan) private readonly sessionPlans: Repository<SessionPlan>,
    @InjectRepository(ScheduleEntry) private readonly scheduleEntries: Repository<ScheduleEntry>,
  ) {}

  async onApplicationBootstrap() {
    const existingClubs = await this.clubs.count();
    if (existingClubs === 0) {
      this.logger.log('Seeding database…');
      await this.seed();
      this.logger.log('Seeding complete.');
      return;
    }

    // Backfill any missing seed data added in later iterations
    const existingSquads   = await this.squads.count();
    const existingPlayers  = await this.players.count();
    const existingIdps     = await this.idps.count();
    const existingPlans    = await this.sessionPlans.count();

    if (existingSquads === 0 || existingPlayers === 0 || existingIdps === 0) {
      this.logger.log('Incomplete seed data detected — dropping and reseeding. Restart the app once more if this recurs.');
      // Clear everything so seed() can run cleanly (CASCADE handles FK ordering)
      await this.clubs.query(
        `TRUNCATE TABLE schedule_entries, session_plans, idp_progress_notes, idp_goals, idps, players, coach_assignments, squads, users, clubs CASCADE`,
      );
      await this.seed();
      this.logger.log('Reseed complete.');
      return;
    }

    if (existingPlans === 0) {
      this.logger.log('Session plans missing — backfilling…');
      await this.seedSessionPlans();
      this.logger.log('Session plan backfill complete.');
    }

    const existingSchedule = await this.scheduleEntries.count();
    if (existingSchedule === 0) {
      this.logger.log('Schedule entries missing — backfilling…');
      await this.seedSchedule();
      this.logger.log('Schedule backfill complete.');
    }

    this.logger.log('Seed data already present — skipping.');
  }

  private async seed() {
    // ── Clubs ──────────────────────────────────────────────────────────────
    const shelbourne = await this.clubs.save(
      this.clubs.create({ name: 'Shelbourne FC', slug: 'shelbourne' }),
    );
    const cork = await this.clubs.save(
      this.clubs.create({ name: 'Cork City FC', slug: 'cork-city' }),
    );

    // ── Helper ─────────────────────────────────────────────────────────────
    const hash = (pw: string) => bcrypt.hash(pw, 10);

    const makeUser = async (
      data: Omit<Partial<User>, 'password'> & { email: string; firstName: string; lastName: string; role: Role; clubId: string },
      password = 'Password1',
    ) => {
      // Pass a plain object — NOT an entity instance — so @BeforeInsert is
      // never triggered and the password is only hashed once.
      await this.users
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ ...data, password: await hash(password), isActive: true })
        .execute();
    };

    // ── Shelbourne users ───────────────────────────────────────────────────
    await makeUser({ email: 'admin@shelbourne.com', firstName: 'Niall', lastName: 'Quinn', role: Role.Admin, clubId: shelbourne.id });

    await makeUser({ email: 'coach.davis@shelbourne.com', firstName: 'Tommy', lastName: 'Davis', role: Role.Coach, clubId: shelbourne.id });
    await makeUser({ email: 'coach.murphy@shelbourne.com', firstName: 'Sean', lastName: 'Murphy', role: Role.Coach, clubId: shelbourne.id });

    await makeUser({ email: 'aaron.connolly@shelbourne.com', firstName: 'Aaron', lastName: 'Connolly', role: Role.Player, clubId: shelbourne.id });
    await makeUser({ email: 'liam.kelly@shelbourne.com', firstName: 'Liam', lastName: 'Kelly', role: Role.Player, clubId: shelbourne.id });
    await makeUser({ email: 'cian.byrne@shelbourne.com', firstName: 'Cian', lastName: 'Byrne', role: Role.Player, clubId: shelbourne.id });
    await makeUser({ email: 'fionn.walsh@shelbourne.com', firstName: 'Fionn', lastName: 'Walsh', role: Role.Player, clubId: shelbourne.id });

    // ── Cork City users ────────────────────────────────────────────────────
    await makeUser({ email: 'admin@corkcity.com', firstName: 'Damien', lastName: 'Duff', role: Role.Admin, clubId: cork.id });

    await makeUser({ email: 'coach.ryan@corkcity.com', firstName: 'James', lastName: 'Ryan', role: Role.Coach, clubId: cork.id });
    await makeUser({ email: 'coach.o-brien@corkcity.com', firstName: 'Patrick', lastName: "O'Brien", role: Role.Coach, clubId: cork.id });

    await makeUser({ email: 'conor.hayes@corkcity.com', firstName: 'Conor', lastName: 'Hayes', role: Role.Player, clubId: cork.id });
    await makeUser({ email: 'rory.lynch@corkcity.com', firstName: 'Rory', lastName: 'Lynch', role: Role.Player, clubId: cork.id });
    await makeUser({ email: 'eoin.o-sullivan@corkcity.com', firstName: 'Eoin', lastName: "O'Sullivan", role: Role.Player, clubId: cork.id });
    await makeUser({ email: 'darragh.power@corkcity.com', firstName: 'Darragh', lastName: 'Power', role: Role.Player, clubId: cork.id });

    // ── Shelbourne squads ──────────────────────────────────────────────────
    const u17 = await this.squads.save(
      this.squads.create({ name: 'U17 Boys', ageGroup: 'U17', clubId: shelbourne.id }),
    );
    const u15 = await this.squads.save(
      this.squads.create({ name: 'U15 Boys', ageGroup: 'U15', clubId: shelbourne.id }),
    );

    // ── Cork City squads ───────────────────────────────────────────────────
    const corkU18 = await this.squads.save(
      this.squads.create({ name: 'U18 Boys', ageGroup: 'U18', clubId: cork.id }),
    );
    const corkU16 = await this.squads.save(
      this.squads.create({ name: 'U16 Boys', ageGroup: 'U16', clubId: cork.id }),
    );

    // ── Coach assignments — Shelbourne ─────────────────────────────────────
    const tommyDavis = await this.users.findOne({ where: { email: 'coach.davis@shelbourne.com' } });
    const seanMurphy = await this.users.findOne({ where: { email: 'coach.murphy@shelbourne.com' } });

    if (tommyDavis) {
      await this.assignments.save(
        this.assignments.create({ userId: tommyDavis.id, squadId: u17.id, clubId: shelbourne.id }),
      );
    }
    if (seanMurphy) {
      await this.assignments.save(
        this.assignments.create({ userId: seanMurphy.id, squadId: u15.id, clubId: shelbourne.id }),
      );
    }

    // ── Coach assignments — Cork City ──────────────────────────────────────
    const jamesRyan = await this.users.findOne({ where: { email: 'coach.ryan@corkcity.com' } });
    const patrickOBrien = await this.users.findOne({ where: { email: 'coach.o-brien@corkcity.com' } });

    if (jamesRyan) {
      await this.assignments.save(
        this.assignments.create({ userId: jamesRyan.id, squadId: corkU18.id, clubId: cork.id }),
      );
    }
    if (patrickOBrien) {
      await this.assignments.save(
        this.assignments.create({ userId: patrickOBrien.id, squadId: corkU16.id, clubId: cork.id }),
      );
    }

    // ── Shelbourne U17 Boys players ────────────────────────────────────────
    const u17Players = [
      { firstName: 'Aaron', lastName: 'Connolly', dateOfBirth: '2009-03-15', position: 'Forward', status: PlayerStatus.Active },
      { firstName: 'Liam', lastName: 'Kelly', dateOfBirth: '2009-07-22', position: 'Midfielder', status: PlayerStatus.Active },
      { firstName: 'Cian', lastName: 'Byrne', dateOfBirth: '2009-11-08', position: 'Defender', status: PlayerStatus.Injured },
      { firstName: 'Fionn', lastName: 'Walsh', dateOfBirth: '2010-02-14', position: 'Midfielder', status: PlayerStatus.Active },
      { firstName: 'Oisín', lastName: 'Murphy', dateOfBirth: '2009-09-03', position: 'Goalkeeper', status: PlayerStatus.Active },
      { firstName: 'Darragh', lastName: 'Nolan', dateOfBirth: '2010-01-20', position: 'Defender', status: PlayerStatus.Recovery },
    ];

    for (const p of u17Players) {
      await this.players.save(
        this.players.create({ ...p, squadId: u17.id, clubId: shelbourne.id }),
      );
    }

    // ── Shelbourne U15 Boys players ────────────────────────────────────────
    const u15Players = [
      { firstName: 'Ciarán', lastName: 'Burke', dateOfBirth: '2011-04-10', position: 'Forward', status: PlayerStatus.Active },
      { firstName: 'Seán', lastName: "O'Neill", dateOfBirth: '2011-06-25', position: 'Midfielder', status: PlayerStatus.Active },
      { firstName: 'Rían', lastName: 'Gallagher', dateOfBirth: '2011-08-17', position: 'Defender', status: PlayerStatus.Active },
      { firstName: 'Eoghan', lastName: 'Doyle', dateOfBirth: '2012-01-05', position: 'Midfielder', status: PlayerStatus.Injured },
      { firstName: 'Tadhg', lastName: 'Brennan', dateOfBirth: '2011-11-30', position: 'Goalkeeper', status: PlayerStatus.Active },
      { firstName: 'Cathal', lastName: 'Ryan', dateOfBirth: '2012-03-22', position: 'Forward', status: PlayerStatus.Active },
    ];

    for (const p of u15Players) {
      await this.players.save(
        this.players.create({ ...p, squadId: u15.id, clubId: shelbourne.id }),
      );
    }

    // ── Cork City U18 Boys players ─────────────────────────────────────────
    const corkU18Players = [
      { firstName: 'Conor', lastName: 'Hayes', dateOfBirth: '2007-05-12', position: 'Forward', status: PlayerStatus.Active },
      { firstName: 'Rory', lastName: 'Lynch', dateOfBirth: '2007-09-30', position: 'Midfielder', status: PlayerStatus.Active },
      { firstName: 'Eoin', lastName: "O'Sullivan", dateOfBirth: '2008-02-18', position: 'Defender', status: PlayerStatus.Active },
      { firstName: 'Darragh', lastName: 'Power', dateOfBirth: '2007-12-07', position: 'Midfielder', status: PlayerStatus.Injured },
      { firstName: 'Niall', lastName: 'Crowley', dateOfBirth: '2008-04-25', position: 'Goalkeeper', status: PlayerStatus.Active },
      { firstName: 'Brian', lastName: 'McCarthy', dateOfBirth: '2007-07-14', position: 'Defender', status: PlayerStatus.Recovery },
    ];

    for (const p of corkU18Players) {
      await this.players.save(
        this.players.create({ ...p, squadId: corkU18.id, clubId: cork.id }),
      );
    }

    // ── Cork City U16 Boys players ─────────────────────────────────────────
    const corkU16Players = [
      { firstName: 'Fiachra', lastName: 'Collins', dateOfBirth: '2010-03-08', position: 'Forward', status: PlayerStatus.Active },
      { firstName: 'Ruairí', lastName: 'Sheehan', dateOfBirth: '2010-08-22', position: 'Midfielder', status: PlayerStatus.Active },
      { firstName: 'Cormac', lastName: 'Murphy', dateOfBirth: '2010-11-15', position: 'Defender', status: PlayerStatus.Active },
      { firstName: 'Pádraig', lastName: 'Finn', dateOfBirth: '2010-01-30', position: 'Midfielder', status: PlayerStatus.Active },
      { firstName: 'Séamus', lastName: 'Barry', dateOfBirth: '2010-06-19', position: 'Goalkeeper', status: PlayerStatus.Injured },
      { firstName: 'Donnacha', lastName: 'Walsh', dateOfBirth: '2010-09-04', position: 'Defender', status: PlayerStatus.Active },
    ];

    for (const p of corkU16Players) {
      await this.players.save(
        this.players.create({ ...p, squadId: corkU16.id, clubId: cork.id }),
      );
    }

    await this.seedIdps();
    await this.seedSessionPlans();
    await this.seedSchedule();
  }

  private async seedIdps() {
    const allSquads = await this.squads.find();
    if (!allSquads.length) return;

    const makeIdp = async (
      player: Player,
      squad: Squad,
      clubId: string,
      opts: {
        mode?: IdpMode;
        status?: IdpStatus;
        ageGroup?: string;
        reviewDate?: string;
        coachComments?: string;
        goals: Array<{ title: string; description?: string; category: string; progress: number; status: GoalStatus; kpi?: string; targetDate?: string; coachRating?: number }>;
        // Elite-only
        holisticEvaluation?: Record<string, number>;
        primaryPosition?: string;
        secondaryPosition?: string;
        positionalDemands?: string[];
        performanceSupport?: string;
        offFieldDevelopment?: string;
        methodologyTags?: string[];
      },
    ) => {
      const idp = await this.idps.save(
        this.idps.create({
          playerId: player.id,
          squadId: squad.id,
          clubId,
          mode: opts.mode ?? IdpMode.Standard,
          status: opts.status ?? IdpStatus.Active,
          ageGroup: opts.ageGroup ?? squad.ageGroup,
          reviewDate: opts.reviewDate ?? null,
          coachComments: opts.coachComments ?? null,
          holisticEvaluation: opts.holisticEvaluation ?? null,
          primaryPosition: opts.primaryPosition ?? null,
          secondaryPosition: opts.secondaryPosition ?? null,
          positionalDemands: opts.positionalDemands ?? null,
          performanceSupport: opts.performanceSupport ?? null,
          offFieldDevelopment: opts.offFieldDevelopment ?? null,
          methodologyTags: opts.methodologyTags ?? null,
        }),
      );
      for (const g of opts.goals) {
        await this.idpGoals.save(
          this.idpGoals.create({
            idpId: idp.id,
            title: g.title,
            description: g.description ?? null,
            category: g.category,
            progress: g.progress,
            status: g.status,
            kpi: g.kpi ?? null,
            targetDate: g.targetDate ?? null,
            coachRating: g.coachRating ?? null,
          }),
        );
      }
    };

    let playerTierIndex = 0;
    for (const squad of allSquads) {
      const squadPlayers = await this.players.find({ where: { squadId: squad.id } });
      const isElite = squad.ageGroup === 'U18';

      for (const player of squadPlayers) {
        // Rich featured elite IDP for Aaron Connolly (Shelbourne U17 Forward)
        if (player.firstName === 'Aaron' && player.lastName === 'Connolly') {
          await makeIdp(player, squad, squad.clubId, {
            mode: IdpMode.Elite,
            status: IdpStatus.Active,
            ageGroup: squad.ageGroup,
            reviewDate: '2026-05-20',
            coachComments: 'Aaron is one of the most exciting forwards in the U17 group. His movement off the ball and ability to press from the front make him a nightmare for opposition defenders. The focus for the next review cycle is improving his decision-making in the final third and adding consistency to his finishing under pressure.',
            holisticEvaluation: { Technical: 7, Tactical: 6, Physical: 8, Mental: 7, Social: 9 },
            primaryPosition: 'Centre Forward',
            secondaryPosition: 'Left Wing',
            positionalDemands: [
              'Press aggressively to win ball in final third',
              'Create space with diagonal runs behind defence',
              'Link play with runners from midfield',
              'Hold up ball under physical pressure',
              'Arrive late in the box to convert crosses',
            ],
            performanceSupport: 'Bi-weekly 1:1 sessions with Tommy Davis focusing on finishing mechanics. Strength & conditioning programme designed around explosive sprint development. Hydration and recovery protocols tracked via wearable device.',
            offFieldDevelopment: 'Completed FAI Youth Leadership module (March 2026). Represents the squad as player liaison in monthly academy review meetings. Mentored by senior player in club\'s cross-age development programme.',
            methodologyTags: ['Pressing High', 'Transition Speed', 'Width & Depth', 'Direct Play'],
            goals: [
              {
                title: 'Consistent pressing intensity across 90 minutes',
                description: 'Maintain high-energy press from first whistle to last, particularly in the second half when fatigue typically reduces Aaron\'s defensive work rate.',
                category: 'Physical',
                progress: 72,
                status: GoalStatus.OnTrack,
                kpi: 'Second-half press attempts within 10% of first-half total across 5 consecutive matches (GPS)',
                targetDate: '2026-04-30',
                coachRating: 4,
              },
              {
                title: 'Finishing composure in 1v1 situations',
                description: 'Reduce hesitation when through on goal. Work on reading the keeper early and committing to a shot placement before the final touch.',
                category: 'Technical',
                progress: 55,
                status: GoalStatus.InProgress,
                kpi: 'Convert 45%+ of clear 1v1 chances in training and match play (video tracked)',
                targetDate: '2026-06-01',
                coachRating: 3,
              },
              {
                title: 'Diagonal runs to exploit defensive lines',
                description: 'Develop timing and consistency of runs in behind the defensive line, particularly when midfielders carry the ball forward into the final third.',
                category: 'Tactical',
                progress: 74,
                status: GoalStatus.OnTrack,
                kpi: 'Average 3+ successful runs in behind per game resulting in a touch or shot (video analysis)',
                targetDate: '2026-05-15',
                coachRating: 4,
              },
              {
                title: 'Communication & leadership on the pitch',
                description: 'Take more responsibility for directing pressing shape and organising teammates during defensive transitions. Lead by example as the first line of press.',
                category: 'Mental',
                progress: 80,
                status: GoalStatus.OnTrack,
                kpi: 'Coach observation rating ≥4/5 for on-pitch communication in 4 of next 5 matches',
                targetDate: '2026-05-01',
                coachRating: 5,
              },
            ],
          });
          continue;
        }

        // Rich featured elite IDP for Conor Hayes (Cork U18 Forward)
        if (isElite && player.firstName === 'Conor' && player.lastName === 'Hayes') {
          await makeIdp(player, squad, squad.clubId, {
            mode: IdpMode.Elite,
            status: IdpStatus.Active,
            ageGroup: squad.ageGroup,
            reviewDate: '2026-05-15',
            coachComments: 'Conor has shown excellent development this season. His pressing intensity has been a real asset to the team and he is showing the tactical maturity we expect from our elite pathway players. Key focus for the coming block is converting his physical output into more clinical finishing in the final third.',
            holisticEvaluation: { Technical: 8, Tactical: 7, Physical: 9, Mental: 7, Social: 8 },
            primaryPosition: 'Centre Forward',
            secondaryPosition: 'Right Wing',
            positionalDemands: [
              'Lead press from the front',
              'Hold-up play and link with midfield',
              'Movement to exploit channels',
              'Aerial duels in the box',
              'Combine in tight spaces',
            ],
            performanceSupport: 'Working with sports science team on sprint recovery protocols. Attending weekly 1:1 finishing sessions with James Ryan on Fridays. GPS data reviewed fortnightly to monitor high-intensity running loads.',
            offFieldDevelopment: 'Enrolled in FAI Leadership Programme (2026 cohort). Mentoring two U15 players as part of the club\'s peer development initiative. Nutrition plan reviewed monthly with club dietitian.',
            methodologyTags: ['Pressing High', 'Transition Speed', 'Positional Play', 'Width & Depth'],
            goals: [
              {
                title: 'Elite pressing trigger recognition',
                description: 'Develop consistent ability to identify and execute pressing triggers in the attacking third, reducing opposition build-up time and creating turnovers high up the pitch.',
                category: 'Tactical',
                progress: 78,
                status: GoalStatus.OnTrack,
                kpi: 'Average 4+ press attempts per 90 mins with >40% success rate (GPS + video review)',
                targetDate: '2026-05-01',
                coachRating: 4,
              },
              {
                title: 'Finishing efficiency in 1v1 situations',
                description: 'Improve composure and decision-making when through on goal. Focus on shot selection, first-touch placement and reading the goalkeeper\'s positioning.',
                category: 'Technical',
                progress: 62,
                status: GoalStatus.InProgress,
                kpi: 'Convert 50%+ of clear 1v1 opportunities in match play (tracked from video analysis)',
                targetDate: '2026-06-01',
                coachRating: 3,
              },
              {
                title: 'Sprint recovery between high-intensity efforts',
                description: 'Build aerobic capacity to sustain high-speed running output across the full 90 minutes without drop-off in second half pressing effectiveness.',
                category: 'Physical',
                progress: 85,
                status: GoalStatus.OnTrack,
                kpi: 'Maintain >95% of first-half high-intensity distance in second half (GPS data)',
                targetDate: '2026-04-15',
                coachRating: 5,
              },
              {
                title: 'Leadership in transition moments',
                description: 'Take ownership of organising team shape immediately after losing possession. Communicate pressing triggers to teammates and set the defensive tone from the front.',
                category: 'Mental',
                progress: 55,
                status: GoalStatus.InProgress,
                kpi: 'Coach observation score ≥4/5 in post-match review for 3 consecutive games',
                targetDate: '2026-05-15',
                coachRating: 3,
              },
            ],
          });
          continue;
        }

        // Deterministic tier cycle: ~35% on track, ~45% in progress, ~20% at risk
        const progressTiers: [number, number, number][] = [
          [75, 82, 78],  // on track
          [55, 62, 58],  // in progress
          [28, 35, 32],  // at risk
          [80, 73, 77],  // on track
          [50, 58, 63],  // in progress
          [70, 76, 72],  // on track
          [44, 51, 47],  // in progress
          [22, 30, 25],  // at risk
          [68, 74, 71],  // on track
          [53, 46, 59],  // in progress
        ];
        const tier = progressTiers[playerTierIndex++ % progressTiers.length];
        const [p1, p2, p3] = tier;
        const avg = Math.round((p1 + p2 + p3) / 3);

        await makeIdp(player, squad, squad.clubId, {
          mode: isElite ? IdpMode.Elite : IdpMode.Standard,
          status: avg < 40 ? IdpStatus.ReviewDue : IdpStatus.Active,
          ageGroup: squad.ageGroup,
          reviewDate: '2026-05-01',
          goals: [
            { title: 'Technical development', category: 'Technical', progress: p1, status: p1 >= 70 ? GoalStatus.OnTrack : p1 < 40 ? GoalStatus.AtRisk : GoalStatus.InProgress, kpi: 'Coach assessment score' },
            { title: 'Tactical awareness', category: 'Tactical', progress: p2, status: p2 >= 70 ? GoalStatus.OnTrack : p2 < 40 ? GoalStatus.AtRisk : GoalStatus.InProgress },
            { title: 'Physical conditioning', category: 'Physical', progress: p3, status: p3 >= 70 ? GoalStatus.OnTrack : p3 < 40 ? GoalStatus.AtRisk : GoalStatus.InProgress },
          ],
        });
      }
    }
  }

  // ── Session Plans ──────────────────────────────────────────────────────────

  private async seedSessionPlans() {
    const allSquads = await this.squads.find();
    if (!allSquads.length) return;

    for (const squad of allSquads) {
      const coach = await this.assignments.findOne({ where: { squadId: squad.id } });
      const coachId = coach?.userId ?? 'unknown';
      const clubId  = squad.clubId;
      const ag      = squad.ageGroup;

      // Pick a theme palette per squad age group for variety
      const isU18 = ag === 'U18';
      const isU17 = ag === 'U17';

      // ── 1. Single Session — Pressing & Transition (Active) ────────────────
      await this.sessionPlans.save(this.sessionPlans.create({
        title: `${ag} — Pressing & Transition`,
        type: PlanType.SingleSession,
        status: PlanStatus.Active,
        competitionPhase: CompetitionPhase.InSeason,
        squadId: squad.id, coachId, clubId,
        tags: ['Pressing', 'Transition', 'Defensive'],
        data: {
          date: '2026-04-10',
          theme: 'High Press & Quick Transition',
          idpLinks: ['Tactical awareness', 'Pressing High'],
          phases: [
            {
              name: 'Activation',
              duration: 10,
              description: 'Rondo 4v2 in a 10×10 box — two touch max, aim for 10 consecutive passes.',
              coachingPoints: ['Compact shape', 'Quick feet', 'Communication'],
              equipment: ['Bibs', '8 cones'],
            },
            {
              name: 'Technical',
              duration: 20,
              description: 'Pressing trigger drills — coach calls the cue (back pass, GK with ball) and the unit presses.',
              coachingPoints: ['Press on back pass', 'Correct angle of press', 'Cover shadow the passing lane'],
              equipment: ['Cones', 'Mannequins', '6 balls'],
            },
            {
              name: 'Tactical',
              duration: 20,
              description: '8v8 + GKs on a 60×45 pitch. Trigger the press from GK distribution — mid block to high press.',
              coachingPoints: ['Defensive line height', 'Win second ball', 'If press is beaten — reset quickly'],
              equipment: ['2 portable goals', 'Bibs', '4 balls'],
            },
            {
              name: 'Conditioned Game',
              duration: 15,
              description: '11v11. Bonus point if the team wins possession in the opposition half within 4 seconds of triggering press.',
              coachingPoints: ['Reward the press', 'Immediate transition forwards', 'Attitude & intensity — no passengers'],
              equipment: ['Full pitch', '2 goals', '6 balls', 'Bibs'],
            },
            {
              name: 'Reflection',
              duration: 5,
              description: 'Huddle. Coach-led debrief using two video clips on tablet — one press that worked, one that broke.',
              coachingPoints: ['What was the trigger?', 'Where did we break shape?', 'Key focus for next session'],
              equipment: ['Tablet / laptop'],
            },
          ],
        },
      }));

      // ── 2. Single Session — Positional Play (Active) ──────────────────────
      await this.sessionPlans.save(this.sessionPlans.create({
        title: `${ag} — Positional Play`,
        type: PlanType.SingleSession,
        status: PlanStatus.Active,
        competitionPhase: CompetitionPhase.InSeason,
        squadId: squad.id, coachId, clubId,
        tags: ['Positional Play', 'Ball Retention'],
        data: {
          date: '2026-04-15',
          theme: 'Positional Play & Third Man Runs',
          idpLinks: ['Positional Play', 'Technical development'],
          phases: [
            {
              name: 'Activation',
              duration: 10,
              description: 'Passing square — 4v0, then 4v1. Focus on body shape before receiving.',
              coachingPoints: ['Half-turn before receiving', 'Play to the free side', 'Eye contact before the pass'],
              equipment: ['Cones', '4 balls'],
            },
            {
              name: 'Technical',
              duration: 20,
              description: 'Third-man run patterns in a 20×20 grid. Player A to B — B plays to C who has timed the run.',
              coachingPoints: ['Timing of the run', 'Weight of pass', 'Communication ("hold" / "turn")'],
              equipment: ['Cones', '6 balls'],
            },
            {
              name: 'Tactical',
              duration: 20,
              description: '7v5 possession game — team in possession must play through a target player before scoring.',
              coachingPoints: ['Support angles', 'Speed of play', 'Switch quickly to relieve pressure'],
              equipment: ['Cones', 'Bibs', '4 balls'],
            },
            {
              name: 'Conditioned Game',
              duration: 15,
              description: '9v9 with side zones. Wide players are free — team must use wide player before shooting.',
              coachingPoints: ['Width & depth', 'Overload wide areas', 'Quality of final ball'],
              equipment: ['Full pitch (reduced)', '2 goals', 'Cones', 'Bibs'],
            },
            {
              name: 'Reflection',
              duration: 5,
              description: 'Small group discussion — what patterns worked and why.',
              coachingPoints: ['Which combinations created space?', 'Where did we lose the ball?', 'IDP link — carry this into your individual work'],
              equipment: [],
            },
          ],
        },
      }));

      // ── 3. Single Session — Set Pieces (Draft) ────────────────────────────
      await this.sessionPlans.save(this.sessionPlans.create({
        title: `${ag} — Set Pieces (Draft)`,
        type: PlanType.SingleSession,
        status: PlanStatus.Draft,
        competitionPhase: CompetitionPhase.InSeason,
        squadId: squad.id, coachId, clubId,
        tags: ['Set Pieces'],
        data: {
          date: '',
          theme: 'Attacking & Defensive Set Pieces',
          idpLinks: [],
          phases: [
            { name: 'Activation', duration: 10, description: '', coachingPoints: [], equipment: [] },
            { name: 'Technical', duration: 20, description: 'Rehearse corner delivery — inswing and outswing options.', coachingPoints: ['Delivery consistency', 'Runner timing'], equipment: ['Balls', 'Cones'] },
            { name: 'Tactical', duration: 20, description: 'Attacking corners vs defensive shape. Walk-through then live reps.', coachingPoints: ['Near-post run', 'Back-post arrival', 'Penalty spot support'], equipment: ['Goals', 'Bibs'] },
            { name: 'Conditioned Game', duration: 15, description: '', coachingPoints: [], equipment: [] },
            { name: 'Reflection', duration: 5, description: '', coachingPoints: [], equipment: [] },
          ],
        },
      }));

      // ── 4. Weekly Plan — Match Week (Active) ──────────────────────────────
      await this.sessionPlans.save(this.sessionPlans.create({
        title: `${ag} — Week 14 Match Week`,
        type: PlanType.WeeklyPlan,
        status: PlanStatus.Active,
        competitionPhase: CompetitionPhase.InSeason,
        squadId: squad.id, coachId, clubId,
        tags: ['Weekly', 'Match Week'],
        data: {
          days: [
            { day: 'Monday',    type: 'rest',     title: 'Recovery',               theme: '',                                    intensity: 'low',    matchProximity: 'day-5', idpObjectives: [] },
            { day: 'Tuesday',   type: 'training', title: 'Technical Refresh',      theme: 'Ball Mastery & Passing Combinations', intensity: 'medium', matchProximity: 'day-4', idpObjectives: ['Technical development'] },
            { day: 'Wednesday', type: 'training', title: 'Tactical Organisation',  theme: 'Shape, Press Triggers & Transitions', intensity: 'high',   matchProximity: 'day-3', idpObjectives: ['Tactical awareness', 'Pressing High'] },
            { day: 'Thursday',  type: 'training', title: 'Set Pieces',             theme: 'Corners, Free Kicks & Throw-ins',     intensity: 'medium', matchProximity: 'day-2', idpObjectives: ['Set Pieces'] },
            { day: 'Friday',    type: 'training', title: 'Activation & Walkthrough', theme: 'Light Technical, Opposition Preview', intensity: 'low',  matchProximity: 'day-1', idpObjectives: [] },
            { day: 'Saturday',  type: 'match',    title: 'Match Day',              theme: '',                                    intensity: 'high',   matchProximity: 'match-day', idpObjectives: [] },
            { day: 'Sunday',    type: 'rest',     title: 'Rest & Recovery',        theme: '',                                    intensity: 'low',    matchProximity: 'day+1', idpObjectives: [] },
          ],
        },
      }));

      // ── 5. Weekly Plan — Non-Match Week (Active) ──────────────────────────
      await this.sessionPlans.save(this.sessionPlans.create({
        title: `${ag} — Week 12 Development Week`,
        type: PlanType.WeeklyPlan,
        status: PlanStatus.Active,
        competitionPhase: CompetitionPhase.InSeason,
        squadId: squad.id, coachId, clubId,
        tags: ['Weekly', 'Development'],
        data: {
          days: [
            { day: 'Monday',    type: 'rest',     title: 'Day Off',                theme: '',                           intensity: 'low',    matchProximity: '',     idpObjectives: [] },
            { day: 'Tuesday',   type: 'training', title: 'Individual Skills',      theme: 'Receiving, Turning & Dribbling', intensity: 'medium', matchProximity: '', idpObjectives: ['Technical development'] },
            { day: 'Wednesday', type: 'training', title: 'Positional Play',        theme: 'Third Man Runs & Combinations', intensity: 'medium', matchProximity: '',  idpObjectives: ['Positional Play'] },
            { day: 'Thursday',  type: 'training', title: 'High Intensity Pressing', theme: 'Press Triggers & Compactness', intensity: 'high',  matchProximity: '',   idpObjectives: ['Pressing High', 'Tactical awareness'] },
            { day: 'Friday',    type: 'training', title: 'Finishing & Transitions', theme: 'Goal Scoring & Defensive Transition', intensity: 'high', matchProximity: '', idpObjectives: ['Physical conditioning'] },
            { day: 'Saturday',  type: 'recovery', title: 'Active Recovery',        theme: '',                           intensity: 'low',    matchProximity: '',     idpObjectives: [] },
            { day: 'Sunday',    type: 'rest',     title: 'Day Off',                theme: '',                           intensity: 'low',    matchProximity: '',     idpObjectives: [] },
          ],
        },
      }));

      // ── 6. Multi-Week Block — Pre-Season (Active) ─────────────────────────
      await this.sessionPlans.save(this.sessionPlans.create({
        title: `${ag} — Pre-Season 4-Week Block`,
        type: PlanType.MultiWeekBlock,
        status: PlanStatus.Active,
        competitionPhase: CompetitionPhase.PreSeason,
        squadId: squad.id, coachId, clubId,
        tags: ['Pre-Season', 'Block', 'Fitness'],
        data: {
          weeks: [
            {
              label: 'Week 1 — Foundation & Fitness',
              days: [
                { day: 'Monday',    type: 'rest',     title: 'Day Off',        theme: '', intensity: 'low',    matchProximity: '', idpObjectives: [] },
                { day: 'Tuesday',   type: 'training', title: 'Fitness Testing', theme: 'Baseline Testing — Yo-Yo, Sprint, Agility', intensity: 'medium', matchProximity: '', idpObjectives: ['Physical conditioning'] },
                { day: 'Wednesday', type: 'training', title: 'Aerobic Base',   theme: 'Low-intensity runs & stretching circuits', intensity: 'medium', matchProximity: '', idpObjectives: [] },
                { day: 'Thursday',  type: 'training', title: 'Ball Work',      theme: 'Technical — Individual Skill Circuits', intensity: 'medium', matchProximity: '', idpObjectives: ['Technical development'] },
                { day: 'Friday',    type: 'training', title: 'Small Sides',    theme: '4v4 — High tempo, lots of reps', intensity: 'high', matchProximity: '', idpObjectives: [] },
                { day: 'Saturday',  type: 'recovery', title: 'Active Recovery', theme: '', intensity: 'low', matchProximity: '', idpObjectives: [] },
                { day: 'Sunday',    type: 'rest',     title: 'Day Off',        theme: '', intensity: 'low', matchProximity: '', idpObjectives: [] },
              ],
            },
            {
              label: 'Week 2 — Shape & Identity',
              days: [
                { day: 'Monday',    type: 'rest',     title: 'Day Off',        theme: '', intensity: 'low',    matchProximity: '', idpObjectives: [] },
                { day: 'Tuesday',   type: 'training', title: 'Defensive Shape', theme: 'Defensive block — 4-4-2 mid press structure', intensity: 'medium', matchProximity: '', idpObjectives: ['Tactical awareness'] },
                { day: 'Wednesday', type: 'training', title: 'Attacking Shape', theme: 'Build-up from GK — positional roles', intensity: 'medium', matchProximity: '', idpObjectives: ['Positional Play'] },
                { day: 'Thursday',  type: 'training', title: 'Transition',      theme: 'Winning & losing the ball — immediate reactions', intensity: 'high', matchProximity: '', idpObjectives: ['Tactical awareness'] },
                { day: 'Friday',    type: 'training', title: '11v11 Game',      theme: 'Full practice match — focus on shape', intensity: 'high', matchProximity: '', idpObjectives: [] },
                { day: 'Saturday',  type: 'recovery', title: 'Recovery',        theme: '', intensity: 'low', matchProximity: '', idpObjectives: [] },
                { day: 'Sunday',    type: 'rest',     title: 'Day Off',         theme: '', intensity: 'low', matchProximity: '', idpObjectives: [] },
              ],
            },
            {
              label: 'Week 3 — Intensity & Competition Prep',
              days: [
                { day: 'Monday',    type: 'rest',     title: 'Day Off',          theme: '', intensity: 'low',    matchProximity: '', idpObjectives: [] },
                { day: 'Tuesday',   type: 'training', title: 'High Press',        theme: 'Press triggers — full unit work', intensity: 'high', matchProximity: '', idpObjectives: ['Pressing High'] },
                { day: 'Wednesday', type: 'training', title: 'Set Pieces',        theme: 'Corners, Free Kicks — attacking & defending', intensity: 'medium', matchProximity: '', idpObjectives: [] },
                { day: 'Thursday',  type: 'training', title: 'Physical Peak',     theme: 'Sprint circuits & repeated sprint ability', intensity: 'high', matchProximity: '', idpObjectives: ['Physical conditioning'] },
                { day: 'Friday',    type: 'training', title: 'Tactical Runthrough', theme: 'Opposition preview — shape & pressing plan', intensity: 'medium', matchProximity: 'day-1', idpObjectives: [] },
                { day: 'Saturday',  type: 'match',    title: 'Friendly Match',    theme: '', intensity: 'high', matchProximity: 'match-day', idpObjectives: [] },
                { day: 'Sunday',    type: 'rest',     title: 'Rest',              theme: '', intensity: 'low', matchProximity: '', idpObjectives: [] },
              ],
            },
            {
              label: 'Week 4 — Taper & League Start',
              days: [
                { day: 'Monday',    type: 'rest',     title: 'Recovery',          theme: '', intensity: 'low',    matchProximity: 'day+1', idpObjectives: [] },
                { day: 'Tuesday',   type: 'training', title: 'Sharp & Light',      theme: 'Speed & agility — short, sharp session', intensity: 'medium', matchProximity: 'day-4', idpObjectives: [] },
                { day: 'Wednesday', type: 'training', title: 'Final Tactical Run', theme: 'Shape & set piece review', intensity: 'medium', matchProximity: 'day-3', idpObjectives: ['Tactical awareness'] },
                { day: 'Thursday',  type: 'training', title: 'Activation',         theme: 'Light technical, individual preparation', intensity: 'low', matchProximity: 'day-2', idpObjectives: [] },
                { day: 'Friday',    type: 'training', title: 'Walk-through',        theme: 'Matchday prep, set pieces, team talk', intensity: 'low', matchProximity: 'day-1', idpObjectives: [] },
                { day: 'Saturday',  type: 'match',    title: 'League Opener',      theme: '', intensity: 'high', matchProximity: 'match-day', idpObjectives: [] },
                { day: 'Sunday',    type: 'rest',     title: 'Day Off',            theme: '', intensity: 'low', matchProximity: 'day+1', idpObjectives: [] },
              ],
            },
          ],
        },
      }));

      // ── 7. Season Plan (Active) ───────────────────────────────────────────
      await this.sessionPlans.save(this.sessionPlans.create({
        title: `${ag} — 2025/26 Season Plan`,
        type: PlanType.SeasonPlan,
        status: PlanStatus.Active,
        competitionPhase: null,
        squadId: squad.id, coachId, clubId,
        tags: ['Season', 'Overview'],
        data: {
          phases: [
            {
              name: 'Pre-Season',
              startDate: '2025-07-07',
              endDate: '2025-08-08',
              focus: 'Physical foundation, team identity, tactical principles and system introduction.',
              weeklyStructure: isU18
                ? '5 sessions/week — 2 fitness, 2 tactical, 1 friendly/scrimmage. Elite IDP reviews in week 2 and 4.'
                : '4 sessions/week — 1 fitness, 2 tactical, 1 friendly. IDP onboarding meeting week 1.',
            },
            {
              name: 'Early Season',
              startDate: '2025-08-11',
              endDate: '2025-10-31',
              focus: 'Establish competitive form. Bed in pressing system and positional play principles.',
              weeklyStructure: 'Match week: 4 sessions — Tue technical, Wed tactical, Thu set pieces, Fri activation. Non-match: 5 sessions — extra fitness/finishing on Saturday.',
            },
            {
              name: 'Mid Season',
              startDate: '2025-11-03',
              endDate: '2026-01-30',
              focus: isU17 || isU18
                ? 'Raise tactical complexity. Introduce zonal pressing variants. Individual performance reviews via IDP.'
                : 'Maintain fitness and form through winter. Keep sessions competitive. Manage load carefully in cold weather.',
              weeklyStructure: '3–4 sessions/week around Christmas break. Full schedule resumes January.',
            },
            {
              name: 'Run-In',
              startDate: '2026-02-02',
              endDate: '2026-04-30',
              focus: 'Peak form for title run-in. Sharpen set pieces and mental preparation. Reduce session volume, increase quality.',
              weeklyStructure: 'Match week only — 3 sessions max. Heavy emphasis on recovery and opposition analysis.',
            },
            {
              name: 'Post-Season',
              startDate: '2026-05-04',
              endDate: '2026-06-13',
              focus: 'Season reviews, IDP end-of-year assessments, individual feedback meetings, player retention planning.',
              weeklyStructure: '1–2 light sessions/week if any cup games. Otherwise structured rest and review.',
            },
          ],
        },
      }));

      // ── 8. Archived — Old Single Session ─────────────────────────────────
      await this.sessionPlans.save(this.sessionPlans.create({
        title: `${ag} — Defensive Shape (Archived)`,
        type: PlanType.SingleSession,
        status: PlanStatus.Archived,
        competitionPhase: CompetitionPhase.PreSeason,
        squadId: squad.id, coachId, clubId,
        tags: ['Defensive', 'Shape'],
        data: {
          date: '2025-08-05',
          theme: 'Defensive Block & Compactness',
          idpLinks: ['Tactical awareness', 'Defensive Shape'],
          phases: [
            {
              name: 'Activation',
              duration: 10,
              description: 'Shadow defending — 11 players move as a unit following coach hand signals.',
              coachingPoints: ['Maintain shape', 'Eyes up', 'Verbal communication'],
              equipment: ['Cones'],
            },
            {
              name: 'Technical',
              duration: 20,
              description: '1v1 defending — jockey, show inside, win the ball.',
              coachingPoints: ['Low centre of gravity', 'Patience', 'Delay then tackle'],
              equipment: ['Cones', '10 balls'],
            },
            {
              name: 'Tactical',
              duration: 20,
              description: '8v8 — team in shape defends against overload. Shift & compact.',
              coachingPoints: ['Compact the space', 'Force wide', 'Don\'t be drawn out'],
              equipment: ['Goals', 'Bibs', 'Balls'],
            },
            {
              name: 'Conditioned Game',
              duration: 15,
              description: '11v11 — concede fewer than 2 goals = team win. Pressure the defending team.',
              coachingPoints: ['Keep shape', 'GK organising', 'Transition to attack quickly on win'],
              equipment: ['Full pitch', 'Goals', 'Bibs'],
            },
            {
              name: 'Reflection',
              duration: 5,
              description: 'Key takeaways from defensive session — what shape do we default to when pressed?',
              coachingPoints: ['Default shape agreed', 'Press triggers from deep', 'Communication roles'],
              equipment: [],
            },
          ],
        },
      }));
    }
  }

  // ── Weekly Schedule ────────────────────────────────────────────────────────

  private async seedSchedule() {
    // Seed a realistic current week (week of 2026-04-06, Mon–Sun)
    // for each club using their actual squads.
    const allSquads = await this.squads.find();
    if (!allSquads.length) return;

    // Group squads by club so we know which squads belong to which club
    const squadsByClub = new Map<string, typeof allSquads>();
    for (const s of allSquads) {
      if (!squadsByClub.has(s.clubId)) squadsByClub.set(s.clubId, []);
      squadsByClub.get(s.clubId)!.push(s);
    }

    const save = (clubId: string, squadId: string, date: string, title: string, type: ScheduleEntryType) =>
      this.scheduleEntries.save(this.scheduleEntries.create({ clubId, squadId, date, title, type }));

    // Week of 2026-04-06
    const W = {
      Mon: '2026-04-06', Tue: '2026-04-07', Wed: '2026-04-08',
      Thu: '2026-04-09', Fri: '2026-04-10', Sat: '2026-04-11', Sun: '2026-04-12',
    };

    for (const [clubId, squads] of squadsByClub.entries()) {
      // Sort squads so first = primary (e.g. U17/U18), second = secondary
      const sorted = [...squads].sort((a, b) => a.ageGroup.localeCompare(b.ageGroup)).reverse();
      const [primary, secondary] = sorted;

      if (!primary) continue;

      // Monday — primary squad recovery
      await save(clubId, primary.id, W.Mon, 'Recovery', ScheduleEntryType.Recovery);

      // Tuesday — both squads training
      await save(clubId, primary.id,   W.Tue, 'Pressing Patterns',  ScheduleEntryType.Training);
      if (secondary) await save(clubId, secondary.id, W.Tue, 'Build-Up Play', ScheduleEntryType.Training);

      // Wednesday — both squads training
      await save(clubId, primary.id,   W.Wed, 'Tactical Shape',          ScheduleEntryType.Training);
      if (secondary) await save(clubId, secondary.id, W.Wed, 'Strength & Conditioning', ScheduleEntryType.Training);

      // Thursday — both squads training
      await save(clubId, primary.id,   W.Thu, 'Transition Work', ScheduleEntryType.Training);
      if (secondary) await save(clubId, secondary.id, W.Thu, 'Set Pieces',     ScheduleEntryType.Training);

      // Friday — both squads match prep / finishing
      await save(clubId, primary.id,   W.Fri, 'Match Prep', ScheduleEntryType.Training);
      if (secondary) await save(clubId, secondary.id, W.Fri, 'Finishing', ScheduleEntryType.Training);

      // Saturday — matches
      const opp1 = primary.ageGroup   === 'U17' ? 'vs Drogheda U17' : primary.ageGroup   === 'U18' ? 'vs Cork Hibernians U18' : `vs Bohemians ${primary.ageGroup}`;
      const opp2 = secondary?.ageGroup === 'U15' ? 'vs Bohemians U15' : secondary?.ageGroup === 'U16' ? 'vs Limerick FC U16' : secondary ? `vs Rovers ${secondary.ageGroup}` : '';
      await save(clubId, primary.id, W.Sat, opp1, ScheduleEntryType.Match);
      if (secondary) await save(clubId, secondary.id, W.Sat, opp2, ScheduleEntryType.Match);

      // Sunday — rest both squads
      await save(clubId, primary.id,   W.Sun, 'Rest Day', ScheduleEntryType.Rest);
      if (secondary) await save(clubId, secondary.id, W.Sun, 'Rest Day', ScheduleEntryType.Rest);
    }
  }
}
