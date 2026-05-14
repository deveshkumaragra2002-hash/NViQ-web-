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
import { MutualFundSliderComponent } from '../mutual-fund-slider/mutual-fund-slider.component';
import { ComingSoonSectionComponent } from '../coming-soon/coming-soon-section.component';
import { AmcPartnersComponent } from '../amc-partners/amc-partners.component';

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
    MutualFundSliderComponent,
    ComingSoonSectionComponent,
    AmcPartnersComponent,
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
      <app-pricing-section></app-pricing-section>
    </ng-container>

    <!-- Mutual Fund product (NavService path — router path uses MutualFundPageComponent) -->
    <ng-container *ngIf="nav.product() === 'mf'">
      <div class="pd-hero pd-hero-mf pd-mf-split">
        <!-- Left: existing MF content -->
        <div class="pd-mf-left">
          <span class="pd-tag" style="color:#3B82F6;border-color:rgba(59,130,246,0.3);background:rgba(59,130,246,0.07)">Wealth Management</span>
          <h1 class="pd-heading pd-heading-green">Grow Your<br>Wealth</h1>
          <p class="pd-sub">Free Consultation • AMFI Registered • ARN No: 359231.<br>Smart mutual fund investment solutions with SIP plans starting at ₹1,000/month.</p>
          <div class="pd-mf-trust-row">
            <span class="pd-trust-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              AMFI Registered
            </span>
            <span class="pd-trust-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              ARN No: 359231
            </span>
            <span class="pd-trust-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Zero Commission
            </span>
          </div>
          <button class="pd-cta-btn pd-cta-green" (click)="nav.openModalFor('mf')" type="button">
            Start Investing Today
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Right: SIP Calculator -->
        <div class="pd-mf-right">
          <div class="pd-sip-card">
            <div class="pd-sip-header">
              <div class="pd-sip-title-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="18" rx="3"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
                <span>SIP Calculator</span>
              </div>
              <span class="pd-sip-live-badge">
                <span class="pd-sip-live-dot"></span>Live
              </span>
            </div>

            <div class="pd-sip-field">
              <div class="pd-sip-row">
                <span class="pd-sip-label">Monthly Investment</span>
                <span class="pd-sip-val">₹{{ mfSipAmount | number }}</span>
              </div>
              <input type="range" class="pd-sip-range" min="1000" max="500000" step="1000"
                [value]="mfSipAmount" (input)="mfSipAmount = +$any($event.target).value">
              <div class="pd-sip-bounds"><span>₹1,000</span><span>₹5,00,000</span></div>
            </div>

            <div class="pd-sip-field">
              <div class="pd-sip-row">
                <span class="pd-sip-label">Duration</span>
                <span class="pd-sip-val">{{ mfSipYears }} years</span>
              </div>
              <input type="range" class="pd-sip-range" min="1" max="30" step="1"
                [value]="mfSipYears" (input)="mfSipYears = +$any($event.target).value">
              <div class="pd-sip-bounds"><span>1 yr</span><span>30 yrs</span></div>
            </div>

            <div class="pd-sip-field">
              <div class="pd-sip-row">
                <span class="pd-sip-label">Expected Return (p.a.)</span>
                <span class="pd-sip-val pd-sip-rate">{{ mfSipRate }}%</span>
              </div>
              <input type="range" class="pd-sip-range" min="0" max="30" step="0.5"
                [value]="mfSipRate" (input)="mfSipRate = +$any($event.target).value">
              <div class="pd-sip-bounds"><span>0%</span><span>30%</span></div>
            </div>

            <div class="pd-sip-divider"></div>

            <div class="pd-sip-result-grid">
              <div class="pd-sip-res-item">
                <div class="pd-sip-res-label">Amount Invested</div>
                <div class="pd-sip-res-val">₹{{ mfSipResult.invested | number }}</div>
              </div>
              <div class="pd-sip-res-item">
                <div class="pd-sip-res-label">Est. Returns</div>
                <div class="pd-sip-res-val pd-sip-gain">₹{{ mfSipResult.gains | number }}</div>
              </div>
              <div class="pd-sip-res-item pd-sip-total">
                <div class="pd-sip-res-label">Total Value</div>
                <div class="pd-sip-res-val pd-sip-total-val">₹{{ mfSipResult.maturity | number }}</div>
              </div>
            </div>

            <button class="pd-sip-cta" type="button" (click)="nav.openModalFor('mf')">
              Get Free Consultation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <div class="pd-hero-glow pd-hero-glow-green" aria-hidden="true"></div>
      </div>
      <!-- Investment Details -->
      <section class="mf-invest-details">
        <div class="mfid-header">
          <span class="mfid-eyebrow"><span class="mfid-dot"></span>Personalized Planning</span>
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
      <app-amc-partners></app-amc-partners>

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
      padding: 20px 32px 0;
    }
    .pd-back {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
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

    /* ── MF Split Hero ──────────────────────────────────── */
    .pd-mf-split {
      min-height: calc(100vh - 124px);
      padding: 60px 6% 60px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 56px;
    }
    .pd-mf-left {
      flex: 1;
      max-width: 520px;
      display: flex; flex-direction: column;
      align-items: flex-start;
      position: relative; z-index: 2;
    }
    .pd-mf-left .pd-tag { margin-bottom: 20px; }
    .pd-mf-left .pd-heading { font-size: clamp(2.6rem, 5vw, 4.8rem); margin-bottom: 16px; line-height: 1.0; }
    .pd-mf-left .pd-sub { text-align: left; font-size: 0.95rem; line-height: 1.7; margin-bottom: 20px; max-width: 100%; }

    .pd-mf-trust-row {
      display: flex; flex-wrap: wrap; gap: 8px;
      margin-bottom: 28px;
    }
    .pd-trust-chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 13px; border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.6);
      font-size: 11px; font-weight: 600;
    }

    .pd-mf-right {
      flex: 0 0 380px;
      position: relative; z-index: 2;
    }

    /* ── SIP Calculator Card ─────────────────────────────── */
    .pd-sip-card {
      background: rgba(6,12,28,0.85);
      border: 1px solid rgba(59,130,246,0.3);
      border-radius: 24px;
      padding: 28px 26px 24px;
      backdrop-filter: blur(24px);
      box-shadow:
        0 0 0 1px rgba(59,130,246,0.08),
        0 24px 64px rgba(0,0,0,0.6),
        0 0 80px rgba(59,130,246,0.08);
    }
    .pd-sip-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 22px;
    }
    .pd-sip-title-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: #93C5FD;
    }
    .pd-sip-live-badge {
      display: flex; align-items: center; gap: 6px;
      font-size: 10px; font-weight: 800;
      color: #22c55e; letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .pd-sip-live-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #22c55e;
      animation: sipDotPulse 1.6s ease-in-out infinite;
    }
    @keyframes sipDotPulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.7); }
    }

    .pd-sip-field { margin-bottom: 16px; }
    .pd-sip-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 7px;
    }
    .pd-sip-label { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 500; }
    .pd-sip-val   { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); }
    .pd-sip-rate  { color: #60A5FA; }

    .pd-sip-range {
      -webkit-appearance: none;
      width: 100%; height: 4px; border-radius: 99px;
      background: linear-gradient(to right, #3B82F6 var(--pct, 50%), rgba(255,255,255,0.1) var(--pct, 50%));
      outline: none; cursor: pointer;
    }
    .pd-sip-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px; height: 18px; border-radius: 50%;
      background: #fff;
      border: 3px solid #3B82F6;
      box-shadow: 0 0 12px rgba(59,130,246,0.6);
      cursor: pointer;
      transition: transform 0.15s ease;
    }
    .pd-sip-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
    .pd-sip-bounds {
      display: flex; justify-content: space-between;
      font-size: 9px; color: rgba(255,255,255,0.22);
      margin-top: 4px;
    }

    .pd-sip-divider { height: 1px; background: rgba(59,130,246,0.15); margin: 18px 0; }

    .pd-sip-result-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 12px; margin-bottom: 20px;
    }
    .pd-sip-res-item {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px; padding: 12px 14px;
    }
    .pd-sip-total {
      grid-column: 1 / -1;
      background: rgba(59,130,246,0.06);
      border-color: rgba(59,130,246,0.2);
    }
    .pd-sip-res-label {
      font-size: 9px; text-transform: uppercase; letter-spacing: 0.07em;
      color: rgba(255,255,255,0.3); margin-bottom: 5px;
    }
    .pd-sip-res-val {
      font-size: 18px; font-weight: 800;
      color: rgba(255,255,255,0.85);
      font-family: 'Outfit', sans-serif;
      letter-spacing: -0.02em;
    }
    .pd-sip-gain { color: #34D399; }
    .pd-sip-total-val {
      font-size: 22px;
      background: linear-gradient(120deg, #3B82F6, #93C5FD);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .pd-sip-cta {
      width: 100%; height: 46px; border-radius: 12px; border: none;
      background: linear-gradient(135deg, #3B82F6, #2563EB);
      color: #fff; font-family: 'Outfit', sans-serif;
      font-size: 14px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      box-shadow: 0 6px 24px rgba(59,130,246,0.3);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .pd-sip-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 32px rgba(59,130,246,0.45);
    }

    @media (max-width: 1024px) {
      .pd-mf-split {
        flex-direction: column;
        padding: 60px 24px;
        gap: 40px;
        min-height: auto;
      }
      .pd-mf-left { max-width: 100%; align-items: center; text-align: center; }
      .pd-mf-left .pd-sub { text-align: center; }
      .pd-mf-trust-row { justify-content: center; }
      .pd-mf-right { flex: none; width: 100%; max-width: 460px; }
    }

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

    /* ── MF Investment Details ──────────────────────────── */
    .mf-invest-details {
      padding: 80px 32px 72px;
      background: linear-gradient(180deg, #060C1A 0%, #040810 100%);
    }
    .mfid-header { text-align: center; max-width: 620px; margin: 0 auto 52px; }
    .mfid-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.16em; color: #60A5FA; margin-bottom: 14px;
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
export class ProductDetailComponent implements OnInit, OnDestroy {
  constructor(public nav: NavService, private route: ActivatedRoute) {}

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

  /* ── MF SIP Calculator ──────────────────────────────── */
  mfSipAmount = 5000;
  mfSipYears  = 10;
  mfSipRate   = 12;

  get mfSipResult() {
    const P = this.mfSipAmount;
    const r = this.mfSipRate / 12 / 100;
    const n = this.mfSipYears * 12;
    const M = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    return {
      invested: Math.round(invested),
      maturity: Math.round(M),
      gains:    Math.round(M - invested),
    };
  }

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
    if (this.nav.product() === 'mf') {
      setTimeout(() => {
        const el = document.getElementById('mutual-funds');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 800);
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

