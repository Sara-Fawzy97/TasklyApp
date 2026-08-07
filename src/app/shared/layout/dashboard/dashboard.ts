import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { RouterOutlet } from "@angular/router";
import { MobNavbar } from "../../components/mob-navbar/mob-navbar";

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, Sidebar, RouterOutlet, MobNavbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
