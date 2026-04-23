import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lead-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      (click)="closeModal.emit()">
      <div class="absolute inset-0" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(8px)"></div>
      <div class="relative w-full sm:max-w-[440px] rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style="background: linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(8,10,18,0.98) 100%); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 0 80px rgba(59,130,246,0.12), 0 25px 50px rgba(0,0,0,0.5); border-radius: 16px"
        (click)="$event.stopPropagation()">
        <button (click)="closeModal.emit()"
          class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/5 transition-all">
          ✕
        </button>

        <div *ngIf="!submitted" class="relative p-6 sm:p-8">
          <div class="flex justify-center mb-5">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style="background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15)); border: 1px solid rgba(59,130,246,0.2)">
              <span class="text-[#93C5FD]" style="font-size:13px; font-weight:600">✨ Limited Onboarding Slots</span>
            </div>
          </div>
          <h3 class="text-white text-center mb-2" style="font-size:24px; font-weight:800; letter-spacing:-.03em">
            Start Your Fleet Optimization
          </h3>
          <p class="text-[#64748B] text-center mb-7" style="font-size:14px; line-height:1.6">
            Get live GPS tracking for every vehicle at just
            <span class="text-[#3B82F6]" style="font-weight:700">₹499/month</span>
          </p>
          <div class="space-y-3 mb-6">
            <div>
              <label class="block text-[#94A3B8] mb-1.5" style="font-size:12px; font-weight:500">Full Name</label>
              <input type="text" required [(ngModel)]="form.name" placeholder="Enter your full name"
                class="w-full pl-4 pr-4 py-3 rounded-[10px] text-white placeholder-[#334155] outline-none"
                style="font-size:14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08)"/>
            </div>
            <div>
              <label class="block text-[#94A3B8] mb-1.5" style="font-size:12px; font-weight:500">Phone Number</label>
              <input type="tel" required [(ngModel)]="form.phone" placeholder="+91 98765 43210"
                class="w-full pl-4 pr-4 py-3 rounded-[10px] text-white placeholder-[#334155] outline-none"
                style="font-size:14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08)"/>
            </div>
            <div>
              <label class="block text-[#94A3B8] mb-1.5" style="font-size:12px; font-weight:500">Email Address</label>
              <input type="email" required [(ngModel)]="form.email" placeholder="you@gmail.com"
                class="w-full pl-4 pr-4 py-3 rounded-[10px] text-white placeholder-[#334155] outline-none"
                style="font-size:14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08)"/>
            </div>
          </div>
          <button (click)="submit()"
            class="w-full py-3.5 rounded-[10px] text-white flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
            style="font-size:15px; font-weight:700; background: linear-gradient(135deg, #3B82F6, #7C3AED); box-shadow: 0 0 40px rgba(59,130,246,0.25)">
            ⚡ Activate ₹499 Plan →
          </button>
          <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-5">
            <div *ngFor="let t of trustItems" class="flex items-center gap-1.5 text-[#475569]">
              <span class="text-[#22C55E]">✓</span>
              <span style="font-size:11px; font-weight:500">{{ t }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="submitted" class="relative p-8 text-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl"
            style="background: linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05)); border: 1px solid rgba(34,197,94,0.3)">
            ✓
          </div>
          <h3 class="text-white mb-2" style="font-size:22px; font-weight:800">You're All Set!</h3>
          <p class="text-[#94A3B8] mb-6" style="font-size:14px; line-height:1.6">
            Our team will reach out to <span class="text-white font-semibold">{{ form.phone || 'you' }}</span> within 30 minutes.
          </p>
          <button (click)="closeModal.emit(); submitted = false"
            class="text-[#3B82F6] hover:text-[#60A5FA] transition-colors" style="font-size:14px; font-weight:600">
            Close
          </button>
        </div>
      </div>
    </div>
  `
})
export class LeadModalComponent implements OnChanges {
  @Input() open = false;
  @Output() closeModal = new EventEmitter<void>();
  submitted = false;
  form = { name: '', phone: '', email: '' };
  trustItems = ['No payment required now', 'Setup in 10 minutes', 'Trusted by fleet owners'];

  ngOnChanges() {
    if (this.open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }

  submit() {
    if (!this.form.name || !this.form.phone || !this.form.email) return;
    this.submitted = true;
  }
}
