import {
  Component,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../../services/nav.service';

type TabKey = 'sip' | 'goal';

interface PricingPlan {
  id?: number;
  name: string;
  sip: string;
  sipLabel: string;
  badge?: string;
  highlight?: boolean;
  tag: string;
  tagColor: string;
  iconGrad: [string, string];
  features: string[];
  cta: string;
}

@Component({
  selector: 'app-mutual-fund-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mfp-root" id="mf-pricing">

      <!-- Background -->
      <div class="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div class="bg-orb bg-orb-2" aria-hidden="true"></div>

      <!-- Header -->
      <div class="mfp-header" [class.visible]="visible">
        <div class="eyebrow">
          <span class="eyebrow-dot"></span>
          Mutual Fund Plans
        </div>
        <h2 class="mfp-title">
          Choose Your
          <span class="title-accent">Investment Plan</span>
        </h2>
        <p class="mfp-sub">Start small, grow big — pick a plan that fits your financial goal.</p>
      </div>

      <!-- Tab switch -->
      <div class="tab-bar" [class.visible]="visible">
        <button
          class="tab-btn"
          [class.active]="activeTab === 'sip'"
          (click)="setTab('sip')"
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M23 6l-9.5 9.5-5-5L1 18"/>
            <path d="M17 6h6v6"/>
          </svg>
          SIP‑Based Plans
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'goal'"
          (click)="setTab('goal')"
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          Goal‑Based Plans
        </button>
      </div>

      <!-- Plan cards -->
      <div class="plans-grid" [class.visible]="visible">
        <div
          *ngFor="let plan of activePlans; let i = index"
          class="plan-card"
          [class.highlighted]="plan.highlight"
          [class.active]="selectedPlanId === (plan.id || i)"
          [style.animation-delay]="(i * 80) + 'ms'"
          (click)="selectPlan(plan, i)"
          role="button"
          [attr.aria-pressed]="selectedPlanId === (plan.id || i)"
        >
          <!-- Popular badge -->
          <div *ngIf="plan.badge" class="popular-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {{ plan.badge }}
          </div>

          <!-- Icon -->
          <div class="plan-icon"
            [style.background]="'linear-gradient(135deg,' + plan.iconGrad[0] + ',' + plan.iconGrad[1] + ')'">
          </div>

          <!-- Tag -->
          <span class="plan-tag" [style.color]="plan.tagColor"
            [style.border-color]="plan.tagColor + '44'"
            [style.background]="plan.tagColor + '11'">
            {{ plan.tag }}
          </span>

          <!-- Plan name -->
          <h3 class="plan-name">{{ plan.name }}</h3>

          <!-- SIP amount -->
          <div class="sip-block">
            <span class="sip-from">SIP from</span>
            <div class="sip-amount">{{ plan.sip }}</div>
            <span class="sip-period">{{ plan.sipLabel }}</span>
          </div>

          <!-- Features -->
          <ul class="plan-features">
            <li *ngFor="let f of plan.features">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              {{ f }}
            </li>
          </ul>

          <!-- CTA -->
          <button class="plan-cta" [class.cta-primary]="plan.highlight" type="button" (click)="nav.openModalFor('mf')">
            {{ plan.cta }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Fee transparency strip -->
      <div class="fee-strip" [class.visible]="visible">
        <p class="fee-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Transparent Fee Policy
        </p>
        <div class="fee-items">
          <div class="fee-item" *ngFor="let f of feeItems">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span>{{ f }}</span>
          </div>
        </div>
      </div>

    </section>
  `,
  styles: [`
    /* ─── Root ─────────────────────────────────────────── */
    .mfp-root {
      position: relative;
      padding: 100px 20px 80px;
      background: linear-gradient(180deg, var(--bg-base) 0%, #060c18 100%);
      overflow: hidden;
      isolation: isolate;
    }

    /* ─── Background orbs ───────────────────────────────── */
    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(110px);
      pointer-events: none;
      z-index: 0;
    }
    .bg-orb-1 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%);
      top: -80px; left: -100px;
      animation: orbA 20s ease-in-out infinite;
    }
    .bg-orb-2 {
      width: 420px; height: 420px;
      background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
      bottom: -60px; right: -80px;
      animation: orbB 24s ease-in-out infinite;
    }
    @keyframes orbA {
      0%,100% { transform: translate(0,0); }
      50%      { transform: translate(60px,40px); }
    }
    @keyframes orbB {
      0%,100% { transform: translate(0,0); }
      50%      { transform: translate(-40px,60px); }
    }

    /* ─── Header ────────────────────────────────────────── */
    .mfp-header {
      position: relative; z-index: 2;
      text-align: center;
      max-width: 620px;
      margin: 0 auto 40px;
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .mfp-header.visible { opacity: 1; transform: none; }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 16px;
      border-radius: 999px;
      border: 1px solid rgba(0,212,255,0.2);
      background: rgba(0,212,255,0.07);
      color: var(--brand-cyan);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      margin-bottom: 20px;
    }
    .eyebrow-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--brand-cyan);
      animation: dotPulse 2s ease-in-out infinite;
    }
    @keyframes dotPulse {
      0%,100% { box-shadow: 0 0 0 3px rgba(0,212,255,0.2); }
      50%      { box-shadow: 0 0 0 7px rgba(0,212,255,0.04); }
    }
    .mfp-title {
      font-family: var(--font-display);
      font-size: clamp(1.9rem, 4vw, 3.2rem);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: var(--text-primary);
      margin: 0 0 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .title-accent {
      background: linear-gradient(120deg, var(--brand-cyan), var(--brand-indigo));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .mfp-sub {
      color: var(--text-secondary);
      font-size: 0.98rem;
      line-height: 1.6;
      margin: 0;
    }

    /* ─── Tab bar ───────────────────────────────────────── */
    .tab-bar {
      position: relative; z-index: 2;
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 48px;
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s;
    }
    .tab-bar.visible { opacity: 1; transform: none; }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 10px 22px;
      border-radius: 999px;
      border: 1px solid var(--border-subtle);
      background: rgba(255,255,255,0.03);
      color: var(--text-secondary);
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .tab-btn:hover {
      border-color: rgba(0,212,255,0.3);
      color: var(--text-primary);
    }
    .tab-btn.active {
      background: linear-gradient(135deg, var(--brand-cyan), var(--brand-indigo));
      border-color: transparent;
      color: #fff;
      box-shadow: 0 4px 20px rgba(0,212,255,0.25);
    }

    /* ─── Plans grid ────────────────────────────────────── */
    .plans-grid {
      position: relative; z-index: 2;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      max-width: 1100px;
      margin: 0 auto 48px;
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s;
    }
    .plans-grid.visible { opacity: 1; transform: none; }

    /* ─── Plan card ─────────────────────────────────────── */
    .plan-card {
      position: relative;
      padding: 32px 26px 28px;
      border-radius: 20px;
      border: 1px solid var(--border-subtle);
      background: var(--bg-card);
      display: flex;
      flex-direction: column;
      gap: 0;
      overflow: hidden;
      transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), 
                  box-shadow 0.35s ease, 
                  border-color 0.35s ease,
                  background 0.35s ease;
      animation: cardFadeUp 0.5s ease both;
      cursor: pointer;
    }
    @keyframes cardFadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: none; }
    }
    .plan-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.3);
      border-color: rgba(0,212,255,0.2);
    }
    .plan-card.active {
      border-color: rgba(0,212,255,0.6);
      background: linear-gradient(160deg, rgba(0,212,255,0.12) 0%, var(--bg-card) 60%);
      box-shadow:
        0 0 0 1px rgba(0,212,255,0.3),
        0 0 32px rgba(0,212,255,0.25),
        0 16px 64px rgba(0,212,255,0.2);
      transform: translateY(-8px) scale(1.02);
    }
    .plan-card.highlighted {
      border-color: rgba(0,212,255,0.4);
      background: linear-gradient(160deg, rgba(0,212,255,0.06) 0%, var(--bg-card) 60%);
      box-shadow:
        0 0 0 1px rgba(0,212,255,0.15),
        0 12px 48px rgba(0,212,255,0.12);
    }
    .plan-card.highlighted:hover {
      box-shadow:
        0 0 0 1px rgba(0,212,255,0.25),
        0 20px 64px rgba(0,212,255,0.2);
    }
    .plan-card.highlighted.active {
      border-color: rgba(0,212,255,0.65);
      background: linear-gradient(160deg, rgba(0,212,255,0.16) 0%, var(--bg-card) 55%);
      box-shadow:
        0 0 0 2px rgba(0,212,255,0.4),
        0 0 40px rgba(0,212,255,0.3),
        0 20px 80px rgba(0,212,255,0.25);
    }

    /* Popular badge */
    .popular-badge {
      position: absolute;
      top: 16px; right: 16px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--brand-cyan), var(--brand-indigo));
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Icon dot */
    .plan-icon {
      width: 44px; height: 44px;
      border-radius: 12px;
      margin-bottom: 16px;
      flex-shrink: 0;
    }

    /* Tag */
    .plan-tag {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 10px;
      width: fit-content;
    }

    /* Name */
    .plan-name {
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      margin: 0 0 20px;
      line-height: 1.2;
    }

    /* SIP block */
    .sip-block {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 18px 0;
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 22px;
    }
    .sip-from {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .sip-amount {
      font-family: var(--font-display);
      font-size: 2.2rem;
      font-weight: 900;
      color: var(--text-primary);
      letter-spacing: -0.04em;
      line-height: 1;
    }
    .plan-card.highlighted .sip-amount {
      background: linear-gradient(120deg, var(--brand-cyan), var(--brand-indigo));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .sip-period {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
    }

    /* Features */
    .plan-features {
      list-style: none;
      padding: 0; margin: 0 0 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }
    .plan-features li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      color: var(--text-secondary);
      font-size: 0.84rem;
      line-height: 1.5;
    }
    .plan-features li svg {
      flex-shrink: 0;
      color: #3B82F6;
      margin-top: 2px;
    }

    /* CTA */
    .plan-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: 46px;
      border-radius: 12px;
      border: 1px solid var(--border-subtle);
      background: rgba(255,255,255,0.04);
      color: var(--text-secondary);
      font-family: var(--font-display);
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .plan-cta:hover {
      border-color: rgba(0,212,255,0.3);
      color: var(--brand-cyan);
      background: rgba(0,212,255,0.06);
    }
    .plan-cta.cta-primary {
      background: linear-gradient(135deg, var(--brand-cyan), var(--brand-indigo));
      border-color: transparent;
      color: #fff;
      box-shadow: 0 4px 20px rgba(0,212,255,0.25);
    }
    .plan-cta.cta-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,212,255,0.35);
    }
    .plan-cta svg { transition: transform 0.2s ease; }
    .plan-cta:hover svg { transform: translateX(4px); }

    /* ─── Fee strip ─────────────────────────────────────── */
    .fee-strip {
      position: relative; z-index: 2;
      max-width: 900px;
      margin: 0 auto;
      padding: 24px 32px;
      border-radius: 16px;
      border: 1px solid rgba(59,130,246,0.18);
      background: rgba(59,130,246,0.05);
      display: flex;
      align-items: center;
      gap: 32px;
      flex-wrap: wrap;
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s;
    }
    .fee-strip.visible { opacity: 1; transform: none; }

    .fee-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      color: #3B82F6;
      white-space: nowrap;
      margin: 0;
      flex-shrink: 0;
    }

    .fee-items {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    .fee-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12.5px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    /* ─── Responsive ────────────────────────────────────── */
    @media (max-width: 1024px) {
      .plans-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .mfp-root { padding: 80px 16px 64px; }
      .plans-grid { grid-template-columns: 1fr; max-width: 400px; }
      .fee-strip { flex-direction: column; align-items: flex-start; gap: 16px; }
      .fee-title { font-size: 12px; }
    }
  `],
})
export class MutualFundPricingComponent implements AfterViewInit, OnDestroy {
  nav = inject(NavService);

  @Output() planSelected = new EventEmitter<{ plan: PricingPlan; planIndex: number; tabKey: TabKey }>();

  activeTab: TabKey = 'sip';
  visible = true;
  selectedPlanId: number | null = 0;
  private obs: IntersectionObserver | null = null;

  readonly sipPlans: PricingPlan[] = [
    {
      id: 0,
      name: 'Starter Plan',
      sip: '₹1000',
      sipLabel: '/ month',
      tag: 'Beginner',
      tagColor: '#3B82F6',
      iconGrad: ['#3B82F6', '#2563EB'],
      features: [
        'SIP starting at ₹1000/month',
        'Curated low-risk debt funds',
        'Monthly portfolio summary',
        'Goal tracker dashboard',
        'Email & SMS alerts',
      ],
      cta: 'Start SIP',
    },
    {
      id: 1,
      name: 'Growth Plan',
      sip: '₹2,000',
      sipLabel: '/ month',
      badge: 'Most Popular',
      highlight: true,
      tag: 'Recommended',
      tagColor: '#00D4FF',
      iconGrad: ['#00D4FF', '#6366F1'],
      features: [
        'SIP starting at ₹2,000/month',
        'Hybrid equity + debt funds',
        'Real-time analytics dashboard',
        'Expert advisor chat access',
        'Auto-rebalancing quarterly',
        'Priority support',
      ],
      cta: 'Start SIP',
    },
    {
      id: 2,
      name: 'Premium Plan',
      sip: '₹5,000+',
      sipLabel: '/ month',
      tag: 'High Growth',
      tagColor: '#A855F7',
      iconGrad: ['#A855F7', '#3B82F6'],
      features: [
        'SIP starting at ₹5,000/month',
        'Direct equity & top-tier funds',
        'Dedicated financial advisor',
        'Weekly performance reports',
        'Tax-loss harvesting insights',
        'Custom portfolio creation',
      ],
      cta: 'Start SIP',
    },
  ];

  readonly goalPlans: PricingPlan[] = [
    {
      id: 3,
      name: 'Short‑Term Goals',
      sip: '₹1,000',
      sipLabel: '/ month',
      tag: '1–3 Years',
      tagColor: '#F59E0B',
      iconGrad: ['#F59E0B', '#EF4444'],
      features: [
        'Low-risk debt & liquid funds',
        'Capital preservation focus',
        'Flexible withdrawal anytime',
        'Goal milestone tracker',
        'Instant redemption on select funds',
      ],
      cta: 'Set Goal',
    },
    {
      id: 4,
      name: 'Balanced Growth',
      sip: '₹2,500',
      sipLabel: '/ month',
      badge: 'Best Value',
      highlight: true,
      tag: '3–7 Years',
      tagColor: '#00D4FF',
      iconGrad: ['#00D4FF', '#3B82F6'],
      features: [
        'Hybrid balanced advantage funds',
        'Moderate risk, steady returns',
        'Automated SIP management',
        'Quarterly advisor review',
        'Tax-saving ELSS options',
        'Smart alerts on market swings',
      ],
      cta: 'Set Goal',
    },
    {
      id: 5,
      name: 'Long‑Term Wealth',
      sip: '₹5,000',
      sipLabel: '/ month',
      tag: '7+ Years',
      tagColor: '#6366F1',
      iconGrad: ['#6366F1', '#A855F7'],
      features: [
        'High-growth equity funds',
        'Wealth compounding strategy',
        'Annual portfolio deep-dive',
        'Dedicated wealth manager',
        'NPS & retirement planning',
        'Estate & succession guidance',
      ],
      cta: 'Set Goal',
    },
  ];

  readonly feeItems: string[] = [
    'Expense Ratio: 0.5%–1.5% (transparent & disclosed)',
    'Zero Entry Load on all funds',
    'Zero Exit Load on most funds*',
    'No hidden charges — ever',
    'Free Consultation • AMFI Registered',
    'ARN No: 359231',
  ];

  get activePlans(): PricingPlan[] {
    return this.activeTab === 'sip' ? this.sipPlans : this.goalPlans;
  }

  setTab(tab: TabKey): void {
    this.activeTab = tab;
    this.selectedPlanId = 0;
  }

  selectPlan(plan: PricingPlan, index: number): void {
    this.selectedPlanId = plan.id ?? index;
    this.planSelected.emit({ plan, planIndex: index, tabKey: this.activeTab });
  }

  ngAfterViewInit(): void {
    setTimeout(() => { this.visible = true; }, 80);

    const el = document.getElementById('mf-pricing');
    if (el) {
      this.obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            this.visible = true;
            this.obs?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      this.obs.observe(el);
    }
  }

  ngOnDestroy(): void {
    this.obs?.disconnect();
  }
}
