import { Component, OnInit, Predicate } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Size, GearItem } from 'src/app/core/models/gear-item.model';
import { ActivatedRoute } from '@angular/router';
import { MerchandiseService } from 'src/app/core/services/merchandise/merchandise.service';
import { tap } from 'rxjs/operators';
import { MatDialogRef, MatChip } from '@angular/material';
import { GearSize } from 'src/app/core/models/gear-size.model';

import {ThemePalette} from '@angular/material/core';
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
  selectedFilesForUpload: any;  
  
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

  onSlideChange(){
    this.isInStock = !this.isInStock;
  }

  onSelectedChipSize(gearSize: GearSize){
    console.log('GearSize is: ', gearSize)
    const predicate: (gs: GearSize) => boolean = (gS: GearSize) => gS.size === gearSize.size;
    this.selectedChipGearSizes.forEach(predicate);
    if(this.selectedChipGearSizes.find(predicate)){
      this.selectedChipGearSizes = this.selectedChipGearSizes.filter(predicate)
      console.log('Selected chip sizes in the if: ', this.selectedChipGearSizes);
    }
    else{
      this.selectedChipGearSizes = [
        ...this.selectedChipGearSizes,
        gearSize
      ]
      console.log('Selected chip sizes in else: ', this.selectedChipGearSizes);
    }
  }

  onCancel(){
    this.dialogRef.close();
  }

  onFileSelected(event){
    this.selectedFilesForUpload = <File>event.target.files;
  }

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
      sizes: this.fb.control(sizes, Validators.required),
      inStock: this.fb.control(inStock),
      imageUrl: this.fb.control(imageUrl)
    })

  }

}
