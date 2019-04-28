import { Component, OnInit, Input } from '@angular/core';
import { GearItem } from 'src/app/core/models/gear-item.model';
import { GearImage } from 'src/app/core/models/gear-image.model';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() images: GearImage[] = [];
  defaultImgURL: string = "../../../../assets/IMG_5585.JPG"
  imagess = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  constructor() { }

  ngOnInit() {
  }

  displayImageSource(image: GearImage): string{    
    if(image != null){
      if(image.url != null){
        return image.url;
      }
    }
    return this.defaultImgURL;
  }

}
