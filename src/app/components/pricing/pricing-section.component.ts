import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="ps-root">
      <!-- Background grid -->
      <div class="ps-grid" aria-hidden="true"></div>
      <div class="ps-orb ps-orb-1" aria-hidden="true"></div>
      <div class="ps-orb ps-orb-2" aria-hidden="true"></div>

      <div class="ps-container">

        <!-- Header -->
        <div class="ps-header">
          <span class="ps-eyebrow">
            <span class="ps-eyebrow-dot"></span>
            GPS Pricing
          </span>
          <h2 class="ps-title">Plans That Scale With Your <span class="ps-accent">Fleet</span></h2>
          <p class="ps-sub">No hidden fees. Cancel anytime. Start with a 14-day free trial.</p>
        </div>

        <!-- Cards -->
        <div class="ps-grid-cards">

          <!-- Starter -->
          <div class="ps-card">
            <div class="ps-card-top">
              <div class="ps-tag">Starter</div>
              <p class="ps-desc">Basic tracking for small fleets.</p>
            </div>
            <div class="ps-price-wrap">
              <span class="ps-currency">₹</span>
              <span class="ps-amount">499</span>
            </div>
            <div class="ps-divider"></div>
            <ul class="ps-features">
              <li *ngFor="let f of starterFeatures">
                <span class="ps-check">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#00D4FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                {{ f }}
              </li>
            </ul>
            <button type="button" class="ps-btn ps-btn-ghost" (click)="nav.openModalFor('gps')">
              Choose Plan
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          <!-- Professional -->
          <div class="ps-card ps-card-popular">
            <div class="ps-popular-badge">
              <span class="ps-badge-shine"></span>
              ★ Recommended
            </div>
            <div class="ps-card-top">
              <div class="ps-tag ps-tag-pro">Professional</div>
              <p class="ps-desc">Full tracking suite for growing fleets.</p>
            </div>
            <div class="ps-price-wrap">
              <span class="ps-currency ps-currency-pro">₹</span>
              <span class="ps-amount ps-amount-pro">999</span>
            </div>
            <div class="ps-divider ps-divider-pro"></div>
            <ul class="ps-features">
              <li *ngFor="let f of proFeatures">
                <span class="ps-check ps-check-pro">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#00D4FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                {{ f }}
              </li>
            </ul>
            <button type="button" class="ps-btn ps-btn-primary" (click)="nav.openModalFor('gps')">
              Get Started
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          <!-- Enterprise -->
          <div class="ps-card">
            <div class="ps-card-top">
              <div class="ps-tag">Enterprise</div>
              <p class="ps-desc">Full integration for large operations.</p>
            </div>
            <div class="ps-price-wrap">
              <span class="ps-amount ps-amount-custom">Custom</span>
            </div>
            <div class="ps-divider"></div>
            <ul class="ps-features">
              <li *ngFor="let f of enterpriseFeatures">
                <span class="ps-check">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#00D4FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                {{ f }}
              </li>
            </ul>
            <button type="button" class="ps-btn ps-btn-ghost" (click)="nav.openModalFor('gps')">
              Contact Sales
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ── Root ─────────────────────────────── */
    .ps-root {
      position: relative;
      padding: 96px 24px 104px;
      background: linear-gradient(180deg, #050C18 0%, #060E1C 50%, #040A14 100%);
      overflow: hidden;
      isolation: isolate;
    }

    /* ── Background effects ─────────────── */
    .ps-grid {
      position: absolute; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 80%);
    }
    .ps-orb {
      position: absolute; border-radius: 50%;
      filter: blur(120px); pointer-events: none; z-index: 0;
    }
    .ps-orb-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 65%);
      top: -150px; left: -100px;
      animation: orbFloat1 18s ease-in-out infinite;
    }
    .ps-orb-2 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%);
      bottom: -100px; right: -80px;
      animation: orbFloat2 22s ease-in-out infinite;
    }
    @keyframes orbFloat1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
    @keyframes orbFloat2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,-40px)} }

    /* ── Container ──────────────────────── */
    .ps-container {
      max-width: 1180px; margin: 0 auto;
      position: relative; z-index: 1;
    }

    /* ── Header ─────────────────────────── */
    .ps-header { text-align: center; margin-bottom: 64px; }

    .ps-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.18em;
      color: #00D4FF; margin-bottom: 16px;
    }
    .ps-eyebrow-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #00D4FF; box-shadow: 0 0 8px #00D4FF;
      animation: dotPulse 2s ease-in-out infinite;
    }
    @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }

    .ps-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(1.9rem, 4vw, 3rem);
      font-weight: 900; letter-spacing: -0.03em;
      color: #F0F6FF; margin: 0 0 14px; line-height: 1.1;
    }
    .ps-accent {
      background: linear-gradient(120deg, #00D4FF, #6366F1);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .ps-sub {
      font-size: clamp(0.9rem, 1.3vw, 1rem);
      color: rgba(255,255,255,0.45); margin: 0;
    }

    /* ── Cards grid ─────────────────────── */
    .ps-grid-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      align-items: stretch;
    }

    /* ── Card base ──────────────────────── */
    .ps-card {
      position: relative;
      background: rgba(255,255,255,0.035);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 36px 32px 32px;
      display: flex; flex-direction: column;
      transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                  border-color 0.35s ease,
                  box-shadow 0.35s ease;
      animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
    }
    .ps-card:nth-child(1) { animation-delay: 0.05s; }
    .ps-card:nth-child(2) { animation-delay: 0.15s; }
    .ps-card:nth-child(3) { animation-delay: 0.25s; }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .ps-card:hover {
      transform: translateY(-10px);
      border-color: rgba(0,212,255,0.3);
      box-shadow: 0 24px 64px rgba(0,212,255,0.12);
    }

    /* ── Popular card ───────────────────── */
    .ps-card-popular {
      background: linear-gradient(160deg, rgba(0,212,255,0.07) 0%, rgba(10,20,40,0.95) 100%);
      border-color: rgba(0,212,255,0.35);
      box-shadow: 0 0 40px rgba(0,212,255,0.08), inset 0 0 32px rgba(0,212,255,0.04);
    }
    .ps-card-popular:hover {
      transform: translateY(-10px);
      border-color: rgba(0,212,255,0.6);
      box-shadow: 0 28px 72px rgba(0,212,255,0.2);
    }

    /* ── Popular badge ──────────────────── */
    .ps-popular-badge {
      position: absolute; top: -14px; left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #00D4FF, #0EA5E9);
      color: #020C1A;
      font-size: 11px; font-weight: 800;
      letter-spacing: 0.06em;
      padding: 6px 20px; border-radius: 999px;
      white-space: nowrap; overflow: hidden;
    }
    .ps-badge-shine {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
      animation: badgeShine 2.5s ease-in-out infinite;
    }
    @keyframes badgeShine { 0%{transform:translateX(-100%)} 60%,100%{transform:translateX(100%)} }

    /* ── Card top section ───────────────── */
    .ps-card-top { margin-bottom: 24px; }

    .ps-tag {
      display: inline-block;
      font-size: 11px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.14em;
      color: rgba(255,255,255,0.5);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px; padding: 4px 12px;
      margin-bottom: 10px;
    }
    .ps-tag-pro {
      color: #00D4FF;
      border-color: rgba(0,212,255,0.3);
      background: rgba(0,212,255,0.06);
    }
    .ps-desc {
      font-size: 13.5px; color: rgba(255,255,255,0.45); margin: 0; line-height: 1.55;
    }

    /* ── Price ──────────────────────────── */
    .ps-price-wrap {
      display: flex; align-items: baseline; gap: 3px;
      margin-bottom: 28px;
    }
    .ps-currency {
      font-size: 1.5rem; font-weight: 800;
      color: rgba(255,255,255,0.6);
      font-family: 'Outfit', sans-serif;
    }
    .ps-currency-pro { color: #00D4FF; }

    .ps-amount {
      font-family: 'Outfit', sans-serif;
      font-size: 3.8rem; font-weight: 900;
      line-height: 1;
      background: linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.04em;
    }
    .ps-amount-pro {
      background: linear-gradient(135deg, #00D4FF 0%, #38BDF8 50%, #818CF8 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .ps-amount-custom {
      font-size: 2.6rem;
      background: linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Divider ────────────────────────── */
    .ps-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin-bottom: 24px;
    }
    .ps-divider-pro { background: rgba(0,212,255,0.2); }

    /* ── Features ───────────────────────── */
    .ps-features {
      list-style: none; padding: 0; margin: 0 0 32px;
      display: flex; flex-direction: column; gap: 12px;
      flex: 1;
    }
    .ps-features li {
      display: flex; align-items: center; gap: 10px;
      font-size: 13.5px; color: rgba(255,255,255,0.65);
      font-weight: 500;
    }
    .ps-check {
      width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
      background: rgba(0,212,255,0.1);
      border: 1px solid rgba(0,212,255,0.2);
      display: flex; align-items: center; justify-content: center;
    }
    .ps-check-pro {
      background: rgba(0,212,255,0.15);
      border-color: rgba(0,212,255,0.35);
    }

    /* ── Buttons ────────────────────────── */
    .ps-btn {
      width: 100%; height: 50px; border-radius: 14px;
      font-size: 14px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
      font-family: 'Outfit', sans-serif;
    }
    .ps-btn svg { transition: transform 0.3s ease; }
    .ps-btn:hover svg { transform: translateX(4px); }

    .ps-btn-ghost {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.6);
    }
    .ps-btn-ghost:hover {
      border-color: rgba(0,212,255,0.4);
      color: #00D4FF;
      background: rgba(0,212,255,0.05);
    }

    .ps-btn-primary {
      background: linear-gradient(135deg, #00D4FF 0%, #0EA5E9 50%, #6366F1 100%);
      border: none; color: #020C1A;
      box-shadow: 0 6px 24px rgba(0,212,255,0.28);
    }
    .ps-btn-primary:hover {
      box-shadow: 0 12px 36px rgba(0,212,255,0.45);
      transform: translateY(-2px);
    }

    /* ── Mobile ─────────────────────────── */
    @media (max-width: 900px) {
      .ps-grid-cards { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; }
    }
    @media (max-width: 480px) {
      .ps-root { padding: 64px 16px 72px; }
      .ps-amount { font-size: 3rem; }
    }
  `]
})
export class PricingSectionComponent {
  nav = inject(NavService);

  starterFeatures = [
    'Mobile App Access',
    '90 Days Subscription',
    'Live GPS Tracking',
    'Alerts',
    'Daily Reports',
    'Geo Fence',
    'Playback Route',
  ];

  proFeatures = [
    'Mobile App Access',
    '90 Days Subscription',
    'Live GPS Tracking',
    'Alerts',
    'Daily Reports',
    'Geo Fence',
    'Playback Route',
    'Remote Engine Control',
    'Business Summary',
    'Driver Behaviour Analytics',
    'Expense & Profit Summary',
  ];

  enterpriseFeatures = [
    'Unlimited Vehicles',
    'Custom Integrations & API',
    'Dedicated Success Manager',
    '24×7 Priority Support',
    'SLA-backed Uptime',
    'Advanced Analytics Workspace',
  ];
}
