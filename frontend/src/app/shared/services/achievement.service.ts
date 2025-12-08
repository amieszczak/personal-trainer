import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Achievement {
  id: number;
  title: string;
  description: string;
}

export interface CreateAchievementDto {
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private readonly apiUrl = `${environment.apiUrl}/achievements`;
  
  constructor(private http: HttpClient) { }

  getAllAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(this.apiUrl);
  }

  getAchievementById(id: number): Observable<Achievement> {
    return this.http.get<Achievement>(`${this.apiUrl}/${id}`);
  }

  createAchievement(achievement: CreateAchievementDto): Observable<Achievement> {
    return this.http.post<Achievement>(this.apiUrl, achievement);
  }

  updateAchievement(id: number, achievement: CreateAchievementDto): Observable<Achievement> {
    return this.http.put<Achievement>(`${this.apiUrl}/${id}`, achievement);
  }
}
