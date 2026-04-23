import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-28 sm:py-32 relative overflow-hidden" style="background: #080A12">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] opacity-[0.18] pointer-events-none"
        style="background: radial-gradient(ellipse, #3B82F6 0%, #7C3AED 40%, transparent 70%); filter: blur(100px)"></div>

      <div class="max-w-[740px] mx-auto px-6 text-center relative z-10">
        <button (click)="openModal.emit()"
          class="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8 cursor-pointer"
          style="background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.12)); border: 1px solid rgba(59,130,246,0.25)">
          <span class="text-[#60A5FA]">⚡</span>
          <span class="text-white" style="font-size:14px; font-weight:700">Start Tracking &#64; ₹499 / Vehicle</span>
          <span class="text-[#60A5FA]">→</span>
        </button>

        <h2 class="text-white mb-4" style="font-size: clamp(30px, 4.5vw, 52px); font-weight:800; letter-spacing:-.035em; line-height:1.1">
          Stop Losing.
          <br class="hidden sm:block"/>
          <span style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); -webkit-background-clip:text; -webkit-text-fill-color:transparent">
            Start Profiting.
          </span>
        </h2>

        <p class="text-[#F59E0B] mb-10" style="font-size:14px; font-weight:600">⚡ ROI in 7 days — guaranteed</p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button (click)="openModal.emit()"
            class="text-white px-9 py-4 rounded-[10px] flex items-center gap-2.5 cursor-pointer hover:scale-105 transition-transform"
            style="font-size:16px; font-weight:700; background: linear-gradient(135deg, #3B82F6, #7C3AED); box-shadow: 0 0 50px rgba(59,130,246,0.3)">
            Start Free Trial →
          </button>
          <button (click)="openModal.emit()"
            class="text-[#94A3B8] hover:text-white px-9 py-4 rounded-[10px] border border-white/10 hover:border-white/20 transition-all"
            style="font-size:16px; font-weight:500">
            Schedule Demo
          </button>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mt-6">
          <div *ngFor="let t of trustItems" class="flex items-center gap-1.5 text-[#475569]">
            <span class="text-[#22C55E]">✓</span>
            <span style="font-size:12px">{{ t }}</span>
          </div>
        </div>

        <div class="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style="background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.15)">
          <span class="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse inline-block"></span>
          <span class="text-[#F59E0B]" style="font-size:12px; font-weight:600">Only 12 onboarding slots left this week</span>
        </div>
      </div>

      <!-- Sticky Mobile CTA -->
      <div class="fixed bottom-0 left-0 right-0 z-50 sm:hidden px-4 pb-4 pt-3"
        style="background: linear-gradient(180deg, transparent 0%, rgba(8,10,18,0.95) 30%)">
        <button (click)="openModal.emit()"
          class="w-full py-3.5 rounded-[10px] text-white flex items-center justify-center gap-2"
          style="font-size:15px; font-weight:700; background: linear-gradient(135deg, #3B82F6, #7C3AED); box-shadow: 0 0 40px rgba(59,130,246,0.3)">
          ⚡ Start Tracking &#64; ₹499 →
        </button>
      </div>
    </section>
  `
})
export class CtaSectionComponent {
  @Output() openModal = new EventEmitter<void>();
  trustItems = ['No credit card required', '14-day free trial', 'Cancel anytime'];
}
