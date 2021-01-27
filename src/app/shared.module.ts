import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

//Material
import { MaterialModule } from './material/material.module';
import { ToastrModule } from "ngx-toastr";
import { ConfirmComponent } from './components/confirm/confirm.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        MDBBootstrapModule.forRoot(),
        ToastrModule.forRoot(),
     ],
    declarations: [
      ConfirmComponent,
      LoadingComponent
    ],
    exports: [
        MaterialModule,
        MDBBootstrapModule,
        ToastrModule,
        LoadingComponent,
        ConfirmComponent
    ]
})
export class SharedModule {}
