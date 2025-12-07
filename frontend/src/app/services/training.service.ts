import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Training {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  category: string;
  isAvailable: boolean;
}

export interface CreateTrainingDto {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private readonly apiUrl = `${environment.apiUrl}/trainings`;

  constructor(private http: HttpClient) {}

  /**
   * Get all available trainings
   */
  getAllTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl);
  }

  /**
   * Get a training by ID
   */
  getTrainingById(id: number): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get trainings by category
   */
  getTrainingsByCategory(category: string): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Create a new training
   */
  createTraining(training: CreateTrainingDto): Observable<Training> {
    return this.http.post<Training>(this.apiUrl, training);
  }

  /**
   * Update an existing training
   */
  updateTraining(id: number, training: CreateTrainingDto): Observable<Training> {
    return this.http.put<Training>(`${this.apiUrl}/${id}`, training);
  }

  /**
   * Delete a training (soft delete)
   */
  deleteTraining(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

