import { Component, OnInit, Input } from '@angular/core';
import { TeamSignUpImage } from 'src/app/views/about/components/team-signup/team-signup-images';
import { ROUTE_ANIMATIONS_ELEMENTS } from 'src/app/core/animations/route.animations';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() images: TeamSignUpImage[] = [];
  constructor() {}

  ngOnInit() {}
}
