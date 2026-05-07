import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavService, ProductKey } from '../../services/nav.service';
import { FeaturesSectionComponent } from '../features/features-section.component';
import { BenefitsSectionComponent } from '../benefits/benefits-section.component';
import { ProblemSectionComponent } from '../problem/problem-section.component';
import { LiveTrackingSectionComponent } from '../live-tracking/live-tracking-section.component';
import { PricingSectionComponent } from '../pricing/pricing-section.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { CtaSectionComponent } from '../cta/cta-section.component';
import { MutualFundSliderComponent } from '../mutual-fund-slider/mutual-fund-slider.component';
import { MutualFundPricingComponent } from '../mutual-fund-pricing/mutual-fund-pricing.component';
import { ComingSoonSectionComponent } from '../coming-soon/coming-soon-section.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FeaturesSectionComponent,
    BenefitsSectionComponent,
    ProblemSectionComponent,
    LiveTrackingSectionComponent,
    PricingSectionComponent,
    ReviewFormComponent,
    CtaSectionComponent,
    MutualFundSliderComponent,
    MutualFundPricingComponent,
    ComingSoonSectionComponent,
  ],
  template: `
    <!-- Back button -->
    <div class="pd-back-bar">
      <button class="pd-back" (click)="nav.go('products')" type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        All Products
      </button>
    </div>

    <!-- GPS / Fleet product -->
    <ng-container *ngIf="nav.product() === 'gps'">

      <!-- ── GPS Image Slider Hero ── -->
      <div class="gps-slider">

        <!-- Slides -->
        <div class="gps-slides-track">
          <div
            *ngFor="let slide of gpsSlides; let i = index"
            class="gps-slide"
            [class.gps-slide-active]="i === currentGpsSlide"
            [ngClass]="'gps-bg-' + i"
          >
            <div class="gps-slide-content">
              <span class="gps-slide-tag">{{ slide.tag }}</span>
              <h1 class="gps-slide-title">{{ slide.title }}</h1>
              <p class="gps-slide-desc">{{ slide.desc }}</p>
              <div class="gps-slide-btns">
                <button class="pd-cta-btn pd-cta-cyan" (click)="nav.openModalFor('gps')" type="button">
                  Get Started Free
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Prev / Next arrows -->
        <button class="gps-arrow gps-arrow-prev" (click)="prevGpsSlide()" aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button class="gps-arrow gps-arrow-next" (click)="nextGpsSlide()" aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <!-- Dot nav -->
        <div class="gps-dots">
          <button
            *ngFor="let slide of gpsSlides; let i = index"
            class="gps-dot"
            [class.gps-dot-active]="i === currentGpsSlide"
            (click)="goToGpsSlide(i)"
            [attr.aria-label]="'Slide ' + (i+1)"
          ></button>
        </div>

        <!-- Slide counter -->
        <div class="gps-counter">{{ currentGpsSlide + 1 }} / {{ gpsSlides.length }}</div>

      </div>
      <app-features-section [productType]="'gps'"></app-features-section>
      <app-benefits-section [productType]="'gps'"></app-benefits-section>
      <app-problem-section></app-problem-section>
      <app-live-tracking-section></app-live-tracking-section>
      <app-review-form [productType]="'gps'"></app-review-form>
      <app-pricing-section (openModal)="nav.openModalFor('gps')"></app-pricing-section>
      <app-cta-section (openModal)="nav.openModalFor('gps')"></app-cta-section>
    </ng-container>

    <!-- Mutual Fund product (NavService path — router path uses MutualFundPageComponent) -->
    <ng-container *ngIf="nav.product() === 'mf'">
      <div class="pd-hero pd-hero-mf">
        <div class="pd-hero-inner">
          <span class="pd-tag" style="color:#3B82F6;border-color:rgba(59,130,246,0.3);background:rgba(59,130,246,0.07)">Wealth Management</span>
          <h1 class="pd-heading pd-heading-green">Grow Your Wealth</h1>
          <p class="pd-sub">SEBI-registered mutual fund investments built for India's fleet operators. SIP plans starting at ₹1,000/month.</p>
          <button class="pd-cta-btn pd-cta-green" (click)="nav.openModalFor('mf')" type="button">
            Start Investing Today
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
        <div class="pd-hero-glow pd-hero-glow-green" aria-hidden="true"></div>
      </div>
      <app-mutual-fund-slider (openModal)="nav.openModalFor('mf')"></app-mutual-fund-slider>
      <app-features-section [productType]="'mf'"></app-features-section>
      <app-benefits-section [productType]="'mf'"></app-benefits-section>
      <app-mutual-fund-pricing></app-mutual-fund-pricing>
      <app-cta-section [product]="'mf'" (openModal)="nav.openModalFor('mf')"></app-cta-section>
    </ng-container>

    <!-- Fastag product -->
    <ng-container *ngIf="nav.product() === 'fastag'">
      <div class="pd-hero pd-hero-fastag">
        <div class="pd-hero-inner">
          <span class="pd-tag" style="color:#A78BFA;border-color:rgba(167,139,250,0.3);background:rgba(167,139,250,0.07)">Payments</span>
          <h1 class="pd-heading pd-heading-purple">Zero Toll Delays</h1>
          <p class="pd-sub">Automated Fastag management for your fleet. Auto-recharge, real-time balance alerts, and complete toll expense visibility.</p>
          <div class="pd-coming-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Launching Q3 2026
          </div>
        </div>
        <div class="pd-hero-glow pd-hero-glow-purple" aria-hidden="true"></div>
      </div>
      <app-coming-soon-section></app-coming-soon-section>
    </ng-container>

    <!-- AgriDrone product -->
    <ng-container *ngIf="nav.product() === 'drone'">
      <div class="pd-hero pd-hero-drone">
        <div class="pd-hero-inner">
          <span class="pd-tag" style="color:#F59E0B;border-color:rgba(245,158,11,0.3);background:rgba(245,158,11,0.07)">Agriculture</span>
          <h1 class="pd-heading pd-heading-amber">Precision Farming</h1>
          <p class="pd-sub">Smart agriculture drone solutions for modern India. Crop health monitoring, precision spraying, and yield intelligence from the sky.</p>
          <div class="pd-coming-chip" style="border-color:rgba(245,158,11,0.3);color:#F59E0B">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Launching Q4 2026
          </div>
        </div>
        <div class="pd-hero-glow pd-hero-glow-amber" aria-hidden="true"></div>
      </div>
      <app-coming-soon-section></app-coming-soon-section>
    </ng-container>
  `,
  styles: [`
    /* ── Back bar ───────────────────────────────────────── */
    .pd-back-bar {
      position: sticky; top: 72px; z-index: 50;
      padding: 12px 32px;
      background: rgba(10,10,10,0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .pd-back {
      display: inline-flex; align-items: center; gap: 8px;
      background: transparent; border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 600;
      padding: 7px 16px; border-radius: 10px; cursor: pointer;
      transition: all 0.2s ease;
    }
    .pd-back:hover { color: #fff; border-color: rgba(255,255,255,0.25); transform: translateX(-3px); }

    /* ── Product Hero ───────────────────────────────────── */
    .pd-hero {
      position: relative; min-height: 70vh;
      display: flex; align-items: center;
      padding: 80px 32px 80px; overflow: hidden;
    }
    .pd-hero-gps    { background: linear-gradient(135deg,#04080F 0%,#081528 50%,#04080F 100%); }
    .pd-hero-mf     { background: linear-gradient(135deg,#030A04 0%,#071808 50%,#030A04 100%); }
    .pd-hero-fastag { background: linear-gradient(135deg,#07040F 0%,#110920 50%,#07040F 100%); }
    .pd-hero-drone  { background: linear-gradient(135deg,#090600 0%,#160F00 50%,#090600 100%); }

    .pd-hero-inner {
      max-width: 800px; margin: 0 auto;
      text-align: center; position: relative; z-index: 2;
      display: flex; flex-direction: column; align-items: center; gap: 0;
    }

    .pd-tag {
      display: inline-flex; align-items: center;
      padding: 5px 16px; border-radius: 999px; border: 1px solid;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.12em;
      margin-bottom: 24px;
    }

    .pd-heading {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(3rem, 8vw, 7rem);
      font-weight: 900; letter-spacing: -0.04em;
      line-height: 0.95; color: #fff; margin-bottom: 20px;
    }
    .pd-heading-green {
      background: linear-gradient(120deg, #3B82F6, #93C5FD);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .pd-heading-purple {
      background: linear-gradient(120deg, #A78BFA, #DDD6FE);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .pd-heading-amber {
      background: linear-gradient(120deg, #F59E0B, #FCD34D);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .pd-sub {
      color: rgba(255,255,255,0.55);
      font-size: clamp(0.95rem, 1.4vw, 1.15rem);
      line-height: 1.72; max-width: 580px; margin-bottom: 36px;
    }

    .pd-cta-btn {
      display: inline-flex; align-items: center; gap: 9px;
      height: 54px; padding: 0 32px; border-radius: 14px; border: none;
      color: #fff; font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 700; cursor: pointer;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .pd-cta-cyan {
      background: linear-gradient(135deg, #3B82F6, #6366F1);
      box-shadow: 0 8px 32px rgba(37,99,235,0.3);
    }
    .pd-cta-cyan:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(37,99,235,0.45); }
    .pd-cta-green {
      background: linear-gradient(135deg, #3B82F6, #2563EB);
      box-shadow: 0 8px 32px rgba(59,130,246,0.3);
    }
    .pd-cta-green:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(59,130,246,0.45); }

    .pd-coming-chip {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 8px 20px; border-radius: 999px;
      border: 1px solid rgba(167,139,250,0.3);
      background: rgba(167,139,250,0.07);
      color: #A78BFA; font-size: 13px; font-weight: 600;
    }

    /* Glows */
    .pd-hero-glow {
      position: absolute; border-radius: 50%; filter: blur(120px);
      pointer-events: none; z-index: 1;
      width: 700px; height: 700px; top: 50%; left: 50%;
      transform: translate(-50%,-50%);
    }
    .pd-hero-glow-cyan   { background: radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 65%); }
    .pd-hero-glow-green  { background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%); }
    .pd-hero-glow-purple { background: radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 65%); }
    .pd-hero-glow-amber  { background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 65%); }

    /* ── GPS full background grid ─────────────────────── */
    .pd-gps-bg-grid {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      z-index: 1;
    }

    .pd-gps-bg-img {
      width: 100%; height: 100%;
      object-fit: cover; object-position: center;
      display: block;
      filter: brightness(0.4) contrast(0.8);
      transition: transform 0.6s ease, filter 0.6s ease;
    }

    .pd-gps-bg-img:hover {
      transform: scale(1.05);
      filter: brightness(0.5) contrast(0.9);
    }

    .pd-gps-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, rgba(4,8,15,0.7) 0%, rgba(8,21,40,0.8) 50%, rgba(4,8,15,0.7) 100%);
      z-index: 2;
    }

    .pd-gps-split-wrap {
      position: relative; z-index: 2;
      width: 100%; max-width: 1280px; margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 48px;
      padding: 100px 48px 80px;
    }

    .pd-hero-inner-left {
      text-align: left;
      align-items: flex-start;
      max-width: 100%;
      margin: 0;
    }

    /* GPS 2x2 image grid */
    .pd-gps-img-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 12px;
      height: 420px;
    }

    .pd-gps-img-wrap {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(0,212,255,0.2);
      box-shadow: 0 8px 28px rgba(0,0,0,0.55);
      transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
    }

    .pd-gps-img-wrap:hover {
      transform: scale(1.04);
      box-shadow: 0 16px 40px rgba(0,212,255,0.25);
      border-color: rgba(0,212,255,0.5);
      z-index: 2;
    }

    .pd-gps-img {
      width: 100%; height: 100%;
      object-fit: cover; object-position: center;
      display: block;
      transition: transform 0.4s ease;
    }

    .pd-gps-img-wrap:hover .pd-gps-img { transform: scale(1.08); }

    .pd-gps-img-label {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 8px 12px;
      font-family: 'Outfit', sans-serif;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em;
      color: rgba(255,255,255,0.92);
      background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
    }

    /* stagger entry */
    .pd-gi-1 { animation: pdGpsIn 0.55s ease both 0.1s; }
    .pd-gi-2 { animation: pdGpsIn 0.55s ease both 0.2s; }
    .pd-gi-3 { animation: pdGpsIn 0.55s ease both 0.3s; }
    .pd-gi-4 { animation: pdGpsIn 0.55s ease both 0.4s; }

    @keyframes pdGpsIn {
      from { opacity: 0; transform: scale(0.88) translateY(16px); }
      to   { opacity: 1; transform: none; }
    }

    /* ── GPS Slide Backgrounds ───────────────────────── */
    .gps-bg-0 { background: linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.6)), url('/images/gps%20slide-1.jpg.jpeg') center/cover no-repeat; }
    .gps-bg-1 { background: linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.6)), url('/images/gps%20slide-2.jpg.jpeg') center/cover no-repeat; }
    .gps-bg-2 { background: linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.6)), url('/images/gps%20slide-3.jpg.jpeg') center/cover no-repeat; }

    /* ── GPS Image Slider ─────────────────────────────── */
    .gps-slider {
      position: relative;
      width: 100%;
      height: 100vh;
      min-height: 600px;
      overflow: hidden;
    }

    .gps-slides-track {
      width: 100%; height: 100%;
      position: relative;
    }

    .gps-slide {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      padding: 0 60px;
      opacity: 0;
      transform: scale(1.04);
      transition: opacity 0.75s cubic-bezier(0.4,0,0.2,1),
                  transform 0.75s cubic-bezier(0.4,0,0.2,1);
      pointer-events: none;
    }

    .gps-slide-active {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }

    .gps-slide-content {
      max-width: 600px;
      animation: gpsContentIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
    }

    @keyframes gpsContentIn {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: none; }
    }

    .gps-slide-tag {
      display: inline-flex; align-items: center;
      padding: 5px 16px; border-radius: 999px;
      border: 1px solid rgba(0,212,255,0.35);
      background: rgba(0,212,255,0.1);
      color: #00D4FF;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.14em;
      margin-bottom: 20px;
    }

    .gps-slide-title {
      font-family: var(--font-display, 'Outfit', sans-serif);
      font-size: clamp(2rem, 5vw, 3.6rem);
      font-weight: 900;
      color: #fff;
      line-height: 1.08;
      letter-spacing: -0.03em;
      margin: 0 0 18px;
    }

    .gps-slide-desc {
      font-size: clamp(0.95rem, 1.5vw, 1.1rem);
      color: rgba(255,255,255,0.82);
      line-height: 1.7;
      margin: 0 0 32px;
      max-width: 480px;
    }

    .gps-slide-btns {
      display: flex; gap: 14px; flex-wrap: wrap;
    }

    /* Arrows */
    .gps-arrow {
      position: absolute; top: 50%; transform: translateY(-50%);
      z-index: 10;
      width: 50px; height: 50px; border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.35);
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; backdrop-filter: blur(10px);
      transition: all 0.25s ease;
    }
    .gps-arrow:hover {
      background: rgba(0,212,255,0.25);
      border-color: rgba(0,212,255,0.5);
      box-shadow: 0 0 20px rgba(0,212,255,0.2);
    }
    .gps-arrow-prev { left: 20px; }
    .gps-arrow-next { right: 20px; }

    /* Dots */
    .gps-dots {
      position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 10px; z-index: 10;
    }
    .gps-dot {
      width: 8px; height: 8px; border-radius: 999px;
      border: none; background: rgba(255,255,255,0.35);
      cursor: pointer; padding: 0;
      transition: width 0.35s ease, background 0.35s ease;
    }
    .gps-dot-active {
      width: 28px; background: #00D4FF;
      box-shadow: 0 0 10px rgba(0,212,255,0.6);
    }

    /* Counter */
    .gps-counter {
      position: absolute; bottom: 28px; right: 24px;
      font-size: 12px; font-weight: 700;
      color: rgba(255,255,255,0.45);
      letter-spacing: 0.08em; z-index: 10;
    }

    @media (max-width: 768px) {
      .gps-slider { height: 100svh; min-height: 500px; }
      .gps-slide  { padding: 0 20px; align-items: center; padding-top: 80px; }
      .gps-slide-title { font-size: clamp(1.6rem, 6vw, 2.4rem); }
      .gps-slide-desc  { font-size: 0.9rem; margin-bottom: 20px; }
      .gps-arrow  { width: 36px; height: 36px; }
      .gps-arrow-prev { left: 8px; }
      .gps-arrow-next { right: 8px; }
      .gps-slide-content { max-width: 100%; }
    }

    @media (max-width: 900px) {
      .pd-gps-split-wrap {
        grid-template-columns: 1fr;
        padding: 80px 24px 60px;
        gap: 36px;
      }
      .pd-hero-inner-left { text-align: center; align-items: center; }
      .pd-gps-img-grid { height: 300px; }
    }

    @media (max-width: 768px) {
      .pd-back-bar { padding: 10px 16px; }
      .pd-hero { min-height: 50vh; padding: 60px 16px; }
      .pd-gps-img-grid { height: 240px; gap: 8px; }
    }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  constructor(public nav: NavService, private route: ActivatedRoute) {}

  /* ── GPS Slider ─────────────────────────────────────── */
  currentGpsSlide = 0;
  private gpsTimer: any;

  gpsSlides = [
    {
      tag: 'Live Tracking',
      title: 'Real-Time GPS Tracking',
      desc: 'Monitor every vehicle on a live map. Know exact location, speed, and route — updated every 5 seconds.',
      image: 'images/gps%20slide-1.jpg.jpeg',
    },
    {
      tag: 'Fleet Management',
      title: 'Smart Fleet Management',
      desc: 'Manage your entire fleet from one intelligent dashboard. Geo-fencing, route history, and driver analytics.',
      image: 'images/gps%20slide-2.jpg.jpeg',
    },
    {
      tag: 'Fuel · Alerts · Reports',
      title: 'Complete Fleet Visibility',
      desc: 'Track fuel consumption, get instant alerts for harsh braking or overspeeding, and generate automated reports.',
      image: 'images/gps%20slide-3.jpg.jpeg',
    },
  ];

  ngOnInit(): void {
    // When loaded via Angular Router (direct URL), nav.product() won't be set.
    // Derive the product key from the URL path segments.
    if (!this.nav.product()) {
      const path = this.route.snapshot.url.map(s => s.path).join('/');
      const urlMap: Record<string, ProductKey> = {
        'gps-tracking': 'gps',
        'fastag':       'fastag',
        'drone':        'drone',
      };
      const key = Object.keys(urlMap).find(k => path.includes(k));
      if (key) this.nav.go('product-detail', urlMap[key]);
    }
    this.startGpsAutoplay();
  }

  ngOnDestroy(): void {
    clearInterval(this.gpsTimer);
  }

  private startGpsAutoplay(): void {
    this.gpsTimer = setInterval(() => {
      this.currentGpsSlide = (this.currentGpsSlide + 1) % this.gpsSlides.length;
    }, 4500);
  }

  nextGpsSlide(): void {
    clearInterval(this.gpsTimer);
    this.currentGpsSlide = (this.currentGpsSlide + 1) % this.gpsSlides.length;
    this.startGpsAutoplay();
  }

  prevGpsSlide(): void {
    clearInterval(this.gpsTimer);
    this.currentGpsSlide = (this.currentGpsSlide - 1 + this.gpsSlides.length) % this.gpsSlides.length;
    this.startGpsAutoplay();
  }

  goToGpsSlide(i: number): void {
    clearInterval(this.gpsTimer);
    this.currentGpsSlide = i;
    this.startGpsAutoplay();
  }

}

