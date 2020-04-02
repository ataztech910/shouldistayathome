import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrawcanvasComponent } from './drawcanvas/drawcanvas.component';

const routes: Routes = [
  { path: '', component: DrawcanvasComponent},
  { path: ':id', component: DrawcanvasComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
