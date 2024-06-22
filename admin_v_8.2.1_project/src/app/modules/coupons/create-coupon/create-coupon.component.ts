import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CouponService } from '../service/coupon.service';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss']
})
export class CreateCouponComponent {

  public code:any;
  public type_discount:number = 1;
  public discount:number = 0;

  public type_count:number = 1;
  public num_use:number = 0;

  public type_coupon:number = 1;
  public product_id:any;
  public brand_id:any;
  public categorie_id:any;
  
  
  public isLoading$:any;
  
  public products:any = [];
  public categories_first:any = [];
  public brands:any = [];

  public products_add:any = [];
  public categories_add:any = [];
  public brands_add:any = [];

  constructor(
    public couponsService: CouponService,
    private toastr: ToastrService,
  ){

  }

  ngOnInit(): void {

    this.isLoading$ = this.couponsService.isLoading$;
    this.couponsService.configCoupons().subscribe((resp:any) => {
      this.products = resp.products;
      this.categories_first = resp.categories;
      this.brands = resp.brands;
    })
  }

  changeTypeDiscount(value:number){
    this.type_discount = value;
  }

  changeTypeCount(value:number){
    this.type_count = value;
  }

  changeTypeCoupon(value:number){
    this.type_coupon = value;
    this.products_add = [];
    this.categories_add = [];
    this.brands_add = [];
    this.product_id = null;
    this.categorie_id = null;
    this.brand_id = null;
  }

  save(){

    if (!this.code || !this.discount) {
      this.toastr.error('Error','Necesitas llenar todos los campos.')
      return;
    }

    if (this.type_count == 2 && this.num_use == 0) {
      this.toastr.error('Error','Necesitas poner una cantidad de usos al cupón.')
      return;
    }

    if (this.type_coupon == 1 && this.products_add.length == 0) {
      this.toastr.error('Error','Necesitas seleccionar uno o varios productos.')
      return;
    }

    if (this.type_coupon == 2 && this.categories_add.length == 0) {
      this.toastr.error('Error','Necesitas seleccionar una o varias categorías.')
      return;
    }

    if (this.type_coupon == 3 && this.brands_add.length == 0) {
      this.toastr.error('Error','Necesitas seleccionar una o varias marcas.')
      return;
    }

    let data = {
      type_count: this.type_count,
      type_coupon: this.type_coupon,
      type_discount: this.type_discount,
      num_use: this.num_use,
      discount: this.discount,
      code: this.code,
      product_selected:this.products_add,
      categorie_selected:this.categories_add,
      brand_selected:this.brands_add,
    }

    this.couponsService.createCoupons(data).subscribe((resp:any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error('Error', resp.message_text);
      }else{
        this.toastr.success('Correcto', 'El cupón se ha creado correctamente.');
        this.type_count = 1;
        this.type_coupon = 1;
        this.type_discount = 1;
        this.num_use = 0;
        this.discount = 0;
        this.code = null;
        this.products_add = [];
        this.categories_add = [];
        this.brands_add = [];
        this.product_id = null;
        this.categorie_id = null;
        this.brand_id = null;
      }
    })
  }

  addProduct(){

    if (!this.product_id) {
      this.toastr.error('Error', 'Es necesario seleccionar un producto.');
      return;
    }

    let INDEX = this.products_add.findIndex((prod:any) => prod.id == this.product_id);
    if (INDEX != -1) {
      this.toastr.error('Error', 'El producto que quieres agregar ya está en la lista.');
      return;
    }

    let DATA = this.products.find((product:any) => product.id == this.product_id);

    if (DATA) {
      this.products_add.push(DATA);
      return;
    }

  }

  addCategorie(){

    if (!this.categorie_id) {
      this.toastr.error('Error', 'Es necesario seleccionar una categoría.');
      return;
    }

    let INDEX = this.categories_add.findIndex((categ:any) => categ.id == this.categorie_id);
    if (INDEX != -1) {
      this.toastr.error('Error', 'La categoría que quieres agregar ya está en la lista.');
      return;
    }

    let DATA = this.categories_first.find((categorie:any) => categorie.id == this.categorie_id);

    if (DATA) {
      this.categories_add.push(DATA);
      
      return;
    }

  }

  addBrand(){

    if (!this.brand_id) {
      this.toastr.error('Error', 'Es necesario seleccionar una marca.');
      return;
    }

    let INDEX = this.brands_add.findIndex((bran:any) => bran.id == this.brand_id);
    if (INDEX != -1) {
      this.toastr.error('Error', 'La marca que quieres agregar ya está en la lista.');
      return;
    }

    let DATA = this.brands.find((brand:any) => brand.id == this.brand_id);

    if (DATA) {
      this.brands_add.push(DATA);
      
      return;
    }

  }


  removeProduct(product:any){

    let INDEX = this.products_add.findIndex((prod:any) => prod.id == product.id);
    if (INDEX != -1) {
      this.products_add.splice(INDEX,1);
      this.toastr.info('Alerta','Se ha quitado un producto de tu lista.')
    }

  }

  removeCategorie(categorie:any){

    let INDEX = this.categories_add.findIndex((categ:any) => categ.id == categorie.id);
    if (INDEX != -1) {
      this.categories_add.splice(INDEX,1);
      this.toastr.info('Alerta','Se ha quitado una categoría de tu lista.')
    }

  }
  removeBrand(brand:any){

    let INDEX = this.brands_add.findIndex((bran:any) => bran.id == brand.id);
    if (INDEX != -1) {
      this.brands_add.splice(INDEX,1);
      this.toastr.info('Alerta','Se ha quitado una marca de tu lista.')
    }

  }
}
