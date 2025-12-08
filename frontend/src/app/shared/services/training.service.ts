import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  getAllTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl);
  }

  getTrainingById(id: number): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/${id}`);
  }

  getTrainingsByCategory(category: string): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/category/${category}`);
  }

  createTraining(training: CreateTrainingDto): Observable<Training> {
    return this.http.post<Training>(this.apiUrl, training);
  }

  updateTraining(id: number, training: CreateTrainingDto): Observable<Training> {
    return this.http.put<Training>(`${this.apiUrl}/${id}`, training);
  }

  deleteTraining(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

