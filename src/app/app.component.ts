import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './components/hero/hero-section.component';
import { ProblemSectionComponent } from './components/problem/problem-section.component';
import { BeforeAfterSectionComponent } from './components/before-after/before-after-section.component';
import { FeaturesSectionComponent } from './components/features/features-section.component';
import { LiveTrackingSectionComponent } from './components/live-tracking/live-tracking-section.component';
import { ReviewsSectionComponent } from './components/reviews/reviews-section.component';
import { MutualFundsSectionComponent } from './components/mutual-funds/mutual-funds-section.component';
import { PricingSectionComponent } from './components/pricing/pricing-section.component';
import { CtaSectionComponent } from './components/cta/cta-section.component';
import { ComingSoonSectionComponent } from './components/coming-soon/coming-soon-section.component';
import { FooterComponent } from './components/footer/footer.component';
import { LeadModalComponent } from './components/lead-modal/lead-modal.component';
import { RabbitLoaderComponent } from './components/rabbit-loader/rabbit-loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroSectionComponent,
    ProblemSectionComponent,
    BeforeAfterSectionComponent,
    FeaturesSectionComponent,
    LiveTrackingSectionComponent,
    ReviewsSectionComponent,
    MutualFundsSectionComponent,
    PricingSectionComponent,
    CtaSectionComponent,
    ComingSoonSectionComponent,
    FooterComponent,
    LeadModalComponent,
    RabbitLoaderComponent,
  ],
  template: `
    <div *ngIf="loading">
      <app-rabbit-loader [duration]="3600" [fullScreen]="true"></app-rabbit-loader>
    </div>
    <div *ngIf="!loading" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #080A12;">
      <app-navbar></app-navbar>
      <!-- 1. Hero -->
      <section id="home">
        <app-hero-section (openModal)="openModal()"></app-hero-section>
      </section>
      <!-- 2. Problem -->
      <app-problem-section></app-problem-section>
      <!-- 3. Fleet Value -->
      <app-before-after-section></app-before-after-section>
      <!-- 4. Solution / Features -->
      <section id="fleet-solutions">
        <app-features-section></app-features-section>
      </section>
      <!-- 5. Live Demo -->
      <app-live-tracking-section></app-live-tracking-section>
      <!-- 6. Trust / Reviews -->
      <app-reviews-section></app-reviews-section>
      <!-- 7. Mutual Funds -->
      <section id="mutual-fund">
        <app-mutual-funds-section (openModal)="openModal()"></app-mutual-funds-section>
      </section>
      <!-- 8. Pricing -->
      <section id="pricing">
        <app-pricing-section (openModal)="openModal()"></app-pricing-section>
      </section>
      <!-- 9. Coming Soon -->
      <app-coming-soon-section></app-coming-soon-section>
      <!-- 10. Final CTA -->
      <app-cta-section (openModal)="openModal()"></app-cta-section>
      <section id="about">
        <app-footer></app-footer>
      </section>
      <app-lead-modal [open]="modalOpen" (closeModal)="closeModal()"></app-lead-modal>
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  modalOpen = false;
  loading = true;
  private timer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.timer = setTimeout(() => {
      this.loading = false;
    }, 4000);
  }

  ngOnDestroy() {
    if (this.timer) clearTimeout(this.timer);
  }

  openModal() { this.modalOpen = true; }
  closeModal() { this.modalOpen = false; }
}
