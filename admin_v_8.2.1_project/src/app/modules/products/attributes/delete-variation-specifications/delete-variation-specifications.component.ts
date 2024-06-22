import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../../service/attributes.service';

@Component({
  selector: 'app-delete-variation-specifications',
  templateUrl: './delete-variation-specifications.component.html',
  styleUrls: ['./delete-variation-specifications.component.scss']
})
export class DeleteVariationSpecificationsComponent {

  @Input() specification:any;
  @Input() is_variation:any;
  @Output() SpecificationD:EventEmitter<any> = new EventEmitter();

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
    if (!this.is_variation) {
      this.deleteSpecification();
    }else{
      this.deleteVariation();
    }
  }
  deleteSpecification(){
    this.attributeService.deleteSpecification(this.specification.id).subscribe((resp:any) => {
      this.SpecificationD.emit({message: 200});
      this.toastr.success('Correcto', 'La Categoría se eliminó correctamente.');
      this.modal.close();
    })
  }

  deleteVariation(){
    this.attributeService.deleteVariation(this.specification.id).subscribe((resp:any) => {
      this.SpecificationD.emit({message: 200});
      this.toastr.success('Correcto', 'La Categoría se eliminó correctamente.');
      this.modal.close();
    })
  }
}
