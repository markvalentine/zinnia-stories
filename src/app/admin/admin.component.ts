import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { AdminService } from './admin.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isAuth: Observable<boolean>;
  email: string;
  password: string;

  constructor(
    private af: AngularFire,
    private adminService: AdminService
  ) {
    this.isAuth = adminService.isAuth();
  }

  ngOnInit() {}

  /**
   * login user
   */
  login() {
    this.af.auth.login({
      email: this.email,
      password: this.password,
    },
    {
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    });
  }

  /**
   * logout user
   */
  logout() {
    this.af.auth.logout();
  }


}
