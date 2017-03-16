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

  validateEmail(email: string): Boolean {
    return true
  }

  // addStory(story: Story): Promise<any> {
  //   let date = new Date().getTime();
  //   let storiesRef = this.af.database.list(this.storiesUrl)
  //   return new Promise(function(resolve, reject) {
  //     storiesRef.push({
  //       'title': story.title,
  //       'description': story.description,
  //       'text': story.text,
  //       'image_url': story.image_url,
  //       'date_created': -date,
  //       'delta': story.delta
  //     })
  //       .then(story => {
  //         resolve(story.key);
  //       })
  //       .catch(err => reject(err));
  //   });

  addEmail(email: string): Promise<any> {
    let emailsRef = this.af.database.list(this.emailsUrl);
    let validation = this.validateEmail(email);
    return new Promise(function(resolve, reject) {
      if (validation) {
        emailsRef.push(email)
          .then(x => resolve(x))
          .catch(err => reject(err));
      } else {
        reject("Invalid Email");
      }
    });
  }

  //  getInsta() {
  //   let url = 'https://api.instagram.com/v1/users/self/media/recent';
  //   // {access_token: token, count: 10};
  //   let params = new URLSearchParams();
  //   params.set('access_token', this.token); // the user's search value
  //   // params.set('count', '20');
  //   params.set('format', 'json');
  //   params.set('callback', 'JSONP_CALLBACK');

  //   return this.jsonp
  //              .get(url, { search: params })
  //              .map(response => <string[]> response.json());
  // }

  createUser(email: String) {
    let url = 'https://api.sendinblue.com/v2.0/user/createdituser';
    let list_ID = 2

    let params = new URLSearchParams();
    params.set('api-key', this.api_key); // the user's search value
    // params.set('count', '20');
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');

    let data = {"email": email, "listid": [list_ID]};
    
    // return this.http.post(url, JSON.stringify(data), {headers:{'content-type':'application/json','api-key':this.api_key}})

    return this.jsonp
               .post(url, JSON.stringify(data), {search: params})
               .map(response => <string[]> response.json());
  }

  //	curl -H 'api-key:your_access_key' -X POST -d '{"email":"example@example.net","attributes":{"FNAME":"name","SURNAME":"surname"},"listid":[1,4,6],"listid_unlink":[2,5]}' 'https://api.sendinblue.com/v2.0/user/createdituser'

  //this.http.post(url, JSON.stringify(data), {headers:{'Content-Type': 'application/json'}})

}
