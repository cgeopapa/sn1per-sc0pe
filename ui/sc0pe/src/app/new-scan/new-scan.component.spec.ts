import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScanComponent } from './new-scan.component';

describe('NewScanComponent', () => {
  let component: NewScanComponent;
  let fixture: ComponentFixture<NewScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewScanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
