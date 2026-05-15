import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-cta-final',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="cta-wrap" id="cta">
      <!-- Animated background -->
      <div class="cta-bg" aria-hidden="true">
        <div class="cta-orb cta-orb-1"></div>
        <div class="cta-orb cta-orb-2"></div>
        <div class="cta-grid"></div>
      </div>

      <div class="container">
        <div class="cta-inner">

          <!-- Badge -->
          <div class="cta-badge">
            <span class="cta-live-dot"></span>
            Live Platform — 248 vehicles being tracked right now
          </div>

          <!-- Headline -->
          <h2 class="cta-title">
            Start Using Smart Tracking
            <span class="cta-gradient-line">Today</span>
          </h2>

          <p class="cta-sub">
            Launch your fleet command center in under 15 minutes. No contracts, no complexity — just real-time intelligence for your business.
          </p>

          <!-- Actions -->
          <div class="cta-actions">
            <button type="button" class="cta-btn-primary" (click)="openModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Get Started Free
            </button>
            <button type="button" class="cta-btn-ghost" (click)="openModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
              </svg>
              Book a Live Demo
            </button>
          </div>

          <!-- Trust pills -->
          <div class="cta-trust">
            <span class="trust-pill" *ngFor="let pill of trustPills">
              <span class="pill-check">✓</span>
              {{ pill }}
            </span>
          </div>

          <!-- Stats row -->
          <div class="cta-stats">
            <div class="cta-stat" *ngFor="let stat of stats">
              <span class="cta-stat-val" [style.color]="stat.color">{{ stat.val }}</span>
              <span class="cta-stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cta-wrap {
      padding: 100px 0 120px;
      position: relative;
      overflow: hidden;
      background: #04070F;
    }

    /* Background */
    .cta-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .cta-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
    }

    .cta-orb-1 {
      width: 600px; height: 600px;
      top: -200px; left: -100px;
      background: radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 65%);
    }

    .cta-orb-2 {
      width: 600px; height: 600px;
      bottom: -200px; right: -100px;
      background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%);
    }

    .cta-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px);
      background-size: 56px 56px;
    }

    /* Inner */
    .cta-inner {
      position: relative;
      z-index: 1;
      text-align: center;
      max-width: 760px;
      margin: 0 auto;
    }

    /* Badge */
    .cta-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 20px;
      background: rgba(0,212,255,0.06);
      border: 1px solid rgba(0,212,255,0.15);
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      color: #00D4FF;
      margin-bottom: 32px;
    }

    .cta-live-dot {
      width: 8px; height: 8px;
      background: #10B981;
      border-radius: 50%;
      display: inline-block;
      position: relative;
    }

    .cta-live-dot::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: rgba(16,185,129,0.25);
      animation: ping 1.5s infinite;
    }

    @keyframes ping {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.5); opacity: 0; }
    }

    /* Title */
    .cta-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(2.2rem, 5vw, 4rem);
      font-weight: 800;
      color: #F0F6FF;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 20px;
    }

    .cta-gradient-line {
      display: block;
      background: linear-gradient(135deg, #00D4FF 0%, #0EA5E9 40%, #6366F1 80%, #8B5CF6 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradient-shift 3s ease infinite;
    }

    @keyframes gradient-shift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .cta-sub {
      font-size: 17px;
      color: #475569;
      line-height: 1.75;
      margin-bottom: 40px;
      max-width: 560px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Actions */
    .cta-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 28px;
    }

    .cta-btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 16px 36px;
      background: linear-gradient(135deg, #00D4FF, #0EA5E9);
      color: #04070F;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 15px;
      border-radius: 14px;
      text-decoration: none;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .cta-btn-primary::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .cta-btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(0,212,255,0.4);
    }

    .cta-btn-primary:hover::after { opacity: 1; }

    .cta-btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 16px 36px;
      background: rgba(255,255,255,0.04);
      color: #94A3B8;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 15px;
      border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .cta-btn-ghost:hover {
      color: #00D4FF;
      border-color: rgba(0,212,255,0.3);
      background: rgba(0,212,255,0.05);
      transform: translateY(-3px);
    }

    /* Trust pills */
    .cta-trust {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 48px;
    }

    .trust-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      background: rgba(12,18,32,0.8);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 999px;
      font-size: 12px;
      color: #64748B;
      font-weight: 500;
    }

    .pill-check {
      color: #10B981;
      font-weight: 700;
    }

    /* Stats */
    .cta-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      flex-wrap: wrap;
    }

    .cta-stat {
      text-align: center;
    }

    .cta-stat-val {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: clamp(1.5rem, 3vw, 2.2rem);
      font-weight: 800;
      line-height: 1;
      margin-bottom: 6px;
    }

    .cta-stat-label {
      font-size: 12px;
      color: #475569;
      font-weight: 500;
    }

    @media (max-width: 640px) {
      .cta-actions { flex-direction: column; align-items: center; }
      .cta-trust { gap: 8px; }
      .cta-stats { gap: 24px; }
    }
  `]
})
export class CtaFinalComponent {
  private nav = inject(NavService);

  openModal(): void {
    this.nav.openModalFor('gps');
  }

  trustPills = [
    'No credit card required',
    'Setup in 15 minutes',
    'Cancel anytime',
    '24/7 support included'
  ];

  stats = [
    { val: '1000+', label: 'Businesses onboarded', color: '#00D4FF' },
    { val: '30%', label: 'Avg cost reduction', color: '#10B981' },
    { val: '99.9%', label: 'Platform uptime', color: '#F59E0B' }
  ];
}
