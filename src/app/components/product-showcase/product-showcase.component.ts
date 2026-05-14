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
      accent: '#2563EB',
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
      accent: '#2563EB',
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
      accent: '#2563EB',
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
      accent: '#2563EB',
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

    const COUNT  = 110;
    const DEPTH  = 700;
    const FOV    = 420;
    const LINK   = 130;   // max px distance for connections

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth;
      canvas.height = canvas.offsetHeight || 800;
    };
    window.addEventListener('resize', resize);
    resize();

    const pts: Pt3D[] = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 2400,
      y: (Math.random() - 0.5) * 1600,
      z: Math.random() * DEPTH - DEPTH / 2,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.22,
      vz: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.5,
      baseOpacity: Math.random() * 0.45 + 0.25,
    }));

    const draw = () => {
      this.rafId = requestAnimationFrame(draw);
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2;

      // project 3-D → 2-D
      const proj = pts.map(p => {
        const scale = FOV / (FOV + p.z + DEPTH / 2);
        return { sx: cx + p.x * scale, sy: cy + p.y * scale, scale, p };
      });

      // connections
      for (let i = 0; i < proj.length; i++) {
        for (let j = i + 1; j < proj.length; j++) {
          const a = proj[i], b = proj[j];
          const dx = a.sx - b.sx, dy = a.sy - b.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK) {
            const alpha = (1 - dist / LINK) * 0.18 * Math.min(a.scale, b.scale) * 2.8;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // particles
      for (const { sx, sy, scale, p } of proj) {
        const radius  = p.r * scale * 2.2;
        const opacity = p.baseOpacity * Math.min(scale * 2.2, 1);

        // core dot
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,180,255,${opacity})`;
        ctx.fill();

        // glow halo
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 4);
        g.addColorStop(0,   `rgba(0,212,255,${opacity * 0.55})`);
        g.addColorStop(0.4, `rgba(37,99,235,${opacity * 0.25})`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(sx, sy, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // move
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        const half = DEPTH / 2;
        if (p.z >  half) p.z = -half;
        if (p.z < -half) p.z =  half;
        if (p.x >  1300) p.x = -1300;
        if (p.x < -1300) p.x =  1300;
        if (p.y >  900)  p.y = -900;
        if (p.y < -900)  p.y =  900;
      }
    };

    draw();

    this.cleanupFn = () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(this.rafId);
    };
  }
}
