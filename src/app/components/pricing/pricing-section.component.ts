import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('pricingStagger', [
      transition(':enter', [
        query('.plan-card', [
          style({ opacity: 0, transform: 'translateY(60px) scale(0.9)' }),
          stagger(150, [
            animate('0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              style({ opacity: 1, transform: 'translateY(0) scale(1)' })
            )
          ])
        ], { optional: true })
      ])
    ]),
    trigger('priceCounter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),
    trigger('glowPulse', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s ease-in-out',
          style({ opacity: 1 })
        )
      ]),
    ])
  ],
  template: `
    <section class="pricing-section" @pricingStagger>
      <div class="container">
        <div class="section-header">
          <span class="section-eyebrow">Pricing</span>
          <h2 class="section-title">Plans That Scale With Your <span class="gradient-text">Fleet</span></h2>
          <p class="section-sub">No hidden fees. Cancel anytime. Start with a 14-day free trial.</p>
          <div class="toggle-row">
            <span [class.active]="!isAnnual">Monthly</span>
            <button class="toggle-btn" (click)="isAnnual = !isAnnual" [class.on]="isAnnual">
              <span class="toggle-thumb"></span>
            </button>
            <span [class.active]="isAnnual">Annual <em class="save-badge">Save 10%</em></span>
          </div>
        </div>

        <div class="plans-grid">
          <div *ngFor="let plan of plans; let i = index"
               class="plan-card"
               [class.popular]="plan.popular"
               [style.animation-delay]="(i * 0.15) + 's'">
            <div *ngIf="plan.popular" class="popular-badge">
              <span class="badge-glow"></span>
              Recommended
            </div>
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-desc">{{ plan.desc }}</div>

            <div class="plan-price" @priceCounter>
              <span *ngIf="plan.price > 0" class="currency">₹</span>
              <span *ngIf="plan.price > 0" class="amount">{{ getPrice(plan.price) }}</span>
              <span *ngIf="plan.price === 0" class="amount">Custom</span>
              <span *ngIf="plan.price > 0" class="period">/month</span>
              <span *ngIf="plan.price === 0" class="period">Contact us</span>
            </div>

            <ul class="feature-list">
              <li *ngFor="let f of plan.features; let j = index"
                  [style.animation-delay]="(i * 0.15 + j * 0.05) + 's'">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="rgba(0,212,255,0.15)"/>
                  <path d="M5 8l2 2 4-4" stroke="#00D4FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ f }}
              </li>
            </ul>

            <button type="button" class="plan-cta" [class.primary]="plan.popular" (click)="openModal.emit()">
              <span class="btn-text">{{ plan.price === 0 ? 'Contact Sales' : 'Choose Plan' }}</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .pricing-section {
      background: var(--bg-surface);
      padding: 100px 0;
      position: relative;
      overflow: hidden;
    }

    .pricing-section::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 30% 50%, rgba(0,212,255,0.03) 0%, transparent 50%),
                  radial-gradient(circle at 70% 50%, rgba(99,102,241,0.03) 0%, transparent 50%);
      animation: bgFloat 20s ease-in-out infinite;
    }

    @keyframes bgFloat {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(-2%, 2%) rotate(1deg); }
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .section-eyebrow {
      display: inline-block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--brand-cyan);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: 12px;
      animation: fadeIn 0.6s ease-out;
    }

    .section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      color: var(--text-primary);
      margin: 12px 0;
      animation: fadeUp 0.8s 0.1s ease-out both;
    }

    .gradient-text {
      background: linear-gradient(120deg, var(--brand-cyan), var(--brand-indigo));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .section-sub {
      color: var(--text-secondary);
      font-size: 1.1rem;
      animation: fadeUp 0.8s 0.2s ease-out both;
    }

    .toggle-row {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: center;
      margin-top: 24px;
      color: var(--text-secondary);
      font-size: 0.95rem;
      animation: fadeUp 0.8s 0.3s ease-out both;
    }

    .toggle-row span.active {
      color: var(--text-primary);
      font-weight: 600;
    }

    .toggle-btn {
      width: 48px;
      height: 26px;
      border-radius: 99px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      cursor: pointer;
      position: relative;
      transition: background 0.3s;
    }

    .toggle-btn.on {
      background: var(--brand-cyan);
    }

    .toggle-thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .toggle-btn.on .toggle-thumb {
      transform: translateX(22px);
    }

    .save-badge {
      font-style: normal;
      background: rgba(16,185,129,0.15);
      color: #10B981;
      border-radius: 99px;
      padding: 2px 8px;
      font-size: 0.78rem;
      margin-left: 4px;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      align-items: start;
    }

    .plan-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 36px;
      position: relative;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      animation: cardEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .plan-card:nth-child(1) { animation-delay: 0.1s; }
    .plan-card:nth-child(2) { animation-delay: 0.25s; }
    .plan-card:nth-child(3) { animation-delay: 0.4s; }

    @keyframes cardEnter {
      from { opacity: 0; transform: translateY(60px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .plan-card:hover {
      transform: translateY(-8px);
      border-color: var(--brand-cyan);
      box-shadow: 0 20px 60px rgba(0, 212, 255, 0.15);
    }

    .plan-card.popular {
      border-color: var(--brand-cyan);
      background: linear-gradient(160deg, #0a1929 0%, var(--bg-card) 100%);
      transform: scale(1.02);
    }

    .plan-card.popular:hover {
      transform: scale(1.02) translateY(-8px);
    }

    .popular-badge {
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--brand-cyan);
      color: #000;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 6px 20px;
      border-radius: 99px;
      white-space: nowrap;
      overflow: hidden;
    }

    .badge-glow {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: badgeShine 3s ease-in-out infinite;
    }

    @keyframes badgeShine {
      0% { left: -100%; }
      50%, 100% { left: 100%; }
    }

    .plan-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
      animation: fadeUp 0.6s 0.2s ease-out both;
    }

    .plan-desc {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 28px;
      min-height: 44px;
      animation: fadeUp 0.6s 0.3s ease-out both;
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 28px;
      animation: fadeUp 0.6s 0.4s ease-out both;
    }

    .currency {
      color: var(--brand-cyan);
      font-size: 1.5rem;
      font-weight: 700;
    }

    .amount {
      font-size: 3.5rem;
      font-weight: 800;
      color: var(--text-primary);
      font-family: 'JetBrains Mono', monospace;
      background: linear-gradient(135deg, #fff 0%, var(--brand-cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .period {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0 0 32px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .feature-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      opacity: 0;
      animation: fadeIn 0.5s ease-out forwards;
    }

    .feature-list li:nth-child(1) { animation-delay: 0.5s; }
    .feature-list li:nth-child(2) { animation-delay: 0.55s; }
    .feature-list li:nth-child(3) { animation-delay: 0.6s; }
    .feature-list li:nth-child(4) { animation-delay: 0.65s; }
    .feature-list li:nth-child(5) { animation-delay: 0.7s; }
    .feature-list li:nth-child(6) { animation-delay: 0.75s; }
    .feature-list li:nth-child(7) { animation-delay: 0.8s; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .feature-list svg {
      flex-shrink: 0;
      transform: scale(0);
      animation: iconPop 0.4s 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes iconPop {
      to { transform: scale(1); }
    }

    .plan-cta {
      width: 100%;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--border-subtle);
      background: transparent;
      color: var(--text-secondary);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      opacity: 0;
      animation: fadeUp 0.6s 0.85s ease-out both;
    }

    .btn-arrow {
      transition: transform 0.3s ease;
      display: inline-block;
    }

    .plan-cta:hover {
      border-color: var(--brand-cyan);
      color: var(--brand-cyan);
    }

    .plan-cta:hover .btn-arrow {
      transform: translateX(4px);
    }

    .plan-cta.primary {
      background: linear-gradient(135deg, var(--brand-cyan) 0%, #0EA5E9 100%);
      border-color: var(--brand-cyan);
      color: #000;
      box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
    }

    .plan-cta.primary:hover {
      background: linear-gradient(135deg, #33ddff 0%, #38bdf8 100%);
      box-shadow: 0 8px 30px rgba(0, 212, 255, 0.5);
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .plan-card.popular {
        transform: none;
      }
      .plan-card.popular:hover {
        transform: translateY(-8px);
      }
      .amount {
        font-size: 2.5rem;
      }
    }
  `]
})
export class PricingSectionComponent implements OnInit {
  @Output() openModal = new EventEmitter<void>();
  isAnnual = false;

  ngOnInit(): void {}

  plans = [
    {
      name: 'Starter',
      price: 499,
      desc: 'Basic tracking features for small fleets.',
      popular: false,
      features: [
        'Up to 10 vehicles',
        'Live GPS tracking',
        'Basic alerts (overspeed, idle)',
        'Daily reports',
        'Mobile app access'
      ]
    },
    {
      name: 'Professional',
      price: 999,
      desc: 'Tracking + analytics + alerts for growing teams.',
      popular: true,
      features: [
        'Up to 50 vehicles',
        'Everything in Starter',
        'Advanced analytics',
        'Real-time alerts',
        'Driver behavior scoring',
        'Unlimited geofences',
        'Priority support'
      ]
    },
    {
      name: 'Enterprise',
      price: 0,
      desc: 'Full integration + dedicated support for large operations.',
      popular: false,
      features: [
        'Unlimited vehicles',
        'Custom integrations & API',
        'Dedicated success manager',
        '24x7 priority support',
        'SLA-backed uptime',
        'Advanced analytics workspace'
      ]
    }
  ];

  getPrice(base: number): number {
    if (base === 0) return 0;
    return this.isAnnual ? Math.round(base * 0.9) : base;
  }
}
