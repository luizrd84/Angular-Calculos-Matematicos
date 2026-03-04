import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuHamburger } from './shared/components/menu-hamburger/menu-hamburger';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuHamburger, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('01-basic');



}
