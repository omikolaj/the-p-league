import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule, MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faArrowRight, faBasketballBall, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { ActingSpinnerComponent } from './components/acting-spinner/acting-spinner/acting-spinner.component';
import { GalleryViewerComponent } from './components/gallery-viewer/gallery-viewer.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner/loading-spinner.component';
import { SessionSchedulesComponent } from './components/session-schedules/session-schedules.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { AllowSpacesDirective } from './directives/allow-space/allow-spaces.directive';
import { CdkDetailRowDirective } from './directives/cdk-detail-row/cdk-detail-row.directive';
import { ClearElementValueDirective } from './directives/clear-element-value/clear-element-value.directive';
import { HasRoleDirective } from './directives/has-role/has-role.directive';
import { IosVHDirective } from './directives/iosVH/ios-vh.directive';
import { ListItemComponentDirective } from './directives/list-item-component/list-item-component.directive';
import { TeamSwapDirective } from './directives/team-swap/team-swap.directive';
import { EnumToArrayPipe } from './pipes/enumToArray/enum-to-array.pipe';
import { FilteredGearSizesPipe } from './pipes/filteredGearSizes/filtered-gear-sizes.pipe';
import { GearImageViewPipe } from './pipes/gear-image-view/gear-image-view.pipe';
import { LogPipe } from './pipes/log/log.pipe';
import { FromUnixPipe } from './pipes/momentjs/from-unix.pipe';
import { OrderEnumPipe } from './pipes/order-enum.pipe';

// This is used for controling the Angular ripples effect globally
// https://material.angular.io/components/ripple/api
const globalRippleConfig: RippleGlobalOptions = {
	terminateOnPointerUp: false
};

@NgModule({
	providers: [{ provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig }],
	declarations: [
		GalleryViewerComponent,
		SnackBarComponent,
		SessionSchedulesComponent,

		// Directives
		AllowSpacesDirective,
		ClearElementValueDirective,
		HasRoleDirective,
		IosVHDirective,
		ListItemComponentDirective,

		// Pipes
		OrderEnumPipe,
		LogPipe,
		GearImageViewPipe,
		FilteredGearSizesPipe,
		EnumToArrayPipe,
		TeamSwapDirective,
		FromUnixPipe,
		CdkDetailRowDirective,
		ActingSpinnerComponent,
		LoadingSpinnerComponent
	],
	imports: [
		// Material
		MatAutocompleteModule,
		MatButtonModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDialogModule,
		MatDividerModule,
		MatExpansionModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatMomentDateModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatStepperModule,
		MatTableModule,
		MatSortModule,
		MatTabsModule,
		MatToolbarModule,
		MatTableModule,
		MatSortModule,

		// CDKs
		DragDropModule,

		// font awesome
		FontAwesomeModule,

		// flex layout
		FlexLayoutModule,

		// gallery
		NgxGalleryModule,
		ReactiveFormsModule,
		CommonModule
	],
	exports: [
		// Material
		MatAutocompleteModule,
		MatButtonModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDialogModule,
		MatDividerModule,
		MatExpansionModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatStepperModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTableModule,
		MatSortModule,
		MatMomentDateModule,

		// CDKs
		DragDropModule,

		// font awesome
		FontAwesomeModule,

		// flex layout
		FlexLayoutModule,

		// Gallery
		ReactiveFormsModule,
		CommonModule,

		// Components
		LoadingSpinnerComponent,
		SessionSchedulesComponent,
		ActingSpinnerComponent,
		GalleryViewerComponent,

		// Directives
		AllowSpacesDirective,
		ClearElementValueDirective,
		HasRoleDirective,
		IosVHDirective,
		ListItemComponentDirective,
		TeamSwapDirective,
		CdkDetailRowDirective,

		// Pipes
		OrderEnumPipe,
		LogPipe,
		GearImageViewPipe,
		FilteredGearSizesPipe,
		EnumToArrayPipe,
		FromUnixPipe
	],
	entryComponents: [SnackBarComponent]
})
export class SharedModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faGithub, faInstagram, faTwitter, faPlayCircle, faBasketballBall, faArrowLeft, faArrowRight);
	}
}
