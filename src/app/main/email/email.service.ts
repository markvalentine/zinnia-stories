import { Injectable } from '@angular/core';
import { Jsonp, URLSearchParams } from '@angular/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EmailService {

  api_key: "WMNgP08CTRbImdtY";
  emailsUrl = 'emails/';

  constructor(
    private jsonp: Jsonp,
    private http: Http,
    private af: AngularFire
  ) { }

  validateEmail(email: string): boolean {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  addEmail(email: string): Promise<any> {
    let validation = this.validateEmail(email);
    let cleanedEmail = email;
    if (email) {
      cleanedEmail = email.replace(/\./g, ',');
    }
    let emailRef = this.af.database.object(this.emailsUrl+cleanedEmail);

    return new Promise(function(resolve, reject) {
      if (validation) {
        emailRef.set(0)
          .then(x => resolve("email recieved!"))
          .catch(err => reject("server error :(\nplease try again!"));
      } else {
        reject("invalid email :(");
      }
    });

  }

}
