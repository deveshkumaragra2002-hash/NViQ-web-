import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-tracking-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="analytics" class="py-24" style="background: #080A12">
      <div class="max-w-[1280px] mx-auto px-6">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#22C55E]/20 mb-4"
            style="background: rgba(34,197,94,0.06)">
            <span class="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block"></span>
            <span class="text-[#22C55E]" style="font-size:13px; font-weight:500">Live Demo</span>
          </div>
          <h2 class="text-white" style="font-size: clamp(28px, 3.5vw, 44px); font-weight:800; letter-spacing:-.03em; line-height:1.1">
            Your Fleet, <span class="text-[#22C55E]">One Screen</span>
          </h2>
        </div>

        <div class="rounded-2xl border border-white/10 overflow-hidden relative"
          style="background: rgba(15,23,42,0.6); box-shadow: 0 0 80px rgba(59,130,246,0.06), 0 25px 50px rgba(0,0,0,0.4)">
          <!-- Toolbar -->
          <div class="flex flex-wrap items-center justify-between px-5 py-3 border-b border-white/5 gap-3">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-[#3B82F6]">🧭</span>
                <span class="text-white" style="font-size:14px; font-weight:600">Fleet Map</span>
              </div>
              <div class="flex items-center gap-2">
                <span *ngFor="let s of statusBadges"
                  class="px-2 py-0.5 rounded-md cursor-default"
                  [style.color]="s.color"
                  [style.background]="s.color + '15'"
                  style="font-size:11px; font-weight:600">{{ s.label }}</span>
              </div>
            </div>
            <div class="text-[#64748B] text-xs">Last sync: {{ syncTime }}s ago</div>
          </div>

          <div class="flex flex-col lg:flex-row">
            <!-- Map -->
            <div class="relative flex-1" style="min-height:500px">
              <canvas #mapCanvas class="absolute inset-0 w-full h-full"
                style="background: linear-gradient(180deg, #070B16 0%, #0A1020 100%)"></canvas>
              <!-- Vehicle labels -->
              <div *ngFor="let v of vehicles" class="absolute z-10"
                [style.left]="v.x + '%'" [style.top]="v.y + '%'">
                <div class="px-3 py-2.5 rounded-lg border whitespace-nowrap cursor-pointer hover:scale-105 transition-transform"
                  style="background: rgba(8,10,18,0.95); backdrop-filter: blur(12px); min-width:180px"
                  [style.borderColor]="statusColor[v.status] + '30'">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-white" style="font-size:12px; font-weight:700">{{ v.plate }}</span>
                    <span class="px-1.5 py-0.5 rounded" style="font-size:10px; font-weight:600"
                      [style.background]="statusColor[v.status] + '20'"
                      [style.color]="statusColor[v.status]">{{ v.status.toUpperCase() }}</span>
                  </div>
                  <div class="text-[#94A3B8]" style="font-size:11px">{{ v.driver }}</div>
                  <div class="text-[#64748B] mt-1" style="font-size:10px">{{ v.heading }}</div>
                  <div class="flex items-center gap-3 mt-2 pt-2 border-t border-white/5">
                    <span class="text-white" style="font-size:11px">{{ v.speed }} km/h</span>
                    <span class="text-[#64748B]" style="font-size:11px">Fuel: {{ v.fuel }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right panel -->
            <div class="w-full lg:w-[280px] border-t lg:border-t-0 lg:border-l border-white/5 p-4 flex flex-col gap-4"
              style="background: rgba(8,10,18,0.6)">
              <div class="text-white" style="font-size:13px; font-weight:600">Fleet Overview</div>

              <div *ngFor="let stat of fleetStats"
                class="rounded-lg border border-white/5 p-3 cursor-default hover:scale-[1.02] transition-transform"
                style="background: rgba(255,255,255,0.01)">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span [style.color]="stat.color">{{ stat.icon }}</span>
                    <span class="text-[#64748B]" style="font-size:11px">{{ stat.label }}</span>
                  </div>
                  <span class="text-white" style="font-size:14px; font-weight:700">{{ stat.value }}</span>
                </div>
                <div class="h-1 rounded-full overflow-hidden" style="background: rgba(255,255,255,.04)">
                  <div class="h-full rounded-full transition-all" [style.width]="stat.pct + '%'" [style.background]="stat.color"></div>
                </div>
              </div>

              <!-- Savings card -->
              <div class="rounded-lg border border-[#06B6D4]/20 p-3 mt-auto cursor-default"
                style="background: rgba(6,182,212,0.04)">
                <div class="text-[#06B6D4]" style="font-size:10px; font-weight:600; letter-spacing:.05em">TODAY'S SAVINGS</div>
                <div class="text-white mt-1" style="font-size:24px; font-weight:800">₹4,200</div>
                <div class="text-[#06B6D4]" style="font-size:11px">+12% vs yesterday</div>
              </div>

              <!-- Ticker -->
              <div class="rounded-lg border border-white/5 p-3" style="background: rgba(255,255,255,.01)">
                <div class="text-[#64748B] mb-2" style="font-size:10px; font-weight:600; letter-spacing:.05em">LIVE EVENTS</div>
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"></div>
                  <span class="text-[#94A3B8] truncate" style="font-size:11px">{{ currentEvent }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LiveTrackingSectionComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('mapCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private animId = 0;
  private tickerInterval: any;
  private syncInterval: any;
  private tickerIndex = 0;
  syncTime = 3;
  currentEvent = 'MH-12-AB-1234 crossed Lonavala checkpoint';

  statusColor: Record<string, string> = { moving: '#22C55E', idle: '#F59E0B', alert: '#EF4444' };

  statusBadges = [
    { label: '4 Moving', color: '#22C55E' },
    { label: '1 Idle', color: '#F59E0B' },
    { label: '1 Alert', color: '#EF4444' },
  ];

  vehicles = [
    { id: 'TRK-001', plate: 'MH-12-AB-1234', driver: 'Rajesh K.', x: 15, y: 25, speed: 62, status: 'moving', heading: 'Mumbai → Pune', fuel: 78 },
    { id: 'TRK-004', plate: 'MH-14-CD-5678', driver: 'Suresh M.', x: 45, y: 55, speed: 0, status: 'idle', heading: 'At Depot B', fuel: 45 },
    { id: 'TRK-007', plate: 'MH-09-EF-9012', driver: 'Amit P.', x: 70, y: 20, speed: 45, status: 'moving', heading: 'Nashik Highway', fuel: 62 },
    { id: 'TRK-012', plate: 'MH-22-GH-3456', driver: 'Vikram S.', x: 55, y: 75, speed: 78, status: 'alert', heading: 'Overspeed NH-48', fuel: 34 },
  ];

  fleetStats = [
    { icon: '📈', label: 'Active Vehicles', value: '24/30', color: '#22C55E', pct: 80 },
    { icon: '⛽', label: 'Avg Fuel Level', value: '64%', color: '#3B82F6', pct: 64 },
    { icon: '⚠', label: 'Active Alerts', value: '7', color: '#EF4444', pct: 23 },
    { icon: '⏱', label: 'Idle Vehicles', value: '1', color: '#F59E0B', pct: 3 },
  ];

  private events = [
    'MH-12-AB-1234 crossed Lonavala checkpoint',
    'MH-22-GH-3456 exceeded speed limit — 78 km/h',
    'MH-14-CD-5678 has been idle for 22 minutes',
    'MH-04-IJ-7890 fuel level at 89%',
  ];

  ngOnInit() {
    this.tickerInterval = setInterval(() => {
      this.tickerIndex = (this.tickerIndex + 1) % this.events.length;
      this.currentEvent = this.events[this.tickerIndex];
    }, 3000);
    this.syncInterval = setInterval(() => {
      this.syncTime = this.syncTime >= 10 ? 1 : this.syncTime + 1;
    }, 1000);
  }

  ngAfterViewInit() { this.initMap(); }

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    clearInterval(this.tickerInterval);
    clearInterval(this.syncInterval);
  }

  private initMap() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect(), d = Math.min(window.devicePixelRatio, 2);
      w = r.width; h = r.height; canvas.width = w * d; canvas.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize(); window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() * 0.001;
      ctx.strokeStyle = `rgba(59,130,246,${0.035 + Math.sin(t * 0.3) * 0.01})`; ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      this.vehicles.forEach(v => {
        const vx = (v.x / 100) * w, vy = (v.y / 100) * h;
        const col = this.statusColor[v.status];
        const gr = v.status === 'alert' ? 20 + Math.sin(t * 4) * 6 : 16;
        const glow = ctx.createRadialGradient(vx, vy, 0, vx, vy, gr);
        glow.addColorStop(0, col + '35'); glow.addColorStop(1, col + '00');
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(vx, vy, gr, 0, Math.PI * 2); ctx.fill();
        if (v.status === 'moving' || v.status === 'alert') {
          const pingT = (t * (v.status === 'alert' ? 2 : 0.8)) % 1;
          ctx.strokeStyle = col; ctx.globalAlpha = (1 - pingT) * 0.3; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(vx, vy, 6 + pingT * 18, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
        }
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(vx, vy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(vx, vy, 2, 0, Math.PI * 2); ctx.fill();
      });
      this.animId = requestAnimationFrame(draw);
    };
    this.animId = requestAnimationFrame(draw);
  }
}
