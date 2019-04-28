import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, HostBinding } from '@angular/core';
import { trigger, transition, style, state, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  animations: [
    trigger('sideNavLink', [
      transition('out => in', [
        query('a', [
          style({ opacity: 0, transform: 'translateX(-100%)' }),
          stagger(250, [
            animate('.3s cubic-bezier(.52,-0.21,.29,1.26)', style({ opacity: 1, transform: 'translateX(0)'}))
          ])
        ])
      ]),
    ])
  ]
})
export class SidenavListComponent implements OnInit {
  sideNavAnimationState: string = 'out';
  @Output() sideNavClose = new EventEmitter();
  @Input() appTitle: string;
  // logo gets passed in from the toolbar icon that is in the middle.
  @Input() logo: string;
  logo_with_title: string = "../../../../assets/logo_no_title.png";
  constructor() { }

  ngOnInit() {
  }

  onSideNavClose(): void {   
    this.sideNavClose.emit();
  }

  onSideNavLinkClick(){
    this.onSideNavClose();
  }

  sideNavOpening(){
    console.log("SidenNavOpen")
    this.sideNavAnimationState = 'in';
  }

  sideNavClosing(){
    console.log("SidenNavClose")
    this.sideNavAnimationState = 'out';
  }

}
