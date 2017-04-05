import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FirebaseListObservable } from 'angularfire2';
import { AdminService } from '../../admin/admin.service';
import { StoryService } from '../story.service';
import { Story } from '../story';
import { CollectionService } from '../../collections/collection.service';
import { Collection } from '../../collections/collection';

@Component({
  selector: 'app-edit-story',
  templateUrl: './edit-story.component.html',
  styleUrls: ['./edit-story.component.css']
})
export class EditStoryComponent implements OnInit {

  key: string;
  isAuth: any;
  story: Observable<Story[]>;

  collections: FirebaseListObservable<any[]>

  editorLoaded: boolean;

  uploaded: string;
  quill: any;
  readOnlyQuill: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storyService: StoryService,
    private collectionService: CollectionService,
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
      this.story = this.storyService.getStoryAsArray(this.key);

      this.collections = this.collectionService.getCollections();
    });
    
    this.story.subscribe(x => {
      let timeout = setTimeout(() => {
        this.loadEditor(x[0]);
        clearTimeout(timeout);
      }, 500);
    });

    
  }

  loadEditor(storyObject: Story) {
    if (!this.editorLoaded) {
      this.editorLoaded = true;

      // var FontAttributor = Quill.import('attributors/class/font');
      // FontAttributor.whitelist = [
      //   'cormorant-garamond', 'milkshake'
      // ];
      // Quill.register(FontAttributor, true);

      // var toolbarOptions = [['bold', 'italic', 'underline', 'strike'], ['link', 'image']];
      var toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
        // [{ 'font': ['cormorant-garamond', 'serif', 'sans serif', 'monospace', 'milkshake'] }]                                         // remove formatting button
      ];

      this.quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        }
      });
      this.quill.setContents(storyObject.delta);
    }
  }

  featureStory(story: Story) {
    this.storyService.featureStory(story)
      .then(_ => this.goBack())
      .catch(err => console.log(err));
  }

  unfeatureStory(story: Story) {
    this.storyService.unfeatureStory(story)
      .then(_ => this.goBack())
      .catch(err => console.log(err));
  }

  /**
   * FOR NOW ONLY PROPERTIES
   * update story and wait for completion to navigate away
   */
  updateStory(story: Story) {
    var delta = this.quill.getContents();
    story.delta = delta;

    var text = this.quill.getText();
    story.text = text;

    console.log(story);

    this.storyService.updateStory(story)
      .then(_ => this.goBack())
      .catch(err => console.log(err));
  }

  /**
   * deletes story and navigates to story list upon completion
   */
  deleteStory(story: Story) {
    let subscription = this.storyService.deleteStory(story).subscribe(
      message => console.log(message),
      err => console.log(err),
      () => {
        console.log('complete?');
        subscription.unsubscribe();
        let link = ['/stories'];
        this.router.navigate(link);
      }
    );
  }

  addToCollection(story: Story, collectionObject: any) {
    let collection = new Collection(collectionObject);
    this.storyService.addToCollection(story, collection)
      .then(x => console.log(x))
      .catch(err => console.log(err));
  }

  removeFromCollection(story: Story, collectionObject: any) {
    let collection = new Collection(collectionObject);
    this.storyService.removeStoryFromCollection(story.$key, collection.$key)
      .then(x => console.log(x))
      .catch(err => console.log(err));
  }

  featureInCollection(story: Story, collectionObject: any) {
    let collection = new Collection(collectionObject);
    this.storyService.removeStoryFromCollection(story.$key, collection.$key)
      .then(x => {
        this.storyService.featureInCollection(story, collection)
          .then(x => console.log(x))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  unfeatureInCollection(story: Story, collectionObject: any) {
    let collection = new Collection(collectionObject);
    this.storyService.removeStoryFromFeaturedCollection(story.$key, collection.$key)
      .then(x => {
        this.storyService.addToCollection(story, collection)
          .then(x => console.log(x))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  /**
   * redirects back to story
   */
  goBack(): void {
    let link = ['/stories', this.key];
    this.router.navigate(link);
  }

}
