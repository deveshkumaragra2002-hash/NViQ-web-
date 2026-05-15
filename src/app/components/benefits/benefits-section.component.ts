import {
  AfterViewInit, Component, ElementRef, Input, NgZone,
  OnDestroy, QueryList, ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Benefit {
  iconPath: string;
  iconColor: string;
  glow: string;
  tag?: string;
  title: string;
  desc: string;
  stat: string;
  statLabel: string;
  statTarget: number;
  statSuffix: string;
}

@Component({
  selector: 'app-benefits-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="ben-root" id="benefits">

      <!-- Background -->
      <div class="ben-bg" aria-hidden="true"></div>

      <div class="ben-container">

        <!-- Header -->
        <header class="ben-header">
          <p class="ben-eyebrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2l8 4v6c0 5-3.3 8.6-8 10-4.7-1.4-8-5-8-10V6l8-4z"/></svg>
            Why NViQ
          </p>
          <h2 class="ben-title">
            {{ productType === 'mf' ? 'Built for Investors' : 'Built for Fleet Operators' }}<br>
            <span class="ben-accent">{{ productType === 'mf' ? 'Who Think Long-Term' : 'Who Think Ahead' }}</span>
          </h2>
          <p class="ben-sub">
            {{ productType === 'mf'
              ? 'Every feature is designed to maximise returns, cut tax burden, and give you total clarity over your financial future.'
              : 'Every feature is built around reducing cost, eliminating guesswork, and giving your team a measurable edge.' }}
          </p>
        </header>

        <!-- Cards grid -->
        <div class="ben-grid">
          <article
            #cardRef
            *ngFor="let b of benefits; let i = index"
            class="ben-card"
            [class.visible]="visibleCards[i]"
            [style.transition-delay]="(i * 100) + 'ms'"
            (mousemove)="onTilt($event, i)"
            (mouseleave)="onTiltReset(i)"
          >
            <!-- Glare layer -->
            <div class="card-glare" [attr.data-i]="i"></div>

            <!-- Icon -->
            <div class="card-icon-ring" [style.background]="b.glow" [style.border-color]="b.iconColor + '33'">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                [attr.stroke]="b.iconColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path [attr.d]="b.iconPath"/>
              </svg>
            </div>

            <!-- Series tag badge (product series cards) -->
            <div *ngIf="b.tag" class="card-tag"
              [style.color]="b.iconColor"
              [style.border-color]="b.iconColor + '33'"
              [style.background]="b.glow">
              {{ b.tag }}
            </div>

            <!-- Animated counter (metric cards) -->
            <div *ngIf="!b.tag" class="card-stat">
              <span class="stat-num" [style.color]="b.iconColor">{{ displayNums[i] }}{{ b.statSuffix }}</span>
              <span class="stat-lbl">{{ b.statLabel }}</span>
            </div>

            <h3 class="card-title">{{ b.title }}</h3>
            <p class="card-desc">{{ b.desc }}</p>

            <!-- Bottom glow line -->
            <div class="card-bottom-bar" [style.background]="'linear-gradient(90deg,' + b.iconColor + ',transparent)'"></div>
          </article>
        </div>

      </div>
    </section>
  `,
  styles: [`
    /* ── Root ──────────────────────────────────────────── */
    .ben-root {
      position: relative;
      padding: 100px 24px 112px;
      background: #050A14;
      overflow: hidden;
    }
    .ben-bg {
      position: absolute; inset: 0; pointer-events: none;
      background:
        radial-gradient(ellipse 60% 40% at 15% 50%, rgba(0,212,255,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 50% 35% at 85% 50%, rgba(99,102,241,0.06) 0%, transparent 60%);
    }

    /* ── Container ──────────────────────────────────────── */
    .ben-container { max-width: 1200px; margin: 0 auto; }

    /* ── Header ─────────────────────────────────────────── */
    .ben-header { text-align: center; max-width: 680px; margin: 0 auto 64px; }
    .ben-eyebrow {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 5px 16px; border-radius: 999px;
      border: 1px solid rgba(0,212,255,0.2);
      background: rgba(0,212,255,0.06);
      color: #00D4FF; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.12em;
      margin-bottom: 20px;
    }
    .ben-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-weight: 900; letter-spacing: -0.03em;
      color: #F0F6FF; line-height: 1.1; margin-bottom: 16px;
    }
    .ben-accent {
      background: linear-gradient(120deg, #00D4FF, #6366F1);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .ben-sub { color: #64748B; font-size: 1rem; line-height: 1.7; }

    /* ── Grid ───────────────────────────────────────────── */
    .ben-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    /* ── Card ───────────────────────────────────────────── */
    .ben-card {
      position: relative;
      padding: 32px 24px 28px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.07);
      background: linear-gradient(160deg, rgba(12,18,32,0.95) 0%, rgba(6,10,20,0.98) 100%);
      overflow: hidden;
      display: flex; flex-direction: column; gap: 14px;
      opacity: 0; transform: translateY(36px);
      transition: opacity 0.65s ease, transform 0.65s ease;
      transform-style: preserve-3d;
      will-change: transform;
      cursor: default;
    }
    .ben-card.visible { opacity: 1; transform: translateY(0) perspective(800px) rotateX(0) rotateY(0); }
    .ben-card:hover { border-color: rgba(255,255,255,0.12); }

    /* Glare */
    .card-glare {
      position: absolute; inset: 0; border-radius: 20px;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05), transparent 60%);
      pointer-events: none; transition: opacity 0.3s ease;
      opacity: 0;
    }
    .ben-card:hover .card-glare { opacity: 1; }

    /* Icon */
    .card-icon-ring {
      width: 52px; height: 52px;
      border-radius: 14px; border: 1px solid;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.3s ease;
    }
    .ben-card:hover .card-icon-ring { transform: rotate(-6deg) scale(1.08); }

    /* Series tag badge */
    .card-tag {
      display: inline-flex; align-items: center;
      padding: 5px 14px; border-radius: 999px;
      border: 1px solid;
      font-size: 11px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.14em;
      width: fit-content;
      transition: transform 0.3s ease;
    }
    .ben-card:hover .card-tag { transform: scale(1.06); }

    /* Stat counter */
    .card-stat {
      display: flex; flex-direction: column; gap: 2px;
    }
    .stat-num {
      font-family: 'Outfit', sans-serif;
      font-size: 2.4rem; font-weight: 900;
      letter-spacing: -0.03em; line-height: 1;
      transition: transform 0.3s ease;
    }
    .ben-card:hover .stat-num { transform: scale(1.04); }
    .stat-lbl {
      font-size: 11px; font-weight: 600;
      color: #475569; text-transform: uppercase; letter-spacing: 0.1em;
    }

    /* Text */
    .card-title {
      font-size: 1.05rem; font-weight: 800;
      color: #F0F6FF; letter-spacing: -0.01em; line-height: 1.2;
    }
    .card-desc {
      font-size: 0.86rem; color: #64748B; line-height: 1.65;
    }

    /* Bottom bar */
    .card-bottom-bar {
      position: absolute; bottom: 0; left: 0;
      height: 2px; width: 0;
      transition: width 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s;
      border-radius: 999px;
    }
    .ben-card.visible .card-bottom-bar { width: 100%; }

    /* ── Responsive ─────────────────────────────────────── */
    @media (max-width: 900px)  { .ben-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 640px)  { .ben-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 400px)  { .ben-grid { grid-template-columns: 1fr; } }
  `]
})
export class BenefitsSectionComponent implements AfterViewInit, OnDestroy {
  @Input() productType: 'gps' | 'mf' = 'gps';
  @ViewChildren('cardRef') cardRefs!: QueryList<ElementRef<HTMLElement>>;

  visibleCards: boolean[] = [];
  displayNums: string[] = [];
  private obs: IntersectionObserver | null = null;
  private cardEls: HTMLElement[] = [];

  get benefits(): Benefit[] {
    return this.productType === 'mf' ? this.mfBenefits : this.gpsBenefits;
  }

  mfBenefits: Benefit[] = [
    {
      iconPath: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
      iconColor: '#00D4FF', glow: 'rgba(0,212,255,0.1)',
      title: 'Portfolio Returns', desc: 'Equity mutual funds have historically delivered 12–15% CAGR over 10+ years — well ahead of FDs and savings accounts.',
      stat: '14', statLabel: 'Avg. 10-yr CAGR %', statTarget: 14, statSuffix: '%'
    },
    {
      iconPath: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
      iconColor: '#34D399', glow: 'rgba(52,211,153,0.1)',
      title: 'Tax Savings (ELSS)', desc: 'ELSS funds let you claim up to ₹1.5L deduction under Sec 80C — saving up to ₹46,800 in tax every financial year.',
      stat: '46800', statLabel: '₹ Max Tax Saved/yr', statTarget: 46800, statSuffix: ''
    },
    {
      iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
      iconColor: '#A78BFA', glow: 'rgba(167,139,250,0.1)',
      title: 'Expert Guidance', desc: 'Free Consultation • AMFI Registered guidance with ARN No: 359231 helps review your portfolio quarterly and keeps every goal on track.',
      stat: '5K+', statLabel: 'Investors Guided', statTarget: 5000, statSuffix: '+'
    },
    {
      iconPath: 'M12 2l8 4v6c0 5-3.3 8.6-8 10-4.7-1.4-8-5-8-10V6l8-4zM9.2 12.4l2 2 3.6-4',
      iconColor: '#FB923C', glow: 'rgba(251,146,60,0.1)',
      title: 'Secure Platform', desc: 'Bank-grade 256-bit encryption, AMFI registration, ARN No: 359231, and 2FA protect every transaction and document.',
      stat: '99.9', statLabel: '% Uptime SLA', statTarget: 99.9, statSuffix: '%'
    },
  ];

  gpsBenefits: Benefit[] = [
    {
      iconPath: 'M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10zM12 11m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
      iconColor: '#00D4FF', glow: 'rgba(0,212,255,0.08)',
      tag: 'Basic',
      title: 'NViQ Lite',
      desc: 'Entry-level GPS tracking for small fleets. Real-time location, trip history, and driver behavior monitoring out of the box.',
      stat: '', statLabel: '', statTarget: 0, statSuffix: ''
    },
    {
      iconPath: 'M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01',
      iconColor: '#34D399', glow: 'rgba(52,211,153,0.08)',
      tag: '4G',
      title: 'NViQ Smart',
      desc: 'High-speed 4G connectivity with live alerts, geo-fencing, and route analytics for growing mid-size fleets.',
      stat: '', statLabel: '', statTarget: 0, statSuffix: ''
    },
    {
      iconPath: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
      iconColor: '#A78BFA', glow: 'rgba(167,139,250,0.08)',
      tag: 'Pro',
      title: 'NViQ Pro',
      desc: 'AI-powered fleet intelligence with predictive maintenance, fuel cost analytics, and advanced multi-branch reporting.',
      stat: '', statLabel: '', statTarget: 0, statSuffix: ''
    },
    {
      iconPath: 'M12 2l8 4v6c0 5-3.3 8.6-8 10-4.7-1.4-8-5-8-10V6l8-4zM9.2 12.4l2 2 3.6-4',
      iconColor: '#FB923C', glow: 'rgba(251,146,60,0.08)',
      tag: 'AIS140',
      title: 'NViQ AIS140',
      desc: 'AIS140-certified devices meeting all government mandates for commercial vehicle compliance, panic alerts, and audit-ready logs.',
      stat: '', statLabel: '', statTarget: 0, statSuffix: ''
    },
    {
      iconPath: 'M23 7l-7 5 7 5V7zM1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
      iconColor: '#F43F5E', glow: 'rgba(244,63,94,0.08)',
      tag: 'Dashcam',
      title: 'Vision Series',
      desc: 'Dual-channel AI dashcam with event-based recording, cloud backup, and real-time driver coaching to reduce accidents.',
      stat: '', statLabel: '', statTarget: 0, statSuffix: ''
    },
  ];

  constructor(private ngZone: NgZone) {
    this.visibleCards = this.benefits.map(() => true);
    this.displayNums = this.benefits.map(() => '0');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.visibleCards.forEach((_, i) => {
        if (!this.visibleCards[i]) { this.visibleCards[i] = true; this.animateCounter(i); }
      });
    }, 80);

    this.obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const idx = parseInt(e.target.getAttribute('data-ben') || '0', 10);
        if (e.isIntersecting && !this.visibleCards[idx]) {
          this.visibleCards[idx] = true;
          this.animateCounter(idx);
        }
      });
    }, { threshold: 0.25 });

    this.cardRefs.forEach((ref, i) => {
      ref.nativeElement.setAttribute('data-ben', String(i));
      this.obs!.observe(ref.nativeElement);
      this.cardEls[i] = ref.nativeElement;
    });
  }

  private animateCounter(idx: number): void {
    const b = this.benefits[idx];
    const duration = 1400;
    const start = performance.now();
    const isDecimal = b.statTarget % 1 !== 0;

    this.ngZone.runOutsideAngular(() => {
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = b.statTarget * eased;
        const display = isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString();
        this.ngZone.run(() => { this.displayNums[idx] = display; });
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  onTilt(event: MouseEvent, i: number): void {
    const el = this.cardEls[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((event.clientY - cy) / (rect.height / 2)) * -8;
    const ry = ((event.clientX - cx) / (rect.width  / 2)) *  8;

    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    el.style.boxShadow = `0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)`;

    const glare = el.querySelector('.card-glare') as HTMLElement | null;
    if (glare) {
      const px = ((event.clientX - rect.left) / rect.width) * 100;
      const py = ((event.clientY - rect.top) / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.07), transparent 65%)`;
      glare.style.opacity = '1';
    }
  }

  onTiltReset(i: number): void {
    const el = this.cardEls[i];
    if (!el) return;
    el.style.transform = '';
    el.style.boxShadow = '';
    const glare = el.querySelector('.card-glare') as HTMLElement | null;
    if (glare) glare.style.opacity = '0';
  }

  ngOnDestroy(): void { this.obs?.disconnect(); }
}
