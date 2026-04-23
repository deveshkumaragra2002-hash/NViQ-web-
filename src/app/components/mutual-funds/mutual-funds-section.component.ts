import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';

type TabKey = 'sip' | 'goal';

type FlowStep = {
  icon: string;
  title: string;
  description: string;
};

type InvestmentPlan = {
  name: string;
  amount: string;
  detail: string;
  badge?: string;
  highlight?: boolean;
};

@Component({
  selector: 'app-mutual-funds-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="mutual-funds" class="mf-section">
      <div class="mf-shell section-fade">
        <header class="header-block">
          <p class="eyebrow">Mutual Funds</p>
          <h2>From Savings to Growth</h2>
          <p class="positioning-line">
            We save your money with GPS. We help you grow that money with mutual funds.
          </p>
          <p class="subtitle">
            Reduce costs with smart tracking - grow those savings with investments
          </p>
        </header>

        <div class="flow-grid">
          <ng-container *ngFor="let step of flowSteps; let i = index">
            <article class="flow-card stagger-up" [style.animation-delay]="(i * 120) + 'ms'">
              <div class="flow-icon">{{ step.icon }}</div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </article>
            <div *ngIf="i < flowSteps.length - 1" class="flow-arrow" aria-hidden="true">-></div>
          </ng-container>
        </div>

        <div class="tabs-card section-gap">
          <div class="tab-switch">
            <button
              type="button"
              class="tab-btn"
              [class.active]="activeTab === 'sip'"
              (click)="setTab('sip')"
            >
              SIP Plans
            </button>
            <button
              type="button"
              class="tab-btn"
              [class.active]="activeTab === 'goal'"
              (click)="setTab('goal')"
            >
              Goal-Based Plans
            </button>
          </div>

          <div class="plans-grid">
            <article
              *ngFor="let plan of activePlans; let i = index"
              class="plan-card stagger-up"
              [class.highlight]="plan.highlight"
              [style.animation-delay]="(i * 90) + 'ms'"
            >
              <span *ngIf="plan.badge" class="plan-badge">{{ plan.badge }}</span>
              <h4>{{ plan.name }}</h4>
              <div class="amount">{{ plan.amount }}</div>
              <p>{{ plan.detail }}</p>
            </article>
          </div>
        </div>

        <div class="fee-strip section-gap">
          <div *ngFor="let item of feeHighlights" class="fee-pill">{{ item }}</div>
        </div>

        <div class="calc-layout section-gap">
          <div class="glass-card calc-controls">
            <h3 class="block-title">Live SIP Calculator</h3>
            <p class="block-subtitle">See how monthly investing compounds over time</p>

            <div class="slider-group">
              <div class="slider-header">
                <label for="sip-monthly">Monthly Investment</label>
                <span>&#8377;{{ formatAmount(monthly) }}</span>
              </div>
              <input
                id="sip-monthly"
                class="slider"
                type="range"
                min="500"
                max="3000"
                [value]="monthly"
                (input)="onMonthlyChange($event)"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <label for="sip-years">Duration</label>
                <span>{{ years }} years</span>
              </div>
              <input
                id="sip-years"
                class="slider"
                type="range"
                min="1"
                max="20"
                [value]="years"
                (input)="onYearsChange($event)"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <label for="sip-return">Expected Return</label>
                <span>{{ rate }}%</span>
              </div>
              <input
                id="sip-return"
                class="slider"
                type="range"
                min="6"
                max="18"
                [value]="rate"
                (input)="onRateChange($event)"
              />
            </div>

            <p class="formula">
              FV = P x ((1+r)^n - 1) / r x (1+r)
            </p>
          </div>

          <div class="calc-results">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Invested Amount</div>
                <div class="stat-value">&#8377;{{ formatAmount(invested) }}</div>
              </div>
              <div class="stat-card gain">
                <div class="stat-label">Estimated Gains</div>
                <div class="stat-value">&#8377;{{ formatAmount(gains) }}</div>
              </div>
              <div class="stat-card total">
                <div class="stat-label">Total Value</div>
                <div class="stat-value">&#8377;{{ formatAmount(total) }}</div>
              </div>
            </div>

            <div class="glass-card chart-card">
              <div class="chart-header">
                <p>Your savings can grow over time</p>
                <span>{{ years }}Y projection</span>
              </div>

              <svg class="chart-svg" viewBox="0 0 100 160" preserveAspectRatio="none" aria-label="SIP growth chart">
                <line x1="0" y1="140" x2="100" y2="140" class="chart-axis"></line>
                <line x1="0" y1="105" x2="100" y2="105" class="chart-guide"></line>
                <line x1="0" y1="70" x2="100" y2="70" class="chart-guide"></line>
                <line x1="0" y1="35" x2="100" y2="35" class="chart-guide"></line>

                <polygon class="chart-area" [attr.points]="chartAreaPoints"></polygon>
                <polyline
                  class="chart-line"
                  [style.animation]="chartAnimation"
                  [attr.points]="chartPolyline"
                ></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div class="trust-block section-gap">
          <span class="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 5V11C4 16 7.4 20.7 12 22C16.6 20.7 20 16 20 11V5L12 2Z" stroke="currentColor" stroke-width="1.6"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div>
            <p class="trust-title">Offered via trusted financial partners</p>
            <p class="trust-subtitle">SEBI registered partners</p>
          </div>
        </div>

        <div class="cta-wrap">
          <button type="button" class="primary-cta" (click)="onPrimaryCta()">
            Start Growing Your Money ->
          </button>
        </div>

        <p class="disclaimer">
          Mutual fund investments are subject to market risks.
          <br />
          Please read all scheme-related documents carefully.
        </p>
      </div>
    </section>
  `,
  styles: [],
})
export class MutualFundsSectionComponent implements OnDestroy {
  @Output() openModal = new EventEmitter<void>();

  activeTab: TabKey = 'sip';

  monthly = 2000;
  years = 5;
  rate = 12;

  invested = 0;
  gains = 0;
  total = 0;
  chartPolyline = '';
  chartAreaPoints = '';
  chartAnimation = 'drawLine 1.2s ease both';

  private chartAnimationTimer: ReturnType<typeof setTimeout> | null = null;

  flowSteps: FlowStep[] = [
    { icon: '\u20B9', title: 'Savings', description: 'Fuel and cost savings' },
    { icon: 'SIP', title: 'Investment', description: 'Invest via SIP' },
    { icon: '\uD83D\uDCC8', title: 'Growth', description: 'Compounding wealth' },
  ];

  feeHighlights = [
    '0.5%-1.5% Expense Ratio',
    'Zero Entry/Exit Load',
    'No Hidden Charges',
    'Free to Start',
  ];

  sipPlans: InvestmentPlan[] = [
    { name: 'Starter', amount: '\u20B9500/month', detail: 'Begin disciplined investing with a low monthly SIP.' },
    { name: 'Growth', amount: '\u20B92,000/month', detail: 'Balanced wealth-building plan for consistent compounding.', badge: 'Most Popular', highlight: true },
    { name: 'Premium', amount: '\u20B93,000+/month', detail: 'Aggressive long-term SIP for faster corpus growth.' },
  ];

  goalPlans: InvestmentPlan[] = [
    { name: 'Short-Term', amount: '\u20B91,000/month', detail: 'Debt funds focused on stability and near-term goals.' },
    { name: 'Balanced', amount: '\u20B92,500/month', detail: 'Mix of debt and equity for growth with moderate risk.', badge: 'Recommended', highlight: true },
    { name: 'Long-Term Wealth', amount: '\u20B93,000+/month', detail: 'Equity-oriented portfolio for long horizon returns.' },
  ];

  constructor() {
    this.recalculate();
  }

  ngOnDestroy(): void {
    if (this.chartAnimationTimer) {
      clearTimeout(this.chartAnimationTimer);
    }
  }

  get activePlans(): InvestmentPlan[] {
    return this.activeTab === 'sip' ? this.sipPlans : this.goalPlans;
  }

  setTab(tab: TabKey): void {
    this.activeTab = tab;
  }

  onMonthlyChange(event: Event): void {
    this.monthly = this.readRangeValue(event, this.monthly);
    this.recalculate();
  }

  onYearsChange(event: Event): void {
    this.years = this.readRangeValue(event, this.years);
    this.recalculate();
  }

  onRateChange(event: Event): void {
    this.rate = this.readRangeValue(event, this.rate);
    this.recalculate();
  }

  onPrimaryCta(): void {
    this.sendPrompt('Start SIP Investment');
    this.openModal.emit();
  }

  sendPrompt(text: string): void {
    console.log(text);
  }

  formatAmount(value: number): string {
    return Math.round(value).toLocaleString('en-IN');
  }

  private recalculate(): void {
    const monthlyRate = this.rate / 100 / 12;
    const totalMonths = this.years * 12;
    const futureValueForMonth = (month: number): number => {
      if (monthlyRate <= 0) {
        return this.monthly * month;
      }
      return this.monthly * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * (1 + monthlyRate);
    };

    this.total = Math.round(futureValueForMonth(totalMonths));
    this.invested = this.monthly * totalMonths;
    this.gains = this.total - this.invested;

    const sampledMonths = this.getSampledMonths(totalMonths);
    const sampledValues = sampledMonths.map((month) => futureValueForMonth(month));
    const maxValue = Math.max(1, ...sampledValues);

    const pointPairs = sampledValues.map((value, index) => {
      const x = sampledValues.length === 1 ? 100 : (index / (sampledValues.length - 1)) * 100;
      const y = 140 - (value / maxValue) * 130;
      return { x, y };
    });

    if (pointPairs.length === 1) {
      const singleY = pointPairs[0].y.toFixed(2);
      this.chartPolyline = `0,${singleY} 100,${singleY}`;
      this.chartAreaPoints = `0,${singleY} 100,${singleY} 100,140 0,140`;
    } else {
      this.chartPolyline = pointPairs
        .map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
        .join(' ');
      this.chartAreaPoints = `${this.chartPolyline} 100,140 0,140`;
    }

    this.restartChartAnimation();
  }

  private getSampledMonths(totalMonths: number): number[] {
    const sampleStep = Math.max(1, Math.floor(totalMonths / 36));
    const months: number[] = [];
    for (let month = 1; month <= totalMonths; month += sampleStep) {
      months.push(month);
    }
    if (months[months.length - 1] !== totalMonths) {
      months.push(totalMonths);
    }
    return months;
  }

  private restartChartAnimation(): void {
    this.chartAnimation = 'none';
    if (this.chartAnimationTimer) {
      clearTimeout(this.chartAnimationTimer);
    }
    this.chartAnimationTimer = setTimeout(() => {
      this.chartAnimation = 'drawLine 1.2s ease both';
    }, 10);
  }

  private readRangeValue(event: Event, fallback: number): number {
    const input = event.target as HTMLInputElement | null;
    const parsed = Number(input?.value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
}

