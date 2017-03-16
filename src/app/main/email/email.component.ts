import { Component, OnInit, Input } from '@angular/core';
import { EmailService } from './email.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  @Input()
  backgroundColor: string;

  email: string

  constructor(private emailService: EmailService) {
  }

  ngOnInit() {
    if (!this.backgroundColor) this.backgroundColor = "red";
  }

  registerEmail() {
    console.log(this.email);

    this.emailService.addEmail(this.email)
      .then(x => console.log(x))
      .catch(err => console.log(err));

    // this.emailService.createUser(this.email).subscribe(x => {
    //   console.log("HERE IT IS: ", x);
    // }, error => {
    //   console.log("ERROR ERROR: ", error);
    // })
  }

}
