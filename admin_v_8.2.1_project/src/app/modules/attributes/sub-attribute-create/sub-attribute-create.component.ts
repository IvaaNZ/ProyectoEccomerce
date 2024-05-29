import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';
import { SubAttributeDeleteComponent } from '../sub-attribute-delete/sub-attribute-delete.component';

@Component({
  selector: 'app-sub-attribute-create',
  templateUrl: './sub-attribute-create.component.html',
  styleUrls: ['./sub-attribute-create.component.scss']
})
export class SubAttributeCreateComponent {

  // @Output() AttributeC: EventEmitter<any> = new EventEmitter();
  @Input() attribute:any;
  public properties:any = [];
  public name: string = '';
  public isLoading$:any;
  public type_action:number = 1;
  public color:any;

  constructor(
    public attributesService: AttributesService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    public modalService: NgbModal,
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.attributesService.isLoading$;
    this.properties = this.attribute.properties;
  }

  store(){
    if (!this.name) {
      this.toastr.error('Error.', 'Todos los campos son necesarios.')
      return;
    }

    if (this.type_action == 2 && !this.color) {
      this.toastr.error('Error.', 'Necesitas seleccionar un color.')
      return;
    }
    let data = {
      name: this.name,
      code: this.color,
      attribute_id: this.attribute.id,
      status: 1,
    };
    this.attributesService.createProperties(data).subscribe((resp:any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Error.', 'Ya existe el nombre de color en esta Propiedad.')
        return;
      }else{
        this.properties.unshift(resp.propertie);
        // this.AttributeC.emit(resp.attribute);
        this.toastr.success('Correcto.', 'La propiedad se ha creado correctamente.');
        // this.modal.close();

      }
    })
  }
  delete(propertie:any){
    const modelRef = this.modalService.open(SubAttributeDeleteComponent, {centered:true, size: 'md'});
    modelRef.componentInstance.propertie = propertie;

    modelRef.componentInstance.PropertieD.subscribe((resp:any) => {
      let INDEX = this.properties.findIndex((item:any) => item.id == propertie.id);
      if (INDEX != -1) {
        this.properties.splice(INDEX, 1);
      }
    })
  }
}
