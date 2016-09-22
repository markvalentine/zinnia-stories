import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AdminService } from '../../admin/admin.service';
import { StoryService } from '../story.service';
import { Story } from '../story';

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.component.html',
  styleUrls: ['./story-detail.component.css']
})
export class StoryDetailComponent implements OnInit {

  key: string;
  isAuth: any;
  story: Observable<Story>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storyService: StoryService,
    private adminService: AdminService
  ) { }

  /**
   * On Init: 
   * get key from params, get authentication from service, get story from service
   */
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.key = params['key'];
      this.isAuth = this.adminService.isAuth();
      this.story = this.storyService.getStory(this.key);
    });
  }

  /**
   * redirects to edit page for this story
   */
  toEdit(): void {
    let link = ['/edit-story', this.key];
    this.router.navigate(link);
  }

}
