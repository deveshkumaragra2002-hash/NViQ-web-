import { Directive, ElementRef, Input, OnInit, OnDestroy, NgZone } from '@angular/core';

@Directive({ selector: '[appCountup]', standalone: true })
export class CountupDirective implements OnInit, OnDestroy {
  @Input('appCountup') target = 0;
  @Input() countupSuffix = '';
  @Input() countupPrefix = '';
  @Input() countupDur = 1800;

  private observer!: IntersectionObserver;
  private rafId: number | null = null;

  constructor(private el: ElementRef<HTMLElement>, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          this.observer.disconnect();
          this.animate();
        }
      }, { threshold: 0.3 });
      this.observer.observe(this.el.nativeElement);
    });
  }

  private animate(): void {
    const start = performance.now();
    const target = this.target;
    const dur = this.countupDur;
    const prefix = this.countupPrefix;
    const suffix = this.countupSuffix;
    const el = this.el.nativeElement;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = `${prefix}${value.toLocaleString('en-IN')}${suffix}`;
      if (progress < 1) {
        this.rafId = requestAnimationFrame(tick);
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
}
