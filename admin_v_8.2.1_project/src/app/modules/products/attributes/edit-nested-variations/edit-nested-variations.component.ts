import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../../service/attributes.service';

@Component({
  selector: 'app-edit-nested-variations',
  templateUrl: './edit-nested-variations.component.html',
  styleUrls: ['./edit-nested-variations.component.scss']
})
export class EditNestedVariationsComponent {

  @Output() SpecificationE: EventEmitter<any> = new EventEmitter();
  @Input() specification: any;
  @Input() attributes_variations: any = [];
  @Input() is_variation:any;
  

  public isLoading$: any;
  
  public specification_attribute_id: string = '';
  public type_attribute_specification: number = 2;
  public variations_attribute_id:string = '';
  public type_attribute_variation:number = 4;
  public attributes:any = [];

  public price_add: any = 0;
  public stock_add: any = 0;

  
  public dropdownList: any = [];
  public selectedItems: any = [];
  public dropdownSettings: IDropdownSettings = {};
  
  

  @Input() attributes_specifications: any = [];

  public properties: any = [];
  public propertie_id: any = null;
  public value_add: any = null;
  public specifications:any = [];
  public product_id:string = '';

  constructor(
    public attributesService: AttributesService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.attributesService.isLoading$;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };

    
    if (!this.is_variation) {
      this.specification_attribute_id = this.specification.attribute_id;
      this.changeSpecifications();
    }else{
      this.variations_attribute_id = this.specification.attribute_id;
      this.changeVariations();
    }

    setTimeout(() => {
      let old_type_attribute = this.type_attribute_specification;
      this.propertie_id = this.specification.propertie_id ? this.specification.propertie_id : null;
      if (this.specification.attribute.type_attribute == 4) {
        this.type_attribute_specification = 0;
        this.selectedItems = this.specification.value_add ? JSON.parse(this.specification.value_add) : [];
        setTimeout(() => {
          this.type_attribute_specification = old_type_attribute;
          this.isLoadingView();
        }, 25);
      } else {
        this.value_add = this.specification.value_add ? this.specification.value_add : null;
      }
    }, 25);
    if (this.is_variation) {
      this.price_add = this.specification.add_price;
      this.stock_add = this.specification.stock;
      
    }
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  isLoadingView() {
    this.attributesService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.attributesService.isLoadingSubject.next(false);
    }, 50);
  }

  store(){
    if (!this.is_variation) {
      this.storeSpecification();
    } else {
      this.storeVariation();
    }
  }

  storeSpecification() {
    if (this.type_attribute_specification == 4 && this.selectedItems.length == 0) {
      this.toastr.error('Error.', 'Necesitas seleccionar items.');
      return;
    }

    if (this.selectedItems.length > 0) {
      this.value_add = JSON.stringify(this.selectedItems);
    }

    if (!this.specification_attribute_id || (!this.propertie_id && !this.value_add)) {
      this.toastr.error("Error.", "Es necesario llenar los campos necesarios.");
      return;
    }

    let data = {
      product_id:this.specification.product_id,
      attribute_id: this.specification_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
    };

    this.attributesService.updateSpecification(this.specification.id, data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error.', resp.message_text);
      } else {
        this.toastr.success('Correcto', 'La especificación se editó correctamente');
        this.SpecificationE.emit(resp);
        this.modal.close();
      }
    });
  }

  storeVariation() {
    

    if (!this.variations_attribute_id || (!this.propertie_id && !this.value_add)) {
      this.toastr.error("Error.", "Es necesario llenar los campos necesarios.");
      return;
    }

    let data = {
      product_id:this.specification.product_id,
      attribute_id: this.variations_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
      add_price: this.price_add,
      stock: this.stock_add,
      product_variation_id: this.specification.product_variation_id,
    };

    this.attributesService.updateVariationNested(this.specification.id, data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error.', resp.message_text);
      } else {
        this.toastr.success('Correcto', 'La variación anidada se editó correctamente');
        this.SpecificationE.emit(resp);
        this.modal.close();
      }
    });
  }


  changeSpecifications() {
    this.value_add = null;
    this.propertie_id = null;
    this.selectedItems = [];

    let ATTRIBUTE = this.attributes_specifications.find((item: any) => item.id == this.specification_attribute_id);
    if (ATTRIBUTE) {
      this.type_attribute_specification = ATTRIBUTE.type_attribute;
      if (this.type_attribute_specification == 3 || this.type_attribute_specification == 4) {
        this.properties = ATTRIBUTE.properties;
        this.dropdownList = ATTRIBUTE.properties;
      } else {
        this.properties = [];
        this.dropdownList = [];
      }
    } else {
      this.type_attribute_specification = 0;
      this.properties = [];
      this.dropdownList = [];
    }
  }

  changeVariations(){
    this.value_add = null;
    this.propertie_id = null;

    let ATTRIBUTE = this.attributes_variations.find((item:any) => item.id == this.variations_attribute_id);
    if(ATTRIBUTE){
      this.type_attribute_specification = ATTRIBUTE.type_attribute;
      if(this.type_attribute_specification == 3 || this.type_attribute_specification == 4){
        this.properties = ATTRIBUTE.properties;
      }else{
        this.properties = [];
      }
    }else{
      this.type_attribute_specification = 0;
      this.properties = [];
    }
  }
}
