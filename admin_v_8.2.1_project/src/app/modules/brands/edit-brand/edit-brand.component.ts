import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent {

  @Output() BrandE: EventEmitter<any> = new EventEmitter();
  @Input() brand:any;

  public name: string = '';
  public isLoading$:any;
  public status:number = 1;

  constructor(
    public brandService: BrandService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.brandService.isLoading$;
    this.name = this.brand.name;
    this.status = this.brand.status;
  }

  store(){
    if (!this.name) {
      this.toastr.error('Error.', 'Todos los campos son necesarios.')
      return;
    }
    let data = {
      name: this.name,
      status: this.status,
    };
    this.brandService.updateBrands(this.brand.id,data).subscribe((resp:any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error.', 'Ya existe este nombre de Marca.')
        return;
      }else{
        this.BrandE.emit(resp.brand);
        this.toastr.success('Correcto.', 'La Marca se ha editado correctamente.');
        this.modal.close();

      }
    })
  }
}
