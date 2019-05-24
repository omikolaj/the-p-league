import { Component, OnInit, Input } from "@angular/core";
import { GearItem } from "src/app/core/models/gear-item.model";
import { ActivatedRoute, Router } from "@angular/router";
import { MerchandiseService } from "src/app/core/services/merchandise/merchandise.service";
import { Size } from "src/app/core/models/gear-size.model";
import { ROUTE_ANIMATIONS_ELEMENTS } from "src/app/core/animations/route.animations";
import { NgxGalleryAnimation, NgxGalleryOptions } from "ngx-gallery";

export const galleryOptions: NgxGalleryOptions[] = [
  {
    width: "360px",
    height: "400px",
    imageAnimation: NgxGalleryAnimation.Zoom,
    thumbnails: false,
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
  selector: "app-merchandise-item",
  templateUrl: "./merchandise-item.component.html",
  styleUrls: ["./merchandise-item.component.scss"]
})
export class MerchandiseItemComponent implements OnInit {
  @Input() gearItem: GearItem;
  sizes = Size;
  galleryOptions: NgxGalleryOptions[] = galleryOptions;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private merchandiseService: MerchandiseService
  ) {}

  ngOnInit() {}

  onEditGearItem() {
    this.router.navigate(
      [
        {
          outlets: { modal: [this.gearItem.ID, "edit"] }
        }
      ],
      { relativeTo: this.route }
    );
  }

  onDeleteGearItem() {
    this.merchandiseService
      .deleteGearItem(this.gearItem.ID)
      .subscribe((deletedItem: boolean) =>
        console.log("GEARITEM DELETED SUCCESS?: ", deletedItem)
      );
  }
}
