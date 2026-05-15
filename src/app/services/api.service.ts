import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// ─── Response Types ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: { total: number; page: number; limit: number; totalPages: number };
}

export interface Company {
  _id: string;
  companyName: string;
  CIN: string;
  PAN: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  tagline?: string;
}

export interface Fund {
  _id: string;
  fundName: string;
  category: string;
  risk: 'Low' | 'Moderate' | 'High' | 'Very High';
  returns: string;
  description: string;
  minSIP: number;
  isFeatured: boolean;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface LiveGpsStats {
  vehiclesOnline: number;
  tripsTracked: number;
  smartAlerts: number;
  citiesCovered: number;
  updatedAt: string;
}

export type EnquirySource =
  | 'contact-form'
  | 'lead-modal'
  | 'gps-enquiry'
  | 'mf-enquiry'
  | 'fastag-enquiry'
  | 'drone-enquiry'
  | 'insurance-enquiry'
  | 'ai-enquiry'
  | 'other';

export type ProductCategory = 'gps' | 'mf' | 'insurance' | 'ai' | 'fastag' | 'other';

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: EnquirySource;
  productCategory?: ProductCategory;
}

export interface ProductEnquiryPayload {
  name: string;
  email: string;
  phone: string;
  productCategory: ProductCategory;
  // GPS / FASTag fields
  company?:      string;
  fleetSize?:    string;
  businessType?: string;
  requirement?:  string;
  // MF fields
  budget?:          string;
  goal?:            string;
  experience?:      string;
  riskPreference?:  string;
  // Insurance / AI / Other
  message?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ApiService {

  private readonly BASE = environment.apiUrl;
  private http = inject(HttpClient);

  // ── Auth header ─────────────────────────────────────────────────────────────
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('nviq_token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 🏢 Company
  // ─────────────────────────────────────────────────────────────────────────

  getCompany(): Observable<ApiResponse<Company>> {
    return this.http.get<ApiResponse<Company>>(`${this.BASE}/company`)
      .pipe(catchError(this.handleError));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 📊 Mutual Funds
  // ─────────────────────────────────────────────────────────────────────────

  getFunds(params?: { page?: number; limit?: number; category?: string; risk?: string }): Observable<ApiResponse<Fund[]>> {
    let p = new HttpParams();
    if (params?.page)     p = p.set('page',     params.page.toString());
    if (params?.limit)    p = p.set('limit',    params.limit.toString());
    if (params?.category) p = p.set('category', params.category);
    if (params?.risk)     p = p.set('risk',     params.risk);

    return this.http.get<ApiResponse<Fund[]>>(`${this.BASE}/funds`, { params: p })
      .pipe(catchError(this.handleError));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 💼 Services
  // ─────────────────────────────────────────────────────────────────────────

  getServices(): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(`${this.BASE}/services`)
      .pipe(catchError(this.handleError));
  }

  getLiveGpsStats(): Observable<ApiResponse<LiveGpsStats>> {
    return this.http.get<ApiResponse<LiveGpsStats>>(`${this.BASE}/live-stats/gps`)
      .pipe(catchError(this.handleError));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 📩 Contact Form
  // ─────────────────────────────────────────────────────────────────────────

  submitContact(payload: ContactPayload): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.BASE}/contact`,
      payload
    ).pipe(catchError(this.handleError));
  }

  submitProductEnquiry(payload: ProductEnquiryPayload): Observable<{ success: boolean; message: string }> {
    const sourceMap: Record<ProductCategory, EnquirySource> = {
      gps:       'gps-enquiry',
      mf:        'mf-enquiry',
      fastag:    'fastag-enquiry',
      insurance: 'insurance-enquiry',
      ai:        'ai-enquiry',
      other:     'other',
    };
    const labelMap: Record<ProductCategory, string> = {
      gps:       'GPS Fleet Tracking',
      mf:        'Mutual Fund Investment',
      fastag:    'FASTag Fleet',
      insurance: 'Insurance',
      ai:        'AI Tools',
      other:     'General Enquiry',
    };

    const cat = payload.productCategory;
    const source = sourceMap[cat] ?? 'lead-modal';
    const label  = labelMap[cat]  ?? 'Product';

    let parts: string[] = [`[${label} Enquiry]`];
    if (cat === 'gps' || cat === 'fastag') {
      if (payload.company)      parts.push(`Company: ${payload.company}`);
      if (payload.businessType) parts.push(`Business Type: ${payload.businessType}`);
      if (payload.fleetSize)    parts.push(`Fleet Size: ${payload.fleetSize}`);
      if (payload.requirement)  parts.push(`Requirement: ${payload.requirement}`);
    }
    if (cat === 'mf') {
      if (payload.budget)         parts.push(`Budget: ${payload.budget}`);
      if (payload.goal)           parts.push(`Goal: ${payload.goal}`);
      if (payload.experience)     parts.push(`Experience: ${payload.experience}`);
      if (payload.riskPreference) parts.push(`Risk: ${payload.riskPreference}`);
    }
    if (payload.message) parts.push(payload.message);

    const extraData: Record<string, string> = {};
    if (payload.company)      extraData['company']      = payload.company;
    if (payload.businessType) extraData['businessType'] = payload.businessType;
    if (payload.fleetSize)    extraData['fleetSize']    = payload.fleetSize;
    if (payload.requirement)  extraData['requirement']  = payload.requirement;
    if (payload.budget)       extraData['budget']       = payload.budget;
    if (payload.goal)         extraData['goal']         = payload.goal;
    if (payload.experience)   extraData['experience']   = payload.experience;
    if (payload.riskPreference) extraData['riskPreference'] = payload.riskPreference;

    return this.http.post<{ success: boolean; message: string }>(
      `${this.BASE}/contact`,
      {
        name: payload.name, email: payload.email, phone: payload.phone,
        message: parts.join(' | '),
        source, productCategory: cat, extraData,
      },
    ).pipe(catchError(this.handleError));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 🔐 Auth
  // ─────────────────────────────────────────────────────────────────────────

  login(email: string, password: string): Observable<{ success: boolean; token: string; data: any }> {
    return this.http.post<{ success: boolean; token: string; data: any }>(
      `${this.BASE}/auth/login`,
      { email, password }
    ).pipe(
      map(res => {
        if (res.token) localStorage.setItem('nviq_token', res.token);
        return res;
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('nviq_token');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ⚙️ Error handler
  // ─────────────────────────────────────────────────────────────────────────

  private handleError(error: any): Observable<never> {
    const msg =
      error?.error?.message ||
      error?.error?.errors?.[0]?.msg ||
      error?.message ||
      'Something went wrong. Please try again.';
    console.error('API Error:', msg);
    return throwError(() => new Error(msg));
  }
}
