import { Component, Output, EventEmitter, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, pairwise, filter } from 'rxjs/operators';
import { HeaderService } from 'src/app/core/services/header/header.service';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [
    trigger('fadeHeader', [
      state('show', style({ transform: 'translateY(0%)', opacity: 1 })),
      state('hide', style({ transform: 'translateY(-100%)', opacity: 0 })),
      transition('show => hide', [
        style({ transform: 'translateY(0%)', opacity: 1 }),
        animate('.3s cubic-bezier(.08,-0.06,.44,.95)', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ]),
      transition('hide => show', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('.3s cubic-bezier(.08,-0.06,.44,.95)', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ])    
  ]
})
export class ToolbarComponent implements OnInit{
  @Output() sidenavToggle = new EventEmitter();
  @Input() appTitle: string;
  @Input() logo: string; 

  headerSubscribtion: Subscription;
  isSticky: boolean;
  hideToolBarHeader: boolean = false;
  headerLinksText: string[] = [];
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        console.log(result.breakpoints)
        return result.matches;
      })
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private headerService: HeaderService,
    private cdRef: ChangeDetectorRef
  ) {
    this.headerLinksText = this.headerService.sidenavText;
   }

  ngOnInit(){   
    this.headerSubscribtion = this.headerService.isSticky$.subscribe(isSticky => this.isSticky = isSticky);
    this.headerSubscribtion.add(this.headerService.hideToolbarHeader$.pipe(
      pairwise(),      
      filter(headerState => {
        return !((headerState[0] === false && headerState[1] === false) || (headerState[0] === true && headerState[1] === true))
      }),
      map(headerState => headerState[1])         
    )    
    .subscribe((hideToolbar) => {            
      this.hideToolBarHeader = hideToolbar;      
      this.cdRef.detectChanges(); 
    }))
  }

  ngOnDestory(){
    this.headerSubscribtion.unsubscribe();
  }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();    
  }

}
