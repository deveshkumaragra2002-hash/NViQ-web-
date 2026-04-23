import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

interface NavItem {
  label: string;
  id: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="top-strip" [class.scrolled]="scrolled">
      <div class="nav-inner">
        <button type="button" class="brand" (click)="onNavClick('home')" aria-label="Go to home">
          <span class="brand-mark">N</span>
          <span class="brand-text">NViQ</span>
        </button>

        <div class="right-controls">
          <ul class="desktop-nav">
            <li *ngFor="let item of navItems">
              <button
                type="button"
                class="nav-link"
                [class.active]="activeSection === item.id"
                (click)="onNavClick(item.id)"
              >
                <span>{{ item.label }}</span>
                <span class="nav-link-line"></span>
              </button>
            </li>
          </ul>

          <button type="button" class="ask-cta" (click)="openAskModal()">Ask Me</button>

          <button
            type="button"
            class="mobile-toggle"
            [attr.aria-expanded]="mobileOpen"
            aria-label="Toggle navigation menu"
            (click)="mobileOpen = !mobileOpen"
          >
            <span *ngIf="!mobileOpen">&#9776;</span>
            <span *ngIf="mobileOpen">&#10005;</span>
          </button>
        </div>
      </div>

      <div class="mobile-nav" [class.open]="mobileOpen">
        <button
          *ngFor="let item of navItems"
          type="button"
          class="mobile-link"
          [class.active]="activeSection === item.id"
          (click)="onNavClick(item.id)"
        >
          {{ item.label }}
        </button>
      </div>
    </nav>

    <div *ngIf="askOpen" class="ask-modal" (click)="closeAskModal()">
      <div class="ask-modal-card" (click)="$event.stopPropagation()">
        <button type="button" class="ask-close" aria-label="Close ask form" (click)="closeAskModal()">&#10005;</button>

        <h3>Ask Me</h3>
        <p class="ask-subtitle">Quick support from our NViQ team.</p>

        <form *ngIf="!askSubmitted" style="display:grid; gap:12px" (submit)="submitAskForm($event)">
          <label style="display:grid; gap:6px">
            <span style="color:#CBD5E1; font-size:12px; font-weight:500">Name</span>
            <input type="text" name="name" placeholder="Enter your name" required
              style="width:100%; border-radius:12px; border:1px solid rgba(148,163,184,0.24); background:rgba(15,23,42,0.58); color:#E2E8F0; font-size:14px; outline:none; padding:10px 12px" />
          </label>

          <label style="display:grid; gap:6px">
            <span style="color:#CBD5E1; font-size:12px; font-weight:500">Email ID</span>
            <input type="email" name="email" placeholder="you@example.com" required
              style="width:100%; border-radius:12px; border:1px solid rgba(148,163,184,0.24); background:rgba(15,23,42,0.58); color:#E2E8F0; font-size:14px; outline:none; padding:10px 12px" />
          </label>

          <label style="display:grid; gap:6px">
            <span style="color:#CBD5E1; font-size:12px; font-weight:500">Mobile Number</span>
            <input type="tel" name="mobile" placeholder="Enter mobile number" required
              style="width:100%; border-radius:12px; border:1px solid rgba(148,163,184,0.24); background:rgba(15,23,42,0.58); color:#E2E8F0; font-size:14px; outline:none; padding:10px 12px" />
          </label>

          <label style="display:grid; gap:6px">
            <span style="color:#CBD5E1; font-size:12px; font-weight:500">Message / Query</span>
            <textarea name="message" rows="4" placeholder="How can we help?"
              style="width:100%; min-height:92px; resize:vertical; border-radius:12px; border:1px solid rgba(148,163,184,0.24); background:rgba(15,23,42,0.58); color:#E2E8F0; font-size:14px; outline:none; padding:10px 12px"></textarea>
          </label>

          <button type="submit"
            style="margin-top:2px; height:42px; border:0; border-radius:12px; color:#F8FAFC; font-size:14px; font-weight:600; background:linear-gradient(135deg, #3B82F6, #06B6D4); box-shadow:0 10px 20px rgba(37,99,235,0.22); cursor:pointer">
            Submit Query
          </button>
        </form>

        <div *ngIf="askSubmitted"
          style="border-radius:12px; border:1px solid rgba(56,189,248,0.36); background:rgba(8,47,73,0.48); color:#BAE6FD; font-size:15px; font-weight:600; text-align:center; padding:18px 14px; margin-top:8px">
          We'll contact you shortly
        </div>
      </div>
    </div>
  `,
  styles: [`
    .top-strip {
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid rgba(148, 163, 184, 0.16);
      background: rgba(8, 10, 18, 0.68);
      backdrop-filter: blur(14px);
      transition: background 0.25s ease, border-color 0.25s ease;
    }

    .top-strip.scrolled {
      background: rgba(8, 10, 18, 0.9);
      border-bottom-color: rgba(148, 163, 184, 0.26);
      box-shadow: 0 8px 24px rgba(2, 6, 23, 0.24);
    }

    .nav-inner {
      max-width: 1120px;
      margin: 0 auto;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      border: 0;
      background: transparent;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
    }

