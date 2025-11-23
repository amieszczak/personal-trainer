import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';

interface MenuItem {
  id: string;
  label: string;
  isCta?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule],
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
  
  constructor(private scrollService: ScrollService) {}

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

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.scrollService.scrollToSection(sectionId);
    // Close mobile menu after navigation
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }
}
