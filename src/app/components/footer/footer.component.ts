import { Component } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  constructor(private scrollService: ScrollService) {}

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.scrollService.scrollToSection(sectionId);
  }
}
