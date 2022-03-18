import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanDetailsComponent } from './scan-details.component';

describe('ScanDetailsComponent', () => {
  let component: ScanDetailsComponent;
  let fixture: ComponentFixture<ScanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
