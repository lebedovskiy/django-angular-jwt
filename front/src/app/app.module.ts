import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ProfileComponent} from './profile/profile.component';

import {routing} from './app.routing';
import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';
import {UserService} from './user.service';
import {MatButtonModule, MatInputModule, MatFormFieldModule} from '@angular/material';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    routing
  ],
  providers: [
    AuthGuard,
    AuthService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
