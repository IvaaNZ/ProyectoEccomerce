import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateVariationSpecificationsComponent } from './attributes/create-variation-specifications/create-variation-specifications.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { ProductsComponent } from './products.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {
        path: 'register',
        component: CreateProductComponent,
      },
      {
        path: 'list',
        component: ListProductsComponent,
      },
      {
        path: 'list/edit/:id',
        component: EditProductComponent,
      },
      {
        path: 'list/variations-specifications/:id',
        component: CreateVariationSpecificationsComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
