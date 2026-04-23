import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

type DeliveryItem = {
  title: string;
  detail: string;
  icon: 'essential' | 'advanced' | 'intelligent' | 'safety';
};

type Particle = {
  top: string;
  left: string;
  size: number;
  opacity: number;
  delay: string;
  duration: string;
  depth: number;
};

@Component({
  selector: 'app-before-after-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="value-delivery-section">
      <div class="max-w-[1120px] mx-auto px-6">
        <div
          #valueShell
          class="value-shell"
          [style.--parallax-x]="parallaxX + 'px'"
          [style.--parallax-y]="parallaxY + 'px'"
          [style.--particle-shift-x]="(parallaxX * 0.45) + 'px'"
          [style.--particle-shift-y]="(parallaxY * 0.45) + 'px'"
          (mousemove)="onMouseMove($event)"
          (mouseleave)="resetParallax()"
        >
          <div class="particle-layer" aria-hidden="true">
            <span
              *ngFor="let p of particles"
              class="particle"
              [style.top]="p.top"
              [style.left]="p.left"
              [style.width.px]="p.size"
              [style.height.px]="p.size"
              [style.opacity]="p.opacity"
              [style.animation-delay]="p.delay"
              [style.animation-duration]="p.duration"
              [style.--depth]="p.depth"
            ></span>
          </div>

          <svg class="flow-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="deliveryLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3B82F6"></stop>
                <stop offset="50%" stop-color="#06B6D4"></stop>
                <stop offset="100%" stop-color="#38BDF8"></stop>
              </linearGradient>
            </defs>
            <line x1="25" y1="30" x2="75" y2="30" class="flow-line"></line>
            <line x1="25" y1="30" x2="25" y2="74" class="flow-line"></line>
            <line x1="75" y1="30" x2="75" y2="74" class="flow-line"></line>
            <line x1="25" y1="74" x2="75" y2="74" class="flow-line"></line>
          </svg>

          <header class="header-block">
            <p class="eyebrow">Fleet Value</p>
            <h2>What We Deliver to Your Fleet</h2>
            <p class="subtitle">
              A focused operating layer that gives your team clear visibility, safer decisions, and stronger control every day.
            </p>
          </header>

          <div class="value-grid">
            <article
              *ngFor="let item of deliveryItems; let i = index"
              class="value-card"
              [style.transition-delay]="(0.16 + i * 0.12) + 's'"
            >
              <div class="icon-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                  <ng-container [ngSwitch]="item.icon">
                    <ng-container *ngSwitchCase="'essential'">
                      <circle cx="12" cy="12" r="8"></circle>
                      <path d="M12 8v8"></path>
                      <path d="M8 12h8"></path>
                    </ng-container>
                    <ng-container *ngSwitchCase="'advanced'">
                      <rect x="4.5" y="4.5" width="15" height="15" rx="3"></rect>
                      <path d="M8 15l2.6-3 2.4 2 3-4"></path>
                    </ng-container>
                    <ng-container *ngSwitchCase="'intelligent'">
                      <circle cx="12" cy="12" r="7.5"></circle>
                      <path d="M12 7.5v4.7"></path>
                      <path d="M15.5 12.2l-3.5 3.3-2-1.8"></path>
                    </ng-container>
                    <ng-container *ngSwitchCase="'safety'">
                      <path d="M12 3.8l6.5 2.6v5.8c0 3.6-2.3 6.8-6.5 8-4.2-1.2-6.5-4.4-6.5-8V6.4L12 3.8z"></path>
                      <path d="M9.2 12.3l2.1 2.1 3.5-3.9"></path>
                    </ng-container>
                  </ng-container>
                </svg>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.detail }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .value-delivery-section {
      background: #080A12;
      padding: 92px 0 86px;
    }

    .value-shell {
      --parallax-x: 0px;
      --parallax-y: 0px;
      --particle-shift-x: 0px;
      --particle-shift-y: 0px;
      position: relative;
      max-width: 980px;
      margin: 0 auto;
      border-radius: 26px;
      border: 1px solid rgba(148, 163, 184, 0.22);
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.82) 0%, rgba(8, 10, 18, 0.94) 100%);
      box-shadow: 0 28px 58px rgba(2, 6, 23, 0.44);
      padding: 34px 20px 24px;
      overflow: hidden;
      isolation: isolate;
      opacity: 0;
      transform: translateY(20px) scale(0.975);
      transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .value-shell::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 22% 12%, rgba(56, 189, 248, 0.13), transparent 48%),
        radial-gradient(circle at 82% 82%, rgba(59, 130, 246, 0.14), transparent 42%);
      transform: translate3d(calc(var(--parallax-x) * -0.04), calc(var(--parallax-y) * -0.04), 0);
      transition: transform 0.28s ease-out;
    }

    .value-shell.is-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    .particle-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
    }

    .particle {
      position: absolute;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(125, 211, 252, 0.9) 0%, rgba(125, 211, 252, 0.08) 48%, rgba(125, 211, 252, 0) 70%);
      filter: blur(0.35px);
      animation-name: particleFloat;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
    }

    .flow-lines {
      display: none;
      position: absolute;
      inset: 26% 17% 12%;
      width: 66%;
      height: 62%;
      z-index: 1;
      pointer-events: none;
    }

    .flow-line {
      stroke: url(#deliveryLineGradient);
      stroke-width: 1.25;
      stroke-dasharray: 9 9;
      animation: flowDash 8.2s linear infinite;
    }

    .header-block {
      position: relative;
      z-index: 2;
      max-width: 720px;
      margin: 0 auto;
      text-align: center;
    }

    .eyebrow {
      margin: 0 0 10px;
      color: #93C5FD;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.11em;
      text-transform: uppercase;
    }

    .header-block h2 {
      margin: 0;
      color: #F8FAFC;
      font-size: clamp(30px, 4vw, 45px);
      line-height: 1.08;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .subtitle {
      margin: 13px auto 0;
      max-width: 630px;
      color: #94A3B8;
      font-size: 15px;
      line-height: 1.62;
    }

    .value-grid {
      position: relative;
      z-index: 2;
      margin-top: 30px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .value-card {
      position: relative;
      border-radius: 16px;
      border: 1px solid rgba(148, 163, 184, 0.23);
      background: rgba(15, 23, 42, 0.52);
      backdrop-filter: blur(14px);
      padding: 18px 16px;
      min-height: 180px;
      transform: translateY(18px) scale(0.96);
      opacity: 0;
      transition: opacity 0.52s ease, transform 0.52s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.24s ease, box-shadow 0.24s ease;
    }

    .value-shell.is-visible .value-card {
      opacity: 1;
      transform: translate3d(calc(var(--parallax-x) * 0.07), calc(var(--parallax-y) * 0.07), 0) scale(1);
    }

    .value-card:hover {
      border-color: rgba(96, 165, 250, 0.56);
      box-shadow: 0 16px 36px rgba(30, 64, 175, 0.2), 0 0 0 1px rgba(103, 232, 249, 0.2) inset;
      transform: translate3d(calc(var(--parallax-x) * 0.09), calc(var(--parallax-y) * 0.09), 0) scale(1.03);
    }

    .icon-badge {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #A5F3FC;
      border: 1px solid rgba(125, 211, 252, 0.35);
      background: radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.35), rgba(14, 165, 233, 0.09));
      box-shadow: 0 0 14px rgba(14, 165, 233, 0.28);
      animation: iconDrift 3.8s ease-in-out infinite;
    }

    .icon-badge svg {
      width: 20px;
      height: 20px;
      stroke: currentColor;
    }

    .value-card h3 {
      margin: 12px 0 0;
      color: #F8FAFC;
      font-size: clamp(20px, 2vw, 24px);
      line-height: 1.25;
      letter-spacing: -0.01em;
      font-weight: 760;
    }

    .value-card p {
      margin: 9px 0 0;
      color: #94A3B8;
      font-size: 13px;
    }

    @media (min-width: 860px) {
      .value-shell {
        padding: 38px 30px 30px;
      }

      .value-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .flow-lines {
        display: block;
      }
    }

    @keyframes particleFloat {
      0% {
        transform: translate3d(calc(var(--particle-shift-x) * var(--depth)), calc(var(--particle-shift-y) * var(--depth)), 0);
      }
      50% {
        transform: translate3d(
          calc(8px + (var(--particle-shift-x) * var(--depth))),
          calc(-11px + (var(--particle-shift-y) * var(--depth))),
          0
        );
      }
      100% {
        transform: translate3d(calc(var(--particle-shift-x) * var(--depth)), calc(var(--particle-shift-y) * var(--depth)), 0);
      }
    }

    @keyframes flowDash {
      from { stroke-dashoffset: 0; }
      to { stroke-dashoffset: -140; }
    }

    @keyframes iconDrift {
      0% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-2px) scale(1.06); }
      100% { transform: translateY(0) scale(1); }
    }
  `],
})
export class BeforeAfterSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('valueShell') valueShell?: ElementRef<HTMLDivElement>;

  private observer?: IntersectionObserver;
  parallaxX = 0;
  parallaxY = 0;

  deliveryItems: DeliveryItem[] = [
    {
      title: 'Essential Tracking',
      detail: 'Always-on location visibility with clean route history to keep operations grounded.',
      icon: 'essential',
    },
    {
      title: 'Advanced Tracking',
      detail: 'Route intelligence and behavioral context to reduce delays and improve utilization.',
      icon: 'advanced',
    },
    {
      title: 'Intelligent Tracking',
      detail: 'Smart signal interpretation that helps teams respond faster to live fleet conditions.',
      icon: 'intelligent',
    },
    {
      title: 'Certified Safety Solutions',
      detail: 'Compliance-friendly controls that strengthen driver safety and audit confidence.',
      icon: 'safety',
    },
  ];

  particles: Particle[] = [
    { top: '8%', left: '9%', size: 6, opacity: 0.48, delay: '0s', duration: '6.2s', depth: 0.7 },
    { top: '13%', left: '35%', size: 7, opacity: 0.42, delay: '1.1s', duration: '7.1s', depth: 0.95 },
    { top: '12%', left: '73%', size: 5, opacity: 0.45, delay: '0.4s', duration: '5.7s', depth: 0.8 },
    { top: '25%', left: '90%', size: 7, opacity: 0.33, delay: '1.8s', duration: '6.8s', depth: 0.9 },
    { top: '38%', left: '12%', size: 8, opacity: 0.36, delay: '2.2s', duration: '7.4s', depth: 0.75 },
    { top: '44%', left: '45%', size: 6, opacity: 0.4, delay: '1.4s', duration: '6.4s', depth: 0.85 },
    { top: '48%', left: '83%', size: 7, opacity: 0.38, delay: '2.6s', duration: '7.3s', depth: 0.92 },
    { top: '62%', left: '7%', size: 5, opacity: 0.35, delay: '0.7s', duration: '6.2s', depth: 0.82 },
    { top: '67%', left: '32%', size: 6, opacity: 0.39, delay: '2.9s', duration: '6.8s', depth: 0.88 },
    { top: '72%', left: '61%', size: 5, opacity: 0.44, delay: '1.9s', duration: '5.8s', depth: 0.74 },
    { top: '80%', left: '88%', size: 7, opacity: 0.34, delay: '2.1s', duration: '7.2s', depth: 0.98 },
    { top: '86%', left: '20%', size: 6, opacity: 0.3, delay: '1.5s', duration: '6.6s', depth: 0.84 },
  ];

  ngAfterViewInit(): void {
    if (!this.valueShell) {
      return;
    }

    const shell = this.valueShell.nativeElement;
    if (typeof IntersectionObserver === 'undefined') {
      shell.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          shell.classList.add('is-visible');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    this.observer.observe(shell);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.valueShell) {
      return;
    }

    const rect = this.valueShell.nativeElement.getBoundingClientRect();
    const normalizedX = (event.clientX - rect.left) / rect.width;
    const normalizedY = (event.clientY - rect.top) / rect.height;

    this.parallaxX = (normalizedX - 0.5) * 18;
    this.parallaxY = (normalizedY - 0.5) * 16;
  }

  resetParallax(): void {
    this.parallaxX = 0;
    this.parallaxY = 0;
  }
}
