import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from 'src/app/core/animations/route.animations';
import { LeaguePicture } from 'src/app/core/models/league-picture.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { GalleryService } from 'src/app/core/services/gallery/gallery.service';
import { Role } from 'src/app/shared/constants/the-p-league-constants';

export const galleryOptions: NgxGalleryOptions[] = [
	{
		width: '100%',
		height: '400px',
		imageAnimation: NgxGalleryAnimation.Zoom,
		thumbnails: true,
		previewSwipe: true,
		imageSwipe: true,
		imageArrowsAutoHide: false,
		imageArrows: true,
		previewCloseOnClick: true,
		previewCloseOnEsc: true,
		previewKeyboardNavigation: true,
		previewInfinityMove: true,
		imageInfinityMove: true,
		previewZoom: true,
		imageAutoPlay: false,
		imageAutoPlayPauseOnHover: true,
		previewAutoPlay: false,
		previewAutoPlayPauseOnHover: true,
		previewArrowsAutoHide: true,
		imageBullets: true,
		previewRotate: true,
		preview: true,
		lazyLoading: true
	},
	// max-width 800
	{
		breakpoint: 576,
		height: '400px',
		imagePercent: 80,
		thumbnailsPercent: 20,
		thumbnailsMargin: 20,
		thumbnailMargin: 20
	},
	{
		breakpoint: 768,
		height: '600px',
		imagePercent: 80,
		thumbnailsPercent: 20,
		thumbnailsMargin: 20,
		thumbnailMargin: 20
	},
	{
		breakpoint: 10000,
		height: '800px',
		imagePercent: 80,
		thumbnailsPercent: 20,
		thumbnailsMargin: 20,
		thumbnailMargin: 20
	},
	// max-width 400
	{
		breakpoint: 400,
		preview: true
	}
];

@Component({
	selector: 'app-gallery-grid-list',
	templateUrl: './gallery-grid-list.component.html',
	styleUrls: ['./gallery-grid-list.component.scss']
})
export class GalleryGridListComponent implements OnInit {
	routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
	leaguePictures$: Observable<LeaguePicture[]>;
	galleryImages: LeaguePicture[] = [];
	galleryOptions: NgxGalleryOptions[] = galleryOptions;
	subscription: Subscription;
	isLoggedIn$ = this.authService.isLoggedIn$;
	isAdmin = false;

	defaultImage: LeaguePicture[] = [
		{
			small: 'https://res.cloudinary.com/dkbelxhih/image/upload/f_auto,w_512,/v1581902278/pleague/default_gallery_jdyroz.jpg',
			medium: 'https://res.cloudinary.com/dkbelxhih/image/upload/f_auto,/v1581902278/pleague/default_gallery_jdyroz.jpg',
			big: 'https://res.cloudinary.com/dkbelxhih/image/upload/f_auto/v1581902278/pleague/default_gallery_jdyroz.jpg'
		}
	];

	galleryImagess$: Observable<LeaguePicture[]> = this.galleryService.leaguePictures$.pipe(
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

	constructor(private galleryService: GalleryService, private route: ActivatedRoute, public authService: AuthService) {}

	ngOnInit(): void {
		this.isAdmin = this.route.snapshot.data.roles.includes(Role.Admin);
	}
}
