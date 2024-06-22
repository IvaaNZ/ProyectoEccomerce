import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CouponService } from '../service/coupon.service';

@Component({
  selector: 'app-delete-coupon',
  templateUrl: './delete-coupon.component.html',
  styleUrls: ['./delete-coupon.component.scss']
})
export class DeleteCouponComponent {

  @Input() coupon:any;
  @Output() CouponD:EventEmitter<any> = new EventEmitter();

  isLoading:any;
  constructor(
    public couponsService: CouponService,
    public toastr: ToastrService,
    public modal: NgbActiveModal,
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.couponsService.isLoading$;
  }
  delete(){
    this.couponsService.deleteCoupon(this.coupon.id).subscribe((resp:any) => {
      if (resp.message == 403) {
        this.toastr.error('Error', resp.message_text);
      }else{
        this.CouponD.emit({message: 200});
        this.toastr.success('Correcto', 'La Categoría se eliminó correctamente.');
        this.modal.close();

      }
    })
  }
}
