import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

export type Page = 'home' | 'products' | 'product-detail' | 'about' | 'team' | 'contact';
export type ProductKey = 'gps' | 'mf' | 'fastag' | 'drone' | 'insurance' | 'ai' | 'other';

export interface ActiveFundData {
  title:   string;
  tag:     string;
  lines:   string[];
  details: string;
}

@Injectable({ providedIn: 'root' })
export class NavService {
  private router = inject(Router);

  page       = signal<Page>('home');
  product    = signal<ProductKey | null>(null);
  modalOpen  = signal(false);
  activeFund = signal<ActiveFundData | null>(null);

  go(page: Page, product?: ProductKey): void {
    this.page.set(page);
    this.product.set(product ?? null);
    if (product !== 'mf') this.activeFund.set(null);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }

  /** Open modal and pin which product context it belongs to. */
  openModalFor(product: ProductKey): void {
    this.product.set(product);
    this.modalOpen.set(true);
  }

  syncHeroSlide(product: ProductKey | null): void {
    this.product.set(product);
    if (product !== 'mf') this.activeFund.set(null);
  }

  setActiveFund(fund: ActiveFundData): void {
    this.activeFund.set(fund);
  }

  /** Navigate to the Contact Us SPA page from anywhere (including Angular Router pages). */
  goContact(): void {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => this.go('contact'));
    } else {
      this.go('contact');
    }
  }

  /** Generic open — keeps current product context (use openModalFor when possible). */
  openModal(): void  { this.modalOpen.set(true);  }
  closeModal(): void { this.modalOpen.set(false); }
}
