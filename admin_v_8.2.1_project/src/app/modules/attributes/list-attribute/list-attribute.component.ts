import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateAttributeComponent } from '../create-attribute/create-attribute.component';
import { DeleteAttributeComponent } from '../delete-attribute/delete-attribute.component';
import { EditAttributeComponent } from '../edit-attribute/edit-attribute.component';
import { AttributesService } from '../service/attributes.service';
import { SubAttributeCreateComponent } from '../sub-attribute-create/sub-attribute-create.component';

@Component({
  selector: 'app-list-attribute',
  templateUrl: './list-attribute.component.html',
  styleUrls: ['./list-attribute.component.scss']
})
export class ListAttributeComponent {

  public attributes:any = [];
  public search:string = '';
  public totalPages:number = 0;
  public currentPage:number = 1;

  public isLoading$:any;
  constructor(
    public attributesService: AttributesService,
    public modalService: NgbModal,
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listAttributes();
    this.isLoading$ = this.attributesService.isLoading$;
  }

  listAttributes(page = 1){
    this.attributesService.listAttributes(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.attributes = resp.attributes;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  

  getNameAttribute(type_attribute:any){
    var name_attribute = '';
    type_attribute = parseInt(type_attribute);
    switch (type_attribute) {
      case 1:
          name_attribute = 'Text';
          break;
      case 2:
          name_attribute = 'Number';
          break;
      case 3:
          name_attribute = 'Selectable';
          break;
      case 4:
          name_attribute = 'Multi-selectable';
          break;

    
      default:
        break;
    }
    return name_attribute;
  }

  searchTo(){
    this.listAttributes();
  }

  loadPage($event:any){
    console.log($event);
    this.listAttributes($event);
  }


  openCreateAttribute(){
    const modalRef = this.modalService.open(CreateAttributeComponent, {centered:true, size: 'md'});

    modalRef.componentInstance.AttributeC.subscribe((attrib:any) => {
      this.attributes.unshift(attrib);
    })
  }

  openEditAttribute(attribute:any){
    const modalRef = this.modalService.open(EditAttributeComponent, {centered:true, size: 'md'});
    modalRef.componentInstance.attribute = attribute;

    modalRef.componentInstance.AttributeE.subscribe((attrib:any) => {
      // this.attributes.unshift(attrib);
      let INDEX = this.attributes.findIndex((item:any) => item.id == attrib.id);

      if (INDEX != -1) {
        this.attributes[INDEX] = attrib;
      }
    })
  }

  deleteAttribute(attribute:any){
    const modelRef = this.modalService.open(DeleteAttributeComponent, {centered:true, size: 'md'});
    modelRef.componentInstance.attribute = attribute;

    modelRef.componentInstance.AttributeD.subscribe((resp:any) => {
      let INDEX = this.attributes.findIndex((item:any) => item.id == attribute.id);
      if (INDEX != -1) {
        this.attributes.splice(INDEX, 1);
      }
    })
  }

  openRegisterProperties(attribute:any){
    const modalRef = this.modalService.open(SubAttributeCreateComponent, {centered:true, size: 'md'});
    modalRef.componentInstance.attribute = attribute;

  }
}
