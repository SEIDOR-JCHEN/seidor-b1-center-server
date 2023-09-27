import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signUp(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      },
      select: {
        id: true,
        email: true,
      },
    });

    const token = await this.getTokens(newUser.id, newUser.email);
    await this.updateHashedRt(newUser.id, token.refreshToken);

    return token;
  }

  async signIn(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) throw new ForbiddenException('User not found');
    const isPasswordValid = await compare(dto.password, user.password);
    if (!isPasswordValid) throw new ForbiddenException('Invalid password');

    const token = await this.getTokens(user.id, user.email);
    await this.updateHashedRt(user.id, token.refreshToken);
    return token;
  }

  async signOut(userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        hashedRt: true,
      },
    });

    if (!user) throw new ForbiddenException('User not found');

    const rtMatches = await compare(rt, user.hashedRt || '');

    if (!rtMatches) throw new ForbiddenException('Access denied');

    const token = await this.getTokens(user.id, user.email);
    await this.updateHashedRt(user.id, token.refreshToken);

    return token;
  }

  private async hashData(data: string): Promise<string> {
    return await hash(data, 10);
  }

  private async updateHashedRt(userId: number, rt: string) {
    const hashedRt = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt,
      },
    });
  }

  private async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          email,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN),
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          email,
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
        },
      ),
    ]);

    const tokens: Tokens = {
      accessToken: at,
      refreshToken: rt,
    };

    return tokens;
  }
}
