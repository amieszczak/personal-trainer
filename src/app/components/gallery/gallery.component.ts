import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryImage {
  id: number;
  filename: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit, OnDestroy {
  galleryImages: GalleryImage[] = [
    {
      id: 1,
      filename: 'Angelika.png',
      name: 'Angelika',
      description: 'Trening funkcjonalny z naciskiem na wytrzymałość'
    },
    {
      id: 2,
      filename: 'Anna.png',
      name: 'Anna',
      description: 'Sesja treningowa z obciążeniami wolnymi'
    },
    {
      id: 3,
      filename: 'Antoni.png',
      name: 'Antoni',
      description: 'Trening siłowy - budowa masy mięśniowej'
    },
    {
      id: 4,
      filename: 'Ewa.png',
      name: 'Ewa',
      description: 'Ćwiczenia cardio i kondycyjne'
    },
    {
      id: 5,
      filename: 'Gabrysia.png',
      name: 'Gabrysia',
      description: 'Trening mobilności i elastyczności'
    },
    {
      id: 6,
      filename: 'Hania.png',
      name: 'Hania',
      description: 'Sesja z kettlebell - trening całego ciała'
    },
    {
      id: 7,
      filename: 'Jacek.png',
      name: 'Jacek',
      description: 'Trening wytrzymałościowy z elementami HIIT'
    },
    {
      id: 8,
      filename: 'Kasia.png',
      name: 'Kasia',
      description: 'Trening core i stabilizacji'
    },
    {
      id: 9,
      filename: 'Marek.png',
      name: 'Marek',
      description: 'Martwy ciąg - technika i wykonanie'
    },
    {
      id: 10,
      filename: 'Mateusz.png',
      name: 'Mateusz',
      description: 'Trening siłowy górnych partii mięśniowych'
    },
    {
      id: 11,
      filename: 'Michał.png',
      name: 'Michał',
      description: 'Przysiady z ciężarem - prawidłowa forma'
    },
    {
      id: 12,
      filename: 'Monika.png',
      name: 'Monika',
      description: 'Trening dolnych partii mięśniowych'
    },
    {
      id: 13,
      filename: 'Przemek.png',
      name: 'Przemek',
      description: 'Trening funkcjonalny z TRX'
    },
    {
      id: 14,
      filename: 'Robert.png',
      name: 'Robert',
      description: 'Sesja rzeźbiąca - definicja mięśni'
    },
    {
      id: 15,
      filename: 'Weronika.png',
      name: 'Weronika',
      description: 'Trening interwałowy wysokiej intensywności'
    },
    {
      id: 16,
      filename: 'Wojciech.png',
      name: 'Wojciech',
      description: 'Trening siłowo-wytrzymałościowy'
    }
  ];

  currentIndex = 1; // Start at 1 because we'll add a clone at the beginning
  slidesVisible = 2;
  translateX = 0;
  isTransitioning = false;
  private autoplayInterval: any;
  private touchStartX = 0;
  private touchEndX = 0;

  // Get all slides including clones
  get allSlides(): GalleryImage[] {
    const lastSlide = this.galleryImages[this.galleryImages.length - 1];
    const firstSlide = this.galleryImages[0];
    return [lastSlide, ...this.galleryImages, firstSlide];
  }

  get selectedImage(): GalleryImage {
    return this.galleryImages[this.getActualIndex(this.currentIndex)];
  }

  ngOnInit(): void {
    this.updateSlidesVisible();
    this.updateSliderPosition();
    if (this.isMobile()) {
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSlidesVisible();
    this.updateSliderPosition();
    
    // Start/stop autoplay based on screen size
    if (this.isMobile()) {
      if (!this.autoplayInterval) {
        this.startAutoplay();
      }
    } else {
      this.stopAutoplay();
    }
  }

  private isMobile(): boolean {
    return window.innerWidth < 768;
  }

  private updateSlidesVisible(): void {
    const width = window.innerWidth;
    if (width >= 1024) {
      this.slidesVisible = 2;
    } else if (width >= 768) {
      this.slidesVisible = 2;
    } else {
      this.slidesVisible = 1;
    }
  }

  private updateSliderPosition(instant: boolean = false): void {
    this.isTransitioning = !instant;
    
    const slideWidth = 100 / this.slidesVisible;
    this.translateX = -(this.currentIndex * slideWidth) + 50 - (slideWidth / 2);

    if (instant) {
      setTimeout(() => {
        this.isTransitioning = true;
      }, 50);
    }
  }

  nextSlide(): void {
    this.stopAutoplay();
    this.currentIndex++;
    this.updateSliderPosition();

    if (this.currentIndex === this.allSlides.length - 1) {
      setTimeout(() => {
        this.currentIndex = 1;
        this.updateSliderPosition(true);
      }, 500);
    }
    if (this.isMobile()) {
      this.startAutoplay();
    }
  }

  previousSlide(): void {
    this.stopAutoplay();
    this.currentIndex--;
    this.updateSliderPosition();

    if (this.currentIndex === 0) {
      setTimeout(() => {
        this.currentIndex = this.galleryImages.length;
        this.updateSliderPosition(true);
      }, 500);
    }
    if (this.isMobile()) {
      this.startAutoplay();
    }
  }

  goToSlide(index: number): void {
    if (this.isMobile()) {
      this.stopAutoplay();
    }
    this.currentIndex = index + 1;
    this.updateSliderPosition();
    if (this.isMobile()) {
      this.startAutoplay();
    }
  }

  getActualIndex(index: number): number {
    if (index === 0) return this.galleryImages.length - 1;
    if (index === this.allSlides.length - 1) return 0;
    return index - 1;
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  private stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
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

