import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rabbit-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Full-screen loader -->
    <div *ngIf="fullScreen" class="rl-fullscreen">
      <!-- Background orbs -->
      <div class="rl-orb rl-orb-1" aria-hidden="true"></div>
      <div class="rl-orb rl-orb-2" aria-hidden="true"></div>
      <div class="rl-grid" aria-hidden="true"></div>

      <div class="rl-center">
        <!-- Glow ring -->
        <div class="rl-glow-ring"></div>

        <!-- Logo wrapper -->
        <div class="rl-logo-wrap">
          <img src="/logo.png" alt="NViQ" class="rl-logo" />
        </div>

        <!-- Brand name -->
        <div class="rl-brand">
          NV<span class="rl-brand-accent">i</span>Q
        </div>

        <!-- Tagline -->
        <p class="rl-tagline">Fleet Intelligence Platform</p>

        <!-- Progress bar -->
        <div class="rl-bar-track">
          <div class="rl-bar-fill" [style.width.%]="progressPercent"></div>
          <div class="rl-bar-shine"></div>
        </div>

        <!-- Percent -->
        <span class="rl-percent">{{ progressPercent }}%</span>
      </div>
    </div>

    <!-- Inline spinner -->
    <div *ngIf="!fullScreen" class="rl-inline">
      <div class="rl-inline-glow"></div>
      <img src="/logo.png" alt="NViQ" class="rl-inline-logo" />
      <p *ngIf="text" class="rl-inline-text">{{ text }}</p>
    </div>
  `,
  styles: [`
    /* ── Full-screen loader ─────────────────────────── */
    .rl-fullscreen {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      background: radial-gradient(ellipse at 30% 20%, #060D1F 0%, #040810 50%, #020508 100%);
      animation: rlFadeIn 0.35s ease both;
    }
    @keyframes rlFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* Background orbs */
    .rl-orb {
      position: absolute; border-radius: 50%;
      filter: blur(100px); pointer-events: none;
    }
    .rl-orb-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 65%);
      top: -140px; left: -80px;
      animation: rlOrbFloat 6s ease-in-out infinite;
    }
    .rl-orb-2 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%);
      bottom: -120px; right: -60px;
      animation: rlOrbFloat 8s ease-in-out infinite reverse;
    }
    @keyframes rlOrbFloat {
      0%, 100% { transform: translate(0, 0); }
      50%      { transform: translate(30px, -40px); }
    }

    /* Grid overlay */
    .rl-grid {
      position: absolute; inset: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
    }

    /* Center group */
    .rl-center {
      position: relative; z-index: 2;
      display: flex; flex-direction: column;
      align-items: center; gap: 0;
      animation: rlCenterIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both;
    }
    @keyframes rlCenterIn {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: none; }
    }

    /* Glow ring behind logo */
    .rl-glow-ring {
      position: absolute;
      width: 180px; height: 180px; border-radius: 50%;
      background: radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(99,102,241,0.12) 45%, transparent 70%);
      filter: blur(24px);
      animation: rlGlowPulse 2.4s ease-in-out infinite;
      top: -20px;
    }
    @keyframes rlGlowPulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50%      { opacity: 1;   transform: scale(1.15); }
    }

    /* Logo */
    .rl-logo-wrap {
      width: 110px; height: 110px;
      display: flex; align-items: center; justify-content: center;
      animation: rlLogoFloat 3s ease-in-out infinite;
      margin-bottom: 20px;
      position: relative;
    }
    .rl-logo-wrap::after {
      content: '';
      position: absolute; inset: -8px; border-radius: 50%;
      border: 1.5px solid rgba(59,130,246,0.25);
      animation: rlRingPulse 2.4s ease-in-out infinite;
    }
    @keyframes rlRingPulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50%      { opacity: 1;   transform: scale(1.08); }
    }
    @keyframes rlLogoFloat {
      0%, 100% { transform: translateY(0px); }
      50%      { transform: translateY(-8px); }
    }
    .rl-logo {
      width: 100%; height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 18px rgba(59,130,246,0.5))
              drop-shadow(0 0 6px rgba(99,102,241,0.3));
      animation: rlLogoGlow 2.4s ease-in-out infinite;
    }
    @keyframes rlLogoGlow {
      0%, 100% { filter: drop-shadow(0 0 14px rgba(59,130,246,0.4)) drop-shadow(0 0 4px rgba(99,102,241,0.2)); }
      50%      { filter: drop-shadow(0 0 28px rgba(59,130,246,0.7)) drop-shadow(0 0 10px rgba(99,102,241,0.4)); }
    }

    /* Brand name */
    .rl-brand {
      font-family: 'Outfit', sans-serif;
      font-size: 2.2rem; font-weight: 900;
      letter-spacing: -0.04em; color: #F0F6FF;
      margin-bottom: 6px;
    }
    .rl-brand-accent {
      background: linear-gradient(120deg, #3B82F6, #6366F1);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Tagline */
    .rl-tagline {
      font-size: 11px; font-weight: 600;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase; letter-spacing: 0.2em;
      margin: 0 0 28px;
    }

    /* Progress bar */
    .rl-bar-track {
      position: relative;
      width: 200px; height: 3px;
      background: rgba(255,255,255,0.08);
      border-radius: 999px; overflow: hidden;
      margin-bottom: 10px;
    }
    .rl-bar-fill {
      height: 100%; border-radius: 999px;
      background: linear-gradient(90deg, #3B82F6 0%, #6366F1 60%, #818CF8 100%);
      transition: width 0.1s linear;
      box-shadow: 0 0 10px rgba(59,130,246,0.6);
    }
    .rl-bar-shine {
      position: absolute; top: 0; bottom: 0; width: 60px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
      animation: rlShine 1.8s ease-in-out infinite;
    }
    @keyframes rlShine {
      0%   { left: -60px; }
      100% { left: 220px; }
    }

    /* Percent */
    .rl-percent {
      font-family: 'Outfit', sans-serif;
      font-size: 12px; font-weight: 700;
      background: linear-gradient(90deg, #93C5FD, #818CF8);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.04em;
    }

    /* ── Inline spinner ─────────────────────────────── */
    .rl-inline {
      position: relative;
      display: flex; flex-direction: column;
      align-items: center; gap: 10px;
    }
    .rl-inline-glow {
      position: absolute;
      width: 80px; height: 80px; border-radius: 50%;
      background: radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%);
      filter: blur(14px);
      animation: rlGlowPulse 2.4s ease-in-out infinite;
    }
    .rl-inline-logo {
      width: 52px; height: 52px; object-fit: contain;
      position: relative; z-index: 1;
      filter: drop-shadow(0 0 10px rgba(59,130,246,0.5));
      animation: rlLogoFloat 2.4s ease-in-out infinite;
    }
    .rl-inline-text {
      font-size: 11px; font-weight: 600;
      color: rgba(255,255,255,0.35);
      letter-spacing: 0.1em; text-transform: uppercase;
      animation: rlTextPulse 1.6s ease-in-out infinite;
    }
    @keyframes rlTextPulse {
      0%, 100% { opacity: 0.5; }
      50%      { opacity: 1; }
    }

    /* Mobile */
    @media (max-width: 480px) {
      .rl-logo-wrap { width: 88px; height: 88px; }
      .rl-brand { font-size: 1.8rem; }
      .rl-bar-track { width: 160px; }
    }
  `],
})
export class RabbitLoaderComponent implements OnInit, OnDestroy {
  @Input() fullScreen = false;
  @Input() duration = 3600;
  @Input() height = 120;
  @Input() text = 'Loading...';

  progressPercent = 0;
  private animId = 0;
  private startTime = 0;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.startProgress();
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
  }

  private startProgress(): void {
    const loop = (now: number) => {
      if (!this.startTime) this.startTime = now;
      const elapsed = now - this.startTime;
      const t = Math.min(1, elapsed / this.duration);
      this.progressPercent = Math.round(this.easeOut(t) * 100);
      if (t < 1) {
        this.animId = requestAnimationFrame(loop);
      }
    };
    this.animId = requestAnimationFrame(loop);
  }

  private easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 2.5);
  }
}
