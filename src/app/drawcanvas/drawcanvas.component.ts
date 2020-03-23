import { Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit } from '@angular/core';
import { fromEvent, Observable, merge } from 'rxjs';
import { switchMap, takeUntil, pairwise, finalize } from 'rxjs/operators'
import { WindowService } from '../services/window.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import 'firebase/firestore';

@Component({
  selector: 'app-drawcanvas',
  templateUrl: './drawcanvas.component.html',
  styleUrls: ['./drawcanvas.component.sass']
})
export class DrawcanvasComponent implements AfterViewInit  {
  @ViewChild('canvas', null) public canvas: ElementRef;
  linesCollection: AngularFirestoreDocument<any>;
  coordinates: any; // TODO add type for coordinates
  currentDataArray: any;
  lineId: number;
  constructor(private windowService: WindowService, firestore: AngularFirestore) {
    const sessionId = 'gcQe7xUdjlxcAeMEMKHo';
    this.linesCollection = firestore.doc(`Drawings/${sessionId}`);
    this.coordinates = this.linesCollection.get().subscribe(data => {
      console.log('this.currentDataArray ', data.data())
      this.currentDataArray = data.data().coordinates || [];
      console.log('this.currentDataArray ',this.currentDataArray)
      if(this.currentDataArray && this.currentDataArray.length > 0) {
        this.lineId = this.currentDataArray.length;
        this.currentDataArray.forEach(line => {
          for(let i = this.lineId; i < line.data.length - 1; i++) {
            this.drawOnCanvas({ x: line.data[i].data.x, y: line.data[i].data.y }, 
                { x: line.data[i + 1].data.x, y: line.data[i + 1].data.y });
          }
        });
      } else {
        this.lineId = 0;
      }
      console.log('data', this.currentDataArray);
    });
  }
  addCoordinates(x: number, y:number, lineWidth: number, color: string): void {
    // console.log({x, y, lineWidth, color});
    if(!this.currentDataArray[this.lineId]) {
      this.currentDataArray[this.lineId] = { data : [] };
    };
    this.currentDataArray[this.lineId].data.push({data: {x, y, lineWidth, color}});
    // console.log( {coordinates: this.currentDataArray} );
    this.linesCollection.update({coordinates: this.currentDataArray});
  }
  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.windowService.windowRef.innerWidth - 20; //this.width;
    canvasEl.height = this.windowService.windowRef.innerHeight - 100; //this.height;

    console.log('height ', canvasEl.height);

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }
  // setting a width and height for the canvas
  @Input() public width = 340;
  @Input() public height = 600;
  private cx: CanvasRenderingContext2D;  
  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    const mouseDown = fromEvent(canvasEl, 'mousedown');
    const touchDown = fromEvent(canvasEl, 'touchstart');
    const mouseMove = fromEvent(canvasEl, 'mousemove');
    const touchMove = fromEvent(canvasEl, 'touchmove');
    // const scroll = fromEvent(canvasEl, 'scroll');
    const mergeEventsStart = merge(mouseDown, touchDown);
    const mergeEventsMove = merge(mouseMove, touchMove);
    // fromEvent(canvasEl, 'mousedown')
    mergeEventsStart
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return mergeEventsMove
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              takeUntil(fromEvent(canvasEl, 'touchend')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise(),
              finalize(() => {
                this.lineId ++;
                console.log('Line ID :', this.lineId);
              })
            )
        })
      )
      .subscribe((res: [any , any]) => { // TODO CREATE A TYPE FOR THIS EVENT
        const rect = canvasEl.getBoundingClientRect();
        // previous and current position with the offset
        const clientX = res[0].touches ? res[0].touches[0].clientX : res[0].clientX;
        const clientY = res[0].touches ? res[0].touches[0].clientY : res[0].clientY;
        const currentClientX = res[1].touches ? res[1].touches[0].clientX : res[1].clientX;
        const currentClientY = res[1].touches ? res[1].touches[0].clientY : res[1].clientY;
        const prevPos = {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
        const currentPos = {
          x: currentClientX - rect.left,
          y: currentClientY - rect.top
        };
  
        // this method we'll implement soon to do the actual drawing
        this.addCoordinates(currentPos.x, currentPos.y, 2, 'red');
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }
    this.cx.beginPath();
    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.lineWidth = 2;
      this.cx.strokeStyle = 'red'
      this.cx.stroke();
    }
  }
}
