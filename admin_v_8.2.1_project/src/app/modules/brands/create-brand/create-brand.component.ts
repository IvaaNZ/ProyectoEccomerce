import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss']
})
export class CreateBrandComponent {

  @Output() BrandC: EventEmitter<any> = new EventEmitter();
  public name: string = '';
  public isLoading$:any;
  
  public imagen_previsualiza:any = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  public file_imagen:any = null;

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
  }

  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toastr.error("Validacion","El archivo no es una imagen");
      return;
    }
    this.file_imagen = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_imagen);
    reader.onloadend = () => this.imagen_previsualiza = reader.result;
    this.isLoadingView();
  }

  isLoadingView(){
    this.brandService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.brandService.isLoadingSubject.next(false);
    }, 50);
  }

  store(){
    if (!this.name) {
      this.toastr.error('Error.', 'Todos los campos son necesarios.')
      return;
    }
    let data = {
      name: this.name,
      imagen: this.file_imagen,
      state: 1,
    };

  this.brandService.createBrands(data).subscribe((resp:any) => {
    console.log(resp);
    if (resp.message == 403) {
      this.toastr.error('Error.', 'Ya existe este nombre de Marca.');
      return;
    } else {
      this.BrandC.emit(resp.brand);
      this.file_imagen = null;
      this.imagen_previsualiza = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
      this.toastr.success('Correcto.', 'La Marca se ha creado correctamente.');
      this.modal.close();
    }
  });
  }
}
/**
 let formData: FormData = new FormData();
    formData.append('name', this.name);
    formData.append('imagen', this.file_imagen);
    formData.append('status', 1+'');
 */
