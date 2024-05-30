import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent {

  public products:any = [];
  public search:string = '';
  public totalPages:number = 0;
  public currentPage:number = 1;
  public isLoading$:any;
  public marcas:any = [];
  public marca_id:string = '';
  public categorie_first_id:string = '';
  public categories_first:any = [];

  public categorie_second_id:string = '';
  public categorie_third_id:string = '';
  public categories_seconds:any = [];
  public categories_seconds_backs:any = [];
  public categories_thirds:any = [];
  public categories_thirds_backs:any = [];

  constructor(
    public productService: ProductService,
    public modalService: NgbModal,
    public toastr: ToastrService,
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listProducts();
    this.isLoading$ = this.productService.isLoading$;
    this.configAll();
  }

  configAll(){
    this.productService.configAll().subscribe((resp:any) => {
      console.log(resp);

      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
      this.categories_thirds = resp.categories_thirds;
    }, (err:any)=>{
      console.log(err);
      this.toastr.error('API RESPONSE - Comunícate con el Desarrollador.', err.error.message);
    })
  }

  listProducts(page = 1){
    let data = {
      search: this.search,
      brand_id: this.marca_id,
      categorie_first_id: this.categorie_first_id,
      categorie_second_id: this.categorie_second_id,
      categorie_third_id: this.categorie_third_id,
    }
    this.productService.listProducts(page,data).subscribe((resp:any) => {
      console.log(resp);
      this.products = resp.products.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    }, (err:any)=>{
      console.log(err);
      this.toastr.error('API RESPONSE - Comunícate con el Desarrollador.', err.error.message);
    })
  }
  changeDepartament(){
    this.categories_seconds_backs = this.categories_seconds.filter((item:any) => 
    item.categorie_second_id == this.categorie_first_id);
  }

  changeCategorie(){
    this.categories_thirds_backs = this.categories_thirds.filter((item:any) => 
    item.categorie_second_id == this.categorie_second_id);
  }

  searchTo(){
    this.listProducts();
  }

  loadPage($event:any){
    console.log($event);
    this.listProducts($event);
  }

  deleteProduct(product:any){
    const modelRef = this.modalService.open(DeleteProductComponent, {centered:true, size: 'md'});
    modelRef.componentInstance.product = product;

    modelRef.componentInstance.ProductD.subscribe((resp:any) => {
      let INDEX = this.products.findIndex((item:any) => item.id == product.id);
      if (INDEX != -1) {
        this.products.splice(INDEX, 1);
      }
    })
  }
}
