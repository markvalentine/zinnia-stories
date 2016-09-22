import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isAuth: any;
  email: string;
  password: string;

  constructor( private adminService: AdminService ) {
    this.isAuth = adminService.isAuth();
  }

  ngOnInit() {}

  /**
   * login user
   */
  login() {
    this.adminService.login(this.email, this.password);
  }

  /**
   * logout user
   */
  logout() {
    this.adminService.logout();
  }


}
