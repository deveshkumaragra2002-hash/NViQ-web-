import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { MutualFundSliderComponent } from '../../components/mutual-fund-slider/mutual-fund-slider.component';
import { MutualFundPricingComponent } from '../../components/mutual-fund-pricing/mutual-fund-pricing.component';
import { CtaSectionComponent } from '../../components/cta/cta-section.component';
import { CtaFinalComponent } from '../../components/cta-final/cta-final.component';

@Component({
  selector: 'app-mutual-fund-page',
  standalone: true,
  imports: [
    CommonModule,
    MutualFundSliderComponent,
    MutualFundPricingComponent,
    CtaSectionComponent,
  ],
  template: `
    <!-- Back bar -->
    <div class="mfp-back-bar">
      <button class="mfp-back" (click)="goBack()" type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        All Products
      </button>
    </div>

    <!-- Image Slider Hero -->
    <div class="mf-slider">
      <div class="mf-slides-track">
        <div *ngFor="let slide of mfSlides; let i = index"
          class="mf-slide"
          [class.mf-slide-active]="i === currentSlide"
          [ngClass]="'mf-slide-bg-' + i">
          <div class="mf-slide-overlay"></div>
          <div class="mf-slide-content">
            <span class="mf-slide-tag">{{ slide.tag }}</span>
            <h1 class="mf-slide-title">{{ slide.title }}</h1>
            <p class="mf-slide-desc">{{ slide.desc }}</p>
            <div class="mf-slide-stats">
              <div *ngFor="let stat of slide.stats" class="mf-stat">
                <span class="mf-stat-val">{{ stat.val }}</span>
                <span class="mf-stat-label">{{ stat.label }}</span>
              </div>
            </div>
            <button class="mf-slide-btn" type="button" (click)="nav.openModal()">
              Start Investing
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Arrows -->
      <button class="mf-arrow mf-arrow-prev" (click)="prevSlide()" aria-label="Previous">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button class="mf-arrow mf-arrow-next" (click)="nextSlide()" aria-label="Next">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      <!-- Dots -->
      <div class="mf-dots">
        <button *ngFor="let s of mfSlides; let i = index"
          class="mf-dot" [class.mf-dot-active]="i === currentSlide"
          (click)="goToSlide(i)" [attr.aria-label]="'Slide ' + (i+1)"></button>
      </div>
      <div class="mf-counter">{{ currentSlide + 1 }} / {{ mfSlides.length }}</div>
    </div>

    <!-- MF Slider (SIP Calculator + Fund Cards) -->
    <app-mutual-fund-slider (openModal)="nav.openModal()"></app-mutual-fund-slider>

    <!-- Pricing -->
    <app-mutual-fund-pricing></app-mutual-fund-pricing>

    <!-- CTA -->
    <app-cta-section (openModal)="nav.openModal()"></app-cta-section>
  `,
  styles: [`
    /* ── MF Image Slider ──────────────────────────────── */
    .mf-slider {
      position: relative; width: 100%; height: 100vh;
      min-height: 600px; overflow: hidden;
    }
    .mf-slides-track { width: 100%; height: 100%; position: relative; }

    .mf-slide {
      position: absolute; inset: 0;
      display: flex; align-items: center;
      padding: 0 80px;
      opacity: 0; transform: scale(1.04);
      transition: opacity 0.75s cubic-bezier(0.4,0,0.2,1),
                  transform 0.75s cubic-bezier(0.4,0,0.2,1);
      pointer-events: none;
    }
    .mf-slide-active { opacity: 1; transform: scale(1); pointer-events: auto; }

    /* Gradient backgrounds per slide */
    .mf-slide-bg-0 { background: linear-gradient(135deg, #020B18 0%, #051830 40%, #0A2444 70%, #020B18 100%); }
    .mf-slide-bg-1 { background: linear-gradient(135deg, #020B10 0%, #043020 40%, #063B28 70%, #020B10 100%); }
    .mf-slide-bg-2 { background: linear-gradient(135deg, #100A1E 0%, #220B3A 40%, #2D0B4E 70%, #100A1E 100%); }

    .mf-slide-overlay {
      position: absolute; inset: 0; z-index: 0;
      background:
        radial-gradient(ellipse 60% 80% at 80% 50%, rgba(59,130,246,0.08) 0%, transparent 60%),
        radial-gradient(ellipse 40% 60% at 10% 80%, rgba(99,102,241,0.06) 0%, transparent 50%);
    }

    .mf-slide-content {
      position: relative; z-index: 2;
      max-width: 620px;
      animation: mfContentIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
    }
    @keyframes mfContentIn {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: none; }
    }

    .mf-slide-tag {
      display: inline-flex; align-items: center;
      padding: 5px 16px; border-radius: 999px;
      border: 1px solid rgba(59,130,246,0.4);
      background: rgba(59,130,246,0.12);
      color: #60A5FA;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.14em;
      margin-bottom: 20px;
    }
    .mf-slide-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(2rem, 5vw, 3.6rem);
      font-weight: 900; color: #fff;
      line-height: 1.08; letter-spacing: -0.03em;
      margin: 0 0 16px;
    }
    .mf-slide-desc {
      font-size: clamp(0.92rem, 1.4vw, 1.05rem);
      color: rgba(255,255,255,0.7);
      line-height: 1.7; margin: 0 0 28px; max-width: 500px;
    }

    .mf-slide-stats {
      display: flex; gap: 28px; margin-bottom: 32px; flex-wrap: wrap;
    }
    .mf-stat {
      display: flex; flex-direction: column; gap: 2px;
    }
    .mf-stat-val {
      font-family: 'Outfit', sans-serif;
      font-size: 1.6rem; font-weight: 900; color: #60A5FA;
      line-height: 1;
    }
    .mf-stat-label {
      font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.4);
      text-transform: uppercase; letter-spacing: 0.08em;
    }

    .mf-slide-btn {
      display: inline-flex; align-items: center; gap: 9px;
      height: 52px; padding: 0 30px; border-radius: 14px; border: none;
      background: linear-gradient(135deg, #3B82F6, #6366F1);
      color: #fff; font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 32px rgba(59,130,246,0.3);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .mf-slide-btn:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(59,130,246,0.45); }

    /* Arrows */
    .mf-arrow {
      position: absolute; top: 50%; transform: translateY(-50%);
      z-index: 10; width: 50px; height: 50px; border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.35); color: #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; backdrop-filter: blur(10px);
      transition: all 0.25s ease;
    }
    .mf-arrow:hover { background: rgba(59,130,246,0.25); border-color: rgba(59,130,246,0.5); }
    .mf-arrow-prev { left: 20px; }
    .mf-arrow-next { right: 20px; }

    /* Dots */
    .mf-dots {
      position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 10px; z-index: 10;
    }
    .mf-dot {
      width: 8px; height: 8px; border-radius: 999px;
      border: none; background: rgba(255,255,255,0.35);
      cursor: pointer; padding: 0;
      transition: width 0.35s ease, background 0.35s ease;
    }
    .mf-dot-active { width: 28px; background: #3B82F6; box-shadow: 0 0 10px rgba(59,130,246,0.6); }

    .mf-counter {
      position: absolute; bottom: 28px; right: 24px;
      font-size: 12px; font-weight: 700;
      color: rgba(255,255,255,0.45); letter-spacing: 0.08em; z-index: 10;
    }

    @media (max-width: 768px) {
      .mf-slider { height: 100svh; min-height: 500px; }
      .mf-slide { padding: 0 20px; align-items: center; padding-top: 80px; }
      .mf-slide-stats { gap: 20px; }
      .mf-stat-val { font-size: 1.3rem; }
      .mf-arrow { width: 36px; height: 36px; }
      .mf-arrow-prev { left: 8px; }
      .mf-arrow-next { right: 8px; }
    }

    /* ── Back bar ─────────────────────────────────────── */
    .mfp-back-bar {
      position: sticky; top: 72px; z-index: 50;
      padding: 12px 32px;
      background: rgba(10,10,10,0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .mfp-back {
      display: inline-flex; align-items: center; gap: 8px;
      background: transparent; border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 600;
      padding: 7px 16px; border-radius: 10px; cursor: pointer;
      transition: all 0.2s ease;
    }
    .mfp-back:hover { color: #fff; border-color: rgba(255,255,255,0.25); transform: translateX(-3px); }

    /* ── Hero ─────────────────────────────────────────── */
    .mfp-hero {
      position: relative; min-height: 70vh;
      display: flex; align-items: center; justify-content: center;
      padding: 80px 32px; overflow: hidden;
      background: linear-gradient(135deg, #030A04 0%, #071808 50%, #030A04 100%);
    }

    .mfp-hero-inner {
      max-width: 720px; text-align: center; position: relative; z-index: 2;
      display: flex; flex-direction: column; align-items: center; gap: 0;
    }

    .mfp-tag {
      display: inline-flex; align-items: center;
      padding: 5px 16px; border-radius: 999px;
      border: 1px solid rgba(59,130,246,0.3);
      background: rgba(59,130,246,0.07);
      color: #3B82F6;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.12em;
      margin-bottom: 24px;
    }

    .mfp-heading {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(3rem, 8vw, 7rem);
      font-weight: 900; letter-spacing: -0.04em;
      line-height: 0.95; margin-bottom: 20px;
      background: linear-gradient(120deg, #3B82F6, #93C5FD);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .mfp-sub {
      color: rgba(255,255,255,0.55);
      font-size: clamp(0.95rem, 1.4vw, 1.15rem);
      line-height: 1.72; max-width: 520px; margin-bottom: 36px;
    }
    .mfp-sub strong { color: #3B82F6; font-weight: 700; }

    .mfp-cta {
      display: inline-flex; align-items: center; gap: 9px;
      height: 54px; padding: 0 32px; border-radius: 14px; border: none;
      background: linear-gradient(135deg, #3B82F6, #2563EB);
      color: #fff; font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 32px rgba(59,130,246,0.3);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      margin-bottom: 24px;
    }
    .mfp-cta:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(59,130,246,0.45); }

    .mfp-trust {
      display: flex; flex-wrap: wrap; gap: 8px 20px; justify-content: center;
    }
    .mfp-trust span {
      font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.4);
    }

    .mfp-glow {
      position: absolute; border-radius: 50%; filter: blur(120px);
      pointer-events: none; z-index: 1;
      width: 700px; height: 700px; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%);
    }

    @media (max-width: 768px) {
      .mfp-back-bar { padding: 10px 16px; }
      .mfp-hero { min-height: 50vh; padding: 60px 16px; }
    }
  `]
})
export class MutualFundPageComponent implements OnInit, OnDestroy {
  nav    = inject(NavService);
  router = inject(Router);

