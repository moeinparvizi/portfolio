import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import type { BlogPost } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, GlassCardComponent],
  template: `
    <div class="dashboard">
      <div class="welcome">
        <h1>Welcome back! 👋</h1>
        <p>Here's an overview of your portfolio</p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <app-glass-card>
          <div class="stat-card">
            <div class="stat-icon">🛠️</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.skills }}</span>
              <span class="stat-label">Skills</span>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card>
          <div class="stat-card">
            <div class="stat-icon">📁</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.projects }}</span>
              <span class="stat-label">Projects</span>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card>
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.blogPosts }}</span>
              <span class="stat-label">Blog Posts</span>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card>
          <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.totalComments }}</span>
              <span class="stat-label">Comments</span>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card>
          <div class="stat-card">
            <div class="stat-icon">👁</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.totalViews }}</span>
              <span class="stat-label">Total Views</span>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card>
          <div class="stat-card">
            <div class="stat-icon">✉️</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.messages }}</span>
              <span class="stat-label">Messages</span>
              @if (stats.unreadMessages > 0) {
                <span class="badge unread">{{ stats.unreadMessages }} new</span>
              }
            </div>
          </div>
        </app-glass-card>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Blog Comments Chart -->
        <app-glass-card>
          <h3>💬 Comments Overview</h3>
          <div class="chart-container">
            <div class="chart-row">
              <div class="chart-item">
                <span class="chart-label">Pending</span>
                <div class="chart-bar-container">
                  <div class="chart-bar pending" [style.width.%]="getCommentPercentage('pending')"></div>
                </div>
                <span class="chart-value">{{ stats.pendingComments }}</span>
              </div>
              <div class="chart-item">
                <span class="chart-label">Approved</span>
                <div class="chart-bar-container">
                  <div class="chart-bar approved" [style.width.%]="getCommentPercentage('approved')"></div>
                </div>
                <span class="chart-value">{{ stats.approvedComments }}</span>
              </div>
            </div>
            <div class="chart-total">
              Total: {{ stats.totalComments }} comments
            </div>
          </div>
        </app-glass-card>

        <!-- Blog Views Chart -->
        <app-glass-card>
          <h3>👁 Blog Views by Post</h3>
          <div class="chart-container">
            @for (post of blogPosts.slice(0, 5); track post.id) {
              <div class="chart-item">
                <span class="chart-label">{{ post.title['en'] || 'Untitled' | slice:0:20 }}</span>
                <div class="chart-bar-container">
                  <div class="chart-bar views" [style.width.%]="getViewPercentage(post.views)"></div>
                </div>
                <span class="chart-value">{{ post.views }}</span>
              </div>
            }
            @if (blogPosts.length === 0) {
              <p class="no-data">No blog posts yet</p>
            }
          </div>
        </app-glass-card>
      </div>

      <!-- Quick Actions -->
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <a routerLink="/admin/profile" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">👤</span>
            <span class="action-text">Edit Profile</span>
          </app-glass-card>
        </a>
        <a routerLink="/admin/skills" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">🛠️</span>
            <span class="action-text">Skills</span>
          </app-glass-card>
        </a>
        <a routerLink="/admin/projects" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">📁</span>
            <span class="action-text">Projects</span>
          </app-glass-card>
        </a>
        <a routerLink="/admin/blog" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">📝</span>
            <span class="action-text">Blog</span>
          </app-glass-card>
        </a>
        <a routerLink="/admin/resume" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">📄</span>
            <span class="action-text">Resume</span>
          </app-glass-card>
        </a>
        <a routerLink="/admin/settings" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">⚙️</span>
            <span class="action-text">Settings</span>
          </app-glass-card>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: var(--space-xl);
    }

    .welcome {
      margin-bottom: var(--space-xl);
      h1 { margin: 0; font-size: var(--text-2xl); }
      p { margin: var(--space-xs) 0 0; color: var(--color-text-secondary); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: var(--text-2xl);
      font-weight: 700;
    }

    .stat-label {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }

    .badge {
      font-size: var(--text-xs);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
      background: rgba(37, 99, 235, 0.1);
      color: var(--color-primary);
      margin-top: var(--space-xs);
      width: fit-content;
    }

    /* Charts */
    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);

      h3 {
        font-size: var(--text-lg);
        margin: 0 0 var(--space-lg);
      }
    }

    .chart-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .chart-row {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .chart-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .chart-label {
      width: 80px;
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      text-align: right;
      flex-shrink: 0;
    }

    .chart-bar-container {
      flex: 1;
      height: 24px;
      background: var(--color-surface-alt);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .chart-bar {
      height: 100%;
      border-radius: var(--radius-sm);
      transition: width 0.5s ease-out;
      min-width: 4px;

      &.pending {
        background: linear-gradient(90deg, #F59E0B, #FBBF24);
      }

      &.approved {
        background: linear-gradient(90deg, #10B981, #34D399);
      }

      &.views {
        background: linear-gradient(90deg, #6366F1, #818CF8);
      }
    }

    .chart-value {
      width: 40px;
      font-size: var(--text-sm);
      font-weight: 600;
      text-align: right;
    }

    .chart-total {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      text-align: center;
      margin-top: var(--space-sm);
      padding-top: var(--space-sm);
      border-top: 1px solid var(--color-border);
    }

    .no-data {
      text-align: center;
      color: var(--color-text-muted);
      font-size: var(--text-sm);
    }

    /* Quick Actions */
    h2 {
      font-size: var(--text-lg);
      margin: 0 0 var(--space-lg);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: var(--space-md);
    }

    .action-card {
      text-decoration: none;
      color: inherit;
    }

    .action-icon {
      display: block;
      font-size: 1.5rem;
      margin-bottom: var(--space-sm);
    }

    .action-text {
      font-size: var(--text-sm);
      font-weight: 500;
    }
  `],
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  stats = {
    skills: 0,
    projects: 0,
    blogPosts: 0,
    totalComments: 0,
    pendingComments: 0,
    approvedComments: 0,
    totalViews: 0,
    messages: 0,
    unreadMessages: 0,
  };

  blogPosts: BlogPost[] = [];

  ngOnInit() {
    this.loadStats();
    this.loadBlogPosts();
  }

  loadStats() {
    this.api.getSkills().subscribe(s => {
      this.stats.skills = s.length;
      this.cdr.detectChanges();
    });
    this.api.getProjects().subscribe(p => {
      this.stats.projects = p.length;
      this.cdr.detectChanges();
    });
    this.api.getBlogPosts().subscribe(posts => {
      this.stats.blogPosts = posts.length;
      this.blogPosts = posts.sort((a, b) => b.views - a.views);

      // Calculate comment stats
      let totalComments = 0;
      let totalViews = 0;
      posts.forEach(post => {
        totalComments += post.comments?.length || 0;
        totalViews += post.views || 0;
      });
      this.stats.totalComments = totalComments;
      this.stats.totalViews = totalViews;
      this.cdr.detectChanges();
    });
    this.api.getBlogPosts().subscribe(posts => {
      let pending = 0;
      let approved = 0;
      posts.forEach(post => {
        post.comments?.forEach(c => {
          if (c.approved) approved++;
          else pending++;
        });
      });
      this.stats.pendingComments = pending;
      this.stats.approvedComments = approved;
      this.cdr.detectChanges();
    });
    this.api.getMessages().subscribe(m => {
      this.stats.messages = m.length;
      this.stats.unreadMessages = m.filter(msg => !msg.read).length;
      this.cdr.detectChanges();
    });
  }

  loadBlogPosts() {
    this.api.getBlogPosts().subscribe({
      next: (posts) => {
        this.blogPosts = posts.sort((a, b) => b.views - a.views);
        this.cdr.detectChanges();
      },
    });
  }

  getCommentPercentage(type: 'pending' | 'approved'): number {
    if (this.stats.totalComments === 0) return 0;
    return type === 'pending'
      ? (this.stats.pendingComments / this.stats.totalComments) * 100
      : (this.stats.approvedComments / this.stats.totalComments) * 100;
  }

  getViewPercentage(views: number): number {
    if (this.blogPosts.length === 0) return 0;
    const maxViews = Math.max(...this.blogPosts.map(p => p.views));
    return maxViews > 0 ? (views / maxViews) * 100 : 0;
  }
}
