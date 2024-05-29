import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SlidersService } from '../service/sliders.service';

@Component({
  selector: 'app-create-sliders',
  templateUrl: './create-sliders.component.html',
  styleUrls: ['./create-sliders.component.scss']
})
export class CreateSlidersComponent {

  public title:string = '';
  public label:string = '';
  public subtitle:string = '';
  public link:string = '';

  public imagen_previsualiza:any = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  public file_imagen:any = null;

  public isLoading$:any;

  public color:string = '';


  constructor(
    public sliderService: SlidersService,
    public toastr: ToastrService,
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.sliderService.isLoading$;
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
    this.sliderService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.sliderService.isLoadingSubject.next(false);
    }, 50);
  }


  save(){
    if (!this.title || !this.subtitle || !this.file_imagen) {
      this.toastr.error('Error', 'Los campos con (*) son obligatorios.');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);
    if (this.label) {
      formData.append('label', this.label);
      
    }
    formData.append('subtitle', this.subtitle+'');
    formData.append('image', this.file_imagen);

    if (this.color) {
      formData.append('color', this.color);
    }
    if (this.link) {
      formData.append('link', this.link);
      
    }


    this.sliderService.createSliders(formData).subscribe((resp:any) => {
      console.log(resp);


      this.title = '';
      this.label = '';
      this.subtitle = '';
      this.link = '';
      this.color = '';
      this.file_imagen = null;
      this.imagen_previsualiza = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
      this.toastr.success('Correcto', 'El Slider se creó correctamente.');

    })

  }
}
