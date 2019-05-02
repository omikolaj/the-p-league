import { Component, Output, EventEmitter, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeaderService } from 'src/app/core/services/header/header.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() sidenavToggle = new EventEmitter();
  @Input() appTitle: string;
  @Input() logo: string;  
  isSticky: boolean;

  hideToolBarHeader: boolean = false;

  @ViewChild('toolbarDiv') toolbarDiv: ElementRef;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private headerService: HeaderService
  ) { }

  ngOnInit(){   
    this.headerService.isSticky$.subscribe(isSticky => this.isSticky = isSticky);
    this.headerService.hideToolbarHeader$.subscribe((value) => {
      
      this.hideToolBarHeader = true;     
    })    
    // this.headerService.hideToolbarHeaderObservable$.subscribe(
    //   hideToolbar => {
    //     console.log('[Inside ToolBarComponent BEFORE]', hideToolbar);
    //     this.hideToolBarHeader = hideToolbar;
    //     console.log('[Inside ToolBarComponent AFTER]', this.hideToolBarHeader);
    //   },
    //   (e) => console.log('ERROR', e),
    //   () => console.log('COMPLETED')
    // )
  }

  ngOnDestory(){
    this.headerService.hideToolbarHeader$.unsubscribe();
  }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();    
  }

  log(){
    console.log('logging', this.hideToolBarHeader)
  }

}
