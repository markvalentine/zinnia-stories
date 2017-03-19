import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.fragment.forEach((value: String) => {
      if (value == "partners") {
        document.getElementById('partners').scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    });
  }

}