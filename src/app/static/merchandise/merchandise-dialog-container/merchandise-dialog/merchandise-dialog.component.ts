import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Size, GearItem } from 'src/app/core/models/gear-item.model';
import { ActivatedRoute } from '@angular/router';
import { MerchandiseService } from 'src/app/core/services/merchandise/merchandise.service';
import { tap } from 'rxjs/operators';
import { MatDialogRef, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { GearSize } from 'src/app/core/models/gear-size.model';
import { v4 as uuid } from 'uuid';

import {ThemePalette} from '@angular/material/core';
import { StoreImage } from 'src/app/core/models/store-image.model';
// import { requireSizes } from './merchandise-dialog.validators';
export interface ChipColor {
  name: string;
  color: ThemePalette;
}

@Component({
  selector: 'app-merchandise-dialog',
  templateUrl: './merchandise-dialog.component.html',
  styleUrls: ['./merchandise-dialog.component.scss']
})
export class MerchandiseDialogComponent implements OnInit {  
  gearItemID: number; 
  editMode: boolean = false; 
  gearItemForm: FormGroup;  
  selectedFileFormData: FormData;
  gearItemImages: StoreImage[] = [];  
  
  selectedChipGearSizes: GearSize[] = [];
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
          this.gearItemID = +params['id'];
        }        
      ))

    this.initForm();
  }

  // Controls the text that displays next the slide toggle
  onSlideChange(){
    this.isInStock = !this.isInStock;
  }

  onSelectedChipSize(gearSize: GearSize, form){           
    // If item found in existing array
    if(this.selectedChipGearSizes.find((gS: GearSize) => gS.size === gearSize.size)){        
      this.selectedChipGearSizes = this.selectedChipGearSizes.filter((gS: GearSize) => gS.size !== gearSize.size)   
      console.log("[IF] selected chip gear sizes: ", this.selectedChipGearSizes);      
    }
    // If new item
    else{
      const gearSizeObj: GearSize = Object.assign({}, gearSize);
      gearSizeObj.available = true;
      this.selectedChipGearSizes = [
        ...this.selectedChipGearSizes,
        gearSizeObj
      ]      
      console.log('[ELSE] Selected Chip Size Is: ', this.selectedChipGearSizes);
    }
    // Manually re-validate the control
    form.controls['sizes'].updateValueAndValidity();
  }

  onCancel(){
    this.dialogRef.close();
  }

  onFileSelected(event){    
    const length = event.target.files.length < 3 ? event.target.files.length : 3;    
    const filesObj = <File>event.target.files
    
    // If we already have items in the array
    if(this.gearItemImages.length > 0){
      // Copy over the old array and create a new reference to the new array
      this.gearItemImages = [...this.gearItemImages];
      // Loop through the total number of images that user is trying to upload
      // and replace the first item in the array with the first item from the user
      // defined array
      for (let index = 0; index < length; index++) {
        this.gearItemImages.splice(index, 1, { ID: uuid(), name: filesObj[index].name, size: filesObj[index].size, type: filesObj[index].type });        
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
  }

  // Hides the div html control that hosts uploaded images if user has not yet uploaded any images
  hideIfEmpty(){    
    if(this.gearItemImages.length === 0){
      return 'none';
    }
  }

  // Removes user defined image from the uploaded array of images
  onRemoveImage(image: StoreImage){   
    this.gearItemImages = this.gearItemImages.filter(i => i.ID !== image.ID);
  }

  // Initializes the form based on the 'editMode' the component is in
  initForm(): void{
    let name: string = '';
    let price: number = null;
    let sizes: GearSize[] = null;
    let inStock = this.isInStock;
    let imageUrl: string = '';

    if(this.editMode){
      let gearItem: GearItem;

      this.merchandiseService.gearItems$.pipe(
        tap(arr => gearItem = arr.find(g => g.ID === this.gearItemID))
      )

       name = gearItem.name;
       price = gearItem.price;
       sizes = gearItem.sizes;
       inStock = gearItem.inStock;
       imageUrl = gearItem.imageUrl;

    }

    this.gearItemForm = this.fb.group({
      name: this.fb.control(name, Validators.required),
      price: this.fb.control(price, Validators.required),
      sizes: this.fb.control(sizes, this.requireSizes()),
      inStock: this.fb.control(inStock),
      imageUrl: this.fb.control(imageUrl)
    })
  }
  
  // Validator for the form control 'sizes'
  requireSizes() : ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {      
      const anySelectedSizes = this.selectedChipGearSizes.filter(gS => gS.available === true)      
      return anySelectedSizes.length > 0 ? null : { 'invalidSize': { value: 'Please select a size' } };
    }
  }
}
