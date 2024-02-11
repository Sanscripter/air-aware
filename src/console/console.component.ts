import { Component, OnInit } from '@angular/core';
import { InteractiveViewComponent } from '../InteractiveView/InteractiveView.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-console',
  standalone: true,
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css'],
  imports: [
    InteractiveViewComponent,
    MenuComponent
  ]
})
export class ConsoleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
