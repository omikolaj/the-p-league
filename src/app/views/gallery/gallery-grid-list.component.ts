import { Component, OnInit } from '@angular/core';
import { LeaguePicture } from 'src/app/core/models/leage-picture.model';
import { Observable } from 'rxjs';
import { GalleryService } from 'src/app/core/services/gallery/gallery.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from 'src/app/core/animations/route.animations';

@Component({
  selector: 'app-gallery-grid-list',
  templateUrl: './gallery-grid-list.component.html',
  styleUrls: ['./gallery-grid-list.component.scss']
})
export class GalleryGridListComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  leaguePictures$: Observable<LeaguePicture[]>;
  constructor(private galleryService: GalleryService) { }

  ngOnInit() {
    this.leaguePictures$ = this.galleryService.fetchAllLeaguePictures();
  }

}
