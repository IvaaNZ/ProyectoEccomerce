import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from '../service/categories.service';

@Component({
  selector: 'app-edit-categorie',
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.scss']
})
export class EditCategorieComponent {

  public type_category:number = 1;

  public name:string = '' ;
  public icon:string = '' ;
  public position:number = 1 ;
  public categorie_second_id:string = '' ;
  public categorie_third_id:string = '' ;
  public status:string = '1';
  public imagen_previsualiza:any = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  public file_imagen:any = null;

  public isLoading$:any;

  public categories_first:any = [];
  public categories_seconds:any = [];
  public categories_seconds_backs:any = [];

  public categorie_id:string = '';
  public categorie:any = null;

  constructor(
    public categorieService: CategoriesService,
    public toastr: ToastrService,
    public activedRoute: ActivatedRoute,
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.categorieService.isLoading$;
    this.config();

    this.activedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.categorie_id = resp.id;
    })
    this.categorieService.showCategorie(this.categorie_id).subscribe((resp:any) => {
      console.log(resp);

      this.categorie = resp.categorie;
      this.type_category = resp.categorie.type_category;
      this.name = resp.categorie.name;
      this.icon = resp.categorie.icon;
      this.position = resp.categorie.position;
      this.categorie_second_id = resp.categorie.categorie_second_id;
      this.categorie_third_id = resp.categorie.categorie_third_id;
      this.imagen_previsualiza = resp.categorie.imagen;
    })
  }

  config(){
    this.categorieService.configCategories().subscribe((resp:any) => {
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
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
    this.categorieService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.categorieService.isLoadingSubject.next(false);
    }, 50);
  }

  changeTypeCategory(val:number){
    this.type_category = val;
    this.categorie_third_id = '';
    this.categorie_second_id = '';
  }

  changeDepartament(){
    this.categories_seconds_backs = this.categories_seconds.filter((item:any) => item.categorie_second_id == this.categorie_third_id);
  }

  save(){
    if (!this.name || !this.position) {
      this.toastr.error('Error', 'Los campos con (*) son obligatorios.');
      return;
    }


    if (this.type_category == 1 && !this.icon) {
      this.toastr.error('Error', 'El icono es obligatorio.');
      return;
    }

    // if (this.type_category == 1 && !this.file_imagen) {
    //   this.toastr.error('Error', 'La imagen es obligatoria.');
    //   return;
    // }

    if (this.type_category == 2 && !this.categorie_second_id) {
      this.toastr.error('Error', 'Es necesario seleccionar un departamento.');
      return;
    }

    if (this.type_category == 3 && (!this.categorie_second_id || !this.categorie_third_id)) {
      this.toastr.error('Error', 'Es necesario seleccionar un departamento y una categoría.');
      return;
    }

    let formData = new FormData();
    formData.append('name', this.name);

    if (this.icon) {
      formData.append('icon', this.icon);
    }else{
      if (this.categorie.icon) {
        formData.append('icon', '');
      }
    }

    formData.append('position', this.position+'');
    formData.append('type_category', this.type_category+'');

    if (this.file_imagen) {
      formData.append('image', this.file_imagen);
    }

    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    }

    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    }

    formData.append('status', this.status);

    this.categorieService.updateCategories(this.categorie_id,formData).subscribe((resp:any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.toastr.error('Error', 'La categoría ya existe.');

        return;
      }

      this.toastr.success('Correcto', 'La categoría se editó correctamente.');

      this.config();
    })

  }
  
}
