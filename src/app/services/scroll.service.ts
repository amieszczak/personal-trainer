import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  /**
   * Scrolls to a section smoothly by its ID
   * @param sectionId - The ID of the section to scroll to (without the # prefix)
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    
    if (element) {
      const headerOffset = 80; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
