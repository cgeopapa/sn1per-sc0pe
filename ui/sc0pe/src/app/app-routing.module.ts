import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TerminalComponent } from './terminal/terminal.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "terminal", component: TerminalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
