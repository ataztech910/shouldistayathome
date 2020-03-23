import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-choosecolor',
  templateUrl: './choosecolor.component.html',
  styleUrls: ['./choosecolor.component.sass']
})
export class ChoosecolorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  changeColor(colorName) {
    console.log({colorName});
  }
}
