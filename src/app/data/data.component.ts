import { Component, Optional, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { AppState } from '../app.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from './data.service';
import { Label } from '../label/label.class';

@Component({
  selector: 'data',
  styleUrls: [ './data.component.css' ],
  templateUrl: './data.component.html'
})
export class DataComponent {
    private datas: Array<any> = []
    private id: any;
    private sub: any;
    @ViewChild('stage') stage: ElementRef;
    @ViewChild('image') image: ElementRef;
    @ViewChild('label') label: Label;

    private height: number = 0;
    private selected: any = {};
    private selected_index: number = 0;

    private imageWidth: number = 0;
    private imageHeight: number = 0;
    private domWidth: number = 0;
    private domHeight: number = 0;

    constructor(private _state: AppState,
                private route: ActivatedRoute,
                private router: Router,
                private _data: DataService) { }

    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this._data.getData(this.id).subscribe((v: any)=>{
                this.datas = v['data'];
                this.selected = this.datas[this.selected_index];
            })
        });
    }

    next(){
        this.selected_index = Math.min(this.datas.length-1, this.selected_index+1);
        this.selected = this.datas[this.selected_index];

    }

    previous(){
        this.selected_index = Math.max(0, this.selected_index-1);
        this.selected = this.datas[this.selected_index];
    }

    ngAfterViewInit(){
        this._updateHeight();
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        switch(event.key){
            case 'ArrowDown':
                this.next();
                break;
            case 'ArrowUp':
                this.previous();
        }
    }

    updateImageDimension(){
        let dimension = this.image.nativeElement.getBoundingClientRect();
        this.imageHeight = this.image.nativeElement.naturalHeight;
        this.imageWidth = this.image.nativeElement.naturalWidth;
        this.domHeight = dimension.height;
        this.domWidth = dimension.width;
        this.label.load(this.imageHeight, this.imageWidth, this.domHeight/this.imageHeight);
    }

    @HostListener('window:resize', ['$event'])
    private _updateHeight(){
        let dim = this.stage.nativeElement.getBoundingClientRect()
        this.height = window.innerHeight - dim.top;
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }
}
