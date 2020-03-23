import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawcanvasComponent } from './drawcanvas.component';

describe('DrawcanvasComponent', () => {
  let component: DrawcanvasComponent;
  let fixture: ComponentFixture<DrawcanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawcanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
