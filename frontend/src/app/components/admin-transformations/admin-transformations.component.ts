import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransformationService, CreateTransformationDto } from '../../services/transformation.service';

@Component({
  selector: 'app-admin-transformations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-transformations.component.html',
  styleUrls: ['./admin-transformations.component.scss']
})
export class AdminTransformationsComponent {
  private fb = inject(FormBuilder);
  private transformationService = inject(TransformationService);
  private router = inject(Router);

  transformationsForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.transformationsForm = this.fb.group({
      transformations: this.fb.array([this.createTransformationFormGroup()])
    });
  }

  get transformationsArray(): FormArray {
    return this.transformationsForm.get('transformations') as FormArray;
  }

  createTransformationFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(150)]],
      description: ['', [Validators.required]],
      story: ['', [Validators.required]],
      quote: ['', [Validators.required]],
      image: ['']
    });
  }

  addTransformation(): void {
    this.transformationsArray.push(this.createTransformationFormGroup());
  }

  removeTransformation(index: number): void {
    if (this.transformationsArray.length > 1) {
      this.transformationsArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.transformationsForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const transformations: CreateTransformationDto[] = this.transformationsArray.controls.map(control => ({
        name: control.get('name')?.value || '',
        age: parseInt(control.get('age')?.value || '0', 10),
        description: control.get('description')?.value || '',
        story: control.get('story')?.value || '',
        quote: control.get('quote')?.value || '',
        image: control.get('image')?.value || undefined
      }));

      this.transformationService.createBulkTransformations(transformations).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = `Successfully created ${response.length} transformation(s)!`;
          this.transformationsForm.reset();
          this.transformationsArray.clear();
          this.transformationsArray.push(this.createTransformationFormGroup());
          
          // Clear success message after 5 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          this.isLoading = false;
          let errorMsg = 'An error occurred while creating transformations. Please try again.';
          
          if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.message) {
            errorMsg = error.message;
          } else if (typeof error.error === 'string') {
            errorMsg = error.error;
          }
          
          this.errorMessage = errorMsg;
          console.error('Error creating transformations:', error);
          console.error('Full error object:', JSON.stringify(error, null, 2));
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
