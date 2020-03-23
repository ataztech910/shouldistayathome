import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosecolorComponent } from './choosecolor.component';

describe('ChoosecolorComponent', () => {
  let component: ChoosecolorComponent;
  let fixture: ComponentFixture<ChoosecolorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosecolorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosecolorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
