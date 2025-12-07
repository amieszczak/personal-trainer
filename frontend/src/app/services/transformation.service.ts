import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Transformation {
  id: number;
  name: string;
  age: number;
  description: string;
  story: string;
  quote: string;
  image?: string;
}

export interface CreateTransformationDto {
  name: string;
  age: number;
  description: string;
  story: string;
  quote: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransformationService {
  private readonly apiUrl = `${environment.apiUrl}/transformations`;

  constructor(private http: HttpClient) {}

  /**
   * Get all transformations
   */
  getAllTransformations(): Observable<Transformation[]> {
    return this.http.get<Transformation[]>(this.apiUrl);
  }

  /**
   * Get a transformation by ID
   */
  getTransformationById(id: number): Observable<Transformation> {
    return this.http.get<Transformation>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get featured transformations
   */
  getFeaturedTransformations(): Observable<Transformation[]> {
    return this.http.get<Transformation[]>(`${this.apiUrl}/featured`);
  }

  /**
   * Create a new transformation
   */
  createTransformation(transformation: CreateTransformationDto): Observable<Transformation> {
    return this.http.post<Transformation>(this.apiUrl, transformation);
  }

  /**
   * Update an existing transformation
   */
  updateTransformation(id: number, transformation: CreateTransformationDto): Observable<Transformation> {
    return this.http.put<Transformation>(`${this.apiUrl}/${id}`, transformation);
  }

  /**
   * Delete a transformation
   */
  deleteTransformation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

