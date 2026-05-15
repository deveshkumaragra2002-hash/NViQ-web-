import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { NavService } from '../../services/nav.service';

interface CtaConfig {
  badge:    string;
  title:    string;
  accent:   string;
  desc:     string;
  primary:  string;
  ghost:    string;
  chips:    string[];
}

const CTA_CONFIGS: Record<string, CtaConfig> = {
  gps: {
    badge:   '14-day free trial · No credit card',
    title:   'Ready to Run Your Fleet',
    accent:  'on Live Data?',
    desc:    'Launch your control center, cut fuel and delay losses, and make every dispatch decision with measurable confidence — starting today.',
    primary: 'Start 14-Day Trial',
    ghost:   'Book Live Demo',
    chips:   ['Fast onboarding — live in 1 day', 'Dedicated support team', 'No long-term lock-in'],
  },
  mf: {
    badge:   'Free Consultation • AMFI Registered',
    title:   'Ready to Grow Your Wealth',
    accent:  'with Smart Investments?',
    desc:    'Start your SIP journey with Free Consultation • AMFI Registered support and ARN No: 359231 — zero commission, expert guidance, and transparent returns. As little as ₹1,000/month.',
    primary: 'Start Investing Now',
    ghost:   'Get Free Consultation',
    chips:   ['Free Consultation • AMFI Registered', 'ARN No: 359231', 'Zero Commission', '₹1,000/month minimum SIP'],
  },
};

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="cta-root">

      <!-- Animated background -->
      <div class="cta-bg" aria-hidden="true">
        <div class="cta-orb cta-orb-1"></div>
        <div class="cta-orb cta-orb-2"></div>
        <div class="cta-orb cta-orb-3"></div>
        <div class="cta-grid"></div>
      </div>

      <!-- Floating particles -->
      <div class="particles" aria-hidden="true">
        <span *ngFor="let p of particles" class="particle"
          [style.left]="p.x + '%'"
          [style.top]="p.y + '%'"
          [style.animation-delay]="p.delay + 's'"
          [style.width.px]="p.size"
          [style.height.px]="p.size">
        </span>
      </div>

      <div class="cta-shell">

        <!-- Badge -->
        <div class="cta-badge">
          <span class="badge-dot"></span>
          {{ cfg.badge }}
        </div>

        <!-- Heading -->
        <h2 class="cta-title">
          {{ cfg.title }}
          <span class="cta-accent">{{ cfg.accent }}</span>
        </h2>

        <p class="cta-desc">{{ cfg.desc }}</p>

        <!-- Buttons -->
        <div class="cta-actions">
          <button type="button" class="btn-primary-cta" (click)="nav.openModalFor(product)">
            {{ cfg.primary }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button type="button" class="btn-ghost-cta" (click)="nav.openModalFor(product)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            {{ cfg.ghost }}
          </button>
        </div>

        <!-- Trust chips -->
        <div class="cta-trust">
          <div class="trust-chip" *ngFor="let chip of cfg.chips">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="#22c55e" stroke-width="2.5" stroke-linecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            {{ chip }}
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    /* ─── Root ─────────────────────────────────────────── */
    .cta-root {
      position: relative;
      padding: 110px 24px 120px;
      overflow: hidden;
      isolation: isolate;
      background: #040810;
    }

    /* ─── Background ─────────────────────────────────────  */
    .cta-bg { position: absolute; inset: 0; z-index: 0; }

    .cta-orb {
      position: absolute; border-radius: 50%;
      filter: blur(100px); pointer-events: none;
    }
    .cta-orb-1 {
      width: 700px; height: 700px;
      background: radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 65%);
      top: -200px; left: 50%;
      transform: translateX(-50%);
      animation: ctaOrb1 16s ease-in-out infinite;
    }
    .cta-orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%);
      bottom: -100px; left: -80px;
      animation: ctaOrb2 20s ease-in-out infinite;
    }
    .cta-orb-3 {
      width: 350px; height: 350px;
      background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%);
      bottom: -80px; right: -60px;
      animation: ctaOrb3 18s ease-in-out infinite;
    }
    @keyframes ctaOrb1 { 0%,100%{transform:translateX(-50%) scale(1)} 50%{transform:translateX(-50%) scale(1.12)} }
    @keyframes ctaOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,-50px)} }
    @keyframes ctaOrb3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,40px)} }

    .cta-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 80%);
    }

    /* ─── Particles ──────────────────────────────────────  */
    .particles { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
    .particle {
      position: absolute; border-radius: 50%;
      background: var(--brand-cyan);
      opacity: 0;
      animation: particleFloat 6s ease-in-out infinite;
    }
    @keyframes particleFloat {
      0%   { opacity: 0; transform: translateY(0) scale(0); }
      20%  { opacity: 0.6; }
      80%  { opacity: 0.2; }
      100% { opacity: 0; transform: translateY(-80px) scale(1.5); }
    }

    /* ─── Shell ──────────────────────────────────────────  */
    .cta-shell {
      position: relative; z-index: 2;
      max-width: 760px; margin: 0 auto;
      text-align: center;
    }

    /* ─── Badge ──────────────────────────────────────────  */
    .cta-badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 18px; border-radius: 999px;
      border: 1px solid rgba(0,212,255,0.22);
      background: rgba(0,212,255,0.07);
      color: var(--brand-cyan);
      font-size: 12px; font-weight: 600;
      margin-bottom: 28px;
      animation: badgePop 0.6s ease both;
    }
    @keyframes badgePop {
      from { opacity:0; transform:scale(0.85) translateY(10px); }
      to   { opacity:1; transform:none; }
    }
    .badge-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 3px rgba(34,197,94,0.25);
      animation: badgeDotPulse 1.8s ease-in-out infinite;
    }
    @keyframes badgeDotPulse {
      0%,100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.25); }
      50%      { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
    }

    /* ─── Title ──────────────────────────────────────────  */
    .cta-title {
      font-family: var(--font-display);
      font-size: clamp(2.2rem, 5.5vw, 4rem);
      font-weight: 900; letter-spacing: -0.04em;
      color: var(--text-primary); line-height: 1.06;
      margin: 0 0 20px;
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      animation: titleReveal 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both;
    }
    @keyframes titleReveal {
      from { opacity:0; transform:translateY(24px); }
      to   { opacity:1; transform:none; }
    }
    .cta-accent {
      background: linear-gradient(120deg, var(--brand-cyan) 0%, #818cf8 50%, var(--brand-indigo) 100%);
      background-size: 200%;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      animation: gradShift 4s linear infinite;
    }
    @keyframes gradShift {
      0%   { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    .cta-desc {
      color: rgba(148,163,184,0.9);
      font-size: 1.05rem; line-height: 1.72;
      margin: 0 0 36px; max-width: 620px; margin-left: auto; margin-right: auto;
      animation: titleReveal 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both;
    }

    /* ─── Buttons ────────────────────────────────────────  */
    .cta-actions {
      display: flex; align-items: center; justify-content: center;
      flex-wrap: wrap; gap: 14px; margin-bottom: 28px;
      animation: titleReveal 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both;
    }

    .btn-primary-cta {
      display: inline-flex; align-items: center; gap: 10px;
      height: 54px; padding: 0 32px; border-radius: 14px;
      border: none;
      background: linear-gradient(135deg, var(--brand-cyan) 0%, var(--brand-indigo) 100%);
      color: #fff; font-family: var(--font-display);
      font-size: 15px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 32px rgba(0,212,255,0.3);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      position: relative; overflow: hidden;
    }
    .btn-primary-cta::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
      opacity: 0; transition: opacity 0.25s ease;
    }
    .btn-primary-cta:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 16px 48px rgba(0,212,255,0.4);
    }
    .btn-primary-cta:hover::before { opacity: 1; }
    .btn-primary-cta svg { transition: transform 0.2s ease; }
    .btn-primary-cta:hover svg { transform: translateX(4px); }

    .btn-ghost-cta {
      display: inline-flex; align-items: center; gap: 9px;
      height: 54px; padding: 0 28px; border-radius: 14px;
      border: 1px solid rgba(148,163,184,0.2);
      background: rgba(255,255,255,0.04);
      color: var(--text-secondary); font-family: var(--font-display);
      font-size: 15px; font-weight: 600; cursor: pointer;
      backdrop-filter: blur(8px);
      transition: all 0.25s ease;
    }
    .btn-ghost-cta:hover {
      border-color: rgba(0,212,255,0.3); color: var(--brand-cyan);
      background: rgba(0,212,255,0.06); transform: translateY(-2px);
    }

    /* ─── Trust chips ────────────────────────────────────  */
    .cta-trust {
      display: flex; align-items: center; justify-content: center;
      flex-wrap: wrap; gap: 8px 20px;
      animation: titleReveal 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s both;
    }
    .trust-chip {
      display: flex; align-items: center; gap: 6px;
      font-size: 12.5px; font-weight: 500;
      color: var(--text-muted);
    }

    /* ─── Responsive ─────────────────────────────────────  */
    @media (max-width: 600px) {
      .cta-root { padding: 80px 16px 88px; }
      .btn-primary-cta, .btn-ghost-cta { width: 100%; justify-content: center; }
      .cta-actions { flex-direction: column; }
    }
  `],
})
export class CtaSectionComponent {
  @Input() product: 'gps' | 'mf' = 'gps';
  nav = inject(NavService);

  get cfg(): CtaConfig {
    return CTA_CONFIGS[this.product] ?? CTA_CONFIGS['gps'];
  }

  particles = Array.from({ length: 14 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 2,
    delay: (i * 0.4) % 6,
  }));
}
