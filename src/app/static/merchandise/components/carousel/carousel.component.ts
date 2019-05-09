import { Component, OnInit, Input } from "@angular/core";
import { GearItem } from "src/app/core/models/gear-item.model";
import { GearImage } from "src/app/core/models/gear-image.model";
import "hammerjs";
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
  NgxGalleryLayout
} from "ngx-gallery";

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.scss"]
})
export class CarouselComponent implements OnInit {
  @Input() images: GearImage[] = [];
  defaultImgURL: string = "../../../../assets/IMG_5585.JPG";
  imagess = [1, 2, 3].map(
    () => `https://picsum.photos/900/500?random&t=${Math.random()}`
  );

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor() {}

  ngOnInit() {
    this.galleryOptions = [
      {
        width: "360px",
        height: "400px",
        thumbnailsColumns: this.images.length,
        imageAnimation: NgxGalleryAnimation.Slide,
        thumbnails: false,
        previewSwipe: true,
        previewCloseOnClick: true,
        previewCloseOnEsc: true,
        previewKeyboardNavigation: true,
        previewAutoPlay: true,
        previewAutoPlayInterval: 3000,
        previewInfinityMove: true,
        previewZoom: true
      },
      // max-width 800
      {
        breakpoint: 800,
        width: "100%",
        height: "600px",
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.galleryImages = [
      {
        small: "../../../../assets/Leo.JPG",
        medium: "../../../../assets/Leo.JPG",
        big: "../../../../assets/Leo.JPG"
      },
      {
        small: "../../../../assets/IMG_5585.JPG",
        medium: "../../../../assets/IMG_5585.JPG",
        big: "../../../../assets/IMG_5585.JPG"
      }
    ];
  }

  displayImageSource(image: GearImage): string {
    if (image != null) {
      if (image.url != null) {
        return image.url;
      }
    }
    return this.defaultImgURL;
  }
}
