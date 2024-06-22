import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CouponService } from '../service/coupon.service';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.component.html',
  styleUrls: ['./edit-coupon.component.scss']
})
export class EditCouponComponent {

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

  public COUPON_ID:any;
  public COUPON_SELECTED:any;

  public status:number = 1;


  constructor(
    public couponsService: CouponService,
    private toastr: ToastrService,
    public activedRoute: ActivatedRoute,
  ){

  }

  ngOnInit(): void {
    this.isLoading$ = this.couponsService.isLoading$;
    this.couponsService.configCoupons().subscribe((resp: any) => {
      this.products = resp.products;
      this.categories_first = resp.categories;
      this.brands = resp.brands;
    });
    this.activedRoute.params.subscribe((resp: any) => {
      this.COUPON_ID = resp.id;
    });
      this.couponsService.showCoupon(this.COUPON_ID).subscribe((resp: any) => {
        console.log(resp);
  
        this.COUPON_SELECTED = resp.coupon;
        this.code = resp.coupon.code;
        this.type_discount = resp.coupon.type_discount;
        this.discount = resp.coupon.discount;
        this.type_count = resp.coupon.type_count;
        this.num_use = resp.coupon.num_use;
        this.type_coupon = resp.coupon.type_coupon;
        this.status = resp.coupon.status;
        this.categories_add = resp.coupon.categories;
        this.products_add = resp.coupon.products;
        this.brands_add = resp.coupon.brands;

        //Estas condiciones son para que se muestre el Producto que estamos editando:
        // Comprobamos si hay algún producto en la lista products_add
        if (this.products_add.length > 0) { 
        // En caso que haya algún producto en la lista
        // se le asigna el ID del primer producto a product_id
          this.product_id = this.products_add[0].id; 
        }
      
        if (this.categories_add.length > 0) {
          this.categorie_id = this.categories_add[0].id;
        }
        if (this.brands_add.length > 0) {
          this.brand_id = this.brands_add[0].id;
        }
      });
  
  }


  changeTypeDiscount(value:number){
    this.type_discount = value;
  }

  changeTypeCount(value:number){
    this.type_count = value;
  }

  changeTypeCoupon(value:number){
    this.type_coupon = value;
    
    // Verificamos si el tipo de cupon es 1 
    // y tambien si es hay un producto en la lista products_add
    if (this.type_coupon == 1 && this.products_add.length > 0) { 
    // Si se cumple la condición
    // se le asigna el ID del primer producto a product_id
      this.product_id = this.products_add[0].id; 
    }else {
    // Y si no se cumple la condición, se le asigna null a product_id
      this.product_id = null; 
    }
  
    if (this.type_coupon == 2 && this.categories_add.length > 0) {
      this.categorie_id = this.categories_add[0].id;
    } else {
      this.categorie_id = null;
    }
    
    if (this.type_coupon == 3 && this.brands_add.length > 0) {
      this.brand_id = this.brands_add[0].id;
    } else {
      this.brand_id = null;
    }
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

      product_selected: this.products_add,
      categorie_selected: this.categories_add,
      brand_selected: this.brands_add,
      status: this.status,
    }

    this.couponsService.updateCoupons(this.COUPON_ID,data).subscribe((resp:any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error('Error', resp.message_text);
      }else{
        this.toastr.success('Correcto', 'El cupón se ha editado correctamente.');
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
