import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Size, GearItem } from 'src/app/core/models/gear-item..model';
import { ActivatedRoute } from '@angular/router';
import { MerchandiseService } from 'src/app/core/services/merchandise/merchandise.service';
import { tap } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-merchandise-dialog',
  templateUrl: './merchandise-dialog.component.html',
  styleUrls: ['./merchandise-dialog.component.scss']
})
export class MerchandiseDialogComponent implements OnInit {
  editMode: boolean = false;
  gearItemForm: FormGroup;  
  gearItemID: number;
  selectedFileFormData: FormData;
  selectedFilesForUpload: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private merchandiseService: MerchandiseService,
    private dialogRef: MatDialogRef<MerchandiseDialogComponent>
    ) { }

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

  onCancel(){
    this.dialogRef.close();
  }

  onFileSelected(event){
    this.selectedFilesForUpload = <File>event.target.files;
  }

  initForm(): void{
    let name: string = '';
    let price: number = null;
    let sizes: Size[] = null;
    let inStock: boolean = false;
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
      inStock: this.fb.control(inStock, Validators.required),
      imageUrl: this.fb.control(imageUrl, Validators.required)
    })

  }

}
