import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transformation {
  id: number;
  name: string;
  age: number;
  description: string;
  story: string;
  quote: string;
  image?: string;
}

@Component({
  selector: 'app-transformations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transformations.component.html',
  styleUrl: './transformations.component.scss'
})
export class TransformationsComponent implements OnInit, OnDestroy {
  transformations: Transformation[] = [
    {
      id: 1,
      name: 'Marek Kowalski',
      age: 35,
      description: 'Stracił 25 kg w 6 miesięcy',
      story: 'Marek przyszedł do mnie z nadwagą i brakiem energii. Wspólnie opracowaliśmy plan treningowy i dietetyczny dostosowany do jego trybu życia. Skupiliśmy się na budowaniu nawyków, które można utrzymać długoterminowo. Po 6 miesiącach ciężkiej pracy osiągnął swój cel.',
      quote: 'Nigdy nie myślałem, że mogę tak wyglądać. Adrian nie tylko pomógł mi schudnąć, ale też nauczył, jak żyć zdrowo każdego dnia.'
    },
    {
      id: 2,
      name: 'Anna Nowak',
      age: 28,
      description: 'Zbudowała masę mięśniową i poprawiła sylwetkę',
      story: 'Anna chciała nabrać pewności siebie i zbudować mocniejsze ciało. Przez 8 miesięcy pracowaliśmy nad siłą i masą mięśniową. Program obejmował trening siłowy 4 razy w tydzień oraz zbilansowaną dietę wysokobiałkową.',
      quote: 'Czuję się silniejsza niż kiedykolwiek. Adrian pokazał mi, że kobiety mogą i powinny trenować z ciężarami!'
    },
    {
      id: 3,
      name: 'Piotr Wiśniewski',
      age: 42,
      description: 'Powrócił do formy po kontuzji',
      story: 'Piotr po kontuzji kręgosłupa potrzebował specjalistycznego podejścia. Stworzyliśmy program rehabilitacyjny, który stopniowo wprowadzał go z powrotem do pełnej aktywności. Skupiliśmy się na stabilizacji i wzmocnieniu mięśni głębokich.',
      quote: 'Dzięki profesjonalnemu podejściu Adriana udało mi się nie tylko wrócić do formy, ale czuję się lepiej niż przed kontuzją.'
    },
    {
      id: 4,
      name: 'Karolina Lewandowska',
      age: 31,
      description: 'Przygotowanie do pierwszego maratonu',
      story: 'Karolina marzyła o ukończeniu maratonu. Przez 5 miesięcy pracowaliśmy nad jej wytrzymałością, techniką biegu i siłą. Program treningowy był zindywidualizowany i dostosowywany do jej postępów.',
      quote: 'Ukończyłam mój pierwszy maraton dzięki Adrianowi! Jego wsparcie i wiedza były nieocenione.'
    },
    {
      id: 5,
      name: 'Tomasz Zieliński',
      age: 38,
      description: 'Transformacja sylwetki - rzeźba mięśni',
      story: 'Tomasz miał już doświadczenie w treningu, ale chciał przejść na wyższy poziom. Przez 4 miesiące skupiliśmy się na definicji mięśni i redukcji tkanki tłuszczowej przy zachowaniu masy mięśniowej. Program obejmował intensywne treningi i precyzyjnie zaplanowaną dietę.',
      quote: 'Adrian pomógł mi osiągnąć formę, o której zawsze marzyłem. Jego wiedza o treningu i diecie jest imponująca.'
    },
    {
      id: 6,
      name: 'Magdalena Dąbrowska',
      age: 45,
      description: 'Odzyskała formę i energię po ciąży',
      story: 'Magdalena po dwóch ciążach chciała wrócić do aktywności fizycznej i odzyskać swoją formę. Stworzyliśmy bezpieczny program, który uwzględniał jej sytuację życiową i wyzwania związane z byciem mamą. Treningi były efektywne, ale nie zabierały zbyt wiele czasu.',
      quote: 'Adrian zrozumiał moje potrzeby jako mamy. Program był idealny - efektywny, ale realny do wykonania.'
    },
    {
      id: 7,
      name: 'Jakub Krawczyk',
      age: 26,
      description: 'Z początkującego do zaawansowanego sportowca',
      story: 'Jakub rozpoczynał swoją przygodę z siłownią bez doświadczenia. Przez rok wspólnej pracy nauczyliśmy się wszystkich podstawowych ćwiczeń, zbudował solidne fundamenty siły i masy mięśniowej. Teraz sam planuje treningi na podstawie wiedzy, którą zdobył.',
      quote: 'Adrian nie tylko trenował mnie, ale nauczył jak to robić samodzielnie. To najlepszy nauczyciel, jakiego mogłem sobie wymarzyć.'
    }
  ];

  currentIndex = 1; // Start at 1 because we'll add a clone at the beginning
  slidesVisible = 3;
  translateX = 0;
  isTransitioning = false;
  
  private touchStartX = 0;
  private touchEndX = 0;

  // Get all slides including clones
  get allSlides(): Transformation[] {
    const lastSlide = this.transformations[this.transformations.length - 1];
    const firstSlide = this.transformations[0];
    return [lastSlide, ...this.transformations, firstSlide];
  }

  ngOnInit(): void {
    this.updateSlidesVisible();
    this.updateSliderPosition();
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
    
    // Calculate slide width as percentage
    const slideWidth = 100 / this.slidesVisible;
    
    // Center the active slide in the viewport
    // We want the active slide to be in the middle of the screen
    // So we offset by: (currentIndex * slideWidth) - (50% of viewport - 50% of slide)
    // Simplified: move left by currentIndex slides, then move right to center it
    
    if (this.slidesVisible === 3) {
      // For 3 slides: center the active slide
      // Move left by the index amount, then add back half the viewport minus half a slide
      this.translateX = -(this.currentIndex * slideWidth) + 50 - (slideWidth / 2);
    } else {
      // For 2 slides: center the active slide
      this.translateX = -(this.currentIndex * slideWidth) + 50 - (slideWidth / 2);
    }

    if (instant) {
      // Force reflow to ensure the instant position change happens
      setTimeout(() => {
        this.isTransitioning = true;
      }, 50);
    }
  }

  nextSlide(): void {
    this.currentIndex++;
    this.updateSliderPosition();

    // If we reached the last clone (first slide), jump back to the real first slide
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

    // If we reached the first clone (last slide), jump forward to the real last slide
    if (this.currentIndex === 0) {
      setTimeout(() => {
        this.currentIndex = this.transformations.length;
        this.updateSliderPosition(true);
      }, 500);
    }
  }

  goToSlide(index: number): void {
    // Add 1 to account for the clone at the beginning
    this.currentIndex = index + 1;
    this.updateSliderPosition();
  }

  // Get the actual transformation index for display
  getActualIndex(index: number): number {
    if (index === 0) return this.transformations.length - 1; // Last clone
    if (index === this.allSlides.length - 1) return 0; // First clone
    return index - 1; // Regular slides
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

