import { animate, animateChild, group, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceInfoService } from 'src/app/core/services/device-info/device-info.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/animations/route.animations';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss'],
	animations: [
		trigger('flyInOut', [
			transition(':enter', [
				group([
					query('h1, .center, .info, .animations', [style({ opacity: 0 }), stagger(290, [animate('.5s ease-in-out', style({ opacity: 1 }))])], {
						optional: true
					}),
					query('@fadeInOut', animateChild(), { optional: true })
				])
			])
		]),
		trigger('fadeInOut', [
			state('fadeIn', style({ opacity: 1 })),
			transition(':enter', [
				style({ opacity: 0 }),
				animate(
					'1.0s ease-in-out',
					keyframes([
						style({ opacity: 0.0, offset: 0.2 }),
						style({ opacity: 0.2, offset: 0.6 }),
						style({ opacity: 0.4, offset: 0.8 }),
						style({ opacity: 0.99, offset: 1 })
					])
				)
			])
		]),
		trigger('pulsing', [
			state('inactive', style({ opacity: 1, color: 'white' })),
			state('active', style({ opacity: 1, color: 'white' })),
			transition('active <=> inactive', [
				animate(
					'4s .5s ease-in-out',
					keyframes([
						style({ opacity: 0.2, offset: 0.2 }),
						style({ opacity: 0.4, offset: 0.4 }),
						style({ opacity: 0.6, offset: 0.6 }),
						style({ opacity: 0.8, offset: 0.75 }),
						style({ opacity: 1, offset: 0.9 })
					])
				)
			])
		])
	]
})
export class AboutComponent implements OnInit, OnDestroy {
	routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
	isIn = false;
	pulsingState = 'inactive';

	constructor(public deviceInfo: DeviceInfoService) {}

	ngOnInit() {
		this.isIn = true;
		this.pulsingState = 'active';
	}

	ngOnDestroy() {
		this.isIn = false;
	}

	onDonePulsing() {
		this.pulsingState = this.pulsingState === 'active' ? 'inactive' : 'active';
	}
}
