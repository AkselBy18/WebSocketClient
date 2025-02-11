import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
      CommonModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  data: number[] = [1,2,3,4,5,6,7,8,9, 1, 2, 3, 4, 5, 6, 7, 8];
}
