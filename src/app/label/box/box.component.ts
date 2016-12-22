import {    Component, Optional, ElementRef, ViewChild,
            HostListener, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { AppState } from '../app.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from './data.service';
import { Label } from '../label.class';
import * as _ from 'lodash';
import 'fabric';
declare var fabric: any;

@Component({
  selector: 'box',
  styleUrls: [ './box.component.css' ],
  templateUrl: './box.component.html'
})
export class BoxComponent extends Label {
    private height: number;
    private width: number;
    private scale: number;
    private stage: any;

    private selected: boolean;
    private _data: any;
    private suppressEvent: boolean = false;

    @ViewChild('canvas') canvas: ElementRef;
    @Output() change: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    set data(d: string) {
        if(d){
            this._data = JSON.parse(d);
            this._reloadLabel();
        } else {
            this._data = [];
        }
    }

    get data(): string { return this._data; }

    private initStage(){
        if(!this.stage){
            this.stage = new fabric.Canvas(this.canvas.nativeElement);
            this.stage.on("object:scaling", (e: any)=> {
                e.target.setWidth(e.target.width * e.target.scaleX);
                e.target.setScaleX(1);
                e.target.setHeight(e.target.height * e.target.scaleY);
                e.target.setScaleY(1);
            });
            this.stage.on("object:modified", (e: any)=>{
                if(!this.suppressEvent){
                    this._collectObject();
                }
            });

            this.stage.on("object:added", (e: any)=>{
                if(!this.suppressEvent){
                    this._collectObject();
                }
            });
        } else {
            this.stage.clear();
        }
        this._reloadLabel();
    }

    private _reloadLabel(){
        if(this.stage){
            this.stage.clear();
            this.suppressEvent = true;
            _.each(this._data, (v: any)=>{
                this._addRect(v.x, v.y, v.w, v.h, v.theta || 0)
            });
            this.suppressEvent = false;
        }
    }

    private _addRect(x:number , y:number, w=10, h=10, theta=0) {
        this.stage.add(new fabric.Rect({
           left: x,
           top: y,
           width: w,
           height: h,
           stroke: 'yellow',
           strokeWidth: 2,
           angle: theta,
           fill: 'rgba(0,0,0,0)',
           cornerColor: 'yellow',
           cornerSize: 18,
           transparentCorners: false
       }));
    }

    private _collectObject(){
        let obj = this.stage.getObjects().map((o: any)=>{
            return {x: o.left, y: o.top, w: o.width, h:o.height, theta: o.angle || 0};
        });

        this.change.emit(obj);
    }

    load(height: number, width: number, scale: number){
        this.height = height;
        this.width = width;
        this.scale = scale;

        this.canvas.nativeElement.setAttribute('height', this.height);
        this.canvas.nativeElement.setAttribute('width', this.width);
        this.initStage();
    }

    delete(e: any){
        this.stage.remove(this.stage.getActiveObject())
        this._collectObject();
    }

    addRect($event) {
        if (this.selected){
            this.selected = false;
            return;
        }

        this.stage.add(new fabric.Rect({
           left: $event.offsetX,
           top: $event.offsetY,
           width: 700,
           height: 100,
           stroke: 'yellow',
           strokeWidth: 2,
           fill: 'rgba(0,0,0,0)',
           cornerColor: 'yellow',
           cornerSize: 18,
           transparentCorners: false
       }));
    }
}
