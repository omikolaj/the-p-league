import { animate, query, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TeamSignUpForm } from 'src/app/core/models/team/team-sign-up-form.model';
import { TeamService } from 'src/app/core/services/team/team.service';

@Component({
	selector: 'app-information',
	templateUrl: './information.component.html',
	styleUrls: ['./information.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('infoAnimation', [
			transition(':enter', [
				query('.info-wrapper', [
					style({ opacity: 0, transform: 'translateY(-3%)' }),
					animate('.3s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0%)' }))
				])
			])
		])
	]
})
export class InformationComponent {
	@HostBinding('@infoAnimation')
	public animatePage = true;
	@Input() teamSignUpForm: TeamSignUpForm;

	constructor(private router: Router, private teamService: TeamService) {}

	toMerchandise(): void {
		this.router.navigate(['merchandise']);
	}

	toGallery(): void {
		this.router.navigate(['gallery']);
	}

	toNewSubmission(): void {
		this.teamService.newSubmission();
	}
}
