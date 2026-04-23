// pricing-section.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="pricing" class="py-24" style="background: linear-gradient(180deg, #0F172A 0%, #080A12 100%)">
      <div class="max-w-[1280px] mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-white" style="font-size: clamp(28px, 3.5vw, 44px); font-weight:800">
            Simple Pricing.
            <span style="background: linear-gradient(135deg, #3B82F6, #06B6D4); -webkit-background-clip:text; -webkit-text-fill-color:transparent">
              Maximum Savings.
            </span>
          </h2>
          <div class="text-green-400 mt-4 font-semibold">💰 Save up to ₹15,000 per vehicle every month</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
          <div *ngFor="let plan of plans; let i = index"
            class="group relative rounded-2xl border p-6 flex flex-col transition-all hover:-translate-y-2 cursor-default"
            [class.scale-105]="plan.popular"
            [style.border]="plan.popular ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.05)'"
            [style.background]="plan.popular ? 'linear-gradient(180deg, rgba(59,130,246,0.12) 0%, rgba(255,255,255,0.03) 100%)' : 'rgba(255,255,255,0.02)'">
            <div *ngIf="plan.popular"
              class="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-white"
              style="background: linear-gradient(135deg, #3B82F6, #2563EB); font-size:11px; font-weight:600">
              ⚡ Best Value
            </div>
            <div class="text-green-400 text-xs font-semibold mb-1" *ngIf="plan.popular">Save up to ₹15,000/month</div>
            <div class="mb-6">
              <div class="text-white mb-2 font-bold">{{ plan.name }}</div>
              <div class="flex items-baseline gap-1">
                <span class="text-white text-4xl font-extrabold">{{ plan.price }}</span>
                <span class="text-[#64748B] text-sm" *ngIf="plan.period">{{ plan.period }}</span>
              </div>
              <p class="text-[#94A3B8] text-sm mt-2">{{ plan.desc }}</p>
            </div>
            <div class="space-y-3 mb-8 flex-1">
              <div *ngFor="let f of plan.features" class="flex items-center gap-2">
                <span class="text-[#3B82F6]">✓</span>
                <span class="text-[#94A3B8] text-sm">{{ f }}</span>
              </div>
            </div>
            <button (click)="openModal.emit()"
              class="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white transition-transform hover:scale-105"
              [style.background]="plan.popular ? 'linear-gradient(135deg, #3B82F6, #2563EB)' : 'rgba(255,255,255,0.05)'"
              [style.border]="plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)'">
              {{ plan.cta }} →
            </button>
          </div>
        </div>
        <div class="text-center mt-10 space-y-2">
          <div class="text-[#94A3B8] text-sm">Trusted by 500+ fleet operators across India</div>
          <div class="text-[#64748B] text-sm">No risk. No setup cost. Cancel anytime.</div>
        </div>
      </div>
    </section>
  `
})
export class PricingSectionComponent {
  @Output() openModal = new EventEmitter<void>();
  plans = [
    { name: 'Starter', price: '₹499', period: '/vehicle/month', desc: 'Start saving up to ₹15,000 per vehicle every month.', features: ['Real-time vehicle tracking', 'Prevent fuel theft', 'Reduce idle time', 'Mobile app access'], cta: 'Start Saving @ ₹499', popular: true },
    { name: 'Professional', price: '₹999', period: '/vehicle/month', desc: 'Advanced analytics and full control for growing fleets.', features: ['Everything in Starter', 'Smart analytics dashboard', 'Driver behavior insights', 'Priority support'], cta: 'Upgrade Plan', popular: false },
    { name: 'Enterprise', price: 'Custom', period: '', desc: 'Tailored solutions for large fleet businesses.', features: ['Everything in Professional', 'Unlimited data history', 'Custom integrations', 'Dedicated support', 'SLA guarantee'], cta: 'Contact Sales', popular: false },
  ];
}
