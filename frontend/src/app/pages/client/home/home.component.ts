import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { AchievementsComponent } from '../achievements/achievements.component';
import { TransformationsComponent } from '../transformations/transformations.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AchievementsComponent,
    TransformationsComponent,
    GalleryComponent,
    AboutMeComponent,
    ContactComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
