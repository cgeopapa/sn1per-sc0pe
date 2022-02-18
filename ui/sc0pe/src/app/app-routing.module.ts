import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewScanComponent } from './new-scan/new-scan.component';

const routes: Routes = [
  {path: "", component: NewScanComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
