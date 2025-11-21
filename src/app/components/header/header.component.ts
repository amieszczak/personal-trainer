import { Component } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
  constructor(private scrollService: ScrollService) {}

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.scrollService.scrollToSection(sectionId);
  }
}
