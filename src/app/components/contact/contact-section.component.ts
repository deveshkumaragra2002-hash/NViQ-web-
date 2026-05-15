import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="git-root">

      <!-- Background layers -->
      <div class="git-bg" aria-hidden="true">
        <div class="git-grad"></div>
        <div class="git-orb git-orb-1"></div>
        <div class="git-orb git-orb-2"></div>
        <div class="git-grid"></div>
      </div>

      <!-- ── Hero Image Banner ── -->
      <div class="git-hero-banner">
        <img class="git-hero-img" src="images/contact-hero.jpg.jpg" alt="Contact NViQ" />
        <div class="git-hero-overlay"></div>
        <div class="git-hero-content">
          <span class="git-eyebrow git-eyebrow-hero">
            <span class="eyebrow-dot"></span>
            Reach Out
          </span>
          <h1 class="git-title git-title-hero">GET IN TOUCH</h1>
          <p class="git-sub git-sub-hero">
            We're here to help. Reach us through any of the channels below
            and we'll respond within 2 business hours.
          </p>
        </div>
        <!-- Decorative bottom fade -->
        <div class="git-hero-fade"></div>
      </div>

      <div class="git-container">

        <!-- ── Header (hidden — moved to hero) ── -->
        <header class="git-header" style="display:none">
          <span class="git-eyebrow">
            <span class="eyebrow-dot"></span>
            Reach Out
          </span>
          <h1 class="git-title">GET IN TOUCH</h1>
          <p class="git-sub">
            We're here to help. Reach us through any of the channels below
            and we'll respond within 2 business hours.
          </p>
        </header>

        <!-- ── Main Contact Us Card ── -->
        <div class="git-card">

          <!-- Phone -->
          <div class="git-row" *ngFor="let row of contactRows; let last = last"
            [class.git-row-last]="last">
            <div class="git-icon-wrap" [style.--ic]="row.color">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                [attr.stroke]="row.color" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <path [attr.d]="row.icon"/>
              </svg>
            </div>
            <div class="git-row-body">
              <p class="git-row-label">{{ row.label }}</p>
              <ng-container *ngIf="row.values.length === 1">
                <p class="git-row-val">{{ row.values[0] }}</p>
              </ng-container>
              <ng-container *ngIf="row.values.length > 1">
                <div class="git-multi">
                  <div class="git-multi-item" *ngFor="let item of row.values">
                    <span class="git-multi-tag">{{ item.tag }}</span>
                    <span class="git-multi-val">{{ item.val }}</span>
                  </div>
                </div>
              </ng-container>
            </div>
            <div class="git-row-glow"></div>
          </div>

        </div>

        <!-- ── Contact Us Form ── -->
        <div class="git-form-wrap">
          <div class="git-form-header">
            <h2 class="git-form-title">Send Us a Message</h2>
            <p class="git-form-sub">Fill out the form and our team will get back to you shortly.</p>
          </div>

          <form class="git-form" (ngSubmit)="onSubmit()" #ngf="ngForm">
            <div class="git-form-row">
              <div class="git-field">
                <label for="git-name">Full Name</label>
                <input id="git-name" name="name" type="text"
                  placeholder="Your full name"
                  [(ngModel)]="form.name"
                  [class.err]="nameErr">
                <span class="git-err" *ngIf="nameErr">Name is required</span>
              </div>
              <div class="git-field">
                <label for="git-phone">Phone Number</label>
                <input id="git-phone" name="phone" type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  [(ngModel)]="form.phone"
                  [class.err]="phoneErr">
                <span class="git-err" *ngIf="phoneErr">Phone is required</span>
              </div>
            </div>

            <div class="git-field">
              <label for="git-email">Email Address</label>
              <input id="git-email" name="email" type="email"
                placeholder="you@company.com"
                [(ngModel)]="form.email"
                [class.err]="emailErr">
              <span class="git-err" *ngIf="emailErr">Valid email required</span>
            </div>

            <div class="git-field">
              <label for="git-company">Company / Fleet Size</label>
              <input id="git-company" name="company" type="text"
                placeholder="Company name &amp; number of vehicles"
                [(ngModel)]="form.company">
            </div>

            <div class="git-field">
              <label for="git-msg">Message</label>
              <textarea id="git-msg" name="message" rows="4"
                placeholder="Tell us about your requirements..."
                [(ngModel)]="form.message"
                [class.err]="msgErr"></textarea>
              <span class="git-err" *ngIf="msgErr">Message is required</span>
            </div>

            <p class="git-err" *ngIf="submitError" style="margin-bottom:10px;text-align:center">
              {{ submitError }}
            </p>

            <button class="git-submit" type="submit" [disabled]="submitted || sending">
              <ng-container *ngIf="!submitted && !sending">
                Send Message
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </ng-container>
              <ng-container *ngIf="sending">
                Sending...
              </ng-container>
              <ng-container *ngIf="submitted">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Message Sent!
              </ng-container>
            </button>
          </form>
        </div>

      </div>
    </section>
  `,
  styles: [`
    /* ── Root ─────────────────────────────────────────── */
    .git-root {
      min-height: 100vh;
      position: relative; overflow: hidden;
      padding: 0 0 96px;
      font-family: 'Outfit', sans-serif;
    }

    /* ── Hero Banner ───────────────────────────────────── */
    .git-hero-banner {
      position: relative;
      width: 100%;
      height: 460px;
      overflow: hidden;
      margin-bottom: 60px;
    }
    .git-hero-img {
      width: 100%; height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }
    .git-hero-overlay {
      position: absolute; inset: 0;
      background:
        linear-gradient(135deg,
          rgba(4,6,16,0.82) 0%,
          rgba(8,14,32,0.65) 40%,
          rgba(4,8,20,0.78) 100%);
    }
    .git-hero-content {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center;
      padding: 100px 24px 60px;
      z-index: 2;
    }
    .git-hero-fade {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 120px;
      background: linear-gradient(to bottom, transparent, #05080F);
      z-index: 3;
    }
    .git-eyebrow-hero { margin-bottom: 20px; }
    .git-title-hero {
      animation: gitFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both;
    }
    .git-sub-hero {
      animation: gitFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both;
    }

    /* ── Background ────────────────────────────────────── */
    .git-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }

    .git-grad {
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 50% 0%,   rgba(14,30,64,0.95) 0%, transparent 65%),
        radial-gradient(ellipse 70% 50% at 20% 80%,  rgba(6,20,48,0.8)   0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 90%,  rgba(10,15,35,0.7)  0%, transparent 55%),
        linear-gradient(160deg, #05080F 0%, #080D1C 40%, #060A16 70%, #040710 100%);
    }

    .git-orb {
      position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.5;
    }
    .git-orb-1 {
      width: 700px; height: 500px;
      background: radial-gradient(ellipse, rgba(0,90,200,0.18) 0%, transparent 70%);
      top: -100px; right: -150px;
      animation: gitOrbA 22s ease-in-out infinite;
    }
    .git-orb-2 {
      width: 500px; height: 500px;
      background: radial-gradient(ellipse, rgba(0,50,150,0.12) 0%, transparent 70%);
      bottom: 0; left: -100px;
      animation: gitOrbB 28s ease-in-out infinite;
    }
    @keyframes gitOrbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-60px,80px)} }
    @keyframes gitOrbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(80px,-60px)} }

    .git-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
      background-size: 64px 64px;
      mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 80%);
    }

    /* ── Container ─────────────────────────────────────── */
    .git-container {
      position: relative; z-index: 1;
      max-width: 700px; margin: 0 auto;
      display: flex; flex-direction: column; align-items: center; gap: 40px;
      padding: 0 24px;
    }

    /* ── Header ────────────────────────────────────────── */
    .git-header {
      text-align: center; width: 100%;
      animation: gitFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    }
    @keyframes gitFadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: none; }
    }

    .git-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 5px 16px; border-radius: 999px;
      border: 1px solid rgba(0,160,255,0.25);
      background: rgba(0,120,255,0.08);
      color: #60B4FF;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.14em;
      margin-bottom: 20px;
    }
    .eyebrow-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #60B4FF;
      animation: eyeDot 2s ease-in-out infinite;
    }
    @keyframes eyeDot {
      0%,100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.4; transform: scale(0.7); }
    }

    .git-title {
      font-size: clamp(2.4rem, 6vw, 4.2rem);
      font-weight: 900; letter-spacing: 0.04em;
      color: #fff; line-height: 1; margin: 0 0 16px;
    }
    .git-sub {
      color: rgba(255,255,255,0.4); font-size: 1rem; line-height: 1.7;
      max-width: 520px; margin: 0 auto;
    }

    /* ── Contact Us Card ──────────────────────────────────── */
    .git-card {
      width: 100%;
      background: rgba(8,13,26,0.82);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow:
        0 0 0 1px rgba(0,100,255,0.06),
        0 24px 64px rgba(0,0,0,0.55),
        0 1px 0 0 rgba(255,255,255,0.06) inset;
      overflow: hidden;
      animation: gitFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both;
    }

    /* ── Contact Row ───────────────────────────────────── */
    .git-row {
      position: relative; overflow: hidden;
      display: flex; align-items: flex-start; gap: 20px;
      padding: 22px 28px;
      border-bottom: 1px solid rgba(255,255,255,0.055);
      transition: background 0.25s ease;
      cursor: default;
    }
    .git-row-last { border-bottom: none; }
    .git-row:hover { background: rgba(255,255,255,0.025); }

    /* Hover glow streak */
    .git-row-glow {
      position: absolute; left: 0; top: 0; bottom: 0;
      width: 3px;
      background: var(--ic, #00D4FF);
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .git-row:hover .git-row-glow { opacity: 1; }

    /* Icon */
    .git-icon-wrap {
      width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      display: flex; align-items: center; justify-content: center;
      transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    }
    .git-row:hover .git-icon-wrap {
      background: rgba(var(--ic-rgb, 0,212,255), 0.08);
      border-color: rgba(var(--ic-rgb, 0,212,255), 0.2);
      box-shadow: 0 0 16px rgba(var(--ic-rgb, 0,212,255), 0.15);
    }

    /* Row body */
    .git-row-body { flex: 1; min-width: 0; }
    .git-row-label {
      font-size: 10px; font-weight: 700;
      color: rgba(255,255,255,0.28);
      text-transform: uppercase; letter-spacing: 0.14em;
      margin-bottom: 6px;
    }
    .git-row-val {
      font-size: 0.95rem; font-weight: 600;
      color: rgba(255,255,255,0.82); line-height: 1.5;
    }

    /* Multi-value rows (email) */
    .git-multi {
      display: flex; flex-direction: column; gap: 7px;
    }
    .git-multi-item {
      display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;
    }
    .git-multi-tag {
      font-size: 10px; font-weight: 700;
      color: rgba(255,255,255,0.28);
      text-transform: uppercase; letter-spacing: 0.1em;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 2px 8px; border-radius: 6px;
      flex-shrink: 0;
    }
    .git-multi-val {
      font-size: 0.9rem; font-weight: 600;
      color: rgba(255,255,255,0.75);
      word-break: break-all;
    }

    /* ── Form Wrapper ──────────────────────────────────── */
    .git-form-wrap {
      width: 100%;
      animation: gitFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s both;
    }
    .git-form-header { text-align: center; margin-bottom: 28px; }
    .git-form-title {
      font-size: 1.6rem; font-weight: 800; color: #fff;
      letter-spacing: -0.02em; margin-bottom: 8px;
    }
    .git-form-sub { color: rgba(255,255,255,0.35); font-size: 0.9rem; }

    .git-form {
      background: rgba(8,13,26,0.82);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 32px;
      display: flex; flex-direction: column; gap: 18px;
      backdrop-filter: blur(24px);
      box-shadow: 0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,100,255,0.05);
    }
    .git-form-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    }

    .git-field { display: flex; flex-direction: column; gap: 7px; }
    .git-field label {
      font-size: 11px; font-weight: 700;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase; letter-spacing: 0.1em;
    }
    .git-field input, .git-field textarea {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 12px; padding: 12px 16px;
      color: #fff; font-size: 14px; font-family: 'Outfit', sans-serif;
      outline: none; resize: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .git-field input::placeholder, .git-field textarea::placeholder {
      color: rgba(255,255,255,0.18);
    }
    .git-field input:focus, .git-field textarea:focus {
      border-color: rgba(0,160,255,0.4);
      box-shadow: 0 0 0 3px rgba(0,120,255,0.08);
    }
    .git-field input.err, .git-field textarea.err {
      border-color: rgba(255,60,60,0.45);
    }
    .git-err { font-size: 11px; color: #FF5555; font-weight: 600; }

    /* Submit button */
    .git-submit {
      display: inline-flex; align-items: center; justify-content: center; gap: 9px;
      height: 52px; padding: 0 32px; border-radius: 14px; border: none;
      background: linear-gradient(135deg, #0060E0, #0040A0);
      color: #fff; font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 28px rgba(0,80,200,0.35);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .git-submit:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 14px 42px rgba(0,100,255,0.5);
    }
    .git-submit:disabled {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      box-shadow: 0 8px 28px rgba(34,197,94,0.3);
      cursor: default;
    }
    .git-submit svg { transition: transform 0.2s ease; }
    .git-submit:hover:not(:disabled) svg { transform: translateX(3px); }

    /* ── Responsive ─────────────────────────────────────── */
    @media (max-width: 640px) {
      .git-root { padding: 0 0 72px; }
      .git-hero-banner { height: 320px; }
      .git-hero-content { padding: 80px 16px 40px; }
      .git-form-row { grid-template-columns: 1fr; }
      .git-form { padding: 24px 20px; }
      .git-row { padding: 18px 20px; gap: 14px; }
      .git-multi-item { flex-direction: column; gap: 3px; }
    }
  `]
})
export class ContactSectionComponent implements OnInit {
  private api = inject(ApiService);

  form = { name: '', phone: '', email: '', company: '', message: '' };
  submitted  = false;
  sending    = false;
  submitError = '';
  nameErr  = false;
  phoneErr = false;
  emailErr = false;
  msgErr   = false;

  /* Phone icon path */
  private iconPhone = 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.38 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z';
  private iconMail  = 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6';
  private iconPin   = 'M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';

  contactRows: any[] = [];

  ngOnInit(): void {
    this.contactRows = [
      {
        icon: this.iconPhone,
        color: '#2563EB',
        label: 'Phone',
        values: ['+91 8529245390'],
      },
      {
        icon: this.iconMail,
        color: '#60B4FF',
        label: 'Email',
        values: ['naviqbharat@gmail.com'],
      },
      {
        icon: this.iconPin,
        color: '#22c55e',
        label: 'Registered Office',
        values: [
          'NViQ Technologies Pvt. Ltd.',
          'Malakhera Jamalpur 301406,',
          'Alwar, Rajasthan, India',
        ].join('\n'),
      },
    ];

    /* Fix: multi-line address stored as single string */
    this.contactRows[2].values = [this.contactRows[2].values as string];
  }

  onSubmit(): void {
    this.nameErr  = !this.form.name.trim();
    this.phoneErr = !this.form.phone.trim();
    this.emailErr = !this.form.email.trim() || !this.form.email.includes('@');
    this.msgErr   = !this.form.message.trim();

    if (this.nameErr || this.phoneErr || this.emailErr || this.msgErr) return;

    this.sending     = true;
    this.submitError = '';

    const payload = {
      name:    this.form.name.trim(),
      email:   this.form.email.trim(),
      phone:   this.form.phone.trim(),
      message: `${this.form.company ? '[' + this.form.company.trim() + '] ' : ''}${this.form.message.trim()}`,
    };

    this.api.submitContact(payload).subscribe({
      next: () => {
        this.submitted = true;
        this.sending   = false;
        this.form      = { name: '', phone: '', email: '', company: '', message: '' };
        setTimeout(() => { this.submitted = false; }, 4000);
      },
      error: (err: Error) => {
        this.sending     = false;
        this.submitError = err.message || 'Failed to send. Please try again.';
      },
    });
  }
}
