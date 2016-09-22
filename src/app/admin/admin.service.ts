import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, AngularFireAuth, AuthProviders, AuthMethods } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'

@Injectable()
export class AdminService {

  constructor(private af: AngularFire) {}

  isAuth(): AngularFireAuth {
    return this.af.auth;
  }

  //TODO: Return any errors
  login(email: string, password: string) {
    this.af.auth.login({
      email: email,
      password: password,
    },
    {
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    });
  }

  //TODO: Return any errors
  logout() {
    this.af.auth.logout();
  }

}