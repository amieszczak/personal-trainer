import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
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
  private subscriptions = new Subscription();

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
    // Fix Bug 1: Restore body overflow if mobile menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = '';
    }
    
    // Fix Bug 2: Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    this.isScrolledFromTop = window.scrollY > 50;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  handleMenuClick(sectionId: string, event: Event): void {
    event.preventDefault();
    
    if (sectionId === 'umow-trening') {
      this.openBookingModal();
    } else {
      this.scrollService.scrollToSection(sectionId);
    }
    
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

    // Store subscription to prevent memory leaks
    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Booking confirmed:', result);
        }
      })
    );
  }

  scrollToSection(sectionId: string, event: Event): void {
    this.handleMenuClick(sectionId, event);
  }
}
