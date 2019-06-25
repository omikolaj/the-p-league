import { Component, OnInit } from "@angular/core";
import { LeaguePicture } from "src/app/core/models/league-picture.model";
import { Observable, of, Subscription, combineLatest } from "rxjs";
import { GalleryService } from "src/app/core/services/gallery/gallery.service";
import { ROUTE_ANIMATIONS_ELEMENTS } from "src/app/core/animations/route.animations";
import { NgxGalleryAnimation, NgxGalleryOptions } from "ngx-gallery";
import { catchError, map } from "rxjs/operators";
import { ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { Role } from "src/app/helpers/Constants/ThePLeagueConstants";
import { AuthService } from "src/app/core/services/auth/auth.service";

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

  isAdmin: boolean = false;

  galleryImagess$: Observable<
    LeaguePicture[]
  > = this.galleryService.leaguePictures$.pipe(
    catchError(() => {
      return of(null);
    })
  );

  galleryImages$ = combineLatest([
    this.galleryService.leaguePictures$,
    this.galleryService.updatedLeaguePicturesOrder$,
    this.galleryService.newLatestLeaguePictures$,
    this.galleryService.deleteLeaguePicturesLatest$
  ]).pipe(
    map(([leaguePictures, leaguePicturesOrdered]) => {
      this.galleryImages = [...leaguePictures];
      return this.galleryImages;
    })
  );

  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.isAdmin = this.route.snapshot.data.roles.includes(Role.Admin);
  }
}
