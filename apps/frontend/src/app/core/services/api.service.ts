import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  Profile, Skill, Project, Experience, Education,
  Testimonial, ContactMessage, SiteSettings,
  BlogPost, BlogCategory, BlogComment,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = '/api';

  // Profile
  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.base}/profile`);
  }

  updateProfile(data: Partial<Profile>): Observable<Profile> {
    return this.http.put<Profile>(`${this.base}/profile`, data);
  }

  // Skills
  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.base}/skills`);
  }

  createSkill(data: Partial<Skill>): Observable<Skill> {
    return this.http.post<Skill>(`${this.base}/skills`, data);
  }

  updateSkill(id: string, data: Partial<Skill>): Observable<Skill> {
    return this.http.put<Skill>(`${this.base}/skills/${id}`, data);
  }

  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/skills/${id}`);
  }

  reorderSkills(ids: string[]): Observable<void> {
    return this.http.put<void>(`${this.base}/skills/reorder/bulk`, { ids });
  }

  // Projects
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base}/projects`);
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base}/projects/featured`);
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.base}/projects/${id}`);
  }

  createProject(data: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.base}/projects`, data);
  }

  updateProject(id: string, data: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.base}/projects/${id}`, data);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/projects/${id}`);
  }

  // Experience
  getExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.base}/experience`);
  }

  createExperience(data: Partial<Experience>): Observable<Experience> {
    return this.http.post<Experience>(`${this.base}/experience`, data);
  }

  updateExperience(id: string, data: Partial<Experience>): Observable<Experience> {
    return this.http.put<Experience>(`${this.base}/experience/${id}`, data);
  }

  deleteExperience(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/experience/${id}`);
  }

  // Education
  getEducation(): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.base}/education`);
  }

  createEducation(data: Partial<Education>): Observable<Education> {
    return this.http.post<Education>(`${this.base}/education`, data);
  }

  updateEducation(id: string, data: Partial<Education>): Observable<Education> {
    return this.http.put<Education>(`${this.base}/education/${id}`, data);
  }

  deleteEducation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/education/${id}`);
  }

  // Testimonials
  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.base}/testimonials`);
  }

  getAllTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.base}/testimonials/admin/all`);
  }

  submitTestimonial(data: Partial<Testimonial>): Observable<Testimonial> {
    return this.http.post<Testimonial>(`${this.base}/testimonials`, data);
  }

  approveTestimonial(id: string): Observable<void> {
    return this.http.put<void>(`${this.base}/testimonials/${id}/approve`, {});
  }

  updateTestimonial(id: string, data: Partial<Testimonial>): Observable<Testimonial> {
    return this.http.put<Testimonial>(`${this.base}/testimonials/${id}`, data);
  }

  deleteTestimonial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/testimonials/${id}`);
  }

  // Contact
  submitContact(data: { name: string; email: string; subject?: string; message: string }): Observable<void> {
    return this.http.post<void>(`${this.base}/contact`, data);
  }

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.base}/contact`);
  }

  deleteMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/contact/${id}`);
  }

  markRead(id: string): Observable<void> {
    return this.http.put<void>(`${this.base}/contact/${id}/read`, {});
  }

  // Settings
  getSetting(key: string): Observable<SiteSettings> {
    return this.http.get<SiteSettings>(`${this.base}/settings/${key}`);
  }

  getAllSettings(): Observable<SiteSettings[]> {
    return this.http.get<SiteSettings[]>(`${this.base}/settings`);
  }

  updateSetting(key: string, value: any): Observable<SiteSettings> {
    return this.http.put<SiteSettings>(`${this.base}/settings/${key}`, { value });
  }

  // Resume
  generateResume(locale: string, showPhoto: boolean): Observable<Blob> {
    return this.http.post(`${this.base}/resume/generate`, { locale, showPhoto }, {
      responseType: 'blob',
    });
  }

  // Blog Posts
  getBlogPosts(status?: string, category?: string, sort?: string): Observable<BlogPost[]> {
    let params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    if (sort) params.append('sort', sort);
    const query = params.toString();
    return this.http.get<BlogPost[]>(`${this.base}/blog${query ? '?' + query : ''}`);
  }

  getBlogPost(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.base}/blog/${id}`);
  }

  getBlogPostBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.base}/blog/slug/${slug}`);
  }

  createBlogPost(data: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.base}/blog`, data);
  }

  updateBlogPost(id: string, data: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.base}/blog/${id}`, data);
  }

  deleteBlogPost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/blog/${id}`);
  }

  searchBlog(query: string, status?: string): Observable<BlogPost[]> {
    let params = new URLSearchParams();
    params.append('q', query);
    if (status) params.append('status', status);
    return this.http.get<BlogPost[]>(`${this.base}/blog/search?${params.toString()}`);
  }

  // Blog Categories
  getBlogCategories(): Observable<BlogCategory[]> {
    return this.http.get<BlogCategory[]>(`${this.base}/blog/categories`);
  }

  createBlogCategory(data: Partial<BlogCategory>): Observable<BlogCategory> {
    return this.http.post<BlogCategory>(`${this.base}/blog/categories`, data);
  }

  updateBlogCategory(id: string, data: Partial<BlogCategory>): Observable<BlogCategory> {
    return this.http.put<BlogCategory>(`${this.base}/blog/categories/${id}`, data);
  }

  deleteBlogCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/blog/categories/${id}`);
  }

  // Blog Comments
  getBlogComments(postId: string): Observable<BlogComment[]> {
    return this.http.get<BlogComment[]>(`${this.base}/blog/${postId}/comments`);
  }

  createBlogComment(postId: string, data: Partial<BlogComment>): Observable<BlogComment> {
    return this.http.post<BlogComment>(`${this.base}/blog/${postId}/comments`, data);
  }

  approveBlogComment(id: string): Observable<void> {
    return this.http.put<void>(`${this.base}/blog/comments/${id}/approve`, {});
  }

  replyToComment(commentId: string, data: { name: string; email: string; content: string }): Observable<BlogComment> {
    return this.http.post<BlogComment>(`${this.base}/blog/comments/${commentId}/reply`, data);
  }

  deleteBlogComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/blog/comments/${id}`);
  }
}
