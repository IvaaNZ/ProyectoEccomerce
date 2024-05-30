import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBrandComponent } from '../create-brand/create-brand.component';
import { DeleteBrandComponent } from '../delete-brand/delete-brand.component';
import { EditBrandComponent } from '../edit-brand/edit-brand.component';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-list-brand',
  templateUrl: './list-brand.component.html',
  styleUrls: ['./list-brand.component.scss']
})
export class ListBrandComponent {

  public brands:any = [];
  public search:string = '';
  public totalPages:number = 0;
  public currentPage:number = 1;

  public isLoading$:any;
  constructor(
    public brandService: BrandService,
    public modalService: NgbModal,
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listBrands();
    this.isLoading$ = this.brandService.isLoading$;
  }

  listBrands(page = 1){
    this.brandService.listBrands(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.brands = resp.brands;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  searchTo(){
    this.listBrands();
  }

  loadPage($event:any){
    console.log($event);
    this.listBrands($event);
  }


  openCreateBrand(){
    const modalRef = this.modalService.open(CreateBrandComponent, {centered:true, size: 'md'});

    modalRef.componentInstance.BrandC.subscribe((attrib:any) => {
      this.brands.unshift(attrib);
    })
  }

  openEditBrand(brand:any){
    const modalRef = this.modalService.open(EditBrandComponent, {centered:true, size: 'md'});
    modalRef.componentInstance.brand = brand;

    modalRef.componentInstance.BrandE.subscribe((attrib:any) => {
      // this.attributes.unshift(attrib);
      let INDEX = this.brands.findIndex((item:any) => item.id == attrib.id);

      if (INDEX != -1) {
        this.brands[INDEX] = attrib;
      }
    })
  }

  deleteBrand(brand:any){
    const modelRef = this.modalService.open(DeleteBrandComponent, {centered:true, size: 'md'});
    modelRef.componentInstance.brand = brand;

    modelRef.componentInstance.BrandD.subscribe((resp:any) => {
      let INDEX = this.brands.findIndex((item:any) => item.id == brand.id);
      if (INDEX != -1) {
        this.brands.splice(INDEX, 1);
      }
    })
  }

}
