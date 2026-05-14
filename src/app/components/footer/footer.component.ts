import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-top-glow" aria-hidden="true"></div>
      <div class="container">
        <div class="footer-main">
          <div class="footer-brand">
            <a routerLink="/" class="f-logo">
              <span class="f-logo-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 80 80" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M28 36 C26 28 24 18 26 10 C27 6 30 4 33 6 C36 8 36 14 35 22 L34 30"/>
                  <path d="M38 32 C38 24 40 16 44 12 C46 10 49 10 50 13 C51 16 49 22 46 27 L42 32"/>
                  <path d="M24 36 C22 40 22 46 26 50 C30 54 36 55 42 54 C48 53 52 49 52 44 C52 38 48 33 42 32 L35 30 C30 29 25 32 24 36Z"/>
                  <circle cx="35" cy="42" r="2" fill="white" stroke="none"/>
                  <path d="M26 50 C24 56 24 62 28 66 C32 70 40 71 46 69 C52 67 54 61 52 55 C51 52 49 50 46 49"/>
                  <circle cx="54" cy="62" r="3.5"/>
                  <path d="M30 66 L28 74 M36 68 L36 76 M44 68 L46 76 M50 64 L54 72"/>
                </svg>
              </span>
              <span>NV<span style="color:#3B82F6">i</span>Q</span>
            </a>
            <p class="f-tagline">{{ isMF ? mfContent.tagline : gpsContent.tagline }}</p>
            <div class="f-socials">
              <a href="https://www.facebook.com/profile.php?fb_profile_edit_entry_point" target="_blank" rel="noopener noreferrer" class="f-social" aria-label="Facebook">fb</a>
              <a href="https://www.instagram.com/nviq_bharat?igsh=MXRjbTlsa29pNzc2eg==" target="_blank" rel="noopener noreferrer" class="f-social" aria-label="Instagram">ig</a>
              <a href="https://www.youtube.com/@TeamNViQ" target="_blank" rel="noopener noreferrer" class="f-social" aria-label="YouTube">yt</a>
            </div>
          </div>

          <div class="footer-links">
            <div class="f-col">
              <h4>{{ isMF ? 'Invest' : 'Product' }}</h4>
              <ng-container *ngIf="!isMF">
                <a href="javascript:void(0)" (click)="goProduct('mf')">Mutual Fund Solutions</a>
                <a href="javascript:void(0)" (click)="goProduct('gps')">GPS Tracking</a>
                <a href="javascript:void(0)" (click)="goProduct('ai')">AI Fleet Profitability Tools</a>
                <a href="javascript:void(0)" (click)="goProduct('fastag')">FASTag Services</a>
                <a href="javascript:void(0)" (click)="goProduct('gps')">AIS 140 Devices</a>
                <a href="javascript:void(0)" (click)="goProduct('drone')">Drone Solutions</a>
              </ng-container>
              <ng-container *ngIf="isMF">
                <a routerLink="/mutual-fund">SIP Investment</a>
                <a routerLink="/mutual-fund">ELSS Tax Saving</a>
                <a routerLink="/mutual-fund">Portfolio Tracking</a>
                <a routerLink="/mutual-fund">Risk Assessment</a>
                <a routerLink="/mutual-fund">Fund Comparison</a>
              </ng-container>
            </div>
            <div class="f-col">
              <h4>Company</h4>
              <a href="javascript:void(0)" (click)="goAbout()">About</a>
              <a href="javascript:void(0)" (click)="goContact()">Contact</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="footer-copy">� 2026 NViQ Technologies Pvt. Ltd. � Built in India</p>
          <div class="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #020408;
      border-top: 1px solid rgba(255,255,255,0.06);
      position: relative;
      overflow: hidden;
    }

    .footer-top-glow {
      position: absolute;
      top: 0; left: 50%;
      transform: translateX(-50%);
      width: 900px; height: 300px;
      background: radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, transparent 65%);
      pointer-events: none;
      animation: glowPulse 5s ease-in-out infinite;
    }
    @keyframes glowPulse {
      0%,100% { opacity: 0.8; }
      50%      { opacity: 1.0; }
    }

    .footer-main {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 64px;
      padding: 40px 0 48px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      margin-bottom: 32px;
    }

    .f-logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #F0F6FF;
      letter-spacing: -0.02em;
      margin-bottom: 18px;
    }

    .f-logo-icon {
      width: 38px;
      height: 38px;
      background: rgba(37,99,235,0.08);
      border: 1px solid rgba(37,99,235,0.2);
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .f-tagline {
      font-size: 13px;
      color: #475569;
      line-height: 1.7;
      margin-bottom: 24px;
    }

    .f-socials {
      display: flex;
      gap: 10px;
    }

    .f-social {
      min-width: 36px;
      height: 36px;
      padding: 0 10px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #475569;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      transition: all 0.2s ease;
    }

    .f-social:hover {
      color: #3B82F6;
      border-color: rgba(37,99,235,0.2);
      background: rgba(37,99,235,0.06);
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .f-col {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .f-col h4 {
      font-size: 12px;
      font-weight: 700;
      color: #F0F6FF;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 6px;
    }

    .f-col a {
      font-size: 13px;
      color: #475569;
      text-decoration: none;
      transition: color 0.2s, transform 0.2s;
      display: inline-block;
    }

    .f-col a:hover { color: #3B82F6; transform: translateX(3px); }

    .footer-cta-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 28px 36px;
      background: linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(99,102,241,0.06) 100%);
      border: 1px solid rgba(37,99,235,0.15);
      border-radius: 20px;
      margin-bottom: 36px;
      position: relative;
      overflow: hidden;
    }
    .footer-cta-banner::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent);
    }

    .fcta-left h3 {
      font-size: 17px;
      font-weight: 800;
      color: #F0F6FF;
      margin-bottom: 4px;
      letter-spacing: -0.01em;
    }

    .fcta-left p {
      font-size: 13px;
      color: #475569;
    }

    .fcta-btn {
      padding: 13px 26px;
      background: linear-gradient(135deg, #3B82F6, #6366F1);
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      border: none;
      cursor: pointer;
      font-family: inherit;
      border-radius: 12px;
      text-decoration: none;
      white-space: nowrap;
      transition: all 0.25s ease;
      box-shadow: 0 4px 20px rgba(37,99,235,0.2);
    }

    .fcta-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 32px rgba(37,99,235,0.35);
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding-bottom: 36px;
      flex-wrap: wrap;
    }

    .footer-copy {
      font-size: 12px;
      color: #334155;
    }

    .footer-bottom-links {
      display: flex;
      gap: 20px;
    }

    .footer-bottom-links a {
      font-size: 12px;
      color: #334155;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-bottom-links a:hover { color: #3B82F6; }

    @media (max-width: 1024px) {
      .footer-main { grid-template-columns: 1fr; gap: 40px; }
    }

    @media (max-width: 640px) {
      .footer-links { grid-template-columns: repeat(2, 1fr); }
      .footer-cta-banner { flex-direction: column; text-align: center; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }
  `]
})
export class FooterComponent {
  private nav    = inject(NavService);
  private router = inject(Router);

  get isMF(): boolean {
    return this.router.url.includes('mutual-fund') || this.nav.product() === 'mf';
  }

  get showCta(): boolean {
    const url = this.router.url;
    return !url.includes('/contact') && !url.includes('/about');
  }

  goContact(): void {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => this.nav.go('contact'));
    } else {
      this.nav.go('contact');
    }
  }

  goAbout(): void {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => this.nav.go('about'));
    } else {
      this.nav.go('about');
    }
  }

  goProduct(productId: string): void {
    const key = productId as any;
    this.nav.product.set(key);
    const go = () => {
      this.nav.product.set(key);
      this.nav.go('product-detail', key);
    };
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => go());
    } else {
      go();
    }
  }

  gpsContent = {
    tagline: 'Drive with Data. Real-time GPS intelligence for safer, faster, and more profitable fleet operations.',
    ctaTitle: 'Ready to run your fleet on data?',
    ctaDesc: 'Start your 14-day trial and bring every dispatch decision on one live dashboard.',
    ctaBtn: 'Start Free Trial',
  };

  mfContent = {
    tagline: 'Free Consultation • AMFI Registered • ARN No: 359231. Smart mutual fund investment solutions with SIP plans starting at ₹1,000/month.',
    ctaTitle: 'Start your SIP journey today.',
    ctaDesc: 'Zero commission, expert guidance, and ₹1,000/month minimum — invest in India\'s top funds.',
    ctaBtn: 'Get Free Consultation',
  };
}
