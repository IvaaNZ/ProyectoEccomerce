import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCouponComponent } from '../delete-coupon/delete-coupon.component';
import { CouponService } from '../service/coupon.service';

@Component({
  selector: 'app-list-coupon',
  templateUrl: './list-coupon.component.html',
  styleUrls: ['./list-coupon.component.scss']
})
export class ListCouponComponent {

  coupons:any = [];
  search:string = '';
  totalPages:number = 0;
  currentPage:number = 1;

  isLoading$:any;
  constructor(
    public couponsService: CouponService,
    public modalService: NgbModal,
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listCoupons();
    this.isLoading$ = this.couponsService.isLoading$;
  }

  listCoupons(page = 1){
    this.couponsService.listCoupons(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.coupons = resp.coupons.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  searchTo(){
    this.listCoupons();
  }

  loadPage($event:any){
    console.log($event);
    this.listCoupons($event);
  }

  getNameTypeCoupon(type_coupon:number){
    let NAME = '';

    switch (type_coupon) {
      case 1:
        NAME = 'Products';
        break;
      case 2:
        NAME = 'Categories';
        break;
      case 3:
        NAME = 'Brands';
        break;
    
      default:
        break;
    }
    return NAME;
  }


  deleteCoupon(coupon:any){
    const modelRef = this.modalService.open(DeleteCouponComponent, {centered:true, size: 'md'});
    modelRef.componentInstance.coupon = coupon;

    modelRef.componentInstance.CouponD.subscribe((resp:any) => {
      let INDEX = this.coupons.findIndex((item:any) => item.id == coupon.id);
      if (INDEX != -1) {
        this.coupons.splice(INDEX, 1);
      }
    })
  }
}
