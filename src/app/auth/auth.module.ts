import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginFormComponent} from './login-form/login-form.component';
import {RegistrationFormComponent} from './registration-form/registration-form.component';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthComponent} from './auth.component';

const AUTH_ROUTES: Routes = [
  {
    path: 'auth', component: AuthComponent,
    children: [
      {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
      {path: 'sign-in', component: LoginFormComponent},
      {path: 'sign-up', component: RegistrationFormComponent}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(AUTH_ROUTES)
  ],
  declarations: [
    LoginFormComponent,
    RegistrationFormComponent,
    AuthComponent
  ],
  exports: [RouterModule]
})
export class AuthModule {
}
