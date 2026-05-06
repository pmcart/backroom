import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.ensureSuperadmins();
  }

  private async ensureSuperadmins() {
    await this.ensureUser('patrickmcart@gmail.com', 'Patrick', 'McArt', 'Password1');
    await this.ensureUser('matt@backroom.ie', 'Matt', 'Kavanagh', 'backroom2026!');
  }

  private async ensureUser(email: string, firstName: string, lastName: string, password: string) {
    const existing = await this.users.findOne({ where: { email } });
    if (existing) return;

    this.logger.log(`Creating superadmin: ${email}`);
    await this.users
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        email,
        firstName,
        lastName,
        role: Role.SuperAdmin,
        password: await bcrypt.hash(password, 10),
        isActive: true,
      })
      .execute();
  }
}
