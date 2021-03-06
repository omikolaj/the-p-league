import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatChipList } from '@angular/material/chips';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as cloneDeep from 'clone-deep';
import { of, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { GearImage } from 'src/app/core/models/merchandise/gear-image.model';
import { GearItem } from 'src/app/core/models/merchandise/gear-item.model';
import { GearSize, gearSizesArray, Size } from 'src/app/core/models/merchandise/gear-size.model';
import { EventBusService, Events } from 'src/app/core/services/event-bus/event-bus.service';
import { MerchandiseService } from 'src/app/core/services/merchandise/merchandise.service';
import { GearItemUpload, ROUTER_OUTLET } from 'src/app/shared/constants/the-p-league-constants';
import { NoSizeErrorStateMatcher } from './NoSizeErrorStateMatcher';

@Component({
	selector: 'app-merchandise-dialog',
	templateUrl: './merchandise-dialog.component.html',
	styleUrls: ['./merchandise-dialog.component.scss'],
	animations: [
		trigger('imageUpload', [
			transition('* => *', [
				query(
					':enter',
					[
						style({ opacity: 0, transform: 'translateY(-100%)' }),
						stagger(290, [animate('.3s ease-in-out', style({ opacity: 1, transform: 'translateY(-3%)' }))])
					],
					{ optional: true }
				),
				query(
					':leave',
					[
						style({ opacity: 1, transform: 'translateX(0)' }),
						animate('.3s cubic-bezier(.34,-0.39,.7,1.5)', style({ opacity: 0, transform: 'translateX(-30%)' }))
					],
					{ optional: true }
				)
			])
		])
	]
})
export class MerchandiseDialogComponent implements OnInit, OnDestroy {
	gearItem: GearItem;
	editMode = false;
	gearItemForm: FormGroup;
	selectedFileFormData: FormData = new FormData();
	gearItemImages: GearImage[] = [];
	noSizesSelectedStateMatcher: ErrorStateMatcher = new NoSizeErrorStateMatcher();
	subscription: Subscription;
	gearSizes: GearSize[] = [];
	isInStock = true;
	sizeEnum = Size;
	isLoading$ = this.merchandiseService.loading$;
	@ViewChild(MatChipList) matChipList: MatChipList;
	unsubscribed$ = new Subject<void>();

	testChips = [
		{ color: 'warn', size: 'M', selected: true },
		{ color: 'warn', size: 'L', selected: true }
	];

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private merchandiseService: MerchandiseService,
		private dialogRef: MatDialogRef<MerchandiseDialogComponent>,
		private eventBus: EventBusService
	) {
		// Initialize all of the available gear sizes
		this.gearSizes = [...gearSizesArray];
	}

	ngOnInit(): void {
		this.subscription = this.eventBus.on(Events.CloseOpen, (closeDialog) => {
			if (closeDialog) {
				this.dialogRef.close();
			}
		});

		this.route.children[0].firstChild.children
			.filter((r) => r.outlet === ROUTER_OUTLET)
			.map((r) =>
				r.params
					.pipe(
						takeUntil(this.unsubscribed$),
						switchMap((params) => {
							this.editMode = params['id'] !== undefined;
							if (this.editMode) {
								return this.merchandiseService.findGearItem(+params['id']);
							}
							return of({});
						}),
						tap((gearItem: GearItem) => {
							this.gearItem = cloneDeep(gearItem);
						})
					)
					.subscribe((_) => this.initForm())
			);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.unsubscribed$.next();
		this.unsubscribed$.complete();
	}

	onSubmit(): void {
		this.dialogRef.close();
		const gearItem: GearItem = this.gearItemObjectForDelivery();
		if (this.editMode) {
			this.merchandiseService.updateGearItem(gearItem);
		} else {
			this.merchandiseService.createGearItem(gearItem);
		}
	}

	gearItemObjectForDelivery(): GearItem {
		const gearItemImages: GearImage[] = this.editMode ? this.gearItemImages.filter((gearImage) => gearImage.id !== undefined) : [];

		const gearItemForDelivery: GearItem = {
			name: this.gearItemForm.value.name,
			price: this.gearItemForm.value.price,
			sizes: this.gearItemForm['controls'].sizes['controls'].map((formGroup: FormGroup) => formGroup.value),
			inStock: this.gearItemForm.value.inStock,
			images: gearItemImages
		};

		if (this.editMode) {
			gearItemForDelivery.id = this.gearItem.id;
		}

		gearItemForDelivery.formData = this.selectedFileFormData;

		gearItemForDelivery.formData.append('gearItem', JSON.stringify(gearItemForDelivery));

		return gearItemForDelivery;
	}

	// Controls the text that displays next the slide toggle
	onSlideChange(): void {
		this.gearItem.inStock = !this.gearItem.inStock;
	}

	// Re-runs the validations for the sizes control which is mat-chip-list to display error messages
	onSelectedChipSize(sizeGroup: FormGroup, sizeIndex: number): void {
		// const formArray = this.gearItemForm['controls'].sizes as FormArray;
		// const sizeFormGroup = formArray.at(sizeIndex) as FormGroup;
		// sizeFormGroup.patchValue({ available: !sizeFormGroup.value.available });
		sizeGroup.patchValue({ available: !sizeGroup.value.available });

		this.gearItemForm.controls['sizes'].updateValueAndValidity();
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onFileSelected(event): void {
		// this.selectedFileFormData = new FormData();
		const length = event.target.files.length < 3 ? event.target.files.length : 3;
		const filesObj = event.target.files as File;

		// If we have 3 items in the array
		if (this.gearItemImages.length === 3) {
			// Copy over the old array and create a new reference to the new array
			this.gearItemImages = [...this.gearItemImages];
			// Loop through the total number of images that user is trying to upload
			// and replace the first item in the array with the first item from the user
			// defined array
			for (let index = 0; index < length; index++) {
				this.gearItemImages.splice(index, 1, {
					name: filesObj[index].name,
					size: filesObj[index].size,
					type: filesObj[index].type,
					previewId: index
				});

				const tempImage = filesObj[index];
				tempImage.previewId = index;

				this.selectedFileFormData.append(GearItemUpload.GearImages, tempImage);
			}
		} else if (this.gearItemImages.length > 0 && this.gearItemImages.length < 3) {
			this.gearItemImages = [...this.gearItemImages];
			// Loop through the total number of images that user is trying to upload
			// and add the first user image to the exisiting array until you reach length of 3
			// then start replacing the first item in the array
			for (let index = 0; index < length; index++) {
				// if the existing array already has 3 items we will just stop accepting new images
				if (this.gearItemImages.length < 3) {
					this.gearItemImages = [
						{
							name: filesObj[index].name,
							size: filesObj[index].size,
							type: filesObj[index].type,
							previewId: index
						},
						...this.gearItemImages
					];

					const tempImage = filesObj[index];
					tempImage.previewId = index;

					this.selectedFileFormData.append(GearItemUpload.GearImages, tempImage);
				}
			}
		} else {
			for (let index = 0; index < length; index++) {
				this.gearItemImages = [
					...this.gearItemImages,
					{
						name: filesObj[index].name,
						size: filesObj[index].size,
						type: filesObj[index].type,
						previewId: index
					}
				];

				const tempImage = filesObj[index];
				tempImage.previewId = index;

				this.selectedFileFormData.append(GearItemUpload.GearImages, tempImage);
			}
		}
	}

	// Removes user defined image from the uploaded array of images
	onRemoveImage(image: GearImage): void {
		const index = this.gearItemImages.map((gI) => gI.name).indexOf(image.name);
		if (index > -1) {
			this.gearItemImages.splice(index, 1);

			const newList = this.selectedFileFormData.getAll(GearItemUpload.GearImages).filter((file: any) => {
				return file.previewId !== image.previewId;
			});

			this.selectedFileFormData = new FormData();
			newList.forEach((file) => {
				this.selectedFileFormData.append(GearItemUpload.GearImages, file);
			});
		}
	}

	// Hides the div html control that hosts uploaded images if user has not yet uploaded any images
	hideIfEmpty(): string {
		if (this.gearItemImages === undefined) {
			this.gearItemImages = [];
		}
		if (this.gearItemImages.length === 0) {
			return '0px';
		}
	}

	// Initializes the form based on the 'editMode' the component is in
	initForm(): void {
		let name = '';
		let price: number = null;
		let sizes: GearSize[] = this.gearSizes;
		let images: GearImage[] = [];
		let inStock = this.isInStock;

		if (this.editMode) {
			name = this.gearItem.name;
			price = this.gearItem.price;
			inStock = this.gearItem.inStock;
			images = this.gearItem.images;
			// sizes in this context represent the individual gearItem sizes, and if they are available or not
			sizes = this.gearItem.sizes;

			// Set the gearItemImages array to display images for editing
			this.gearItemImages = this.gearItem.images;
		}

		const sizesForm: FormGroup[] = [];
		for (let index = 0; index < sizes.length; index++) {
			sizesForm.push(this.initGearSizeForm(sizes[index]));
		}

		this.gearItemForm = this.fb.group({
			name: this.fb.control(name, Validators.required),
			price: this.fb.control(price, Validators.required),
			sizes: this.fb.array(sizesForm, this.requireSize()),
			inStock: this.fb.control(inStock),
			images: this.fb.control(images)
		});
	}

	initGearSizeForm(gearSize: GearSize): FormGroup {
		return this.fb.group({
			id: this.fb.control(gearSize.id),
			size: this.fb.control(gearSize.size),
			available: this.fb.control(gearSize.available),
			color: this.fb.control(gearSize.color)
		});
	}

	// Validator for the form control 'sizes'
	requireSize(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const anySelectedSizes = control.value.filter((size: GearSize) => size.available === true);
			if (anySelectedSizes.length > 0) {
				control.markAsTouched();
				return null;
			} else {
				return { invalidSize: { value: 'Please select a size' } };
			}
		};
	}
}
