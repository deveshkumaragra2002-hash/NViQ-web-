import {
  Component, OnInit, OnDestroy, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ApiService, LiveGpsStats } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { TiltDirective }         from '../../directives/tilt.directive';
import { RevealDirective }       from '../../directives/reveal.directive';
import { CountupDirective }      from '../../directives/countup.directive';
import { ParticleCanvasComponent } from '../particle-canvas/particle-canvas.component';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, TiltDirective, RevealDirective, CountupDirective, ParticleCanvasComponent],
  template: `
    <!-- ══ ABOUT HERO ════════════════════════════════════ -->
    <section class="ab-hero" aria-label="About NViQ">
      <div class="ab-hero-overlay"></div>
      <div class="ab-hero-glow"></div>
      <div class="ab-hero-content">
        <span class="ab-hero-tag">About NViQ</span>
        <h1 class="ab-hero-title">We Are <span class="ab-brand"><span class="ab-bn">N</span><span class="ab-bvi">vi</span><span class="ab-bq">Q</span></span></h1>
        <div class="ab-hero-divider"></div>
        <div class="ab-hero-chips">
          <span class="ab-chip">Founded 2026</span>
          <span class="ab-chip">10+ Years GPS Experience</span>
          <span class="ab-chip">Free Consultation • AMFI Registered</span>
          <span class="ab-chip">ARN No: 359231</span>
          <span class="ab-chip">Pan-India</span>
        </div>
      </div>
    </section>

    <!-- ══ ABOUT CONTENT ══════════════════════════════════ -->
    <section class="ab-root">
      <div class="ab-bg" aria-hidden="true">
        <div class="ab-orb ab-orb-1 float-y"></div>
        <div class="ab-orb ab-orb-2 float-y delay-300"></div>
        <div class="ab-grid-bg"></div>
      </div>

      <div class="ab-container">

        <!-- Header -->
        <header class="ab-header" appReveal="up">
          <p class="ab-eyebrow">About NViQ</p>
          <h2 class="ab-title">
            Redefining How India's<br>
            <span class="ab-accent">Fleets Operate & Invest</span>
          </h2>
        </header>

        <!-- Mission block -->
        <div class="ab-mission">
          <div class="ab-mission-text" appReveal="left" [revealDelay]="80">
            <h3>Our Mission</h3>
            <p>
              NViQ is India's first unified Fleet Intelligence + Fintech platform. We believe
              fleet operators shouldn't have to choose between operational excellence and financial growth.
              Our mission is to give every Indian fleet business — from single vehicles to large enterprises
              — the data tools and investment infrastructure previously only available to the biggest players.
            </p>
            <p>
              Backed by 10+ years of GPS and fleet tracking expertise, we're building at the intersection of GPS technology,
              AI-powered analytics, and Free Consultation • AMFI Registered investment support with ARN No: 359231 — all in one platform
              that works on day one without changing how you operate.
            </p>
          </div>

          <!-- Stats card with 3D tilt -->
          <div class="ab-mission-stats glass-dark" appTilt [tiltMax]="8" [tiltGlow]="'rgba(59,130,246,0.2)'"
            appReveal="right" [revealDelay]="160">
            <div class="ab-stat" *ngFor="let s of stats">
              <strong [style.color]="s.color"
                *ngIf="s.num > 0"
                [appCountup]="s.num"
                [countupSuffix]="s.suffix"
                [countupPrefix]="s.prefix">{{ s.val }}</strong>
              <strong [style.color]="s.color" *ngIf="s.num === 0">{{ s.val }}</strong>
              <span>{{ s.label }}</span>
            </div>
          </div>
        </div>

        <!-- Values -->
        <div class="ab-values-header" appReveal="up" [revealDelay]="60">
          <h3>What We Stand For</h3>
        </div>

        <!-- GPS Values Row -->
        <div class="ab-values-section-label" appReveal="up" [revealDelay]="40">
          <span class="ab-vs-dot ab-vs-dot-gps"></span>
          GPS Platform
        </div>
        <div class="ab-values ab-values-gps">
          <div class="ab-value glass-dark" *ngFor="let v of gpsValues; let i = index"
            appTilt [tiltMax]="10" [tiltGlow]="v.color + '30'"
            appReveal="up" [revealDelay]="i * 80">
            <div class="ab-value-icon" [style.background]="v.glow" [style.border-color]="v.color + '33'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                [attr.stroke]="v.color" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path [attr.d]="v.icon"/>
              </svg>
            </div>
            <h4>{{ v.title }}</h4>
            <p>{{ v.desc }}</p>
          </div>
        </div>

        <!-- MF Values Row -->
        <div class="ab-values-section-label" appReveal="up" [revealDelay]="40">
          <span class="ab-vs-dot ab-vs-dot-mf"></span>
          Mutual Fund Platform
        </div>
        <div class="ab-values ab-values-mf">
          <div class="ab-value glass-dark" *ngFor="let v of mfValues; let i = index"
            appTilt [tiltMax]="10" [tiltGlow]="v.color + '30'"
            appReveal="up" [revealDelay]="i * 80">
            <div class="ab-value-icon" [style.background]="v.glow" [style.border-color]="v.color + '33'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                [attr.stroke]="v.color" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path [attr.d]="v.icon"/>
              </svg>
            </div>
            <h4>{{ v.title }}</h4>
            <p>{{ v.desc }}</p>
          </div>
        </div>

        <!-- Timeline / Milestones -->
        <div class="ab-timeline-wrap" appReveal="up" [revealDelay]="80">
          <div class="ab-timeline-header">
            <h3>Our Journey</h3>
          </div>
          <div class="ab-timeline">
            <div class="ab-tl-item" *ngFor="let m of milestones; let i = index"
              appReveal="up" [revealDelay]="i * 120"
              [class.ab-tl-right]="i % 2 === 1">
              <div class="ab-tl-dot" [style.background]="m.color"></div>
              <div class="ab-tl-card glass-dark" appTilt [tiltMax]="6" [tiltGlow]="m.color + '22'">
                <span class="ab-tl-year" [style.color]="m.color">{{ m.year }}</span>
                <h4>{{ m.title }}</h4>
                <p>{{ m.desc }}</p>
                <ng-container *ngIf="m.liveStats">
                  <div class="ab-live-row">
                    <span class="ab-live-pill">Live Stats</span>
                    <span class="ab-live-status">
                      <span class="ab-live-pulse"></span>
                      Updated {{ lastGpsStatsUpdateLabel }}
                    </span>
                  </div>
                  <div class="ab-live-grid">
                    <div class="ab-live-stat" *ngFor="let stat of gpsLiveStatCards">
                      <strong>{{ formatLiveValue(stat.value, stat.suffix) }}</strong>
                      <span>{{ stat.label }}</span>
                    </div>
                  </div>
                </ng-container>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    /* ── About Hero ───────────────────────────────────── */
    .ab-hero {
      position: relative;
      width: 100%;
      min-height: 92vh;
      display: flex; align-items: center; justify-content: flex-end;
      background: url('/images/about%20slide.jpg.png') center center / cover no-repeat;
      overflow: hidden;
    }

    .ab-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(
        -120deg,
        rgba(2,6,16,0.88) 0%,
        rgba(5,15,35,0.78) 50%,
        rgba(0,0,0,0.20) 100%
      );
      z-index: 1;
    }

    .ab-hero-glow {
      position: absolute;
      bottom: -120px; right: -80px;
      width: 700px; height: 700px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%);
      filter: blur(60px);
      z-index: 2; pointer-events: none;
    }

    .ab-hero-content {
      position: relative; z-index: 3;
      max-width: 620px;
      padding: 0 80px;
      animation: abHeroIn 0.8s cubic-bezier(0.22,1,0.36,1) both;
    }
    @keyframes abHeroIn {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: none; }
    }

    .ab-hero-tag {
      display: inline-flex; align-items: center;
      padding: 6px 18px; border-radius: 999px;
      border: 1px solid rgba(59,130,246,0.45);
      background: rgba(59,130,246,0.12);
      color: #60A5FA; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.14em;
      margin-bottom: 24px; width: fit-content;
      box-shadow: 0 0 20px rgba(59,130,246,0.15);
    }

    .ab-hero-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(3rem, 6vw, 5.5rem);
      font-weight: 900; letter-spacing: -0.03em;
      color: #F0F6FF; margin: 0 0 18px; line-height: 1.0;
      text-shadow: 0 4px 40px rgba(0,0,0,0.5);
    }
    .ab-brand {
      font-family: 'Courier New', monospace;
      font-size: inherit;
      font-weight: 900; letter-spacing: -3px;
      display: inline-flex; align-items: baseline;
    }
    .ab-bn { color: #ffffff; font-weight: 900; }
    .ab-bvi { color: rgba(255,255,255,0.4); font-weight: 700; letter-spacing: -2px; }
    .ab-bq { color: #3B82F6; font-weight: 900; text-shadow: 0 0 24px rgba(59,130,246,0.5); }

    .ab-hero-divider {
      width: 64px; height: 3px;
      background: linear-gradient(90deg, #3B82F6, #6366F1);
      border-radius: 999px; margin-bottom: 24px;
      box-shadow: 0 0 16px rgba(59,130,246,0.5);
    }

    .ab-hero-sub {
      font-size: clamp(1.05rem, 2vw, 1.25rem); font-weight: 700;
      color: rgba(255,255,255,0.9); line-height: 1.5; margin: 0 0 14px;
    }

    .ab-hero-desc {
      font-size: 0.97rem; color: rgba(255,255,255,0.55);
      line-height: 1.78; margin: 0 0 32px; max-width: 520px;
    }

    .ab-hero-chips {
      display: flex; gap: 10px; flex-wrap: wrap;
    }
    .ab-chip {
      padding: 6px 16px; border-radius: 999px;
      border: 1px solid rgba(59,130,246,0.3);
      background: rgba(59,130,246,0.1);
      color: #93C5FD; font-size: 12px; font-weight: 600;
      backdrop-filter: blur(8px);
      box-shadow: 0 0 12px rgba(59,130,246,0.1);
    }

    @media (max-width: 1024px) {
      .ab-hero { min-height: 75vh; justify-content: center; }
      .ab-hero-overlay { background: linear-gradient(to top, rgba(2,6,16,0.9) 0%, rgba(2,6,16,0.65) 100%); }
      .ab-hero-content { padding: 60px 40px; text-align: center; max-width: 100%; }
      .ab-hero-tag { margin-left: auto; margin-right: auto; }
      .ab-hero-divider { margin-left: auto; margin-right: auto; }
      .ab-hero-chips { justify-content: center; }
      .ab-hero-desc { max-width: 100%; }
    }
    @media (max-width: 600px) {
      .ab-hero { min-height: 65vh; }
      .ab-hero-content { padding: 48px 24px; }
      .ab-hero-title { font-size: 2.6rem; }
    }
    /* ── About Content Section ────────────────────────── */
    .ab-root {
      min-height: 100vh; background: #0A0A0A;
      padding: 100px 32px 80px;
      position: relative; overflow: hidden;
    }
    .ab-bg { position: absolute; inset: 0; pointer-events: none; }
    .ab-orb {
      position: absolute; border-radius: 50%; filter: blur(120px);
    }
    .ab-orb-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%);
      top: -100px; right: -100px;
    }
    .ab-orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%);
      bottom: -80px; left: -80px;
    }
    .ab-grid-bg {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px);
      background-size: 64px 64px;
      mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black 10%, transparent 80%);
    }

    .ab-container { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

    /* Header */
    .ab-header { text-align: center; max-width: 720px; margin: 0 auto 72px; }
    .ab-eyebrow {
      display: inline-block; color: #3B82F6;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.16em;
      border: 1px solid rgba(59,130,246,0.25);
      background: rgba(59,130,246,0.07);
      padding: 5px 16px; border-radius: 999px; margin-bottom: 16px;
    }
    .ab-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(2.2rem, 5vw, 4rem);
      font-weight: 900; letter-spacing: -0.04em;
      color: #fff; line-height: 1.05;
    }
    .ab-accent {
      background: linear-gradient(120deg, #3B82F6, #818cf8);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Mission */
    .ab-mission {
      display: grid; grid-template-columns: 1fr 340px;
      gap: 60px; align-items: start; margin-bottom: 72px;
    }
    .ab-mission-text h3 {
      font-size: 1.8rem; font-weight: 800;
      color: #fff; margin-bottom: 20px; letter-spacing: -0.02em;
    }
    .ab-mission-text p {
      color: rgba(255,255,255,0.52);
      font-size: 1rem; line-height: 1.8; margin-bottom: 16px;
    }
    .ab-mission-stats {
      display: flex; flex-direction: column; gap: 24px;
      padding: 32px; border-radius: 20px;
    }
    .ab-stat strong {
      display: block;
      font-size: 2.4rem; font-weight: 900; letter-spacing: -0.03em; line-height: 1;
    }
    .ab-stat span {
      font-size: 12px; color: rgba(255,255,255,0.38);
      font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;
      margin-top: 4px; display: block;
    }

    /* Visual Image Grid */
    .ab-visual-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr;
      gap: 16px; height: 380px; margin-bottom: 72px;
    }
    .ab-visual-card {
      position: relative; border-radius: 20px; overflow: hidden;
      cursor: pointer;
    }
    .ab-vc-tall { grid-row: span 1; }
    .ab-vc-bg {
      position: absolute; inset: 0;
      background-size: cover; background-position: center;
      transition: transform .7s cubic-bezier(0.23,1,0.32,1);
    }
    .ab-visual-card:hover .ab-vc-bg { transform: scale(1.07); }

    /* CSS gradient placeholders — swap to real images once you have them */
    .ab-vc-bg-0 {
      background:
        linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)),
        url('/images/about-team.jpg') center/cover,
        linear-gradient(135deg, #1a2744 0%, #0f172a 50%, #1e3a5f 100%);
    }
    .ab-vc-bg-1 {
      background:
        linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)),
        url('/images/about-office.jpg') center/cover,
        linear-gradient(135deg, #1a1044 0%, #0f0a2a 50%, #2d1b69 100%);
    }
    .ab-vc-bg-2 {
      background:
        linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)),
        url('/images/about-tech.jpg') center/cover,
        linear-gradient(135deg, #0f2a1a 0%, #0a1f10 50%, #1a3a1a 100%);
    }

    .ab-vc-label {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 16px 20px;
      background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
      z-index: 3;
    }
    .ab-vc-tag {
      display: inline-block;
      padding: 2px 10px; border-radius: 999px;
      background: rgba(59,130,246,0.2); border: 1px solid rgba(59,130,246,0.35);
      color: #60A5FA; font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 4px;
    }
    .ab-vc-label p {
      color: #fff; font-size: 14px; font-weight: 700; margin: 0;
    }

    /* Values */
    .ab-values-header {
      text-align: center; margin-bottom: 28px;
    }
    .ab-values-header h3 {
      font-size: 2rem; font-weight: 800; color: #fff; letter-spacing: -0.02em;
    }
    .ab-values-section-label {
      display: flex; align-items: center; gap: 10px;
      font-size: 11px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.14em;
      color: rgba(255,255,255,0.35);
      margin-bottom: 14px;
      padding-left: 2px;
    }
    .ab-vs-dot {
      width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    }
    .ab-vs-dot-gps { background: #00D4FF; box-shadow: 0 0 8px #00D4FF; }
    .ab-vs-dot-mf  { background: #22c55e; box-shadow: 0 0 8px #22c55e; }

    .ab-values {
      display: grid; gap: 18px;
      margin-bottom: 28px;
    }
    .ab-values-gps { grid-template-columns: repeat(4, 1fr); }
    .ab-values-mf  { grid-template-columns: repeat(3, 1fr); margin-bottom: 80px; }
    .ab-value {
      padding: 28px 22px; border-radius: 18px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .ab-value-icon {
      width: 48px; height: 48px; border-radius: 12px; border: 1px solid;
      display: flex; align-items: center; justify-content: center;
    }
    .ab-value h4 { font-size: 1rem; font-weight: 800; color: #fff; letter-spacing: -0.01em; }
    .ab-value p  { font-size: 0.84rem; color: rgba(255,255,255,0.42); line-height: 1.65; }

    /* Timeline */
    .ab-timeline-header {
      text-align: center; margin-bottom: 48px;
    }
    .ab-timeline-header h3 {
      font-size: 2rem; font-weight: 800; color: #fff; letter-spacing: -0.02em;
    }
    .ab-timeline {
      position: relative;
      display: flex; flex-direction: column; gap: 32px;
      max-width: 800px; margin: 0 auto;
    }
    .ab-timeline::before {
      content: '';
      position: absolute; left: 50%; top: 0; bottom: 0;
      width: 1px; background: linear-gradient(to bottom, transparent, rgba(59,130,246,0.35) 20%, rgba(59,130,246,0.35) 80%, transparent);
      transform: translateX(-50%);
    }
    .ab-tl-item {
      display: flex; align-items: center;
      justify-content: flex-end; gap: 28px;
      padding-right: calc(50% + 20px);
    }
    .ab-tl-item.ab-tl-right {
      flex-direction: row-reverse;
      justify-content: flex-end;
      padding-right: 0; padding-left: calc(50% + 20px);
    }
    .ab-tl-dot {
      position: absolute; left: 50%;
      transform: translateX(-50%);
      width: 12px; height: 12px; border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(0,0,0,0.8), 0 0 16px rgba(59,130,246,0.5);
      flex-shrink: 0;
    }
    .ab-tl-card {
      max-width: 340px; padding: 24px 28px; border-radius: 16px;
    }
    .ab-tl-year {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.12em;
      display: block; margin-bottom: 6px;
    }
    .ab-tl-card h4 {
      font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 6px;
    }
    .ab-tl-card p { font-size: 0.84rem; color: rgba(255,255,255,0.45); line-height: 1.6; }
    .ab-live-row {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; margin-top: 18px; margin-bottom: 14px; flex-wrap: wrap;
    }
    .ab-live-pill {
      display: inline-flex; align-items: center;
      padding: 5px 10px; border-radius: 999px;
      border: 1px solid rgba(59,130,246,0.28);
      background: rgba(59,130,246,0.1);
      color: #8ec5ff; font-size: 10px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.14em;
    }
    .ab-live-status {
      display: inline-flex; align-items: center; gap: 8px;
      color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 600;
    }
    .ab-live-pulse {
      width: 8px; height: 8px; border-radius: 50%;
      background: #38bdf8; box-shadow: 0 0 14px rgba(56,189,248,0.8);
      animation: abPulse 1.8s ease-in-out infinite;
    }
    @keyframes abPulse {
      0%, 100% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 1; }
    }
    .ab-live-grid {
      display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px; margin-top: 4px;
    }
    .ab-live-stat {
      padding: 12px 14px; border-radius: 14px;
      background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
      border: 1px solid rgba(255,255,255,0.05);
    }
    .ab-live-stat strong {
      display: block; color: #fff; font-size: 1.2rem;
      font-weight: 900; letter-spacing: -0.03em; line-height: 1.1;
    }
    .ab-live-stat span {
      display: block; margin-top: 4px;
      color: rgba(255,255,255,0.46); font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .ab-values-gps { grid-template-columns: repeat(2,1fr); }
      .ab-values-mf  { grid-template-columns: repeat(2,1fr); }
      .ab-visual-grid { grid-template-columns: 1fr 1fr; height: auto; }
      .ab-vc-tall { grid-row: auto; height: 220px; }
      .ab-visual-card { height: 200px; }
    }
    @media (max-width: 768px) {
      .ab-slide-content { padding: 0 24px; }
      .ab-mission { grid-template-columns: 1fr; }
      .ab-values-gps, .ab-values-mf { grid-template-columns: 1fr; }
      .ab-visual-grid { grid-template-columns: 1fr; height: auto; }
      .ab-visual-card { height: 200px; }
      .ab-timeline::before { left: 20px; }
      .ab-tl-item, .ab-tl-item.ab-tl-right {
        flex-direction: column; padding: 0 0 0 48px;
        align-items: flex-start;
      }
      .ab-tl-dot { left: 20px; }
      .ab-live-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AboutSectionComponent implements OnInit, OnDestroy {
  private timer: any;
  private pollingSub?: Subscription;
  private socket?: Socket;
  private animationHandles = new Map<string, number>();
  private readonly socketUrl = environment.apiUrl.replace(/\/api$/, '');

  stats = [
    { val: '10+',    label: 'Years GPS Experience', color: '#00D4FF', num: 10,   suffix: '+',  prefix: '' },
    { val: '500+',   label: 'Vehicles Tracked',     color: '#60A5FA', num: 500,  suffix: '+',  prefix: '' },
    { val: '99.9%',  label: 'Platform Uptime',      color: '#a78bfa', num: 99,   suffix: '%',  prefix: '' },
    { val: 'AMFI',   label: 'ARN No: 359231',        color: '#22c55e', num: 0,    suffix: '',   prefix: '' },
  ];

  gpsValues = [
    {
      icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      color: '#00D4FF', glow: 'rgba(0,212,255,0.1)',
      title: '10+ Years of GPS Expertise',
      desc: 'Over a decade of hands-on GPS and fleet tracking experience powering smarter routes, safer drivers, and profitable operations across India.',
    },
    {
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2',
      color: '#3B82F6', glow: 'rgba(59,130,246,0.1)',
      title: 'Data First',
      desc: 'Every product decision is backed by measurable outcomes. No vanity features.',
    },
    {
      icon: 'M13 2L3 14h9l-1 8 10-12h-9z',
      color: '#3B82F6', glow: 'rgba(59,130,246,0.1)',
      title: 'Speed to Value',
      desc: 'Onboard in a day. See measurable impact within the first week.',
    },
    {
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
      color: '#F59E0B', glow: 'rgba(245,158,11,0.1)',
      title: 'Built for India',
      desc: 'Designed for the real-world conditions of Indian fleet businesses.',
    },
  ];

  mfValues = [
    {
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
      color: '#22c55e', glow: 'rgba(34,197,94,0.1)',
      title: 'AMFI Registered',
      desc: 'Free Consultation • AMFI Registered mutual fund platform with ARN No: 359231, zero commission, and full transparency.',
    },
    {
      icon: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
      color: '#A78BFA', glow: 'rgba(167,139,250,0.1)',
      title: 'Wealth for All',
      desc: 'SIP investments starting ₹1,000/month — making wealth creation accessible to every Indian.',
    },
    {
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 6v6l4 2',
      color: '#FB923C', glow: 'rgba(251,146,60,0.1)',
      title: 'Long-Term Thinking',
      desc: 'We optimise for your 10-year outcome, not the next quarter. Compounding is our strategy.',
    },
  ];

  milestones = [
    {
      year: 'Q1 2026', color: '#3B82F6',
      title: 'Company Founded',
      desc: 'NViQ incorporated in India with a vision to unify fleet ops and fintech.',
    },
    {
      year: 'Q2 2026', color: '#22c55e',
      title: 'GPS Platform Launch',
      desc: 'Live GPS tracking goes live across 500 vehicles in pilot across 3 cities.',
    },
    {
      year: 'Q3 2026', color: '#a78bfa',
      title: 'AMFI Registration',
      desc: 'Mutual fund platform launches with Free Consultation • AMFI Registered support and ARN No: 359231.',
    },
    {
      year: 'Q4 2026', color: '#f59e0b',
      title: '0 Active Vehicles',
      desc: 'Real-time GPS tracking actively monitoring commercial fleets across India with smart alerts, live tracking, fuel analytics, and route intelligence.',
      liveStats: true,
    },
  ];

  gpsLiveStatCards = [
    { key: 'vehiclesOnline', label: 'Vehicles Online', value: 0, suffix: '+' },
    { key: 'tripsTracked', label: 'Trips Tracked', value: 0, suffix: '+' },
    { key: 'smartAlerts', label: 'Smart Alerts', value: 0, suffix: '+' },
    { key: 'citiesCovered', label: 'Cities Covered', value: 0, suffix: '+' },
  ];

  lastGpsStatsUpdateLabel = 'just now';

  constructor(
    private ngZone: NgZone,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.startGpsStatsFeed();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.pollingSub?.unsubscribe();
    this.socket?.disconnect();
    this.animationHandles.forEach((handle) => cancelAnimationFrame(handle));
    this.animationHandles.clear();
  }

  private startGpsStatsFeed(): void {
    this.fetchGpsStats();
    this.pollingSub = interval(15000).subscribe(() => this.fetchGpsStats());

    this.socket = io(this.socketUrl, {
      transports: ['websocket', 'polling'],
      path: '/socket.io',
      timeout: 3000,
      reconnection: false,
    });

    this.socket.on('gps:live-stats', (stats: LiveGpsStats) => {
      this.ngZone.run(() => this.applyGpsStats(stats));
    });

    this.socket.on('connect_error', () => {
      this.socket?.disconnect();
    });
  }

  private fetchGpsStats(): void {
    this.apiService.getLiveGpsStats().subscribe({
      next: (response) => this.applyGpsStats(response.data),
      error: () => undefined,
    });
  }

  private applyGpsStats(stats: LiveGpsStats): void {
    const nextValues: Record<string, number> = {
      vehiclesOnline: stats.vehiclesOnline,
      tripsTracked: stats.tripsTracked,
      smartAlerts: stats.smartAlerts,
      citiesCovered: stats.citiesCovered,
    };

    this.gpsLiveStatCards.forEach((card) => {
      const targetValue = nextValues[card.key];
      this.animateLiveValue(card.key, card.value, targetValue);
    });

    this.lastGpsStatsUpdateLabel = this.formatUpdatedAt(stats.updatedAt);
  }

  private animateLiveValue(key: string, fromValue: number, toValue: number): void {
    if (fromValue === toValue) return;

    const existing = this.animationHandles.get(key);
    if (existing) cancelAnimationFrame(existing);

    const start = performance.now();
    const duration = 900;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(fromValue + ((toValue - fromValue) * eased));

      this.gpsLiveStatCards = this.gpsLiveStatCards.map((card) =>
        card.key === key ? { ...card, value } : card
      );

      if (progress < 1) {
        const handle = requestAnimationFrame(tick);
        this.animationHandles.set(key, handle);
      } else {
        this.animationHandles.delete(key);
      }
    };

    const handle = requestAnimationFrame(tick);
    this.animationHandles.set(key, handle);
  }

  formatLiveValue(value: number, suffix = ''): string {
    return `${new Intl.NumberFormat('en-IN').format(value)}${suffix}`;
  }

  private formatUpdatedAt(updatedAt: string): string {
    const diffMs = Date.now() - new Date(updatedAt).getTime();
    const diffSeconds = Math.max(0, Math.round(diffMs / 1000));
    if (diffSeconds < 5) return 'just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;

    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    return 'recently';
  }
}
