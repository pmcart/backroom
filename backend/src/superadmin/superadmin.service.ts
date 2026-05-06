import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from '../clubs/entities/club.entity';
import { User } from '../users/entities/user.entity';
import { Squad } from '../squads/entities/squad.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class SuperadminService {
  constructor(
    @InjectRepository(Club) private readonly clubRepo: Repository<Club>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Squad) private readonly squadRepo: Repository<Squad>,
    private readonly jwtService: JwtService,
  ) {}

  async getAllClubs() {
    const clubs = await this.clubRepo.find({ where: { isActive: true }, order: { createdAt: 'ASC' } });

    const results = await Promise.all(
      clubs.map(async (club) => {
        const [squadCount, userCount, adminCount, coachCount] = await Promise.all([
          this.squadRepo.count({ where: { clubId: club.id } }),
          this.userRepo.count({ where: { clubId: club.id } }),
          this.userRepo.count({ where: { clubId: club.id, role: Role.Admin } }),
          this.userRepo.count({ where: { clubId: club.id, role: Role.Coach } }),
        ]);
        return { ...club, squadCount, userCount, adminCount, coachCount };
      }),
    );

    return results;
  }

  async impersonateClub(clubId: string) {
    const club = await this.clubRepo.findOne({ where: { id: clubId, isActive: true } });
    if (!club) throw new NotFoundException('Club not found');

    const adminUser = await this.userRepo.findOne({
      where: { clubId, role: Role.Admin, isActive: true },
      relations: ['club'],
    });
    if (!adminUser) throw new ForbiddenException('No admin user found for this club');

    const token = this.jwtService.sign({ sub: adminUser.id, email: adminUser.email });

    return {
      accessToken: token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
        clubId: adminUser.clubId,
        clubName: club.name,
      },
    };
  }
}
