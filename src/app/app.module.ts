import { BrowserModule } from '@angular/platform-browser';
import { enableProdMode, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import {  } from 'firebase';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
// import { AngularFireModule, AuthMethods, AuthProviders, firebaseAuthConfig } from 'angularfire2';
import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { HomeComponent } from './main/home/home.component';
import { AboutComponent } from './main/about/about.component';
import { HelpComponent } from './main/help/help.component';
import { HeaderComponent } from './main/header/header.component';
import { FooterComponent } from './main/footer/footer.component';
import { PageNotFoundComponent } from './main/page-not-found/page-not-found.component';

import { AdminService } from './admin/admin.service';
import { AdminComponent } from './admin/admin.component';

import { StoryService } from './stories/story.service';
import { AllStoriesComponent } from './stories/all-stories/all-stories.component';
import { StoryDetailComponent } from './stories/story-detail/story-detail.component';
import { StoryCardComponent } from './stories/story-card/story-card.component';
import { FeaturedStoryCardComponent } from './stories/featured-story-card/featured-story-card.component';
import { EditStoryComponent } from './stories/edit-story/edit-story.component';
import { AddStoryComponent } from './stories/add-story/add-story.component';
import { StoryPreviewComponent } from './stories/story-preview/story-preview.component';
import { StoryTextPipe } from './stories/story-text.pipe';

import { CollectionService } from './collections/collection.service';
import { AllCollectionsComponent } from './collections/all-collections/all-collections.component';
import { CollectionDetailComponent } from './collections/collection-detail/collection-detail.component';
import { CollectionCardComponent } from './collections/collection-card/collection-card.component';
import { EditCollectionComponent } from './collections/edit-collection/edit-collection.component';
import { AddCollectionComponent } from './collections/add-collection/add-collection.component';
import { RelatedStoriesComponent } from './stories/related-stories/related-stories.component';
import { TermsComponent } from './main/terms/terms.component';
import { ContactComponent } from './main/contact/contact.component';
import { TeamComponent } from './main/team/team.component';
import { InstagramComponent } from './main/instagram/instagram.component';
import { InstagramService } from './main/instagram/instagram.service';

import { EmailComponent } from './main/email/email.component';
import { EmailService } from './main/email/email.service';
import { OnTheRoadComponent } from './main/on-the-road/on-the-road.component';
import { ShareAStoryComponent } from './main/share-a-story/share-a-story.component';
import { StoryCardFullWidthComponent } from './stories/story-card-full-width/story-card-full-width.component';
import { StoryCardRoundComponent } from './stories/story-card-round/story-card-round.component';

// export const firebaseConfig = {
//     apiKey: "AIzaSyB5VwnRvhoawRKo7hemZKQIqTwpDaXzewg",
//     authDomain: "zinnia-stories.firebaseapp.com",
//     databaseURL: "https://zinnia-stories.firebaseio.com",
//     projectId: "zinnia-stories",
//     storageBucket: "zinnia-stories.appspot.com",
//     messagingSenderId: "1015420821833"
// };

export const firebaseConfig = {
    apiKey: "AIzaSyAJiWALttFWhTabft-tHz81gp8beBnLsS4",
    authDomain: "zinnia-test.firebaseapp.com",
    databaseURL: "https://zinnia-test.firebaseio.com",
    projectId: "zinnia-test",
    storageBucket: "zinnia-test.appspot.com",
    messagingSenderId: "405819933312"
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    HelpComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    AdminComponent,
    StoryDetailComponent,
    StoryCardComponent,
    FeaturedStoryCardComponent,
    AllStoriesComponent,
    EditStoryComponent,
    AddStoryComponent,
    AllCollectionsComponent,
    CollectionDetailComponent,
    CollectionCardComponent,
    EditCollectionComponent,
    AddCollectionComponent,
    StoryTextPipe,
    StoryPreviewComponent,
    RelatedStoriesComponent,
    TermsComponent,
    ContactComponent,
    TeamComponent,
    InstagramComponent,
    EmailComponent,
    OnTheRoadComponent,
    ShareAStoryComponent,
    StoryCardFullWidthComponent,
    StoryCardRoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

    routing,
    JsonpModule
  ],
  providers: [
    AdminService,
    StoryService,
    CollectionService,
    InstagramService,
    EmailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
