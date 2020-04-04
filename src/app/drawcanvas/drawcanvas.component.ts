import { Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit } from '@angular/core';
import { fromEvent, Observable, merge } from 'rxjs';
import { switchMap, takeUntil, pairwise, finalize } from 'rxjs/operators'
import { WindowService } from '../services/window.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import 'firebase/firestore';
import { lzw } from 'node-lzw';
import { ActivatedRoute } from '@angular/router';

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
  proxyCoordinates = [];
  currentColor = 'black';
  private sub: any;
  sessionId: string;
  defaultId = 'kwPRCS7lvCCbpJ7n3MFV';
  mousePosition: {};
  lineHeight = 5;
  constructor(private windowService: WindowService, firestore: AngularFirestore, private route: ActivatedRoute) {
    this.sub = this.route.params.subscribe(params => {
      if (!params['id']) {
        this.sessionId = this.defaultId;  
      } else {
        this.sessionId = params['id']; 
      }
    });
    
    this.linesCollection = firestore.doc(`Drawings/${this.sessionId}`);
    this.coordinates = this.linesCollection.valueChanges().subscribe(data => {
      // console.log('this.currentDataArray ', data)
      this.currentDataArray = data.coordinates || [];
      // console.log('this.currentDataArray ',this.currentDataArray)
      if(this.currentDataArray && this.currentDataArray.length > 0) {
        this.lineId = this.currentDataArray.length;
        this.currentDataArray.forEach(line => {
          const currentLine =  JSON.parse(this.decode(line.data));
          const lineStyle = line.style;
          // console.log('Line is ', lineStyle);
          if(currentLine.x){
            this.drawDot(currentLine, lineStyle.color, lineStyle.lineWidth);
          } 
          else {
            for(let i = 0; i < currentLine.length; i++) {
                this.drawOnCanvas({ x: currentLine[i].prevX, y: currentLine[i].prevY }, 
                  { x: currentLine[i].nextX, y: currentLine[i].nextY }, lineStyle.color, lineStyle.lineWidth);
            }
          }
        });
      } else {
        this.lineId = 0;
      }
    });
  }
  clearCanvasHandler(status) {
    if (status) {
      this.linesCollection.set({coordinates: []});
      this.cx.clearRect(0, 0, this.windowService.windowRef.innerWidth - 20, this.windowService.windowRef.innerHeight - 90);
    }
  }
  colorChangedHandler(colorName) {
    if(colorName === 'white') {
      this.lineHeight = 30;
    } else {
      this.lineHeight = 5;
    }
    this.currentColor = colorName;
  }
  // addCoordinates(prevPos, currentPos, lineWidth: number, color: string): void {
  // ZIP Arrays into Database = 
  // TODO move it to service
  encode (c) {
    var x = 'charCodeAt',
    b, e = {},
    f = c.split(""),
    d = [],
    a = f[0],
    g = 256;
    for (b = 1; b < f.length; b++) c = f[b], null != e[a + c] ? a += c : (d.push(1 < a.length ? e[a] : a[x](0)), e[a + c] = g, g++, a = c);
    d.push(1 < a.length ? e[a] : a[x](0));
    for (b = 0; b < d.length; b++) d[b] = String.fromCharCode(d[b]);
    return d.join("")
  }
  decode (b) {
    var a, e = {},f,o, d = b.split(""), c = f = d[0],
    g = [c],
    h = o = 256;
    for (b = 1; b < d.length; b++) a = d[b].charCodeAt(0), a = h > a ? d[b] : e[a] ? e[a] : f + c, g.push(a), c = a.charAt(0), e[o] = f + c, o++, f = a;
    return g.join("")
  }
  
  addCoordinates(proxyCoordinates) {
    // console.log('current line is ', this.lineId)
    // const Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    const zipped = this.encode(JSON.stringify(proxyCoordinates));
    const unzipped = this.decode(zipped);
    // console.log('current proxyCoordinates zipped', zipped);
    // console.log('current proxyCoordinates unzipped', unzipped);
    if(zipped.length === 0) return false;
  //   console.log({proxyCoordinates});
  //   console.log(this.lineId);
  //   console.log('this.currentDataArray before ',this.currentDataArray);
    if(!this.currentDataArray[this.lineId]) {
      this.currentDataArray[this.lineId] = { data : '', style: {color: this.currentColor, lineWidth: this.lineHeight} };
    };
    this.currentDataArray[this.lineId].data = zipped;
  //   console.log( {coordinates: [...this.currentDataArray]} );
       this.linesCollection.set({coordinates: this.currentDataArray});
  }
  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.windowService.windowRef.innerWidth - 20; //this.width;
    canvasEl.height = this.windowService.windowRef.innerHeight - 90; //this.height;

    // let backgroundImage = new Image();
    // backgroundImage.src = 'http://clipart-library.com/coloring/Bdir6ekc9.jpg';
    // backgroundImage.onload = () => {
    //   console.log('backgroundImage ',backgroundImage);
    //   this.cx.drawImage(backgroundImage, 100, 0);
    // }

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
    const follower = document.getElementById('drawerCursor');

    mergeEventsMove.pipe(
    ).subscribe((res: any) => {
      // console.log('res', res);
      this.mousePosition = {
        x: res.offsetX,
        y: res.offsetY
      }
      // follower.style.top = res.offsetY + 'px'
      // follower.style.left = res.offsetX + 'px'
      // console.log('res', this.mousePosition);
    });

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
                // console.log('Line ID :', this.lineId);
                if(this.proxyCoordinates.length > 0){
                  this.addCoordinates(this.proxyCoordinates);
                } else {
                  this.addCoordinates(this.mousePosition);
                  this.drawDot(this.mousePosition, this.currentColor, this.lineHeight);
                }
                this.lineId ++;
                this.proxyCoordinates = [];
                // if (this.lineHeight === 30) this.lineHeight = 5;
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
        // follower.style.top = currentPos.y + 'px'
        // follower.style.left = currentPos.x + 'px'
        // console.log(prevPos)
        // console.log(currentPos)
        // this method we'll implement soon to do the actual drawing
        // this.addCoordinates(prevPos, currentPos, 2, 'red');
        this.drawOnCanvas(prevPos, currentPos, this.currentColor, this.lineHeight);
        this.prepareCoordinates(prevPos, currentPos);
      });
  }
  
  prepareCoordinates(prevPos, currentPos) {
    this.proxyCoordinates.push({prevX: prevPos.x, prevY: prevPos.y, nextX: currentPos.x, nextY: currentPos.y})
  }
  private drawDot(coordinates, currentColor, lineHeight) {
    // console.log('coordinates',coordinates);
    if (!this.cx) { return; }
    this.cx.beginPath();
    this.cx.arc(coordinates.x, coordinates.y, 0.3 , 0, 2 * Math.PI);
    this.cx.lineWidth = lineHeight;
    this.cx.strokeStyle = currentColor;
    this.cx.stroke();
  }
  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }, currentColor, lineHeight) {
    if (!this.cx) { return; }
    this.cx.beginPath();
    if (prevPos) {
      // this.cx.arc(currentPos.x, currentPos.y, 2, 0, 2 * Math.PI);
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.lineWidth = lineHeight;
      this.cx.strokeStyle = currentColor;
      this.cx.stroke();
    }
  }
}
