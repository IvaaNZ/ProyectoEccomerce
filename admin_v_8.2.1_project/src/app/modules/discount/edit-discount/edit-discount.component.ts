import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { URL_TIENDA } from 'src/app/config/config';
import { DiscountService } from '../service/discount.service';

@Component({
  selector: 'app-edit-discount',
  templateUrl: './edit-discount.component.html',
  styleUrls: ['./edit-discount.component.scss']
})
export class EditDiscountComponent {

  public type_discount:number = 1;
  public discount:number = 0;

  public type_campaing:number = 1;
  public discount_type:number = 1;
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

  public start_date:any;
  public end_date:any;
  public status:number = 1;

  public DISCOUNT_ID:any;
  public DISCOUNT_SELECTED:any;

  constructor(
    public discountService: DiscountService,
    private toastr: ToastrService,
    private activedRoute: ActivatedRoute,
  ){

  }

  ngOnInit(): void {

    this.isLoading$ = this.discountService.isLoading$;
    this.activedRoute.params.subscribe((resp:any) => {
      this.DISCOUNT_ID = resp.id;
    })

    this.discountService.showDiscount(this.DISCOUNT_ID).subscribe((resp:any) => {
      console.log(resp);

      this.DISCOUNT_SELECTED = resp.discount;

      this.discount_type = resp.discount.discount_type;
      this.type_discount = resp.discount.type_discount;
      this.discount = resp.discount.discount;
      this.start_date = resp.discount.start_date;
      this.end_date = resp.discount.end_date;
      this.type_campaing = resp.discount.type_campaing;
      this.products_add = resp.discount.products;
      this.categories_add = resp.discount.categories;
      this.brands_add = resp.discount.brands;
      this.status = resp.discount.status;

    })
    this.discountService.configDiscounts().subscribe((resp:any) => {
      this.products = resp.products;
      this.categories_first = resp.categories;
      this.brands = resp.brands;
    })
  }

  changeTypeDiscount(value:number){
    this.type_discount = value;
  }

  changeTypeCampaing(value:number){
    this.type_campaing = value;
  }

  changeTypeCoupon(value:number){
    this.discount_type = value;
    this.products_add = [];
    this.categories_add = [];
    this.brands_add = [];
    this.product_id = null;
    this.categorie_id = null;
    this.brand_id = null;
  }

  copyLink(product:any){
    var aux = document.createElement("input");
    aux.setAttribute("value",URL_TIENDA + '/product/' + product.slug + '?discount=' + this.DISCOUNT_SELECTED.code);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    this.toastr.info('Copiado', 'Se ha copiado un código correctamente')
  }

  save(){

    if (!this.discount || !this.start_date || !this.end_date) {
      this.toastr.error('Error','Necesitas llenar todos los campos.')
      return;
    }

    if (this.discount_type == 1 && this.products_add.length == 0) {
      this.toastr.error('Error','Necesitas seleccionar uno o varios productos.')
      return;
    }

    if (this.discount_type == 2 && this.categories_add.length == 0) {
      this.toastr.error('Error','Necesitas seleccionar una o varias categorías.')
      return;
    }

    if (this.discount_type == 3 && this.brands_add.length == 0) {
      this.toastr.error('Error','Necesitas seleccionar una o varias marcas.')
      return;
    }

    let data = {
      discount_type: this.discount_type,
      type_discount: this.type_discount,
      discount: this.discount,
      product_selected:this.products_add,
      categorie_selected:this.categories_add,
      brand_selected:this.brands_add,
      start_date: this.start_date,
      end_date: this.end_date,
      type_campaing: this.type_campaing,
      status: this.status,

    }

    this.discountService.updateDiscounts(this.DISCOUNT_ID,data).subscribe((resp:any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error('Error', resp.message_text);
      }else{
        this.toastr.success('Correcto', 'El descuento se ha editado correctamente.');
        // this.discount_type = 1;
        // this.type_discount = 1;
        // this.discount = 0;
        // this.products_add = [];
        // this.categories_add = [];
        // this.brands_add = [];
        // this.product_id = null;
        // this.categorie_id = null;
        // this.brand_id = null;
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
