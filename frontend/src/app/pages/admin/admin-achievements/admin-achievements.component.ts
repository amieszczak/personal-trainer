import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Achievement, AchievementService, CreateAchievementDto } from '../../../shared/services/achievement.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-admin-achievements',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-achievements.component.html',
  styleUrl: './admin-achievements.component.scss'
})
export class AdminAchievementsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private achievementService = inject(AchievementService);
  private router = inject(Router);
  
  achievementForm: FormGroup;
  isLoading = false;
  isLoadingData = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.achievementForm = this.fb.group({
      achievements: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadAchievements();
  }

  get achievementsArray(): FormArray {
    return this.achievementForm.get('achievements') as FormArray;
  }

  loadAchievements(): void {
    this.isLoadingData = true;
    this.errorMessage = '';
    this.achievementService.getAllAchievements().subscribe({
      next: (achievements) => {
        this.isLoadingData = false;
        this.achievementsArray.clear();
        if (achievements && achievements.length > 0) {
          achievements.forEach(achievement => {
            this.achievementsArray.push(this.createAchievementFormGroup(achievement));
          });
        } else {
          this.achievementsArray.push(this.createAchievementFormGroup());
        }
      },
      error: (error) => {
        this.isLoadingData = false;
        this.errorMessage = 'Failed to load achievements. Please try again.';
        console.error('Error loading achievements:', error);
        this.achievementsArray.push(this.createAchievementFormGroup());
      }
    });
  }

  createAchievementFormGroup(achievement?: Achievement): FormGroup {
    return this.fb.group({
      id: [achievement?.id || null],
      title: [achievement?.title || '', Validators.required],
      description: [achievement?.description || '', Validators.required]
    });
  }

  addAchievement(): void {
    this.achievementsArray.push(this.createAchievementFormGroup());
  }

  onSubmit(): void {
    if (this.achievementForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const updateObservables: Observable<Achievement>[] = [];
      const createObservables: Observable<Achievement>[] = [];
      let updateCount = 0;
      let createCount = 0;

      this.achievementsArray.controls.forEach(control => {
        const id = control.get('id')?.value;
        const achievementData: CreateAchievementDto = {
          title: control.get('title')?.value || '',
          description: control.get('description')?.value || ''
        };

        if (id) {
          updateCount++;
          updateObservables.push(
            this.achievementService.updateAchievement(id, achievementData)
          );
        } else {
          createCount++;
          createObservables.push(
            this.achievementService.createAchievement(achievementData)
          );
        }
      });

      const allObservables: Observable<Achievement>[] = [...updateObservables, ...createObservables];

      if (allObservables.length === 0) {
        this.isLoading = false;
        return;
      }

      forkJoin(allObservables).subscribe({
        next: () => {
          this.isLoading = false;
          const messages: string[] = [];
          if (updateCount > 0) {
            messages.push(`Updated ${updateCount} achievement(s)`);
          }
          if (createCount > 0) {
            messages.push(`Created ${createCount} achievement(s)`);
          }
          this.successMessage = messages.join(' and ') + '!';
          
          this.loadAchievements();
          
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          this.isLoading = false;
          let errorMsg = 'An error occurred while saving achievements. Please try again.';
          
          if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.message) {
            errorMsg = error.message;
          } else if (typeof error.error === 'string') {
            errorMsg = error.error;
          }
          
          this.errorMessage = errorMsg;
          console.error('Error saving achievements:', error);
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    } else {
      this.markFormGroupTouched(this.achievementForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-panel']);
  }
}
