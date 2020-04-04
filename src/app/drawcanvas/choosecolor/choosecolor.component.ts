import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-choosecolor',
  templateUrl: './choosecolor.component.html',
  styleUrls: ['./choosecolor.component.sass']
})
export class ChoosecolorComponent implements OnInit {

  @Output() colorChanged: EventEmitter<number> =   new EventEmitter();
  @Output() clearedCanvas: EventEmitter<boolean> =   new EventEmitter();

  colors = [
    'black',
    'red',
    'green',
    'blue',
    'yellow',
    'pink',
    'magenta',
    'cyan',
    'white'
  ];
  currentColor = 'black'
  constructor() { }

  ngOnInit() {
  }
  clearCanvas() {
    this.clearedCanvas.emit(true);
  }
  changeColor(colorName) {
    this.currentColor = colorName;
    this.colorChanged.emit(colorName);
    // console.log({colorName});
  }
}
