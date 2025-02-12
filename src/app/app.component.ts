import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from "./shared/sidebar/sidebar.component";
import {WebSocketMangerService} from "./services/web-socket-manger.service";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'WebSocketClient';

  constructor(private webSocketServices: WebSocketMangerService) { }

  ngOnInit() {
    this.webSocketServices.connect();
  }
}
