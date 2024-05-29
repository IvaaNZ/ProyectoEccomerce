import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {

  public title:string = '';
  public sku:string = '';
  public price_ars:number = 0;
  public price_usd:number = 0;
  public description:any = '<p> </p>';
  public resumen:string = '';

  public imagen_previsualiza:any = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  public file_imagen:any = null;

  public isLoading$:any;

  public categorie_first_id:string = '';
  public categorie_second_id:string = '';
  public categorie_third_id:string = '';

  public categories_first:any = [];
  public categories_seconds:any = [];
  public categories_seconds_backs:any = [];

  public categories_thirds:any = [];
  public categories_thirds_backs:any = [];

  public isShowMultiselect:Boolean = false;
  public dropdownList:any = [];
  public selectedItems:any = [];
  public dropdownSettings:IDropdownSettings = {};

  public marca_id:string = '';
  public marcas:any = [];

  public word:string = '';


  constructor(
    public productService: ProductService,
    public toastr: ToastrService,
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.productService.isLoading$;

    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Mumbai' },
    //   { item_id: 2, item_text: 'Bangaluru' },
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    //   { item_id: 5, item_text: 'New Delhi' }
    // ];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.configAll();

  }

  configAll(){
    this.productService.configAll().subscribe((resp:any) => {
      console.log(resp);

      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
      this.categories_thirds = resp.categories_thirds;
    }, (err:any)=>{
      console.log(err);
      this.toastr.error('API RESPONSE - Comunícate con el Desarrollador.', err.error.message);
    })
  }

  addItems(){
    this.isShowMultiselect = true;
    let time_date = new Date().getTime();
    this.dropdownList.push({ item_id: time_date, item_text: this.word });
    this.selectedItems.push({ item_id: time_date, item_text: this.word });
    setTimeout(() => {
      this.word = '';
      this.isShowMultiselect = false;
      this.isLoadingView();
    }, 100);
  }
  
  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toastr.error("Error","El archivo no es una imagen");
      return;
    }
    this.file_imagen = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_imagen);
    reader.onloadend = () => this.imagen_previsualiza = reader.result;
    this.isLoadingView();
  }

  isLoadingView(){
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }

  changeDepartament(){
    this.categories_seconds_backs = this.categories_seconds.filter((item:any) => 
    item.categorie_second_id == this.categorie_first_id);
  }

  changeCategorie(){
    this.categories_thirds_backs = this.categories_thirds.filter((item:any) => 
    item.categorie_second_id == this.categorie_second_id);
  }

  public onChange(event: any) {
    this.description = event.editor.getData();
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  
  save() {
    console.log('Valores antes de la verificación:');
    console.log('title:', this.title);
    console.log('sku:', this.sku);
    console.log('price_usd:', this.price_usd);
    console.log('price_ars:', this.price_ars);
    console.log('marca_id:', this.marca_id);
    console.log('file_imagen:', this.file_imagen);
    console.log('categorie_first_id:', this.categorie_first_id);
    console.log('description:', this.description);
    console.log('resumen:', this.resumen);
    console.log('selectedItems:', this.selectedItems);

    // Validación de cada campo individualmente
    if (!this.title) {
      this.toastr.error('Error', 'The Title field is required.');
      return;
    }
    if (!this.sku) {
        this.toastr.error('Error', 'The SKU field is required.');
        return;
    }
    if (!this.price_usd) {
        this.toastr.error('Error', 'The Price USD field is required.');
        return;
    }
    if (!this.price_ars) {
        this.toastr.error('Error', 'The Price ARS field is required.');
        return;
    }
    if (!this.marca_id) {
        this.toastr.error('Error', 'The Brand field is required.');
        return;
    }
    if (!this.file_imagen) {
        this.toastr.error('Error', 'The Image field is required.');
        return;
    }
    if (!this.categorie_first_id) {
        this.toastr.error('Error', 'The Category field is required.');
        return;
    }
    if (!this.description) {
        this.toastr.error('Error', 'The Description field is required.');
        return;
    }
    if (!this.resumen) {
        this.toastr.error('Error', 'The Summary field is required.');
        return;
    }
    if (this.selectedItems.length == 0) {
        this.toastr.error('Error', 'The Tags field is required.');
        return;
    }
    

    let formData = new FormData();
    formData.append("title", this.title);
    formData.append("sku", this.sku);
    formData.append("price_usd", this.price_usd + "");
    formData.append("price_ars", this.price_ars + "");
    formData.append("brand_id", this.marca_id);
    formData.append("portada", this.file_imagen);
    formData.append("categorie_first_id", this.categorie_first_id);
    if (this.categorie_second_id) {
        formData.append("categorie_second_id", this.categorie_second_id);
    }
    if (this.categorie_third_id) {
        formData.append("categorie_third_id", this.categorie_third_id);
    }
    if (this.description) {
      formData.append("description", this.description);
      
    }
    formData.append("resumen", this.resumen);
    formData.append("multiselect", JSON.stringify(this.selectedItems));

    this.productService.createProducts(formData).subscribe((resp: any) => {
        console.log(resp);

        if (resp.message == 403) {
            this.toastr.error('Error', resp.message_text);
        } else {
          this.title = '';
          this.file_imagen = null;
          this.sku = '';
          this.price_ars = 0;
          this.price_usd = 0;
          this.description = '';
          this.resumen = '';
          this.marca_id = '';
          this.selectedItems = [];
          this.categorie_first_id = '';
          this.categorie_second_id = '';
          this.categorie_third_id = '';
          this.imagen_previsualiza = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
          this.toastr.success('Correcto', 'El Producto se creó correctamente.');
        }
    });
  }
}

