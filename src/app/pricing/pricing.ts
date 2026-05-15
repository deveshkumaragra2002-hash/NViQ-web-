import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavService } from '../services/nav.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <!-- ===== PRICING SECTION ===== -->
    <section class="pricing-section">
      <div class="section-header">
        <span class="section-badge">
          <span class="badge-dot"></span>
          Simple Pricing
        </span>
        <h2 class="section-title">One plan. Everything included.</h2>
        <p class="section-sub">No hidden charges. No contracts. Cancel anytime.</p>
      </div>

      <!-- Pricing Card -->
      <div class="card-wrapper">
        <div class="pricing-card">
          <!-- Glow effect -->
          <div class="card-glow"></div>

          <!-- Top Badge -->
          <div class="card-top-badge">Most Popular</div>

          <!-- Plan Header -->
          <div class="plan-header">
            <div class="plan-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#38bdf8"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" fill="none"/>
              </svg>
            </div>
            <div>
              <h3 class="plan-name">Per Vehicle Plan</h3>
              <p class="plan-tagline">Full fleet intelligence, per vehicle</p>
            </div>
          </div>

          <!-- Price -->
          <div class="price-block">
            <div class="price-row">
              <span class="currency">₹</span>
              <span class="amount">499</span>
              <div class="price-meta">
                <span class="per-month">/ month</span>
                <span class="per-vehicle">per vehicle</span>
              </div>
            </div>
            <div class="price-savings">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              Save ₹600/year on annual billing
            </div>
          </div>

          <!-- Divider -->
          <div class="card-divider"></div>

          <!-- Features List -->
          <div class="features-label">What's included</div>
          <ul class="features-list">
            <li *ngFor="let feature of features" class="feature-item">
              <span class="feature-check">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              </span>
              <div class="feature-text">
                <span class="feature-name">{{ feature.name }}</span>
                <span class="feature-desc">{{ feature.desc }}</span>
              </div>
            </li>
          </ul>

          <!-- Divider -->
          <div class="card-divider"></div>

          <!-- CTA Button -->
          <button class="cta-btn" (click)="openModal()">
            <span>Get Started</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>

          <!-- Trial note -->
          <p class="trial-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
            14-day free trial · No credit card required
          </p>
        </div>

        <!-- Trust indicators beside/below card -->
        <div class="trust-items">
          <div class="trust-item" *ngFor="let t of trustItems">
            <span class="trust-icon">{{ t.icon }}</span>
            <div>
              <div class="trust-title">{{ t.title }}</div>
              <div class="trust-sub">{{ t.sub }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== MODAL OVERLAY ===== -->
    <div class="modal-overlay" [class.visible]="modalOpen()" (click)="onOverlayClick($event)">
      <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        <!-- Close Button -->
        <button class="modal-close" (click)="closeModal()" aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <!-- === SUCCESS STATE === -->
        <div class="success-state" *ngIf="submitSuccess()">
          <div class="success-animation">
            <div class="success-ring"></div>
            <svg class="success-check" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h3>You're all set! 🎉</h3>
          <p class="success-msg">We will contact you shortly</p>
          <div class="success-details">
            <div class="sd-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.61a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg>
              Our team will call within 2 business hours
            </div>
            <div class="sd-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Check your email for next steps
            </div>
          </div>
          <button class="btn-success-close" (click)="closeModal()">Done</button>
        </div>

        <!-- === FORM STATE === -->
        <div class="form-state" *ngIf="!submitSuccess()">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="modal-plan-badge">
              <span class="mpb-price">₹499</span>
              <span class="mpb-label">Per Vehicle / Month</span>
            </div>
            <h2 id="modal-title">Start your free trial</h2>
            <p>Fill in your details and we'll set up your account today.</p>
          </div>

          <!-- Form -->
          <form [formGroup]="leadForm" (ngSubmit)="onSubmit()" novalidate>

            <!-- Full Name -->
            <div class="field-group" [class.field-error]="isInvalid('name')" [class.field-success]="isValid('name')">
              <label for="name">
                Full Name
                <span class="required-star">*</span>
              </label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  placeholder="Ravi Kumar"
                  autocomplete="name"
                />
                <span class="input-status" *ngIf="isValid('name')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
              </div>
              <div class="error-msg" *ngIf="isInvalid('name')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                Full name is required
              </div>
            </div>

            <!-- Phone Number -->
            <div class="field-group" [class.field-error]="isInvalid('phone')" [class.field-success]="isValid('phone')">
              <label for="phone">
                Phone Number
                <span class="required-star">*</span>
              </label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.61a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg>
                </span>
                <span class="phone-prefix">+91</span>
                <input
                  id="phone"
                  type="tel"
                  formControlName="phone"
                  placeholder="98765 43210"
                  autocomplete="tel"
                  maxlength="10"
                  class="has-prefix"
                />
                <span class="input-status" *ngIf="isValid('phone')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
              </div>
              <div class="error-msg" *ngIf="isInvalid('phone')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                <span *ngIf="getControl('phone')?.errors?.['required']">Phone number is required</span>
                <span *ngIf="getControl('phone')?.errors?.['pattern']">Enter a valid 10-digit Indian mobile number</span>
              </div>
            </div>

            <!-- Email -->
            <div class="field-group" [class.field-error]="isInvalid('email')" [class.field-success]="isValid('email')">
              <label for="email">
                Email Address
                <span class="required-star">*</span>
              </label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="ravi@company.in"
                  autocomplete="email"
                />
                <span class="input-status" *ngIf="isValid('email')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
              </div>
              <div class="error-msg" *ngIf="isInvalid('email')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                <span *ngIf="getControl('email')?.errors?.['required']">Email address is required</span>
                <span *ngIf="getControl('email')?.errors?.['email']">Enter a valid email address</span>
              </div>
            </div>

            <!-- API Error -->
            <div class="api-error" *ngIf="apiError()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
              {{ apiError() }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="submit-btn"
              [class.loading]="isLoading()"
              [disabled]="isLoading()"
            >
              <!-- Normal state -->
              <span class="btn-content" *ngIf="!isLoading()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Start Free Trial
              </span>
              <!-- Loading state -->
              <span class="btn-content" *ngIf="isLoading()">
                <span class="spinner">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                </span>
                Submitting...
              </span>
            </button>

            <p class="form-footer-note">
              By submitting, you agree to our
              <a href="#">Privacy Policy</a> &amp;
              <a href="#">Terms of Service</a>.
              We never spam.
            </p>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ===== GOOGLE FONTS (loaded from index.html ideally) ===== */
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

    /* ===== SECTION ===== */
    .pricing-section {
      min-height: 100vh;
      background: #070c14;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 24px;
      font-family: 'DM Sans', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .pricing-section::before {
      content: '';
      position: absolute;
      top: -200px; left: 50%; transform: translateX(-50%);
      width: 800px; height: 600px;
      background: radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Section header */
    .section-header { text-align: center; margin-bottom: 48px; }

    .section-badge {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
      color: #38bdf8; background: rgba(56,189,248,0.08);
      border: 1px solid rgba(56,189,248,0.18);
      padding: 6px 14px; border-radius: 100px; margin-bottom: 20px;
    }

    .badge-dot {
      width: 6px; height: 6px; background: #38bdf8; border-radius: 50%;
      animation: dotBlink 2s infinite;
    }
    @keyframes dotBlink { 0%,100%{opacity:1}50%{opacity:0.3} }

    .section-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 800;
      color: #e2e8f0; margin-bottom: 10px; letter-spacing: -0.02em;
    }
    .section-sub { font-size: 16px; color: #64748b; }

    /* Card wrapper */
    .card-wrapper {
      display: flex;
      gap: 40px;
      align-items: flex-start;
      justify-content: center;
      flex-wrap: wrap;
      position: relative; z-index: 1;
    }

    /* ===== PRICING CARD ===== */
    .pricing-card {
      background: linear-gradient(145deg, #111929, #0f1e33);
      border: 1px solid rgba(56,189,248,0.25);
      border-radius: 24px;
      padding: 40px 36px;
      width: 100%; max-width: 400px;
      position: relative;
      box-shadow:
        0 0 0 1px rgba(56,189,248,0.06),
        0 24px 64px rgba(0,0,0,0.4),
        0 0 80px rgba(56,189,248,0.06);
      animation: cardIn 0.6s ease forwards;
    }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card-glow {
      position: absolute; inset: 0; border-radius: 24px;
      background: radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.06), transparent 60%);
      pointer-events: none;
    }

    .card-top-badge {
      position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
      background: #38bdf8; color: #070c14;
      font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      padding: 5px 18px; border-radius: 100px;
      white-space: nowrap;
    }

    /* Plan header */
    .plan-header {
      display: flex; align-items: center; gap: 14px; margin-bottom: 28px;
    }
    .plan-icon {
      width: 48px; height: 48px; border-radius: 12px;
      background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .plan-name {
      font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800;
      color: #e2e8f0; margin-bottom: 3px;
    }
    .plan-tagline { font-size: 13px; color: #64748b; }

    /* Price block */
    .price-block { margin-bottom: 24px; }
    .price-row { display: flex; align-items: flex-start; gap: 2px; margin-bottom: 8px; }

    .currency {
      font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700;
      color: #94a3b8; padding-top: 8px;
    }
    .amount {
      font-family: 'Syne', sans-serif; font-size: 4rem; font-weight: 800;
      color: #e2e8f0; line-height: 1; letter-spacing: -0.03em;
    }
    .price-meta { display: flex; flex-direction: column; padding: 10px 0 0 4px; gap: 2px; }
    .per-month { font-size: 14px; color: #64748b; }
    .per-vehicle { font-size: 11px; color: #475569; }

    .price-savings {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; color: #22c55e; font-weight: 500;
      background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.15);
      padding: 4px 10px; border-radius: 100px;
    }

    /* Divider */
    .card-divider {
      height: 1px; background: rgba(255,255,255,0.06);
      margin: 24px 0;
    }

    /* Features */
    .features-label {
      font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      color: #475569; margin-bottom: 14px;
    }
    .features-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }

    .feature-item { display: flex; gap: 12px; align-items: flex-start; }
    .feature-check {
      width: 22px; height: 22px; border-radius: 6px;
      background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
    }
    .feature-text { display: flex; flex-direction: column; gap: 1px; }
    .feature-name { font-size: 14px; font-weight: 600; color: #e2e8f0; }
    .feature-desc { font-size: 12px; color: #64748b; }

    /* CTA */
    .cta-btn {
      width: 100%; padding: 15px 24px;
      background: #38bdf8; color: #070c14;
      font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
      border: none; border-radius: 12px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      transition: all 0.2s ease;
      position: relative; overflow: hidden;
    }
    .cta-btn::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 100%);
    }
    .cta-btn:hover {
      background: #7dd3fc;
      box-shadow: 0 0 32px rgba(56,189,248,0.4);
      transform: translateY(-2px);
    }
    .cta-btn:active { transform: translateY(0); }

    .trial-note {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      font-size: 12px; color: #475569; margin-top: 14px; text-align: center;
    }

    /* Trust items */
    .trust-items {
      display: flex; flex-direction: column; gap: 16px;
      max-width: 240px;
    }
    .trust-item { display: flex; gap: 14px; align-items: flex-start; }
    .trust-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
    .trust-title { font-size: 13px; font-weight: 600; color: #e2e8f0; margin-bottom: 2px; }
    .trust-sub { font-size: 12px; color: #64748b; line-height: 1.5; }

    /* ===== MODAL OVERLAY ===== */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(7,12,20,0.8);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      opacity: 0; pointer-events: none;
      transition: opacity 0.25s ease;
    }
    .modal-overlay.visible { opacity: 1; pointer-events: all; }

    /* Modal Box */
    .modal-box {
      background: #111929;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 40px;
      width: 100%; max-width: 480px;
      position: relative;
      box-shadow: 0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(56,189,248,0.08);
      transform: scale(0.95) translateY(10px);
      transition: transform 0.3s ease;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-overlay.visible .modal-box {
      transform: scale(1) translateY(0);
    }

    /* Modal scrollbar */
    .modal-box::-webkit-scrollbar { width: 4px; }
    .modal-box::-webkit-scrollbar-track { background: transparent; }
    .modal-box::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.2); border-radius: 2px; }

    /* Close button */
    .modal-close {
      position: absolute; top: 16px; right: 16px;
      width: 36px; height: 36px; border-radius: 8px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
      color: #64748b; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease;
    }
    .modal-close:hover { background: rgba(244,63,94,0.1); color: #f43f5e; border-color: rgba(244,63,94,0.2); }

    /* Modal Header */
    .modal-header { margin-bottom: 28px; }

    .modal-plan-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2);
      border-radius: 8px; padding: 6px 12px; margin-bottom: 16px;
    }
    .mpb-price { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #38bdf8; }
    .mpb-label { font-size: 12px; color: #64748b; }

    .modal-header h2 {
      font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800;
      color: #e2e8f0; margin-bottom: 6px; letter-spacing: -0.02em;
    }
    .modal-header p { font-size: 14px; color: #64748b; }

    /* ===== FORM FIELDS ===== */
    .field-group { margin-bottom: 20px; }

    .field-group label {
      display: block; font-size: 13px; font-weight: 600; color: #94a3b8;
      margin-bottom: 8px;
    }
    .required-star { color: #f43f5e; margin-left: 2px; }

    .input-wrapper {
      position: relative; display: flex; align-items: center;
    }

    .input-icon {
      position: absolute; left: 12px; color: #475569;
      display: flex; align-items: center; pointer-events: none;
      transition: color 0.2s;
    }

    .phone-prefix {
      position: absolute; left: 36px;
      font-size: 14px; font-weight: 600; color: #64748b;
      pointer-events: none;
    }

    .input-wrapper input {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 12px 14px 12px 38px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px; color: #e2e8f0;
      outline: none;
      transition: all 0.2s ease;
    }
    .input-wrapper input.has-prefix { padding-left: 72px; }
    .input-wrapper input::placeholder { color: #334155; }

    .input-wrapper input:focus {
      border-color: rgba(56,189,248,0.5);
      background: rgba(56,189,248,0.04);
      box-shadow: 0 0 0 3px rgba(56,189,248,0.1);
    }
    .input-wrapper input:focus + .input-status,
    .input-wrapper input:focus ~ .input-icon { color: #38bdf8; }

    /* Error state */
    .field-error .input-wrapper input {
      border-color: rgba(244,63,94,0.4);
      background: rgba(244,63,94,0.04);
    }
    .field-error .input-icon { color: #f43f5e; }

    /* Success state */
    .field-success .input-wrapper input {
      border-color: rgba(34,197,94,0.3);
    }
    .field-success .input-icon { color: #22c55e; }

    .input-status {
      position: absolute; right: 12px;
      display: flex; align-items: center;
    }

    /* Error message */
    .error-msg {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: #f43f5e; font-weight: 500;
      margin-top: 6px;
    }

    /* API Error */
    .api-error {
      display: flex; align-items: center; gap: 10px;
      background: rgba(244,63,94,0.08); border: 1px solid rgba(244,63,94,0.2);
      border-radius: 10px; padding: 12px 16px;
      font-size: 13px; color: #f43f5e;
      margin-bottom: 20px;
    }

    /* ===== SUBMIT BUTTON ===== */
    .submit-btn {
      width: 100%; padding: 15px;
      background: #38bdf8; color: #070c14;
      font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
      border: none; border-radius: 12px; cursor: pointer;
      transition: all 0.2s ease; position: relative;
      overflow: hidden;
    }
    .submit-btn:hover:not(:disabled) {
      background: #7dd3fc;
      box-shadow: 0 0 32px rgba(56,189,248,0.35);
      transform: translateY(-1px);
    }
    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .submit-btn.loading { background: rgba(56,189,248,0.7); }

    .btn-content { display: flex; align-items: center; justify-content: center; gap: 8px; }

    /* Spinner */
    .spinner svg {
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .form-footer-note {
      font-size: 12px; color: #475569; text-align: center; margin-top: 14px; line-height: 1.6;
    }
    .form-footer-note a { color: #38bdf8; text-decoration: none; }
    .form-footer-note a:hover { text-decoration: underline; }

    /* ===== SUCCESS STATE ===== */
    .success-state { text-align: center; padding: 20px 0; }

    .success-animation {
      position: relative; width: 80px; height: 80px;
      margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;
    }
    .success-ring {
      position: absolute; inset: 0; border-radius: 50%;
      background: rgba(34,197,94,0.1); border: 2px solid rgba(34,197,94,0.3);
      animation: ringPulse 2s ease infinite;
    }
    @keyframes ringPulse {
      0%,100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.7; }
    }
    .success-check { position: relative; z-index: 1; animation: checkIn 0.5s ease; }
    @keyframes checkIn {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }

    .success-state h3 {
      font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800;
      color: #e2e8f0; margin-bottom: 10px;
    }
    .success-msg { font-size: 16px; color: #22c55e; font-weight: 500; margin-bottom: 24px; }

    .success-details {
      background: rgba(56,189,248,0.06); border: 1px solid rgba(56,189,248,0.12);
      border-radius: 12px; padding: 20px;
      display: flex; flex-direction: column; gap: 12px;
      margin-bottom: 28px; text-align: left;
    }
    .sd-row {
      display: flex; align-items: center; gap: 10px;
      font-size: 13px; color: #94a3b8;
    }

    .btn-success-close {
      padding: 12px 32px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
      border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
    }
    .btn-success-close:hover {
      background: rgba(56,189,248,0.1); border-color: rgba(56,189,248,0.3); color: #38bdf8;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 600px) {
      .pricing-card { padding: 32px 24px; }
      .modal-box { padding: 28px 20px; }
      .amount { font-size: 3rem; }
      .trust-items { max-width: 100%; flex-direction: row; flex-wrap: wrap; }
    }
  `]
})
export class PricingComponent {
  private nav = inject(NavService);

  /* ===== SIGNALS ===== */
  modalOpen   = signal(false);
  isLoading   = signal(false);
  submitSuccess = signal(false);
  apiError    = signal('');

  /* ===== STATIC DATA ===== */
  features = [
    { name: 'Live Tracking',  desc: 'Real-time location with 5-sec refresh' },
    { name: 'Trip Analysis',  desc: 'Route history, distance & duration logs' },
    { name: 'Alerts',         desc: 'Overspeed, idle & geofence notifications' },
    { name: 'Reports',        desc: 'Daily/weekly PDF delivered to your inbox' }
  ];

  trustItems = [
    { icon: '⚡', title: '2-Hour Response',    sub: 'Our team calls you back fast.' },
    { icon: '🛠️', title: 'Free Installation',  sub: 'Our tech team handles device setup.' },
    { icon: '🔄', title: 'Cancel Anytime',     sub: 'No lock-in, no penalty, ever.' },
    { icon: '🇮🇳', title: 'Indian Support',    sub: 'Hindi & English, 9 AM – 9 PM.' }
  ];

  /* ===== REACTIVE FORM ===== */
  leadForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.leadForm = this.fb.group({
      name:  ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /* ===== HELPERS ===== */
  getControl(field: string): AbstractControl | null {
    return this.leadForm.get(field);
  }

  isInvalid(field: string): boolean {
    const ctrl = this.getControl(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  isValid(field: string): boolean {
    const ctrl = this.getControl(field);
    return !!(ctrl && ctrl.valid && (ctrl.dirty || ctrl.touched));
  }

  /* ===== MODAL CONTROL ===== */
  openModal(): void {
    this.nav.openModalFor('gps');
  }

  closeModal(): void {
    this.modalOpen.set(false);
    document.body.style.overflow = '';
  }

  onOverlayClick(event: MouseEvent): void {
    // Close only if clicking the backdrop itself, not the modal box
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  /* ===== FORM SUBMIT ===== */
  onSubmit(): void {
    // Mark all fields touched to trigger validation display
    this.leadForm.markAllAsTouched();
    if (this.leadForm.invalid) return;

    this.isLoading.set(true);
    this.apiError.set('');

    const { name, phone, email } = this.leadForm.value;
    const payload = { name, phone, email };

    this.http.post('/api/leads', payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.submitSuccess.set(true);
        this.leadForm.reset();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.apiError.set(
          err?.error?.message ||
          'Something went wrong. Please try again or call us directly.'
        );
      }
    });
  }
}