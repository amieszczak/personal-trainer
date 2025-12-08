import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  getAllTransformations(): Observable<Transformation[]> {
    return this.http.get<Transformation[]>(this.apiUrl);
  }

  getTransformationById(id: number): Observable<Transformation> {
    return this.http.get<Transformation>(`${this.apiUrl}/${id}`);
  }

  getFeaturedTransformations(): Observable<Transformation[]> {
    return this.http.get<Transformation[]>(`${this.apiUrl}/featured`);
  }

  createTransformation(transformation: CreateTransformationDto): Observable<Transformation> {
    return this.http.post<Transformation>(this.apiUrl, transformation);
  }

  createBulkTransformations(transformations: CreateTransformationDto[]): Observable<Transformation[]> {
    return this.http.post<Transformation[]>(`${this.apiUrl}/bulk`, transformations);
  }

  updateTransformation(id: number, transformation: CreateTransformationDto): Observable<Transformation> {
    return this.http.put<Transformation>(`${this.apiUrl}/${id}`, transformation);
  }

  deleteTransformation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

