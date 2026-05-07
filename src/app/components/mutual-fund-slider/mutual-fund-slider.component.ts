import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { register } from 'swiper/element/bundle';
import { ApiService, Fund } from '../../services/api.service';

register();

export interface MFSlide {
  id: number;
  title: string;
  lines: string[];
  details: string;
  tag: string;
  badge?: string;
  highlight?: boolean;
  iconGrad: [string, string];
  glowColor: string;
  iconPath: string;
}

@Component({
  selector: 'app-mutual-fund-slider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="mfs-root" id="mutual-funds">

      <!-- BG -->
      <div class="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div class="bg-orb bg-orb-2" aria-hidden="true"></div>
      <div class="bg-grid"        aria-hidden="true"></div>

      <!-- Header -->
      <div class="mfs-header" [class.visible]="sectionVisible">
        <div class="mfs-eyebrow">
          <span class="eyebrow-dot"></span>
          Fintech × Fleet
        </div>
        <h2 class="mfs-title">
Invest Smart. Grow Wealth.
          <span class="title-accent">Mutual Fund Platform</span>
        </h2>
        <p class="mfs-subtitle">Invest Smartly, Track Easily, Grow Securely</p>
      </div>

      <!-- ── SIP Calculator ── -->
      <div class="sip-section" [class.visible]="sectionVisible">
        <div class="sip-container">

          <div class="sip-heading">
            <span class="sip-eyebrow">Goal-Based Planning</span>
            <h3 class="sip-title">SIP Returns Calculator</h3>
            <p class="sip-sub">Adjust the sliders to see how your wealth grows in real-time</p>
          </div>

          <div class="sip-card">

            <!-- Left: Inputs -->
            <div class="sip-inputs">

              <!-- Monthly Investment -->
              <div class="sip-field">
                <div class="sip-field-top">
                  <label class="sip-label">Monthly Investment (SIP)</label>
                  <div class="sip-input-wrap" [class.sip-error]="!!sipWarning">
                    <span class="sip-currency">₹</span>
                    <input
                      class="sip-num-input"
                      type="number"
                      [ngModel]="sipAmount"
                      (ngModelChange)="sipAmount = $event; calculateSIP()"
                      min="1000" max="500000" step="500">
                  </div>
                </div>
                <input class="sip-slider" type="range"
                  [ngModel]="sipAmount"
                  (ngModelChange)="sipAmount = $event; calculateSIP()"
                  min="1000" max="500000" step="500">
                <div class="sip-range-row">
                  <span>₹1,000</span>
                  <span>₹5,00,000</span>
                </div>
                <p class="sip-warn" *ngIf="sipWarning">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                  {{ sipWarning }}
                </p>
              </div>

              <!-- Duration -->
              <div class="sip-field">
                <div class="sip-field-top">
                  <label class="sip-label">Investment Duration</label>
                  <div class="sip-input-wrap">
                    <input
                      class="sip-num-input"
                      type="number"
                      [ngModel]="sipYears"
                      (ngModelChange)="sipYears = $event; calculateSIP()"
                      min="1" max="30" step="1">
                    <span class="sip-unit">Yr</span>
                  </div>
                </div>
                <input class="sip-slider" type="range"
                  [ngModel]="sipYears"
                  (ngModelChange)="sipYears = $event; calculateSIP()"
                  min="1" max="30" step="1">
                <div class="sip-range-row">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>

              <!-- Return Rate -->
              <div class="sip-field">
                <div class="sip-field-top">
                  <label class="sip-label">Expected Annual Return</label>
                  <div class="sip-input-wrap">
                    <input
                      class="sip-num-input"
                      type="number"
                      [ngModel]="sipRate"
                      (ngModelChange)="sipRate = $event; calculateSIP()"
                      min="1" max="30" step="0.5">
                    <span class="sip-unit">%</span>
                  </div>
                </div>
                <input class="sip-slider" type="range"
                  [ngModel]="sipRate"
                  (ngModelChange)="sipRate = $event; calculateSIP()"
                  min="1" max="30" step="0.5">
                <div class="sip-range-row">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>

            </div>

            <!-- Right: Results -->
            <div class="sip-results">

              <!-- SVG Donut Chart -->
              <div class="sip-donut-wrap">
                <svg class="sip-donut-svg" viewBox="0 0 140 140">
                  <!-- Track -->
                  <circle cx="70" cy="70" r="56"
                    fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12"/>
                  <!-- Invested arc -->
                  <circle cx="70" cy="70" r="56"
                    fill="none" stroke="#3B82F6" stroke-width="12"
                    stroke-linecap="butt"
                    [attr.stroke-dasharray]="donutInvested + ' ' + circumference"
                    stroke-dashoffset="0"
                    transform="rotate(-90 70 70)"/>
                  <!-- Returns arc -->
                  <circle cx="70" cy="70" r="56"
                    fill="none" stroke="#10B981" stroke-width="12"
                    stroke-linecap="butt"
                    [attr.stroke-dasharray]="donutReturns + ' ' + circumference"
                    [attr.stroke-dashoffset]="(-donutInvested)"
                    transform="rotate(-90 70 70)"/>
                  <!-- Center label -->
                  <text x="70" y="63" text-anchor="middle"
                    fill="rgba(255,255,255,0.45)" font-size="9" font-family="Outfit" font-weight="600"
                    letter-spacing="1">MATURITY</text>
                  <text x="70" y="80" text-anchor="middle"
                    fill="#fff" font-size="12" font-family="Outfit" font-weight="800">{{ formatCompact(maturityValue) }}</text>
                </svg>

                <div class="donut-legend">
                  <div class="legend-row">
                    <span class="legend-swatch" style="background:#3B82F6"></span>
                    <span class="legend-txt">Invested</span>
                  </div>
                  <div class="legend-row">
                    <span class="legend-swatch" style="background:#10B981"></span>
                    <span class="legend-txt">Returns</span>
                  </div>
                </div>
              </div>

              <!-- Stat cards -->
              <div class="sip-stats">
                <div class="sip-stat">
                  <p class="sstat-label">Total Invested</p>
                  <p class="sstat-val" style="color:#3B82F6">{{ formatINR(totalInvested) }}</p>
                </div>
                <div class="sip-stat sip-stat-green">
                  <p class="sstat-label">Estimated Returns</p>
                  <p class="sstat-val" style="color:#10B981">{{ formatINR(estimatedReturns) }}</p>
                </div>
                <div class="sip-stat sip-stat-primary">
                  <p class="sstat-label">Maturity Value</p>
                  <p class="sstat-val sstat-big">{{ formatINR(maturityValue) }}</p>
                </div>

                <button class="sip-invest-btn" type="button" (click)="openModal.emit()">
                  Start Investing Now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- ── Swiper Carousel ── -->
      <div class="swiper-shell" [class.visible]="sectionVisible">
        <swiper-container
          #swiperEl
          class="mf-swiper"
          slides-per-view="auto"
          centered-slides="true"
          space-between="24"
          grab-cursor="true"
          loop="true"
          autoplay-delay="3000"
          autoplay-pause-on-mouse-enter="true"
          autoplay-disable-on-interaction="false"
          speed="520"
          effect="slide"
        >
          <swiper-slide
            *ngFor="let slide of slides; let i = index"
            class="mf-slide"
          >
            <div
              class="slide-card"
              [class.is-active]="selectedSlide.id === slide.id"
              (click)="selectSlide(slide)"
              [style.--glow]="slide.glowColor"
            >
              <!-- Badge -->
              <span *ngIf="slide.badge" class="slide-badge">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ slide.badge }}
              </span>

              <!-- Icon -->
              <div class="slide-icon"
                [style.background]="'linear-gradient(135deg,' + slide.iconGrad[0] + ',' + slide.iconGrad[1] + ')'">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path [attr.d]="slide.iconPath"/>
                </svg>
              </div>

              <!-- Tag -->
              <span class="slide-tag" [ngClass]="'tag-color-' + ((i % 6))">
                {{ slide.tag }}
              </span>

              <!-- Title -->
              <h3 class="slide-title">{{ slide.title }}</h3>

              <!-- Lines -->
              <ul class="slide-lines">
                <li *ngFor="let line of slide.lines">
                  <span class="line-dot" aria-hidden="true"></span>
                  {{ line }}
                </li>
              </ul>

              <!-- Active indicator -->
              <div class="active-bar" [class.show]="selectedSlide.id === slide.id"></div>
            </div>
          </swiper-slide>
        </swiper-container>

        <!-- Custom nav arrows -->
        <button class="nav-btn nav-prev" (click)="slidePrev()" aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button class="nav-btn nav-next" (click)="slideNext()" aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <!-- ── Detail Panel ── -->
      <div class="detail-panel" [class.visible]="sectionVisible" *ngIf="selectedSlide">
        <div class="detail-card" [style.--accent]="selectedSlide.iconGrad[0]">

          <h2 class="detail-title">{{ selectedSlide.title }}</h2>
          <p class="detail-desc">{{ selectedSlide.details }}</p>

          <ul class="detail-lines">
            <li *ngFor="let line of selectedSlide.lines">
              <span class="detail-check">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.8" stroke-linecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </span>
              {{ line }}
            </li>
          </ul>

          <button class="detail-cta" (click)="openModal.emit()" type="button">
            Get Started
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

        </div>
      </div>

      <!-- Dot nav -->
      <div class="dot-nav" [class.visible]="sectionVisible">
        <button
          *ngFor="let slide of slides; let i = index"
          class="dot"
          [class.dot-active]="selectedSlide.id === slide.id"
          (click)="selectSlide(slide)"
          [attr.aria-label]="'Select ' + slide.title"
        >
          <span class="dot-inner"></span>
        </button>
      </div>

      <!-- Disclaimer -->
      <p class="mf-disclaimer">
        ⚠️ Mutual Funds are subject to market risks. Read all scheme-related documents carefully before investing. &nbsp;|&nbsp; AMFI Registered · ARN No: 359231
      </p>

    </section>
  `,
  styles: [`
    /* ─── Root ─────────────────────────────────────────── */
    .mfs-root {
      position: relative;
      padding: 108px 0 72px;
      background: var(--bg-base);
      overflow: hidden;
      isolation: isolate;
    }

    /* ─── Background ─────────────────────────────────────  */
    .bg-orb {
      position: absolute; border-radius: 50%;
      filter: blur(100px); pointer-events: none; z-index: 0;
    }
    .bg-orb-1 {
      width: 640px; height: 640px;
      background: radial-gradient(circle, rgba(0,212,255,0.09) 0%, transparent 70%);
      top: -160px; right: -100px;
      animation: orbA 20s ease-in-out infinite;
    }
    .bg-orb-2 {
      width: 520px; height: 520px;
      background: radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%);
      bottom: -120px; left: -80px;
      animation: orbB 24s ease-in-out infinite;
    }
    @keyframes orbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,60px)} }
    @keyframes orbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,-40px)} }
    .bg-grid {
      position: absolute; inset: 0; z-index: 0;
      background-image:
        linear-gradient(var(--border-subtle) 1px, transparent 1px),
        linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black 10%, transparent 80%);
      opacity: 0.5;
    }

    /* ─── Header ─────────────────────────────────────────  */
    .mfs-header {
      position: relative; z-index: 2;
      text-align: center; max-width: 680px;
      margin: 0 auto 64px; padding: 0 20px;
      opacity: 0; transform: translateY(28px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .mfs-header.visible { opacity: 1; transform: none; }

    .mfs-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 5px 16px; border-radius: 999px;
      border: 1px solid rgba(37,99,235,0.2);
      background: rgba(37,99,235,0.07);
      color: var(--brand-cyan);
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.14em;
      margin-bottom: 22px;
    }
    .eyebrow-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--brand-cyan);
      animation: dotPulse 2s ease-in-out infinite;
    }
    @keyframes dotPulse {
      0%,100% { box-shadow: 0 0 0 3px rgba(37,99,235,0.2); }
      50%      { box-shadow: 0 0 0 7px rgba(0,212,255,0.04); }
    }
    .mfs-title {
      font-family: var(--font-display);
      font-size: clamp(2rem, 4.5vw, 3.5rem);
      font-weight: 900; line-height: 1.08;
      letter-spacing: -0.03em; color: var(--text-primary);
      margin: 0 0 14px;
      display: flex; flex-direction: column; align-items: center; gap: 6px;
    }
    .title-accent {
      background: linear-gradient(120deg, var(--brand-cyan), var(--brand-indigo));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .mfs-subtitle {
      color: var(--text-secondary); font-size: 1rem;
      line-height: 1.6; margin: 0; font-style: italic; opacity: 0.85;
    }

    /* ─── Swiper shell ──────────────────────────────────── */
    .swiper-shell {
      position: relative; z-index: 2;
      padding: 20px 0 36px;
      opacity: 0; transform: translateY(20px);
      transition: opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s;
    }
    .swiper-shell.visible { opacity: 1; transform: none; }

    .mf-swiper {
      width: 100%;
      padding: 16px 0 24px !important;
    }

    .mf-slide {
      width: 300px !important;
      height: auto !important;
    }

    /* ─── Slide card ─────────────────────────────────────  */
    .slide-card {
      position: relative;
      padding: 28px 22px 24px;
      border-radius: 20px;
      border: 1px solid var(--border-subtle);
      background: var(--bg-card);
      cursor: pointer;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
      transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
    }
    .slide-card:hover {
      transform: translateY(-4px);
      border-color: rgba(37,99,235,0.2);
    }
    .slide-card.is-active {
      border-color: rgba(37,99,235,0.45);
      box-shadow:
        0 0 0 1px rgba(37,99,235,0.15),
        0 8px 40px rgba(37,99,235,0.18),
        0 20px 60px rgba(0,0,0,0.3);
      background: linear-gradient(160deg, rgba(37,99,235,0.06) 0%, var(--bg-card) 60%);
    }

    .active-bar {
      position: absolute; top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--brand-cyan), var(--brand-indigo));
      border-radius: 2px 2px 0 0;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s ease;
    }
    .active-bar.show { transform: scaleX(1); }

    .slide-badge {
      position: absolute; top: 14px; right: 14px;
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 9px; border-radius: 999px;
      background: rgba(0,212,255,0.1);
      border: 1px solid rgba(0,212,255,0.28);
      color: var(--brand-cyan);
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em;
    }

    .slide-icon {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
      transition: transform 0.3s ease;
      flex-shrink: 0;
    }
    .slide-card.is-active .slide-icon { transform: scale(1.08) rotate(-3deg); }

    .slide-tag {
      display: inline-block;
      padding: 2px 10px; border-radius: 999px; border: 1px solid;
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 10px;
    }

    .slide-title {
      font-family: var(--font-display);
      font-size: 1.1rem; font-weight: 800;
      color: var(--text-primary); margin: 0 0 14px;
      letter-spacing: -0.01em; line-height: 1.25;
    }

    .slide-lines {
      list-style: none; padding: 0; margin: 0;
      display: flex; flex-direction: column; gap: 8px;
    }
    .slide-lines li {
      display: flex; align-items: flex-start; gap: 8px;
      color: var(--text-secondary); font-size: 0.84rem; line-height: 1.5;
    }
    .line-dot {
      width: 4px; height: 4px; border-radius: 50%;
      background: var(--brand-cyan); flex-shrink: 0; margin-top: 7px; opacity: 0.7;
    }

    /* ─── Nav buttons ────────────────────────────────────  */
    .nav-btn {
      position: absolute; top: 50%; transform: translateY(-50%);
      z-index: 10;
      width: 42px; height: 42px; border-radius: 50%;
      border: 1px solid var(--border-subtle);
      background: rgba(255,255,255,0.04);
      color: var(--text-secondary);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; backdrop-filter: blur(8px);
      transition: all 0.25s ease;
    }
    .nav-btn:hover {
      border-color: var(--brand-cyan); color: var(--brand-cyan);
      background: rgba(37,99,235,0.08);
      box-shadow: 0 0 16px rgba(37,99,235,0.18);
    }
    .nav-prev { left: 12px; }
    .nav-next { right: 12px; }

    /* ─── Detail panel ───────────────────────────────────  */
    .detail-panel {
      position: relative; z-index: 2;
      max-width: 520px; margin: 0 auto;
      padding: 0 20px;
      opacity: 0; transform: translateY(20px);
      transition: opacity 0.65s ease 0.2s, transform 0.65s ease 0.2s;
    }
    .detail-panel.visible { opacity: 1; transform: none; }

    .detail-card {
      padding: 36px 32px 32px;
      border-radius: 24px;
      background: #ffffff;
      border: 1px solid rgba(0,0,0,0.07);
      box-shadow: 0 8px 48px rgba(0,0,0,0.12), 0 2px 12px rgba(0,0,0,0.06);
      animation: detailIn 0.35s ease;
    }
    @keyframes detailIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: none; }
    }

    .detail-title {
      font-family: var(--font-display);
      font-size: clamp(1.4rem, 3vw, 1.9rem);
      font-weight: 900; letter-spacing: -0.03em;
      color: #0F172A; margin: 0 0 12px; line-height: 1.15;
    }

    .detail-desc {
      color: #64748B;
      font-size: 0.95rem; line-height: 1.7;
      margin: 0 0 22px;
    }

    .detail-lines {
      list-style: none; padding: 0; margin: 0 0 28px;
      display: flex; flex-direction: column; gap: 14px;
    }
    .detail-lines li {
      display: flex; align-items: center; gap: 12px;
      color: #334155; font-size: 0.95rem; font-weight: 500;
    }
    .detail-check {
      width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
      background: rgba(59,130,246,0.1);
      border: 1.5px solid rgba(59,130,246,0.35);
      display: flex; align-items: center; justify-content: center;
      color: #3B82F6;
    }

    .detail-cta {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      width: 100%; height: 56px; border-radius: 16px;
      border: none;
      background: linear-gradient(135deg, #3B82F6, #6366F1);
      color: #fff; font-family: var(--font-display);
      font-size: 15px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 32px rgba(37,99,235,0.3);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .detail-cta:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(37,99,235,0.5);
    }
    .detail-cta svg { transition: transform 0.2s ease; }
    .detail-cta:hover svg { transform: translateX(4px); }

    /* ─── Dot nav ────────────────────────────────────────  */
    .dot-nav {
      position: relative; z-index: 2;
      display: flex; align-items: center; justify-content: center;
      gap: 8px; margin-top: 32px;
      opacity: 0; transition: opacity 0.6s ease 0.3s;
    }
    .dot-nav.visible { opacity: 1; }
    .dot {
      width: 28px; height: 28px; display: flex;
      align-items: center; justify-content: center;
      background: transparent; border: none; cursor: pointer; padding: 0;
    }
    .dot-inner {
      display: block; width: 7px; height: 7px; border-radius: 999px;
      background: var(--text-muted);
      transition: width 0.35s ease, background 0.35s ease, box-shadow 0.35s ease;
    }
    .dot-active .dot-inner {
      width: 26px; background: var(--brand-cyan);
      box-shadow: 0 0 10px rgba(0,212,255,0.5);
    }

    /* ─── Disclaimer ─────────────────────────────────────── */
    .mf-disclaimer {
      position: relative; z-index: 2;
      text-align: center;
      font-size: 12px;
      color: #60A5FA;
      font-family: 'Outfit', sans-serif;
      margin: 20px auto 0;
      padding: 0 24px 14px;
      max-width: 720px;
      line-height: 1.6;
      letter-spacing: 0.01em;
    }

    /* ─── SIP Calculator ─────────────────────────────────  */
    .sip-section {
      position: relative; z-index: 2;
      max-width: 1060px; margin: 52px auto 0;
      padding: 0 20px;
      opacity: 0; transform: translateY(24px);
      transition: opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s;
    }
    .sip-section.visible { opacity: 1; transform: none; }

    .sip-container { width: 100%; }

    .sip-heading {
      text-align: center; margin-bottom: 28px;
    }
    .sip-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 5px 16px; border-radius: 999px;
      border: 1px solid rgba(245,158,11,0.25);
      background: rgba(245,158,11,0.07);
      color: #F59E0B;
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.14em;
      margin-bottom: 12px;
    }
    .sip-title {
      font-family: var(--font-display);
      font-size: clamp(1.6rem, 3vw, 2.4rem);
      font-weight: 900; letter-spacing: -0.03em;
      color: var(--text-primary); margin: 0 0 8px;
    }
    .sip-sub {
      color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;
    }

    /* ── Calculator card ── */
    .sip-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(18,18,18,0.95);
      backdrop-filter: blur(20px);
      overflow: hidden;
      box-shadow: 0 8px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
    }

    /* ── Input panel ── */
    .sip-inputs {
      padding: 36px 32px;
      display: flex; flex-direction: column; gap: 28px;
      border-right: 1px solid rgba(255,255,255,0.06);
    }

    .sip-field { display: flex; flex-direction: column; gap: 10px; }

    .sip-field-top {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
    }

    .sip-label {
      font-size: 12px; font-weight: 700;
      color: rgba(255,255,255,0.45);
      text-transform: uppercase; letter-spacing: 0.08em;
      flex-shrink: 0;
    }

    .sip-input-wrap {
      display: flex; align-items: center; gap: 4px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; padding: 0 12px;
      height: 38px; min-width: 110px;
      transition: border-color 0.2s ease;
    }
    .sip-input-wrap:focus-within {
      border-color: rgba(37,99,235,0.4);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.07);
    }
    .sip-input-wrap.sip-error {
      border-color: rgba(239,68,68,0.5);
    }
    .sip-currency, .sip-unit {
      font-size: 13px; font-weight: 700;
      color: rgba(255,255,255,0.3); flex-shrink: 0;
    }
    .sip-num-input {
      flex: 1; min-width: 0;
      background: transparent; border: none; outline: none;
      color: #fff; font-size: 13px; font-weight: 700;
      font-family: var(--font-display);
      text-align: right;
      -moz-appearance: textfield;
    }
    .sip-num-input::-webkit-outer-spin-button,
    .sip-num-input::-webkit-inner-spin-button { -webkit-appearance: none; }

    /* Range slider */
    .sip-slider {
      -webkit-appearance: none; appearance: none;
      width: 100%; height: 4px;
      border-radius: 999px;
      background: rgba(255,255,255,0.08);
      outline: none; cursor: pointer;
    }
    .sip-slider::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 18px; height: 18px; border-radius: 50%;
      background: #3B82F6;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.2), 0 2px 8px rgba(37,99,235,0.4);
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .sip-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
      box-shadow: 0 0 0 5px rgba(37,99,235,0.15), 0 4px 16px rgba(0,212,255,0.5);
    }
    .sip-slider::-moz-range-thumb {
      width: 18px; height: 18px; border-radius: 50%; border: none;
      background: #3B82F6;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.2);
      cursor: pointer;
    }

    .sip-range-row {
      display: flex; justify-content: space-between;
      font-size: 10px; color: rgba(255,255,255,0.25); font-weight: 600;
    }

    .sip-warn {
      display: flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 600; color: #EF4444;
    }

    /* ── Results panel ── */
    .sip-results {
      padding: 36px 32px;
      display: flex; flex-direction: column; align-items: center;
      gap: 24px;
    }

    /* Donut chart */
    .sip-donut-wrap {
      display: flex; flex-direction: column; align-items: center; gap: 14px;
    }
    .sip-donut-svg {
      width: 160px; height: 160px;
      filter: drop-shadow(0 0 20px rgba(37,99,235,0.15));
    }
    .sip-donut-svg circle {
      transition: stroke-dasharray 0.55s cubic-bezier(0.4,0,0.2,1),
                  stroke-dashoffset 0.55s cubic-bezier(0.4,0,0.2,1);
    }

    .donut-legend {
      display: flex; gap: 20px;
    }
    .legend-row {
      display: flex; align-items: center; gap: 7px;
    }
    .legend-swatch {
      width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0;
    }
    .legend-txt {
      font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5);
    }

    /* Stat boxes */
    .sip-stats {
      width: 100%; display: flex; flex-direction: column; gap: 10px;
    }
    .sip-stat {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px; border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.025);
    }
    .sip-stat-green { border-color: rgba(59,130,246,0.12); background: rgba(59,130,246,0.04); }
    .sip-stat-primary {
      border-color: rgba(37,99,235,0.15);
      background: rgba(37,99,235,0.06);
    }
    .sstat-label {
      font-size: 11px; font-weight: 700;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .sstat-val {
      font-size: 1rem; font-weight: 800;
      font-family: var(--font-display);
    }
    .sstat-big {
      font-size: 1.2rem; color: #fff !important;
    }

    .sip-invest-btn {
      display: flex; align-items: center; justify-content: center; gap: 9px;
      width: 100%; height: 50px;
      border-radius: 14px; border: none;
      background: linear-gradient(135deg, #3B82F6, #6366F1);
      color: #fff; font-family: var(--font-display);
      font-size: 14px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 28px rgba(37,99,235,0.25);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      margin-top: 4px;
    }
    .sip-invest-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 40px rgba(37,99,235,0.4);
    }
    .sip-invest-btn svg { transition: transform 0.2s ease; }
    .sip-invest-btn:hover svg { transform: translateX(4px); }

    /* ─── Tag gradient classes ── */
    .tag-color-0 { color: #3B82F6; border-color: #3B82F644; background: #3B82F611; }
    .tag-color-1 { color: #10B981; border-color: #10B98144; background: #10B98111; }
    .tag-color-2 { color: #F59E0B; border-color: #F59E0B44; background: #F59E0B11; }
    .tag-color-3 { color: #8B5CF6; border-color: #8B5CF644; background: #8B5CF611; }
    .tag-color-4 { color: #F43F5E; border-color: #F43F5E44; background: #F43F5E11; }
    .tag-color-5 { color: #0EA5E9; border-color: #0EA5E944; background: #0EA5E911; }

    /* ─── Responsive ─────────────────────────────────────  */
    @media (max-width: 900px) {
      .sip-card { grid-template-columns: 1fr; }
      .sip-inputs { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
    }
    @media (max-width: 600px) {
      .mfs-root { padding: 80px 0 60px; }
      .mf-slide { width: 260px !important; }
      .nav-prev { left: 4px; }
      .nav-next { right: 4px; }
      .sip-inputs { padding: 24px 20px; }
      .sip-results { padding: 24px 20px; }
      .sip-field-top { flex-direction: column; align-items: flex-start; gap: 8px; }
      .sip-input-wrap { width: 100%; }
    }
  `],
})
export class MutualFundSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() openModal = new EventEmitter<void>();
  @ViewChild('swiperEl') swiperEl!: ElementRef;

  private ngZone = inject(NgZone);
  private api    = inject(ApiService);

  private readonly SLIDE_STYLES: Array<{ iconGrad: [string, string]; glowColor: string }> = [
    { iconGrad: ['#3B82F6', '#2563EB'], glowColor: 'rgba(59,130,246,0.18)' },
    { iconGrad: ['#0EA5E9', '#06B6D4'], glowColor: 'rgba(14,165,233,0.18)' },
    { iconGrad: ['#8B5CF6', '#6366F1'], glowColor: 'rgba(139,92,246,0.18)' },
    { iconGrad: ['#F59E0B', '#EF4444'], glowColor: 'rgba(245,158,11,0.18)' },
    { iconGrad: ['#F43F5E', '#E11D48'], glowColor: 'rgba(244,63,94,0.18)' },
    { iconGrad: ['#3B82F6', '#6366F1'], glowColor: 'rgba(37,99,235,0.18)' },
    { iconGrad: ['#A855F7', '#3B82F6'], glowColor: 'rgba(168,85,247,0.18)' },
  ];

  sectionVisible = true;
  selectedSlide!: MFSlide;

  /* SIP Calculator state */
  sipAmount = 10000;
  sipYears  = 10;
  sipRate   = 12;
  totalInvested    = 0;
  estimatedReturns = 0;
  maturityValue    = 0;
  sipWarning = '';

  readonly circumference = 2 * Math.PI * 56; // r=56 → ~351.86

  donutInvested = 0;
  donutReturns  = 0;

  private iobs: IntersectionObserver[] = [];

  slides: MFSlide[] = [
    {
      id: 1,
      title: 'SIP Investment',
      tag: 'Systematic Plan',
      iconGrad: ['#3B82F6', '#2563EB'],
      glowColor: 'rgba(59,130,246,0.18)',
      iconPath: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
      lines: [
        'Start SIP from just ₹1,000/month',
        'Auto-debit — never miss a payment',
        'Power of compounding over time',
      ],
      details: 'Systematic Investment Plan (SIP) is the most disciplined way to build wealth. Set it once — our platform auto-debits on your chosen date every month. Even ₹1,000/month invested for 20 years at 12% grows to over ₹9.9 lakhs. Start small, grow big.',
    },
    {
      id: 2,
      title: 'Expected Returns',
      tag: 'Returns',
      iconGrad: ['#10B981', '#059669'],
      glowColor: 'rgba(16,185,129,0.18)',
      iconPath: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
      lines: [
        '12–18% annualised returns (equity)',
        'Performance benchmarked monthly',
        'Historical data from 3–10 years',
      ],
      details: 'Top-performing equity mutual funds have consistently delivered 12–18% annualised returns over 5+ year horizons. Our platform shows you real historical returns, risk-adjusted performance scores, and projected growth so you can make informed decisions.',
    },
    {
      id: 3,
      title: 'Risk Level',
      tag: 'Risk Assessment',
      iconGrad: ['#F59E0B', '#D97706'],
      glowColor: 'rgba(245,158,11,0.18)',
      iconPath: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
      lines: [
        'Low, Moderate & High risk options',
        'Risk score for every fund',
        'Rebalancing alerts when needed',
      ],
      details: 'Every investor has a unique risk appetite. Our risk profiler maps your income, age, and goals to a personalised risk score, then recommends the right mix — debt funds for stability, equity for growth, or hybrid for balance. Rebalancing alerts keep your portfolio on track.',
    },
    {
      id: 4,
      title: 'Wealth Growth',
      tag: 'Compounding',
      badge: 'Popular',
      iconGrad: ['#8B5CF6', '#6366F1'],
      glowColor: 'rgba(139,92,246,0.18)',
      iconPath: 'M18 20V10M12 20V4M6 20v-6',
      lines: [
        '₹5,000/month → ₹1Cr in 25 years',
        'Goal-based milestone tracking',
        'Inflation-adjusted projections',
      ],
      details: "The eighth wonder of the world — compounding — works best over time. Use our SIP calculator to visualise how ₹5,000/month grows to ₹1 Crore+ with a 12% return over 25 years. Set retirement, education, or home goals and track your countdown to financial freedom.",
    },
    {
      id: 5,
      title: 'Tax Saving (ELSS)',
      tag: 'Tax Saving',
      iconGrad: ['#F43F5E', '#E11D48'],
      glowColor: 'rgba(244,63,94,0.18)',
      iconPath: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
      lines: [
        'Save up to ₹46,800 in tax (80C)',
        'Shortest lock-in — only 3 years',
        'Market-linked returns on ELSS',
      ],
      details: 'ELSS (Equity Linked Savings Scheme) funds qualify for ₹1.5L deduction under Section 80C — saving you up to ₹46,800 in tax per year. With the shortest lock-in of just 3 years among all 80C instruments and market-linked returns, ELSS is the smartest tax-saving investment.',
    },
    {
      id: 6,
      title: 'Portfolio Management',
      tag: 'Portfolio',
      iconGrad: ['#0EA5E9', '#06B6D4'],
      glowColor: 'rgba(14,165,233,0.18)',
      iconPath: 'M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z',
      lines: [
        'Live NAV & returns tracking',
        'Diversified across 1,000+ funds',
        'One-click rebalancing',
      ],
      details: 'Your complete investment dashboard — see all funds, NAV movements, total invested vs. current value, and gain/loss in real-time. Diversify across Large Cap, Mid Cap, Debt, and International funds. One-click rebalancing keeps your allocation aligned with your goals.',
    },
  ];

  ngOnInit(): void {
    this.api.getFunds({ limit: 10 }).subscribe({
      next: (res) => {
        if (res.success && res.data?.length) {
          this.slides = res.data.map((fund, i) => this.fundToSlide(fund, i));
          this.selectedSlide = this.slides[0];
        }
      },
      error: () => { /* fallback: keep hardcoded slides */ }
    });
  }

  private fundToSlide(fund: Fund, index: number): MFSlide {
    const style = this.SLIDE_STYLES[index % this.SLIDE_STYLES.length];
    const categoryIcons: Record<string, string> = {
      'Equity':  'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
      'Debt':    'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
      'Hybrid':  'M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z',
      'ELSS':    'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
      'Index':   'M18 20V10M12 20V4M6 20v-6',
    };
    return {
      id: index + 1,
      title: fund.fundName,
      tag: fund.category,
      badge: fund.isFeatured ? 'Featured' : undefined,
      highlight: fund.isFeatured,
      iconGrad: style.iconGrad,
      glowColor: style.glowColor,
      iconPath: categoryIcons[fund.category] ?? 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
      lines: [
        `Risk Level: ${fund.risk}`,
        `Expected Returns: ${fund.returns}`,
        `Min SIP: ₹${fund.minSIP}`,
      ],
      details: fund.description,
    };
  }

  ngAfterViewInit(): void {
    this.selectedSlide = this.selectedSlide ?? this.slides[0];
    this.calculateSIP();

    // Show immediately — component is only rendered when already on screen
    setTimeout(() => {
      this.sectionVisible = true;

      // Sync swiper auto-play with the detail panel
      const swiper = this.swiperEl?.nativeElement?.swiper;
      if (swiper) {
        swiper.on('slideChange', () => {
          this.ngZone.run(() => {
            const idx = swiper.realIndex ?? 0;
            this.selectedSlide = this.slides[idx % this.slides.length];
          });
        });
      }
    }, 80);

    const sectionEl = document.getElementById('mutual-funds');
    if (sectionEl) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            this.sectionVisible = true;
            obs.disconnect();
          }
        },
        { threshold: 0.08 }
      );
      obs.observe(sectionEl);
      this.iobs.push(obs);
    }
  }

  ngOnDestroy(): void {
    this.iobs.forEach((o) => o.disconnect());
  }

  selectSlide(slide: MFSlide): void {
    this.selectedSlide = slide;
    // Jump swiper to matching slide so auto-play stays in sync
    const swiper = this.swiperEl?.nativeElement?.swiper;
    if (swiper) {
      const idx = this.slides.findIndex(s => s.id === slide.id);
      if (idx !== -1) swiper.slideToLoop(idx);
    }
  }

  slidePrev(): void {
    this.swiperEl?.nativeElement?.swiper?.slidePrev();
  }

  slideNext(): void {
    this.swiperEl?.nativeElement?.swiper?.slideNext();
  }

  calculateSIP(): void {
    const P = Number(this.sipAmount);
    const years = Number(this.sipYears);
    const rate = Number(this.sipRate);

    if (P < 1000) {
      this.sipWarning = 'Minimum SIP amount is ₹1,000';
      return;
    }
    if (P > 500000) {
      this.sipWarning = 'Maximum SIP amount is ₹5,00,000';
      return;
    }
    this.sipWarning = '';

    const r = rate / 12 / 100;
    const n = years * 12;

    this.maturityValue    = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    this.totalInvested    = P * n;
    this.estimatedReturns = this.maturityValue - this.totalInvested;

    const investedRatio = this.maturityValue > 0
      ? this.totalInvested / this.maturityValue
      : 0;

    this.donutInvested = investedRatio * this.circumference;
    this.donutReturns  = (1 - investedRatio) * this.circumference;
  }

  formatINR(value: number): string {
    const n = Math.round(value);
    if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
    if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
    return `₹${n.toLocaleString('en-IN')}`;
  }

  formatCompact(value: number): string {
    const n = Math.round(value);
    if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
    if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`;
    return `₹${(n / 1000).toFixed(0)}K`;
  }
}

