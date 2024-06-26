import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandsComponent } from './brands.component';
import { ListBrandComponent } from './list-brand/list-brand.component';

const routes: Routes = [
  {
    path: '',
    component: BrandsComponent,
    children: [
      {
        path: 'list',
        component: ListBrandComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandsRoutingModule { }
