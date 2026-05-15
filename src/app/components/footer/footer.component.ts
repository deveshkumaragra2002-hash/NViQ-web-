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

      <!-- Top divider glow -->
      <div class="footer-glow" aria-hidden="true"></div>

      <div class="footer-inner">

        <!-- Logo -->
        <a class="f-logo" (click)="goHome()">
          <span class="f-logo-icon" aria-hidden="true">
            <img src="favicon.jpeg" alt="NViQ Logo" class="f-logo-img"/>
          </span>
          <span class="f-logo-text"><span class="f-ln">N</span><span class="f-lvi">vi</span><span class="f-lq">Q</span></span>
        </a>

        <!-- Nav links -->
        <nav class="f-nav" aria-label="Footer navigation">
          <a class="f-link" (click)="goHome()">Home</a>
          <span class="f-dot" aria-hidden="true"></span>
          <a class="f-link" (click)="goProducts()">Products</a>
          <span class="f-dot" aria-hidden="true"></span>
          <a class="f-link" (click)="goAbout()">Company</a>
          <span class="f-dot" aria-hidden="true"></span>
          <a class="f-link" (click)="goContact()">Contact Us</a>
          <span class="f-dot" aria-hidden="true"></span>
          <a class="f-link" (click)="goTeam()">Our Team</a>
        </nav>

        <!-- Social icons -->
        <div class="f-socials">
          <a href="https://www.instagram.com/nviq_bharat?igsh=MXRjbTlsa29pNzc2eg==" target="_blank" rel="noopener noreferrer" class="f-social-btn" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
<a href="https://www.youtube.com/@TeamNViQ" target="_blank" rel="noopener noreferrer" class="f-social-btn" aria-label="YouTube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/profile.php?fb_profile_edit_entry_point" target="_blank" rel="noopener noreferrer" class="f-social-btn" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
        </div>

        <!-- Bottom bar -->
        <div class="f-bottom">
          <span class="f-copy">© 2026 NViQ Technologies Pvt. Ltd. · Built in India 🇮🇳</span>
        </div>

      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #000;
      position: relative;
      overflow: hidden;
    }

    .footer-glow {
      position: absolute;
      top: 0; left: 50%; transform: translateX(-50%);
      width: 800px; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent);
    }

    .footer-inner {
      max-width: 960px;
      margin: 0 auto;
      padding: 56px 24px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }

    /* Logo */
    .f-logo {
      display: inline-flex; align-items: center; gap: 10px;
      text-decoration: none; cursor: pointer;
    }
    .f-logo-text {
      font-family: 'Courier New', monospace;
      font-size: 26px; font-weight: 900;
      letter-spacing: -2px;
      display: inline-flex; align-items: baseline;
    }

    .f-logo-icon {
      width: 38px; height: 38px;
      border-radius: 10px;
      overflow: hidden;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .f-logo-img {
      width: 100%; height: 100%;
      object-fit: contain;
      border-radius: 10px;
    }

    .f-ln { color: #fff; font-weight: 900; }
    .f-lvi { color: rgba(255,255,255,0.45); font-weight: 700; letter-spacing: -1px; }
    .f-lq { color: #3B82F6; font-weight: 900; }

    /* Nav */
    .f-nav {
      display: flex; align-items: center;
      flex-wrap: wrap; justify-content: center;
      gap: 4px;
    }

    .f-link {
      font-family: 'Outfit', sans-serif;
      font-size: 14px; font-weight: 500;
      color: rgba(255,255,255,0.55);
      text-decoration: none; cursor: pointer;
      padding: 4px 14px;
      border-radius: 999px;
      transition: color 0.2s ease, background 0.2s ease;
    }

    .f-link:hover {
      color: #fff;
      background: rgba(255,255,255,0.06);
    }

    .f-dot {
      width: 3px; height: 3px;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      flex-shrink: 0;
    }

    /* Socials */
    .f-socials {
      display: flex; align-items: center; gap: 12px;
    }

    .f-social-btn {
      width: 42px; height: 42px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.04);
      display: inline-flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,0.5);
      text-decoration: none;
      transition: all 0.25s ease;
    }

    .f-social-btn:hover {
      color: #fff;
      border-color: rgba(59,130,246,0.5);
      background: rgba(37,99,235,0.12);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37,99,235,0.2);
    }

    /* Bottom bar */
    .f-bottom {
      width: 100%;
      display: flex; align-items: center;
      justify-content: space-between;
      padding-top: 24px;
      border-top: 1px solid rgba(255,255,255,0.06);
      gap: 16px; flex-wrap: wrap;
    }

    .f-copy {
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      color: rgba(255,255,255,0.2);
    }

    .f-legal {
      display: flex; gap: 20px;
    }

    .f-legal-link {
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      color: rgba(255,255,255,0.2);
      text-decoration: none;
      transition: color 0.2s;
    }

    .f-legal-link:hover { color: rgba(255,255,255,0.6); }

    @media (max-width: 640px) {
      .footer-inner { padding: 40px 16px 28px; gap: 24px; }
      .f-bottom { flex-direction: column; align-items: center; text-align: center; }
      .f-dot { display: none; }
      .f-nav { gap: 2px; }
    }
  `]
})
export class FooterComponent {
  private nav    = inject(NavService);
  private router = inject(Router);

  goHome(): void {
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    } else {
      this.nav.go('home');
    }
  }

  goProducts(): void {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => this.nav.go('products'));
    } else {
      this.nav.go('products');
    }
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

  goTeam(): void {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => this.nav.go('team'));
    } else {
      this.nav.go('team');
    }
  }
}