  currentSlide = 0;
  private timer: any;

  mfSlides = [
    {
      tag: 'SIP Investing',
      title: 'Start Your SIP Journey Today',
      desc: 'Invest as little as ₹500/month and watch your wealth grow with the power of compounding. SEBI-registered, zero commission.',
      stats: [
        { val: '₹500', label: 'Min SIP Amount' },
        { val: '15%+', label: 'Avg. Returns' },
        { val: '0%', label: 'Commission' },
      ]
    },
    {
      tag: 'Portfolio Tracking',
      title: 'Track Your Wealth in Real-Time',
      desc: 'Monitor NAV updates, portfolio performance, and gains/losses on a smart dashboard built for fleet operators.',
      stats: [
        { val: '1000+', label: 'Funds Available' },
        { val: 'Live', label: 'NAV Updates' },
        { val: '24/7', label: 'Access' },
      ]
    },
    {
      tag: 'Secure & Trusted',
      title: 'Bank-Grade Security for Your Money',
      desc: 'Your investments are protected with 256-bit encryption, two-factor authentication, and full SEBI/AMFI compliance.',
      stats: [
        { val: '256-bit', label: 'Encryption' },
        { val: 'SEBI', label: 'Registered' },
        { val: '₹0', label: 'Hidden Charges' },
      ]
    },
  ];

  ngOnInit(): void { this.startAutoplay(); }
  ngOnDestroy(): void { clearInterval(this.timer); }

  private startAutoplay(): void {
    this.timer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.mfSlides.length;
    }, 4500);
  }

  nextSlide(): void {
    clearInterval(this.timer);
    this.currentSlide = (this.currentSlide + 1) % this.mfSlides.length;
    this.startAutoplay();
  }

  prevSlide(): void {
    clearInterval(this.timer);
    this.currentSlide = (this.currentSlide - 1 + this.mfSlides.length) % this.mfSlides.length;
    this.startAutoplay();
  }

  goToSlide(i: number): void {
    clearInterval(this.timer);
    this.currentSlide = i;
    this.startAutoplay();
  }

  goBack(): void {
    this.nav.go('products');
    this.router.navigate(['/']);
  }
}
