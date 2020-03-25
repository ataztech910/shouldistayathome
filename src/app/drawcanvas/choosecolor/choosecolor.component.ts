import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-choosecolor',
  templateUrl: './choosecolor.component.html',
  styleUrls: ['./choosecolor.component.sass']
})
export class ChoosecolorComponent implements OnInit {
  @Output() colorChanged: EventEmitter<number> =   new EventEmitter();
  
  colors = [
    'black',
    'red',
    'green',
    'blue',
    'yellow',
    'pink',
    'magenta',
    'cyan'
  ];
  currentColor = 'black'
  constructor() { }

  ngOnInit() {
  }

  changeColor(colorName) {
    this.currentColor = colorName;
    this.colorChanged.emit(colorName);
    // console.log({colorName});
  }
}
