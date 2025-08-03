import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '@repo/shared';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prismaService: PrismaService) {}

  async getProfile(userId: string): Promise<UserEntity> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        balance: true,
        avatarUrl: true,
        subscriptionTier: true,
      },
    });
    return user;
  }

  async getUserByUid(uid: string) {
    this.logger.debug(`Fetching user by UID: ${uid}`);
    const user = await this.prismaService.user.findUnique({
      where: { id: uid },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async findOneBySlug(slug: string) {
    this.logger.debug(`Fetching user by Slug: ${slug}`);
    return this.prismaService.user.findUnique({
      where: { id: slug },
    });
  }

  async deleteUser(userId: string) {
    this.logger.debug(`Deleting user with ID: ${userId}`);
    if (!userId) {
      throw new Error('User ID is required to delete user');
    }
    return this.prismaService.user.delete({
      where: { id: userId },
    });
  }
}
