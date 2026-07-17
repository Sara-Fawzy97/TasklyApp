import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar,Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
