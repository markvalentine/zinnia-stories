import { BrowserModule } from '@angular/platform-browser';
import { enableProdMode, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AngularFireModule, AuthMethods, AuthProviders, firebaseAuthConfig } from 'angularfire2';
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

export const firebaseConfig = {
  apiKey: "AIzaSyB5VwnRvhoawRKo7hemZKQIqTwpDaXzewg",
  authDomain: "zinnia-stories.firebaseapp.com",
  databaseURL: "https://zinnia-stories.firebaseio.com",
  storageBucket: "zinnia-stories.appspot.com",
};

export const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Redirect
}

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
    EditStoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    routing
  ],
  providers: [
    AdminService,
    StoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
