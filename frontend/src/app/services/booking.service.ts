import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Completed = 2,
  Cancelled = 3
}

export interface Booking {
  id: number;
  clientId: number;
  trainingId: number;
  bookingDate: Date;
  createdAt: Date;
  status: BookingStatus;
  notes?: string;
}

export interface CreateBookingDto {
  clientId: number;
  trainingId: number;
  bookingDate: Date;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  /**
   * Get all bookings
   */
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  /**
   * Get a booking by ID
   */
  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get bookings for a specific client
   */
  getBookingsByClient(clientId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/client/${clientId}`);
  }

  /**
   * Get upcoming bookings
   */
  getUpcomingBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/upcoming`);
  }

  /**
   * Create a new booking
   */
  createBooking(booking: CreateBookingDto): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  /**
   * Update booking status
   */
  updateBookingStatus(id: number, status: BookingStatus): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}/status`, status);
  }

  /**
   * Cancel a booking
   */
  cancelBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

