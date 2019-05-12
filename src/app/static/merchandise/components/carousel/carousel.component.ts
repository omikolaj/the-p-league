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
import {
  EmitEvent,
  EventBusService,
  Events
} from "src/app/core/services/event-bus/event-bus.service";

export const galleryOptions = [
  {
    width: "360px",
    height: "400px",
    imageAnimation: NgxGalleryAnimation.Slide,
    thumbnails: false,
    previewSwipe: true,
    imageSwipe: true,
    previewCloseOnClick: true,
    previewCloseOnEsc: true,
    previewKeyboardNavigation: true,
    previewInfinityMove: false,
    previewZoom: true
  },
  // max-width 800
  {
    breakpoint: 800,
    width: "100%",
    height: "360px",
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

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(private eventbus: EventBusService) {}

  ngOnInit() {
    this.galleryOptions = galleryOptions;
    this.convertToGalleryImages();
  }

  convertToGalleryImages() {
    for (let index = 0; index < this.images.length; index++) {
      const image: GearImage = this.images[index];
      let imgURL = image.url ? image.url : this.defaultImgURL;
      const galleryImage: NgxGalleryImage = {
        small: imgURL,
        medium: imgURL,
        big: imgURL
      };
      this.galleryImages.push(galleryImage);
    }
  }

  displayImageSource(image: GearImage): string {
    if (image != null) {
      if (image.url != null) {
        return image.url;
      }
    }
    return this.defaultImgURL;
  }

  onPreviewOpen() {
    this.eventbus.emit(new EmitEvent(Events.HideScrollbar, true));
  }

  onPreviewClose() {
    this.eventbus.emit(new EmitEvent(Events.HideScrollbar, false));
  }
}
