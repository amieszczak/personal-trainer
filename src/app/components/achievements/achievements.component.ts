import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Achievement {
  id: number;
  title: string;
  description: string;
  expanded: boolean;
}

@Component({
  selector: 'app-achievements',
  imports: [CommonModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})
export class AchievementsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('titleWrapper') titleWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('achievementsList') achievementsList!: ElementRef<HTMLUListElement>;
  
  achievements: Achievement[] = [
    {
      id: 1,
      title: 'Ponad 500 zadowolonych klientów',
      description: 'Przez lata pracy pomogłem ponad 500 osobom osiągnąć ich cele fitness. Każda transformacja to dla mnie osobisty sukces i motywacja do dalszego działania.',
      expanded: false
    },
    {
      id: 2,
      title: 'Certyfikowany trener personalny z 10-letnim doświadczeniem',
      description: 'Posiadam międzynarodowe certyfikaty trenerskie oraz 10 lat praktycznego doświadczenia w pracy z klientami na różnych poziomach zaawansowania.',
      expanded: false
    },
    {
      id: 3,
      title: 'Specjalista ds. rehabilitacji sportowej',
      description: 'Ukończyłem specjalistyczne szkolenia z zakresu rehabilitacji sportowej, co pozwala mi bezpiecznie pracować z osobami po kontuzjach i z problemami zdrowotnymi.',
      expanded: false
    },
    {
      id: 4,
      title: 'Autor autorskich programów treningowych',
      description: 'Opracowałem unikalne metody treningowe łączące różne style treningu, dostosowane do indywidualnych potrzeb i możliwości każdego klienta.',
      expanded: false
    },
    {
      id: 5,
      title: 'Współpraca z profesjonalnymi sportowcami',
      description: 'Miałem zaszczyt pracować z zawodowymi sportowcami z różnych dyscyplin, pomagając im w osiąganiu najlepszej formy przed ważnymi zawodami.',
      expanded: false
    },
    {
      id: 6,
      title: 'Ekspert ds. transformacji sylwetki',
      description: 'Specjalizuję się w kompleksowych przemianach – od redukcji wagi po budowę masy mięśniowej. Moje podejście łączy trening z doradztwem żywieniowym.',
      expanded: false
    }
  ];
  
  private scrollListener: (() => void) | null = null;
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.initStickyTitle();
  }
  
  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
  
  toggleAchievement(id: number): void {
    const achievement = this.achievements.find(a => a.id === id);
    if (achievement) {
      achievement.expanded = !achievement.expanded;
      // Recalculate position after height change
      setTimeout(() => {
        if (this.scrollListener) {
          this.scrollListener();
        }
      }, 50);
    }
  }
  
  private initStickyTitle(): void {
    if (!this.titleWrapper || !this.achievementsList) return;
    
    const titleContent = this.titleWrapper.nativeElement.querySelector('.achievements__title-content') as HTMLElement;
    if (!titleContent) return;
    
    this.scrollListener = () => {
      const wrapper = this.titleWrapper.nativeElement;
      const listElement = this.achievementsList.nativeElement;
      
      const wrapperRect = wrapper.getBoundingClientRect();
      const listRect = listElement.getBoundingClientRect();
      
      const wrapperTop = wrapperRect.top;
      const wrapperLeft = wrapperRect.left;
      const listBottom = listRect.bottom;
      
      const titleHeight = titleContent.offsetHeight;
      const viewportHeight = window.innerHeight;
      const middleOfViewport = viewportHeight / 2;
      
      // Calculate when the middle of the title content reaches the middle of viewport
      const titleMiddlePosition = wrapperTop + (titleHeight / 2);
      
      // Calculate the bottom position of title when fixed
      const titleBottomWhenFixed = middleOfViewport + (titleHeight / 2);
      
      // When the middle of viewport hasn't reached the middle of title content yet
      if (titleMiddlePosition > middleOfViewport) {
        titleContent.style.position = 'absolute';
        titleContent.style.top = '0';
        titleContent.style.left = '0';
      }
      // When bottom of title would go past the bottom of the list
      else if (titleBottomWhenFixed >= listBottom) {
        // Calculate absolute position to align bottom of title with bottom of list
        const listBottomRelativeToWrapper = listRect.bottom - wrapperRect.top;
        titleContent.style.position = 'absolute';
        titleContent.style.top = `${listBottomRelativeToWrapper - titleHeight}px`;
        titleContent.style.left = '0';
      }
      // When wrapper is in the middle (sticky position)
      else {
        titleContent.style.position = 'fixed';
        titleContent.style.top = `${middleOfViewport - titleHeight / 2}px`;
        titleContent.style.left = `${wrapperLeft}px`;
      }
    };
    
    window.addEventListener('scroll', this.scrollListener);
    this.scrollListener(); // Initial call
  }
}
