import { Component, Optional, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { AppState } from '../app.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from './data.service';
import { LabelService } from '../label/label.service';
import { Label } from '../label/label.class';
import { LabelDialog } from '../dialog/label/label.dialog';
import * as _ from 'lodash';

@Component({
  selector: 'data',
  styleUrls: [ './data.component.css' ],
  templateUrl: './data.component.html'
})
export class DataComponent {
    private datas: Array<any> = [];
    private _datas: Array<any> = [];

    private id: any;
    private sub: any;
    private sub2: any;

    @ViewChild('stage') stage: ElementRef;
    @ViewChild('image') image: ElementRef;
    @ViewChild('label') label: Label;

    private labelId: number;
    private labels: Array<any>;
    private height: number = 0;
    private selected: any = {};
    private selected_index: number = 0;
    private start = 0;
    private imageWidth: number = 0;
    private imageHeight: number = 0;
    private domWidth: number = 0;
    private domHeight: number = 0;

    constructor(private _state: AppState,
                private route: ActivatedRoute,
                private router: Router,
                private dialog: MdDialog,
                private _data: DataService,
                private _label: LabelService) { }

    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this._data.getData(this.id).subscribe((v: any)=>{
                this.datas = v['data'];
                this.selected = this.datas[this.selected_index];
                this.reloadLabel();
            });
            this._label.get(this.id).subscribe((v:any)=>{
                this.labels = v['data'];
                if(this.labels.length != 0){
                    this.labelId = +this.labels[0].id;
                }
            },()=>{});
        });

        this.sub2 = this._state.subscribe('label.refresh', ()=>{
            if(this.id){
                this._label.get(this.id).subscribe((v:any)=>{
                    this.labels = v['data'];
                },()=>{});
            }
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

    private reloadLabel(){
        this._data.getLabel(this.id).subscribe((label: any)=>{
            let lbl = label['data'];
            this.datas = _.map(this.datas, (item)=>{
                return _.extend(item, _.find(lbl, (v: any)=>{ return v.id == item.id }));
            });
        }, ()=>{})
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

    openLabelDialog() {
        let dialogRef = this.dialog.open(LabelDialog, {
            disableClose: false
        });

        this._state.notifyDataChanged('label.data', {id:this.id});

        dialogRef.afterClosed().subscribe(result => {
            dialogRef = null;
        });
    }

    saveData(data: any){
        if(this.selected.id && this.labelId){
            this._data.saveData(data, this.selected.id, this.labelId).subscribe((v: any)=>{

            }, (e: any)=>{
                console.error(e)
            })
        }
    }

    updateIndex(e: any){
        this.start = e.start;
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
        this.sub2.unsubscribe();
    }
}
