import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="features" class="py-20" style="background: linear-gradient(180deg, #0F172A 0%, #080A12 100%)">
      <div class="max-w-[1280px] mx-auto px-6">
        <h2 class="text-white text-center mb-14"
          style="font-size: clamp(28px, 3.5vw, 44px); font-weight:800">
          Control Your Fleet.
          <span style="background: linear-gradient(135deg, #3B82F6, #06B6D4); -webkit-background-clip:text; -webkit-text-fill-color:transparent">
            Save More Every Month.
          </span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div *ngFor="let f of features; let i = index"
            class="rounded-2xl border border-white/5 hover:border-white/15 p-5 text-center transition-all hover:-translate-y-1 cursor-default"
            style="background: rgba(255,255,255,.02)">
            <canvas #featureCanvas class="mx-auto" style="width:140px; height:140px"></canvas>
            <h3 class="text-white mt-2" style="font-size:18px; font-weight:700">{{ f.title }}</h3>
            <p class="text-[#94A3B8] mt-1 mb-3" style="font-size:13px">{{ f.desc }}</p>
            <div class="flex gap-2">
              <div *ngFor="let m of f.metrics" class="flex-1 rounded-lg p-1.5" style="background: rgba(255,255,255,.05)">
                <div class="text-white" style="font-size:12px; font-weight:700">{{ m.value }}</div>
                <div style="font-size:9px; color:#64748B">{{ m.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class FeaturesSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('featureCanvas') canvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  private animIds: number[] = [];

  features = [
    {
      title: 'Live Tracking', desc: 'Know the exact location of every vehicle in real time.',
      metrics: [{ value: 'Real-time', label: 'Tracking' }, { value: 'High', label: 'Accuracy' }, { value: '100%', label: 'Visibility' }]
    },
    {
      title: 'Instant Alerts', desc: 'Get notified instantly about fuel theft, overspeeding, or excessive idle time.',
      metrics: [{ value: 'Fuel Theft', label: 'Alert' }, { value: 'Overspeed', label: 'Instant' }, { value: 'Idle', label: 'Monitor' }]
    },
    {
      title: 'Smart Analytics', desc: 'Discover hidden savings with fuel efficiency insights and optimized routes.',
      metrics: [{ value: '10–15%', label: 'Fuel Saving' }, { value: '+30%', label: 'Efficiency' }, { value: 'Routes', label: 'Optimized' }]
    },
    {
      title: 'Easy Integration', desc: 'Seamlessly connect with your existing systems for smooth operations.',
      metrics: [{ value: 'Fast', label: 'Setup' }, { value: 'API', label: 'Ready' }, { value: '100%', label: 'Compatible' }]
    },
  ];

  ngAfterViewInit() {
    this.canvases.forEach((canvasRef, i) => {
      const canvas = canvasRef.nativeElement;
      const ctx = canvas.getContext('2d')!;
      const size = 140;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = size * dpr; canvas.height = size * dpr;
      ctx.scale(dpr, dpr);

      const colors = ['#22C55E', '#EF4444', '#3B82F6', '#06B6D4'];
      const color = colors[i] || '#3B82F6';
      const bars = [.25, .4, .35, .6, .55, .75, .7, .9, .82, .95];
      const animated = bars.map(() => 0);

      const draw = () => {
        ctx.clearRect(0, 0, size, size);
        const t = performance.now() * 0.001;
        const cx = size / 2, cy = size / 2;

        if (i === 0) {
          // GPS pin
          for (let j = 0; j < 3; j++) {
            const ph = (t * 0.8 + j * 0.33) % 1;
            ctx.strokeStyle = `rgba(34,197,94,${(1 - ph) * 0.18})`; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(cx, cy + 6, 14 + ph * 40, 0, Math.PI * 2); ctx.stroke();
          }
          const bob = Math.sin(t * 2) * 4;
          ctx.fillStyle = color;
          ctx.beginPath(); ctx.moveTo(cx, cy + 14 + bob); ctx.quadraticCurveTo(cx - 16, cy - 2 + bob, cx - 16, cy - 12 + bob);
          ctx.arc(cx, cy - 12 + bob, 16, Math.PI, 0, false); ctx.quadraticCurveTo(cx + 16, cy - 2 + bob, cx, cy + 14 + bob); ctx.fill();
          ctx.fillStyle = '#060810'; ctx.beginPath(); ctx.arc(cx, cy - 12 + bob, 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#4ADE80'; ctx.beginPath(); ctx.arc(cx, cy - 12 + bob, 3.5, 0, Math.PI * 2); ctx.fill();
        } else if (i === 1) {
          // Bell
          const flash = Math.sin(t * 3) > 0 ? 0.1 : 0.04;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
          g.addColorStop(0, `rgba(239,68,68,${flash})`); g.addColorStop(1, 'rgba(239,68,68,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 32, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#EF4444';
          ctx.beginPath(); ctx.moveTo(cx - 16, cy + 5); ctx.quadraticCurveTo(cx - 16, cy - 16, cx - 5, cy - 20);
          ctx.lineTo(cx - 2, cy - 24); ctx.lineTo(cx + 2, cy - 24); ctx.lineTo(cx + 5, cy - 20);
          ctx.quadraticCurveTo(cx + 16, cy - 16, cx + 16, cy + 5); ctx.lineTo(cx + 18, cy + 7); ctx.lineTo(cx - 18, cy + 7);
          ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.arc(cx, cy + 12, 4, 0, Math.PI * 2); ctx.fill();
        } else {
          // Bar chart
          const baseY = size * .8, bW = 7, gap = 5;
          const total = bars.length * (bW + gap) - gap, sx = (size - total) / 2, maxH = size * .58;
          bars.forEach((tgt, bi) => {
            const wave = tgt + Math.sin(t * 1.5 + bi * .5) * .06;
            animated[bi] += (wave - animated[bi]) * 0.05;
            const bh = animated[bi] * maxH, x = sx + bi * (bW + gap);
            const bg = ctx.createLinearGradient(x, baseY, x, baseY - bh);
            bg.addColorStop(0, color); bg.addColorStop(1, color + 'aa');
            ctx.fillStyle = bg;
            ctx.beginPath(); ctx.roundRect(x, baseY - bh, bW, bh, [3, 3, 0, 0]); ctx.fill();
          });
        }
        this.animIds[i] = requestAnimationFrame(draw);
      };
      this.animIds[i] = requestAnimationFrame(draw);
    });
  }

  ngOnDestroy() { this.animIds.forEach(id => cancelAnimationFrame(id)); }
}
