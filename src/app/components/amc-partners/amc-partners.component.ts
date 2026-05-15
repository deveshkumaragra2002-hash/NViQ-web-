import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { NavService } from '../../services/nav.service';

register();

interface AmcCard {
  name: string;
  abbr: string;
  color: string;
  glow: string;
  categories: string[];
  topScheme: string;
  risk: 'Low' | 'Moderate' | 'High' | 'Very High';
  riskColor: string;
  returns: string;
  minSIP: string;
}

@Component({
  selector: 'app-amc-partners',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="amc-root">
      <div class="amc-bg-orb amc-orb-1" aria-hidden="true"></div>
      <div class="amc-bg-orb amc-orb-2" aria-hidden="true"></div>

      <div class="amc-header">
        <span class="amc-eyebrow">
          <span class="amc-eyebrow-dot"></span>
          AMFI Registered Partners
        </span>
        <h2 class="amc-title">Top AMC Partners</h2>
        <p class="amc-subtitle">
          Invest through India's most trusted Asset Management Companies.
          Handpicked for performance, trust, and growth.
        </p>
      </div>

      <swiper-container
        class="amc-swiper"
        slides-per-view="1.1"
        space-between="20"
        autoplay-delay="2000"
        autoplay-disable-on-interaction="false"
        loop="true"
        grab-cursor="true"
        breakpoints='{"576":{"slidesPerView":2,"spaceBetween":20},"900":{"slidesPerView":3,"spaceBetween":24},"1200":{"slidesPerView":3,"spaceBetween":28}}'
      >
        <swiper-slide *ngFor="let amc of amcs">
          <div class="amc-card" [style.--glow]="amc.glow">
            <div class="amc-card-top">
              <div class="amc-logo" [style.background]="amc.color">
                <span class="amc-logo-text">{{ amc.abbr }}</span>
              </div>
              <div class="amc-name-wrap">
                <span class="amc-name">{{ amc.name }}</span>
                <span class="amc-risk-badge"
                  [style.background]="amc.riskColor + '22'"
                  [style.color]="amc.riskColor"
                  [style.borderColor]="amc.riskColor + '55'">
                  {{ amc.risk }}
                </span>
              </div>
            </div>

            <div class="amc-categories">
              <span *ngFor="let cat of amc.categories" class="amc-cat-chip">{{ cat }}</span>
            </div>

            <div class="amc-scheme-block">
              <span class="amc-scheme-label">Top Scheme</span>
              <span class="amc-scheme-name">{{ amc.topScheme }}</span>
            </div>

            <div class="amc-metrics">
              <div class="amc-metric">
                <span class="amc-metric-val amc-returns">{{ amc.returns }}</span>
                <span class="amc-metric-label">3Y Returns</span>
              </div>
              <div class="amc-metric-divider"></div>
              <div class="amc-metric">
                <span class="amc-metric-val">{{ amc.minSIP }}</span>
                <span class="amc-metric-label">Min SIP</span>
              </div>
            </div>

            <div class="amc-actions">
              <button class="amc-btn amc-btn-primary" (click)="nav.openModalFor('mf')" type="button">
                Start SIP
              </button>
              <button class="amc-btn amc-btn-secondary" (click)="nav.openModalFor('mf')" type="button">
                Explore Funds
              </button>
              <button class="amc-btn amc-btn-ghost" (click)="nav.openModalFor('mf')" type="button">
                Learn More
              </button>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>

      <div class="amc-disclaimer">
        Mutual fund investments are subject to market risks. Past performance is not indicative of future results. AMFI ARN: 359231.
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .amc-root {
      position: relative; overflow: hidden;
      padding: 80px 0 24px;
      background: linear-gradient(180deg, #050A14 0%, #030810 100%);
    }
    .amc-bg-orb {
      position: absolute; border-radius: 50%; filter: blur(130px); pointer-events: none;
    }
    .amc-orb-1 {
      width: 600px; height: 600px; top: -100px; left: -150px;
      background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%);
    }
    .amc-orb-2 {
      width: 500px; height: 500px; bottom: -80px; right: -100px;
      background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%);
    }

    .amc-header {
      text-align: center; padding: 0 24px 48px; position: relative; z-index: 2;
    }
    .amc-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.16em;
      color: #60A5FA; margin-bottom: 16px;
    }
    .amc-eyebrow-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #60A5FA; box-shadow: 0 0 8px #60A5FA;
      animation: pulseDot 2s ease-in-out infinite;
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(0.75); }
    }
    .amc-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 900; letter-spacing: -0.03em;
      color: #fff; margin: 0 0 14px;
    }
    .amc-subtitle {
      font-size: clamp(0.88rem, 1.3vw, 1rem);
      color: rgba(255,255,255,0.5);
      line-height: 1.7; max-width: 520px; margin: 0 auto;
    }

    .amc-swiper {
      padding: 8px 24px 32px !important;
      position: relative; z-index: 2;
    }

    .amc-card {
      background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px; padding: 24px;
      display: flex; flex-direction: column; gap: 18px;
      height: 100%; min-height: 380px;
      position: relative; overflow: hidden;
      transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
      cursor: default;
    }
    .amc-card::before {
      content: '';
      position: absolute; inset: 0; border-radius: 20px;
      background: radial-gradient(circle at 60% 0%, var(--glow, rgba(59,130,246,0.12)) 0%, transparent 60%);
      opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
    }
    .amc-card:hover {
      border-color: rgba(255,255,255,0.16);
      transform: translateY(-6px);
      box-shadow: 0 24px 56px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05);
    }
    .amc-card:hover::before { opacity: 1; }

    .amc-card-top { display: flex; align-items: center; gap: 14px; }
    .amc-logo {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .amc-logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 13px; font-weight: 900; color: #fff; letter-spacing: -0.02em;
    }
    .amc-name-wrap { display: flex; flex-direction: column; gap: 6px; }
    .amc-name { font-size: 14px; font-weight: 800; color: #fff; line-height: 1.2; }
    .amc-risk-badge {
      display: inline-block; font-size: 10px; font-weight: 700;
      padding: 2px 10px; border-radius: 999px; border: 1px solid;
      text-transform: uppercase; letter-spacing: 0.06em;
    }

    .amc-categories { display: flex; flex-wrap: wrap; gap: 6px; }
    .amc-cat-chip {
      font-size: 10.5px; font-weight: 600;
      padding: 3px 10px; border-radius: 999px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6);
    }

    .amc-scheme-block { display: flex; flex-direction: column; gap: 4px; }
    .amc-scheme-label {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: rgba(255,255,255,0.35);
    }
    .amc-scheme-name {
      font-size: 12.5px; font-weight: 700; color: rgba(255,255,255,0.8); line-height: 1.4;
    }

    .amc-metrics {
      display: flex; align-items: center; gap: 16px;
      padding: 14px 16px; border-radius: 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
    }
    .amc-metric { display: flex; flex-direction: column; gap: 3px; }
    .amc-metric-val {
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem; font-weight: 900; color: #fff;
    }
    .amc-returns { color: #4ADE80; }
    .amc-metric-label {
      font-size: 10px; font-weight: 600;
      color: rgba(255,255,255,0.38);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .amc-metric-divider {
      width: 1px; height: 36px;
      background: rgba(255,255,255,0.1); margin: 0 4px;
    }

    .amc-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }
    .amc-btn {
      flex: 1; min-width: 80px; height: 36px; border-radius: 10px; border: none;
      font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.22s ease;
    }
    .amc-btn-primary {
      background: linear-gradient(135deg, #3B82F6, #6366F1); color: #fff;
      box-shadow: 0 4px 16px rgba(59,130,246,0.28);
    }
    .amc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.42); }
    .amc-btn-secondary {
      background: rgba(59,130,246,0.1);
      border: 1px solid rgba(59,130,246,0.35); color: #60A5FA;
    }
    .amc-btn-secondary:hover { background: rgba(59,130,246,0.18); }
    .amc-btn-ghost {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.55);
    }
    .amc-btn-ghost:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.8); }

    .amc-disclaimer {
      text-align: center; padding: 0 24px;
      font-size: 10.5px; color: rgba(255,255,255,0.25);
      line-height: 1.6; position: relative; z-index: 2;
    }

    @media (max-width: 576px) {
      .amc-root { padding: 56px 0 40px; }
      .amc-swiper { padding: 8px 16px 24px !important; }
      .amc-card { padding: 18px; min-height: 340px; }
    }
  `],
})
export class AmcPartnersComponent implements OnInit {
  nav = inject(NavService);

  amcs: AmcCard[] = [
    {
      name: 'SBI Mutual Fund',     abbr: 'SBI',
      color: 'linear-gradient(135deg, #1e3a5f, #2563EB)',
      glow: 'rgba(37,99,235,0.18)',
      categories: ['Large Cap', 'ELSS', 'Debt'],
      topScheme: 'SBI Bluechip Fund',
      risk: 'Moderate', riskColor: '#FBBF24', returns: '18.4%', minSIP: '₹500',
    },
    {
      name: 'HDFC Mutual Fund',    abbr: 'HDFC',
      color: 'linear-gradient(135deg, #7C0000, #DC2626)',
      glow: 'rgba(220,38,38,0.15)',
      categories: ['Multi Cap', 'Large Cap', 'Hybrid'],
      topScheme: 'HDFC Flexi Cap Fund',
      risk: 'High', riskColor: '#F87171', returns: '21.2%', minSIP: '₹100',
    },
    {
      name: 'ICICI Prudential',    abbr: 'ICICI',
      color: 'linear-gradient(135deg, #7C3AED, #6366F1)',
      glow: 'rgba(99,102,241,0.18)',
      categories: ['Balanced', 'Large Cap', 'ELSS'],
      topScheme: 'ICICI Pru Balanced Advantage',
      risk: 'Moderate', riskColor: '#FBBF24', returns: '16.8%', minSIP: '₹100',
    },
    {
      name: 'Nippon India',        abbr: 'NI',
      color: 'linear-gradient(135deg, #991B1B, #EF4444)',
      glow: 'rgba(239,68,68,0.15)',
      categories: ['Small Cap', 'Mid Cap', 'Index'],
      topScheme: 'Nippon India Small Cap',
      risk: 'Very High', riskColor: '#F87171', returns: '28.6%', minSIP: '₹100',
    },
    {
      name: 'Axis Mutual Fund',    abbr: 'AXIS',
      color: 'linear-gradient(135deg, #065F46, #059669)',
      glow: 'rgba(5,150,105,0.15)',
      categories: ['Large Cap', 'Mid Cap', 'Debt'],
      topScheme: 'Axis Bluechip Fund',
      risk: 'Moderate', riskColor: '#FBBF24', returns: '15.3%', minSIP: '₹500',
    },
    {
      name: 'Kotak Mutual Fund',   abbr: 'KMF',
      color: 'linear-gradient(135deg, #78350F, #D97706)',
      glow: 'rgba(217,119,6,0.15)',
      categories: ['Flexi Cap', 'Debt', 'Hybrid'],
      topScheme: 'Kotak Flexi Cap Fund',
      risk: 'Moderate', riskColor: '#FBBF24', returns: '17.9%', minSIP: '₹100',
    },
  ];

  ngOnInit(): void {}
}
