import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benefits-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 text-white" style="background: #080A12">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-10">Why Choose NViQ?</h2>
        <div class="grid md:grid-cols-4 gap-6">
          <div *ngFor="let b of benefits"
            class="p-6 rounded-xl border border-gray-700 transition-transform hover:scale-105 cursor-default"
            style="background: #0f172a">
            <div class="mb-3 text-blue-400 text-2xl">{{ b.icon }}</div>
            <h3 class="font-bold mb-2">{{ b.title }}</h3>
            <p class="text-sm text-gray-400">{{ b.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class BenefitsSectionComponent {
  benefits = [
    { icon: '📈', title: 'Save Fuel Costs', desc: 'Save up to 10–15% on fuel costs' },
    { icon: '⏱', title: 'Reduce Delays', desc: 'Reduce idle time and delivery delays' },
    { icon: '🛡', title: 'Build Trust', desc: 'Build customer trust with transparent data' },
    { icon: '📊', title: 'Boost Profitability', desc: 'Improve profitability and efficiency' },
  ];
}
