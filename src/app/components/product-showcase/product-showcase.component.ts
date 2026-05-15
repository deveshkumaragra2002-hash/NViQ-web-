import {
  AfterViewInit, Component, ElementRef,
  NgZone, OnDestroy, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService, ProductKey } from '../../services/nav.service';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';

type ProductId = ProductKey;

interface ShowcaseFloat {
  label: string;
  value: string;
}

interface ShowcaseProduct {
  id: ProductId;
  title: string;
  subtitle: string;
  features: string[];
  accent: string;
  gradient: string;
  visual: 'mf' | 'gps' | 'fastag' | 'drone';
  floats: ShowcaseFloat[];
  enquiryCta: string;
}

interface Pt3D {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  r: number; baseOpacity: number;
}

@Component({
  selector: 'app-product-showcase',
  standalone: true,
  imports: [CommonModule, RevealDirective, TiltDirective],
  templateUrl: './product-showcase.component.html',
  styleUrls: ['./product-showcase.component.css'],
})
export class ProductShowcaseComponent implements AfterViewInit, OnDestroy {

  @ViewChild('ptCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private rafId = 0;
  private cleanupFn?: () => void;

  readonly products: ShowcaseProduct[] = [
    {
      id: 'gps',
      title: 'GPS Tracking System',
      subtitle: 'Real-time fleet visibility & smart alerts',
      features: ['Live vehicle tracking', 'Geo-fencing & alerts', 'Route analytics'],
      accent: '#00D4FF',
      gradient: '',
      visual: 'gps',
      floats: [
        { label: 'Live',   value: 'Tracking' },
        { label: 'Status', value: 'Active' },
        { label: 'Alerts', value: 'Geo-fence' },
      ],
      enquiryCta: 'Start Free Trial',
    },
    {
      id: 'mf',
      title: 'Mutual Fund Platform',
      subtitle: 'Smart investing for a better tomorrow',
      features: [
        'Goal based investing with SIP',
        'AI-powered recommendations',
        'Real-time tracking & insights',
      ],
      accent: '#22c55e',
      gradient: '',
      visual: 'mf',
      floats: [
        { label: 'Returns', value: '+18.6%' },
        { label: 'Status',  value: 'SIP Active' },
        { label: 'Alerts',  value: 'Market' },
      ],
      enquiryCta: 'Start Investing Today',
    },
    {
      id: 'fastag',
      title: 'FASTag (Fast Track System)',
      subtitle: 'Seamless toll payments for your fleet',
      features: ['Instant recharge', 'Low balance alerts', 'Nationwide coverage'],
      accent: '#3B82F6',
      gradient: '',
      visual: 'fastag',
      floats: [
        { label: 'Balance', value: '₹1,250' },
        { label: 'Status',  value: 'Ready' },
        { label: 'Mode',    value: 'Auto-Recharge' },
      ],
      enquiryCta: 'Request Demo',
    },
    {
      id: 'drone',
      title: 'Agriculture Drone',
      subtitle: 'Smart farming from the sky',
      features: ['Automated spraying', 'Live field monitoring', 'Long battery life'],
      accent: '#a855f7',
      gradient: '',
      visual: 'drone',
      floats: [
        { label: 'Battery', value: '92%' },
        { label: 'Status',  value: 'In Field' },
        { label: 'Alerts',  value: 'Crop Health' },
      ],
      enquiryCta: 'Request Demo',
    },
  ];

  constructor(private nav: NavService, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => this.initParticles());
  }

  ngOnDestroy(): void {
    this.cleanupFn?.();
  }

  openProduct(productId: ProductKey): void {
    this.nav.go('product-detail', productId);
  }

  openEnquiry(productId: ProductKey, event: Event): void {
    event.stopPropagation();
    this.nav.openModalFor(productId);
  }

  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = 160;
    const DEPTH = 700;
    const FOV   = 420;
    const LINK  = 160;
    const MOUSE_RADIUS = 130;

