import { animate, query, sequence, stagger, style } from '@angular/animations';

export const ROUTE_ANIMATIONS_ELEMENTS = 'route-animation-elements';

export const routeAnimations = [
	query(':enter > *', style({ opacity: 0 }), {
		optional: true
	}),
	query(':enter .' + ROUTE_ANIMATIONS_ELEMENTS, style({ opacity: 0 }), {
		optional: true
	}),
	sequence([
		query(
			':leave > *',
			[
				style({ transform: 'translateY(0%)', opacity: 1 }),
				animate('.3s ease-out', style({ transform: 'translateY(-3%)', opacity: 0 })),
				style({ position: 'fixed' })
			],
			{ optional: true }
		),
		query(
			':enter > *',
			[
				style({
					transform: 'translateY(-3%)',
					opacity: 0,
					position: 'static'
				}),
				animate('.3s ease-in-out', style({ transform: 'translateY(0%)', opacity: 1 }))
			],
			{ optional: true }
		)
	]),
	query(
		':enter .' + ROUTE_ANIMATIONS_ELEMENTS,
		stagger(100, [
			style({ transform: 'translateY(10%)', opacity: 0 }),
			animate('.3s ease-in-out', style({ transform: 'translateY(0%)', opacity: 1 }))
		]),
		{ optional: true }
	)
];
