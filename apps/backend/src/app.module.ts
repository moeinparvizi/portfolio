import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { SkillsModule } from './skills/skills.module';
import { ProjectsModule } from './projects/projects.module';
import { ExperienceModule } from './experience/experience.module';
import { EducationModule } from './education/education.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { ContactModule } from './contact/contact.module';
import { SettingsModule } from './settings/settings.module';
import { ResumeModule } from './resume/resume.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60000, limit: 100 },
      { name: 'auth', ttl: 60000, limit: 10 },
      { name: 'form', ttl: 60000, limit: 5 },
    ]),
    PrismaModule,
    AuthModule,
    ProfileModule,
    SkillsModule,
    ProjectsModule,
    ExperienceModule,
    EducationModule,
    TestimonialsModule,
    ContactModule,
    SettingsModule,
    ResumeModule,
    UploadModule,
  ],
})
export class AppModule {}
