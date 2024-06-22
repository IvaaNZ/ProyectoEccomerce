import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { DeleteImagenAddComponent } from './delete-imagen-add/delete-imagen-add.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {

  public title:string = '';
  public sku:string = '';
  public price_ars:number = 0;
  public price_usd:number = 0;
  public description:any = '<p> </p>';
  public resumen:string = '';
  public status:number = 1;
  public stock:number = 0;

  public imagen_previsualiza:any = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  public file_imagen:any = null;

  public file_imagen_two:any;
  public imagen_previsualiza_two:any = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';

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

  public PRODUCT_ID:string = '';
  public PRODUCT_SELECTED:any;

  public images_files:any = [];

  constructor(
    public productService: ProductService,
    public toastr: ToastrService,
    private activedRoute: ActivatedRoute,
    public modelService: NgbModal,
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.productService.isLoading$;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.activedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.PRODUCT_ID = resp.id;
    });
    
    this.configAll();

  }

  configAll(){
    this.productService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
      this.categories_thirds = resp.categories_thirds;
      this.showProduct();
    })
  }
  showProduct() {
    this.productService.showProduct(this.PRODUCT_ID).subscribe((resp:any) => {
      console.log(resp);

      this.PRODUCT_SELECTED = resp.product;
      this.title = resp.product.title;
      this.sku = resp.product.sku;
      this.resumen = resp.product.resumen;
      this.status = resp.product.status;
      this.stock = resp.product.stock;
      this.price_ars = resp.product.price_ars;
      this.price_usd = resp.product.price_usd;
      this.description = resp.product.description;
      this.imagen_previsualiza = resp.product.imagen;
      this.marca_id = resp.product.brand_id;
      this.categorie_first_id = resp.product.categorie_first_id;
      this.categorie_second_id = resp.product.categorie_second_id;
      this.categorie_third_id = resp.product.categorie_third_id;
      this.selectedItems = resp.product.selectedItems;
      this.file_imagen = resp.product.images;
      this.images_files = resp.product.images;

      this.changeDepartament();
      this.changeCategorie();
      this.dropdownList = resp.product.tags;
      this.selectedItems = resp.product.tags;

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

  processFileTwo($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toastr.error("Error","El archivo no es una imagen");
      return;
    }
    this.file_imagen_two = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_imagen_two);
    reader.onloadend = () => this.imagen_previsualiza_two = reader.result;
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

  removeImages(id:number){
    const modelRef = this.modelService.open(DeleteImagenAddComponent, {centered:true, size: 'md'});
    modelRef.componentInstance.id = id;

    modelRef.componentInstance.ImagenD.subscribe((resp:any) => {
      let INDEX = this.images_files.findIndex((item:any) => item.id == id);
      if (INDEX != -1) {
        this.images_files.splice(INDEX, 1);
      }
    })
  }

  addImagen(){
    if (!this.file_imagen_two) {
      
      this.toastr.error('Error', 'The Upload Files Images field is required.');
      return;
    }
    let formData = new FormData();
    formData.append('file_imagen_two', this.file_imagen_two);
    formData.append('product_id', this.PRODUCT_ID);
    this.productService.imagenAdd(formData).subscribe((resp:any) => {
      console.log(resp);
      this.images_files.unshift(resp.imagen);
      this.file_imagen_two = null;
      this.imagen_previsualiza_two = 'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
    });
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
    formData.append('stock', this.stock+'');
    if (this.file_imagen) {
      formData.append("portada", this.file_imagen);
    }
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

    formData.append('status', this.status+'');
  
    this.productService.updateProducts(this.PRODUCT_ID, formData).subscribe((resp: any) => {
      console.log(resp);
  
      if (resp.message == 403) {
        this.toastr.error('Error', resp.message_text);
      } else {
        this.file_imagen = null;
        this.toastr.success('Correcto', 'El Producto se editó correctamente.');
      }
    });
  }
  
  
}

/**
 [{"item_id":1716969362136,"item_text":"sdfdsfdfs"},
{"item_id":1716969365432,"item_text":"sdfg"},
{"item_id":1716969366167,"item_text":"hjfd"}]
 **/