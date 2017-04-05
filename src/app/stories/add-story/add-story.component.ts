import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../admin/admin.service';
import { StoryService } from '../story.service';
import { Story } from '../story';

import { AngularFire, FirebaseObjectObservable, AngularFireAuth, AuthProviders, AuthMethods } from 'angularfire2';

@Component({
  selector: 'app-add-story',
  templateUrl: './add-story.component.html',
  styleUrls: ['./add-story.component.css']
})
export class AddStoryComponent implements OnInit {
  
  story: Story;
  storyPreview: Story;
  isAuth: AngularFireAuth;
  isAdding: boolean;
  editorLoaded: boolean;

  uploaded: string;
  imageUploaded = false;
  margin = "0";
  imageUrl = "";
  quill: any;
  readOnlyQuill: any;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private storyService: StoryService,
    private af: AngularFire
  ) {
    this.story = new Story();
    this.storyPreview = new Story();
    this.isAuth = this.af.auth;
    this.isAdding = false;
    this.editorLoaded = false;

    this.uploaded = "no upload in progress";
  }

  ngOnInit() {
    let timeout = setTimeout(() => {
      this.loadEditor();
      clearTimeout(timeout);
    }, 750);
  }

  loadEditor() {
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
        },
        placeholder: "Compose your magnum opus here..."
      });
    }
  }

  previewStory() {
    this.getDelta();
    this.getText();
    this.storyPreview = this.story;
    var tempCont = document.getElementById('delta');
    (new Quill(tempCont, {readOnly: true})).setContents(this.story.delta);
    tempCont.getElementsByClassName("ql-editor")[0].setAttribute("style", "padding: 0;");
    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
  }

  getDelta() {
    var delta = this.quill.getContents();
    this.story.delta = delta;
  }

  getText() {
    var text = this.quill.getText();
    this.story.text = text;
  }

  resetForm() {
    this.story = new Story();
    this.quill.setContents([]);
    this.isAdding = false;
  }

  // only does title, description, text for now
  addStory() {
    this.isAdding = true;
    var delta = this.quill.getContents();
    this.story.delta = delta;
    this.getText();
    this.storyService.addStory(this.story)
      .then(key => {
        this.resetForm()
        let link = ['/stories/'+key];
        this.router.navigate(link);
      })
      .catch(err => {
        console.log(err);
        this.isAdding = false;
      });
  }

  changeListener(event) {
    let file = event.target.files[0];
    let progress = 0;
    let downloadURL = '';
    this.imageUploaded = false;
    this.margin = "20px 0";
    this.storyService.uploadImage(file).subscribe(
      m => {
        console.log(m, progress);
        if (progress == 100) {
          downloadURL = m;
          this.uploaded = "finished uploading: " + downloadURL;
          this.story.image_url = downloadURL;
          this.imageUrl = downloadURL;
          this.imageUploaded = true;
          this.margin = "0";
        } else {
          progress = m;
          this.uploaded = progress+"%";
        }
      },
      err => this.uploaded = err+'',
      () => {
        // this.uploaded = 'upload complete';
      }
    )
    
  }

}
