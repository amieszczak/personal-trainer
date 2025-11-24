import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ScrollService } from '../../services/scroll.service';
import { TrainingBookingModalComponent } from '../training-booking-modal/training-booking-modal.component';

interface MenuItem {
  id: string;
  label: string;
  isCta?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolledFromTop = false;
  isMobileMenuOpen = false;

  menuItems: MenuItem[] = [
    { id: 'osiagniecia', label: 'Osiągnięcia' },
    { id: 'przemiany', label: 'Przemiany' },
    { id: 'galeria', label: 'Galeria' },
    { id: 'o-mnie', label: 'O mnie' },
    { id: 'umow-trening', label: 'Umów trening', isCta: true },
    { id: 'kontakt', label: 'Kontakt' }
  ];
  
  constructor(
    private scrollService: ScrollService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkScrollPosition();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    // Consider "at top" if scrolled less than 50px
    this.isScrolledFromTop = window.scrollY > 50;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Prevent body scroll when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  handleMenuClick(sectionId: string, event: Event): void {
    event.preventDefault();
    
    // Open modal for booking
    if (sectionId === 'umow-trening') {
      this.openBookingModal();
    } else {
      // Scroll to section for other menu items
      this.scrollService.scrollToSection(sectionId);
    }
    
    // Close mobile menu after action
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  openBookingModal(): void {
    const dialogRef = this.dialog.open(TrainingBookingModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: ['booking-modal-dialog'],
      disableClose: false,
      autoFocus: true,
      hasBackdrop: true,
      backdropClass: ['booking-modal-backdrop'],
      position: {
        top: '50px'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Booking confirmed:', result);
        // Handle the booking result if needed
      }
    });
  }

  // Keep old method for backward compatibility if needed elsewhere
  scrollToSection(sectionId: string, event: Event): void {
    this.handleMenuClick(sectionId, event);
  }
}
