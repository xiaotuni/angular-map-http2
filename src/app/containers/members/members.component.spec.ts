import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Members } from './members.component';

describe('Members', () => {
  let component: Members;
  let fixture: ComponentFixture<Members>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Members ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Members);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
