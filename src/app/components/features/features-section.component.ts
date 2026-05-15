import {
  AfterViewInit, Component, ElementRef, Input,
  OnDestroy, QueryList, ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface FeatureCard {
  icon: string;
  iconColor: string;
  glow: string;
  title: string;
  description: string;
  bullets: string[];
}

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="fs-root" id="fleet-solutions">
      <div class="fs-container">

        <header class="fs-header">
          <p class="fs-eyebrow">{{ productType === 'mf' ? 'Investment Value' : 'Fleet Value' }}</p>
          <h2 class="fs-title">What We Deliver<br><span class="fs-accent">{{ productType === 'mf' ? 'to Your Portfolio' : 'to Your Fleet' }}</span></h2>
          <p class="fs-sub">
            {{ productType === 'mf'
              ? 'Expert-guided mutual fund solutions built to grow your wealth, minimise tax burden, and align with your financial goals.'
              : 'A focused operating layer that gives your team clear visibility, safer decisions, and stronger control every day.' }}
          </p>
        </header>

        <div class="fs-grid">
          <article
            #cardRef
            *ngFor="let card of features; let i = index"
            class="fs-card"
            [class.visible]="visibleCards[i]"
            [style.transition-delay]="(i * 110) + 'ms'"
            (mousemove)="onTilt($event, i)"
            (mouseleave)="onTiltReset(i)"
          >
            <!-- Glare -->
            <div class="fs-glare" [attr.data-gi]="i"></div>

            <!-- Corner accent -->
            <div class="fs-corner" [style.background]="card.iconColor + '18'"></div>

            <div class="card-icon-wrap" [style.border-color]="card.iconColor + '40'"
                 [style.background]="card.glow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                [attr.stroke]="card.iconColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <path [attr.d]="card.icon"/>
              </svg>
            </div>

            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.description }}</p>

            <ul class="card-bullets">
              <li *ngFor="let b of card.bullets">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  [attr.stroke]="card.iconColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                {{ b }}
              </li>
            </ul>

            <!-- Bottom glow bar -->
            <div class="card-bar"
                 [style.background]="'linear-gradient(90deg,' + card.iconColor + ',' + card.iconColor + '44,transparent)'">
            </div>
          </article>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .fs-root {
      padding: 96px 24px 108px;
      background:
        radial-gradient(ellipse 50% 40% at 10% 50%, rgba(14,165,233,0.08) 0%, transparent 55%),
        radial-gradient(ellipse 50% 40% at 90% 50%, rgba(34,197,94,0.06) 0%, transparent 55%),
        #030810;
    }
    .fs-container { max-width: 1180px; margin: 0 auto; }

    /* Header */
    .fs-header { text-align: center; max-width: 760px; margin: 0 auto 56px; }
    .fs-eyebrow {
      display: inline-block;
      color: #7dd3fc; font-size: 11.5px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.18em;
      margin-bottom: 14px;
    }
    .fs-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(2rem, 4.2vw, 3.1rem);
      font-weight: 900; letter-spacing: -0.03em;
      color: #f8fafc; line-height: 1.08; margin-bottom: 16px;
    }
    .fs-accent {
      background: linear-gradient(120deg, #00D4FF, #6366F1);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .fs-sub {
      color: rgba(203,213,225,0.82);
      font-size: clamp(0.97rem, 1.4vw, 1.1rem); line-height: 1.65;
    }

    /* Grid */
    .fs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

    /* Card */
    .fs-card {
      position: relative;
      padding: 34px 30px 30px;
      border-radius: 22px;
      border: 1px solid rgba(148,163,184,0.14);
      background: rgba(8,13,24,0.85);
      backdrop-filter: blur(12px);
      overflow: hidden;
      display: flex; flex-direction: column; gap: 14px;
      opacity: 0; transform: translateY(24px) scale(0.98);
      transition: opacity 0.6s ease, transform 0.6s ease,
                  border-color 0.3s ease, box-shadow 0.3s ease;
      transform-style: preserve-3d;
      will-change: transform;
    }
    .fs-card.visible { opacity: 1; transform: translateY(0) scale(1); }
    .fs-card:hover { border-color: rgba(148,163,184,0.28); }

    /* Corner accent triangle */
    .fs-corner {
      position: absolute; top: 0; right: 0;
      width: 80px; height: 80px;
      clip-path: polygon(100% 0, 0 0, 100% 100%);
      opacity: 0.5; transition: opacity 0.3s;
    }
    .fs-card:hover .fs-corner { opacity: 0.8; }

    /* Glare */
    .fs-glare {
      position: absolute; inset: 0; border-radius: 22px;
      pointer-events: none; opacity: 0;
      transition: opacity 0.3s ease;
    }
    .fs-card:hover .fs-glare { opacity: 1; }

    /* Icon */
    .card-icon-wrap {
      width: 50px; height: 50px;
      border-radius: 14px; border: 1px solid;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: transform 0.3s ease;
    }
    .fs-card:hover .card-icon-wrap { transform: rotate(-8deg) scale(1.1); }

    /* Title */
    .card-title {
      font-size: 1.25rem; font-weight: 800;
      color: #f8fafc; letter-spacing: -0.02em; line-height: 1.2;
    }

    /* Description */
    .card-desc { color: rgba(203,213,225,0.75); font-size: 0.93rem; line-height: 1.65; }

    /* Bullets */
    .card-bullets {
      list-style: none; padding: 0; margin: 0;
      display: flex; flex-direction: column; gap: 9px; margin-top: 4px;
    }
    .card-bullets li {
      display: flex; align-items: flex-start; gap: 8px;
      color: rgba(226,232,240,0.8); font-size: 0.86rem; line-height: 1.5;
    }
    .card-bullets li svg { flex-shrink: 0; margin-top: 2px; }

    /* Bottom bar */
    .card-bar {
      position: absolute; bottom: 0; left: 0;
      height: 2px; width: 0;
      transition: width 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s;
    }
    .fs-card.visible .card-bar { width: 100%; }

    @media (max-width: 768px) {
      .fs-root { padding: 72px 16px 80px; }
      .fs-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class FeaturesSectionComponent implements AfterViewInit, OnDestroy {
  @Input() productType: 'gps' | 'mf' = 'gps';
  @ViewChildren('cardRef') cardRefs!: QueryList<ElementRef<HTMLElement>>;

  visibleCards: boolean[] = [];
  private cardEls: HTMLElement[] = [];
  private obs: IntersectionObserver | null = null;

  get features(): FeatureCard[] {
    return this.productType === 'mf' ? this.mfFeatures : this.gpsFeatures;
  }

  mfFeatures: FeatureCard[] = [
    {
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z M17 3.34A10 10 0 1 1 2.06 10.99',
      iconColor: '#38bdf8', glow: 'rgba(56,189,248,0.1)',
      title: 'SIP Automation',
      description: 'Set up systematic investment plans once and let compounding do the heavy lifting — no manual intervention needed.',
      bullets: ['Auto-debit on your chosen date', 'Pause or modify anytime', 'Step-up SIP for rising income'],
    },
    {
      icon: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
      iconColor: '#34d399', glow: 'rgba(52,211,153,0.1)',
      title: 'Goal-Based Planning',
      description: 'Map every rupee to a life goal — retirement, education, or home — and track progress in real time.',
      bullets: ['Retirement & education calculators', 'Goal progress dashboard', 'Rebalancing alerts when off-track'],
    },
    {
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
      iconColor: '#a78bfa', glow: 'rgba(167,139,250,0.1)',
      title: 'Risk Management',
      description: 'Personalised risk profiling matches you to the right funds — so your portfolio never keeps you up at night.',
      bullets: ['Risk appetite questionnaire', 'Volatility-adjusted allocation', 'Downside protection strategies'],
    },
    {
      icon: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
      iconColor: '#fb923c', glow: 'rgba(251,146,60,0.1)',
      title: 'Tax Optimisation (ELSS)',
      description: 'Save up to ₹46,800 in taxes annually while building long-term wealth through ELSS equity funds.',
      bullets: ['₹1.5L deduction under Sec 80C', 'Shortest 3-year lock-in among 80C', 'Equity-linked growth potential'],
    },
  ];

  gpsFeatures: FeatureCard[] = [
    {
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z M12 5v2M12 17v2M5 12H3M21 12h-2',
      iconColor: '#38bdf8', glow: 'rgba(56,189,248,0.1)',
      title: 'Smart Tracking',
      description: 'Always-on location visibility with clean route history to keep operations grounded.',
      bullets: ['Live GPS position every 10 seconds','Full route history with timestamps','Geofence alerts for boundary violations'],
    },
    {
      icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4',
      iconColor: '#34d399', glow: 'rgba(52,211,153,0.1)',
      title: 'Business Summary',
      description: 'Complete business overview with trip, fuel, and fleet performance reports in one place.',
      bullets: ['Fuel consumption & cost summary', 'Trip distance & stoppage reports', 'Fleet utilization analytics'],
    },
    {
      icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
      iconColor: '#a78bfa', glow: 'rgba(167,139,250,0.1)',
      title: 'Drive Behaviour',
      description: 'Real-time driver monitoring with instant alerts for unsafe driving patterns.',
      bullets: ['Overspeed & harsh braking alerts', 'Geo-fence entry/exit alerts', 'Fuel theft & drain alerts'],
    },
    {
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      iconColor: '#fb923c', glow: 'rgba(251,146,60,0.1)',
      title: 'Certified Safety Solutions',
      description: 'Compliance-friendly controls that strengthen driver safety and audit confidence.',
      bullets: ['Driver fatigue & overspeed alerts','Panic button & emergency SOS relay','Compliance audit trail & reports'],
    },
  ];

  constructor() {
    this.visibleCards = this.features.map(() => true);
  }

  ngAfterViewInit(): void {
    setTimeout(() => { this.visibleCards = this.visibleCards.map(() => true); }, 80);

    this.obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const idx = parseInt(e.target.getAttribute('data-fi') || '0', 10);
        if (e.isIntersecting) this.visibleCards[idx] = true;
      });
    }, { threshold: 0.15 });

    this.cardRefs.forEach((ref, i) => {
      ref.nativeElement.setAttribute('data-fi', String(i));
      this.obs!.observe(ref.nativeElement);
      this.cardEls[i] = ref.nativeElement;
    });
  }

  onTilt(event: MouseEvent, i: number): void {
    const el = this.cardEls[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((event.clientY - cy) / (rect.height / 2)) * -7;
    const ry = ((event.clientX - cx) / (rect.width  / 2)) *  7;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
    el.style.boxShadow = `0 28px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.07)`;
    const glare = el.querySelector('.fs-glare') as HTMLElement | null;
    if (glare) {
      const px = ((event.clientX - rect.left) / rect.width) * 100;
      const py = ((event.clientY - rect.top) / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.06), transparent 65%)`;
      glare.style.opacity = '1';
    }
  }

  onTiltReset(i: number): void {
    const el = this.cardEls[i];
    if (!el) return;
    el.style.transform = '';
    el.style.boxShadow = '';
    const glare = el.querySelector('.fs-glare') as HTMLElement | null;
    if (glare) glare.style.opacity = '0';
  }

  ngOnDestroy(): void { this.obs?.disconnect(); }
}
