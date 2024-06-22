import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDiscountComponent } from './create-discount/create-discount.component';
import { DiscountComponent } from './discount.component';
import { EditDiscountComponent } from './edit-discount/edit-discount.component';
import { ListDiscountComponent } from './list-discount/list-discount.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountComponent,
    children: [
      {
        path: 'register',
        component: CreateDiscountComponent
      },
      {
        path: 'list/edit/:id',
        component: EditDiscountComponent
      },
      {
        path: 'list',
        component: ListDiscountComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountRoutingModule { }
