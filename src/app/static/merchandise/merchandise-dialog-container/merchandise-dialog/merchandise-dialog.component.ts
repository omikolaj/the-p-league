import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormGroupDirective } from '@angular/forms';
import { GearItem } from 'src/app/core/models/gear-item.model';
import { ActivatedRoute } from '@angular/router';
import { MerchandiseService } from 'src/app/core/services/merchandise/merchandise.service';
import { MatDialogRef } from '@angular/material';
import { GearSize, Size } from 'src/app/core/models/gear-size.model';
import { v4 as uuid } from 'uuid';

import {ThemePalette} from '@angular/material/core';
import { GearImage } from 'src/app/core/models/gear-image.model';
import { trigger, style, group, query, transition, stagger, animate, state } from '@angular/animations';
// import { requireSizes } from './merchandise-dialog.validators';
export interface ChipColor {
  name: string;
  color: ThemePalette;
}

@Component({
  selector: 'app-merchandise-dialog',
  templateUrl: './merchandise-dialog.component.html',
  styleUrls: ['./merchandise-dialog.component.scss'],  
  animations: [
    trigger('imageUpload', [
      transition('* => *', [
          query(':enter',[
            style({opacity: 0, transform: 'translateY(-100%)'}),
            stagger(290, [              
              animate('.3s ease-in-out', style({ opacity: 1, transform: 'translateY(-3%)' }))
            ]
          )
        ], { optional: true }),
        query(':leave', [
          style({opacity: 1, transform: 'translateX(0)'}),
          animate('.3s cubic-bezier(.34,-0.39,.7,1.5)', style({ opacity: 0, transform: 'translateX(-30%)' }))
        ], { optional: true })                
      ]),      
    ])
  ]
})
export class MerchandiseDialogComponent implements OnInit {  
  gearItem: GearItem; 
  editMode: boolean = false; 
  gearItemForm: FormGroup;  
  selectedFileFormData: FormData;
  gearItemImages: GearImage[] = [];  
  
  gearSizes: GearSize[] = [];  
  isInStock: boolean = true;
  sizeEnum = Size; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private merchandiseService: MerchandiseService,
    private dialogRef: MatDialogRef<MerchandiseDialogComponent>
  ) {
    // Initialize all of the available gear sizes
    this.gearSizes = [
      { size: Size.XS, available: false, color: 'accent' },
      { size: Size.S, available: false, color: 'accent' },
      { size: Size.M, available: false, color: 'accent' },
      { size: Size.L, available: false, color: 'accent' },
      { size: Size.XL, available: false, color: 'accent' },
      { size: Size.XXL, available: false, color: 'accent' },
    ]
  }

  ngOnInit() {
    const outlet = 'modal';

    // Checks to see if we are in edit mode and grabs the id from the url
    this.route.firstChild.children
      .filter(r => r.outlet === outlet)
      .map(r => r.params.subscribe(
        (params) => {
          this.editMode = params['id'] != null;
          this.merchandiseService.findGearItem(+params['id']).subscribe(gearItem => this.gearItem = gearItem);
        }        
      ))
    this.initForm();
  }

  // This function is used to return the gear element ID. The *ngFor structural directive is using trackBy: function attribute, which helps *ngFor understand when to re-render the entire array or re-use elements. By default the trackByFn returns the object in the array reference. If you use pure functions and immutable arrays, then you always return a new array. Thus we need to provide our own way of saying, 'Don't use object references to evaluate if you should re-render and object, rather use this unique ID'.
  trackByImageFn(index: number, element: GearImage){
    return element ? element.ID : null;
  }

  onSubmit(){    
    console.log('in submit', this.gearItemForm);  
    if(this.editMode){
      // edit
    }
    else{
      const newGearItem: GearItem = {
        name: this.gearItemForm.value.name,
        price: this.gearItemForm.value.price,
        sizes: this.gearItemForm.value.sizes,
        inStock: this.gearItemForm.value.inStock,
        images: this.gearItemForm.value.images
      }
      this.selectedFileFormData.append('newGearItem', JSON.stringify(newGearItem));
      this.merchandiseService.createGearItem(this.selectedFileFormData);      
    }
  }

  // Controls the text that displays next the slide toggle
  onSlideChange(){
    this.isInStock = !this.isInStock;
  }

  onSelectedChipSize(){    
    this.gearItemForm.controls['sizes'].updateValueAndValidity();
  }

  onCancel(){
    this.dialogRef.close();
  }

  onFileSelected(event){    
    const length = event.target.files.length < 3 ? event.target.files.length : 3;    
    const filesObj = <File>event.target.files
    
    // If we have 3 items in the array
    if(this.gearItemImages.length === 3){
      // Copy over the old array and create a new reference to the new array
      this.gearItemImages = [...this.gearItemImages];
      // Loop through the total number of images that user is trying to upload
      // and replace the first item in the array with the first item from the user
      // defined array
      for (let index = 0; index < length; index++) {
        this.gearItemImages.splice(index, 1, { ID: uuid(), name: filesObj[index].name, size: filesObj[index].size, type: filesObj[index].type });        
      }
    }
    // If we more than 0 and less than 3 so either 1 or 2 images uploaded
    else if(this.gearItemImages.length > 0 && this.gearItemImages.length < 3){      
      this.gearItemImages = [...this.gearItemImages];      
      // Loop through the total number of images that user is trying to upload
      // and add the first user image to the exisiting array until you reach length of 3
      // then start replacing the first item in the array
      for (let index = 0; index < length; index++) {
        if(this.gearItemImages.length < 3){
          this.gearItemImages = [...this.gearItemImages, { ID: uuid(), name: filesObj[index].name, size: filesObj[index].size, type: filesObj[index].type }]
        }
        // If the on hand image array already has 3 items, start replacing existing items with user defined items
        else{
          for (let index = 0; index < length; index++) {
            this.gearItemImages.splice(index, 1, { ID: uuid(), name: filesObj[index].name, size: filesObj[index].size, type: filesObj[index].type });        
          }
        }
      }
    }
    // we have a clean array
    else{
      for (let index = 0; index < length; index++) {
        this.gearItemImages = [
          ...this.gearItemImages,
          { ID: uuid(), name: filesObj[index].name, size: filesObj[index].size, type: filesObj[index].type }
        ];      
      }
    }
    this.gearItemForm.controls['images'].setValue(this.gearItemImages); 
  }

  // Removes user defined image from the uploaded array of images
  onRemoveImage(image: GearImage){
    this.gearItemImages = this.gearItemImages.filter(i => i.ID !== image.ID);
  }

  // Hides the div html control that hosts uploaded images if user has not yet uploaded any images
  hideIfEmpty(){    
    if(this.gearItemImages.length === 0){
      return '0px';
    }
  }

  // Initializes the form based on the 'editMode' the component is in
  initForm(): void{
    let name: string = '';
    let price: number = null;
    let sizes: GearSize[] = this.gearSizes;
    let images: GearImage[] = [];
    let inStock = this.isInStock;    

    if(this.editMode){
      let gearItem: GearItem = Object.assign({}, this.gearItem);

       name = gearItem.name;
       price = gearItem.price;
       sizes = gearItem.sizes;
       inStock = gearItem.inStock;
       images = gearItem.images;

    }

    this.gearItemForm = this.fb.group({
      name: this.fb.control(name, Validators.required),
      price: this.fb.control(price, Validators.required),
      sizes: this.fb.control(sizes, this.requireSize()),
      inStock: this.fb.control(inStock),
      images: this.fb.control(images)
    })
  }
  
  // Validator for the form control 'sizes'
  requireSize(): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {     
      const anySelectedSizes = control.value.filter(gS => gS.available === true);   
      return anySelectedSizes.length > 0 ? null : { 'invalidSize': { value: control.value } };
    }
  }
}
