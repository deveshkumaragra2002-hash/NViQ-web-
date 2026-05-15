import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ProductCategory } from '../../services/api.service';
import { NavService, ProductKey } from '../../services/nav.service';

interface ModalConfig {
  badge:      string;
  badgeColor: string;
  title:      string;
  subtitle:   string;
  accentText: string;
  buttonText: string;
  trustItems: string[];
}

const PRODUCT_CONFIG: Record<string, ModalConfig> = {
  gps: {
    badge: 'Limited onboarding slots', badgeColor: '#93C5FD',
    title: 'Start Your Data-Driven Fleet Setup',
    subtitle: 'Launch live GPS tracking from', accentText: 'Rs 499 per vehicle/month',
    buttonText: 'Activate Starter Plan',
    trustItems: ['No payment required now', 'Setup in 10 minutes', 'Built for fleet owners'],
  },
  mf: {
    badge: 'Free Consultation • AMFI Registered', badgeColor: '#6EE7B7',
    title: 'Start Your SIP Journey Today',
    subtitle: 'Invest in top mutual funds from', accentText: '₹1,000 per month',
    buttonText: 'Get Free Consultation',
    trustItems: ['ARN No: 359231', 'No investment required now', 'Zero hidden charges'],
  },
  insurance: {
    badge: 'Trusted Insurance Partner', badgeColor: '#FB923C',
    title: 'Get the Right Insurance Cover',
    subtitle: 'Protect what matters with', accentText: 'affordable insurance plans',
    buttonText: 'Get Insurance Quote',
    trustItems: ['Compare 20+ plans', 'Claim support included', 'Best premium rates'],
  },
  ai: {
    badge: 'AI-Powered Business Tools', badgeColor: '#A78BFA',
    title: 'Supercharge Your Business with AI',
    subtitle: 'Automate and grow with', accentText: 'intelligent AI solutions',
    buttonText: 'Request AI Demo',
    trustItems: ['Custom AI workflows', 'Quick integration', 'Enterprise ready'],
  },
  fastag: {
    badge: 'NHAI Certified FASTag', badgeColor: '#C4B5FD',
    title: 'Activate FASTag for Your Fleet',
    subtitle: 'Enable cashless tolling with', accentText: 'NHAI certified FASTag',
    buttonText: 'Request FASTag Activation',
    trustItems: ['Bulk fleet discounts', 'Instant activation', 'Real-time balance alerts'],
  },
  other: {
    badge: 'Get in Touch', badgeColor: '#93C5FD',
    title: 'Talk to Our Experts',
    subtitle: 'Discover the right solution for', accentText: 'your business',
    buttonText: 'Submit Enquiry',
    trustItems: ['No commitment required', 'Response within 30 minutes', 'Tailored solutions'],
  },
  default: {
    badge: 'Get in Touch', badgeColor: '#93C5FD',
    title: 'Talk to Our Experts',
    subtitle: 'Discover the right solution for', accentText: 'your business',
    buttonText: 'Submit Enquiry',
    trustItems: ['No commitment required', 'Response within 30 minutes', 'Tailored solutions'],
  },
};

const PRODUCT_PILLS: { key: ProductCategory; label: string; icon: string }[] = [
  { key: 'gps',       label: 'GPS / Fleet',    icon: '🚛' },
  { key: 'mf',        label: 'Mutual Funds',   icon: '📈' },
  { key: 'insurance', label: 'Insurance',      icon: '🛡️' },
  { key: 'ai',        label: 'AI Tools',       icon: '🤖' },
  { key: 'fastag',    label: 'FASTag',         icon: '💳' },
  { key: 'other',     label: 'Other',          icon: '💬' },
];

