import { Component, OnInit } from "@angular/core";
import { LeaguePicture } from "src/app/core/models/leage-picture.model";
import { Observable, of } from "rxjs";
import { GalleryService } from "src/app/core/services/gallery/gallery.service";
import { ROUTE_ANIMATIONS_ELEMENTS } from "src/app/core/animations/route.animations";
import { NgxGalleryAnimation, NgxGalleryOptions } from "ngx-gallery";
import { map, catchError } from "rxjs/operators";

export const galleryOptions: NgxGalleryOptions[] = [
  {
    width: "100%",
    height: "400px",
    imageAnimation: NgxGalleryAnimation.Zoom,
    thumbnails: true,
    previewSwipe: true,
    imageSwipe: true,
    imageArrowsAutoHide: true,
    previewAutoPlayInterval: 4000,
    imageAutoPlayInterval: 4000,
    previewCloseOnClick: true,
    previewCloseOnEsc: true,
    previewKeyboardNavigation: true,
    previewInfinityMove: true,
    imageInfinityMove: true,
    previewZoom: true,
    imageAutoPlay: true,
    imageAutoPlayPauseOnHover: true,
    previewAutoPlay: true,
    previewAutoPlayPauseOnHover: true,
    imageBullets: true
  },
  // max-width 800
  {
    breakpoint: 576,
    height: "400px",
    imagePercent: 80,
    thumbnailsPercent: 20,
    thumbnailsMargin: 20,
    thumbnailMargin: 20
  },
  {
    breakpoint: 768,
    height: "600px",
    imagePercent: 80,
    thumbnailsPercent: 20,
    thumbnailsMargin: 20,
    thumbnailMargin: 20
  },
  {
    breakpoint: 10000,
    height: "800px",
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
  selector: "app-gallery-grid-list",
  templateUrl: "./gallery-grid-list.component.html",
  styleUrls: ["./gallery-grid-list.component.scss"]
})
export class GalleryGridListComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  leaguePictures$: Observable<LeaguePicture[]>;
  galleryImages: LeaguePicture[] = [];
  galleryOptions: NgxGalleryOptions[] = galleryOptions;

  galleryImages$: Observable<
    LeaguePicture[]
  > = this.galleryService.leaguePictures$.pipe(
    catchError(error => {
      console.log("[ERROR IN GALLERY GRID STREAM]");
      return of(null);
    })
  );

  constructor(private galleryService: GalleryService) {}

  ngOnInit() {
    this.galleryService.leaguePicturesSubject$.subscribe(
      (leaguePictures: LeaguePicture[]) => {
        console.log("[Getting Updated Photos Gallery Grid]", leaguePictures);
        this.galleryImages = [...leaguePictures];
      }
    );
  }

  ngOnDestroy() {
    this.galleryService.leaguePicturesSubject$.unsubscribe();
  }
}
