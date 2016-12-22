import { Component, Optional, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { AppState } from '../app.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from './data.service';
import { LabelService } from '../label/label.service';
import { FilterService } from '../filter.service';
import { Label } from '../label/label.class';
import { LabelDialog } from '../dialog/label/label.dialog';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';

import * as _ from 'lodash';

@Component({
  selector: 'data',
  styleUrls: [ './data.component.css' ],
  templateUrl: './data.component.html'
})
export class DataComponent {
    private datas: Array<any> = [];
    private _datas: Array<any> = [];
    private _filterDatas: Array<any> = [];

    private id: any;
    private sub: any;
    private sub2: any;
    private sub3: any;
    private snackConfig: MdSnackBarConfig = new MdSnackBarConfig();
    private searchSchedule: any;

    @ViewChild('stage') stage: ElementRef;
    @ViewChild('image') image: ElementRef;
    @ViewChild('label') label: Label;
    @ViewChild('vs') vs:  VirtualScrollComponent;

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
                private _label: LabelService,
                private _snack: MdSnackBar,
                private _filter: FilterService) { }

    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this._data.getData(this.id).subscribe((v: any)=>{
                this.datas = v['data'];
                this._filterDatas = this.datas;
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

        this.snackConfig.duration = 3000;
        this.sub3 = this._state.subscribe('search.string', (search_tree: any)=>{
            if(this.searchSchedule){
                clearTimeout(this.searchSchedule);
            }

            if(search_tree == -1){
                this._filterDatas = this.datas;
            } else {
                this.searchSchedule = setTimeout(()=>{
                    this._filterDatas = this._filter.filter(this.datas, search_tree, "image");
                    this.selected_index = 0;
                    if(this._filterDatas.length != 0){
                        this.selected = this._filterDatas[this.selected_index];
                        setTimeout(()=>{
                            this.vs.scrollInto(this.selected);
                        })
                    }
                    this._snack.open('Filter: ' + String(this._filterDatas.length) + ' of ' + String(this.datas.length), 'OK', this.snackConfig)
                }, 500);
            }
        });
    }

    next(){
        this.selected_index = Math.min(this._filterDatas.length-1, this.selected_index+1);
        this.selected = this._filterDatas[this.selected_index];
        setTimeout(()=>{
            this.vs.scrollInto(this.selected);
        })
    }

    previous(){
        this.selected_index = Math.max(0, this.selected_index-1);
        this.selected = this._filterDatas[this.selected_index];
        setTimeout(()=>{
            this.vs.scrollInto(this.selected);
        })
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
        var id = this.selected.id;
        if(this.selected.id && this.labelId){
            this._data.saveData(data, this.selected.id, this.labelId)
            .subscribe((v: any)=>{
                _.extend(   _.find(this.datas, (v: any)=>{ return v.id == id }),
                            {label: JSON.stringify(data)});
            }, (e: any)=>{
                console.error(e)
            });
        } else {
            this._snack.open('Failed to save label information because Label is not selected')
        }
    }

    updateIndex(e: any){
        this.start = e.start;
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
        this.sub2.unsubscribe();
        this.sub3.unsubscribe();
    }
}
