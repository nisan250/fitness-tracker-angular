import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [
    AuthRoutingModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    SharedModule,
  ],
})
export class AuthModule {}
