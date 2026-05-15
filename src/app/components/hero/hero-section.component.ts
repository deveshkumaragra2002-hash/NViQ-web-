import {
  AfterViewInit, Component, ElementRef, EventEmitter,
  OnDestroy, OnInit, Output, ViewChild, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-root" id="home">

      <!-- Particle canvas -->
      <canvas #particleCanvas class="hero-canvas" aria-hidden="true"></canvas>

      <!-- Ambient orbs -->
      <div class="orb orb-1" aria-hidden="true"></div>
      <div class="orb orb-2" aria-hidden="true"></div>

      <!-- Grid -->
      <div class="hero-grid" aria-hidden="true"></div>

      <!-- Floating icons -->
      <div class="float-icons" aria-hidden="true">
        <div class="fi fi-truck" [class.show]="vis">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <div class="fi fi-chart" [class.show]="vis">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div class="fi fi-coin" [class.show]="vis">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9.5C9 8.1 10.3 7 12 7s3 1.1 3 2.5S13.7 12 12 12s-3 1.1-3 2.5S10.3 17 12 17s3-1.1 3-2.5"/>
          </svg>
        </div>
        <div class="fi fi-map" [class.show]="vis">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"/><circle cx="12" cy="11" r="3"/>
          </svg>
        </div>
        <div class="fi fi-bolt" [class.show]="vis">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9z"/>
          </svg>
        </div>
      </div>

      <!-- Main content -->
      <div class="hero-content">

        <!-- Badge -->
        <div class="hero-badge" [class.reveal]="vis" style="transition-delay:0ms">
          <span class="badge-pulse"></span>
          Smart Fleet · Mutual Funds · India
        </div>

        <!-- Headline -->
          <div class="hero-headline" [class.reveal]="vis" style="transition-delay:120ms">
            <span class="hl-line-1">Drive with Data. Grow Your Wealth.</span>
          </div>

        <!-- Sub -->
        <p class="hero-sub" [class.reveal]="vis" style="transition-delay:220ms">
          <strong>Free Consultation • AMFI Registered • ARN No: 359231.</strong> Smart mutual fund investment solutions with SIP plans starting at <strong>₹1,000/month.</strong>
        </p>

        <!-- CTAs -->
        <div class="hero-ctas" [class.reveal]="vis" style="transition-delay:320ms">
          <button class="btn-primary-hero ripple-btn" (click)="onRipple($event); openLeadModal()" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></svg>
            Start Free Trial
          </button>
          <button class="btn-ghost-hero ripple-btn" (click)="onRipple($event); scrollToFeatures()" type="button">
            See How It Works
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Metrics -->
        <div class="hero-metrics" [class.reveal]="vis" style="transition-delay:440ms">
          <div class="hm-item" *ngFor="let m of metrics">
            <strong>{{ m.val }}</strong>
            <span>{{ m.label }}</span>
          </div>
        </div>

      </div>

      <!-- Scroll hint -->
      <div class="scroll-hint" [class.show]="vis" aria-hidden="true">
        <span class="sh-line"></span>
      </div>

    </section>
  `,
  styles: [`
    /* ── Root ──────────────────────────────────────────── */
    .hero-root {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      isolation: isolate;
      padding: 120px 24px 80px;
      background: #030810;
    }

    /* ── Canvas ─────────────────────────────────────────── */
    .hero-canvas {
      position: absolute;
      inset: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    /* ── Orbs ───────────────────────────────────────────── */
    .orb {
      position: absolute; border-radius: 50%;
      filter: blur(90px); pointer-events: none; z-index: 1;
    }
    .orb-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(0,212,255,0.14) 0%, transparent 65%);
      top: -180px; left: -120px;
      animation: orbFloat1 16s ease-in-out infinite;
    }
    .orb-2 {
      width: 480px; height: 480px;
      background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%);
      bottom: -100px; right: -80px;
      animation: orbFloat2 20s ease-in-out infinite;
    }
    @keyframes orbFloat1 {
      0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,40px) scale(1.1)}
    }
    @keyframes orbFloat2 {
      0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,-50px) scale(1.08)}
    }

    /* ── Grid ───────────────────────────────────────────── */
    .hero-grid {
      position: absolute; inset: 0; z-index: 1;
      background-image:
        linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 90% 80% at 50% 40%, black 20%, transparent 100%);
    }

    /* ── Floating icons ─────────────────────────────────── */
    .float-icons { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
    .fi {
      position: absolute;
      padding: 12px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.07);
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(8px);
      color: rgba(0,212,255,0.7);
      opacity: 0; transform: translateY(20px) scale(0.8);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .fi.show { opacity: 1; transform: none; }
    .fi-truck { top: 22%; left: 6%; animation: fiFloat 7s ease-in-out 0.2s infinite; transition-delay: 0.6s; }
    .fi-chart  { top: 15%; right: 8%; animation: fiFloat 9s ease-in-out 0.5s infinite; transition-delay: 0.9s; color: rgba(99,102,241,0.7); border-color: rgba(99,102,241,0.15); }
    .fi-coin   { bottom: 28%; left: 9%; animation: fiFloat 8s ease-in-out 1s infinite; transition-delay: 1.2s; color: rgba(251,191,36,0.7); border-color: rgba(251,191,36,0.15); }
    .fi-map    { top: 60%; right: 7%; animation: fiFloat 10s ease-in-out 0.3s infinite; transition-delay: 1.5s; }
    .fi-bolt   { top: 38%; right: 14%; animation: fiFloat 6s ease-in-out 0.8s infinite; transition-delay: 0.3s; color: rgba(52,211,153,0.7); border-color: rgba(52,211,153,0.15); }

    @keyframes fiFloat {
      0%,100%{transform:translateY(0) rotate(0deg)}
      33%{transform:translateY(-12px) rotate(3deg)}
      66%{transform:translateY(-6px) rotate(-2deg)}
    }

    /* ── Content ────────────────────────────────────────── */
    .hero-content {
      position: relative; z-index: 3;
      text-align: center; max-width: 920px; width: 100%;
      display: flex; flex-direction: column; align-items: center; gap: 0;
    }

    /* ── Reveal utility ─────────────────────────────────── */
    .hero-badge, .hero-headline, .hero-sub, .hero-ctas, .hero-metrics {
      opacity: 0; transform: translateY(28px);
      transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1),
                  transform 0.8s cubic-bezier(0.22,1,0.36,1);
    }
    .reveal { opacity: 1 !important; transform: none !important; }

    /* ── Badge ──────────────────────────────────────────── */
    .hero-badge {
      display: inline-flex; align-items: center; gap: 9px;
      padding: 7px 20px; border-radius: 999px;
      border: 1px solid rgba(0,212,255,0.2);
      background: rgba(0,212,255,0.06);
      backdrop-filter: blur(10px);
      color: #00D4FF;
      font-size: 12px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      margin-bottom: 36px;
    }
    .badge-pulse {
      width: 7px; height: 7px; border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 4px rgba(34,197,94,0.2);
      animation: bpulse 1.8s ease-in-out infinite;
    }
    @keyframes bpulse {
      0%,100%{box-shadow:0 0 0 4px rgba(34,197,94,0.2)}
      50%{box-shadow:0 0 0 8px rgba(34,197,94,0.05)}
    }

    /* ── Headline ───────────────────────────────────────── */
    .hero-headline {
      display: flex; flex-direction: row; align-items: center; gap: 20px;
      font-family: 'Outfit', sans-serif;
      font-weight: 900; line-height: 0.9;
      letter-spacing: -0.04em;
      margin-bottom: 28px;
    }
    .hl-line-1 {
      font-size: clamp(4rem, 11vw, 9.5rem);
      background: linear-gradient(120deg, #00D4FF 0%, #38bdf8 45%, #818cf8 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      background-size: 200%;
      animation: shimmerText 5s linear infinite;
    }
    .hl-line-2 {
      font-size: clamp(3.6rem, 10vw, 8.5rem);
      color: #F0F6FF;
    }
    @keyframes shimmerText {
      0%{background-position:0% 50%} 100%{background-position:200% 50%}
    }

    /* ── Sub ────────────────────────────────────────────── */
    .hero-sub {
      color: #94A3B8; font-size: clamp(0.95rem, 1.4vw, 1.15rem);
      line-height: 1.72; max-width: 620px; margin-bottom: 40px;
    }
    .hero-sub strong { color: #00D4FF; font-weight: 600; }

    /* ── CTAs ───────────────────────────────────────────── */
    .hero-ctas {
      display: flex; align-items: center; justify-content: center;
      gap: 16px; flex-wrap: wrap; margin-bottom: 52px;
    }
    .ripple-btn {
      position: relative; overflow: hidden;
    }
    .btn-primary-hero {
      display: inline-flex; align-items: center; gap: 9px;
      height: 56px; padding: 0 32px; border-radius: 16px; border: none;
      background: linear-gradient(135deg, #00D4FF 0%, #6366F1 100%);
      color: #fff; font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 36px rgba(0,212,255,0.35);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .btn-primary-hero:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 16px 52px rgba(0,212,255,0.5);
    }
    .btn-ghost-hero {
      display: inline-flex; align-items: center; gap: 9px;
      height: 56px; padding: 0 28px; border-radius: 16px;
      border: 1px solid rgba(148,163,184,0.22);
      background: rgba(255,255,255,0.04);
      color: #94A3B8; font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 600; cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.25s ease;
    }
    .btn-ghost-hero:hover {
      border-color: rgba(0,212,255,0.35);
      color: #00D4FF;
      background: rgba(0,212,255,0.07);
      transform: translateY(-2px);
    }
    /* Ripple effect */
    :host ::ng-deep .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      transform: scale(0);
      animation: rippleAnim 0.6s linear;
      pointer-events: none;
    }
    @keyframes rippleAnim {
      to { transform: scale(4); opacity: 0; }
    }

    /* ── Metrics ────────────────────────────────────────── */
    .hero-metrics {
      display: inline-flex; align-items: center; gap: 0;
      padding: 16px 28px; border-radius: 18px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(8,13,26,0.65);
      backdrop-filter: blur(12px);
      flex-wrap: wrap; justify-content: center; row-gap: 12px;
    }
    .hm-item {
      display: flex; flex-direction: column; align-items: center;
      padding: 0 28px;
      border-right: 1px solid rgba(255,255,255,0.06);
    }
    .hm-item:last-child { border-right: none; }
    .hm-item strong {
      font-size: clamp(1.1rem, 1.6vw, 1.4rem);
      font-weight: 800; color: #F0F6FF;
      letter-spacing: -0.02em; line-height: 1;
    }
    .hm-item span {
      font-size: 11px; font-weight: 600;
      color: #475569; text-transform: uppercase;
      letter-spacing: 0.09em; margin-top: 5px;
    }

    /* ── Scroll hint ─────────────────────────────────────── */
    .scroll-hint {
      position: absolute; bottom: 32px; left: 50%;
      transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center;
      opacity: 0; transition: opacity 1s ease 1.2s;
    }
    .scroll-hint.show { opacity: 1; }
    .sh-line {
      width: 1px; height: 52px;
      background: linear-gradient(to bottom, #00D4FF, transparent);
      animation: shScroll 2s ease-in-out infinite;
    }
    @keyframes shScroll {
      0%,100%{transform:scaleY(1) translateY(0);opacity:1}
      50%{transform:scaleY(0.5) translateY(10px);opacity:0.3}
    }

    /* ── Responsive ─────────────────────────────────────── */
    @media (max-width: 768px) {
      .fi-truck,.fi-chart,.fi-coin,.fi-map,.fi-bolt { display: none; }
      .hero-metrics { padding: 12px 16px; }
      .hm-item { padding: 0 14px; }
      .hm-item:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.06); }
    }
    @media (max-width: 480px) {
      .btn-primary-hero,.btn-ghost-hero { width: 100%; justify-content: center; }
      .hero-ctas { flex-direction: column; }
    }
  `]
})
export class HeroSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() openModal = new EventEmitter<void>();
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private nav = inject(NavService);

  openLeadModal(): void {
    this.nav.openModalFor(this.nav.product() ?? 'mf');
  }

  vis = false;
  private rafId: number | null = null;
  private resizeHandler!: () => void;

  metrics = [
    { val: '99.92%', label: 'Uptime SLA' },
    { val: '24×7',   label: 'Live Alerts' },
    { val: '3.2×',   label: 'Faster Dispatch' },
    { val: '10,000+',label: 'Vehicles Tracked' },
  ];

  ngOnInit(): void {
    requestAnimationFrame(() => setTimeout(() => { this.vis = true; }, 100));
  }

  ngAfterViewInit(): void {
    this.initParticles();
  }

  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    this.resizeHandler = resize;
    window.addEventListener('resize', resize);

    const count = window.innerWidth < 768 ? 40 : 80;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.2 + 0.4,
    }));

    const LINK_DIST = 130;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,0.55)';
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${0.18 * (1 - d / LINK_DIST)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      this.rafId = requestAnimationFrame(draw);
    };

    this.rafId = requestAnimationFrame(draw);
  }

  onRipple(event: MouseEvent): void {
    const btn = event.currentTarget as HTMLElement;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const rect = btn.getBoundingClientRect();
    circle.className = 'ripple';
    circle.style.cssText = `
      width:${diameter}px; height:${diameter}px;
      left:${event.clientX - rect.left - diameter / 2}px;
      top:${event.clientY - rect.top - diameter / 2}px;
    `;
    btn.querySelector('.ripple')?.remove();
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 700);
  }

  scrollToFeatures(): void {
    const el = document.getElementById('fleet-solutions');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.resizeHandler);
  }
}