@Component({
  selector: 'app-lead-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="open" class="lm-backdrop" (click)="closeModal.emit()">
      <div class="lm-card" (click)="$event.stopPropagation()">

        <button class="lm-close" (click)="closeModal.emit()" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- ── Form ── -->
        <div *ngIf="!submitted" class="lm-body">

          <!-- Badge -->
          <div class="lm-badge-wrap">
            <span class="lm-badge"
              [style.color]="cfg.badgeColor"
              [style.border-color]="cfg.badgeColor + '44'"
              [style.background]="cfg.badgeColor + '1A'">
              {{ cfg.badge }}
            </span>
          </div>

          <!-- Heading -->
          <h3 class="lm-title">{{ cfg.title }}</h3>
          <p class="lm-sub">
            {{ cfg.subtitle }}
            <span class="lm-accent" [style.color]="cfg.badgeColor">{{ cfg.accentText }}</span>
          </p>

          <!-- ── Product Picker ── -->
          <div class="lm-picker-label">Select Product / Service</div>
          <div class="lm-picker">
            <button *ngFor="let p of pills" type="button"
              class="lm-pill"
              [class.lm-pill-active]="form.selectedProduct === p.key"
              [style.--pill-color]="pillColor(p.key)"
              (click)="selectProduct(p.key)">
              <span class="lm-pill-icon">{{ p.icon }}</span>
              <span class="lm-pill-label">{{ p.label }}</span>
            </button>
          </div>

          <!-- Error -->
          <p *ngIf="errorMsg" class="lm-error">{{ errorMsg }}</p>

          <!-- Fields -->
          <div class="lm-fields">
            <div class="lm-field">
              <label class="lm-label">Full Name</label>
              <input type="text" [(ngModel)]="form.name"
                placeholder="Enter your full name"
                class="lm-input" autocomplete="name"/>
            </div>
            <div class="lm-field">
              <label class="lm-label">Phone Number
                <span *ngIf="form.selectedProduct === 'mf'" class="lm-label-hint">(callback ke liye)</span>
              </label>
              <input type="tel" [(ngModel)]="form.phone"
                placeholder="+91 98765 43210"
                class="lm-input" autocomplete="tel"/>
            </div>
            <div class="lm-field">
              <label class="lm-label">Email Address
                <span *ngIf="form.selectedProduct === 'mf'" class="lm-label-hint">(portfolio report ke liye)</span>
              </label>
              <input type="email" [(ngModel)]="form.email"
                placeholder="you@gmail.com"
                class="lm-input" autocomplete="email"/>
            </div>

            <!-- ── GPS / FASTag fields ── -->
            <ng-container *ngIf="form.selectedProduct === 'gps' || form.selectedProduct === 'fastag'">
              <div class="lm-field">
                <label class="lm-label">Company / Business Name</label>
                <input type="text" [(ngModel)]="form.company"
                  placeholder="e.g. RoadLink Logistics Pvt. Ltd."
                  class="lm-input"/>
              </div>
              <div class="lm-field">
                <label class="lm-label">Business Type</label>
                <select [(ngModel)]="form.businessType" class="lm-input lm-select">
                  <option value="" disabled>Select business type</option>
                  <option value="Logistics">Logistics / Transport</option>
                  <option value="Construction">Construction</option>
                  <option value="Cab/Taxi">Cab / Taxi Operator</option>
                  <option value="School Bus">School Bus</option>
                  <option value="E-commerce">E-commerce Delivery</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="lm-field">
                <label class="lm-label">Number of Vehicles</label>
                <select [(ngModel)]="form.fleetSize" class="lm-input lm-select">
                  <option value="" disabled>Select fleet size</option>
                  <option value="1-10">1 – 10 Vehicles</option>
                  <option value="10-50">10 – 50 Vehicles</option>
                  <option value="50-100">50 – 100 Vehicles</option>
                  <option value="100+">100+ Vehicles</option>
                </select>
              </div>
              <div class="lm-field">
                <label class="lm-label">Tracking Requirement</label>
                <textarea [(ngModel)]="form.requirement"
                  placeholder="Tell us about your fleet tracking needs..."
                  class="lm-input lm-textarea" rows="2"></textarea>
              </div>
            </ng-container>

            <!-- ── Mutual Funds fields ── -->
            <ng-container *ngIf="form.selectedProduct === 'mf'">
              <div class="lm-field">
                <label class="lm-label">Monthly Investment Budget</label>
                <select [(ngModel)]="form.budget" class="lm-input lm-select">
                  <option value="" disabled>Select budget range</option>
                  <option value="₹1000–5000">₹1,000 – ₹5,000</option>
                  <option value="₹5000–10000">₹5,000 – ₹10,000</option>
                  <option value="₹10000–25000">₹10,000 – ₹25,000</option>
                  <option value="₹25000+">₹25,000+</option>
                </select>
              </div>
              <div class="lm-field">
                <label class="lm-label">Investment Goal</label>
                <select [(ngModel)]="form.goal" class="lm-input lm-select">
                  <option value="" disabled>Select your goal</option>
                  <option value="Wealth Creation">Wealth Creation</option>
                  <option value="Tax Saving">Tax Saving (ELSS)</option>
                  <option value="Retirement">Retirement Planning</option>
                  <option value="Child Education">Child Education</option>
                  <option value="Emergency Fund">Emergency Fund</option>
                </select>
              </div>
              <div class="lm-field">
                <label class="lm-label">Risk Preference</label>
                <div class="lm-radio-group">
                  <label class="lm-radio" [class.lm-radio-active]="form.riskPreference === 'Low'">
                    <input type="radio" [(ngModel)]="form.riskPreference" value="Low" hidden/>
                    🔵 Low Risk
                  </label>
                  <label class="lm-radio" [class.lm-radio-active]="form.riskPreference === 'Moderate'">
                    <input type="radio" [(ngModel)]="form.riskPreference" value="Moderate" hidden/>
                    🟡 Moderate
                  </label>
                  <label class="lm-radio" [class.lm-radio-active]="form.riskPreference === 'High'">
                    <input type="radio" [(ngModel)]="form.riskPreference" value="High" hidden/>
                    🔴 High
                  </label>
                </div>
              </div>
              <div class="lm-field">
                <label class="lm-label">Investment Experience</label>
                <div class="lm-radio-group">
                  <label class="lm-radio" [class.lm-radio-active]="form.experience === 'Beginner'">
                    <input type="radio" [(ngModel)]="form.experience" value="Beginner" hidden/>
                    🌱 Beginner
                  </label>
                  <label class="lm-radio" [class.lm-radio-active]="form.experience === 'Intermediate'">
                    <input type="radio" [(ngModel)]="form.experience" value="Intermediate" hidden/>
                    📈 Intermediate
                  </label>
                  <label class="lm-radio" [class.lm-radio-active]="form.experience === 'Experienced'">
                    <input type="radio" [(ngModel)]="form.experience" value="Experienced" hidden/>
                    🏆 Experienced
                  </label>
                </div>
              </div>
            </ng-container>

            <!-- ── Insurance fields ── -->
            <ng-container *ngIf="form.selectedProduct === 'insurance'">
              <div class="lm-field">
                <label class="lm-label">Insurance Type</label>
                <select [(ngModel)]="form.requirement" class="lm-input lm-select">
                  <option value="" disabled>Select insurance type</option>
                  <option value="Vehicle Insurance">Vehicle Insurance</option>
                  <option value="Health Insurance">Health Insurance</option>
                  <option value="Life Insurance">Life Insurance</option>
                  <option value="Business Insurance">Business Insurance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="lm-field">
                <label class="lm-label">Additional Requirements</label>
                <textarea [(ngModel)]="form.message"
                  placeholder="Tell us about your insurance needs..."
                  class="lm-input lm-textarea" rows="2"></textarea>
              </div>
            </ng-container>

            <!-- ── AI Tools fields ── -->
            <ng-container *ngIf="form.selectedProduct === 'ai'">
              <div class="lm-field">
                <label class="lm-label">Use Case</label>
                <select [(ngModel)]="form.requirement" class="lm-input lm-select">
                  <option value="" disabled>Select use case</option>
                  <option value="Customer Support Automation">Customer Support Automation</option>
                  <option value="Sales & Lead Generation">Sales & Lead Generation</option>
                  <option value="Data Analytics">Data Analytics & Insights</option>
                  <option value="Document Processing">Document Processing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="lm-field">
                <label class="lm-label">Team Size</label>
                <select [(ngModel)]="form.fleetSize" class="lm-input lm-select">
                  <option value="" disabled>Select team size</option>
                  <option value="1-10">1 – 10 people</option>
                  <option value="10-50">10 – 50 people</option>
                  <option value="50-200">50 – 200 people</option>
                  <option value="200+">200+ people</option>
                </select>
              </div>
              <div class="lm-field">
                <label class="lm-label">Describe Your Need</label>
                <textarea [(ngModel)]="form.message"
                  placeholder="What problem are you trying to solve with AI?"
                  class="lm-input lm-textarea" rows="2"></textarea>
              </div>
            </ng-container>

            <!-- ── Other ── -->
            <ng-container *ngIf="form.selectedProduct === 'other'">
              <div class="lm-field">
                <label class="lm-label">Your Requirement</label>
                <textarea [(ngModel)]="form.message"
                  placeholder="Tell us what you're looking for..."
                  class="lm-input lm-textarea" rows="3"></textarea>
              </div>
            </ng-container>
          </div>

          <!-- Submit -->
          <button class="lm-submit" (click)="submit()" [disabled]="sending"
            [style.background]="submitGradient">
            <span *ngIf="!sending">{{ cfg.buttonText }} →</span>
            <span *ngIf="sending" class="lm-spinner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                class="lm-spin">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Submitting...
            </span>
          </button>

          <div class="lm-trust">
            <span *ngFor="let t of cfg.trustItems" class="lm-trust-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#22C55E" stroke-width="3" stroke-linecap="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              {{ t }}
            </span>
          </div>
        </div>

        <!-- ── Success ── -->
        <div *ngIf="submitted" class="lm-success">
          <div class="lm-success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="#22C55E" stroke-width="2.5" stroke-linecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h3 class="lm-success-title">You're all set!</h3>
          <p class="lm-success-sub">
            Our team will reach out to
            <strong>{{ form.phone || 'you' }}</strong>
            within 30 minutes.
          </p>
          <button class="lm-success-close" (click)="closeModal.emit(); submitted = false">
            Close
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .lm-backdrop {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: flex-end; justify-content: center;
      background: rgba(0,0,0,0.65);
      backdrop-filter: blur(8px);
    }
    @media (min-width: 640px) { .lm-backdrop { align-items: center; padding: 24px; } }

    .lm-card {
      position: relative; width: 100%;
      max-width: 480px;
      border-radius: 20px 20px 0 0;
      background: linear-gradient(180deg, rgba(15,23,42,0.97) 0%, rgba(8,10,18,0.99) 100%);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 0 80px rgba(59,130,246,0.12), 0 25px 50px rgba(0,0,0,0.5);
      overflow-y: auto; max-height: 95svh;
      animation: lmIn 0.38s cubic-bezier(0.22,1,0.36,1) both;
      scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
    }
    @media (min-width: 640px) { .lm-card { border-radius: 20px; max-height: 92vh; } }
    @keyframes lmIn {
      from { opacity: 0; transform: translateY(32px) scale(0.97); }
      to   { opacity: 1; transform: none; }
    }

    .lm-close {
      position: absolute; top: 14px; right: 14px; z-index: 10;
      width: 32px; height: 32px; border-radius: 50%; border: none;
      background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.45);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s ease;
    }
    .lm-close:hover { background: rgba(255,255,255,0.12); color: #fff; }

    .lm-body { padding: 28px 24px 24px; }
    @media (min-width: 640px) { .lm-body { padding: 32px; } }

    .lm-badge-wrap { display: flex; justify-content: center; margin-bottom: 14px; }
    .lm-badge {
      display: inline-flex; align-items: center;
      padding: 5px 16px; border-radius: 999px; border: 1px solid;
      font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
      transition: color 0.3s, background 0.3s, border-color 0.3s;
    }
    .lm-title {
      text-align: center; color: #fff;
      font-size: 20px; font-weight: 800; letter-spacing: -0.03em;
      margin: 0 0 8px;
    }
    @media (min-width: 640px) { .lm-title { font-size: 22px; } }
    .lm-sub {
      text-align: center; color: #64748B;
      font-size: 13px; line-height: 1.6; margin: 0 0 18px;
    }
    .lm-accent { font-weight: 700; transition: color 0.3s; }

    /* ── Product Picker ── */
    .lm-picker-label {
      font-size: 11px; font-weight: 600; color: #475569;
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 8px;
    }
    .lm-picker {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-bottom: 18px;
    }
    .lm-pill {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      padding: 8px 6px; border-radius: 10px; cursor: pointer;
      border: 1px solid rgba(255,255,255,0.07);
      background: rgba(255,255,255,0.02);
      color: rgba(255,255,255,0.45);
      font-size: 11px; font-weight: 600;
      transition: all 0.18s ease;
      line-height: 1.2;
    }
    .lm-pill:hover {
      border-color: rgba(255,255,255,0.15);
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.75);
    }
    .lm-pill-active {
      border-color: color-mix(in srgb, var(--pill-color, #3B82F6) 50%, transparent);
      background: color-mix(in srgb, var(--pill-color, #3B82F6) 12%, transparent);
      color: var(--pill-color, #3B82F6);
    }
    .lm-pill-icon { font-size: 16px; line-height: 1; }
    .lm-pill-label { font-size: 10px; text-align: center; }

    .lm-error {
      color: #EF4444; font-size: 12px; text-align: center;
      margin-bottom: 12px; padding: 8px 12px;
      background: rgba(239,68,68,0.08); border-radius: 8px;
      border: 1px solid rgba(239,68,68,0.2);
    }

    .lm-fields { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
    .lm-field  { display: flex; flex-direction: column; gap: 5px; }
    .lm-label  { font-size: 12px; font-weight: 500; color: #94A3B8; }
    .lm-label-hint {
      margin-left: 6px; font-size: 10px; font-weight: 400;
      color: #475569; font-style: italic;
    }

    .lm-input {
      width: 100%; padding: 10px 14px; border-radius: 10px; outline: none;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      color: #fff; font-size: 14px;
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }
    .lm-input::placeholder { color: #334155; }
    .lm-input:focus { border-color: rgba(59,130,246,0.4); }
    .lm-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center;
      cursor: pointer;
    }
    .lm-select option { background: #0F172A; color: #fff; }
    .lm-textarea { resize: vertical; min-height: 70px; padding: 10px 14px; line-height: 1.55; }

    .lm-radio-group { display: flex; gap: 6px; flex-wrap: wrap; }
    .lm-radio {
      flex: 1; min-width: 80px;
      display: flex; align-items: center; justify-content: center;
      padding: 8px 8px; border-radius: 10px; cursor: pointer;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      color: rgba(255,255,255,0.5);
      font-size: 11px; font-weight: 600;
      transition: all 0.2s ease; user-select: none;
    }
    .lm-radio:hover { border-color: rgba(110,231,183,0.3); color: #fff; }
    .lm-radio-active {
      border-color: rgba(110,231,183,0.5);
      background: rgba(110,231,183,0.1);
      color: #6EE7B7;
    }

    .lm-submit {
      width: 100%; height: 48px; border-radius: 12px; border: none;
      color: #fff; font-size: 15px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      box-shadow: 0 0 40px rgba(59,130,246,0.2);
      transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
      margin-bottom: 16px;
    }
    .lm-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(59,130,246,0.3); }
    .lm-submit:disabled { opacity: 0.65; cursor: not-allowed; }
    .lm-spinner { display: flex; align-items: center; gap: 8px; }
    .lm-spin    { animation: lmSpin 0.9s linear infinite; }
    @keyframes lmSpin { to { transform: rotate(360deg); } }

    .lm-trust { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 16px; }
    .lm-trust-item {
      display: flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 500; color: #475569;
    }

    .lm-success {
      padding: 40px 32px; text-align: center;
      display: flex; flex-direction: column; align-items: center;
    }
    .lm-success-icon {
      width: 64px; height: 64px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05));
      border: 1px solid rgba(34,197,94,0.3);
      margin-bottom: 20px;
      animation: successPop 0.45s cubic-bezier(0.22,1,0.36,1) both;
    }
    @keyframes successPop {
      from { transform: scale(0.6); opacity: 0; }
      to   { transform: none; opacity: 1; }
    }
    .lm-success-title { color: #fff; font-size: 22px; font-weight: 800; margin: 0 0 10px; }
    .lm-success-sub   { color: #94A3B8; font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
    .lm-success-sub strong { color: #fff; }
    .lm-success-close {
      background: none; border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5); font-size: 14px; font-weight: 600;
      padding: 8px 24px; border-radius: 10px; cursor: pointer;
      transition: all 0.2s ease;
    }
    .lm-success-close:hover { color: #fff; border-color: rgba(255,255,255,0.25); }
  `]
})
export class LeadModalComponent implements OnChanges {
  @Input() open        = false;
  @Input() productType: ProductKey | null = null;
  @Output() closeModal = new EventEmitter<void>();

  private api = inject(ApiService);
  private nav = inject(NavService);

  readonly pills = PRODUCT_PILLS;

  submitted = false;
  sending   = false;
  errorMsg  = '';

  form = {
    selectedProduct: 'gps' as ProductCategory,
    name: '', phone: '', email: '',
    // GPS / FASTag
    company: '', businessType: '', fleetSize: '', requirement: '',
    // MF
    budget: '', goal: '', experience: '', riskPreference: '',
    // Insurance / AI / Other
    message: '',
  };

  private resetForm(product: ProductCategory = 'gps'): void {
    this.form = {
      selectedProduct: product,
      name: '', phone: '', email: '',
      company: '', businessType: '', fleetSize: '', requirement: '',
      budget: '', goal: '', experience: '', riskPreference: '',
      message: '',
    };
  }

  selectProduct(key: ProductCategory): void {
    const prev = this.form.selectedProduct;
    this.form.selectedProduct = key;
    // Only reset product-specific fields, not name/phone/email
    if (prev !== key) {
      this.form.company = ''; this.form.businessType = ''; this.form.fleetSize = '';
      this.form.requirement = ''; this.form.budget = ''; this.form.goal = '';
      this.form.experience = ''; this.form.riskPreference = ''; this.form.message = '';
      this.errorMsg = '';
    }
  }

  pillColor(key: ProductCategory): string {
    const colors: Record<ProductCategory, string> = {
      gps: '#93C5FD', mf: '#6EE7B7', insurance: '#FB923C',
      ai: '#A78BFA', fastag: '#C4B5FD', other: '#94A3B8',
    };
    return colors[key] ?? '#93C5FD';
  }

  get cfg(): ModalConfig {
    const p = this.form.selectedProduct;
    if (p === 'mf') {
      const fund = this.nav.activeFund();
      if (fund) {
        const minSIPLine = fund.lines.find(l => l.toLowerCase().includes('sip') || l.includes('₹'));
        return {
          badge: fund.tag + ' • AMFI Registered', badgeColor: '#6EE7B7',
          title: `Start Investing in ${fund.title}`,
          subtitle: 'Get free consultation for',
          accentText: minSIPLine ?? '₹1,000 per month',
          buttonText: 'Get Free Consultation',
          trustItems: ['ARN No: 359231', 'No investment required now', 'Zero hidden charges'],
        };
      }
    }
    return PRODUCT_CONFIG[p] ?? PRODUCT_CONFIG['default'];
  }

  get submitGradient(): string {
    const map: Record<ProductCategory, string> = {
      gps:       'linear-gradient(135deg, #3B82F6, #7C3AED)',
      mf:        'linear-gradient(135deg, #10B981, #3B82F6)',
      insurance: 'linear-gradient(135deg, #FB923C, #EF4444)',
      ai:        'linear-gradient(135deg, #8B5CF6, #6366F1)',
      fastag:    'linear-gradient(135deg, #8B5CF6, #6366F1)',
      other:     'linear-gradient(135deg, #3B82F6, #7C3AED)',
    };
    return map[this.form.selectedProduct] ?? 'linear-gradient(135deg, #3B82F6, #7C3AED)';
  }

  ngOnChanges(): void {
    if (this.open) {
      document.body.style.overflow = 'hidden';
      this.submitted = false;
      this.errorMsg  = '';
      this.sending   = false;
      const initial = (this.productType as ProductCategory) ?? 'gps';
      this.resetForm(initial);
    } else {
      document.body.style.overflow = '';
    }
  }

  submit(): void {
    const { name, phone, email, selectedProduct, company, fleetSize, businessType,
            requirement, budget, goal, experience, riskPreference, message } = this.form;

    if (!name.trim() || !phone.trim() || !email.trim()) {
      this.errorMsg = 'Please fill all required fields.';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      this.errorMsg = 'Please enter a valid email address (e.g. you@gmail.com).';
      return;
    }
    if ((selectedProduct === 'gps' || selectedProduct === 'fastag') && (!company.trim() || !fleetSize)) {
      this.errorMsg = 'Please fill company name and fleet size.';
      return;
    }
    if (selectedProduct === 'mf' && (!budget || !goal || !riskPreference)) {
      this.errorMsg = 'Please fill all investment details.';
      return;
    }
    if (selectedProduct === 'other' && !message.trim()) {
      this.errorMsg = 'Please describe your requirement.';
      return;
    }

    this.sending = true; this.errorMsg = '';

    this.api.submitProductEnquiry({
      name: name.trim(), email: email.trim(), phone: phone.trim(),
      productCategory: selectedProduct,
      company: company.trim() || undefined,
      businessType: businessType || undefined,
      fleetSize: fleetSize || undefined,
      requirement: requirement.trim() || undefined,
      budget: budget || undefined,
      goal: goal || undefined,
      experience: experience || undefined,
      riskPreference: riskPreference || undefined,
      message: message.trim() || undefined,
    }).subscribe({
      next: () => { this.sending = false; this.submitted = true; },
      error: (err: Error) => {
        this.sending = false;
        this.errorMsg = err.message || 'Something went wrong. Please try again.';
      },
    });
  }
}
