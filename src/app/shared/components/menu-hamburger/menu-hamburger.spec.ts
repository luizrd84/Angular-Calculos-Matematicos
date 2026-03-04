import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHamburger } from './menu-hamburger';

describe('MenuHamburger', () => {
  let component: MenuHamburger;
  let fixture: ComponentFixture<MenuHamburger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHamburger]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuHamburger);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
