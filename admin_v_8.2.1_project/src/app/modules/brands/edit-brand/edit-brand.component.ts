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
  @Input() brand: any;

  public name: string = '';
  public isLoading$: any;
  public status: number = 1;
  public imagen_previsualiza: any = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  public file_imagen: any = null;

  constructor(
    public brandService: BrandService,
    public modal: NgbActiveModal,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.brandService.isLoading$;
    this.name = this.brand.name;
    this.status = this.brand.status;
    this.imagen_previsualiza = this.brand.imagen;
  }

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toastr.error('Validación', 'El archivo no es una imagen');
      return;
    }
    this.file_imagen = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_imagen);
    reader.onloadend = () => (this.imagen_previsualiza = reader.result);
    this.isLoadingView();
  }

  isLoadingView() {
    this.brandService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.brandService.isLoadingSubject.next(false);
    }, 50);
  }

  store() {
    if (!this.name) {
      this.toastr.error('Error.', 'El nombre de la marca es obligatorio.');
      return;
    }

    let data = {
      name: this.name,
      status: this.status,
    };

    let formData = new FormData();

    if (this.file_imagen) {
      formData.append('imagen', this.file_imagen);
    }

    this.brandService.updateBrands(this.brand.id, data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error.', 'Ya existe esta marca.');
        return;
      } else {
        if (this.file_imagen) {
          this.brandService.updateBrandsImg(this.brand.id, formData).subscribe((resp: any) => {
            this.file_imagen = null;
            this.imagen_previsualiza = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
            this.toastr.success('Correcto.', 'La marca se ha editado correctamente.');
            this.modal.close();
          });
        } else {
          this.BrandE.emit(resp.brand);
          this.toastr.success('Correcto.', 'La marca se ha editado correctamente.');
          this.modal.close();
        }
      }
    });
  }
}
