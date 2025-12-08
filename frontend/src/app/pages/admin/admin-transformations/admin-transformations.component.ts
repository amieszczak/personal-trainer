import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { TransformationService, CreateTransformationDto, Transformation } from '../../../shared/services/transformation.service';

@Component({
  selector: 'app-admin-transformations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-transformations.component.html',
  styleUrls: ['./admin-transformations.component.scss']
})
export class AdminTransformationsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private transformationService = inject(TransformationService);
  private router = inject(Router);

  transformationsForm: FormGroup;
  isLoading = false;
  isLoadingData = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.transformationsForm = this.fb.group({
      transformations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadTransformations();
  }

  get transformationsArray(): FormArray {
    return this.transformationsForm.get('transformations') as FormArray;
  }

  createTransformationFormGroup(transformation?: Transformation): FormGroup {
    return this.fb.group({
      id: [transformation?.id || null],
      name: [transformation?.name || '', [Validators.required]],
      age: [transformation?.age || '', [Validators.required, Validators.min(1), Validators.max(150)]],
      description: [transformation?.description || '', [Validators.required]],
      story: [transformation?.story || '', [Validators.required]],
      quote: [transformation?.quote || '', [Validators.required]],
      image: [transformation?.image || '']
    });
  }

  loadTransformations(): void {
    this.isLoadingData = true;
    this.errorMessage = '';
    
    this.transformationService.getAllTransformations().subscribe({
      next: (transformations) => {
        this.isLoadingData = false;
        this.transformationsArray.clear();
        
        if (transformations && transformations.length > 0) {
          transformations.forEach(transformation => {
            this.transformationsArray.push(this.createTransformationFormGroup(transformation));
          });
        } else {
          this.transformationsArray.push(this.createTransformationFormGroup());
        }
      },
      error: (error) => {
        this.isLoadingData = false;
        this.errorMessage = 'Failed to load transformations. Please try again.';
        console.error('Error loading transformations:', error);
        this.transformationsArray.push(this.createTransformationFormGroup());
      }
    });
  }

  addTransformation(): void {
    this.transformationsArray.push(this.createTransformationFormGroup());
  }

  removeTransformation(index: number): void {
    const formGroup = this.transformationsArray.at(index);
    const id = formGroup.get('id')?.value;
    
    if (id) {
      if (confirm('Are you sure you want to delete this transformation? This action cannot be undone.')) {
        this.isLoading = true;
        this.transformationService.deleteTransformation(id).subscribe({
          next: () => {
            this.transformationsArray.removeAt(index);
            this.isLoading = false;
            this.successMessage = 'Transformation deleted successfully!';
            setTimeout(() => {
              this.successMessage = '';
            }, 5000);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Failed to delete transformation. Please try again.';
            console.error('Error deleting transformation:', error);
            setTimeout(() => {
              this.errorMessage = '';
            }, 5000);
          }
        });
      }
    } else {
      if (this.transformationsArray.length > 1) {
        this.transformationsArray.removeAt(index);
      }
    }
  }

  onSubmit(): void {
    if (this.transformationsForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const updateObservables: Observable<Transformation>[] = [];
      const createDtos: CreateTransformationDto[] = [];
      let updateCount = 0;
      let createCount = 0;

      this.transformationsArray.controls.forEach(control => {
        const id = control.get('id')?.value;
        const transformationData: CreateTransformationDto = {
          name: control.get('name')?.value || '',
          age: parseInt(control.get('age')?.value || '0', 10),
          description: control.get('description')?.value || '',
          story: control.get('story')?.value || '',
          quote: control.get('quote')?.value || '',
          image: control.get('image')?.value || undefined
        };

        if (id) {
          updateCount++;
          updateObservables.push(
            this.transformationService.updateTransformation(id, transformationData)
          );
        } else {
          createCount++;
          createDtos.push(transformationData);
        }
      });

      const allObservables: Observable<Transformation | Transformation[]>[] = [...updateObservables];
      
      if (createDtos.length > 0) {
        allObservables.push(
          this.transformationService.createBulkTransformations(createDtos)
        );
      }

      if (allObservables.length === 0) {
        this.isLoading = false;
        return;
      }

      forkJoin(allObservables).subscribe({
        next: () => {
          this.isLoading = false;
          const messages: string[] = [];
          if (updateCount > 0) {
            messages.push(`Updated ${updateCount} transformation(s)`);
          }
          if (createCount > 0) {
            messages.push(`Created ${createCount} transformation(s)`);
          }
          this.successMessage = messages.join(' and ') + '!';
          
          this.loadTransformations();
          
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          this.isLoading = false;
          let errorMsg = 'An error occurred while saving transformations. Please try again.';
          
          if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.message) {
            errorMsg = error.message;
          } else if (typeof error.error === 'string') {
            errorMsg = error.error;
          }
          
          this.errorMessage = errorMsg;
          console.error('Error saving transformations:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.transformationsForm);
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
