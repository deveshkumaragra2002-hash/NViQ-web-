import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface Review {
  name: string;
  rating: number;
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(24px)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('flashIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.96)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.96)' })),
      ]),
    ]),
  ],
  template: `
    <div class="rf-wrapper">
      <!-- Form Section -->
      <div class="rf-form-card" @slideIn>
        <div class="rf-form-header">
          <h3 class="rf-title">Write a Review</h3>
          <p class="rf-subtitle">Share your experience with this product</p>
        </div>

        <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" novalidate>
          <!-- Name Field -->
          <div class="rf-field">
            <label class="rf-label">Your Name</label>
            <input
              class="rf-input"
              [class.rf-input--error]="isFieldInvalid('name')"
              type="text"
              formControlName="name"
              placeholder="Enter your name"
              autocomplete="off"
            />
            <span class="rf-error" *ngIf="isFieldInvalid('name')">Name is required.</span>
          </div>

          <!-- Rating Field -->
          <div class="rf-field">
            <label class="rf-label">Rating</label>
            <div class="rf-stars-interactive" role="group" aria-label="Select rating">
              <button
                *ngFor="let star of starsArray; let i = index"
                type="button"
                class="rf-star-btn"
                [class.rf-star-btn--filled]="i < (hoveredRating || selectedRating)"
                (mouseenter)="hoveredRating = i + 1"
                (mouseleave)="hoveredRating = 0"
                (click)="selectRating(i + 1)"
                [attr.aria-label]="'Rate ' + (i + 1) + ' star' + (i > 0 ? 's' : '')"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="rf-star-icon">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
            </div>
            <span class="rf-error" *ngIf="submitted && selectedRating === 0">Please select a rating.</span>
          </div>

          <!-- Review Text Field -->
          <div class="rf-field">
            <label class="rf-label">Your Review</label>
            <textarea
              class="rf-textarea"
              [class.rf-textarea--error]="isFieldInvalid('reviewText')"
              formControlName="reviewText"
              placeholder="Tell others what you think about this product..."
              rows="4"
            ></textarea>
            <span class="rf-error" *ngIf="isFieldInvalid('reviewText')">Review text is required.</span>
          </div>

          <button
            type="submit"
            class="rf-submit-btn"
            [class.rf-submit-btn--loading]="submitting"
            [disabled]="submitting"
          >
            <span *ngIf="!submitting">Submit Review</span>
            <span *ngIf="submitting" class="rf-spinner-wrap">
              <span class="rf-spinner"></span> Submitting...
            </span>
          </button>
        </form>

        <!-- Success Flash -->
        <div class="rf-success" *ngIf="showSuccess" @flashIn>
          <svg viewBox="0 0 24 24" class="rf-success-icon" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          Review submitted successfully!
        </div>
      </div>

      <!-- Reviews List -->
      <div class="rf-reviews-section" *ngIf="reviews.length > 0">
        <div class="rf-reviews-header">
          <h4 class="rf-reviews-title">
            {{ reviews.length }} {{ reviews.length === 1 ? 'Review' : 'Reviews' }}
          </h4>
          <div class="rf-avg-rating" *ngIf="averageRating > 0">
            <span class="rf-avg-number">{{ averageRating | number: '1.1-1' }}</span>
            <div class="rf-avg-stars">
              <svg
                *ngFor="let s of starsArray; let i = index"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                class="rf-avg-star"
                [class.rf-avg-star--filled]="i < roundedAvg"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="rf-reviews-list">
          <div
            class="rf-review-card"
            *ngFor="let review of reviews; trackBy: trackByIndex"
            @fadeUp
          >
            <div class="rf-review-top">
              <div class="rf-avatar">{{ getInitials(review.name) }}</div>
              <div class="rf-review-meta">
                <span class="rf-reviewer-name">{{ review.name }}</span>
                <span class="rf-review-time">{{ getRelativeTime(review.timestamp) }}</span>
              </div>
              <div class="rf-review-stars">
                <svg
                  *ngFor="let s of starsArray; let i = index"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  class="rf-display-star"
                  [class.rf-display-star--filled]="i < review.rating"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            <p class="rf-review-text">{{ review.text }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .rf-wrapper {
      max-width: 680px;
      margin: 0 auto;
      padding: 24px 16px;
      background: #0A0A0A;
      min-height: 100%;
    }

    /* ── Form Card ─────────────────────────────── */
    .rf-form-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 32px;
      backdrop-filter: blur(8px);
    }

    .rf-form-header {
      margin-bottom: 28px;
    }

    .rf-title {
      margin: 0 0 6px;
      font-size: 1.375rem;
      font-weight: 700;
      color: #F9FAFB;
      letter-spacing: -0.02em;
    }

    .rf-subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: rgba(255,255,255,0.45);
    }

    /* ── Fields ────────────────────────────────── */
    .rf-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 22px;
    }

    .rf-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: rgba(255,255,255,0.7);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .rf-input,
    .rf-textarea {
      width: 100%;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 0.9375rem;
      color: #F9FAFB;
      outline: none;
      transition: border-color 200ms ease, background 200ms ease, box-shadow 200ms ease;
      box-sizing: border-box;
      resize: vertical;
    }

    .rf-input::placeholder,
    .rf-textarea::placeholder {
      color: rgba(255,255,255,0.25);
    }

    .rf-input:focus,
    .rf-textarea:focus {
      border-color: #3B82F6;
      background: rgba(59,130,246,0.06);
      box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
    }

    .rf-input--error,
    .rf-textarea--error {
      border-color: #EF4444 !important;
      box-shadow: 0 0 0 3px rgba(239,68,68,0.12) !important;
    }

    .rf-error {
      font-size: 0.8125rem;
      color: #F87171;
    }

    /* ── Star Rating ───────────────────────────── */
    .rf-stars-interactive {
      display: flex;
      gap: 6px;
    }

    .rf-star-btn {
      background: none;
      border: none;
      padding: 2px;
      cursor: pointer;
      line-height: 0;
      transition: transform 150ms ease;
    }

    .rf-star-btn:hover {
      transform: scale(1.2);
    }

    .rf-star-btn:focus-visible {
      outline: 2px solid #3B82F6;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .rf-star-icon {
      width: 32px;
      height: 32px;
      fill: rgba(255,255,255,0.15);
      stroke: rgba(255,255,255,0.2);
      stroke-width: 1.5;
      transition: fill 150ms ease, stroke 150ms ease;
    }

    .rf-star-btn--filled .rf-star-icon {
      fill: #F59E0B;
      stroke: #D97706;
    }

    /* ── Submit Button ─────────────────────────── */
    .rf-submit-btn {
      width: 100%;
      padding: 14px 24px;
      background: linear-gradient(135deg, #3B82F6, #2563EB);
      border: none;
      border-radius: 10px;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      transition: opacity 200ms ease, transform 150ms ease, box-shadow 200ms ease;
      box-shadow: 0 4px 16px rgba(59,130,246,0.3);
      margin-top: 4px;
    }

    .rf-submit-btn:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(59,130,246,0.4);
    }

    .rf-submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .rf-submit-btn:disabled,
    .rf-submit-btn--loading {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .rf-spinner-wrap {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .rf-spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: rf-spin 0.7s linear infinite;
    }

    @keyframes rf-spin {
      to { transform: rotate(360deg); }
    }

    /* ── Success Flash ─────────────────────────── */
    .rf-success {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 18px;
      padding: 14px 18px;
      background: rgba(34,197,94,0.1);
      border: 1px solid rgba(34,197,94,0.25);
      border-radius: 10px;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #4ADE80;
    }

    .rf-success-icon {
      width: 20px;
      height: 20px;
      stroke: #4ADE80;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
      flex-shrink: 0;
    }

    /* ── Reviews Section ───────────────────────── */
    .rf-reviews-section {
      margin-top: 8px;
    }

    .rf-reviews-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .rf-reviews-title {
      margin: 0;
      font-size: 1.0625rem;
      font-weight: 700;
      color: #F9FAFB;
    }

    .rf-avg-rating {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .rf-avg-number {
      font-size: 1.25rem;
      font-weight: 700;
      color: #F59E0B;
    }

    .rf-avg-stars {
      display: flex;
      gap: 2px;
    }

    .rf-avg-star {
      width: 16px;
      height: 16px;
      fill: rgba(255,255,255,0.15);
      stroke: rgba(255,255,255,0.15);
      stroke-width: 1.5;
    }

    .rf-avg-star--filled {
      fill: #F59E0B;
      stroke: #D97706;
    }

    .rf-reviews-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    /* ── Review Card ───────────────────────────── */
    .rf-review-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      padding: 22px 24px;
      transition: border-color 200ms ease;
    }

    .rf-review-card:hover {
      border-color: rgba(255,255,255,0.14);
    }

    .rf-review-top {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    .rf-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3B82F6, #8B5CF6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
      letter-spacing: 0.02em;
    }

    .rf-review-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }

    .rf-reviewer-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #F9FAFB;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rf-review-time {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.35);
    }

    .rf-review-stars {
      display: flex;
      gap: 3px;
      margin-left: auto;
    }

    .rf-display-star {
      width: 16px;
      height: 16px;
      fill: rgba(255,255,255,0.15);
      stroke: rgba(255,255,255,0.15);
      stroke-width: 1.5;
    }

    .rf-display-star--filled {
      fill: #F59E0B;
      stroke: #D97706;
    }

    .rf-review-text {
      margin: 0;
      font-size: 0.9375rem;
      line-height: 1.65;
      color: rgba(255,255,255,0.72);
      word-break: break-word;
    }

    /* ── Responsive ────────────────────────────── */
    @media (max-width: 520px) {
      .rf-form-card {
        padding: 22px 18px;
      }

      .rf-review-card {
        padding: 18px 16px;
      }

      .rf-review-stars {
        margin-left: 0;
        width: 100%;
        margin-top: 4px;
      }

      .rf-review-top {
        flex-wrap: wrap;
      }
    }
  `],
})
export class ReviewFormComponent implements OnInit {
  @Input() productType: 'gps' | 'mf' = 'gps';

