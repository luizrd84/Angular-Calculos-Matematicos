import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-menu-hamburger',
  imports: [CommonModule, RouterLink ],
  templateUrl: './menu-hamburger.html',
  styleUrl: './menu-hamburger.css',
})
export class MenuHamburger {

  @Input() side: 'left' | 'right' = 'left';

  isOpen = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

 

}
