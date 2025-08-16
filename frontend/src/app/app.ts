import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Dashboard } from './components/dashboard/dashboard';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Navbar, Dashboard, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
}
