import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFire, AngularFireAuth, AuthProviders, AuthMethods } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'
import * as firebase from 'firebase/app';

@Injectable()
export class AdminService {

  user: Observable<firebase.User>;

  constructor(private auth: AngularFireAuth) {
    this.user = this.auth.authState;
  }

  isAuth(): Observable<any> {
    return this.auth.authState;
  }

  //TODO: Return any errors
  login(email: string, password: string) {
    this.auth.auth.signInWithEmailAndPassword(email, password);
    // this.af.auth.login({
    //   email: email,
    //   password: password,
    // },
    // {
    //   provider: AuthProviders.Password,
    //   method: AuthMethods.Password,
    // });
  }

  //TODO: Return any errors
  logout() {
    // this.af.auth.logout();
    this.auth.auth.signOut();
  }

}