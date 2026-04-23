import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-problem-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20" style="background: #080A12">
      <div class="max-w-[1280px] mx-auto px-6">
        <div class="text-center mb-14">
          <h2 class="text-white" style="font-size: clamp(28px, 3.5vw, 44px); font-weight: 800; letter-spacing: -.03em; line-height: 1.1">
            Where You <span class="text-[#EF4444]">Lose Money</span>
          </h2>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div *ngFor="let p of problems"
            class="group relative rounded-2xl border border-white/5 hover:border-white/12 p-5 sm:p-6 cursor-default overflow-hidden transition-all hover:-translate-y-1"
            style="background: rgba(255,255,255,.015)">
            <div class="relative z-10">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                [style.background]="p.color + '12'"
                [style.color]="p.color">
                {{ p.emoji }}
              </div>
              <div class="mb-1.5" [style.color]="p.color" style="font-size:32px; font-weight:800; letter-spacing:-.03em; line-height:1">
                {{ p.stat }}
              </div>
              <div class="text-white mb-0.5" style="font-size:15px; font-weight:700">{{ p.title }}</div>
              <div class="text-[#4B5563]" style="font-size:11px">{{ p.sub }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ProblemSectionComponent {
  problems = [
    { emoji: '⛽', title: 'Fuel Theft', stat: '₹15,000+', sub: 'lost / vehicle / month', color: '#EF4444' },
    { emoji: '⏱', title: 'Idle Time', stat: '2.4 hrs', sub: 'wasted daily per vehicle', color: '#F59E0B' },
    { emoji: '👤', title: 'Misuse', stat: '34%', sub: 'unauthorized trips', color: '#F97316' },
    { emoji: '👁', title: 'No Visibility', stat: '0', sub: 'real-time data points', color: '#DC2626' },
  ];
}
