import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  initials: string;
  avatarGrad: [string, string];
  quote: string;
  metric?: string;
  metricLabel?: string;
}

interface UserReview {
  name:    string;
  rating:  number;
  comment: string;
  date:    string;
}

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="rev-root" id="reviews">

      <!-- Background -->
      <div class="rev-orb rev-orb-1" aria-hidden="true"></div>
      <div class="rev-orb rev-orb-2" aria-hidden="true"></div>

      <!-- Header -->
      <div class="rev-header">
        <p class="rev-eyebrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Testimonials
        </p>
        <h2 class="rev-title">
          {{ productType === 'mf' ? 'What Investors Say After' : 'What Operators Say After' }}
          <span class="title-accent">{{ productType === 'mf' ? 'Choosing NViQ Wealth' : 'Switching to NViQ' }}</span>
        </h2>
        <p class="rev-sub">{{ productType === 'mf' ? 'Trusted by investors across India for transparent, zero-commission mutual fund guidance.' : "Trusted by fleet teams across India's logistics and transport sector." }}</p>
      </div>

      <!-- Featured reviews (auto-sliding) -->
      <div class="rev-featured"
        (mouseenter)="pauseFeaturedCarousel()"
        (mouseleave)="resumeFeaturedCarousel()">
        <div class="rev-featured-viewport">
          <div class="rev-featured-track"
            [style.transform]="'translateX(-' + (featuredIndex * 100) + '%)'">
        <article
          *ngFor="let item of featuredTestimonials; let i = index"
          class="rev-card"
          [class.visible]="entered"
          [style.transition-delay]="(i * 100) + 'ms'"
        >
          <!-- Big quote mark -->
          <div class="quote-mark" aria-hidden="true">"</div>

          <!-- Stars -->
          <div class="stars" aria-label="5 out of 5 stars">
            <svg *ngFor="let s of [1,2,3,4,5]" width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>

          <!-- Quote -->
          <p class="rev-quote">"{{ item.quote }}"</p>

          <!-- Metric pill -->
          <div *ngIf="item.metric" class="metric-pill">
            <span class="metric-num">{{ item.metric }}</span>
            <span class="metric-label">{{ item.metricLabel }}</span>
          </div>

          <!-- Divider -->
          <div class="card-divider"></div>

          <!-- Author -->
          <div class="rev-author">
            <div class="avatar"
              [style.background]="'linear-gradient(135deg,' + item.avatarGrad[0] + ',' + item.avatarGrad[1] + ')'">
              {{ item.initials }}
            </div>
            <div class="author-info">
              <strong>{{ item.name }}</strong>
              <span>{{ item.role }} · {{ item.company }}</span>
            </div>
          </div>

          <!-- Card shimmer on hover -->
          <div class="card-shimmer" aria-hidden="true"></div>
        </article>
          </div>
        </div>

        <!-- Dots -->
        <div class="rev-featured-dots" *ngIf="featuredTestimonials.length > 1">
          <button
            *ngFor="let item of featuredTestimonials; let i = index"
            type="button"
            class="rev-dot"
            [class.active]="i === featuredIndex"
            (click)="featuredIndex = i"
            [attr.aria-label]="'Featured review ' + (i + 1)">
          </button>
        </div>
      </div>

      <!-- Trust bar -->
      <div class="trust-bar">
        <div class="trust-item" *ngFor="let t of trustItems">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#22c55e" stroke-width="2.5" stroke-linecap="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          {{ t }}
        </div>
      </div>

      <!-- Actions -->
      <div class="rev-actions">
        <button type="button" class="rev-more-btn"
          (click)="toggleExpanded()"
          [attr.aria-expanded]="expanded"
          [attr.aria-controls]="expandedDomId">
          <span class="rev-more-text">
            {{ expanded ? 'Hide Reviews' : (productType === 'mf' ? 'See All Comments' : 'View More Reviews') }}
          </span>
          <svg class="rev-more-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
            [style.transform]="expanded ? 'rotate(180deg)' : 'none'">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>

      <!-- Expanded content -->
      <div [attr.id]="expandedDomId" #expandAnchor class="rev-expand" [class.expanded]="expanded">
        <div class="rev-expand-inner">

          <!-- Remaining testimonials -->
          <div class="rev-grid" *ngIf="moreTestimonials.length > 0">
            <article
              *ngFor="let item of moreTestimonials; let i = index"
              class="rev-card"
              [class.visible]="expanded"
              [style.transition-delay]="(i * 100) + 'ms'"
            >
              <!-- Big quote mark -->
              <div class="quote-mark" aria-hidden="true">"</div>

              <!-- Stars -->
              <div class="stars" aria-label="5 out of 5 stars">
                <svg *ngFor="let s of [1,2,3,4,5]" width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>

              <!-- Quote -->
              <p class="rev-quote">"{{ item.quote }}"</p>

              <!-- Metric pill -->
              <div *ngIf="item.metric" class="metric-pill">
                <span class="metric-num">{{ item.metric }}</span>
                <span class="metric-label">{{ item.metricLabel }}</span>
              </div>

              <!-- Divider -->
              <div class="card-divider"></div>

              <!-- Author -->
              <div class="rev-author">
                <div class="avatar"
                  [style.background]="'linear-gradient(135deg,' + item.avatarGrad[0] + ',' + item.avatarGrad[1] + ')'">
                  {{ item.initials }}
                </div>
                <div class="author-info">
                  <strong>{{ item.name }}</strong>
                  <span>{{ item.role }} &middot; {{ item.company }}</span>
                </div>
              </div>

              <!-- Card shimmer on hover -->
              <div class="card-shimmer" aria-hidden="true"></div>
            </article>
          </div>

      <!-- ── User Review Section ───────────────────────── -->
      <div class="ur-section">

        <div class="ur-divider" aria-hidden="true"></div>

        <div class="ur-layout">

          <!-- Form -->
          <div class="ur-form-wrap">
            <div class="ur-form-header">
              <h3 class="ur-form-title">Share Your Experience</h3>
              <p class="ur-form-sub">Your feedback helps others make better decisions.</p>
            </div>

            <div class="ur-form" [class.ur-submitted]="reviewSubmitted">

              <!-- Success state -->
              <div *ngIf="reviewSubmitted" class="ur-success">
                <div class="ur-success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="#22c55e" stroke-width="2.5" stroke-linecap="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <p>Thank you! Your review has been added.</p>
                <button class="ur-add-more" (click)="resetForm()">Add Another</button>
              </div>

              <!-- Form fields -->
              <ng-container *ngIf="!reviewSubmitted">
                <div class="ur-field">
                  <label class="ur-label">Your Name</label>
                  <input type="text" [(ngModel)]="reviewForm.name"
                    placeholder="e.g. Rahul Mehta"
                    class="ur-input" maxlength="40"/>
                </div>

                <div class="ur-field">
                  <label class="ur-label">Rating</label>
                  <div class="ur-stars">
                    <button *ngFor="let s of [1,2,3,4,5]" type="button"
                      class="ur-star"
                      [class.ur-star-filled]="s <= reviewForm.rating"
                      [class.ur-star-hover]="s <= hoverRating"
                      (mouseenter)="hoverRating = s"
                      (mouseleave)="hoverRating = 0"
                      (click)="reviewForm.rating = s"
                      [attr.aria-label]="s + ' star'">
                      <svg width="24" height="24" viewBox="0 0 24 24"
                        [attr.fill]="(s <= (hoverRating || reviewForm.rating)) ? '#FBBF24' : 'none'"
                        [attr.stroke]="(s <= (hoverRating || reviewForm.rating)) ? '#FBBF24' : '#334155'"
                        stroke-width="1.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="ur-field">
                  <label class="ur-label">Your Review</label>
                  <textarea [(ngModel)]="reviewForm.comment"
                    placeholder="Share your experience with NViQ..."
                    class="ur-textarea" rows="3" maxlength="300"></textarea>
                  <span class="ur-char-count">{{ reviewForm.comment.length }}/300</span>
                </div>

                <p *ngIf="reviewError" class="ur-error">{{ reviewError }}</p>

                <button type="button" class="ur-submit" (click)="submitReview()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                  Submit Review
                </button>
              </ng-container>

            </div>
          </div>

          <!-- Live Reviews Carousel -->
          <div class="ur-carousel-wrap"
            (mouseenter)="pauseCarousel()"
            (mouseleave)="resumeCarousel()">

            <div class="ur-carousel-header">
              <span class="ur-live-badge">
                <span class="ur-live-dot"></span>
                Live Reviews
              </span>
              <span class="ur-review-count">{{ userReviews.length }} review{{ userReviews.length !== 1 ? 's' : '' }}</span>
            </div>

            <div *ngIf="userReviews.length === 0" class="ur-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="#334155" stroke-width="1.5" stroke-linecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p>Be the first to leave a review!</p>
            </div>

            <div class="ur-carousel" *ngIf="userReviews.length > 0">
              <div class="ur-track"
                [style.transform]="'translateX(-' + (carouselIndex * 100) + '%)'">
                <div *ngFor="let r of userReviews" class="ur-review-card">
                  <div class="ur-review-top">
                    <div class="ur-review-avatar">{{ getInitials(r.name) }}</div>
                    <div class="ur-review-meta">
                      <strong>{{ r.name }}</strong>
                      <span>{{ r.date }}</span>
                    </div>
                  </div>
                  <div class="ur-review-stars">
                    <svg *ngFor="let s of [1,2,3,4,5]" width="13" height="13" viewBox="0 0 24 24"
                      [attr.fill]="s <= r.rating ? '#FBBF24' : 'none'"
                      [attr.stroke]="s <= r.rating ? '#FBBF24' : '#334155'"
                      stroke-width="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <p class="ur-review-text">"{{ r.comment }}"</p>
                </div>
              </div>

              <!-- Carousel dots -->
              <div class="ur-carousel-dots">
                <button *ngFor="let r of userReviews; let i = index"
                  class="ur-c-dot"
                  [class.ur-c-dot-active]="i === carouselIndex"
                  (click)="carouselIndex = i">
                </button>
              </div>
            </div>

            <!-- All comments list (expanded) -->
            <div class="ur-all" *ngIf="userReviews.length > 0">
              <div class="ur-all-header">
                <span class="ur-all-title">All Comments</span>
                <span class="ur-all-count">({{ userReviews.length }})</span>
              </div>

              <div class="ur-all-grid">
                <div *ngFor="let r of userReviews; let i = index"
                  class="ur-review-card ur-review-card-static"
                  [style.animation-delay]="(i * 60) + 'ms'">
                  <div class="ur-review-top">
                    <div class="ur-review-avatar">{{ getInitials(r.name) }}</div>
                    <div class="ur-review-meta">
                      <strong>{{ r.name }}</strong>
                      <span>{{ r.date }}</span>
                    </div>
                  </div>
                  <div class="ur-review-stars">
                    <svg *ngFor="let s of [1,2,3,4,5]" width="13" height="13" viewBox="0 0 24 24"
                      [attr.fill]="s <= r.rating ? '#FBBF24' : 'none'"
                      [attr.stroke]="s <= r.rating ? '#FBBF24' : '#334155'"
                      stroke-width="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <p class="ur-review-text">"{{ r.comment }}"</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

        </div>
      </div>

    </section>
  `,
  styles: [`
    /* ─── Root ─────────────────────────────────────────── */
    .rev-root {
      position: relative;
      padding: 100px 24px 80px;
      background: linear-gradient(180deg, #070d18 0%, #04070f 100%);
      overflow: hidden;
      isolation: isolate;
    }

    /* ─── Orbs ──────────────────────────────────────────── */
    .rev-orb {
      position: absolute; border-radius: 50%;
      filter: blur(120px); pointer-events: none; z-index: 0;
    }
    .rev-orb-1 {
      width: 560px; height: 560px;
      background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
      top: -120px; right: -80px;
      animation: orbA 22s ease-in-out infinite;
    }
    .rev-orb-2 {
      width: 440px; height: 440px;
      background: radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%);
      bottom: -80px; left: -60px;
      animation: orbB 26s ease-in-out infinite;
    }
    @keyframes orbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-60px,50px)} }
    @keyframes orbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(50px,-40px)} }

    /* ─── Header ────────────────────────────────────────── */
    .rev-header {
      position: relative; z-index: 2;
      text-align: center; max-width: 680px;
      margin: 0 auto 56px;
    }
    .rev-eyebrow {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 5px 16px; border-radius: 999px;
      border: 1px solid rgba(251,191,36,0.25);
      background: rgba(251,191,36,0.07);
      color: #FBBF24;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.14em;
      margin-bottom: 20px;
    }
    .rev-title {
      font-family: var(--font-display);
      font-size: clamp(1.9rem, 4vw, 3.1rem);
      font-weight: 900; letter-spacing: -0.03em;
      color: var(--text-primary); margin: 0 0 14px;
      line-height: 1.1;
    }
    .title-accent {
      background: linear-gradient(120deg, var(--brand-cyan), var(--brand-indigo));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .rev-sub {
      color: var(--text-secondary); font-size: 0.98rem; margin: 0; line-height: 1.6;
    }

    /* Featured carousel */
    .rev-featured {
      position: relative; z-index: 2;
      max-width: 760px;
      margin: 0 auto 28px;
    }
    .rev-featured-viewport {
      overflow: hidden;
      border-radius: 22px;
    }
    .rev-featured-track {
      display: flex;
      will-change: transform;
      transition: transform 0.65s cubic-bezier(0.22,1,0.36,1);
    }
    .rev-featured-track .rev-card {
      flex: 0 0 100%;
      margin: 0;
    }
    .rev-featured-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding-top: 14px;
    }
    .rev-dot {
      width: 8px; height: 8px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      padding: 0;
      background: rgba(255,255,255,0.22);
      transition: width 0.3s ease, background 0.3s ease;
    }
    .rev-dot.active {
      width: 26px;
      background: #6366F1;
    }

    /* Expand control */
    .rev-actions {
      position: relative; z-index: 2;
      display: flex;
      justify-content: center;
      margin: 8px auto 0;
    }
    .rev-more-btn {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 12px 18px;
      border-radius: 999px;
      background: rgba(99,102,241,0.10);
      border: 1px solid rgba(99,102,241,0.22);
      color: rgba(226,232,240,0.92);
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.02em;
      cursor: pointer;
      transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    }
    .rev-more-btn:hover {
      transform: translateY(-1px);
      background: rgba(0,212,255,0.10);
      border-color: rgba(0,212,255,0.22);
    }
    .rev-more-icon { opacity: 0.9; }

    .rev-expand {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transform: translateY(-8px);
      pointer-events: none;
      visibility: hidden;
      transition:
        max-height 0.9s cubic-bezier(0.16,1,0.3,1),
        opacity 0.35s ease,
        transform 0.35s ease;
    }
    .rev-expand.expanded {
      max-height: 5200px;
      opacity: 1;
      transform: none;
      pointer-events: auto;
      visibility: visible;
    }
    .rev-expand-inner { padding-top: 26px; }
    .rev-expand .rev-grid { margin-bottom: 34px; }

    /* ─── Grid ──────────────────────────────────────────── */
    .rev-grid {
      position: relative; z-index: 2;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      max-width: 1120px;
      margin: 0 auto 48px;
    }

    /* ─── Card ──────────────────────────────────────────── */
    .rev-card {
      position: relative;
      padding: 28px 24px 26px;
      border-radius: 20px;
      border: 1px solid var(--border-subtle);
      background: linear-gradient(160deg, rgba(12,18,32,0.95) 0%, rgba(8,13,26,0.98) 100%);
      display: flex; flex-direction: column; gap: 16px;
      overflow: hidden;
      opacity: 0; transform: translateY(32px);
      transition: opacity 0.65s ease, transform 0.65s ease,
                  border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .rev-card.visible {
      opacity: 1; transform: none;
    }
    .rev-card:hover {
      border-color: rgba(99,102,241,0.35);
      box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.15);
      transform: translateY(-5px);
    }
    .rev-card.visible:hover { transform: translateY(-5px); }

    /* Shimmer on hover */
    .card-shimmer {
      position: absolute; top: 0; left: -100%;
      width: 60%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
      transform: skewX(-15deg);
      transition: left 0.6s ease;
      pointer-events: none;
    }
    .rev-card:hover .card-shimmer { left: 160%; }

    /* Quote mark */
    .quote-mark {
      position: absolute;
      top: 12px; right: 20px;
      font-size: 80px; line-height: 1;
      font-family: Georgia, serif;
      color: rgba(99,102,241,0.12);
      pointer-events: none;
      user-select: none;
    }

    /* Stars */
    .stars {
      display: flex; gap: 3px;
      animation: starShine 0.5s ease both;
    }
    @keyframes starShine {
      from { opacity:0; transform:scale(0.8); }
      to   { opacity:1; transform:none; }
    }

    /* Quote */
    .rev-quote {
      color: rgba(226,232,240,0.88);
      font-size: 0.93rem; line-height: 1.72;
      margin: 0; flex: 1;
      font-style: italic;
    }

    /* Metric pill */
    .metric-pill {
      display: inline-flex; align-items: baseline; gap: 6px;
      padding: 6px 14px; border-radius: 999px;
      background: rgba(0,212,255,0.08);
      border: 1px solid rgba(0,212,255,0.18);
      width: fit-content;
    }
    .metric-num {
      font-family: var(--font-display);
      font-size: 1.3rem; font-weight: 900;
      background: linear-gradient(120deg, var(--brand-cyan), var(--brand-indigo));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .metric-label {
      font-size: 11px; font-weight: 600;
      color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em;
    }

    /* Divider */
    .card-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border-subtle), transparent);
    }

    /* Author */
    .rev-author {
      display: flex; align-items: center; gap: 12px;
    }
    .avatar {
      width: 44px; height: 44px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display);
      font-size: 14px; font-weight: 800; color: #fff;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .author-info strong {
      display: block;
      color: var(--text-primary); font-size: 13.5px; font-weight: 700;
    }
    .author-info span {
      display: block;
      color: var(--text-muted); font-size: 11.5px; margin-top: 2px;
    }

    /* ─── Trust bar ──────────────────────────────────────  */
    .trust-bar {
      position: relative; z-index: 2;
      display: flex; align-items: center; justify-content: center;
      flex-wrap: wrap; gap: 10px 28px;
      max-width: 860px; margin: 0 auto;
    }
    .trust-item {
      display: flex; align-items: center; gap: 6px;
      font-size: 12.5px; font-weight: 600;
      color: var(--text-secondary);
    }

    /* ─── Responsive ─────────────────────────────────────  */
    @media (max-width: 1024px) { .rev-grid { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 640px)  { .rev-root { padding: 72px 16px 56px; } .rev-grid { grid-template-columns: 1fr; } }

    /* ─── User Review Section ───────────────────────────── */
    .ur-section {
      position: relative; z-index: 2;
      max-width: 1120px; margin: 0 auto;
    }

    .ur-divider {
      height: 1px; margin: 48px 0;
      background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);
    }

    .ur-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      align-items: start;
    }

    /* ─── Form ──────────────────────────────────────────── */
    .ur-form-header { margin-bottom: 20px; }
    .ur-form-title {
      font-family: var(--font-display);
      font-size: 1.4rem; font-weight: 800;
      color: var(--text-primary); margin: 0 0 6px;
      letter-spacing: -0.02em;
    }
    .ur-form-sub { font-size: 0.85rem; color: var(--text-muted); margin: 0; }

    .ur-form {
      background: linear-gradient(160deg, rgba(12,18,32,0.95) 0%, rgba(8,13,26,0.98) 100%);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 20px; padding: 28px 24px;
      display: flex; flex-direction: column; gap: 18px;
    }

    .ur-field { display: flex; flex-direction: column; gap: 7px; }
    .ur-label {
      font-size: 11.5px; font-weight: 700; color: #94A3B8;
      text-transform: uppercase; letter-spacing: 0.08em;
    }

    .ur-input, .ur-textarea {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 12px; padding: 12px 16px;
      color: #F0F6FF; font-size: 14px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      outline: none; width: 100%; box-sizing: border-box;
      font-family: inherit;
    }
    .ur-input::placeholder, .ur-textarea::placeholder { color: #334155; }
    .ur-input:focus, .ur-textarea:focus {
      border-color: rgba(99,102,241,0.45);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
    }
    .ur-textarea { resize: none; line-height: 1.6; }
    .ur-char-count {
      font-size: 11px; color: #334155; text-align: right; margin-top: -4px;
    }

    /* Stars */
    .ur-stars { display: flex; gap: 4px; }
    .ur-star {
      background: none; border: none; padding: 2px;
      cursor: pointer; transition: transform 0.15s ease;
    }
    .ur-star:hover { transform: scale(1.15); }

    .ur-error { font-size: 12px; color: #f87171; margin: -8px 0; }

    .ur-submit {
      display: inline-flex; align-items: center; gap: 9px;
      height: 48px; padding: 0 24px; border-radius: 12px; border: none;
      background: linear-gradient(135deg, #6366F1, #3B82F6);
      color: #fff; font-size: 14px; font-weight: 700;
      cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 6px 20px rgba(99,102,241,0.25);
      align-self: flex-start;
    }
    .ur-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(99,102,241,0.38);
    }

    /* Success state */
    .ur-success {
      display: flex; flex-direction: column; align-items: center;
      gap: 14px; padding: 20px 0; text-align: center;
    }
    .ur-success-icon {
      width: 56px; height: 56px; border-radius: 50%;
      background: rgba(34,197,94,0.1);
      border: 1px solid rgba(34,197,94,0.25);
      display: flex; align-items: center; justify-content: center;
    }
    .ur-success p { color: #94A3B8; font-size: 14px; margin: 0; }
    .ur-add-more {
      background: none; border: 1px solid rgba(255,255,255,0.1);
      color: #64748B; font-size: 13px; font-weight: 600;
      padding: 8px 20px; border-radius: 10px; cursor: pointer;
      transition: all 0.2s ease;
    }
    .ur-add-more:hover { color: #F0F6FF; border-color: rgba(255,255,255,0.2); }

    /* ─── Live Carousel ─────────────────────────────────── */
    .ur-carousel-wrap {
      display: flex; flex-direction: column; gap: 16px;
    }

    .ur-carousel-header {
      display: flex; align-items: center; justify-content: space-between;
    }
    .ur-live-badge {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 5px 14px; border-radius: 999px;
      border: 1px solid rgba(34,197,94,0.25);
      background: rgba(34,197,94,0.07);
      color: #22c55e; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em;
    }
    .ur-live-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #22c55e;
      animation: livePulse 1.8s ease-in-out infinite;
    }
    @keyframes livePulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
      50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
    }
    .ur-review-count { font-size: 12px; color: #334155; font-weight: 600; }

    .ur-empty {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; padding: 48px 24px; text-align: center;
      background: rgba(255,255,255,0.02);
      border: 1px dashed rgba(255,255,255,0.07);
      border-radius: 20px;
    }
    .ur-empty p { color: #334155; font-size: 13px; margin: 0; }

    .ur-carousel {
      overflow: hidden; border-radius: 20px; position: relative;
    }
    .ur-track {
      display: flex;
      transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
    }

    .ur-review-card {
      min-width: 100%; padding: 28px 24px;
      background: linear-gradient(160deg, rgba(12,18,32,0.95) 0%, rgba(8,13,26,0.98) 100%);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 20px;
      display: flex; flex-direction: column; gap: 14px;
      box-sizing: border-box;
      animation: ur-card-in 0.4s ease both;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .ur-review-card:hover {
      border-color: rgba(99,102,241,0.3);
      box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    }
    @keyframes ur-card-in {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: none; }
    }

    .ur-review-top { display: flex; align-items: center; gap: 12px; }
    .ur-review-avatar {
      width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #6366F1, #3B82F6);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-size: 14px; font-weight: 800; color: #fff;
    }
    .ur-review-meta strong {
      display: block; color: var(--text-primary); font-size: 14px; font-weight: 700;
    }
    .ur-review-meta span {
      display: block; color: var(--text-muted); font-size: 11px; margin-top: 2px;
    }

    .ur-review-stars { display: flex; gap: 3px; }

    .ur-review-text {
      color: rgba(226,232,240,0.82); font-size: 0.92rem;
      line-height: 1.7; margin: 0; font-style: italic;
    }

    .ur-carousel-dots {
      display: flex; justify-content: center; gap: 7px; padding-top: 14px;
    }
    .ur-c-dot {
      width: 7px; height: 7px; border-radius: 999px;
      background: rgba(255,255,255,0.2); border: none; cursor: pointer; padding: 0;
      transition: width 0.3s ease, background 0.3s ease;
    }
    .ur-c-dot-active { width: 22px; background: #6366F1; }

    /* Expanded list */
    .ur-all {
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .ur-all-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .ur-all-title {
      color: rgba(226,232,240,0.92);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .ur-all-count { color: var(--text-muted); font-size: 12px; }
    .ur-all-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .ur-review-card.ur-review-card-static { min-width: 0; }

    /* ─── Responsive ─────────────────────────────────────── */
    @media (max-width: 768px) {
      .ur-layout { grid-template-columns: 1fr; }
      .ur-all-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class ReviewsSectionComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() productType: 'gps' | 'mf' = 'gps';
  @ViewChild('expandAnchor') expandAnchor?: ElementRef<HTMLElement>;

  expanded = false;
  entered  = false;

  featuredIndex = 0;
  private featuredTimer: any;
  private featuredPaused = false;

  private static nextId = 0;
  readonly expandedDomId = `rev-expanded-${ReviewsSectionComponent.nextId++}`;

  private readonly featuredCount = 2;

  get testimonials(): Testimonial[] {
    return this.productType === 'mf' ? this.mfTestimonials : this.gpsTestimonials;
  }

  get featuredTestimonials(): Testimonial[] {
    return this.testimonials.slice(0, this.featuredCount);
  }

  get moreTestimonials(): Testimonial[] {
    return this.testimonials.slice(this.featuredCount);
  }

  get trustItems(): string[] {
    return this.productType === 'mf' ? this.mfTrustItems : this.gpsTrustItems;
  }

  mfTestimonials: Testimonial[] = [
    {
      name: 'Priya Nair',
      role: 'Software Engineer',
      company: 'Bengaluru',
      initials: 'PN',
      avatarGrad: ['#6366F1', '#00D4FF'],
      quote: 'I started a ₹5,000 SIP through NViQ Wealth and the onboarding was seamless. The goal tracker shows exactly how close I am to my home down-payment target — it keeps me motivated.',
      metric: '₹5K',
      metricLabel: 'Monthly SIP',
    },
    {
      name: 'Karan Mehta',
      role: 'Business Owner',
      company: 'Mumbai',
      initials: 'KM',
      avatarGrad: ['#10B981', '#6366F1'],
      quote: 'The ELSS fund recommendation saved me ₹46,000 in taxes last year while my portfolio grew 14%. Zero commission and a real advisor call every quarter — I wish I had started sooner.',
      metric: '₹46K',
      metricLabel: 'Tax Saved',
    },
    {
      name: 'Sunita Reddy',
      role: 'Doctor',
      company: 'Hyderabad',
      initials: 'SR',
      avatarGrad: ['#F59E0B', '#EF4444'],
      quote: 'Switching from my old broker was the best financial decision I made. NViQ Wealth is transparent, the returns are clearly displayed, and I never feel like I\'m being pushed into the wrong fund.',
      metric: '14.2%',
      metricLabel: '3-yr CAGR',
    },
  ];

  mfTrustItems = [
    'SEBI & AMFI Registered',
    'Zero Commission on all funds',
    '₹1,000/month minimum SIP',
    'Instant KYC — fully online',
  ];

  gpsTestimonials: Testimonial[] = [
    {
      name: 'Rohit Sharma',
      role: 'Fleet Manager',
      company: 'RoadLink Logistics',
      initials: 'RS',
      avatarGrad: ['#0EA5E9', '#6366F1'],
      quote: 'Within two weeks we reduced route delays by 34% and gained complete real-time visibility. The data NViQ gives us is better than what we paid for with three separate tools before.',
      metric: '34%',
      metricLabel: 'Delay Reduction',
    },
    {
      name: 'Meena Iyer',
      role: 'Operations Head',
      company: 'TransitOne Mobility',
      initials: 'MI',
      avatarGrad: ['#10B981', '#0EA5E9'],
      quote: 'The dashboard is clear and fast. Our dispatch team now makes decisions based on live data instead of guesswork. Onboarding took less than a day — no technical expertise needed.',
      metric: '1 Day',
      metricLabel: 'To Go Live',
    },
    {
      name: 'Arvind Patel',
      role: 'Business Owner',
      company: 'CargoVerse Transport',
      initials: 'AP',
      avatarGrad: ['#F59E0B', '#EF4444'],
      quote: 'NViQ helped us control fuel variance and improve on-time delivery by 28%. The cost impact was visible in the first month. I recommend it to every fleet owner I meet.',
      metric: '28%',
      metricLabel: 'OTD Improvement',
    },
  ];

  gpsTrustItems = [
    'Trusted by 1,000+ fleet operators',
    'Average 4.9 / 5 rating',
    'Zero-complaint onboarding',
    'Live support — 7 days a week',
  ];

  /* ── User Reviews ─────────────────────────────────── */
  userReviews: UserReview[] = [];
  carouselIndex = 0;
  hoverRating   = 0;
  reviewSubmitted = false;
  reviewError     = '';
  private carouselTimer: any;
  private carouselPaused = false;

  reviewForm = { name: '', rating: 0, comment: '' };

  submitReview(): void {
    const { name, rating, comment } = this.reviewForm;
    if (!name.trim()) { this.reviewError = 'Please enter your name.'; return; }
    if (rating === 0) { this.reviewError = 'Please select a star rating.'; return; }
    if (!comment.trim() || comment.trim().length < 5) {
      this.reviewError = 'Please write at least a short review.'; return;
    }
    this.reviewError = '';
    const now = new Date();
    this.userReviews.push({
      name:    name.trim(),
      rating,
      comment: comment.trim(),
      date:    now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    });
    this.carouselIndex = this.userReviews.length - 1;
    this.reviewSubmitted = true;
  }

  resetForm(): void {
    this.reviewForm = { name: '', rating: 0, comment: '' };
    this.reviewSubmitted = false;
    this.reviewError = '';
    this.hoverRating = 0;
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  pauseCarousel(): void  { this.carouselPaused = true; }
  resumeCarousel(): void { this.carouselPaused = false; }

  pauseFeaturedCarousel(): void  { this.featuredPaused = true; }
  resumeFeaturedCarousel(): void { this.featuredPaused = false; }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
    if (this.expanded) {
      setTimeout(() => {
        this.expandAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  private startCarousel(): void {
    this.carouselTimer = setInterval(() => {
      if (!this.carouselPaused && this.userReviews.length > 1) {
        this.carouselIndex = (this.carouselIndex + 1) % this.userReviews.length;
      }
    }, 2000);
  }

  private startFeaturedCarousel(): void {
    this.featuredTimer = setInterval(() => {
      const total = this.featuredTestimonials.length;
      if (!this.featuredPaused && total > 1) {
        this.featuredIndex = (this.featuredIndex + 1) % total;
      }
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productType']) {
      this.featuredIndex = 0;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => { this.entered = true; }, 80);
    this.startCarousel();
    this.startFeaturedCarousel();
  }

  ngOnDestroy(): void {
    clearInterval(this.carouselTimer);
    clearInterval(this.featuredTimer);
  }
}
