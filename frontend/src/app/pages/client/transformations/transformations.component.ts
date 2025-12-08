import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransformationService, Transformation } from '../../../shared/services/transformation.service';

@Component({
  selector: 'app-transformations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transformations.component.html',
  styleUrl: './transformations.component.scss'
})
export class TransformationsComponent implements OnInit, OnDestroy {
  transformations: Transformation[] = [];

  currentIndex = 1;
  slidesVisible = 3;
  translateX = 0;
  isTransitioning = false;
  
  private touchStartX = 0;
  private touchEndX = 0;

  constructor(private transformationService: TransformationService) {}

  get allSlides(): Transformation[] {
    if (this.transformations.length === 0) return [];
    const lastSlide = this.transformations[this.transformations.length - 1];
    const firstSlide = this.transformations[0];
    return [lastSlide, ...this.transformations, firstSlide];
  }

  ngOnInit(): void {
    this.loadTransformations();
    this.updateSlidesVisible();
    this.updateSliderPosition();
  }

  private loadTransformations(): void {
    this.transformationService.getAllTransformations().subscribe({
      next: (data) => {
        this.transformations = data;
        this.updateSliderPosition();
      },
      error: (error) => {
        console.error('Error loading transformations:', error);
      }
    });
  }

  ngOnDestroy(): void {
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSlidesVisible();
    this.updateSliderPosition();
  }

  private updateSlidesVisible(): void {
    const width = window.innerWidth;
    if (width >= 1024) {
      this.slidesVisible = 3;
    } else {
      this.slidesVisible = 2;
    }
  }

  private updateSliderPosition(instant: boolean = false): void {
    this.isTransitioning = !instant;
    
    const slideWidth = 100 / this.slidesVisible;
    
    if (this.slidesVisible === 3) {
      this.translateX = -(this.currentIndex * slideWidth) + 50 - (slideWidth / 2);
    } else {
      this.translateX = -(this.currentIndex * slideWidth) + 50 - (slideWidth / 2);
    }

    if (instant) {
      setTimeout(() => {
        this.isTransitioning = true;
      }, 50);
    }
  }

  nextSlide(): void {
    this.currentIndex++;
    this.updateSliderPosition();

    if (this.currentIndex === this.allSlides.length - 1) {
      setTimeout(() => {
        this.currentIndex = 1;
        this.updateSliderPosition(true);
      }, 500);
    }
  }

  previousSlide(): void {
    this.currentIndex--;
    this.updateSliderPosition();

    if (this.currentIndex === 0) {
      setTimeout(() => {
        this.currentIndex = this.transformations.length;
        this.updateSliderPosition(true);
      }, 500);
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = index + 1;
    this.updateSliderPosition();
  }

  getActualIndex(index: number): number {
    if (index === 0) return this.transformations.length - 1; 
    if (index === this.allSlides.length - 1) return 0; 
    return index - 1; 
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }
}

