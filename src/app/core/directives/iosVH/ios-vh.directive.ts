import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appIosVH]'
})
export class IosVHDirective {
  @HostListener('resize', ['$event']) onresize(event){
    console.log("RESIZE EVENT");
    this.calculateVH;
  }
  constructor() { }

  calculateVH(){
    
  }


}
