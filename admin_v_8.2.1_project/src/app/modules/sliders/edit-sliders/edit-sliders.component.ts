import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SlidersService } from '../service/sliders.service';

@Component({
  selector: 'app-edit-sliders',
  templateUrl: './edit-sliders.component.html',
  styleUrls: ['./edit-sliders.component.scss']
})
export class EditSlidersComponent {

  public title:string = '';
  public label:string = '';
  public subtitle:string = '';
  public link:string = '';

  public imagen_previsualiza:any = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  public file_imagen:any = null;

  public isLoading$:any;

  public color:string = '';

  public status:number = 1;

  public slider_id:string = '';

  constructor(
    public sliderService: SlidersService,
    public toastr: ToastrService,
    public activedRoute: ActivatedRoute,
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.sliderService.isLoading$;
    this.activedRoute.params.subscribe((resp:any) => {
      this.slider_id = resp.id;
    })
    this.sliderService.showSlider(this.slider_id).subscribe((resp:any)=>{
      console.log(resp);

      this.title = resp.slider.title;
      this.label = resp.slider.label;
      this.subtitle = resp.slider.subtitle;
      this.link = resp.slider.link;
      this.imagen_previsualiza = resp.slider.imagen;
      this.color = resp.slider.color;
      this.status = resp.slider.status;
    })
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
    if (!this.title || !this.subtitle) {
      this.toastr.error('Error', 'Los campos con (*) son obligatorios.');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);
    if (this.label) {
      formData.append('label', this.label);
      
    }
    formData.append('subtitle', this.subtitle+'');

    if (this.file_imagen) {
      formData.append('image', this.file_imagen);
    }

    formData.append('status', this.status+'');
    if (this.color) {
      formData.append('color', this.color);
    }
    if (this.link) {
      formData.append('link', this.link);
      
    }


    this.sliderService.updateSliders(this.slider_id,formData).subscribe((resp:any) => {
      console.log(resp);

      this.toastr.success('Correcto', 'El Slider se editó correctamente.');

    })

  }
}
