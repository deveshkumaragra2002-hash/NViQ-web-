import {
  Component, Output, EventEmitter,
  AfterViewInit, OnDestroy, ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative min-h-[100vh] flex flex-col overflow-hidden" style="background: #060810">
      <!-- Gradient orbs -->
      <div class="absolute top-10 left-1/4 w-[700px] h-[700px] rounded-full pointer-events-none"
        style="background: radial-gradient(circle, #3B82F6 0%, transparent 70%); filter: blur(120px); opacity: 0.18; animation: pulse1 8s infinite"></div>
      <div class="absolute bottom-20 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style="background: radial-gradient(circle, #06B6D4 0%, transparent 70%); filter: blur(100px); opacity: 0.1; animation: pulse2 10s infinite"></div>

      <!-- Canvas -->
      <div class="absolute inset-0 pt-16">
        <canvas #trackingCanvas class="absolute inset-0 w-full h-full" style="background: #060810"></canvas>
        <div class="absolute inset-0 pointer-events-none"
          style="background: linear-gradient(180deg, rgba(6,8,16,.2) 0%, rgba(6,8,16,.1) 30%, rgba(6,8,16,.5) 70%, rgba(6,8,16,.92) 100%)">
        </div>
      </div>

      <!-- Content -->
      <div class="relative z-10 mt-auto pt-20 sm:pt-24 pb-16 px-4 sm:px-6">
        <div class="max-w-[1280px] mx-auto">
          <div class="max-w-[700px]">

            <h1 class="text-white mb-4"
              style="font-size: clamp(36px, 5vw, 68px); font-weight: 800; line-height: 1.05">
              <span style="background: linear-gradient(135deg, #3B82F6, #06B6D4); -webkit-background-clip: text; background-clip: text; color: transparent">
                Drive With Data
              </span>
            </h1>

            <p class="text-[#94A3B8] mb-6">
              Your drivers earn your trust. Our data makes that trust stronger — saving you up to
              <span class="text-green-400 font-bold">₹15,000 per vehicle every month</span>.
            </p>

            <div class="flex flex-wrap gap-2 sm:gap-4 mb-6 text-[#3B82F6] text-xs sm:text-sm font-medium">
              <span>🚚 Fleet Tracking</span>
              <span>⚡ Instant Alerts</span>
              <span>📊 Smart Analytics</span>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button (click)="openModal.emit()"
                class="px-8 py-4 rounded-xl text-white font-bold transition-transform hover:scale-105"
                style="background: linear-gradient(135deg, #3B82F6, #2563EB)">
                ⚡ Start Free Trial &#64; ₹499 →
              </button>
              <button class="px-8 py-4 rounded-xl border border-[#3B82F6] text-white font-semibold hover:scale-105 transition-transform">
                Schedule Demo
              </button>
            </div>

            <div class="text-green-400 text-sm mt-3 font-semibold">
              💰 Avg savings: ₹10K–₹15K/month per vehicle
            </div>
            <div class="text-[#64748B] text-sm">
              No risk. No setup cost. Start saving from day one.
            </div>
          </div>

          <!-- Metrics -->
          <div class="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[700px]">
            <div *ngFor="let m of metrics" class="rounded-xl px-4 py-3"
              style="background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.05)">
              <div class="text-white text-lg font-bold">{{ m.value }}</div>
              <div class="text-[#64748B] text-xs">{{ m.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes pulse1 { 0%,100%{transform:scale(1);opacity:.15} 50%{transform:scale(1.15);opacity:.22} }
    @keyframes pulse2 { 0%,100%{transform:scale(1.1);opacity:.08} 50%{transform:scale(1);opacity:.14} }
  `]
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  @Output() openModal = new EventEmitter<void>();
  @ViewChild('trackingCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  metrics = [
    { value: '10,000+', label: 'Vehicles Tracked' },
    { value: '500+', label: 'Fleet Operators' },
    { value: '₹24L+', label: 'Fuel Saved / Month' },
    { value: '99.9%', label: 'Uptime' },
  ];

  private animId = 0;
  private vehicles: any[] = [];
  private scanY = 0;

  ngAfterViewInit() { this.initCanvas(); }
  ngOnDestroy() { cancelAnimationFrame(this.animId); }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio, 2);
      w = r.width; h = r.height;
      canvas.width = w * d; canvas.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      if (!this.vehicles.length) this.vehicles = this.initVehicles(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    const lerp = (path: any[], t: number) => {
      if (path.length === 1) return path[0];
      const n = path.length - 1, f = t * n, s = Math.min(Math.floor(f), n - 1), st = f - s;
      return { x: path[s].x + (path[s + 1].x - path[s].x) * st, y: path[s].y + (path[s + 1].y - path[s].y) * st };
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() * 0.001;

      ctx.strokeStyle = `rgba(59,130,246,${0.035 + Math.sin(t * 0.4) * 0.012})`;
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      this.scanY = (this.scanY + 0.5) % h;
      const sg = ctx.createLinearGradient(0, this.scanY - 25, 0, this.scanY + 25);
      sg.addColorStop(0, 'rgba(59,130,246,0)'); sg.addColorStop(0.5, 'rgba(59,130,246,.025)'); sg.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.fillStyle = sg; ctx.fillRect(0, this.scanY - 25, w, 50);

      this.vehicles.forEach(v => {
        if (v.speed) { v.progress += v.speed; if (v.progress > 1) v.progress = 0; }
        const pos = lerp(v.path, v.progress);
        if (v.speed) { v.trail.push({ x: pos.x, y: pos.y }); if (v.trail.length > 45) v.trail.shift(); }

        for (let i = 1; i < v.trail.length; i++) {
          const a = (i / v.trail.length); ctx.strokeStyle = v.color; ctx.globalAlpha = a * a * 0.28; ctx.lineWidth = 1.5 + a * 2;
          ctx.beginPath(); ctx.moveTo(v.trail[i - 1].x, v.trail[i - 1].y); ctx.lineTo(v.trail[i].x, v.trail[i].y); ctx.stroke();
        }
        ctx.globalAlpha = 1;

        const gr = v.status === 'alert' ? 24 + Math.sin(t * 4) * 7 : 18;
        const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, gr);
        g.addColorStop(0, v.color + '40'); g.addColorStop(1, v.color + '00');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pos.x, pos.y, gr, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = v.color; ctx.beginPath(); ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2); ctx.fill();
      });

      this.animId = requestAnimationFrame(draw);
    };
    this.animId = requestAnimationFrame(draw);
  }

  private initVehicles(w: number, h: number) {
    return [
      { color: '#22C55E', status: 'moving', path: [{ x: .05 * w, y: .3 * h }, { x: .45 * w, y: .5 * h }, { x: .95 * w, y: .3 * h }], progress: 0, speed: .0011, trail: [] },
      { color: '#3B82F6', status: 'moving', path: [{ x: .92 * w, y: .2 * h }, { x: .45 * w, y: .38 * h }, { x: .08 * w, y: .78 * h }], progress: 0, speed: .0009, trail: [] },
      { color: '#F59E0B', status: 'idle', path: [{ x: .5 * w, y: .58 * h }], progress: 0, speed: 0, trail: [] },
      { color: '#EF4444', status: 'alert', path: [{ x: .12 * w, y: .72 * h }, { x: .6 * w, y: .72 * h }, { x: .95 * w, y: .68 * h }], progress: 0, speed: .0014, trail: [] },
      { color: '#22C55E', status: 'moving', path: [{ x: .85 * w, y: .82 * h }, { x: .4 * w, y: .82 * h }, { x: .15 * w, y: .45 * h }], progress: 0, speed: .0008, trail: [] },
    ];
  }
}
