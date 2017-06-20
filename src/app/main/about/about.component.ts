import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SeoService } from '../seo.service';

declare let ga: Function;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  private pageTitle = "About Us | Ramblin Stories";
  private pageDescription = "Our goal is to foster intergenerational communities by producing creative content centered around the lives and stories of older adults.";

  opened = {
    bg : {
      height: "440px"
    },
    cover: {
      height: "440px",
      padding: "151px 0",
      background: "rgba(31,45,62,0.20)"
    },
    text: {
      display: "block"
    },
    triangle: {
      transform: "rotate(180deg)"
    }
  }

  closed = {
    bg : {
      height: "210px"
    },
    cover: {
      height: "210px",
      padding: "20px",
      background: "rgba(31,45,62,0.60)"
    },
    text: {
      display: "none"
    },
    triangle: {
      transform: "none"
    }
  }

  intergenerational = {
    bg : {
      height: "210px"
    },
    cover: {
      height: "210px",
      padding: "20px",
      background: "rgba(31,45,62,0.60)"
    },
    text: {
      display: "none"
    },
    triangle: {
      transform: "none"
    },
    opened: false,
    scroll: 0
  }

  loneliness = {
    bg : {
      height: "210px"
    },
    cover: {
      height: "210px",
      padding: "20px",
      background: "rgba(31,45,62,0.60)"
    },
    text: {
      display: "none"
    },
    triangle: {
      transform: "none"
    },
    opened: false,
    scroll: 0
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seoService: SeoService
  ) {
    this.seoService.setTitle(this.pageTitle);
    this.seoService.setMetaDescription(this.pageDescription);
  }

  ngOnInit() {
    this.close_all();
    this.route.fragment.forEach((value: String) => {
      if (value == "partners") {
        document.getElementById('partners').scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    });
  }

  handleOutboundLinkClicks(link: string) {
    ga('send', 'event', {
      eventCategory: 'Outbound Link',
      eventAction: 'click',
      eventLabel: link,
      transport: 'beacon'
    });
  }

  intergenerational_clicked() {
    if (this.intergenerational.opened) {
      //close both
      // this.close_all();
      this.close_intergenerational();
    } else {
      //open and set other to not opened not closed state
      this.open_intergenerational();
      // this.standby_loneliness();
    }
  }

  loneliness_clicked() {
    if (this.loneliness.opened) {
      //close both
      // this.close_all();
      this.close_loneliness();
    } else {
      //open and set other to not opened not closed state
      this.open_loneliness();
      // this.standby_intergenerational();
    }
  }

  open_intergenerational() {
    this.intergenerational.scroll = window.scrollY;
    this.intergenerational.bg = this.opened.bg;
    this.intergenerational.cover = this.opened.cover;
    this.intergenerational.text = this.opened.text;
    this.intergenerational.triangle = this.opened.triangle;
    this.intergenerational.opened = true;
  }

  open_loneliness() {
    this.loneliness.scroll = window.scrollY;
    this.loneliness.bg = this.opened.bg;
    this.loneliness.cover = this.opened.cover;
    this.loneliness.text = this.opened.text;
    this.loneliness.triangle = this.opened.triangle;
    this.loneliness.opened = true;
  }

  close_all() {
    this.close_intergenerational();
    this.close_loneliness();
  }

  close_intergenerational() {
    this.intergenerational.bg = this.closed.bg;
    this.intergenerational.cover = this.closed.cover;
    this.intergenerational.text = this.closed.text;
    this.intergenerational.triangle = this.closed.triangle;
    this.intergenerational.opened = false;

    // console.log(window.scrollY, this.intergenerational.scroll);
    // document.getElementById('why').scrollIntoView({block: "start", behavior: "smooth"});
    this.scrollUp(this.intergenerational.scroll);
    // this.animateScroll(this.intergenerational.scroll);
  }

  close_loneliness() {
    this.loneliness.bg = this.closed.bg;
    this.loneliness.cover = this.closed.cover;
    this.loneliness.text = this.closed.text;
    this.loneliness.triangle = this.closed.triangle;
    this.loneliness.opened = false;

    this.scrollUp(this.loneliness.scroll);

    // document.getElementById('why').scrollIntoView({block: "start", behavior: "smooth"});
  }

  scrollUp(to: number) {
    if (window.scrollY > to) {
      window.scrollTo(window.scrollX, Math.max(to, document.getElementById('why').offsetTop));
    }
  }

  animateScroll(to: number) {
    var from = window.scrollY;

    var diff = (from - to) / 60

    if(from > to) {
      var id = setInterval(frame, 5);
    }

    function frame() {
          if (from <= to) {
              clearInterval(id);
          } else {
              from -= diff;
              window.scrollTo(window.scrollX, from);
        }
    }
  }

  // standby_intergenerational() {
  //   this.intergenerational.bg = this.bg.standby;
  //   this.intergenerational.cover = this.cover.standby;
  //   this.intergenerational.text = this.text.standby;
  //   this.intergenerational.opened = false;
  // }

  // standby_loneliness() {
  //   this.loneliness.bg = this.bg.standby;
  //   this.loneliness.cover = this.cover.standby;
  //   this.loneliness.text = this.text.standby;
  //   this.loneliness.opened = false;
  // }

}
