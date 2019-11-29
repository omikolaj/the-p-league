import { Directive, OnInit, OnDestroy, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RolesService } from '../../services/roles/roles.service';

@Directive({
	selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {
	// the role the user must have
	@Input() appHasRole: string;

	stop$ = new Subject();

	isVisible = false;

	/**
	 * @param viewContainerRef
	 * 	-- the location where we need to render the templateRef
	 * @param templateRef
	 *   -- the templateRef to be potentially rendered
	 * @param rolesService
	 *   -- will give us access to the roles a user has
	 */
	constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>, private rolesService: RolesService) {}

	ngOnInit() {
		//  We subscribe to the roles$ to know the roles the user has
		this.rolesService.roles$.pipe(takeUntil(this.stop$)).subscribe((roles) => {
			// If he doesn't have any roles, we clear the viewContainerRef
			if (!roles) {
				this.viewContainerRef.clear();
			}
			// If the user has the role needed to
			// render this component we can add it
			if (roles.includes(this.appHasRole)) {
				// If it is already visible (which can happen if
				// his roles changed) we do not need to add it a second time
				if (!this.isVisible) {
					// We update the `isVisible` property and add the
					// templateRef to the view using the
					// 'createEmbeddedView' method of the viewContainerRef
					this.isVisible = true;
					this.viewContainerRef.createEmbeddedView(this.templateRef);
				}
			} else {
				// If the user does not have the role,
				// we update the `isVisible` property and clear
				// the contents of the viewContainerRef
				this.isVisible = false;
				this.viewContainerRef.clear();
			}
		});
	}

	// Clear the subscription on destroy
	ngOnDestroy() {
		this.stop$.next();
	}
}
