import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';

@Component({
  selector: 'app-delete-attribute',
  templateUrl: './delete-attribute.component.html',
  styleUrls: ['./delete-attribute.component.scss']
})
export class DeleteAttributeComponent {

  @Input() attribute:any;
  @Output() AttributeD:EventEmitter<any> = new EventEmitter();

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
    this.attributeService.deleteAttributes(this.attribute.id).subscribe((resp:any) => {
      this.AttributeD.emit(resp.attribute);
      this.toastr.success('Correcto.', 'El Atributo se ha eliminado correctamente.');
      this.modal.close();
    })
  }
}
