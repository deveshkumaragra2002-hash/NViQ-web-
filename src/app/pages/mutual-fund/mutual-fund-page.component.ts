import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { MutualFundSliderComponent } from '../../components/mutual-fund-slider/mutual-fund-slider.component';
import { TiltDirective } from '../../directives/tilt.directive';
import { RevealDirective } from '../../directives/reveal.directive';
import { ParticleCanvasComponent } from '../../components/particle-canvas/particle-canvas.component';
import { AmcPartnersComponent } from '../../components/amc-partners/amc-partners.component';

@Component({
  selector: 'app-mutual-fund-page',
  standalone: true,
  imports: [
    CommonModule,
    MutualFundSliderComponent,
    TiltDirective,
    RevealDirective,
    ParticleCanvasComponent,
    AmcPartnersComponent,
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
    <div class="mf-slider" (mouseenter)="pauseAutoplay()" (mouseleave)="resumeAutoplay()">
      <app-particle-canvas [count]="40" [lines]="true" [parallax]="0.012"></app-particle-canvas>

      <div class="mf-slides-track">
        <div *ngFor="let slide of mfSlides; let i = index"
          class="mf-slide"
          [class.mf-slide-active]="i === currentSlide"
          [ngClass]="'mf-slide-bg-' + i">
          <div class="mf-slide-overlay"></div>
          <div class="mf-slide-content" appReveal="up" [revealDelay]="100">
            <span class="mf-slide-tag" appReveal="fade" [revealDelay]="150">{{ slide.tag }}</span>
            <h1 class="mf-slide-title" appReveal="up" [revealDelay]="200">{{ slide.title }}</h1>
            <p class="mf-slide-desc" appReveal="up" [revealDelay]="280">{{ slide.desc }}</p>
            <div class="mf-slide-stats" appReveal="up" [revealDelay]="360">
              <div *ngFor="let stat of slide.stats" class="mf-stat" appTilt [tiltMax]="8" [tiltScale]="1.05" [tiltGlow]="'rgba(59,130,246,0.3)'">
                <span class="mf-stat-val">{{ stat.val }}</span>
                <span class="mf-stat-label">{{ stat.label }}</span>
              </div>
            </div>
            <button class="mf-slide-btn" type="button" (click)="nav.openModalFor('mf')" appReveal="up" [revealDelay]="440">
              Start Investing
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Dots -->
      <div class="mf-dots">
        <button *ngFor="let s of mfSlides; let i = index"
          class="mf-dot" [class.mf-dot-active]="i === currentSlide"
          (click)="goToSlide(i)" [attr.aria-label]="'Slide ' + (i+1)"></button>
      </div>
      <div class="mf-counter">{{ currentSlide + 1 }} / {{ mfSlides.length }}</div>
    </div>

    <!-- Trust bar -->
    <div class="mf-trust-bar" appReveal="up" [revealDelay]="0">

      <!-- Primary badge: AMFI + ARN -->
      <div class="mf-trust-item mf-trust-primary" appTilt [tiltMax]="6" [tiltScale]="1.04">
        <span class="mf-trust-icon">🎯</span>
        <div class="mf-trust-body">
          <span class="mf-trust-text">Free Consultation &bull; AMFI Registered</span>
          <span class="mf-trust-sub mf-trust-arn">ARN No: 359231</span>
        </div>
      </div>

      <div class="mf-trust-item" appTilt [tiltMax]="6" [tiltScale]="1.04">
        <span class="mf-trust-icon">💳</span>
        <div class="mf-trust-body">
          <span class="mf-trust-text">Zero Commission</span>
          <span class="mf-trust-sub">On all funds</span>
        </div>
      </div>

      <div class="mf-trust-item" appTilt [tiltMax]="6" [tiltScale]="1.04">
        <span class="mf-trust-icon">📊</span>
        <div class="mf-trust-body">
          <span class="mf-trust-text">1000+ Funds</span>
          <span class="mf-trust-sub">Curated selection</span>
        </div>
      </div>

      <div class="mf-trust-item" appTilt [tiltMax]="6" [tiltScale]="1.04">
        <span class="mf-trust-icon">⚡</span>
        <div class="mf-trust-body">
          <span class="mf-trust-text">Instant KYC</span>
          <span class="mf-trust-sub">Fully online</span>
        </div>
      </div>

      <div class="mf-trust-item" appTilt [tiltMax]="6" [tiltScale]="1.04">
        <span class="mf-trust-icon">🛡️</span>
        <div class="mf-trust-body">
          <span class="mf-trust-text">256-bit Encryption</span>
          <span class="mf-trust-sub">Bank-grade security</span>
        </div>
      </div>

    </div>

    <!-- MF Slider (SIP Calculator + Fund Cards) -->
    <div appReveal="up" [revealDelay]="100">
      <app-mutual-fund-slider></app-mutual-fund-slider>
    </div>

    <!-- Investment Details -->
    <section class="mf-invest-details" appReveal="up" [revealDelay]="80">
      <div class="mfid-header">
        <span class="mfid-eyebrow">
          <span class="mfid-dot"></span>
          Personalized Planning
        </span>
        <h2 class="mfid-title">Everything You Need to Invest Smart</h2>
        <p class="mfid-sub">Comprehensive investment planning tools designed for every type of investor.</p>
      </div>
      <div class="mfid-grid">
        <div class="mfid-item" *ngFor="let item of mfInvestItems">
          <div class="mfid-icon-wrap" [style.background]="item.iconBg">
            <span class="mfid-icon">{{ item.icon }}</span>
          </div>
          <div class="mfid-content">
            <span class="mfid-item-title">{{ item.title }}</span>
            <span class="mfid-item-desc">{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- AMC Partners -->
    <div appReveal="up" [revealDelay]="80">
      <app-amc-partners></app-amc-partners>
    </div>

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
      opacity: 0; transform: scale(1.06);
      transition: opacity 0.9s cubic-bezier(0.4,0,0.2,1),
                  transform 5s cubic-bezier(0.25,0.46,0.45,0.94);
      pointer-events: none;
      background-attachment: local;
    }
    .mf-slide-active {
      opacity: 1; transform: scale(1); pointer-events: auto;
    }

    /* Real image backgrounds */
    .mf-slide-bg-0 {
      background:
        linear-gradient(120deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.38) 60%, rgba(0,0,0,0.25) 100%),
        url('/MF1.jpg') center/cover no-repeat;
    }
    .mf-slide-bg-1 {
      background:
        linear-gradient(120deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.38) 60%, rgba(0,0,0,0.25) 100%),
        url('/MF2.jpg') center/cover no-repeat;
    }
    .mf-slide-bg-2 {
      background:
        linear-gradient(120deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.38) 60%, rgba(0,0,0,0.25) 100%),
        url('/MF3.jpg') center/cover no-repeat;
    }

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

    /* ── Trust bar ───────────────────────────────────────── */
    .mf-trust-bar {
      display: flex; flex-wrap: wrap; justify-content: center;
      gap: 10px 16px; padding: 24px 32px;
      background: rgba(10,10,20,0.95);
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .mf-trust-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 18px; border-radius: 12px;
      border: 1px solid rgba(59,130,246,0.15);
      background: rgba(59,130,246,0.05);
      cursor: default;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .mf-trust-primary {
      border-color: rgba(59,130,246,0.4) !important;
      background: rgba(59,130,246,0.12) !important;
      box-shadow: 0 0 20px rgba(59,130,246,0.15), inset 0 0 14px rgba(59,130,246,0.06);
    }
    .mf-trust-item:hover {
      border-color: rgba(59,130,246,0.3);
      background: rgba(59,130,246,0.09);
    }
    .mf-trust-icon { font-size: 18px; flex-shrink: 0; }
    .mf-trust-body {
      display: flex; flex-direction: column; gap: 3px;
    }
    .mf-trust-text {
      font-size: 13px; font-weight: 700;
      color: rgba(255,255,255,0.82);
      line-height: 1.2;
    }
    .mf-trust-primary .mf-trust-text {
      background: linear-gradient(90deg, #60A5FA, #818CF8);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .mf-trust-sub {
      font-size: 10.5px; font-weight: 600;
      color: rgba(255,255,255,0.35);
      letter-spacing: 0.04em;
    }
    .mf-trust-arn {
      color: #60A5FA !important;
      font-weight: 700 !important;
      font-size: 11px !important;
      letter-spacing: 0.08em !important;
    }

    @media (max-width: 768px) {
      .mfp-back-bar { padding: 10px 16px; }
      .mfp-hero { min-height: 50vh; padding: 60px 16px; }
      .mf-trust-bar { padding: 18px 16px; gap: 8px 12px; }
      .mf-trust-item { padding: 8px 12px; }
      .mf-trust-text { font-size: 12px; }
      .mf-trust-sub { font-size: 10px; }
    }

    /* ── MF Investment Details ──────────────────────────── */
    .mf-invest-details {
      padding: 80px 32px 72px;
      background: linear-gradient(180deg, #060C1A 0%, #040810 100%);
    }
    .mfid-header { text-align: center; max-width: 620px; margin: 0 auto 52px; }
    .mfid-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.16em;
      color: #60A5FA; margin-bottom: 14px;
    }
    .mfid-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #60A5FA; box-shadow: 0 0 8px #60A5FA;
    }
    .mfid-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(1.7rem, 3.5vw, 2.6rem);
      font-weight: 900; letter-spacing: -0.03em; color: #fff; margin: 0 0 14px;
    }
    .mfid-sub {
      font-size: clamp(0.88rem, 1.3vw, 1rem);
      color: rgba(255,255,255,0.48); line-height: 1.7; margin: 0;
    }
    .mfid-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px; max-width: 1100px; margin: 0 auto;
    }
    .mfid-item {
      display: flex; align-items: flex-start; gap: 14px;
      padding: 20px 22px; border-radius: 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
    }
    .mfid-item:hover {
      border-color: rgba(96,165,250,0.25);
      background: rgba(59,130,246,0.05); transform: translateY(-3px);
    }
    .mfid-icon-wrap {
      width: 42px; height: 42px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .mfid-icon { font-size: 18px; }
    .mfid-content { display: flex; flex-direction: column; gap: 4px; }
    .mfid-item-title { font-size: 14px; font-weight: 800; color: rgba(255,255,255,0.9); }
    .mfid-item-desc  { font-size: 12.5px; color: rgba(255,255,255,0.45); line-height: 1.55; }
    @media (max-width: 768px) {
      .mf-invest-details { padding: 56px 16px 48px; }
      .mfid-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class MutualFundPageComponent implements OnInit, OnDestroy {
  nav    = inject(NavService);
  router = inject(Router);

  currentSlide = 0;
  private timer: any;

  mfInvestItems = [
    { icon: '💰', iconBg: 'rgba(59,130,246,0.15)',  title: 'Monthly Investment Budget',  desc: 'Set and adjust your SIP amount anytime — start from as low as ₹500/month.' },
    { icon: '🎯', iconBg: 'rgba(99,102,241,0.15)',  title: 'Investment Goal',             desc: 'Plan for retirement, child education, home purchase, or wealth creation.' },
    { icon: '📈', iconBg: 'rgba(16,185,129,0.15)',  title: 'Investment Experience',       desc: 'Beginner to expert — get fund recommendations matched to your experience level.' },
    { icon: '⚖️', iconBg: 'rgba(245,158,11,0.15)',  title: 'Risk Profile',                desc: 'Assess your risk tolerance and discover funds aligned with your comfort zone.' },
    { icon: '📊', iconBg: 'rgba(239,68,68,0.15)',   title: 'Expected Return',             desc: 'Compare historical returns across funds and project your future wealth growth.' },
    { icon: '🕐', iconBg: 'rgba(167,139,250,0.15)', title: 'Investment Duration',         desc: 'Short-term or long-term — pick funds with the right time horizon for your needs.' },
    { icon: '📅', iconBg: 'rgba(59,130,246,0.15)',  title: 'SIP Planning',                desc: 'Auto-debit scheduling, pause & resume SIPs, and systematic step-up options.' },
    { icon: '🧾', iconBg: 'rgba(16,185,129,0.15)',  title: 'Tax Saving Details',          desc: 'ELSS funds for 80C deductions up to ₹1.5L per year — save tax while you grow.' },
    { icon: '📱', iconBg: 'rgba(99,102,241,0.15)',  title: 'Portfolio Tracking',          desc: 'Real-time NAV, XIRR calculation, and consolidated portfolio view in one place.' },
  ];

  trustItems = [
    { icon: '🎯', text: 'Free Consultation • AMFI Registered', sub: 'ARN No: 359231' },
    { icon: '💳', text: 'Zero Commission', sub: 'On all funds' },
    { icon: '📊', text: '1000+ Funds', sub: 'Curated selection' },
    { icon: '⚡', text: 'Instant KYC', sub: 'Fully online' },
    { icon: '🛡️', text: '256-bit Encryption', sub: 'Bank-grade security' },
  ];

  mfSlides = [
    {
      tag: 'SIP Investment',
      title: 'Start Your SIP Journey Today',
      desc: 'Invest as little as ₹1,000/month and watch your wealth grow with the power of compounding. AMFI-registered, zero commission.',
      stats: [
        { val: '₹1,000', label: 'Min SIP Amount' },
        { val: '12–18%', label: 'Expected Returns' },
        { val: '0%', label: 'Commission' },
      ]
    },
    {
      tag: 'Expected Returns',
      title: 'Maximize Your Investment Returns',
      desc: 'Top-performing equity mutual funds have consistently delivered 12–18% annualised returns over 5+ year horizons.',
      stats: [
        { val: '12–18%', label: 'Annual Returns' },
        { val: '5+ Years', label: 'Track Record' },
        { val: 'Live', label: 'Performance Data' },
      ]
    },
    {
      tag: 'Risk Assessment',
      title: 'Invest with Confidence',
      desc: 'Every investor has a unique risk appetite. Our risk profiler maps your income, age, and goals to a personalised risk score.',
      stats: [
        { val: 'Low–High', label: 'Risk Options' },
        { val: 'Personalized', label: 'Risk Score' },
        { val: 'Smart', label: 'Rebalancing' },
      ]
    },
    {
      tag: 'Wealth Compounding',
      title: 'The Power of Compounding',
      desc: '₹5,000/month invested for 25 years at 12% grows to over ₹1 Crore. Start small, grow big with systematic investing.',
      stats: [
        { val: '₹1Cr+', label: 'Potential Growth' },
        { val: '25 Years', label: 'Time Horizon' },
        { val: '12%', label: 'Avg. Returns' },
      ]
    },
    {
      tag: 'Tax Saving (ELSS)',
      title: 'Save Tax While Investing',
      desc: 'ELSS funds qualify for ₹1.5L deduction under Section 80C — saving you up to ₹46,800 in tax per year.',
      stats: [
        { val: '₹46,800', label: 'Tax Savings' },
        { val: '3 Years', label: 'Lock-in Period' },
        { val: 'Market-linked', label: 'Returns' },
      ]
    },
    {
      tag: 'Portfolio Management',
      title: 'Complete Investment Dashboard',
      desc: 'Monitor NAV updates, portfolio performance, and gains/losses on a smart dashboard built for investors.',
      stats: [
        { val: '1000+', label: 'Funds Available' },
        { val: 'Live NAV', label: 'Updates' },
        { val: '24/7', label: 'Access' },
      ]
    },
  ];

  ngOnInit(): void {
    this.nav.product.set('mf');
    this.startAutoplay();
    setTimeout(() => {
      const el = document.getElementById('mutual-funds');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
  }
  ngOnDestroy(): void { clearInterval(this.timer); }

  private startAutoplay(): void {
    this.timer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.mfSlides.length;
    }, 4000);
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

  pauseAutoplay(): void {
    clearInterval(this.timer);
  }

  resumeAutoplay(): void {
    this.startAutoplay();
  }

  goBack(): void {
    this.nav.go('products');
    this.router.navigate(['/']);
  }
}
