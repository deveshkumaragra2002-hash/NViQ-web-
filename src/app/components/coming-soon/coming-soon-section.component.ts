import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type NextFeature = {
  icon: string;
  title: string;
  badge: 'Coming Soon';
  description: string;
  features: string[];
  prompt: string;
};

@Component({
  selector: 'app-coming-soon-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="coming-soon" class="py-24 relative overflow-hidden" style="background: #080A12">
      <div class="absolute inset-0 pointer-events-none opacity-65"
        style="background:
          radial-gradient(900px 340px at 10% 0%, rgba(59,130,246,0.16), transparent 60%),
          radial-gradient(820px 320px at 88% 100%, rgba(139,92,246,0.16), transparent 62%)">
      </div>

      <div class="max-w-[1280px] mx-auto px-6 relative z-10">
        <div class="text-center mb-14 section-fade-in">
          <h2 class="text-white mb-3"
            style="font-size: clamp(30px, 3.8vw, 48px); font-weight:800; letter-spacing:-.03em; line-height:1.1">
            What's Next at NViQ
          </h2>
          <p class="text-[#94A3B8]" style="font-size:16px; max-width:640px; margin:0 auto; line-height:1.6">
            We're building beyond tracking &mdash; into your business future.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <article
            *ngFor="let card of cards; let i = index"
            class="feature-card"
            [style.animation-delay]="(i * 0.1) + 's'"
            (click)="onCardClick(card.prompt)"
            (keyup.enter)="onCardClick(card.prompt)"
            tabindex="0"
            role="button"
          >
            <div class="badge-pill">
              {{ card.badge }}
            </div>

            <div class="icon-wrap">{{ card.icon }}</div>

            <h3 class="text-white mb-2" style="font-size:19px; font-weight:700; line-height:1.3">
              {{ card.title }}
            </h3>

            <p class="text-[#94A3B8]" style="font-size:14px; line-height:1.65">
              {{ card.description }}
            </p>

            <ul class="mt-4 space-y-2">
              <li *ngFor="let feature of card.features" class="flex items-start gap-2">
                <span class="dot"></span>
                <span class="text-[#CBD5E1]" style="font-size:12px; line-height:1.45">{{ feature }}</span>
              </li>
            </ul>
          </article>
        </div>

        <div class="text-center mt-12">
          <button class="cta-btn" (click)="sendPrompt('Join Early Access')">
            Join Early Access
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .section-fade-in {
      animation: sectionFade .55s ease both;
    }

    .feature-card {
      position: relative;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: 22px 18px;
      min-height: 330px;
      cursor: pointer;
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
      animation: cardReveal .55s ease both;
      outline: none;
    }

    .feature-card:hover,
    .feature-card:focus-visible {
      transform: translateY(-5px) scale(1.05);
      border-color: rgba(59,130,246,0.55);
      box-shadow: 0 16px 42px rgba(59,130,246,0.22), 0 0 0 1px rgba(139,92,246,0.18) inset;
    }

    .badge-pill {
      position: absolute;
      top: -11px;
      right: 14px;
      border-radius: 999px;
      padding: 5px 11px;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.22);
      background: linear-gradient(135deg, #3B82F6, #8B5CF6);
      box-shadow: 0 8px 18px rgba(59,130,246,0.22);
    }

    .icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 23px;
      margin-bottom: 14px;
      border: 1px solid rgba(255,255,255,0.18);
      background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.14), rgba(139,92,246,0.16));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.16);
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: linear-gradient(135deg, #3B82F6, #8B5CF6);
      margin-top: 6px;
      flex-shrink: 0;
    }

    .cta-btn {
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 15px;
      font-weight: 700;
      padding: 13px 28px;
      border-radius: 11px;
      transition: transform .2s ease, box-shadow .2s ease;
      background: linear-gradient(135deg, #3B82F6, #8B5CF6);
      box-shadow: 0 14px 34px rgba(59,130,246,0.3);
    }

    .cta-btn:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 18px 40px rgba(59,130,246,0.38);
    }

    @keyframes sectionFade {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes cardReveal {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ComingSoonSectionComponent {
  cards: NextFeature[] = [
    {
      icon: '📡',
      title: 'FastTag Auto Recharge',
      badge: 'Coming Soon',
      description: 'Recharge your vehicle FastTag directly from the NViQ app - instantly updated in your vehicle.',
      features: [
        'One-click recharge from app',
        'Instant update in vehicle',
        'No waiting or delay',
        'Smooth toll experience',
      ],
      prompt: 'Tell me about FastTag Auto Recharge',
    },
    {
      icon: '💰',
      title: 'Business Loan Support',
      badge: 'Coming Soon',
      description: 'Get financial support for your fleet or business when needed.',
      features: [
        'Support for vehicle issues',
        'Business expansion help',
        'Quick partner-based process',
        'Easy access',
      ],
      prompt: 'Tell me about Business Loan',
    },
    {
      icon: '🚌',
      title: 'Smart Bus Booking',
      badge: 'Coming Soon',
      description: 'Smart booking system for better route planning and vehicle usage.',
      features: [
        'Automated route planning',
        'Better booking management',
        'Smart seat allocation',
        'Increased revenue',
      ],
      prompt: 'Tell me about Smart Booking',
    },
    {
      icon: '🚁',
      title: 'Agriculture Drone',
      badge: 'Coming Soon',
      description: 'Drone-based monitoring and smart agriculture solutions.',
      features: [
        'Crop monitoring',
        'Field surveillance',
        'Smart land mapping',
        'Precision agriculture support',
      ],
      prompt: 'Tell me about Agriculture Drone',
    },
  ];

  onCardClick(prompt: string) {
    this.sendPrompt(prompt);
  }

  sendPrompt(text: string) {
    console.log(text);
  }
}
