import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../../service/attributes.service';

@Component({
  selector: 'app-create-variation-specifications',
  templateUrl: './create-variation-specifications.component.html',
  styleUrls: ['./create-variation-specifications.component.scss']
})
export class CreateVariationSpecificationsComponent {

  public title:string = '';
  public sku:string = '';
  public isLoading$:any;

  public attributes:any = [];
  public specification_attribute_id:string = '';
  public type_attribute_specification:number = 1;

  public variations_attribute_id:string = '';
  public type_attribute_variation:number = 3;

  public isShowMultiselect:Boolean = false;
  public dropdownList:any = [];
  public selectedItems:any = [];
  public dropdownSettings:IDropdownSettings = {};

  public word:string = '';

  public PRODUCT_ID:string = '';
  public PRODUCT_SELECTED:any;

  public field_1:string = '';
  public field_2:number = 0;
  public field_3:any;

  public field_1_variation:any;

  public dropdownListVariations:any = [];
  public selectedItemsVariations:any = [];
  public price_add:number = 0;
  public stock_add:number = 0;
  // public field_4

  public attributes_specifications:any = [];
  public properties:any = [];
  public attributes_variations:any = [];
  public propertie_id:any = null;
  public value_add:any = null;
  public specifications:any = [];


  constructor(
    public attributeService: AttributesService,
    public toastr: ToastrService,
    private activedRoute: ActivatedRoute,
    public modelService: NgbModal,
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.attributeService.isLoading$;

    // this.dropdownList = [
    //   { item_id: 5, item_text: 'New Delhi' },
    //   { item_id: 6, item_text: 'Laravest' }
    // ];
    // this.selectedItems = [
    //   { item_id: 6, item_text: 'Laravest' }
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
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
    this.showProduct();
    this.listSpecification();
  }

  configAll(){
    this.attributeService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.attributes_specifications = resp.attributes_specifications;
    })
  }
  listSpecification(){
    this.attributeService.listSpecification(this.PRODUCT_ID).subscribe((resp:any) => {
      console.log(resp);
      this.specifications = resp.specifications;
  });
  }
  listVariations(){
   
  }
  showProduct() {
    this.attributeService.showProduct(this.PRODUCT_ID).subscribe((resp:any) => {
      console.log(resp);
      this.PRODUCT_SELECTED = resp.product;
      this.title = resp.product.title;
      this.sku = resp.product.sku;
    })
  }

  changeSpecifications(){
    this.value_add = null;
    this.propertie_id = null;
    this.selectedItems = [];

    let ATTRIBUTE = this.attributes_specifications.find((item:any) => item.id == this.specification_attribute_id);
    if(ATTRIBUTE){
      this.type_attribute_specification = ATTRIBUTE.type_attribute;
      if(this.type_attribute_specification == 3 || this.type_attribute_specification == 4){
        this.properties = ATTRIBUTE.properties;
        this.dropdownList = ATTRIBUTE.properties;
      }else{
        this.properties = [];
        this.dropdownList = [];
      }
    }else{
      this.type_attribute_specification = 0;
      this.properties = [];
      this.dropdownList = [];
    }
  }

  changeVariations(){
   
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

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  isLoadingView(){
    this.attributeService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.attributeService.isLoadingSubject.next(false);
    }, 50);
  }
  
  

  save() {

    if(!this.specification_attribute_id || ( !this.propertie_id && !this.value_add)){
      console.log('specification_attribute_id:', this.specification_attribute_id);
      console.log('propertie_id:', this.propertie_id);
      console.log('value_add:', this.value_add);
      this.toastr.error("Validación","Llene los campos necesarios");
      return;
    }
    
    let data = {
        product_id: this.PRODUCT_ID,
        attribute_id: this.specification_attribute_id,
        propertie_id: this.propertie_id,
        value_add: this.value_add,
    };

    this.attributeService.createSpecification(data).subscribe((resp: any) => {
        console.log(resp);
        if (resp.message == 403) {
            this.toastr.error('Correcto.', resp.message_text);
        } else {
            this.toastr.success('Correcto', 'Se registró la especificación correctamente');
            this.specifications.unshift(resp.specification); 
            this.value_add = null;
            this.propertie_id = null;
            this.specification_attribute_id = '';
        }
    });
}

getValueAttribute(attribute_special:any){
  if(attribute_special.propertie_id){
    return attribute_special.propertie.name;
  }
  if(attribute_special.value_add){
    return attribute_special.value_add;
  }

  return "---";
}

  

}