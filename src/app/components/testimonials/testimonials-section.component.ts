import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  initials: string;
  avatarColor: string;
  quote: string;
  metric: string;
  metricLabel: string;
  metricColor: string;
  stars: number;
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="testimonials-wrap" id="testimonials">
      <div class="t-glow" aria-hidden="true"></div>

      <div class="container">
        <!-- Header -->
        <div class="section-header">
          <span class="section-eyebrow">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Testimonials
          </span>
          <h2 class="section-title">
            What Operators Say After<br>
            <span class="gradient-text">Switching to NViQ</span>
          </h2>
          <p class="section-sub">
            Real results from real fleet managers. No sugar-coating — just measurable business impact.
          </p>
        </div>

        <!-- Featured testimonial -->
        <div class="featured-testimonial"
          (mouseenter)="pauseFeaturedCarousel()"
          (mouseleave)="resumeFeaturedCarousel()">
          <div class="ft-quote-mark">"</div>
          <blockquote class="ft-quote">
            {{ featured.quote }}
          </blockquote>
          <div class="ft-author">
            <div class="ft-avatar" [style.background]="featured.avatarColor">{{ featured.initials }}</div>
            <div>
              <div class="ft-name">{{ featured.name }}</div>
              <div class="ft-role">{{ featured.role }} · {{ featured.company }}</div>
            </div>
            <div class="ft-metric" *ngIf="featured.metric">
              <span class="ft-metric-val" [style.color]="featured.metricColor">{{ featured.metric }}</span>
              <span class="ft-metric-label">{{ featured.metricLabel }}</span>
            </div>
          </div>

          <div class="ft-dots" *ngIf="featuredTestimonials.length > 1">
            <button *ngFor="let t of featuredTestimonials; let i = index"
              type="button"
              class="ft-dot"
              [class.ft-dot-active]="i === featuredIndex"
              (click)="featuredIndex = i"
              [attr.aria-label]="'Featured review ' + (i + 1)">
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="t-actions">
          <button type="button" class="t-more-btn"
            (click)="toggleExpanded()"
            [attr.aria-expanded]="expanded"
            [attr.aria-controls]="expandedDomId">
            <span>{{ expanded ? 'Hide Reviews' : 'View More Reviews' }}</span>
            <svg class="t-more-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              [style.transform]="expanded ? 'rotate(180deg)' : 'none'">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>

        <!-- Expanded content -->
        <div [attr.id]="expandedDomId" #expandAnchor class="t-expand" [class.expanded]="expanded">
          <div class="t-expand-inner">

            <!-- Cards grid -->
            <div class="testimonials-grid">
              <article class="t-card" *ngFor="let t of moreTestimonials; let i = index"
                [style.animation-delay]="(i * 0.1) + 's'">

                <!-- Stars -->
                <div class="t-stars">
                  <svg *ngFor="let s of [1,2,3,4,5]" width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>

                <!-- Quote -->
                <p class="t-quote">"{{ t.quote }}"</p>

                <!-- Metric highlight -->
                <div class="t-metric">
                  <span class="t-metric-val" [style.color]="t.metricColor">{{ t.metric }}</span>
                  <span class="t-metric-label">{{ t.metricLabel }}</span>
                </div>

                <!-- Author -->
                <div class="t-author">
                  <div class="t-avatar" [style.background]="t.avatarColor">{{ t.initials }}</div>
                  <div class="t-author-info">
                    <div class="t-name">{{ t.name }}</div>
                    <div class="t-role">{{ t.role }} · {{ t.company }}</div>
                  </div>
                </div>

                <!-- Card glow on hover -->
                <div class="t-card-shine" aria-hidden="true"></div>
              </article>
            </div>

            <!-- Social proof bar -->
            <div class="social-proof-bar">
              <div class="sp-item">
                <div class="sp-avatars">
                  <div class="sp-avatar" style="background:linear-gradient(135deg,#00D4FF,#6366F1)">R</div>
                  <div class="sp-avatar" style="background:linear-gradient(135deg,#10B981,#00D4FF)">M</div>
                  <div class="sp-avatar" style="background:linear-gradient(135deg,#F59E0B,#F43F5E)">A</div>
                  <div class="sp-avatar" style="background:linear-gradient(135deg,#6366F1,#8B5CF6)">P</div>
                  <div class="sp-avatar sp-more">+996</div>
                </div>
                <div class="sp-text">
                  <strong>1,000+ fleet managers</strong> trust NViQ every day
                </div>
              </div>
              <div class="sp-divider"></div>
              <div class="sp-rating">
                <div class="sp-stars">
                  <svg *ngFor="let s of [1,2,3,4,5]" width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span class="sp-rating-val">4.9 / 5.0</span>
                <span class="sp-rating-label">average rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials-wrap {
      background: linear-gradient(180deg, #04070F 0%, #07101E 100%);
      padding: 100px 0;
      position: relative;
      overflow: hidden;
    }

    .t-glow {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 800px; height: 600px;
      background: radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 65%);
      pointer-events: none;
    }

    .section-header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 56px;
    }

    .section-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(245,158,11,0.07);
      border: 1px solid rgba(245,158,11,0.15);
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #F59E0B;
      margin-bottom: 20px;
    }

    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      font-weight: 800;
      color: #F0F6FF;
      line-height: 1.2;
      letter-spacing: -0.025em;
      margin-bottom: 16px;
    }

    .gradient-text {
      background: linear-gradient(135deg, #F59E0B, #F43F5E);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .section-sub {
      font-size: 16px;
      color: #475569;
      line-height: 1.7;
    }

    /* Featured testimonial */
    .featured-testimonial {
      position: relative;
      background: linear-gradient(145deg, rgba(12,18,32,0.9), rgba(7,10,18,0.95));
      border: 1px solid rgba(0,212,255,0.12);
      border-radius: 24px;
      padding: 48px 52px;
      margin-bottom: 32px;
      overflow: hidden;
    }

    .featured-testimonial::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, #00D4FF, #6366F1, #F59E0B);
    }

    .ft-quote-mark {
      font-size: 80px;
      font-family: Georgia, serif;
      color: rgba(0,212,255,0.15);
      line-height: 1;
      position: absolute;
      top: 20px; left: 36px;
    }

    .ft-quote {
      font-size: clamp(1rem, 2vw, 1.3rem);
      color: #CBD5E1;
      line-height: 1.7;
      font-weight: 500;
      font-style: italic;
      margin-bottom: 28px;
      padding-left: 20px;
    }

    .ft-author {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .ft-avatar {
      width: 48px; height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 800;
      color: #04070F;
      flex-shrink: 0;
    }

    .ft-name {
      font-size: 15px;
      font-weight: 700;
      color: #F0F6FF;
      margin-bottom: 3px;
    }

    .ft-role {
      font-size: 12px;
      color: #475569;
    }

    .ft-metric {
      margin-left: auto;
      text-align: right;
    }

    .ft-metric-val {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 24px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 4px;
    }

    .ft-metric-label {
      font-size: 11px;
      color: #475569;
    }

    .ft-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding-top: 18px;
      margin-top: 18px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .ft-dot {
      width: 7px; height: 7px;
      border-radius: 999px;
      background: rgba(255,255,255,0.22);
      border: none;
      cursor: pointer;
      padding: 0;
      transition: width 0.3s ease, background 0.3s ease;
    }
    .ft-dot-active { width: 22px; background: #F59E0B; }

    /* Expand control */
    .t-actions { display: flex; justify-content: center; margin: 0 auto 18px; }
    .t-more-btn {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 12px 18px;
      border-radius: 999px;
      background: rgba(245,158,11,0.08);
      border: 1px solid rgba(245,158,11,0.18);
      color: #F0F6FF;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.02em;
      cursor: pointer;
      transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    }
    .t-more-btn:hover {
      transform: translateY(-1px);
      background: rgba(245,158,11,0.12);
      border-color: rgba(245,158,11,0.26);
    }
    .t-more-icon { opacity: 0.9; }

    .t-expand {
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
    .t-expand.expanded {
      max-height: 4800px;
      opacity: 1;
      transform: none;
      pointer-events: auto;
      visibility: visible;
    }
    .t-expand-inner { padding-top: 6px; }

    /* Cards grid */
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 40px;
    }

    .t-card {
      position: relative;
      background: linear-gradient(145deg, rgba(12,18,32,0.9), rgba(7,10,18,0.95));
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 20px;
      padding: 24px;
      overflow: hidden;
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      animation: fadeUp 0.7s ease both;
    }

    .t-card:hover {
      transform: translateY(-5px);
      border-color: rgba(255,255,255,0.1);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }

    .t-card:hover .t-card-shine {
      opacity: 1;
    }

    .t-card-shine {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .t-stars {
      display: flex;
      gap: 2px;
      margin-bottom: 16px;
    }

    .t-quote {
      font-size: 14px;
      color: #94A3B8;
      line-height: 1.7;
      font-style: italic;
      margin-bottom: 20px;
    }

    .t-metric {
      display: flex;
      align-items: baseline;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(4,7,15,0.5);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .t-metric-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 18px;
      font-weight: 800;
      line-height: 1;
    }

    .t-metric-label {
      font-size: 12px;
      color: #475569;
    }

    .t-author {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }

    .t-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      color: #04070F;
      flex-shrink: 0;
    }

    .t-name {
      font-size: 13px;
      font-weight: 700;
      color: #F0F6FF;
      margin-bottom: 2px;
    }

    .t-role {
      font-size: 11px;
      color: #475569;
    }

    /* Social proof bar */
    .social-proof-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 48px;
      padding: 24px 36px;
      background: rgba(12,18,32,0.8);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 18px;
    }

    .sp-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .sp-avatars {
      display: flex;
    }

    .sp-avatar {
      width: 32px; height: 32px;
      border-radius: 50%;
      border: 2px solid #07101E;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      color: #04070F;
      margin-left: -8px;
    }

    .sp-avatar:first-child { margin-left: 0; }

    .sp-more {
      background: rgba(255,255,255,0.08) !important;
      color: #94A3B8 !important;
      font-size: 9px;
    }

    .sp-text {
      font-size: 13px;
      color: #94A3B8;
    }

    .sp-text strong { color: #F0F6FF; }

    .sp-divider {
      width: 1px;
      height: 32px;
      background: rgba(255,255,255,0.07);
    }

    .sp-rating {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sp-stars { display: flex; gap: 2px; }

    .sp-rating-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 18px;
      font-weight: 800;
      color: #F59E0B;
    }

    .sp-rating-label {
      font-size: 12px;
      color: #475569;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1024px) {
      .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
      .ft-metric { display: none; }
    }

    @media (max-width: 640px) {
      .testimonials-grid { grid-template-columns: 1fr; }
      .featured-testimonial { padding: 28px 24px; }
      .social-proof-bar { flex-direction: column; gap: 20px; }
      .sp-divider { display: none; }
    }
  `]
})
export class TestimonialsSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('expandAnchor') expandAnchor?: ElementRef<HTMLElement>;

  expanded = false;

  featuredIndex = 0;
  private featuredPaused = false;
  private featuredTimer: any;
  private readonly featuredCount = 2;

  private static nextId = 0;
  readonly expandedDomId = `testimonials-expanded-${TestimonialsSectionComponent.nextId++}`;

  testimonials: Testimonial[] = [
    {
      name: 'Vikram Sinha',
      role: 'Director of Operations',
      company: 'LogiStar India',
      avatar: '',
      initials: 'VS',
      avatarColor: 'linear-gradient(135deg, #00D4FF, #6366F1)',
      quote: 'NViQ completely changed how we manage our 80-vehicle fleet. The live map reduced driver disputes by 90%, and we cut our fuel costs by ₹3.2 lakh in the very first quarter. I only wish we’d switched sooner.',
      metric: '₹3.2L',
      metricLabel: 'saved in Q1',
      metricColor: '#10B981',
      stars: 5,
    },
    {
      name: 'Rohit Sharma',
      role: 'Fleet Manager',
      company: 'RoadLink Logistics',
      avatar: '',
      initials: 'RS',
      avatarColor: 'linear-gradient(135deg, #00D4FF, #6366F1)',
      quote: 'Within two weeks, we reduced route delays significantly and gained complete real-time visibility across all active vehicles. The live map changed how our team operates.',
      metric: '18%',
      metricLabel: 'less delay incidents',
      metricColor: '#10B981',
      stars: 5
    },
    {
      name: 'Meena Iyer',
      role: 'Operations Head',
      company: 'TransitOne Mobility',
      avatar: '',
      initials: 'MI',
      avatarColor: 'linear-gradient(135deg, #10B981, #00D4FF)',
      quote: 'The dashboard is clear and fast. Our dispatch team now makes every decision based on live data instead of guesswork. On-time performance jumped to 96%.',
      metric: '96%',
      metricLabel: 'on-time delivery rate',
      metricColor: '#00D4FF',
      stars: 5
    },
    {
      name: 'Arvind Patel',
      role: 'Business Owner',
      company: 'CargoVerse Transport',
      avatar: '',
      initials: 'AP',
      avatarColor: 'linear-gradient(135deg, #F59E0B, #F43F5E)',
      quote: 'NViQ helped us control fuel variance and improve delivery times. The cost impact was visible in the first month — we saved over ₹80,000 on fuel alone.',
      metric: '₹80K',
      metricLabel: 'fuel saved in month 1',
      metricColor: '#F59E0B',
      stars: 5
    }
  ];

  get featuredTestimonials(): Testimonial[] {
    return this.testimonials.slice(0, this.featuredCount);
  }

  get moreTestimonials(): Testimonial[] {
    return this.testimonials.slice(this.featuredCount);
  }

  get featured(): Testimonial {
    return this.featuredTestimonials[this.featuredIndex] ?? this.testimonials[0];
  }

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

  private startFeaturedCarousel(): void {
    this.featuredTimer = setInterval(() => {
      const total = this.featuredTestimonials.length;
      if (!this.featuredPaused && total > 1) {
        this.featuredIndex = (this.featuredIndex + 1) % total;
      }
    }, 2000);
  }

  ngAfterViewInit(): void {
    this.startFeaturedCarousel();
  }

  ngOnDestroy(): void {
    clearInterval(this.featuredTimer);
  }
}
