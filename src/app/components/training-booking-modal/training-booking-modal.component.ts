import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-training-booking-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './training-booking-modal.component.html',
  styleUrl: './training-booking-modal.component.scss'
})
export class TrainingBookingModalComponent implements OnInit {
  bookingForm!: FormGroup;
  minDate: Date;
  availableTimes: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TrainingBookingModalComponent>
  ) {
    // Set minimum date to today
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      message: [''],
      termsAccepted: [false, Validators.requiredTrue],
      privacyAccepted: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      // In a real application, this would send data to a backend
      console.log('Booking submitted:', this.bookingForm.value);
      
      // Show success message (dummy implementation)
      alert('Dziękujemy! Twoja rezerwacja została przyjęta. Skontaktujemy się z Tobą wkrótce.');
      
      // Close the dialog
      this.dialogRef.close(this.bookingForm.value);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDatePickerClosed(): void {
    // Ensure the date is properly set in the form control
    const dateControl = this.bookingForm.get('date');
    if (dateControl?.value) {
      // Mark as touched to trigger validation if needed
      dateControl.markAsTouched();
      console.log('Date selected:', dateControl.value);
    }
  }

  // Helper methods for form validation
  getErrorMessage(fieldName: string): string {
    const control = this.bookingForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return 'To pole jest wymagane';
    }
    
    if (control?.hasError('email')) {
      return 'Proszę podać prawidłowy adres email';
    }
    
    if (control?.hasError('pattern')) {
      return 'Proszę podać prawidłowy numer telefonu (9-15 cyfr)';
    }
    
    if (control?.hasError('minlength')) {
      return `Minimum ${control.errors?.['minlength'].requiredLength} znaki`;
    }
    
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.bookingForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
