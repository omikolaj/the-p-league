import { Component, Output, EventEmitter, Input, ChangeDetectorRef, ViewChild, ElementRef, OnInit, DoCheck } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeaderService } from 'src/app/core/services/header/header.service';
import { trigger } from '@angular/animations';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [
    
  ]
})
export class ToolbarComponent implements OnInit{
  @Output() sidenavToggle = new EventEmitter();
  @Input() appTitle: string;
  @Input() logo: string; 

  isSticky: boolean;
  hideToolBarHeader: boolean = false;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private headerService: HeaderService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(){   
    this.headerService.isSticky$.subscribe(isSticky => this.isSticky = isSticky);
    this.headerService.hideToolbarHeader$.subscribe((hideToolbar) => {      
      this.hideToolBarHeader = hideToolbar;  
      console.log('[Logging from Toolbar]', hideToolbar);
      if(this.hideToolBarHeader){
        this.cdRef.detectChanges();        
      }
    })    
  }

  ngOnDestory(){
    this.headerService.hideToolbarHeader$.unsubscribe();
  }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();    
  }

}
