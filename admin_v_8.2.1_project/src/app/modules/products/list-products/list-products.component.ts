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

  products:any = [];
  search:string = '';
  totalPages:number = 0;
  currentPage:number = 1;
  isLoading$:any;
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
  }

  listProducts(page = 1){
    this.productService.listProducts(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.products = resp.products.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    }, (err:any)=>{
      console.log(err);
      this.toastr.error('API RESPONSE - Comunícate con el Desarrollador.', err.error.message);
    })
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

    modelRef.componentInstance.Product.subscribe((resp:any) => {
      let INDEX = this.products.findIndex((item:any) => item.id == product.id);
      if (INDEX != -1) {
        this.products.splice(INDEX, 1);
      }
    })
  }
}
