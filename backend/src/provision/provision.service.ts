import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { Club, DEFAULT_CLUB_SETTINGS } from '../clubs/entities/club.entity';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';
import { ProvisionDto } from './dto/provision.dto';
import { ProvisionEmailService } from './provision-email.service';

@Injectable()
export class ProvisionService {
  private readonly logger = new Logger(ProvisionService.name);

  constructor(
    @InjectRepository(Club) private clubRepo: Repository<Club>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private config: ConfigService,
    private emailService: ProvisionEmailService,
  ) {}

  async provision(dto: ProvisionDto) {
    const secret = this.config.get<string>('PROVISION_SECRET');
    if (!secret || dto.provisionKey !== secret) {
      throw new UnauthorizedException('Invalid provision key');
    }

    const exists = await this.clubRepo.findOne({
      where: [{ name: dto.organization.name }, { slug: dto.organization.slug }],
    });
    if (exists) {
      throw new ConflictException('An organisation with that name or slug already exists');
    }

    const club = this.clubRepo.create({
      name: dto.organization.name,
      slug: dto.organization.slug,
      isActive: true,
      settings: DEFAULT_CLUB_SETTINGS,
    });
    await this.clubRepo.save(club);
    this.logger.log(`Provisioned new club: ${club.name} (${club.id})`);

    const createdAdmins: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      temporaryPassword: string;
      emailSent: boolean;
    }[] = [];

    for (const adminDto of dto.admins) {
      const existing = await this.userRepo.findOne({ where: { email: adminDto.email } });
      if (existing) {
        throw new ConflictException(`Email already in use: ${adminDto.email}`);
      }

      const temporaryPassword = this.generatePassword();

      const user = this.userRepo.create({
        email: adminDto.email,
        password: temporaryPassword,
        firstName: adminDto.firstName,
        lastName: adminDto.lastName,
        role: Role.Admin,
        clubId: club.id,
        isActive: true,
      });
      await this.userRepo.save(user);

      let emailSent = false;
      try {
        await this.emailService.sendWelcomeEmail(adminDto, club.name, temporaryPassword);
        emailSent = true;
      } catch (err) {
        this.logger.warn(`Could not send welcome email to ${adminDto.email}: ${err.message}`);
      }

      createdAdmins.push({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        temporaryPassword,
        emailSent,
      });
    }

    return {
      club: { id: club.id, name: club.name, slug: club.slug },
      admins: createdAdmins,
    };
  }

  private generatePassword(): string {
    const upper   = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower   = 'abcdefghjkmnpqrstuvwxyz';
    const digits  = '23456789';
    const special = '!@#$%';

    const sets = [upper, lower, digits, special];
    const all  = sets.join('');

    // Guarantee at least one from each set
    let chars = sets.map(s => s[randomBytes(1)[0] % s.length]);

    // Fill remainder
    const remaining = randomBytes(8);
    for (let i = 0; i < 8; i++) {
      chars.push(all[remaining[i] % all.length]);
    }

    // Shuffle using Fisher-Yates with crypto random
    const shuffleBuf = randomBytes(chars.length);
    for (let i = chars.length - 1; i > 0; i--) {
      const j = shuffleBuf[i] % (i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join('');
  }
}
