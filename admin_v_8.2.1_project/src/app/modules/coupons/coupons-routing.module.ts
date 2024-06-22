import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponsComponent } from './coupons.component';
import { CreateCouponComponent } from './create-coupon/create-coupon.component';
import { EditCouponComponent } from './edit-coupon/edit-coupon.component';
import { ListCouponComponent } from './list-coupon/list-coupon.component';

const routes: Routes = [
  {
    path: '',
    component: CouponsComponent,
    children: [
      {
        path: 'register',
        component: CreateCouponComponent,
      },
      {
        path: 'list',
        component: ListCouponComponent,
      },
      {
        path: 'list/edit/:id',
        component: EditCouponComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
