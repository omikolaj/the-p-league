import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SnackBarService } from 'src/app/shared/components/snack-bar/snack-bar-service.service';

@Component({
	selector: 'app-sidenav-list',
	templateUrl: './sidenav-list.component.html',
	styleUrls: ['./sidenav-list.component.scss'],
	animations: [
		trigger('sideNavLink', [
			transition('out => in', [
				query('a', [
					style({ opacity: 0, transform: 'translateX(-100%)' }),
					stagger(150, [animate('.3s cubic-bezier(.52,-0.21,.29,1.26)', style({ opacity: 1, transform: 'translateX(0)' }))])
				])
			])
		])
	]
})
export class SidenavListComponent implements OnInit, OnDestroy {
	sideNavAnimationState = 'out';
	@Output() sideNavClose = new EventEmitter();
	@Input() appTitle: string;
	// logo gets passed in from the toolbar icon that is in the middle.
	@Input() logo: string;
	logo_with_title = 'https://res.cloudinary.com/dwsvaiiox/image/upload/f_auto,q_70,w_48/v1581275472/movies-place/logo_no_title.png';
	sidenavListText: string[] = ['Merchandise', 'Gallery'];
	isLoggedIn$ = this.authService.isLoggedIn$;
	subscription: Subscription;

	constructor(private authService: AuthService, private snackBar: SnackBarService) {}

	ngOnInit() {}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	onSideNavClose(): void {
		this.sideNavClose.emit();
	}

	onSideNavLinkClick() {
		this.onSideNavClose();
	}

	sideNavOpening() {
		this.sideNavAnimationState = 'in';
	}

	sideNavClosing() {
		this.sideNavAnimationState = 'out';
	}
}
