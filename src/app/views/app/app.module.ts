import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import {SelectDataService} from '../../containers/forms/select/select.data.service';
import {SelectComponent} from '../../containers/forms/select/select.component';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {CustomInputsComponent} from '../../containers/forms/custom-inputs/custom-inputs.component';


@NgModule({
  declarations: [BlankPageComponent, AppComponent, SelectComponent, CustomInputsComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
  ],
  providers: [SelectDataService]
})
export class AppModule { }

