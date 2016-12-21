import { Component, Optional, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { AppState } from '../app.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from './data.service';
import { Label } from '../label.class';
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

    @ViewChild('canvas') canvas: ElementRef;

    load(height: number, width: number, scale: number){
        this.height = height;
        this.width = width;
        this.scale = scale;

        this.canvas.nativeElement.setAttribute('height', this.height);
        this.canvas.nativeElement.setAttribute('width', this.width);

        this.stage = new fabric.Canvas(this.canvas.nativeElement);

        this.stage.on("object:scaling", (e: any)=> {
            e.target.setWidth(e.target.width * e.target.scaleX);
            e.target.setScaleX(1);
            e.target.setHeight(e.target.height * e.target.scaleY);
            e.target.setScaleY(1);
        });
    }

    delete(e: any){
        this.stage.remove(this.stage.getActiveObject())
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