    const COLORS = [
      '99,179,255',   // light blue
      '147,197,253',  // sky blue
      '165,180,252',  // indigo light
      '96,165,250',   // blue
      '52,211,153',   // teal
    ];

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth;
      canvas.height = canvas.offsetHeight || 800;
    };
    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    let mx = -9999, my = -9999;
    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => { mx = -9999; my = -9999; };
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);

    // Main particles
    const pts = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 2600,
      y: (Math.random() - 0.5) * 1800,
      z: Math.random() * DEPTH - DEPTH / 2,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18,
      vz: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 2.2 + 0.8,
      baseOpacity: Math.random() * 0.35 + 0.20,
      ci: Math.floor(Math.random() * COLORS.length),
      ring: Math.random() < 0.18,
      pulse: Math.random() * Math.PI * 2,
      // wave phase for sinusoidal drift
      wavePhase: Math.random() * Math.PI * 2,
      waveAmp: (Math.random() * 0.08 + 0.04),
    }));

    // Hero particles — 6 large glowing anchors
    const HERO = Array.from({ length: 6 }, () => ({
      x: (Math.random() - 0.5) * 2200,
      y: (Math.random() - 0.5) * 1400,
      z: Math.random() * 200 - 100,
      vx: (Math.random() - 0.5) * 0.10,
      vy: (Math.random() - 0.5) * 0.08,
      r: Math.random() * 3 + 4,
      pulse: Math.random() * Math.PI * 2,
      ci: Math.floor(Math.random() * COLORS.length),
    }));

    // Shooting stars
    interface Star { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; trail: {x:number;y:number}[]; }
    const stars: Star[] = [];
    const spawnStar = () => {
      const side = Math.random();
      let x: number, y: number, vx: number, vy: number;
      if (side < 0.5) { x = -20; y = Math.random() * canvas.height; vx = Math.random() * 5 + 4; vy = (Math.random() - 0.5) * 2; }
      else            { x = canvas.width + 20; y = Math.random() * canvas.height; vx = -(Math.random() * 5 + 4); vy = (Math.random() - 0.5) * 2; }
      const maxLife = Math.floor(Math.random() * 60 + 50);
      stars.push({ x, y, vx, vy, life: maxLife, maxLife, trail: [] });
    };

    let frame = 0;
    let nextStar = Math.floor(Math.random() * 200 + 100);

    const draw = () => {
      this.rafId = requestAnimationFrame(draw);
      frame++;
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      // — Shooting stars —
      if (frame === nextStar) { spawnStar(); nextStar = frame + Math.floor(Math.random() * 220 + 120); }
      for (let si = stars.length - 1; si >= 0; si--) {
        const s = stars[si];
        s.trail.unshift({ x: s.x, y: s.y });
        if (s.trail.length > 18) s.trail.pop();
        s.x += s.vx; s.y += s.vy; s.life--;
        if (s.life <= 0) { stars.splice(si, 1); continue; }
        const lifeRatio = s.life / s.maxLife;
        // draw trail
        for (let ti = 0; ti < s.trail.length; ti++) {
          const t = s.trail[ti];
          const tAlpha = lifeRatio * (1 - ti / s.trail.length) * 0.55;
          const tR = (1 - ti / s.trail.length) * 2.5 * lifeRatio;
          ctx.beginPath();
          ctx.arc(t.x, t.y, Math.max(tR, 0.3), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,179,255,${tAlpha})`;
          ctx.fill();
        }
        // head glow
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8 * lifeRatio);
        g.addColorStop(0, `rgba(165,180,252,${lifeRatio * 0.7})`);
        g.addColorStop(1, 'rgba(99,179,255,0)');
        ctx.beginPath();
        ctx.arc(s.x, s.y, 8 * lifeRatio, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      // — Project main particles —
      const proj = pts.map(p => {
        const scale = FOV / (FOV + p.z + DEPTH / 2);
        return { sx: cx + p.x * scale, sy: cy + p.y * scale, scale, p };
      });

      // — Connection lines with gradient stroke —
      for (let i = 0; i < proj.length; i++) {
        for (let j = i + 1; j < proj.length; j++) {
          const a = proj[i], b = proj[j];
          const dx = a.sx - b.sx, dy = a.sy - b.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK) {
            const alpha = (1 - dist / LINK) * 0.28 * Math.min(a.scale, b.scale) * 3.0;
            const grad = ctx.createLinearGradient(a.sx, a.sy, b.sx, b.sy);
            grad.addColorStop(0, `rgba(${COLORS[a.p.ci]},${alpha})`);
            grad.addColorStop(1, `rgba(${COLORS[b.p.ci]},${alpha * 0.5})`);
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // — Main particles —
      for (const { sx, sy, scale, p } of proj) {
        const radius  = p.r * scale * 2.8;
        const pulseFactor = 0.85 + 0.15 * Math.sin(p.pulse + frame * 0.025);
        const opacity = p.baseOpacity * Math.min(scale * 2.5, 1) * pulseFactor;
        const col = COLORS[p.ci];

        // Mouse repulsion: push particle screen-coords away from cursor
        const dxm = sx - mx, dym = sy - my;
        const distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < MOUSE_RADIUS && distM > 0) {
          const force = (MOUSE_RADIUS - distM) / MOUSE_RADIUS * 1.8;
          p.x += (dxm / distM) * force * (1 / scale);
          p.y += (dym / distM) * force * (1 / scale);
        }

        if (p.ring) {
          ctx.beginPath();
          ctx.arc(sx, sy, radius * 1.8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${col},${opacity * 0.85})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
          // inner dot
          ctx.beginPath();
          ctx.arc(sx, sy, radius * 0.55, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${col},${opacity * 0.55})`;
          ctx.fill();
        } else {
          // Solid dot
          ctx.beginPath();
          ctx.arc(sx, sy, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${col},${opacity})`;
          ctx.fill();

          // Glow halo
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 5);
          g.addColorStop(0,   `rgba(${col},${opacity * 0.38})`);
          g.addColorStop(0.5, `rgba(99,179,255,${opacity * 0.13})`);
          g.addColorStop(1,   'rgba(99,179,255,0)');
          ctx.beginPath();
          ctx.arc(sx, sy, radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        // move + wave drift
        p.x += p.vx + Math.sin(p.wavePhase + frame * 0.008) * p.waveAmp;
        p.y += p.vy + Math.cos(p.wavePhase + frame * 0.006) * p.waveAmp;
        p.z += p.vz;
        const half = DEPTH / 2;
        if (p.z >  half) p.z = -half;
        if (p.z < -half) p.z =  half;
        if (p.x >  1400) p.x = -1400;
        if (p.x < -1400) p.x =  1400;
        if (p.y >  950)  p.y = -950;
        if (p.y < -950)  p.y =  950;
      }

      // — Hero particles (large glowing orbs) —
      for (const h of HERO) {
        const scale = FOV / (FOV + h.z + DEPTH / 2);
        const sx = cx + h.x * scale, sy = cy + h.y * scale;
        const radius = h.r * scale * 3.2;
        const pf = 0.7 + 0.3 * Math.sin(h.pulse + frame * 0.018);
        const opacity = 0.55 * pf;
        const col = COLORS[h.ci];

        // outer ring
        ctx.beginPath();
        ctx.arc(sx, sy, radius * 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${col},${opacity * 0.35})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // core
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${opacity})`;
        ctx.fill();
        // large soft halo
        const hg = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 7);
        hg.addColorStop(0,   `rgba(${col},${opacity * 0.4})`);
        hg.addColorStop(0.4, `rgba(99,179,255,${opacity * 0.15})`);
        hg.addColorStop(1,   'rgba(99,179,255,0)');
        ctx.beginPath();
        ctx.arc(sx, sy, radius * 7, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();

        h.x += h.vx; h.y += h.vy;
        if (h.x >  1200) h.x = -1200;
        if (h.x < -1200) h.x =  1200;
        if (h.y >  800)  h.y = -800;
        if (h.y < -800)  h.y =  800;
      }
    };

    draw();

    this.cleanupFn = () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(this.rafId);
    };
  }
}
