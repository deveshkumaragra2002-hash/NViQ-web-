# NViQ Angular — Full React → Angular Conversion

This is the complete Angular 17 conversion of the **NViQ** GPS Fleet Tracking landing page, originally built in React/Vite.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm start
# or
ng serve
```
Open: http://localhost:4200

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── main.ts                        # Bootstrap entry point
├── index.html                     # Root HTML
├── styles.css                     # Global styles (Tailwind)
└── app/
    ├── app.component.ts           # Root component (replaces App.tsx)
    ├── app.config.ts              # App providers
    └── components/
        ├── navbar/                # Navbar with scroll tracking + Ask Me modal
        ├── hero/                  # Hero with animated canvas fleet tracking
        ├── problem/               # Problem section with stat cards
        ├── before-after/          # Before/After comparison
        ├── features/              # Features with canvas animations
        ├── live-tracking/         # Live demo dashboard with map canvas
        ├── reviews/               # Reviews feed + Write Review modal
        ├── pricing/               # Pricing plans
        ├── cta/                   # Call-to-action section
        ├── coming-soon/           # Coming soon cards
        ├── footer/                # Footer with links
        ├── lead-modal/            # Lead capture modal
        ├── rabbit-loader/         # Animated loading screen
        └── benefits/              # Benefits grid
```

---

## 🔄 React → Angular Migration Guide

### Key Concept Mappings

| React | Angular |
|-------|---------|
| `useState` | Component property + `ChangeDetectorRef` (or just property) |
| `useEffect` | `ngOnInit()` / `ngAfterViewInit()` / `ngOnDestroy()` |
| `useRef` | `@ViewChild('refName')` |
| `onClick` | `(click)="handler()"` |
| `onChange` | `(change)="handler($event)"` or `[(ngModel)]` |
| `className` | `class` or `[class]` / `[ngClass]` |
| `style={{ }}` | `[style.property]="value"` or `[ngStyle]` |
| `{condition && <Comp />}` | `*ngIf="condition"` |
| `{array.map(item => <li>)}` | `*ngFor="let item of array"` |
| `props` | `@Input()` decorator |
| `onEvent` (prop) | `@Output() event = new EventEmitter()` |
| `motion/react` animations | CSS transitions/animations or `@angular/animations` |
| Framer Motion `whileHover` | `:hover` CSS / `(mouseenter)` / `(mouseleave)` |
| `useCallback` | Regular method (Angular handles change detection) |
| `React.FC` | `@Component({ ... }) export class MyComponent` |
| JSX `<>...</>` fragments | `<ng-container>` |
| `children` prop | `<ng-content>` |

### Animation Strategy
The original React project used **Framer Motion** (`motion/react`). In this Angular version:
- CSS `transition` and `transform` classes replace simple hover/entry animations
- Canvas-based animations are preserved identically (they're pure JS)
- For production, consider adding `@angular/animations` for complex sequences

### Forms
- React used uncontrolled inputs / `onChange` handlers
- Angular uses `[(ngModel)]` (two-way binding) with `FormsModule`
- For complex forms, use `ReactiveFormsModule` with `FormBuilder`

### Scroll Behavior
- React used `useEffect` + `window.addEventListener`
- Angular uses `@HostListener('window:scroll')` decorator

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `@angular/core` ^17 | Angular framework |
| `@angular/animations` | Animation support |
| `@angular/forms` | Template-driven forms (ngModel) |
| `tailwindcss` ^3 | Utility CSS classes |
| `zone.js` | Angular change detection |

---

## 🎨 Design Notes

- Dark theme: `#080A12` / `#060810` / `#0F172A`
- Primary: `#3B82F6` (blue), `#06B6D4` (cyan)
- Alert: `#EF4444` (red), `#F59E0B` (amber)
- Success: `#22C55E` (green)
- Accent: `#8B5CF6` (purple)
- Font: Inter (Google Fonts)

---

## ✅ Features Converted

- [x] Animated navbar with scroll progress + section detection
- [x] Hero with full-screen canvas fleet tracking animation
- [x] Problem section with stat cards
- [x] Before/After visual comparison
- [x] Features section with canvas micro-animations (GPS pin, bell, chart)
- [x] Live tracking demo with animated map canvas + vehicle labels
- [x] Reviews section with auto-scroll feed + write review modal
- [x] Pricing plans (3-tier)
- [x] CTA section with floating tags + sticky mobile CTA
- [x] Coming Soon section
- [x] Footer
- [x] Lead capture modal with form validation
- [x] Rabbit loading screen with canvas animation + progress bar
- [x] Benefits section

---

## 🔧 Possible Enhancements

1. **Add `@angular/animations`** for smoother entry animations (replaces Framer Motion)
2. **Add routing** with `RouterModule` if you add more pages
3. **Replace `ngModel`** with `ReactiveFormsModule` for better form validation
4. **Add a service** (`FleetService`) to centralize mock data
5. **Add i18n** for multi-language support

---

Built with ❤️ — Angular 17 Standalone Components
