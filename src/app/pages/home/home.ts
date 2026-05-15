import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../../services/nav.service';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroSectionComponent } from '../../components/hero/hero-section.component';
import { FeaturesRevealSectionComponent } from '../../components/features-reveal/features-reveal-section.component';
import { MutualFundSliderComponent } from '../../components/mutual-fund-slider/mutual-fund-slider.component';
import { FeaturesSectionComponent } from '../../components/features/features-section.component';
import { DashboardPreviewComponent } from '../../components/dashboard-preview/dashboard-preview.component';
import { HowItWorksComponent } from '../../components/how-it-works/how-it-works.component';
import { TrustSectionComponent } from '../../components/trust/trust-section.component';
import { TestimonialsSectionComponent } from '../../components/testimonials/testimonials-section.component';
import { PricingSectionComponent } from '../../components/pricing/pricing-section.component';
import { CtaFinalComponent } from '../../components/cta-final/cta-final.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProductShowcaseComponent } from '../../components/product-showcase/product-showcase.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroSectionComponent,
    FeaturesRevealSectionComponent,
    MutualFundSliderComponent,
    FeaturesSectionComponent,
    DashboardPreviewComponent,
    HowItWorksComponent,
    TrustSectionComponent,
    TestimonialsSectionComponent,
    PricingSectionComponent,
    CtaFinalComponent,
    FooterComponent,
    ProductShowcaseComponent,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  private nav = inject(NavService);

  openLeadModal(): void {
    this.nav.openModalFor('mf');
  }
}
