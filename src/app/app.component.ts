import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, query, animateChild, group, animate, keyframes, stagger, sequence } from '@angular/animations';
import { routeAnimations } from './core/animations/route.animations'
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('AboutPage <=> TeamSignUpPage', routeAnimations),
      transition('* <=> MerchandiseListPage', routeAnimations)
    ])
  ]  
})
export class AppComponent {
  title: string = 'The P League';
  logo = '../../../../assets/logo.png';
  year = new Date().getFullYear();

  constructor(private breakpointObserver: BreakpointObserver) { }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  prepareRoute(outlet: RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