    .brand-mark {
      width: 30px;
      height: 30px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      color: #ffffff;
      background: linear-gradient(135deg, #3B82F6, #06B6D4);
      box-shadow: 0 0 14px rgba(59, 130, 246, 0.34);
    }

    .brand-text {
      color: #F8FAFC;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .right-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .desktop-nav {
      list-style: none;
      display: none;
      align-items: center;
      gap: 24px;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      position: relative;
      border: 0;
      background: transparent;
      padding: 7px 0;
      color: #94A3B8;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }

    .nav-link.active {
      color: #F8FAFC;
    }

    .nav-link-line {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      border-radius: 999px;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.28s ease;
      background: linear-gradient(90deg, #3B82F6, #06B6D4);
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.32);
    }

    .nav-link:hover .nav-link-line,
    .nav-link.active .nav-link-line {
      transform: scaleX(1);
    }

    .ask-cta {
      border: 1px solid rgba(125, 211, 252, 0.44);
      border-radius: 999px;
      height: 36px;
      padding: 0 16px;
      color: #E0F2FE;
      font-size: 13px;
      font-weight: 600;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.24), rgba(59, 130, 246, 0.26));
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .ask-cta:hover {
      transform: scale(1.05);
      border-color: rgba(125, 211, 252, 0.72);
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
    }

    .mobile-toggle {
      width: 36px;
      height: 36px;
      border: 1px solid rgba(148, 163, 184, 0.28);
      border-radius: 11px;
      background: rgba(15, 23, 42, 0.55);
      color: #F8FAFC;
      font-size: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: border-color 0.2s ease, background 0.2s ease;
    }

    .mobile-nav {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 0 24px;
      border-top: 1px solid transparent;
      transition: max-height 0.28s ease, opacity 0.2s ease, padding 0.2s ease;
    }

    .mobile-nav.open {
      max-height: 280px;
      opacity: 1;
      padding: 10px 24px 14px;
      border-top-color: rgba(148, 163, 184, 0.18);
    }

    .mobile-link {
      width: 100%;
      border: 1px solid transparent;
      background: transparent;
      border-radius: 10px;
      padding: 10px 12px;
      text-align: left;
      color: #94A3B8;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }

    .mobile-link.active {
      color: #F8FAFC;
      border-color: rgba(59, 130, 246, 0.34);
      background: rgba(30, 41, 59, 0.56);
    }

    .ask-modal {
      position: fixed;
      inset: 0;
      z-index: 80;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
      background: rgba(2, 6, 23, 0.62);
      backdrop-filter: blur(8px);
    }

    .ask-modal-card {
      position: relative;
      width: min(520px, calc(100vw - 24px));
      border-radius: 18px;
      border: 1px solid rgba(148, 163, 184, 0.24);
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.86), rgba(8, 10, 18, 0.94));
      box-shadow: 0 24px 60px rgba(2, 6, 23, 0.5);
      padding: 24px 20px 20px;
      animation: modalIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .ask-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 30px;
      height: 30px;
      border-radius: 9px;
      border: 1px solid rgba(148, 163, 184, 0.25);
      background: rgba(15, 23, 42, 0.6);
      color: #CBD5E1;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.2s ease, border-color 0.2s ease;
    }

    .ask-modal-card h3 {
      margin: 0;
      color: #F8FAFC;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .ask-subtitle {
      margin: 8px 0 16px;
      color: #94A3B8;
      font-size: 13px;
    }

    @media (max-width: 767px) {
      .brand-text {
        font-size: 18px;
      }

      .ask-cta {
        height: 34px;
        padding: 0 14px;
        font-size: 12px;
      }

      .ask-modal-card {
        width: calc(100vw - 20px);
        padding: 22px 16px 16px;
      }
    }

    @media (min-width: 768px) {
      .desktop-nav {
        display: flex;
      }

      .mobile-toggle,
      .mobile-nav {
        display: none;
      }
    }

    @keyframes modalIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(12px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `],
})
export class NavbarComponent implements OnInit, OnDestroy {
  navItems: NavItem[] = [
    { label: 'Home', id: 'home' },
    { label: 'Fleet Solutions', id: 'fleet-solutions' },
    { label: 'Mutual Fund', id: 'mutual-fund' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'About', id: 'about' },
  ];

  activeSection = 'home';
  mobileOpen = false;
  scrolled = false;
  askOpen = false;
  askSubmitted = false;

  private readonly navOffset = 84;

  ngOnInit(): void {
    this.onWindowScroll();
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 10;
    this.updateActiveSection();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth >= 768) {
      this.mobileOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.askOpen) {
      this.closeAskModal();
    }
  }

  openAskModal(): void {
    this.askSubmitted = false;
    this.askOpen = true;
    this.lockBodyScroll();
  }

  closeAskModal(): void {
    this.askOpen = false;
    this.askSubmitted = false;
    this.unlockBodyScroll();
  }

  submitAskForm(event: Event): void {
    event.preventDefault();
    this.askSubmitted = true;
  }

  onNavClick(id: string): void {
    this.activeSection = id;
    this.mobileOpen = false;

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const section = document.getElementById(id);
    if (!section) {
      return;
    }

    const top = section.getBoundingClientRect().top + window.scrollY - this.navOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  private updateActiveSection(): void {
    const threshold = this.navOffset + 20;
    let current = 'home';

    for (const item of this.navItems) {
      if (item.id === 'home') {
        continue;
      }

      const section = document.getElementById(item.id);
      if (!section) {
        continue;
      }

      const rect = section.getBoundingClientRect();
      if (rect.top <= threshold) {
        current = item.id;
      }
    }

    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) {
      current = this.navItems[this.navItems.length - 1].id;
    }

    this.activeSection = current;
  }

  private lockBodyScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    document.body.style.overflow = '';
  }
}
