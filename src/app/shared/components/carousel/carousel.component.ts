import { Component, Input, OnInit } from '@angular/core';
import { INgxGalleryImage, NgxGalleryAnimation, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TeamSignUpImage } from 'src/app/views/about/components/team-signup/team-signup-images';

const galleryOptions: NgxGalleryOptions[] = [
	{
		width: '100%',
		height: '400px',
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
		preview: false
	}
];

@Component({
	selector: 'app-carousel',
	templateUrl: './carousel.component.html',
	styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
	@Input() images: TeamSignUpImage[] = [];

	ngxGalleryOptions = galleryOptions;
	images11: INgxGalleryImage[] = [];

	constructor() {}

	ngOnInit() {
		console.log(this.images);
		this.images11 = [
			{
				small: this.images[0].src,
				medium: this.images[0].src,
				big: this.images[0].src
			}
		];
		console.log(this.images11);
	}

	onPreviewOpen() {}

	onPreviewClose() {}
}
