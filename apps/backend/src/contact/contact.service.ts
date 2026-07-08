import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    // TODO: verify reCAPTCHA token if RECAPTCHA_SECRET is set
    return this.prisma.contactMessage.create({ data: dto });
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });
  }

  async markReplied(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { replied: true },
    });
  }

  async remove(id: string) {
    return this.prisma.contactMessage.delete({ where: { id } });
  }

  async getUnreadCount() {
    return this.prisma.contactMessage.count({ where: { read: false } });
  }
}
