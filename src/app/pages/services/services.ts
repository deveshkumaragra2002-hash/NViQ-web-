import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent {
  private nav = inject(NavService);

  openModal(): void {
    this.nav.openModalFor('gps');
  }
  services = [
    {
      emoji: '📍',
      color: '#38bdf8',
      title: 'Live GPS Tracking',
      subtitle: 'Real-time · 5-second refresh',
      desc: 'Track every vehicle on a live map with 5-second position updates. Know exactly where your fleet is — whether it\'s one truck or five hundred. Includes historical replay, route deviation alerts, and custom map layers.',
      features: ['5-second GPS refresh rate', 'Historical route replay (90 days)', 'Multi-vehicle dashboard view', 'Mobile app for managers', 'Offline data buffering', 'Indian map support (HERE Maps)'],
      stat: '248', statLabel: 'vehicles tracked live'
    },
    {
      emoji: '🧠',
      color: '#a78bfa',
      title: 'Driver Behavior Analytics',
      subtitle: 'Scoring · Coaching · Accountability',
      desc: 'Comprehensive driver scoring based on speed compliance, harsh braking, rapid acceleration, cornering, and idle time. Give drivers real feedback and watch your accident rate and fuel bill drop.',
      features: ['Composite driver score (0–100)', 'Harsh braking & acceleration detection', 'Speeding violation logs', 'Idle time per driver', 'Weekly ranking leaderboard', 'Driver coaching reports'],
      stat: '87.4', statLabel: 'avg driver score'
    },
    {
      emoji: '🔔',
      color: '#f59e0b',
      title: 'Smart Alert System',
      subtitle: 'Instant · Configurable · Actionable',
      desc: 'Get notified the moment something goes wrong — overspeed, geofence breach, engine idle, unauthorized movement, or low battery. Alerts arrive via WhatsApp, SMS, email, or push notification.',
      features: ['Overspeed alerts (configurable threshold)', 'Geofence entry/exit alerts', 'Engine idle > N minutes', 'After-hours vehicle movement', 'Battery voltage alerts', 'WhatsApp/SMS/Email delivery'],
      stat: '34', statLabel: 'alerts managed today'
    },
    {
      emoji: '📊',
      color: '#22c55e',
      title: 'Automated Reporting',
      subtitle: 'Daily · Weekly · Custom',
      desc: 'Professionally formatted PDF reports delivered to your inbox automatically. Daily trip summaries, weekly fleet performance, monthly cost analysis — all scheduled and sent without any manual effort.',
      features: ['Daily/weekly/monthly schedules', 'PDF & Excel export formats', 'Per-driver performance reports', 'Fleet cost analysis reports', 'Custom branded reports', 'Multi-recipient delivery'],
      stat: '1,240', statLabel: 'reports sent this month'
    },
    {
      emoji: '💬',
      color: '#25d366',
      title: 'WhatsApp Integration',
      subtitle: 'No App · Instant · Manager-friendly',
      desc: 'Send route summaries, alert digests, and daily fleet status directly to managers on WhatsApp. No app downloads required. Works on basic smartphones. Perfect for on-field supervisors.',
      features: ['Automatic trip summary on WhatsApp', 'Alert notifications via WhatsApp', 'Daily fleet digest at 9 AM', 'Custom message templates', 'Multiple manager recipients', 'Two-way query support (coming soon)'],
      stat: '340+', statLabel: 'businesses use WhatsApp alerts'
    },
    {
      emoji: '⛽',
      color: '#f43f5e',
      title: 'Fuel Intelligence',
      subtitle: 'Anomaly Detection · Cost Savings',
      desc: 'Detect suspicious fuel consumption patterns automatically. Flag sudden drops (possible theft), excessive idle consumption, and inefficient routes. Our customers save an average of 22% on fuel within 3 months.',
      features: ['Consumption anomaly detection', 'Idle fuel cost calculation', 'Route efficiency scoring', 'Monthly fuel savings report', 'Driver-wise fuel comparison', 'Refueling event tracking'],
      stat: '₹2.4Cr', statLabel: 'saved by our clients'
    }
  ];
}