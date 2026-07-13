import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  // Admin routes FIRST (before :locale wildcard)
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/admin-login.component').then(m => m.AdminLoginComponent),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./pages/admin/profile/admin-profile.component').then(m => m.AdminProfileComponent) },
      { path: 'skills', loadComponent: () => import('./pages/admin/skills/admin-skills.component').then(m => m.AdminSkillsComponent) },
      { path: 'projects', loadComponent: () => import('./pages/admin/projects/admin-projects.component').then(m => m.AdminProjectsComponent) },
      { path: 'experience', loadComponent: () => import('./pages/admin/experience/admin-experience.component').then(m => m.AdminExperienceComponent) },
      { path: 'education', loadComponent: () => import('./pages/admin/education/admin-education.component').then(m => m.AdminEducationComponent) },
      { path: 'testimonials', loadComponent: () => import('./pages/admin/testimonials/admin-testimonials.component').then(m => m.AdminTestimonialsComponent) },
      { path: 'contact', loadComponent: () => import('./pages/admin/contact/admin-contact.component').then(m => m.AdminContactComponent) },
      { path: 'settings', loadComponent: () => import('./pages/admin/settings/admin-settings.component').then(m => m.AdminSettingsComponent) },
      { path: 'resume', loadComponent: () => import('./pages/admin/resume/admin-resume.component').then(m => m.AdminResumeComponent) },
      { path: 'blog', loadComponent: () => import('./pages/admin/blog/admin-blog.component').then(m => m.AdminBlogComponent) },
      { path: 'blog/categories', loadComponent: () => import('./pages/admin/blog-categories/admin-blog-categories.component').then(m => m.AdminBlogCategoriesComponent) },
      { path: 'blog/comments', loadComponent: () => import('./pages/admin/blog-comments/admin-blog-comments.component').then(m => m.AdminBlogCommentsComponent) },
      { path: 'blog/:id', loadComponent: () => import('./pages/admin/blog-detail/admin-blog-detail.component').then(m => m.AdminBlogDetailComponent) },
    ],
  },

  // Public routes with locale prefix (AFTER admin routes)
  {
    path: ':locale',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
      { path: 'skills', loadComponent: () => import('./pages/skills/skills.component').then(m => m.SkillsComponent) },
      { path: 'projects', loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'projects/:id', loadComponent: () => import('./pages/projects/project-detail.component').then(m => m.ProjectDetailComponent) },
      { path: 'experience', loadComponent: () => import('./pages/experience/experience.component').then(m => m.ExperienceComponent) },
      { path: 'education', loadComponent: () => import('./pages/education/education.component').then(m => m.EducationComponent) },
      { path: 'testimonials', loadComponent: () => import('./pages/testimonials/testimonials.component').then(m => m.TestimonialsComponent) },
      { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
      { path: 'blog', loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent) },
      { path: 'blog/:slug', loadComponent: () => import('./pages/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent) },
      { path: 'privacy', loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent) },
    ],
  },

  // Root redirect
  { path: '', redirectTo: '/en', pathMatch: 'full' },

  // 404 Page (must be last)
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
];
