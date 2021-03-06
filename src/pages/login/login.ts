import { Component, Inject } from '@angular/core';
import {Validators, FormBuilder } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp } from 'angularfire2';
import { TabsPage } from '../tabs/tabs';




@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['/login.scss']
})
export class LoginPage {

  users: FirebaseListObservable<any>;
  currentUser: FirebaseObjectObservable<any>;
  nickname: string;
  email: string;
  password: string;
  userInfo: any;
  defaultProfileImg: string;
  defaultImg: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(FirebaseApp)  firebaseApp: any, private _auth: AuthService, public af: AngularFire, private formBuilder: FormBuilder) {
    this.users = af.database.list('/users');
    this.defaultImg = firebaseApp.storage().ref().child('images/defaultProfileImage.jpg');



    this.userInfo = this.formBuilder.group({
      nickname: [''],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }



  logForm() {
    console.log(this.userInfo.value)

  }

  private onSignInSuccess(): void {
    console.log(this._auth);
    this.navCtrl.setRoot(TabsPage);
  }


  signIn(): void {
    this._auth.signIn(this.userInfo.value)
      .then(() => this.onSignInSuccess());
  }

  register(): void {
    this.defaultImg.getDownloadURL().then(url => this.defaultProfileImg = url);

    this._auth.register(this.userInfo.value)
      .then((data) => {
        this.currentUser = this.af.database.object(`/users/${data.uid}`);
        this.currentUser.set({
          nickname : this.userInfo.value.nickname,
          photoURL : this.defaultProfileImg
        });
        this.onSignInSuccess()
      })
      .then(() => {
      this._auth.authState.auth.updateProfile({
        displayName: this.userInfo.value.nickname,
        photoURL: this.defaultProfileImg

      })
      })

  }

}


