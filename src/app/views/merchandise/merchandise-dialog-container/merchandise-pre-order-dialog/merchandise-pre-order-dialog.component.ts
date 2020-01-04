import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { switchMap, tap } from 'rxjs/operators';
import { GearItem } from 'src/app/core/models/merchandise/gear-item.model';
import { Size } from 'src/app/core/models/merchandise/gear-size.model';
import { PreOrderForm } from 'src/app/core/models/merchandise/pre-order-form.model';
import { MerchandiseService } from 'src/app/core/services/merchandise/merchandise.service';
import { PreOrderService } from 'src/app/core/services/pre-order/pre-order.service';
import { ROUTER_OUTLET } from 'src/app/shared/constants/the-p-league-constants';

@Component({
	selector: 'app-merchandise-pre-order-dialog',
	templateUrl: './merchandise-pre-order-dialog.component.html',
	styleUrls: ['./merchandise-pre-order-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [PreOrderService]
})
export class MerchandisePreOrderDialogComponent implements OnInit {
	preOrderForm: FormGroup = this.fb.group({
		firstName: this.fb.control(null, Validators.required),
		lastName: this.fb.control(null, Validators.required),
		phoneNumber: this.fb.control(null, [Validators.required, Validators.pattern('[0-9]{0,10}')]),
		email: this.fb.control(null, [Validators.required, Validators.email]),
		orderDetails: this.fb.group({
			quantity: this.fb.control(1, Validators.required),
			size: this.fb.control(null, Validators.required)
		}),
		contactPreference: this.fb.group({
			cellOrEmail: this.fb.control(1)
		})
	});
	gearItem: GearItem;
	sizeEnum = Size;
	preOrderdItem$ = this.preOrderService.preOrder$;
	isLoading$ = this.preOrderService.loading$;

	constructor(
		private fb: FormBuilder,
		private dialogRef: MatDialogRef<MerchandisePreOrderDialogComponent>,
		private route: ActivatedRoute,
		private merchandiseService: MerchandiseService,
		private preOrderService: PreOrderService
	) {}

	ngOnInit(): void {
		this.route.children[0].firstChild.children
			.filter((r) => r.outlet === ROUTER_OUTLET)
			.map((r) =>
				r.params
					.pipe(
						switchMap((params) => {
							return this.merchandiseService.findGearItem(+params['id']);
						}),
						tap((gearItem: GearItem) => {
							this.gearItem = cloneDeep(gearItem);
						})
					)
					.subscribe()
			);
	}

	onSubmit(): void {
		const preOrderForm: PreOrderForm = {
			quantity: this.preOrderForm.value.orderDetails.quantity,
			size: this.preOrderForm.value.orderDetails.size,
			gearItemId: this.gearItem.id,
			contact: {
				firstName: this.preOrderForm.value.firstName,
				lastName: this.preOrderForm.value.lastName,
				email: this.preOrderForm.value.email,
				phoneNumber: this.preOrderForm.value.phoneNumber,
				preferredContact: +this.preOrderForm.value.contactPreference.cellOrEmail
			}
		};
		this.preOrderService.preOrderGearItem(preOrderForm);
	}

	computeTotalPrice(): number {
		return this.gearItem.price * this.preOrderForm.value.orderDetails.quantity;
	}

	onCancel(): void {
		this.dialogRef.close();
	}
}
