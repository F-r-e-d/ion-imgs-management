import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesManagementComponent } from './images-management.component';

describe('ImagesManagementComponent', () => {
  let component: ImagesManagementComponent;
  let fixture: ComponentFixture<ImagesManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImagesManagementComponent]
    });
    fixture = TestBed.createComponent(ImagesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
