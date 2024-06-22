import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../../service/attributes.service';
import { DeleteVariationSpecificationsComponent } from '../delete-variation-specifications/delete-variation-specifications.component';
import { EditNestedVariationsComponent } from '../edit-nested-variations/edit-nested-variations.component';

@Component({
  selector: 'app-create-nested-variations',
  templateUrl: './create-nested-variations.component.html',
  styleUrls: ['./create-nested-variations.component.scss']
})
export class CreateNestedVariationsComponent {

  
  @Input() variation:any;
  @Input() attributes_variations:any = [];

  public attributes_specifications:any = [];
  public properties:any = [];
  public propertie_id:any = null;
  public value_add:any = null;
  public specifications:any = [];
  public variations:any = [];

  public attributes:any = [];
  public specification_attribute_id:string = '';
  public type_attribute_specification:number = 2;

  public variations_attribute_id:string = '';
  public type_attribute_variation:number = 4;

  public price_add:number = 0;
  public stock_add:number = 0;

  //
  public isLoading$:any;
  public isShowMultiselect:Boolean = false;
  public dropdownList:any = [];
  public selectedItems:any = [];
  public dropdownSettings:IDropdownSettings = {};


  constructor(
    public attributesService: AttributesService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private modelService: NgbModal,
  ){
    
  }

  ngOnInit(): void {
    this.isLoading$ = this.attributesService.isLoading$;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.listVariationNested();
  }

  listVariationNested(){
    this.attributesService.listVariationNested(this.variation.product_id,this.variation.id).subscribe((resp:any) => {
      
      this.variations = resp.variations;
    });
  }

  changeVariations(){
    this.value_add = null;
    this.propertie_id = null;

    let ATTRIBUTE = this.attributes_variations.find((item:any) => item.id == this.variations_attribute_id);
    if(ATTRIBUTE){
      this.type_attribute_variation = ATTRIBUTE.type_attribute;
      if(this.type_attribute_variation == 3 || this.type_attribute_variation == 4){
        this.properties = ATTRIBUTE.properties;
      }else{
        this.properties = [];
      }
    }else{
      this.type_attribute_variation = 0;
      this.properties = [];
    }
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

  saveVariations() {

    if(!this.variations_attribute_id || ( !this.propertie_id && !this.value_add)){
      this.toastr.error("Error.","Es necesario llenar los campos necesarios.");
      return;
    }
  
    if (this.price_add < 0) {
      this.toastr.error("Error.","El precio del valor debe ser mayor o igual a CERO.");
      return;
    }
  
    if (this.stock_add <= 0) {
      this.toastr.error("Error.","El stock debe ser mayor a CERO.");
      return;
    }
    
    let data = {
        product_id: this.variation.product_id,
        attribute_id: this.variations_attribute_id,
        propertie_id: this.propertie_id,
        value_add: this.value_add,
        add_price: this.price_add,
        stock: this.stock_add,
        product_variation_id: this.variation.id,
    };
  
    this.attributesService.createVariationNested(data).subscribe((resp: any) => {
        console.log(resp);
        if (resp.message == 403) {
            this.toastr.error('Error.', resp.message_text);
        } else {
            this.toastr.success('Correcto', 'La variación anidada se registró correctamente');
            this.variations.unshift(resp.variation); 
            this.value_add = null;
            this.propertie_id = null;
            this.variations_attribute_id = '';
            this.price_add = 0;
            this.stock_add = 0;
        }
    });
  }

  

  editVariation(variation: any) {
    const model = this.modelService.open(EditNestedVariationsComponent, { centered: true, size: 'md' });
    model.componentInstance.specification = variation;
    model.componentInstance.attributes_variations = this.attributes_variations;
    model.componentInstance.is_variation = 1;

    model.componentInstance.SpecificationE.subscribe((edit: any) => {
      console.log(edit);
      let INDEX = this.variations.findIndex((item: any) => item.id == edit.variation.id);

      if (INDEX != -1) {
        this.variations[INDEX] = edit.variation;
      }
    });
  }
  
  deleteVariation(variation:any){
    const model = this.modelService.open(DeleteVariationSpecificationsComponent, {centered:true, size: 'md'});
    model.componentInstance.specification = variation;
    model.componentInstance.is_variation = 1;
    model.componentInstance.SpecificationD.subscribe((edit:any) => {
      console.log(edit);
      let INDEX = this.variations.findIndex((item:any) => item.id == variation.id);
  
      if (INDEX != -1) {
        this.variations.splice(INDEX,1);
      }
    })
  }


}
