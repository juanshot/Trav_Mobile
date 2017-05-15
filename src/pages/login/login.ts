import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController,ViewController,ModalController} from 'ionic-angular';
import {FullInfoCountryPage} from '../full-info-country/full-info-country';
import { EndPoint } from '../../providers/end-point';
import { UserProvider } from '../../providers/user-provider';
import { MyAlertsPage } from '../my-alerts/my-alerts';
import { LocationTracker } from '../../providers/location-tracker';
import { GeoLocationProvider } from '../../providers/geo-location-provider';
import { Storage } from '@ionic/storage';
import { SubscriptionsService } from '../../providers/subscriptions-service';
import { OauthProvider } from '../../providers/oauth-provider';
import { InfoPage } from '../info-page/info-page';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  active:boolean= false;
  registrationCode:any="";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public endPoint:EndPoint,
              public toast:ToastController,
              public userInfo:UserProvider,
              public location:LocationTracker,
              public geo:GeoLocationProvider,
              public storage:Storage,
              public subsService:SubscriptionsService,
              public oauth:OauthProvider,
              public modal:ModalController

              ) {
  }


  onClickLogin(){
      this.navCtrl.push(FullInfoCountryPage);
  }
  ionViewWillEnter(){

  }
  info(){
    this.registrationCode == ''?this.active = false:this.active = true;
  }
  openInfoModal(){
    let infoModal = this.modal.create(InfoPage);
    infoModal.present();
  }

  register(){
    this.endPoint.getRegisterInfo(this.registrationCode).then(response=>{
      console.log(response.status);
      console.log(response.user);
      
      switch (response.status) {
        case "OK":
              this.userInfo.registered = true;
              let user = {
                account_id: response.user.account_id,
                email: response.user.email,
                mobile_identifier: this.userInfo.mobile_id,
                phone_number: response.user.phone_number,
                programs: response.user.programs,
                user_id: response.user.user_id,
                user_name: response.user.user_name, 

              }
              this.userInfo.setRegistrationInfo(user);
              
              
            this.oauth.getToken().then(token=>{

              this.endPoint.setSubscriptions(this.userInfo.user.user_id,token)
                     .then(result=>{
                       this.endPoint.fillCheckins(user.user_id,user.account_id,token);
                       console.log(result);
                       
                       this.endPoint.setCountries(token).then(
                         result2=>{
                              this.endPoint.setCategories(token).then(
                                result3 =>{
                                  
                                  this.userInfo.setRegistration();
                                  this.location.startTracking();
                                  this.geo.geolocateFirstTime();
                                  this.navCtrl.setRoot(MyAlertsPage);
                                }
                              )
                              
                         }
                       )
                       

                            })


            })
              
               
            
            
          break;

        case "EXPIRED":
              console.log('its expired');
              let toastExp =this.toast.create({
                                     message: "Your registration code is expired",
                                                            duration: 3000,
                                                            position: 'middle',
                                                            showCloseButton: true,
                                                            closeButtonText: 'x'
                                  });
                                  toastExp.present()
          break;

        case "NOTFOUND":
              console.log('its not found');
              let toastNotF =this.toast.create({
                                     message: "AlertTraveler requires that you provide your registration code obtained via logging into your institution's travel management website",
                                                            duration: 3000,
                                                            position: 'middle',
                                                            showCloseButton: true,
                                                            closeButtonText: 'x'
                                  });
                                  toastNotF.present()

          break;
      
        default:
          break;
      }
      
      
    })
  }

}
//Modal Info

@Component({
    template: `
    <ion-header class="walkthrough-header">
  <ion-toolbar>
    <ion-buttons end>
      <button ion-button class="skip-button" (click)="closeModal()" [hidden]="lastSlide">Skip</button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="walkthrough-content">
  <ion-slides #slider  pager="true">
    <ion-slide class="slide-1">
     
      <h2 class="main-title">AlertTraveler!</h2>
      <p class="intro-text">
        Text
      </p>
    </ion-slide>
    <ion-slide class="slide-2">
      <ion-row class="intro-image-row">
      
      </ion-row>
      <h2 class="main-title">Subscribe your destination</h2>
   
      <p class="intro-text">
          Description
      </p>
    </ion-slide>
    <ion-slide class="slide-3">
      <ion-row class="intro-image-row">
        <ion-col center width-64 no-padding>
          <img />
        </ion-col>
      </ion-row>
      <h2 class="main-title">Done!</h2>
      <p class="intro-text">
        Log in to your account.
      </p>
 
      <div class="button-bar">
        <button ion-button primary (click)="goToSignup()">Register my code</button>
      </div>
    </ion-slide>
  </ion-slides>
</ion-content>`
,
styles:[`
        .walkthrough-header
                {
                  background-color: $theme-color-1;
                }
        .walkthrough-content
              {
                background-color: $theme-color-1;

                .scroll-content
                {
                  margin: 0px !important;
                }

                ion-slide:nth-child(odd)
                {
                  background-color: color($colors, walkthrough, base);
                  color: color($colors, walkthrough, contrast);
                }

                ion-slide:nth-child(even)
                {
                  background-color: color($colors, walkthrough-alt, base);
                  color: color($colors, walkthrough-alt, contrast);
                }

                .swiper-pagination-bullet
                {
                  background: $white;
                  opacity: .5;

                  &.swiper-pagination-bullet-active
                  {
                    opacity: 1;
                  }
                }

                ion-slides {

                  ion-slide {
                    @include align-items(flex-start);
                  }

                  .intro-image-row
                  {
                    @include justify-content(center);
                    margin-top: 90px;
                    margin-top: 16vh;
                  }

                  .main-title
                  {
                    margin: 35px 20px 20px;
                    font-size: 3.4rem;
                    font-weight: 900;
                    font-style: italic;
                    text-align: center;
                    color: $white;
                  }

                  .intro-text
                  {
                    margin: 0px 20%;
                    font-size: 1.4rem;
                    line-height: 1.35;
                    text-align: center;
                    color: $white;
                  }
                }

                .slide-4
                {
                  .main-title
                  {
                    margin-top: 15px;
                  }

                  .button-bar
                  {
                    @include display(flex);
                    margin: 25px 8%;

                    & > .button
                    {
                      @include segment-text-styles(color($colors, button-alt, base));
                      background-color: color($colors, button-alt, contrast);
                      margin: 0px;
                      border-radius: 0px;
                      @include flex(1);

                      &:first-child
                      {
                        border-radius: 6px 0px 0px 6px;

                        &::after
                        {
                          content: '';
                          background-color: color($colors, button-alt, base);
                          width: 2px;
                          @include calc(height, "100% - 20px");
                          margin: 10px 0px;
                          position: absolute;
                          top: 0px;
                          right: 0px;
                          opacity: 0.6;
                        }
                      }
                      &:last-child
                      {
                        border-radius: 0px 6px 6px 0px;
                      }
                    }
                  }
                }
              }
  `]
})

export class InfoModal {
    constructor(private nav:NavController, public viewCtrl:ViewController,public params:NavParams) {
           
    }
    closeModal(){
      this.viewCtrl.dismiss();
      
    }
}