  private static reviewsStore: Map<string, Review[]> = new Map();

  reviewForm!: FormGroup;
  starsArray = [0, 1, 2, 3, 4];
  selectedRating = 0;
  hoveredRating = 0;
  submitted = false;
  submitting = false;
  showSuccess = false;

  get reviews(): Review[] {
    return ReviewFormComponent.reviewsStore.get(this.productType) ?? [];
  }

  get averageRating(): number {
    const list = this.reviews;
    if (!list.length) return 0;
    return list.reduce((sum, r) => sum + r.rating, 0) / list.length;
  }

  get roundedAvg(): number {
    return Math.round(this.averageRating);
  }

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.buildForm();
    if (!ReviewFormComponent.reviewsStore.has(this.productType)) {
      ReviewFormComponent.reviewsStore.set(this.productType, []);
    }
  }

  private buildForm(): void {
    this.reviewForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      reviewText: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  selectRating(value: number): void {
    this.selectedRating = value;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.reviewForm.get(field);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.reviewForm.invalid || this.selectedRating === 0) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    setTimeout(() => {
      const { name, reviewText } = this.reviewForm.value;

      const list = ReviewFormComponent.reviewsStore.get(this.productType) ?? [];
      const newReview: Review = {
        name: (name as string).trim(),
        rating: this.selectedRating,
        text: (reviewText as string).trim(),
        timestamp: new Date(),
      };

      ReviewFormComponent.reviewsStore.set(this.productType, [newReview, ...list]);

      this.submitting = false;
      this.submitted = false;
      this.selectedRating = 0;
      this.hoveredRating = 0;
      this.reviewForm.reset();
      this.showSuccess = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.showSuccess = false;
        this.cdr.detectChanges();
      }, 3500);
    }, 600);
  }

  getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word[0]?.toUpperCase() ?? '')
      .join('');
  }

  getRelativeTime(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 30) return 'Just now';
    if (diffSec < 90) return '1 min ago';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 2) return '1 hour ago';
    if (diffHr < 24) return `${diffHr} hours ago`;
    if (diffDay < 2) return 'Yesterday';
    return `${diffDay} days ago`;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
