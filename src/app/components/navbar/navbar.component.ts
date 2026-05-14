import {
  Component, HostListener, OnInit, ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="nav-root" [class.scrolled]="scrolled">
      <div class="nav-shell">

        <!-- LEFT: Products + About Us -->
        <div class="nav-left">
          <button class="nav-link" type="button"
            [class.active]="nav.page() === 'products' || nav.page() === 'product-detail'"
            (click)="navigate('products')">
            Products
          </button>
          <button class="nav-link" type="button"
            [class.active]="nav.page() === 'about'"
            (click)="navigate('about')">
            About Us
          </button>
        </div>

        <!-- CENTER: Logo (absolute centered) -->
        <button class="nav-logo" type="button" (click)="navigate('home')">
          <span class="logo-rabbit" aria-hidden="true">
            <img src="favicon.jpeg" alt="NViQ Logo" class="logo-img"/>
          </span>
          <span class="logo-text"><span class="logo-n">N</span><span class="logo-vi">vi</span><span class="logo-q">Q</span></span>
        </button>

        <!-- RIGHT: Contact + Our Team -->
        <div class="nav-right">
          <button class="nav-link" type="button"
            [class.active]="nav.page() === 'contact'"
            (click)="navigate('contact')">
            Contact Us
          </button>
          <button class="nav-link" type="button"
            [class.active]="nav.page() === 'team'"
            (click)="navigate('team')">
            Our Team
          </button>
        </div>

        <!-- Mobile toggle -->
        <button class="mob-toggle" type="button"
          (click)="mobileOpen = !mobileOpen"
          [attr.aria-expanded]="mobileOpen"
          aria-label="Toggle menu">
          <span *ngIf="!mobileOpen">&#9776;</span>
          <span *ngIf="mobileOpen">&#10005;</span>
        </button>

      </div>

      <!-- Mobile panel -->
      <div class="mob-panel" [class.mob-open]="mobileOpen">
        <button class="mob-link" type="button" (click)="navigate('products')">Products</button>
        <button class="mob-link" type="button" (click)="navigate('about')">About Us</button>
        <button class="mob-link" type="button" (click)="navigate('contact')">Contact Us</button>
        <button class="mob-link" type="button" (click)="navigate('team')">Our Team</button>
      </div>
    </nav>
  `,
  styles: [`
    /* ── Root ──────────────────────────────────────────── */
    .nav-root {
      position: fixed; top: 0; left: 0; right: 0;
      z-index: 1000;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid #E2E8F0;
      transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .nav-root.scrolled {
      background: #FFFFFF;
      border-color: #E2E8F0;
      box-shadow: 0 1px 12px rgba(0,0,0,0.07);
    }

    /* ── Shell ──────────────────────────────────────────── */
    .nav-shell {
      max-width: 1280px; margin: 0 auto;
      min-height: 64px;
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    /* ── Left / Right ───────────────────────────────────── */
    .nav-left {
      display: flex; align-items: center; gap: 2px;
      padding-right: 80px;
    }
    .nav-right {
      display: flex; align-items: center; gap: 2px;
      padding-left: 80px;
    }

    /* ── Nav link ───────────────────────────────────────── */
    .nav-link {
      display: inline-flex; align-items: center; gap: 5px;
      background: transparent; border: none;
      color: #475569;
      font-family: 'Outfit', sans-serif;
      font-size: 14px; font-weight: 500;
      cursor: pointer; padding: 8px 12px; border-radius: 10px;
      position: relative;
      transition: color 0.2s ease, background 0.2s ease;
      white-space: nowrap;
    }
    .nav-link::after {
      content: '';
      position: absolute; bottom: 3px; left: 12px; right: 12px;
      height: 1.5px;
      background: #2563EB;
      border-radius: 999px;
      transform: scaleX(0);
      transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
    }
    .nav-link:hover { color: #0F172A; }
    .nav-link:hover::after { transform: scaleX(1); }
    .nav-link.active { color: #2563EB; font-weight: 600; }
    .nav-link.active::after { transform: scaleX(1); }

    /* ── Dropdown ───────────────────────────────────────── */
    .nav-dropdown { position: relative; }
    .dd-menu {
      position: absolute; top: calc(100% + 8px); left: 50%;
      transform: translateX(-50%) translateY(-6px) scale(0.97);
      min-width: 180px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 6px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
    }
    .dd-menu.dd-open {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
      pointer-events: auto;
    }
    .dd-item {
      display: flex; align-items: center; gap: 9px;
      width: 100%; background: transparent; border: none;
      color: #475569;
      font-family: 'Outfit', sans-serif;
      font-size: 13.5px; font-weight: 600;
      cursor: pointer; padding: 10px 14px; border-radius: 9px;
      transition: all 0.15s ease; text-align: left;
    }
    .dd-item:hover { color: #0F172A; background: #F1F5F9; }
    .dd-item.active { color: #2563EB; background: rgba(37,99,235,0.06); }

    /* ── Logo ───────────────────────────────────────────── */
    .nav-logo {
      position: absolute;
      left: 50%; transform: translateX(-50%);
      display: inline-flex; align-items: center; gap: 9px;
      background: transparent; border: none; cursor: pointer;
      padding: 5px 10px; border-radius: 12px;
      transition: background 0.2s ease;
      z-index: 1;
    }
    .nav-logo:hover { background: rgba(37,99,235,0.05); }

    .logo-rabbit {
      width: 36px; height: 36px;
      border-radius: 10px;
      overflow: hidden;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .logo-img {
      width: 100%; height: 100%;
      object-fit: contain;
      border-radius: 10px;
    }
    .nav-logo:hover .logo-rabbit {
      opacity: 0.85;
    }
    .logo-text {
      font-family: 'Courier New', 'JetBrains Mono', monospace;
      font-size: 24px; font-weight: 900;
      letter-spacing: -2px;
      display: inline-flex; align-items: baseline;
    }
    .logo-n {
      color: #0F172A;
      font-weight: 900;
    }
    .logo-vi {
      color: #94a3b8;
      font-weight: 700;
      letter-spacing: -1px;
    }
    .logo-q {
      color: #2563EB;
      font-weight: 900;
    }

    /* ── Mobile toggle ──────────────────────────────────── */
    .mob-toggle {
      display: none;
      position: absolute; right: 14px;
      width: 38px; height: 38px;
      border-radius: 10px;
      border: 1px solid #E2E8F0;
      background: #F8FAFC;
      color: #475569; font-size: 16px;
      align-items: center; justify-content: center;
      cursor: pointer;
    }

    /* ── Mobile panel ───────────────────────────────────── */
    .mob-panel {
      max-height: 0; overflow: hidden; opacity: 0;
      background: #FFFFFF;
      border-top: 1px solid transparent;
      display: flex; flex-direction: column; gap: 2px;
      transition: max-height 0.25s ease, opacity 0.2s ease, padding 0.2s ease;
      padding: 0 20px;
    }
    .mob-panel.mob-open {
      max-height: 320px; opacity: 1; padding: 10px 20px 16px;
      border-top-color: #E2E8F0;
    }
    .mob-link {
      background: transparent; border: none;
      color: #475569;
      font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
      text-align: left; padding: 11px 14px; border-radius: 10px;
      cursor: pointer; transition: all 0.15s ease;
    }
    .mob-link:hover { color: #2563EB; background: rgba(37,99,235,0.06); }

    /* ── Responsive ─────────────────────────────────────── */
    @media (max-width: 760px) {
      .nav-left, .nav-right { display: none; }
      .mob-toggle { display: inline-flex; }
      .nav-shell { padding: 0 16px; }
    }
    @media (max-width: 480px) {
      .nav-shell { min-height: 56px; padding: 0 12px; }
      .logo-rabbit { width: 32px; height: 32px; }
      .logo-text { font-size: 17px; }
    }
  `]
})
export class NavbarComponent implements OnInit {
  scrolled  = false;
  mobileOpen = false;
  ddOpen    = false;

  @ViewChild('companyDd') companyDdRef!: ElementRef<HTMLElement>;

  constructor(public nav: NavService) {}

  get isCompanyPage(): boolean {
    const p = this.nav.page();
    return p === 'about' || p === 'team';
  }

  ngOnInit(): void { this.scrolled = window.scrollY > 10; }

  @HostListener('window:scroll')
  onScroll(): void { this.scrolled = window.scrollY > 10; }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (this.ddOpen && !this.companyDdRef?.nativeElement.contains(e.target as Node)) {
      this.ddOpen = false;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 900) this.mobileOpen = false;
  }

  toggleDropdown(): void { this.ddOpen = !this.ddOpen; }

  navigate(page: string): void {
    this.ddOpen    = false;
    this.mobileOpen = false;
    this.nav.go(page as any);
  }
}
