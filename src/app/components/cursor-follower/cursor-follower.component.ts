import {
  Component, OnDestroy, NgZone, ElementRef, ViewChild, AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-cursor-follower',
  standalone: true,
  template: `
    <div #rabbit class="cf-rabbit">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100">
        <!-- Left ear -->
        <ellipse cx="35" cy="22" rx="8" ry="18" fill="white" stroke="#ccc" stroke-width="1.5"/>
        <ellipse cx="35" cy="22" rx="4" ry="12" fill="#f9b8c4"/>
        <!-- Right ear -->
        <ellipse cx="58" cy="18" rx="7" ry="16" fill="white" stroke="#ccc" stroke-width="1.5" transform="rotate(10,58,18)"/>
        <ellipse cx="58" cy="18" rx="3.5" ry="10" fill="#f9b8c4" transform="rotate(10,58,18)"/>
        <!-- Head -->
        <ellipse cx="47" cy="50" rx="26" ry="24" fill="white" stroke="#ccc" stroke-width="1.5"/>
        <!-- Eye left -->
        <circle cx="38" cy="45" r="4" fill="#222"/>
        <circle cx="39.5" cy="43.5" r="1.2" fill="white"/>
        <!-- Eye right -->
        <circle cx="56" cy="45" r="4" fill="#222"/>
        <circle cx="57.5" cy="43.5" r="1.2" fill="white"/>
        <!-- Nose -->
        <ellipse cx="47" cy="57" rx="4" ry="2.5" fill="#f9b8c4"/>
        <!-- Mouth -->
        <path d="M44 59.5 Q47 63 50 59.5" stroke="#999" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <!-- Cheek blush left -->
        <ellipse cx="34" cy="54" rx="5" ry="3" fill="rgba(249,184,196,0.45)"/>
        <!-- Cheek blush right -->
        <ellipse cx="60" cy="54" rx="5" ry="3" fill="rgba(249,184,196,0.45)"/>
        <!-- Whiskers left -->
        <line x1="28" y1="55" x2="42" y2="57" stroke="#bbb" stroke-width="0.8"/>
        <line x1="27" y1="58" x2="42" y2="58" stroke="#bbb" stroke-width="0.8"/>
        <!-- Whiskers right -->
        <line x1="52" y1="57" x2="66" y2="55" stroke="#bbb" stroke-width="0.8"/>
        <line x1="52" y1="58" x2="67" y2="58" stroke="#bbb" stroke-width="0.8"/>
      </svg>
    </div>
  `,
  styles: [`
    :host { pointer-events: none; }

    .cf-rabbit {
      position: fixed;
      top: 0; left: 0;
      width: 40px; height: 40px;
      pointer-events: none;
      z-index: 99999;
      transform: translate(0, 0);
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25));
      transition: transform 0.08s ease, filter 0.15s ease;
      will-change: transform, left, top;
    }

    .cf-rabbit.is-hovering {
      transform: scale(1.18) rotate(-8deg);
      filter: drop-shadow(0 4px 12px rgba(59,130,246,0.35));
    }

    @media (hover: none) {
      .cf-rabbit { display: none; }
    }
  `]
})
export class CursorFollowerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rabbit') rabbitRef!: ElementRef<HTMLDivElement>;

  private rafId: number | null = null;
  private handlers: Array<{ el: Element | Document; type: string; fn: EventListener }> = [];

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    const rabbit = this.rabbitRef.nativeElement;

    this.ngZone.runOutsideAngular(() => {
      const onMove = (e: MouseEvent) => {
        rabbit.style.left = `${e.clientX}px`;
        rabbit.style.top  = `${e.clientY}px`;
      };
      document.addEventListener('mousemove', onMove);
      this.handlers.push({ el: document, type: 'mousemove', fn: onMove as EventListener });

      const onLeave = () => { rabbit.style.opacity = '0'; };
      const onEnter = () => { rabbit.style.opacity = '1'; };
      document.addEventListener('mouseleave', onLeave);
      document.addEventListener('mouseenter', onEnter);
      this.handlers.push(
        { el: document, type: 'mouseleave', fn: onLeave as EventListener },
        { el: document, type: 'mouseenter', fn: onEnter as EventListener },
      );

      const selectors = 'a, button, [role="button"], input, select, textarea, label, [data-cursor]';
      const addHover = (el: Element) => {
        const enter = () => rabbit.classList.add('is-hovering');
        const leave = () => rabbit.classList.remove('is-hovering');
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
        this.handlers.push(
          { el, type: 'mouseenter', fn: enter as EventListener },
          { el, type: 'mouseleave', fn: leave as EventListener },
        );
      };
      document.querySelectorAll(selectors).forEach(addHover);
    });
  }

  ngOnDestroy(): void {
    this.handlers.forEach(({ el, type, fn }) => (el as Element).removeEventListener(type, fn));
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
}
