import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteSlidersComponent } from '../delete-sliders/delete-sliders.component';
import { SlidersService } from '../service/sliders.service';

@Component({
  selector: 'app-list-sliders',
  templateUrl: './list-sliders.component.html',
  styleUrls: ['./list-sliders.component.scss']
})
export class ListSlidersComponent {

  sliders:any = [];
  search:string = '';
  totalPages:number = 0;
  currentPage:number = 1;

  isLoading$:any;
  constructor(
    public sliderService: SlidersService,
    public modalService: NgbModal,
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listSliders();
    this.isLoading$ = this.sliderService.isLoading$;
  }

  listSliders(page = 1){
    this.sliderService.listSliders(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.sliders = resp.sliders;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  searchTo(){
    this.listSliders();
  }

  loadPage($event:any){
    console.log($event);
    this.listSliders($event);
  }

  deleteSlider(slider:any){
    const modelRef = this.modalService.open(DeleteSlidersComponent, {centered:true, size: 'md'});
    modelRef.componentInstance.slider = slider;

    modelRef.componentInstance.SliderD.subscribe((resp:any) => {
      let INDEX = this.sliders.findIndex((item:any) => item.id == slider.id);
      if (INDEX != -1) {
        this.sliders.splice(INDEX, 1);
      }
    })
  }
}
