import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Club } from '../clubs/entities/club.entity';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Club) private readonly clubs: Repository<Club>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const existingClubs = await this.clubs.count();
    if (existingClubs > 0) {
      this.logger.log('Seed data already present — skipping.');
      return;
    }
    this.logger.log('Seeding database…');
    await this.seed();
    this.logger.log('Seeding complete.');
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

    // ── Shelbourne ─────────────────────────────────────────────────────────
    await makeUser({ email: 'admin@shelbourne.com', firstName: 'Niall', lastName: 'Quinn', role: Role.Admin, clubId: shelbourne.id });

    await makeUser({ email: 'coach.davis@shelbourne.com', firstName: 'Tommy', lastName: 'Davis', role: Role.Coach, clubId: shelbourne.id });
    await makeUser({ email: 'coach.murphy@shelbourne.com', firstName: 'Sean', lastName: 'Murphy', role: Role.Coach, clubId: shelbourne.id });

    await makeUser({ email: 'aaron.connolly@shelbourne.com', firstName: 'Aaron', lastName: 'Connolly', role: Role.Player, clubId: shelbourne.id });
    await makeUser({ email: 'liam.kelly@shelbourne.com', firstName: 'Liam', lastName: 'Kelly', role: Role.Player, clubId: shelbourne.id });
    await makeUser({ email: 'cian.byrne@shelbourne.com', firstName: 'Cian', lastName: 'Byrne', role: Role.Player, clubId: shelbourne.id });
    await makeUser({ email: 'fionn.walsh@shelbourne.com', firstName: 'Fionn', lastName: 'Walsh', role: Role.Player, clubId: shelbourne.id });

    // ── Cork City ──────────────────────────────────────────────────────────
    await makeUser({ email: 'admin@corkcity.com', firstName: 'Damien', lastName: 'Duff', role: Role.Admin, clubId: cork.id });

    await makeUser({ email: 'coach.ryan@corkcity.com', firstName: 'James', lastName: 'Ryan', role: Role.Coach, clubId: cork.id });
    await makeUser({ email: 'coach.o-brien@corkcity.com', firstName: 'Patrick', lastName: "O'Brien", role: Role.Coach, clubId: cork.id });

    await makeUser({ email: 'conor.hayes@corkcity.com', firstName: 'Conor', lastName: 'Hayes', role: Role.Player, clubId: cork.id });
    await makeUser({ email: 'rory.lynch@corkcity.com', firstName: 'Rory', lastName: 'Lynch', role: Role.Player, clubId: cork.id });
    await makeUser({ email: 'eoin.o-sullivan@corkcity.com', firstName: 'Eoin', lastName: "O'Sullivan", role: Role.Player, clubId: cork.id });
    await makeUser({ email: 'darragh.power@corkcity.com', firstName: 'Darragh', lastName: 'Power', role: Role.Player, clubId: cork.id });
  }
}
