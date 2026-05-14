import {
  AfterViewInit, Component, ElementRef, OnDestroy,
  OnInit, NgZone, ChangeDetectorRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService, ProductKey, Page } from '../../services/nav.service';

interface Slide {
  type: 'product' | 'company' | 'contact' | 'coming-soon';
  id?: ProductKey;
  navPage?: Page;
  bgImg?: string;
  heading: string;
  sub: string;
  cta?: string;
  desc?: string;
  phone?: string;
  email?: string;
  accent: string;
  accentDim: string;
  bg: string;
  iconPath: string;
  tag: string;
  gradientHeading?: boolean;
  videoSrc?: string;
}

interface Particle {
  x: number; y: number;
  /** Base (constant) velocity — never modified after init */
  bvx: number; bvy: number;
  /** Repulsion offset — decays each frame */
  rx: number; ry: number;
  r: number;
  baseOpacity: number;
  phase: number;
}

@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="slider-root" (mouseenter)="pauseAuto()" (mouseleave)="resumeAuto()">

      <!-- ── Single shared particle canvas (continuous, never restarts) ── -->
      <canvas #ptCanvas class="pt-canvas"></canvas>

      <!-- Slides -->
      <div class="slides-wrap">
        <div
          *ngFor="let slide of slides; let i = index"
          class="slide"
          [class.active]="i === current"
          [style.--accent]="slide.accent"
          [style.--accent-dim]="slide.accentDim"
        >
          <!-- Gradient background -->
          <div *ngIf="slide.bgImg" class="slide-bg-img-wrap sa-px">
            <img [src]="slide.bgImg" class="slide-bg-img" alt="">
          </div>
          <div class="slide-bg" [style.background]="slide.bg"></div>

          <!-- Grid overlay -->
          <div class="slide-grid"></div>

          <!-- Per-slide theme animation layer (z-index 3, below particles) -->
          <div class="slide-anim" aria-hidden="true">


            <!-- ── MF: 3D tilted line chart floating upward ── -->
            <ng-container *ngIf="slide.id === 'mf'">
              <div class="sa-3d-scene">
                <div class="sa-px sa-mf-px">
                  <div class="sa-mf-float">
                    <svg class="sa-mf-svg" viewBox="0 0 1000 500" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="mfFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stop-color="#3B82F6" stop-opacity="0.22"/>
                          <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
                        </linearGradient>
                      </defs>
                      <polygon class="sa-mf-area"
                        points="60,460 200,370 340,390 460,270 600,210 740,150 880,90 980,60 980,500 60,500"
                        fill="url(#mfFill)"/>
                      <polyline class="sa-mf-line"
                        points="60,460 200,370 340,390 460,270 600,210 740,150 880,90 980,60"
                        fill="none" stroke="#3B82F6" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                      <circle class="sa-mf-dot" cx="200" cy="370" r="5" fill="#3B82F6" style="animation-delay:0s"/>
                      <circle class="sa-mf-dot" cx="460" cy="270" r="5" fill="#3B82F6" style="animation-delay:0.75s"/>
                      <circle class="sa-mf-dot" cx="740" cy="150" r="5" fill="#3B82F6" style="animation-delay:1.5s"/>
                      <circle class="sa-mf-dot" cx="980" cy="60"  r="5" fill="#3B82F6" style="animation-delay:2.25s"/>
                    </svg>
                    <div class="sa-depth-shadow sa-mf-shadow"></div>
                  </div>
                </div>
              </div>
              <!-- Bars stay flat (bottom of slide) -->
              <div class="sa-mf-bars">
                <div class="sa-mf-bar" style="--bh:42%;animation-delay:0.1s"></div>
                <div class="sa-mf-bar" style="--bh:61%;animation-delay:0.25s"></div>
                <div class="sa-mf-bar" style="--bh:49%;animation-delay:0.4s"></div>
                <div class="sa-mf-bar" style="--bh:78%;animation-delay:0.55s"></div>
                <div class="sa-mf-bar" style="--bh:56%;animation-delay:0.7s"></div>
                <div class="sa-mf-bar" style="--bh:88%;animation-delay:0.85s"></div>
                <div class="sa-mf-bar" style="--bh:70%;animation-delay:1.0s"></div>
              </div>
            </ng-container>

            <!-- ── FASTag: speed lines behind + 3D rotating card ── -->
            <ng-container *ngIf="slide.id === 'fastag'">
              <!-- Speed lines pass in background (flat) -->
              <div class="sa-ft-line" style="top:20%;width:55%;animation-duration:1.8s;animation-delay:0s"></div>
              <div class="sa-ft-line" style="top:31%;width:38%;animation-duration:2.2s;animation-delay:0.4s"></div>
              <div class="sa-ft-line sa-ft-bright" style="top:43%;width:72%;animation-duration:1.5s;animation-delay:0.1s"></div>
              <div class="sa-ft-line" style="top:54%;width:46%;animation-duration:1.9s;animation-delay:0.6s"></div>
              <div class="sa-ft-line" style="top:65%;width:33%;animation-duration:2.3s;animation-delay:0.2s"></div>
              <div class="sa-ft-line" style="top:75%;width:60%;animation-duration:1.7s;animation-delay:0.8s"></div>
              <!-- 3D card scene -->
              <div class="sa-3d-scene">
                <div class="sa-px sa-ft-px">
                  <div class="sa-ft-float">
                    <div class="sa-ft-card">
                      <div class="sa-ft-chip"></div>
                      <div class="sa-ft-card-lines">
                        <div class="sa-ft-cl"></div>
                        <div class="sa-ft-cl sa-ft-cl2"></div>
                      </div>
                      <div class="sa-ft-beam"></div>
                    </div>
                    <div class="sa-ft-glow-ring"></div>
                  </div>
                </div>
              </div>
              <div class="sa-ft-flash"></div>
            </ng-container>

            <!-- ── Drone: perspective field + 3D floating drone + scan beam ── -->
            <ng-container *ngIf="slide.id === 'drone'">
              <div class="sa-drone-field"></div>
              <div class="sa-drone-scan"></div>
              <!-- Spray particles -->
              <div class="sa-drone-spray sa-drone-spray1"></div>
              <div class="sa-drone-spray sa-drone-spray2"></div>
              <div class="sa-drone-spray sa-drone-spray3"></div>
              <div class="sa-3d-scene">
                <div class="sa-px sa-drone-px">
                  <div class="sa-drone-float">
                    <svg class="sa-drone-svg" viewBox="0 0 340 220">
                      <defs>
                        <radialGradient id="droneBodyGrad" cx="50%" cy="40%" r="60%">
                          <stop offset="0%"   stop-color="#FCD34D"/>
                          <stop offset="100%" stop-color="#92400E"/>
                        </radialGradient>
                        <radialGradient id="droneLensGrad" cx="38%" cy="36%" r="60%">
                          <stop offset="0%"   stop-color="#93C5FD"/>
                          <stop offset="100%" stop-color="#1E3A5F"/>
                        </radialGradient>
                        <filter id="droneGlow">
                          <feGaussianBlur stdDeviation="3" result="blur"/>
                          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="rotorBlur">
                          <feGaussianBlur stdDeviation="2.5"/>
                        </filter>
                      </defs>

                      <!-- Arms (double-line for 3D depth) -->
                      <line x1="170" y1="110" x2="62"  y2="48"  stroke="#78350F" stroke-width="7"  stroke-linecap="round"/>
                      <line x1="170" y1="110" x2="62"  y2="48"  stroke="#F59E0B" stroke-width="3"  stroke-linecap="round"/>
                      <line x1="170" y1="110" x2="278" y2="48"  stroke="#78350F" stroke-width="7"  stroke-linecap="round"/>
                      <line x1="170" y1="110" x2="278" y2="48"  stroke="#F59E0B" stroke-width="3"  stroke-linecap="round"/>
                      <line x1="170" y1="110" x2="62"  y2="172" stroke="#78350F" stroke-width="7"  stroke-linecap="round"/>
                      <line x1="170" y1="110" x2="62"  y2="172" stroke="#F59E0B" stroke-width="3"  stroke-linecap="round"/>
                      <line x1="170" y1="110" x2="278" y2="172" stroke="#78350F" stroke-width="7"  stroke-linecap="round"/>
                      <line x1="170" y1="110" x2="278" y2="172" stroke="#F59E0B" stroke-width="3"  stroke-linecap="round"/>

                      <!-- Rotor disc blur (back layer, always visible) -->
                      <ellipse cx="62"  cy="48"  rx="44" ry="10" fill="rgba(245,158,11,0.18)" filter="url(#rotorBlur)"/>
                      <ellipse cx="278" cy="48"  rx="44" ry="10" fill="rgba(245,158,11,0.18)" filter="url(#rotorBlur)"/>
                      <ellipse cx="62"  cy="172" rx="44" ry="10" fill="rgba(245,158,11,0.18)" filter="url(#rotorBlur)"/>
                      <ellipse cx="278" cy="172" rx="44" ry="10" fill="rgba(245,158,11,0.18)" filter="url(#rotorBlur)"/>

                      <!-- Motor mounts -->
                      <circle cx="62"  cy="48"  r="10" fill="#1C1008" stroke="#F59E0B" stroke-width="2"/>
                      <circle cx="278" cy="48"  r="10" fill="#1C1008" stroke="#F59E0B" stroke-width="2"/>
                      <circle cx="62"  cy="172" r="10" fill="#1C1008" stroke="#F59E0B" stroke-width="2"/>
                      <circle cx="278" cy="172" r="10" fill="#1C1008" stroke="#F59E0B" stroke-width="2"/>

                      <!-- Spinning rotors -->
                      <ellipse class="sa-rotor" cx="62"  cy="48"  rx="40" ry="9"  fill="none" stroke="#FCD34D" stroke-width="2"/>
                      <ellipse class="sa-rotor" cx="278" cy="48"  rx="40" ry="9"  fill="none" stroke="#FCD34D" stroke-width="2" style="animation-direction:reverse"/>
                      <ellipse class="sa-rotor" cx="62"  cy="172" rx="40" ry="9"  fill="none" stroke="#FCD34D" stroke-width="2" style="animation-delay:0.1s"/>
                      <ellipse class="sa-rotor" cx="278" cy="172" rx="40" ry="9"  fill="none" stroke="#FCD34D" stroke-width="2" style="animation-direction:reverse;animation-delay:0.1s"/>

                      <!-- LED lights on motor tips -->
                      <circle cx="62"  cy="48"  r="4" fill="#EF4444" opacity="0.9" filter="url(#droneGlow)"/>
                      <circle cx="278" cy="48"  r="4" fill="#22C55E" opacity="0.9" filter="url(#droneGlow)"/>
                      <circle cx="62"  cy="172" r="4" fill="#EF4444" opacity="0.9" filter="url(#droneGlow)"/>
                      <circle cx="278" cy="172" r="4" fill="#22C55E" opacity="0.9" filter="url(#droneGlow)"/>

                      <!-- Body shell (hexagon outline) -->
                      <polygon
                        points="170,78 200,88 212,110 200,132 170,142 140,132 128,110 140,88"
                        fill="url(#droneBodyGrad)" stroke="#FCD34D" stroke-width="2" opacity="0.95"/>

                      <!-- Body top detail lines -->
                      <line x1="148" y1="95" x2="192" y2="95" stroke="#78350F" stroke-width="1.5" opacity="0.7"/>
                      <line x1="148" y1="125" x2="192" y2="125" stroke="#78350F" stroke-width="1.5" opacity="0.7"/>

                      <!-- Camera gimbal -->
                      <circle cx="170" cy="148" r="10" fill="#1E293B" stroke="#FCD34D" stroke-width="1.5"/>
                      <circle cx="170" cy="148" r="6"  fill="url(#droneLensGrad)"/>
                      <circle cx="168" cy="146" r="2"  fill="rgba(255,255,255,0.55)"/>

                      <!-- Center body circle -->
                      <circle cx="170" cy="110" r="16" fill="#292109" stroke="#F59E0B" stroke-width="2"/>
                      <circle cx="170" cy="110" r="9"  fill="#F59E0B" opacity="0.25"/>
                      <circle cx="170" cy="110" r="4"  fill="#FCD34D"/>
                    </svg>
                    <div class="sa-depth-shadow sa-drone-shadow"></div>
                  </div>
                </div>
              </div>
            </ng-container>

          </div>

          <!-- ── 3D Browser Dashboard Mockup ─────────────── -->
          <div class="vid-outer" *ngIf="$any(slide.id) !== 'gps' && $any(slide.id) !== 'mf' && $any(slide.id) !== 'drone' && $any(slide.id) !== 'fastag'">
            <div class="vid-scene">
              <div class="sa-px vid-tilt">
                <div class="vid-float">
                  <div class="vid-browser">
                    <div class="vid-chrome">
                      <span class="vid-dot"></span>
                      <span class="vid-dot"></span>
                      <span class="vid-dot"></span>
                      <div class="vid-urlbar">
                        <span class="vid-url-text">nviq.app / dashboard</span>
                      </div>
                      <div class="vid-live-pill">
                        <span class="vid-live-dot"></span>LIVE
                      </div>
                    </div>
                    <div class="vid-screen">

                      <!-- MF Dashboard -->
                      <div class="db db-mf" *ngIf="slide.id === 'mf'">
                        <div class="db-header">
                          <span class="db-label">Portfolio Value</span>
                          <span class="db-badge db-badge-green">+2.4% today</span>
                        </div>
                        <div class="db-bignum db-green">₹2,84,320</div>
                        <div class="db-chart-wrap">
                          <svg class="db-sparkline" viewBox="0 0 300 80" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="mfg" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.3"/>
                                <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
                              </linearGradient>
                            </defs>
                            <polygon class="db-area" points="0,70 40,55 80,60 120,38 160,28 200,18 240,10 300,4 300,80 0,80" fill="url(#mfg)"/>
                            <polyline class="db-line db-line-green" points="0,70 40,55 80,60 120,38 160,28 200,18 240,10 300,4"/>
                            <circle class="db-dot-pulse" cx="300" cy="4" r="4" fill="#3B82F6"/>
                          </svg>
                        </div>
                        <div class="db-row-list">
                          <div class="db-row"><span class="db-row-name">Nifty 50 Index</span><span class="db-row-val db-green">+18.3%</span></div>
                          <div class="db-row"><span class="db-row-name">Mid Cap Growth</span><span class="db-row-val db-green">+24.1%</span></div>
                          <div class="db-row"><span class="db-row-name">SIP Active</span><span class="db-row-val">₹5,000/mo</span></div>
                        </div>
                      </div>


                      <!-- FASTag Dashboard -->
                      <div class="db db-ft" *ngIf="slide.id === 'fastag'">
                        <div class="db-header">
                          <span class="db-label">FASTag Console</span>
                          <span class="db-badge db-badge-purple">Active</span>
                        </div>
                        <div class="db-bignum db-purple">₹4,200 <span class="db-bignum-sub">balance</span></div>
                        <div class="db-ft-scan">
                          <div class="db-ft-scanline"></div>
                          <div class="db-ft-card-mini">
                            <div class="db-ft-chip-mini"></div>
                          </div>
                        </div>
                        <div class="db-row-list">
                          <div class="db-row"><span class="db-row-name">Last Toll</span><span class="db-row-val db-purple">-₹65</span></div>
                          <div class="db-row"><span class="db-row-name">Yamuna Exp.</span><span class="db-row-val">2 min ago</span></div>
                          <div class="db-row"><span class="db-row-name">Monthly Saved</span><span class="db-row-val db-purple">₹340</span></div>
                        </div>
                      </div>

                      <!-- Drone Dashboard -->
                      <div class="db db-drone" *ngIf="slide.id === 'drone'">
                        <div class="db-header">
                          <span class="db-label">Field Monitor</span>
                          <span class="db-badge db-badge-amber">Spraying</span>
                        </div>
                        <div class="db-drone-field">
                          <svg class="db-field-svg" viewBox="0 0 300 100">
                            <defs>
                              <pattern id="field" width="25" height="18" patternUnits="userSpaceOnUse">
                                <path d="M25 0L0 0 0 18" fill="none" stroke="rgba(96,165,250,0.15)" stroke-width="0.5"/>
                              </pattern>
                            </defs>
                            <rect width="300" height="100" fill="url(#field)"/>
                            <rect x="0" y="0" width="200" height="100" fill="rgba(59,130,246,0.06)"/>
                            <line class="db-scan-h" x1="0" y1="50" x2="300" y2="50" stroke="rgba(245,158,11,0.7)" stroke-width="1.5"/>
                            <circle class="db-drone-dot" cx="150" cy="40" r="7" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
                            <circle cx="150" cy="40" r="3" fill="#F59E0B"/>
                          </svg>
                        </div>
                        <div class="db-progress-row">
                          <span class="db-row-name">Coverage</span>
                          <div class="db-prog-bar"><div class="db-prog-fill" style="width:87%"></div></div>
                          <span class="db-row-val db-amber">87%</span>
                        </div>
                        <div class="db-row-list">
                          <div class="db-row"><span class="db-row-name">Area Scanned</span><span class="db-row-val db-amber">2.4 ha</span></div>
                          <div class="db-row"><span class="db-row-name">Battery</span><span class="db-row-val">74%</span></div>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div class="vid-glow"
                    [style.background]="'radial-gradient(ellipse,' + slide.accentDim + ' 0%,transparent 70%)'">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ambient orbs -->
          <div class="slide-orb slide-orb-1"
            [style.background]="'radial-gradient(circle,' + slide.accentDim + ' 0%,transparent 65%)'">
          </div>
          <div class="slide-orb slide-orb-2"
            style="background:radial-gradient(circle,rgba(37,99,235,0.08) 0%,transparent 65%)">
          </div>

          <!-- Content -->
          <div class="slide-content" [class.visible]="i === current" [class.mf-split]="slide.id === 'mf'">

            <!-- Left column (text) -->
            <div [class]="slide.id === 'mf' ? 'mf-left-col' : 'slide-inner-col'">
              <div class="slide-tag"
                [style.border-color]="slide.accent + '44'"
                [style.color]="slide.accent">
                <span class="tag-dot" [style.background]="slide.accent"></span>
                {{ slide.tag }}
              </div>

              <div class="slide-icon-ring"
                [style.border-color]="slide.accent + '33'"
                [style.background]="slide.accentDim">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                  [attr.stroke]="slide.accent" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path [attr.d]="slide.iconPath"/>
                </svg>
              </div>

              <h1 class="slide-heading">
                <span class="slide-h1" [class.gradient-heading]="slide.gradientHeading">
                  {{ slide.heading }}
                </span>
              </h1>
              <p class="slide-sub">{{ slide.sub }}</p>

              <!-- Extra description (company slide) -->
              <p *ngIf="slide.desc" class="slide-desc">{{ slide.desc }}</p>

              <!-- Contact info (contact slide) -->
              <div *ngIf="slide.type === 'contact'" class="slide-contact-info">
                <div class="sci-row">
                  <span class="sci-icon" [style.color]="slide.accent">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.77 3.35 2 2 0 0 1 3.74 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6.15 6.15l1.14-1.14a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </span>
                  <span class="sci-value">{{ slide.phone }}</span>
                </div>
                <div class="sci-row">
                  <span class="sci-icon" [style.color]="slide.accent">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <span class="sci-value">{{ slide.email }}</span>
                </div>
                <p class="sci-msg">Drop us a message — we respond within 24 hours.</p>
              </div>

              <!-- Coming Soon badge -->
              <div *ngIf="slide.type === 'coming-soon'" class="cs-badge"
                [style.border-color]="slide.accent + '55'"
                [style.color]="slide.accent">
                <span class="cs-pulse" [style.background]="slide.accent"></span>
                🚀 Coming Soon
              </div>

              <!-- CTA button (product / company / contact) -->
              <button *ngIf="slide.cta" class="slide-cta" type="button"
                (click)="onCta(slide)"
                style="background:linear-gradient(135deg,#3B82F6,#2563EB)">
                {{ slide.cta }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <!-- Right column: SIP Calculator (MF slide only) -->
            <ng-container *ngIf="slide.id === 'mf'">
              <div class="mf-right-col" (click)="$event.stopPropagation()">
                <div class="sip-card">
                  <div class="sip-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="18" rx="3"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
                    SIP Calculator
                  </div>

                  <div class="sip-field">
                    <div class="sip-field-row">
                      <span class="sip-label">Monthly Investment</span>
                      <span class="sip-val">₹{{ sipAmount | number }}</span>
                    </div>
                    <input type="range" class="sip-range" min="1000" max="500000" step="1000"
                      [value]="sipAmount" (input)="sipAmount = +$any($event.target).value">
                    <div class="sip-range-bounds"><span>₹1,000</span><span>₹5,00,000</span></div>
                  </div>

                  <div class="sip-field">
                    <div class="sip-field-row">
                      <span class="sip-label">Duration</span>
                      <span class="sip-val">{{ sipYears }} yrs</span>
                    </div>
                    <input type="range" class="sip-range" min="1" max="30" step="1"
                      [value]="sipYears" (input)="sipYears = +$any($event.target).value">
                    <div class="sip-range-bounds"><span>1 yr</span><span>30 yrs</span></div>
                  </div>

                  <div class="sip-field">
                    <div class="sip-field-row">
                      <span class="sip-label">Expected Return</span>
                      <span class="sip-val sip-rate">{{ sipRate }}% p.a.</span>
                    </div>
                    <input type="range" class="sip-range" min="0" max="30" step="0.5"
                      [value]="sipRate" (input)="sipRate = +$any($event.target).value">
                    <div class="sip-range-bounds"><span>0%</span><span>30%</span></div>
                  </div>

                  <div class="sip-divider"></div>

                  <div class="sip-results">
                    <div class="sip-res-item">
                      <div class="sip-res-label">Invested</div>
                      <div class="sip-res-val">₹{{ sipResult.invested | number }}</div>
                    </div>
                    <div class="sip-res-arrow">→</div>
                    <div class="sip-res-item">
                      <div class="sip-res-label">Est. Returns</div>
                      <div class="sip-res-val sip-gain">₹{{ sipResult.maturity | number }}</div>
                    </div>
                  </div>

                  <div class="sip-gain-tag">
                    <span class="sip-gain-dot"></span>
                    Wealth Gained: ₹{{ sipResult.gains | number }}
                  </div>
                </div>
              </div>
            </ng-container>

          </div>

        </div>
      </div>

      <!-- Dots -->
      <div class="slider-dots">
        <button
          *ngFor="let s of slides; let i = index"
          class="dot"
          [class.dot-active]="i === current"
          [style.--da]="s.accent"
          (click)="goTo(i)"
          type="button"
          [attr.aria-label]="'Go to slide ' + (i+1)"
        ></button>
      </div>

      <!-- Progress bar -->
      <div class="progress-bar">
        <div class="progress-fill"
          [style.transition-duration]="'2000ms'"
          [class.running]="running">
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* ── Root ──────────────────────────────────────────── */
    .slider-root {
      position: relative; width: 100%;
      height: 100vh; overflow: hidden;
      background: #0A0A0A;
    }

    /* ── Particle canvas — behind slide content ─────────── */
    .pt-canvas {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      z-index: 5; pointer-events: none;
    }

    /* ── Slides ─────────────────────────────────────────── */
    .slides-wrap { position: absolute; inset: 0; }

    .slide {
      position: absolute; inset: 0;
      opacity: 0; transition: opacity 1.2s ease;
      pointer-events: none;
    }
    .slide.active { opacity: 1; pointer-events: auto; }

    .slide-bg-img-wrap { position: absolute; inset: -8%; z-index: 0; transform-style: preserve-3d; }
    .slide-bg-img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.08); transition: transform 0.18s ease-out; }
    .slide-bg  { position: absolute; inset: 0; z-index: 1; }

    .slide-grid {
      position: absolute; inset: 0; z-index: 1;
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 64px 64px;
      mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 100%);
    }

    .slide-orb {
      position: absolute; border-radius: 50%;
      filter: blur(100px); pointer-events: none; z-index: 1;
    }
    .slide-orb-1 {
      width: 700px; height: 700px;
      top: -200px; left: -150px;
      animation: so1 14s ease-in-out infinite;
    }
    .slide-orb-2 {
      width: 500px; height: 500px;
      bottom: -100px; right: -100px;
      animation: so2 18s ease-in-out infinite;
    }
    @keyframes so1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,50px)} }
    @keyframes so2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,-40px)} }

    /* ── Content — sits above particle canvas ───────────── */
    .slide-content {
      position: relative; z-index: 20;
      height: 100%;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center;
      padding: 100px 24px 80px;
      opacity: 0; transition: opacity 0.5s ease 0.4s;
    }
    .slide-content.visible { opacity: 1; }

    /* Tag */
    .slide-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 18px; border-radius: 999px;
      border: 1px solid; background: rgba(255,255,255,0.04);
      backdrop-filter: blur(8px);
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.12em;
      margin-bottom: 32px;
    }
    .tag-dot {
      width: 6px; height: 6px; border-radius: 50%;
      animation: tdp 1.8s ease-in-out infinite;
    }
    @keyframes tdp { 0%,100%{opacity:1} 50%{opacity:0.4} }

    /* Icon */
    .slide-icon-ring {
      width: 80px; height: 80px;
      border-radius: 22px; border: 1px solid;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 28px;
      animation: iconPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.6s both;
    }
    @keyframes iconPop {
      from { transform: scale(0.6) rotate(-10deg); opacity: 0; }
      to   { transform: none; opacity: 1; }
    }

    /* Heading */
    .slide-heading { margin-bottom: 16px; }
    .slide-h1 {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(3rem, 8vw, 7.5rem);
      font-weight: 900; letter-spacing: -0.04em;
      line-height: 0.95; display: block; color: #fff;
    }
    .gradient-heading {
      background: linear-gradient(120deg, #2563EB 0%, #3B82F6 40%, #93C5FD 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Sub */
    .slide-sub {
      color: rgba(255,255,255,0.6);
      font-size: clamp(0.95rem, 1.5vw, 1.15rem);
      line-height: 1.7; max-width: 560px;
      margin: 0 auto 40px;
    }

    /* CTA */
    .slide-cta {
      display: inline-flex; align-items: center; gap: 10px;
      height: 56px; padding: 0 36px; border-radius: 16px;
      border: none; color: #fff;
      font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 32px rgba(37,99,235,0.4);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      position: relative; overflow: hidden;
    }
    .slide-cta::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent);
      opacity: 0; transition: opacity 0.25s;
    }
    .slide-cta:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 16px 48px rgba(37,99,235,0.55);
    }
    .slide-cta:hover::before { opacity: 1; }
    .slide-cta svg { transition: transform 0.2s ease; }
    .slide-cta:hover svg { transform: translateX(4px); }

    /* ── MF Two-Column Layout ──────────────────────────── */
    .slide-content.mf-split {
      flex-direction: row;
      text-align: left;
      align-items: center;
      justify-content: center;
      padding: 100px 6% 80px;
      gap: 48px;
    }
    .mf-left-col {
      flex: 1;
      display: flex; flex-direction: column;
      align-items: flex-start;
      max-width: 560px;
    }
    .mf-left-col .slide-sub { margin: 0 0 40px; }
    .mf-left-col .slide-tag { margin-bottom: 28px; }
    .mf-right-col {
      flex: 0 0 340px;
      pointer-events: auto;
    }
    .slide-inner-col {
      display: contents;
    }

    /* ── SIP Calculator Card ───────────────────────────── */
    .sip-card {
      background: rgba(6,12,28,0.82);
      border: 1px solid rgba(59,130,246,0.28);
      border-radius: 20px;
      padding: 24px 22px 20px;
      backdrop-filter: blur(20px);
      box-shadow:
        0 0 0 1px rgba(59,130,246,0.08),
        0 20px 60px rgba(0,0,0,0.55),
        0 0 80px rgba(59,130,246,0.07);
    }
    .sip-header {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: #93C5FD; margin-bottom: 20px;
    }
    .sip-field { margin-bottom: 16px; }
    .sip-field-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 6px;
    }
    .sip-label { font-size: 11px; color: rgba(255,255,255,0.4); }
    .sip-val   { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); }
    .sip-rate  { color: #60A5FA; }

    .sip-range {
      -webkit-appearance: none;
      width: 100%; height: 4px; border-radius: 99px;
      background: rgba(255,255,255,0.1);
      outline: none; cursor: pointer;
    }
    .sip-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px; height: 16px; border-radius: 50%;
      background: linear-gradient(135deg, #3B82F6, #60A5FA);
      border: 2px solid rgba(255,255,255,0.9);
      box-shadow: 0 0 10px rgba(59,130,246,0.5);
      cursor: pointer;
    }
    .sip-range-bounds {
      display: flex; justify-content: space-between;
      font-size: 9px; color: rgba(255,255,255,0.25);
      margin-top: 4px;
    }

    .sip-divider {
      height: 1px; background: rgba(59,130,246,0.15);
      margin: 16px 0;
    }
    .sip-results {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 14px;
    }
    .sip-res-item { text-align: center; }
    .sip-res-label {
      font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em;
      color: rgba(255,255,255,0.3); margin-bottom: 4px;
    }
    .sip-res-val {
      font-size: 18px; font-weight: 800;
      color: rgba(255,255,255,0.9);
      font-family: 'Outfit', sans-serif;
    }
    .sip-gain  { color: #34D399; }
    .sip-res-arrow { font-size: 18px; color: rgba(59,130,246,0.45); }

    .sip-gain-tag {
      display: flex; align-items: center; gap: 8px;
      background: rgba(52,211,153,0.08);
      border: 1px solid rgba(52,211,153,0.2);
      border-radius: 10px; padding: 8px 14px;
      font-size: 12px; font-weight: 700; color: #34D399;
    }
    .sip-gain-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #34D399;
      animation: tdp 1.8s ease-in-out infinite;
      flex-shrink: 0;
    }

    @media (max-width: 1024px) {
      .slide-content.mf-split { flex-direction: column; text-align: center; padding: 100px 24px 80px; }
      .mf-left-col { align-items: center; }
      .mf-left-col .slide-sub { margin: 0 auto 40px; }
      .mf-right-col { flex: none; width: 100%; max-width: 380px; }
    }

    /* ── Dots ───────────────────────────────────────────── */
    .slider-dots {
      position: absolute; bottom: 36px; left: 50%;
      transform: translateX(-50%);
      display: flex; gap: 10px; z-index: 30;
    }
    .dot {
      width: 8px; height: 8px; border-radius: 999px;
      background: rgba(255,255,255,0.25); border: none;
      cursor: pointer; transition: width 0.3s ease, background 0.3s ease;
    }
    .dot-active {
      width: 28px; background: #2563EB;
      box-shadow: 0 0 12px rgba(37,99,235,0.6);
    }

    /* ── Progress bar ───────────────────────────────────── */
    .progress-bar {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 2px; background: rgba(255,255,255,0.07); z-index: 30;
    }
    .progress-fill {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, #2563EB, #3B82F6);
      transition: width 2000ms linear;
    }
    .progress-fill.running { width: 100%; }

    /* ── Extra description ──────────────────────────────── */
    .slide-desc {
      color: rgba(255,255,255,0.45);
      font-size: clamp(0.85rem, 1.2vw, 1rem);
      line-height: 1.65; max-width: 520px;
      margin: -20px auto 36px;
      font-style: italic;
      animation: fadeUp 0.6s ease 0.7s both;
    }

    /* ── Contact info rows ──────────────────────────────── */
    .slide-contact-info {
      display: flex; flex-direction: column; align-items: center;
      gap: 10px; margin-bottom: 36px;
      animation: fadeUp 0.6s ease 0.65s both;
    }
    .sci-row {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 8px 20px; border-radius: 10px;
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .sci-icon { display: flex; align-items: center; }
    .sci-value {
      color: rgba(255,255,255,0.85);
      font-size: 14px; font-weight: 500; letter-spacing: 0.02em;
    }
    .sci-msg {
      color: rgba(255,255,255,0.38);
      font-size: 12px; margin: 4px 0 0;
      letter-spacing: 0.02em;
    }

    /* ── Coming Soon badge ──────────────────────────────── */
    .cs-badge {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 10px 28px; border-radius: 999px;
      border: 1px solid;
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(8px);
      font-size: 14px; font-weight: 700;
      letter-spacing: 0.06em;
      margin-bottom: 40px;
      animation: fadeUp 0.6s ease 0.65s both;
    }
    .cs-pulse {
      width: 8px; height: 8px; border-radius: 50%;
      display: inline-block;
      animation: csPulse 1.6s ease-in-out infinite;
    }
    @keyframes csPulse {
      0%,100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(1.5); opacity: 0.5; }
    }

    /* ── Fade-up entrance animation ─────────────────────── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ══════════════════════════════════════════════════════
       PER-SLIDE THEME ANIMATION LAYER
       z-index: 3 → above grid/orbs (1), below particles (5)
       ══════════════════════════════════════════════════════ */
    .slide-anim {
      position: absolute; inset: 0; z-index: 3;
      overflow: hidden; pointer-events: none;
    }

    /* ── 3D shared wrappers ──────────────────────────── */
    .sa-3d-scene {
      position: absolute; inset: 0;
      perspective: 1100px; perspective-origin: 50% 38%;
    }
    .sa-px {
      transform: rotateX(calc(var(--pmy, 0) * -4deg)) rotateY(calc(var(--pmx, 0) * 4deg));
      transition: transform 0.18s ease-out;
      transform-style: preserve-3d;
    }
    .sa-depth-shadow {
      position: absolute; left: 10%; right: 10%; bottom: 4%;
      height: 60px; border-radius: 50%;
      filter: blur(28px);
      transform: translateZ(-40px) scaleY(0.35);
    }

    /* ── GPS: Moving map grid ─────────────────────────── */
    .sa-gps-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(37,99,235,0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(37,99,235,0.07) 1px, transparent 1px);
      background-size: 56px 56px;
      animation: saGpsGrid 5s linear infinite;
    }
    @keyframes saGpsGrid {
      from { background-position: 0 0; }
      to   { background-position: 56px 56px; }
    }

    /* GPS 3D wrappers */
    .sa-gps-px { position: absolute; inset: 0; transform-style: preserve-3d; }
    .sa-gps-float {
      position: absolute; inset: 0; transform-style: preserve-3d;
      animation: saGps3d 7s ease-in-out infinite;
      filter: drop-shadow(0 28px 18px rgba(37,99,235,0.18));
    }
    @keyframes saGps3d {
      0%,100% { transform: rotateX(16deg) rotateY(7deg)  translateY(0)    translateZ(0); }
      50%     { transform: rotateX(11deg) rotateY(11deg) translateY(-12px) translateZ(20px); }
    }
    .sa-gps-shadow { background: rgba(37,99,235,0.22); }

    /* GPS SVG: route + pins */
    .sa-gps-svg {
      position: absolute; inset: 0;
      width: 100%; height: 100%; opacity: 0.3;
    }
    .sa-gps-route {
      stroke-dasharray: 14 7;
      animation: saGpsRoute 5s linear infinite;
    }
    @keyframes saGpsRoute {
      from { stroke-dashoffset: 0; }
      to   { stroke-dashoffset: -210; }
    }
    .sa-gps-pin {
      animation: saGpsPin 2.5s ease-in-out infinite;
      transform-box: fill-box; transform-origin: center;
    }
    @keyframes saGpsPin {
      0%,100% { opacity: 1;   transform: scale(1); }
      50%     { opacity: 0.3; transform: scale(0.5); }
    }
    .sa-gps-ripple {
      animation: saGpsRipple 2.5s ease-out infinite;
      transform-box: fill-box; transform-origin: center;
    }
    @keyframes saGpsRipple {
      from { opacity: 0.7; transform: scale(1); }
      to   { opacity: 0;   transform: scale(3.8); }
    }

    /* ── MF: Line chart ───────────────────────────────── */
    .sa-mf-px { position: absolute; inset: 0; transform-style: preserve-3d; }
    .sa-mf-float {
      position: absolute; inset: 0; transform-style: preserve-3d;
      animation: saMf3d 6s ease-in-out infinite;
      filter: drop-shadow(0 22px 14px rgba(59,130,246,0.14));
    }
    @keyframes saMf3d {
      0%,100% { transform: rotateX(11deg) rotateY(-5deg) translateY(0)    translateZ(0); }
      50%     { transform: rotateX(7deg)  rotateY(-9deg) translateY(-14px) translateZ(22px); }
    }
    .sa-mf-shadow { background: rgba(59,130,246,0.18); }
    .sa-mf-svg {
      position: absolute; inset: 0; width: 100%; height: 100%;
    }
    .sa-mf-area { opacity: 1; }
    .sa-mf-line {
      stroke-dasharray: 1300;
      animation: saMfLine 5s ease-in-out infinite;
      opacity: 0.38;
    }
    @keyframes saMfLine {
      0%   { stroke-dashoffset: 1300; }
      55%  { stroke-dashoffset: 0; }
      90%  { stroke-dashoffset: 0; opacity: 0.38; }
      100% { stroke-dashoffset: 1300; opacity: 0; }
    }
    .sa-mf-dot {
      animation: saMfDot 3s ease-in-out infinite;
      transform-box: fill-box; transform-origin: center;
    }
    @keyframes saMfDot {
      0%,30% { opacity: 0;   transform: scale(0.5); }
      55%    { opacity: 0.9; transform: scale(2.2); }
      80%    { opacity: 0.3; transform: scale(1.2); }
      100%   { opacity: 0;   transform: scale(0.5); }
    }
    .sa-mf-bars {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 26%;
      display: flex; align-items: flex-end; gap: 14px;
      padding: 0 10%;
    }
    .sa-mf-bar {
      flex: 1; border-radius: 4px 4px 0 0;
      height: var(--bh, 60%);
      background: linear-gradient(180deg, rgba(59,130,246,0.22), rgba(59,130,246,0.03));
      transform: scaleY(0); transform-origin: bottom;
      animation: saMfBar 4s ease-in-out infinite;
    }
    @keyframes saMfBar {
      0%,5%   { transform: scaleY(0); }
      40%,70% { transform: scaleY(1); }
      95%,100%{ transform: scaleY(0); }
    }


    /* ── FASTag: Horizontal speed lines ──────────────── */
    .sa-ft-line {
      position: absolute; left: -110%;
      height: 2px; border-radius: 999px;
      background: linear-gradient(90deg, transparent, rgba(167,139,250,0.55), transparent);
      animation: saFtLine 2s linear infinite;
    }
    .sa-ft-bright {
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(167,139,250,0.85), rgba(245,158,11,0.45), transparent);
      box-shadow: 0 0 10px rgba(167,139,250,0.3);
    }
    @keyframes saFtLine {
      0%   { transform: translateX(0);     opacity: 0; }
      8%   { opacity: 1; }
      92%  { opacity: 1; }
      100% { transform: translateX(220vw); opacity: 0; }
    }

    /* FASTag 3D wrappers */
    .sa-ft-px {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      transform-style: preserve-3d;
    }
    .sa-ft-float {
      position: relative; display: flex;
      align-items: center; justify-content: center;
      margin-top: -60px; transform-style: preserve-3d;
      animation: saFt3d 5s ease-in-out infinite;
    }
    @keyframes saFt3d {
      0%,100% { transform: rotateY(-8deg)  rotateX(4deg)  translateZ(0)   translateY(0); }
      50%     { transform: rotateY(8deg)   rotateX(-3deg) translateZ(35px) translateY(-16px); }
    }
    .sa-ft-chip {
      position: absolute; top: 22px; left: 22px;
      width: 36px; height: 26px; border-radius: 5px;
      background: linear-gradient(135deg, rgba(167,139,250,0.4), rgba(167,139,250,0.15));
      border: 1px solid rgba(167,139,250,0.3);
    }
    .sa-ft-card-lines { position: absolute; bottom: 24px; left: 20px; right: 20px; }
    .sa-ft-cl { height: 4px; border-radius: 999px; margin-bottom: 7px; background: rgba(167,139,250,0.25); }
    .sa-ft-cl2 { width: 55%; background: rgba(167,139,250,0.15); }
    .sa-ft-glow-ring {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, 50%) rotateX(80deg);
      width: 200px; height: 200px; border-radius: 50%;
      background: radial-gradient(ellipse, rgba(167,139,250,0.22) 0%, transparent 70%);
      filter: blur(12px);
    }

    /* FASTag card scan */
    .sa-ft-card {
      position: relative;
      width: 210px; height: 135px;
      border: 1px solid rgba(167,139,250,0.35);
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(167,139,250,0.08), rgba(167,139,250,0.02));
      overflow: hidden;
      box-shadow: 0 0 0 1px rgba(167,139,250,0.12), 0 8px 32px rgba(167,139,250,0.18), 0 2px 8px rgba(0,0,0,0.2);
    }
    .sa-ft-beam {
      position: absolute; left: 0; right: 0; top: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(167,139,250,0.9), transparent);
      box-shadow: 0 0 14px rgba(167,139,250,0.6);
      animation: saFtBeam 2s ease-in-out infinite;
    }
    @keyframes saFtBeam {
      0%   { top: 0%;   opacity: 1; }
      50%  { top: 100%; opacity: 0.7; }
      100% { top: 0%;   opacity: 1; }
    }
    .sa-ft-flash {
      position: absolute; inset: 0;
      background: rgba(167,139,250,0.06);
      animation: saFtFlash 4s ease-in-out infinite;
    }
    @keyframes saFtFlash {
      0%,78%,100% { opacity: 0; }
      85%         { opacity: 1; }
    }

    /* ── Drone: Field grid + floating body + scan beam ─ */
    .sa-drone-field {
      position: absolute; bottom: 0; left: -15%; right: -15%;
      height: 50%;
      background-image:
        linear-gradient(rgba(245,158,11,0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(245,158,11,0.12) 1px, transparent 1px);
      background-size: 64px 48px;
      transform: perspective(500px) rotateX(58deg);
      transform-origin: bottom center;
    }
    .sa-drone-px { position: absolute; inset: 0; transform-style: preserve-3d; }
    .sa-drone-float {
      position: absolute; top: 8%; left: 50%;
      margin-left: -140px;
      display: flex; flex-direction: column; align-items: center;
      transform-style: preserve-3d;
      animation: saDrone3d 4.5s ease-in-out infinite;
    }
    @keyframes saDrone3d {
      0%,100% { transform: rotateZ(-4deg) rotateX(10deg)  translateY(0)    translateZ(0); }
      30%     { transform: rotateZ(4deg)  rotateX(-6deg)  translateY(-28px) translateZ(28px); }
      65%     { transform: rotateZ(1deg)  rotateX(4deg)   translateY(-14px) translateZ(12px); }
    }
    .sa-drone-svg {
      width: 280px; opacity: 0.92;
      filter:
        drop-shadow(0 0 18px rgba(245,158,11,0.8))
        drop-shadow(0 0 40px rgba(245,158,11,0.35))
        drop-shadow(0 14px 28px rgba(245,158,11,0.25));
    }
    .sa-drone-shadow {
      background: radial-gradient(ellipse, rgba(245,158,11,0.35) 0%, transparent 70%);
      width: 200px; height: 18px; margin-top: 4px;
      border-radius: 50%; animation: saDroneShadow 4.5s ease-in-out infinite;
    }
    @keyframes saDroneShadow {
      0%,100% { transform: scaleX(1);    opacity: 0.5; }
      30%     { transform: scaleX(0.6);  opacity: 0.2; }
    }
    .sa-drone-scan {
      position: absolute; top: 40%; left: 10%; right: 10%;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(245,158,11,0.9), transparent);
      box-shadow: 0 0 20px rgba(245,158,11,0.5), 0 0 50px rgba(245,158,11,0.15);
      animation: saDroneScan 3.5s ease-in-out infinite;
    }
    @keyframes saDroneScan {
      0%   { transform: translateY(0);    opacity: 1; }
      80%  { opacity: 0.2; }
      100% { transform: translateY(45vh); opacity: 0; }
    }
    /* Spray droplet particles */
    .sa-drone-spray {
      position: absolute; top: 52%; width: 2px; height: 0;
      background: linear-gradient(to bottom, rgba(245,158,11,0.7), transparent);
      border-radius: 1px;
      animation: saDroneSpray 2s ease-in infinite;
    }
    .sa-drone-spray1 { left: 38%; animation-delay: 0s;    animation-duration: 1.8s; }
    .sa-drone-spray2 { left: 50%; animation-delay: 0.35s; animation-duration: 2.1s; }
    .sa-drone-spray3 { left: 62%; animation-delay: 0.7s;  animation-duration: 1.9s; }
    @keyframes saDroneSpray {
      0%   { height: 0;    opacity: 1;   transform: translateY(0) scaleX(1); }
      60%  { height: 40px; opacity: 0.6; }
      100% { height: 80px; opacity: 0;   transform: translateY(20px) scaleX(2.5); }
    }
    .sa-rotor {
      transform-box: fill-box; transform-origin: center;
      animation: saRotorSpin 0.18s linear infinite;
    }
    @keyframes saRotorSpin {
      0%   { transform: scaleX(1);     opacity: 0.95; }
      25%  { transform: scaleX(0.1);   opacity: 0.4;  }
      50%  { transform: scaleX(-1);    opacity: 0.95; }
      75%  { transform: scaleX(-0.1);  opacity: 0.4;  }
      100% { transform: scaleX(1);     opacity: 0.95; }
    }

    /* ── 3D Video Mockup ────────────────────────────────── */
    .vid-outer {
      position: absolute;
      right: 3%;
      top: 0; bottom: 0;
      display: flex; align-items: center;
      z-index: 8;
      pointer-events: none;
      width: 44%;
    }
    .vid-scene {
      width: 100%;
      perspective: 1300px;
      perspective-origin: 50% 50%;
    }
    .vid-tilt {
      transform-style: preserve-3d;
    }
    .vid-float {
      position: relative;
      transform-style: preserve-3d;
      animation: vidFloat 6s ease-in-out infinite;
    }
    @keyframes vidFloat {
      0%,100% { transform: rotateX(9deg) rotateY(-16deg) translateY(0); }
      50%      { transform: rotateX(5deg) rotateY(-11deg) translateY(-18px); }
    }
    .vid-browser {
      width: 100%;
      border-radius: 14px;
      overflow: hidden;
      background: rgba(8,12,24,0.90);
      border: 1px solid rgba(255,255,255,0.13);
      box-shadow:
        0 50px 120px rgba(0,0,0,0.6),
        0 0 0 1px rgba(255,255,255,0.05),
        inset 0 1px 0 rgba(255,255,255,0.09);
    }
    .vid-chrome {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 14px;
      background: rgba(255,255,255,0.04);
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .vid-dot {
      width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
    }
    .vid-dot:nth-child(1) { background: #FF5F57; }
    .vid-dot:nth-child(2) { background: #FEBC2E; }
    .vid-dot:nth-child(3) { background: #28C840; }
    .vid-urlbar {
      flex: 1; height: 20px; border-radius: 5px; margin-left: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; padding: 0 8px;
    }
    .vid-url-text {
      font-size: 10px; color: rgba(255,255,255,0.35);
      font-family: 'Outfit', sans-serif; letter-spacing: 0.02em;
    }
    .vid-screen {
      position: relative;
      aspect-ratio: 16/9;
      background: #080e1c;
      overflow: hidden;
      display: flex; flex-direction: column;
    }
    .vid-glow {
      position: absolute;
      bottom: -48px; left: -15%; right: -15%;
      height: 80px; border-radius: 50%;
      filter: blur(38px); opacity: 0.85;
    }

    /* ── Dashboard Screens ──────────────────────────────── */
    .db {
      padding: 14px 16px 12px;
      display: flex; flex-direction: column; gap: 10px;
      background: #080e1c;
      flex: 1; overflow: hidden;
      font-family: 'Outfit', sans-serif;
    }
    .db-header {
      display: flex; align-items: center; justify-content: space-between;
    }
    .db-label {
      font-size: 11px; font-weight: 600;
      color: rgba(255,255,255,0.45); letter-spacing: 0.06em; text-transform: uppercase;
    }
    .db-badge {
      font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 999px;
    }
    .db-badge-green  { background: rgba(59,130,246,0.15);  color: #3B82F6; border: 1px solid rgba(59,130,246,0.25); }
    .db-badge-blue   { background: rgba(59,130,246,0.15); color: #3B82F6; border: 1px solid rgba(59,130,246,0.25); }
    .db-badge-purple { background: rgba(167,139,250,0.15);color: #A78BFA; border: 1px solid rgba(167,139,250,0.25);}
    .db-badge-amber  { background: rgba(245,158,11,0.15); color: #F59E0B; border: 1px solid rgba(245,158,11,0.25); }

    .db-bignum {
      font-size: 26px; font-weight: 800; letter-spacing: -0.02em;
      animation: dbCount 3s ease-out both;
    }
    .db-bignum-sub { font-size: 12px; font-weight: 500; opacity: 0.5; margin-left: 4px; }
    @keyframes dbCount {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: none; }
    }
    .db-green  { color: #3B82F6; }
    .db-blue   { color: #3B82F6; }
    .db-purple { color: #A78BFA; }
    .db-amber  { color: #F59E0B; }

    /* Sparkline */
    .db-chart-wrap { position: relative; height: 60px; }
    .db-sparkline  { width: 100%; height: 100%; }
    .db-line { fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .db-line-green { stroke: #3B82F6; stroke-dasharray: 600; animation: dbDraw 2.5s ease-out both; }
    @keyframes dbDraw {
      from { stroke-dashoffset: 600; }
      to   { stroke-dashoffset: 0; }
    }
    .db-dot-pulse {
      animation: dbPing 1.4s ease-out infinite;
      transform-box: fill-box; transform-origin: center;
    }
    @keyframes dbPing {
      0%,100% { opacity: 1; r: 4; }
      50%     { opacity: 0.4; r: 7; }
    }

    /* GPS map */
    .db-map { border-radius: 8px; overflow: hidden; border: 1px solid rgba(59,130,246,0.15); }
    .db-map-svg { width: 100%; display: block; }
    .db-route { stroke-dasharray: 400; animation: dbDraw 3s ease-out both; }
    .db-vehicle { animation: dbPulse 1.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
    .db-vehicle-ring { animation: dbRing 1.5s ease-out infinite; transform-box: fill-box; transform-origin: center; }
    @keyframes dbPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.25)} }
    @keyframes dbRing  { from{opacity:0.8;transform:scale(1)} to{opacity:0;transform:scale(2.2)} }

    /* FASTag scan */
    .db-ft-scan {
      position: relative; height: 54px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 8px; border: 1px solid rgba(167,139,250,0.15);
      overflow: hidden;
    }
    .db-ft-scanline {
      position: absolute; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, #A78BFA, transparent);
      box-shadow: 0 0 12px rgba(167,139,250,0.6);
      animation: dbScan 2s ease-in-out infinite;
    }
    @keyframes dbScan {
      0%   { top: 0%; opacity:1; }
      50%  { top: 100%; opacity:0.7; }
      100% { top: 0%; opacity:1; }
    }
    .db-ft-card-mini {
      width: 72px; height: 44px; border-radius: 6px;
      border: 1px solid rgba(167,139,250,0.3);
      background: linear-gradient(135deg, rgba(167,139,250,0.1), rgba(167,139,250,0.03));
      position: relative;
    }
    .db-ft-chip-mini {
      position: absolute; top: 8px; left: 8px;
      width: 18px; height: 13px; border-radius: 2px;
      background: rgba(167,139,250,0.35); border: 1px solid rgba(167,139,250,0.4);
    }

    /* Drone field */
    .db-drone-field { border-radius: 8px; overflow: hidden; border: 1px solid rgba(96,165,250,0.1); }
    .db-field-svg { width: 100%; display: block; }
    .db-scan-h { animation: dbHScan 3s ease-in-out infinite; }
    @keyframes dbHScan {
      0%,100% { transform: translateY(-30px); opacity:0.8; }
      50%     { transform: translateY(30px);  opacity:0.4; }
    }
    .db-drone-dot { animation: dbPulse 2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }

    /* Progress bar */
    .db-progress-row {
      display: flex; align-items: center; gap: 8px;
    }
    .db-prog-bar {
      flex: 1; height: 5px; border-radius: 999px;
      background: rgba(255,255,255,0.08);
    }
    .db-prog-fill {
      height: 100%; border-radius: 999px;
      background: linear-gradient(90deg, #F59E0B, #FBBF24);
      animation: dbGrow 1.5s ease-out both;
      transform-origin: left;
    }
    @keyframes dbGrow {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }

    /* Rows */
    .db-row-list { display: flex; flex-direction: column; gap: 6px; }
    .db-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 6px 10px; border-radius: 7px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
    }
    .db-row-name { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 500; }
    .db-row-val  { font-size: 11px; color: rgba(255,255,255,0.75); font-weight: 700; }

    /* LIVE pill */
    .vid-live-pill {
      display: flex; align-items: center; gap: 5px;
      font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
      color: #3B82F6; margin-left: auto;
    }
    .vid-live-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #3B82F6;
      animation: dbPulse 1.2s ease-in-out infinite; display: inline-block;
    }

    /* ── Responsive ─────────────────────────────────────── */
    @media (max-width: 1100px) {
      .vid-outer { display: none; }
    }
    @media (max-width: 768px) {
      .slide-icon-ring { width: 60px; height: 60px; border-radius: 16px; }
      .sci-row { padding: 7px 14px; }
      .sa-ft-card { width: 160px; height: 100px; }
      .sa-drone-svg { width: 200px; }
      .sa-drone-float { margin-left: -100px; }
    }
  `]
})
export class HomeSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ptCanvas') ptCanvasRef!: ElementRef<HTMLCanvasElement>;

  current = 0;
  running = false;
  private paused = false;

  sipAmount = 5000;
  sipYears  = 10;
  sipRate   = 12;

  get sipResult() {
    const P = this.sipAmount;
    const r = this.sipRate / 12 / 100;
    const n = this.sipYears * 12;
    const M = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    return {
      invested: Math.round(invested),
      maturity: Math.round(M),
      gains:    Math.round(M - invested),
    };
  }

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private rafId = 0;
  private cleanupAll?: () => void;

  slides: Slide[] = [
    {
      type: 'product',
      id: 'gps',
      heading: 'Drive with Data',
      sub: 'Real-time GPS intelligence for every vehicle in your fleet — live location, smart alerts, and route analytics.',
      cta: 'Explore Fleet Platform',
      accent: '#3B82F6',
      accentDim: 'rgba(59,130,246,0.12)',
      bg: 'linear-gradient(135deg,rgba(5,10,20,0.78) 0%,rgba(9,22,40,0.68) 50%,rgba(4,12,26,0.78) 100%)',
      bgImg: '/images/gps-hero.jpg.jpg',
      iconPath: 'M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10zM12 11m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
      tag: 'GPS Tracking',
      videoSrc: 'assets/videos/gps-demo.mp4',
    },
    {
      type: 'product',
      id: 'mf',
      heading: 'Grow Your Wealth',
      sub: 'SIP-based mutual fund investments for every Indian. Start with just ₹1,000/month and watch your money grow.',
      cta: 'Start Investing',
      accent: '#3B82F6',
      accentDim: 'rgba(59,130,246,0.12)',
      bg: 'linear-gradient(135deg,rgba(5,10,20,0.72) 0%,rgba(9,22,40,0.62) 50%,rgba(5,10,20,0.72) 100%)',
      bgImg: '/images/mf slide-1.jpg.jpg',
      iconPath: 'M4 19h16M7 15V9M12 15V4M17 15v-5',
      tag: 'Mutual Funds',
      gradientHeading: true,
      videoSrc: 'assets/videos/mf-demo.mp4',
    },
    {
      type: 'coming-soon',
      id: 'fastag',
      heading: 'FASTag System',
      sub: 'Seamless toll payments for your entire fleet — no manual recharges, no queue delays.',
      accent: '#A78BFA',
      accentDim: 'rgba(167,139,250,0.12)',
      bg: 'linear-gradient(135deg,rgba(8,4,15,0.75) 0%,rgba(18,10,30,0.65) 50%,rgba(8,4,15,0.75) 100%)',
      bgImg: '/images/fastag-hero.jpg.jpeg',
      iconPath: 'M3 10h18v4H3zM7 14v4M17 14v4M12 2v4M5 6h14a1 1 0 0 1 1 1v3H4V7a1 1 0 0 1 1-1z',
      tag: 'FASTag System',
      videoSrc: 'assets/videos/fastag-demo.mp4',
    },
    {
      type: 'coming-soon',
      id: 'drone',
      heading: 'Agriculture Drone',
      sub: 'Smart farming solutions from the sky — crop monitoring, precision spraying, and yield intelligence.',
      accent: '#F59E0B',
      accentDim: 'rgba(245,158,11,0.12)',
      bg: 'linear-gradient(135deg,rgba(9,7,0,0.75) 0%,rgba(23,16,0,0.65) 50%,rgba(9,7,0,0.75) 100%)',
      bgImg: '/images/drone-hero.jpg.jpeg',
      iconPath: 'M12 2l2 5h5l-4 3 1.5 5L12 12l-4.5 3 1.5-5-4-3h5zM12 12v10',
      tag: 'Agriculture Drone',
      videoSrc: 'assets/videos/drone-demo.mp4',
    },
  ];

  constructor(
    private nav: NavService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.startProgress();
    this.startInterval();
  }

  pauseAuto(): void { this.paused = true; }
  resumeAuto(): void { this.paused = false; }

  private startInterval(): void {
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        if (!this.paused) this.ngZone.run(() => this.next());
      }, 2000);
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => this.initParticles());
  }

  /* ── Particle system ─────────────────────────────────── */
  private initParticles(): void {
    const canvas = this.ptCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const root = canvas.parentElement as HTMLElement;

    const syncSize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    syncSize();

    const COUNT     = 75;
    const LINK_DIST = 130;    // particle-to-particle link distance
    const MOUSE_DIST = 140;   // cursor-to-particle connection distance
    const REPEL_R   = 120;    // click repulsion radius

    let mouse = { x: -9999, y: -9999 };

    const pts: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      bvx: (Math.random() - 0.5) * 0.42,
      bvy: (Math.random() - 0.5) * 0.42,
      rx: 0,
      ry: 0,
      r: 1.0 + Math.random() * 1.5,
      baseOpacity: 0.25 + Math.random() * 0.30,
      phase: Math.random() * Math.PI * 2,
    }));

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      // Normalised -1→+1 for CSS parallax vars
      root.style.setProperty('--pmx', ((mouse.x / rect.width  - 0.5) * 2).toFixed(3));
      root.style.setProperty('--pmy', ((mouse.y / rect.height - 0.5) * 2).toFixed(3));
    };
    const onMouseLeave = () => {
      mouse.x = -9999; mouse.y = -9999;
      root.style.setProperty('--pmx', '0');
      root.style.setProperty('--pmy', '0');
    };
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const p of pts) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < REPEL_R && d > 0) {
          const force = (1 - d / REPEL_R) * 5.5;
          p.rx += (dx / d) * force;
          p.ry += (dy / d) * force;
        }
      }
    };

    root.addEventListener('mousemove',  onMouseMove);
    root.addEventListener('mouseleave', onMouseLeave);
    root.addEventListener('click',      onClick);
    window.addEventListener('resize',   syncSize);

    this.cleanupAll = () => {
      root.removeEventListener('mousemove',  onMouseMove);
      root.removeEventListener('mouseleave', onMouseLeave);
      root.removeEventListener('click',      onClick);
      window.removeEventListener('resize',   syncSize);
    };

    const tick = () => {
      this.rafId = requestAnimationFrame(tick);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const t = performance.now() * 0.001;

      /* ─ Update & draw particles ─ */
      for (const p of pts) {
        p.rx *= 0.92;
        p.ry *= 0.92;
        p.x = (p.x + p.bvx + p.rx + w) % w;
        p.y = (p.y + p.bvy + p.ry + h) % h;

        const opacity = p.baseOpacity * (0.55 + 0.45 * Math.sin(t * 0.5 + p.phase));

        ctx.save();
        ctx.shadowBlur  = 10;
        ctx.shadowColor = `rgba(96,165,250,${opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${opacity})`;
        ctx.fill();
        ctx.restore();
      }

      /* ─ Particle-to-particle links ─ */
      for (let i = 0; i < pts.length - 1; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.lineWidth   = 0.6;
            ctx.strokeStyle = `rgba(96,165,250,${(1 - d / LINK_DIST) * 0.18})`;
            ctx.stroke();
          }
        }
      }

      /* ─ Mouse cursor connections ─ */
      if (mouse.x > -1000) {
        for (const p of pts) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.lineWidth   = 0.8;
            ctx.strokeStyle = `rgba(96,165,250,${(1 - d / MOUSE_DIST) * 0.45})`;
            ctx.stroke();
          }
        }
      }
    };

    tick();
  }

  /* ── Slide controls ──────────────────────────────────── */
  goTo(i: number): void {
    this.current = i;
    this.resetProgress();
  }

  next(): void {
    this.current = (this.current + 1) % this.slides.length;
    this.resetProgress();
  }

  prev(): void {
    this.current = (this.current - 1 + this.slides.length) % this.slides.length;
    this.resetProgress();
  }

  onCta(slide: Slide): void {
    if (slide.type === 'product' && slide.id) {
      this.nav.go('product-detail', slide.id as ProductKey);
    } else if (slide.navPage) {
      this.nav.go(slide.navPage);
    }
  }

  private startProgress(): void {
    setTimeout(() => { this.running = true; this.cdr.markForCheck(); }, 50);
  }

  private resetProgress(): void {
    this.running = false;
    this.cdr.markForCheck();
    setTimeout(() => { this.running = true; this.cdr.markForCheck(); }, 50);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    cancelAnimationFrame(this.rafId);
    this.cleanupAll?.();
  }
}

