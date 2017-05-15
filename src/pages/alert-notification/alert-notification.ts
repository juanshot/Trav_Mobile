import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ViewController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AlertDetailPage } from '../alert-detail/alert-detail';

@Component({
  selector: 'alert-notification',
  templateUrl: 'alert-notification.html'
})
export class AlertNotification {

  lastSlide = false;
  title:any;
  message:any;
  alert_id:any;

  @ViewChild('slider') slider: Slides;

  constructor(public nav: NavController,public view:ViewController,public params: NavParams) {
        
        this.title = this.params.get('title');
        this.message = this.params.get('message');
        this.alert_id = this.params.get('alert_id');
        console.log(params);
        

  }

  skipIntro() {
    // You can skip to main app
    // this.nav.setRoot(TabsNavigationPage);

    // Or you can skip to last slide (login/signup slide)
    this.lastSlide = true;
    this.slider.slideTo(this.slider.length());
  }
  closeAlert(){
    this.view.dismiss();
  }

  onSlideChanged() {
    // If it's the last slide, then hide the 'Skip' button on the header
    this.lastSlide = this.slider.isEnd();
  }

  goToLogin() {
    this.nav.push(LoginPage);
  }
  goToDetail(alertId){
      this.nav.push(AlertDetailPage,{alert_id: alertId});
      this.view.dismiss();
  }
}
