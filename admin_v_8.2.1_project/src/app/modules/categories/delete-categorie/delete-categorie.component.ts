import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from '../service/categories.service';

@Component({
  selector: 'app-delete-categorie',
  templateUrl: './delete-categorie.component.html',
  styleUrls: ['./delete-categorie.component.scss']
})
export class DeleteCategorieComponent {

  @Input() categorie:any;
  @Output() CategorieD:EventEmitter<any> = new EventEmitter();

  isLoading:any;
  constructor(
    public categorieService: CategoriesService,
    public toastr: ToastrService,
    public modal: NgbActiveModal,
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.categorieService.isLoading$;
  }
  delete(){
    this.categorieService.deleteCategorie(this.categorie.id).subscribe((resp:any) => {
      if (resp.message == 403) {
        this.toastr.error('Error', resp.message_text);
      }else{
        this.CategorieD.emit({message: 200});
        this.toastr.success('Correcto', 'La Categoría se eliminó correctamente.');
        this.modal.close();

      }
    })
  }
}
