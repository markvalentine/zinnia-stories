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

  email: string;
  message: string;

  max_height = "0";
  padding = "0";
  padding_image = "0";
  transition = "";
  transition_long = "";
  opacity = "0";
  background_color = "";

  constructor(private emailService: EmailService) {
  }

  ngOnInit() {
    if (!this.backgroundColor) this.backgroundColor = "red";
  }

  removeMessage() {
    this.opacity = "0";
    this.transition = "all .16s ease-in-out";
    this.transition_long = "all .16s ease-in-out";
    let timeout = setTimeout(() => {
      this.max_height = "0";
      this.padding = "0";
      this.padding_image = "0";

      clearTimeout(timeout);
      let timeout2 = setTimeout(() => {
        this.background_color = "";
        this.message = "";
        clearTimeout(timeout2);
      }, 320);
    }, 160);
  }

  displayMessage(message: string, valid: boolean) {
    if (valid ) this.background_color = "valid";
    else this.background_color = "invalid";
    this.message = message;
    this.max_height = "200px";
    this.padding = "10px 48px 10px 20px";
    this.padding_image = "12px 11px 8px";
    this.transition = "all .16s ease-in-out";
    this.transition_long = "all .16s ease-in-out";
    
    let timeout = setTimeout(() => {
      this.opacity = "1";
      clearTimeout(timeout);
    }, 160);
  }
  
  validateEmail(email): boolean {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  registerEmail() {
    this.emailService.addEmail(this.email)
      .then(message => {
        this.email = "";
        this.displayMessage(message, true);
      })
      .catch(err => {
        this.displayMessage(err, false);
      });
  }

}
