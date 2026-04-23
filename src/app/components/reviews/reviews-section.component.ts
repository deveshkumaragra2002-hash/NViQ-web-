import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Review {
  id: number; name: string; business: string; rating: number; text: string;
  tag?: string; tagType?: string; nviqResponse?: string;
}

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="py-24" style="background: linear-gradient(180deg, #080A12 0%, #0F172A 100%)">
      <div class="max-w-[1280px] mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <!-- Left -->
          <div class="lg:col-span-5">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8B5CF6]/20 mb-4"
              style="background: rgba(139,92,246,0.06)">
              <span class="text-[#8B5CF6]" style="font-size:13px; font-weight:500">Real Customer Feedback</span>
            </div>
            <h2 class="text-white mb-4" style="font-size: clamp(26px, 3vw, 40px); font-weight:800; letter-spacing:-.03em; line-height:1.15">
              What Fleet Owners
              <span style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); -webkit-background-clip:text; -webkit-text-fill-color:transparent">
                Actually Experience
              </span>
            </h2>
            <p class="text-[#64748B] mb-8" style="font-size:15px; line-height:1.7">
              Real feedback. Real results. No filters.
            </p>
            <div class="grid grid-cols-3 gap-4 mb-8">
              <div class="rounded-xl border border-white/5 p-4 text-center" style="background: rgba(255,255,255,0.02)">
                <div class="text-white" style="font-size:26px; font-weight:800">{{ avgRating }}</div>
                <div class="text-[#64748B] mt-1" style="font-size:11px">Avg Rating</div>
              </div>
              <div class="rounded-xl border border-white/5 p-4 text-center" style="background: rgba(255,255,255,0.02)">
                <div class="text-white" style="font-size:26px; font-weight:800">{{ reviews.length }}</div>
                <div class="text-[#64748B] mt-1" style="font-size:11px">Total Reviews</div>
              </div>
              <div class="rounded-xl border border-white/5 p-4 text-center" style="background: rgba(255,255,255,0.02)">
                <div class="text-[#22C55E]" style="font-size:26px; font-weight:800">{{ positivePercent }}%</div>
                <div class="text-[#64748B] mt-1" style="font-size:11px">Positive</div>
              </div>
            </div>
            <button (click)="reviewModalOpen = true"
              class="inline-flex items-center gap-2.5 px-6 py-3 rounded-[10px] text-white cursor-pointer"
              style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); box-shadow: 0 0 30px rgba(139,92,246,0.2); font-size:14px; font-weight:700">
              ✍ Write Your Review
            </button>
          </div>

          <!-- Right - scrollable feed -->
          <div class="lg:col-span-7 overflow-y-auto pr-2" style="max-height:560px">
            <div *ngFor="let review of reviews" class="rounded-xl border p-5 mb-4"
              [style.background]="'rgba(255,255,255,0.02)'"
              [style.borderColor]="review.rating <= 3 ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.06)'">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <div class="text-white" style="font-size:14px; font-weight:600">{{ review.name }}</div>
                  <div class="text-[#64748B]" style="font-size:11px">{{ review.business }}</div>
                </div>
                <div class="flex items-center gap-0.5">
                  <span *ngFor="let s of getStars(review.rating)" class="text-[#F59E0B]">★</span>
                  <span *ngFor="let s of getEmptyStars(review.rating)" class="text-[#334155]">★</span>
                </div>
              </div>
              <p class="text-[#94A3B8] mb-3" style="font-size:13px; line-height:1.65">"{{ review.text }}"</p>
              <div *ngIf="review.tag" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
                [style.background]="review.tagType === 'positive' ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)'"
                [style.borderColor]="review.tagType === 'positive' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'"
                style="border:1px solid">
                <span [style.color]="review.tagType === 'positive' ? '#22C55E' : '#F59E0B'" style="font-size:11px; font-weight:600">
                  {{ review.tagType === 'positive' ? '📈' : '⚠' }} {{ review.tag }}
                </span>
              </div>
              <div *ngIf="review.nviqResponse" class="mt-2 rounded-lg p-3"
                style="background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.12)">
                <div class="flex items-center gap-1.5 mb-1.5">
                  <span class="text-[#3B82F6]" style="font-size:11px; font-weight:700">💬 NViQ Response</span>
                </div>
                <p class="text-[#94A3B8]" style="font-size:12px; line-height:1.55">{{ review.nviqResponse }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Review Modal -->
    <div *ngIf="reviewModalOpen" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      (click)="reviewModalOpen = false">
      <div class="absolute inset-0" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(8px)"></div>
      <div class="relative w-full sm:max-w-[460px] rounded-t-2xl sm:rounded-2xl overflow-hidden p-6 sm:p-8"
        style="background: rgba(15,23,42,0.95); border: 1px solid rgba(255,255,255,0.08)"
        (click)="$event.stopPropagation()">
        <button (click)="reviewModalOpen = false" class="absolute top-4 right-4 text-[#64748B] hover:text-white">✕</button>
        <div *ngIf="!submitted">
          <h3 class="text-white text-center mb-2" style="font-size:22px; font-weight:800">Write Your Review</h3>
          <div class="space-y-3 mb-5">
            <input type="text" placeholder="Full Name" required [(ngModel)]="reviewForm.name"
              class="w-full px-4 py-3 rounded-xl text-white outline-none"
              style="font-size:14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08)"/>
            <input type="tel" placeholder="Phone Number" required [(ngModel)]="reviewForm.phone"
              class="w-full px-4 py-3 rounded-xl text-white outline-none"
              style="font-size:14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08)"/>
            <input type="email" placeholder="Email Address" required [(ngModel)]="reviewForm.email"
              class="w-full px-4 py-3 rounded-xl text-white outline-none"
              style="font-size:14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08)"/>
            <div class="flex gap-1">
              <span *ngFor="let i of [1,2,3,4,5]" class="cursor-pointer text-2xl"
                [style.color]="selectedRating >= i ? '#F59E0B' : '#334155'"
                (click)="selectedRating = i">★</span>
            </div>
            <textarea placeholder="Share your experience..." rows="3" [(ngModel)]="reviewForm.text"
              class="w-full px-4 py-3 rounded-xl text-white outline-none resize-none"
              style="font-size:14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08)"></textarea>
          </div>
          <button (click)="submitReview()"
            class="w-full py-3.5 rounded-[10px] text-white flex items-center justify-center gap-2 cursor-pointer"
            style="font-size:15px; font-weight:700; background: linear-gradient(135deg, #8B5CF6, #3B82F6)">
            ✉ Submit Review
          </button>
        </div>
        <div *ngIf="submitted" class="text-center py-8">
          <div class="text-[#22C55E] text-5xl mb-4">✓</div>
          <h3 class="text-white mb-2" style="font-size:22px; font-weight:800">Thanks for Your Review!</h3>
          <p class="text-[#94A3B8] mb-6" style="font-size:14px">Your review will be visible after verification.</p>
          <button (click)="reviewModalOpen = false; submitted = false"
            class="text-[#8B5CF6]" style="font-size:14px; font-weight:600">Close</button>
        </div>
      </div>
    </div>
  `
})
export class ReviewsSectionComponent {
  reviewModalOpen = false;
  submitted = false;
  selectedRating = 0;
  reviewForm = { name: '', phone: '', email: '', text: '' };

  reviews: Review[] = [
    { id: 1, name: 'Rajesh Kumar', business: 'Transport / 28 Vehicles', rating: 5, text: 'Switched from manual logbooks to NViQ — fuel theft dropped to zero in the first week.', tag: 'Saved ₹18,000/month', tagType: 'positive' },
    { id: 2, name: 'Meena Devi', business: 'Logistics / 12 Vehicles', rating: 4, text: 'The live tracking is excellent. I can see exactly where every truck is.', tag: 'Real-time visibility', tagType: 'positive' },
    { id: 3, name: 'Vikram Singh', business: 'Transport / 45 Vehicles', rating: 2, text: 'Initial setup took longer than expected.', tag: 'Facing delay issue', tagType: 'negative', nviqResponse: 'We replaced the faulty device within 24 hours and assigned a dedicated support agent.' },
    { id: 4, name: 'Anita Sharma', business: 'Cold Chain / 20 Vehicles', rating: 5, text: 'The temperature monitoring combined with GPS is a game-changer for our pharma deliveries.', tag: 'Saved ₹42,000/month', tagType: 'positive' },
    { id: 5, name: 'Suresh Patil', business: 'Fleet Owner / 60 Vehicles', rating: 5, text: 'ROI was visible in 10 days. Idle time alerts alone saved us ₹25,000 in the first month.', tag: 'Saved ₹25,000/month', tagType: 'positive' },
  ];

  get avgRating() {
    return (this.reviews.reduce((a, r) => a + r.rating, 0) / this.reviews.length).toFixed(1);
  }
  get positivePercent() {
    return Math.round((this.reviews.filter(r => r.rating >= 4).length / this.reviews.length) * 100);
  }

  getStars(rating: number) { return Array(rating).fill(0); }
  getEmptyStars(rating: number) { return Array(5 - rating).fill(0); }

  submitReview() {
    if (this.selectedRating === 0) return;
    this.submitted = true;
  }
}
