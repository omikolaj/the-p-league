import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TeamSignUpImages } from '../team-signup-images';
import { TeamService } from 'src/app/core/services/team/team.service';
import { TeamSignUpForm } from 'src/app/core/models/team/team-sign-up-form.model';
import { map } from 'rxjs/operators';
import { NgxGalleryImage } from '@kolkov/ngx-gallery/lib/ngx-gallery-image';
import { NgxGalleryOptions, NgxGalleryAnimation } from '@kolkov/ngx-gallery';

const galleryOptions: NgxGalleryOptions[] = [
	{
		width: '360px',
		height: '400px',
		imageAnimation: NgxGalleryAnimation.Zoom,
		thumbnails: false,
		previewSwipe: false,
		imageSwipe: true,
		imageArrowsAutoHide: false,
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
		imageBullets: true,
		lazyLoading: true,
		imageDescription: true,
		imageArrows: true
	},
	// max-width 800
	{
		breakpoint: 800,
		width: '100%',
		height: '360px',
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
	selector: 'app-team-signup',
	templateUrl: './team-signup.component.html',
	styleUrls: ['./team-signup.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamSignupComponent implements OnInit {
	images: NgxGalleryImage[] = TeamSignUpImages;
	teamSignUpForm: TeamSignUpForm | {};
	options = galleryOptions;
	teamSignUpSubmitted$ = this.teamService.newTeamSubmission$.pipe(
		map((form) => {
			if (form === undefined) {
				return form;
			}
			return (this.teamSignUpForm = form);
		})
	);

	constructor(private teamService: TeamService) {}

	ngOnInit() {}
}
