import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('AboutPage <=> TeamSignUpPage', [
        style({position: 'relative'}),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [
          style({ left: '-100%'})
        ]),
        query(':leave', animateChild()),
        group([
          query(':leave', [
            animate('2s ease-out', style({ left: '100%' }))
          ]),
          query(':enter', [
            animate('2s ease-out', style({ left: '0%' }))
          ])
        ]),
        query(':enter', animateChild())
      ])
    ])
  ]
})
export class AppComponent {
  title: string = 'The P League';
  logo = '../../../../assets/logo_no_title.png';
  year = new Date().getFullYear();

  prepareRoute(outlet: RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
