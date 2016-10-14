import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  checked: boolean;

  constructor() { }

  ngOnInit() {
  }

  closeMenu() {
    console.log(this.checked);
    this.checked = false;
    console.log(this.checked);
  }

}
