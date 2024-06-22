import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';

@Component({
  selector: 'app-sub-attribute-delete',
  templateUrl: './sub-attribute-delete.component.html',
  styleUrls: ['./sub-attribute-delete.component.scss']
})
export class SubAttributeDeleteComponent {
  @Input() propertie:any;
  @Output() PropertieD:EventEmitter<any> = new EventEmitter();

  isLoading:any;
  constructor(
    public attributeService: AttributesService,
    public toastr: ToastrService,
    public modal: NgbActiveModal,
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.attributeService.isLoading$;
  }
  delete(){
    this.attributeService.deletePropertie(this.propertie.id).subscribe((resp:any) => {
      if (resp.message == 403) {
        this.toastr.error('Error', resp.message_text);
      }else{
        this.PropertieD.emit(resp.propertie);
        this.toastr.success('Correcto.', 'La Propiedad se ha eliminado correctamente.');
        this.modal.close();

      }
    })
  }
}
