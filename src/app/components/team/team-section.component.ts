import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Member {
  name:     string;
  role:     string;
  dept:     string;
  initials: string;
  grad:     [string, string];
  linkedin: string;
  bio:      string;
}

@Component({
  selector: 'app-team-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="tm-root">

      <!-- Background -->
      <div class="tm-bg" aria-hidden="true">
        <div class="tm-orb tm-orb-1"></div>
        <div class="tm-orb tm-orb-2"></div>
        <div class="tm-grid-bg"></div>
      </div>

      <div class="tm-container">

        <!-- Header -->
        <header class="tm-header">
          <div class="tm-eyebrow">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Meet The Team
          </div>
          <h2 class="tm-title">
            The People Behind<br>
            <span class="tm-brand"><span class="tm-bn">N</span><span class="tm-bvi">vi</span><span class="tm-bq">Q</span></span>
          </h2>
          <p class="tm-sub">
            A passionate team of builders, operators, and creators — united by one mission:
            making India's fleet businesses smarter and wealthier.
          </p>
        </header>

        <!-- Cards -->
        <div class="tm-grid">
          <article
            #cardRef
            *ngFor="let m of members; let i = index"
            class="tm-card"
            [class.visible]="visibleCards[i]"
            [style.transition-delay]="(i * 100) + 'ms'"
          >
            <!-- Glow border on hover -->
            <div class="tm-card-glow"
              [style.background]="'radial-gradient(circle at 50% 0%, ' + m.grad[0] + '22, transparent 65%)'">
            </div>

            <!-- Avatar ring -->
            <div class="tm-avatar-wrap">
              <div class="tm-avatar-ring"
                [style.background]="'conic-gradient(' + m.grad[0] + ', ' + m.grad[1] + ', ' + m.grad[0] + ')'">
              </div>
              <div class="tm-avatar"
                [style.background]="'linear-gradient(135deg,' + m.grad[0] + ',' + m.grad[1] + ')'">
                <span>{{ m.initials }}</span>
              </div>
            </div>

            <!-- Badge -->
            <span class="tm-badge"
              [style.color]="m.grad[0]"
              [style.border-color]="m.grad[0] + '44'"
              [style.background]="m.grad[0] + '14'">
              {{ m.dept }}
            </span>

            <!-- Info -->
            <h3 class="tm-name">{{ m.name }}</h3>
            <p class="tm-role">{{ m.role }}</p>
            <p class="tm-bio">{{ m.bio }}</p>

            <!-- Divider -->
            <div class="tm-divider"
              [style.background]="'linear-gradient(90deg, transparent, ' + m.grad[0] + '55, transparent)'">
            </div>

            <!-- Social -->
            <a [href]="m.linkedin" class="tm-social" target="_blank" rel="noopener" aria-label="LinkedIn"
              [style.--hc]="m.grad[0]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
              </svg>
              LinkedIn
            </a>

            <!-- Bottom accent bar -->
            <div class="tm-bar"
              [style.background]="'linear-gradient(90deg,' + m.grad[0] + ',' + m.grad[1] + ')'">
            </div>
          </article>
        </div>


      </div>
    </section>
  `,
  styles: [`
    /* ── Root ──────────────────────────────────────────── */
    .tm-root {
      position: relative;
      padding: 100px 24px 110px;
      background: #04080f;
      overflow: hidden;
      isolation: isolate;
    }

    /* ── Background ─────────────────────────────────────── */
    .tm-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
    .tm-orb {
      position: absolute; border-radius: 50%;
      filter: blur(120px); pointer-events: none;
    }
    .tm-orb-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%);
      top: -80px; left: -100px;
      animation: orbFloat1 20s ease-in-out infinite;
    }
    .tm-orb-2 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
      bottom: -60px; right: -80px;
      animation: orbFloat2 24s ease-in-out infinite;
    }
    @keyframes orbFloat1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,40px)} }
    @keyframes orbFloat2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,-40px)} }

    .tm-grid-bg {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(59,130,246,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.025) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
    }

    /* ── Container ──────────────────────────────────────── */
    .tm-container {
      max-width: 1100px; margin: 0 auto;
      position: relative; z-index: 2;
    }

    /* ── Header ─────────────────────────────────────────── */
    .tm-header {
      text-align: center; max-width: 640px;
      margin: 0 auto 72px;
    }
    .tm-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 18px; border-radius: 999px;
      border: 1px solid rgba(59,130,246,0.25);
      background: rgba(59,130,246,0.08);
      color: #60A5FA; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.14em;
      margin-bottom: 22px;
    }
    .tm-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(2.2rem, 5vw, 3.8rem);
      font-weight: 900; letter-spacing: -0.04em;
      color: #F0F6FF; line-height: 1.06; margin-bottom: 16px;
    }
    .tm-brand {
      font-family: 'Courier New', monospace;
      font-size: inherit;
      font-weight: 900; letter-spacing: -3px;
      display: inline-flex; align-items: baseline;
    }
    .tm-bn { color: #ffffff; font-weight: 900; }
    .tm-bvi { color: rgba(255,255,255,0.4); font-weight: 700; letter-spacing: -2px; }
    .tm-bq { color: #3B82F6; font-weight: 900; }
    .tm-sub {
      color: #475569; font-size: 1rem; line-height: 1.72;
    }

    /* ── Grid ───────────────────────────────────────────── */
    .tm-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 64px;
    }

    /* ── Card ───────────────────────────────────────────── */
    .tm-card {
      position: relative;
      padding: 36px 24px 28px;
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,0.07);
      background: linear-gradient(160deg, rgba(10,16,30,0.95) 0%, rgba(6,10,20,0.98) 100%);
      display: flex; flex-direction: column; align-items: center;
      gap: 10px; text-align: center; overflow: hidden;
      opacity: 0; transform: translateY(32px);
      transition: opacity 0.6s ease, transform 0.6s ease,
                  border-color 0.35s ease, box-shadow 0.35s ease;
      cursor: default;
    }
    .tm-card.visible {
      opacity: 1; transform: translateY(0);
    }
    .tm-card:hover {
      border-color: rgba(59,130,246,0.3);
      box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.15);
      transform: translateY(-8px);
    }
    .tm-card.visible:hover { transform: translateY(-8px); }

    /* Glow overlay */
    .tm-card-glow {
      position: absolute; top: 0; left: 0; right: 0;
      height: 200px; pointer-events: none;
      opacity: 0; transition: opacity 0.4s ease;
    }
    .tm-card:hover .tm-card-glow { opacity: 1; }

    /* ── Avatar ─────────────────────────────────────────── */
    .tm-avatar-wrap {
      position: relative;
      width: 88px; height: 88px;
      margin-bottom: 4px;
      flex-shrink: 0;
    }
    .tm-avatar-ring {
      position: absolute; inset: -3px;
      border-radius: 50%;
      animation: ringRotate 6s linear infinite;
      opacity: 0.7;
    }
    @keyframes ringRotate { to { transform: rotate(360deg); } }
    .tm-card:hover .tm-avatar-ring { opacity: 1; }
    .tm-avatar {
      position: absolute; inset: 3px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Outfit', sans-serif;
      font-size: 1.6rem; font-weight: 900; color: #fff;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
    }
    .tm-card:hover .tm-avatar { transform: scale(1.08); }

    /* ── Badge ──────────────────────────────────────────── */
    .tm-badge {
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.12em;
      padding: 4px 12px; border-radius: 999px;
      border: 1px solid;
      transition: all 0.25s ease;
    }
    .tm-card:hover .tm-badge { letter-spacing: 0.16em; }

    /* ── Info ───────────────────────────────────────────── */
    .tm-name {
      font-family: 'Outfit', sans-serif;
      font-size: 1.1rem; font-weight: 800;
      color: #F0F6FF; letter-spacing: -0.02em;
      line-height: 1.2; margin: 0;
    }
    .tm-role {
      font-size: 0.82rem; color: #64748B;
      line-height: 1.4; margin: 0;
    }
    .tm-bio {
      font-size: 0.79rem; color: #334155;
      line-height: 1.6; margin: 0;
    }

    /* ── Divider ────────────────────────────────────────── */
    .tm-divider {
      width: 100%; height: 1px;
      margin: 4px 0;
    }

    /* ── Social ─────────────────────────────────────────── */
    .tm-social {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 7px 16px; border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      color: #475569; font-size: 12px; font-weight: 600;
      text-decoration: none;
      transition: all 0.25s ease;
    }
    .tm-social:hover {
      color: #0A66C2;
      border-color: rgba(10,102,194,0.35);
      background: rgba(10,102,194,0.08);
      transform: translateY(-2px);
    }

    /* ── Bottom bar ─────────────────────────────────────── */
    .tm-bar {
      position: absolute; bottom: 0; left: 0;
      height: 2px; width: 0;
      transition: width 0.5s cubic-bezier(0.22,1,0.36,1);
      border-radius: 999px;
    }
    .tm-card:hover .tm-bar { width: 100%; }

    /* ── Responsive ─────────────────────────────────────── */
    @media (max-width: 1024px) {
      .tm-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .tm-root { padding: 72px 16px 80px; }
      .tm-grid { grid-template-columns: 1fr; max-width: 360px; margin-left: auto; margin-right: auto; }

    }
  `],
})
export class TeamSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('cardRef') cardRefs!: QueryList<ElementRef<HTMLElement>>;

  visibleCards: boolean[] = [];
  private obs: IntersectionObserver | null = null;

  members: Member[] = [
    {
      name:     'Devi Singh',
      role:     'Business Operations & Coordination',
      dept:     'Operations',
      initials: 'DS',
      grad:     ['#3B82F6', '#6366F1'],
      linkedin: '#',
      bio:      'Driving smooth operations and cross-team coordination to keep NViQ running at full throttle.',
    },
    {
      name:     'Vinod Joshi',
      role:     'Professional Photographer & Mentor',
      dept:     'Creative & Advisory',
      initials: 'VJ',
      grad:     ['#F59E0B', '#EF4444'],
      linkedin: '#',
      bio:      'Bringing visual storytelling and strategic mentorship to shape the NViQ brand identity.',
    },
    {
      name:     'Devesh Kumar',
      role:     'Full Stack Developer',
      dept:     'Engineering',
      initials: 'DK',
      grad:     ['#00D4FF', '#6366F1'],
      linkedin: '#',
      bio:      'Architecting and building the core platform — from GPS APIs to the investor dashboard.',
    },
    {
      name:     'Pranjal Sharma',
      role:     'Developer',
      dept:     'Engineering',
      initials: 'PS',
      grad:     ['#A78BFA', '#EC4899'],
      linkedin: '#',
      bio:      'Building features, fixing bugs, and making sure every user interaction feels smooth.',
    },
  ];

  constructor() {
    this.visibleCards = this.members.map(() => false);
  }

  ngAfterViewInit(): void {
    this.obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const idx = parseInt(e.target.getAttribute('data-tm') || '0', 10);
        if (e.isIntersecting) this.visibleCards[idx] = true;
      });
    }, { threshold: 0.15 });

    this.cardRefs.forEach((ref, i) => {
      ref.nativeElement.setAttribute('data-tm', String(i));
      this.obs!.observe(ref.nativeElement);
    });
  }

  ngOnDestroy(): void { this.obs?.disconnect(); }
}
