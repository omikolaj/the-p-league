import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes, sequence, query, stagger, group, animateChild } from '@angular/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('flyInOut', [      
      transition(':enter', [
        group([          
          query('h1, .center, .info, .animations', [
            style({opacity: 0}),
            stagger(200, [
              animate('1.8s ease-in-out', style({ opacity: 1}))
            ])
          ], {optional: true}),
          query('@fadeInOut', animateChild(), { optional: true })         
        ])        
      ])
    ]),
    trigger('fadeInOut', [
      state('fadeIn', style({ opacity: 1})),
      transition(':enter', [
        style({ opacity: 0 }),        
          animate('1.8s ease-in-out', keyframes([
            style({ opacity: .0, offset: .2 }),
            style({ opacity: .2, offset: .6 }),
            style({ opacity: .4, offset: .8 }),
            style({ opacity: .99, offset: 1 })
        ]))        
      ])
    ]),
    trigger('pulsing', [
      state('inactive', style({ opacity: 1, color: 'white' })),
      state('active', style({ opacity: 1, color: 'white' })),
      transition('active <=> inactive', [        
        animate('4s .5s ease-in-out', keyframes([
          style({ opacity: .2, offset: 0.2}),
          style({ opacity: .4, offset: 0.4}),
          style({ opacity: .6, offset: 0.6}),
          style({ opacity: .8, offset: 0.75}),
          style({ opacity: 1, offset: 0.9})
        ]))
      ])
    ])    
  ]
})
export class AboutComponent implements OnInit {
  isIn: boolean = false;
  pulsingState: string = 'inactive';
  constructor() { }

  ngOnInit() {
    this.isIn = true;
    this.pulsingState = 'active';
  }

  ngOnDestroy(){
    this.isIn = false;
  }

  onDonePulsing($event){
    this.pulsingState = this.pulsingState === 'active' ? 'inactive' : 'active';
  }

}
