import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController,LoadingController,ModalController } from 'ionic-angular';
import { StatusBar, Splashscreen, Push ,Keyboard  } from 'ionic-native';
import { LoginPage } from '../pages/login/login';
import {SettingsPage} from '../pages/settings/settings';
import {FullInfoCountryPage} from '../pages/full-info-country/full-info-country';
import { AlertDetailPage } from '../pages/alert-detail/alert-detail';
import { CheckinPage } from '../pages/checkin/checkin';
import { EndPoint } from '../providers/end-point';
import { UserProvider } from '../providers/user-provider';
import { MyAlertsPage } from '../pages/my-alerts/my-alerts';
import { LocationTracker } from '../providers/location-tracker';
import { GeoLocationProvider } from '../providers/geo-location-provider';
import { ConfigurationProvider } from '../providers/configuration-provider';
import { SubscriptionsService } from '../providers/subscriptions-service';
import { Storage } from '@ionic/storage';
import { OauthProvider } from '../providers/oauth-provider';
   import {Observable} from 'rxjs/Rx';
import { AlertNotification } from '../pages/alert-notification/alert-notification';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  startPage:any;
  rootPage = MyAlertsPage;

  pages: Array<{title: string, component: any, icon:string}>;

  constructor(public platform: Platform, public config:ConfigurationProvider,public alertCtrl: AlertController,public endPoint:EndPoint,public userProvider:UserProvider,public loading:LoadingController,public location:LocationTracker, public geo:GeoLocationProvider,public subsService:SubscriptionsService,public storage:Storage,public oauthProvider:OauthProvider,public modal:ModalController) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: FullInfoCountryPage, icon:"md-home" },
      { title: 'Subscriptions', component: SettingsPage, icon:"md-globe" },
      { title: 'My Alerts', component: MyAlertsPage, icon:"md-alert" },
      { title: 'Log Out (for testing)', component: LoginPage, icon:"md-exit" }

    ];

  }

  initializeApp() {
    
    this.platform.ready().then(() => {
      Splashscreen.hide();
      StatusBar.styleDefault();
      if (this.platform.is('android')) {
                Keyboard.disableScroll(true);
            }
      this.initPushNotification();
      this.storage.get('user').then(result=>{
            this.userProvider.setRegistrationInfo(result);
      })
      this.location.startTracking();
     //this.nav.push(AlertDetailPage,{alert_id:"TDS24-25"})
   // this.openAlertModal("Title","Message","RED24-16607");
    });
  }


 startCheckin(data){

   let confirmAlert = this.alertCtrl.create({
          title: 'CHECKIN REQUEST',
          message: 'You have a new request',
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              this.nav.push(CheckinPage,{tdsalert : data ,  alert: data.additionalData });
            }
          }]
        });
        confirmAlert.present();

 } 
 //new alert notification app opened
 openAlertModal(title,message,alertId){
    let alertModal = this.modal.create(AlertNotification,{alert_id: alertId,title:title,message:message });
      alertModal.present();
  }
  //new checkin notification app opened
  openCheckinModal(){
    let checkinModal = this.modal.create(AlertNotification);
    checkinModal.present();
  }
 checkinUpdate(data){
      this.oauthProvider.getToken().then(token=>{

      this.endPoint.saveCheckin(
        {         account_id : this.userProvider.user.account_id,
                  user_id : this.userProvider.user.user_id,
                  alert_id : data.additionalData.alert_id,
                  alert_origin :data.additionalData.alert_origin,
                },token
      ).then(()=>{console.log('ok');
      });
        
      })
     

 }

  
  initPushNotification(){
    if (!this.platform.is('cordova')) {
      console.warn("Need a physical device");
      return;
    }
    let push = Push.init({
      android: {
        senderID: "546353404575"
      },
      ios: {
        alert: "true",
        badge: "false",
        sound: "true",
        clearBadge: "true"
      },
      windows: {}
    });

    push.on('registration', (data) => {
      console.log("device token ->", data.registrationId);
        this.userProvider.fillRegistration(data.registrationId);
    });
    push.on('notification', (data) => {


      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        console.log('before filter type',data);
        
        if(data.additionalData.additionalData.type == "alert"){
            console.log("type: alert additional data i received",data.additionalData);
            console.log('type: alert original data',data);

            //old notification

       /*   let alert = this.alertCtrl.create({
              title: data.title,
              message: data.message,
              buttons: [{
                text:'OK',
                handler: ()=>{this.nav.push(AlertDetailPage,{alert_id: data.additionalData.additionalData.alert_id})}
              }]

            })
            alert.present(); */
            
            this.openAlertModal(data.title,data.message,data.additionalData.additionalData.alert_id);
            

          

        }
        if(data.additionalData.additionalData.type == "checkin"){
          console.log(" Type: checkin additional data i received",data.additionalData.additionalData);
              console.log('type: checkin original data',data);

            this.startCheckin(data);
           //  this.checkinUpdate(data);
        }
          
      } 
      
      else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        //its an alert not
        if(data.additionalData.additionalData.type == "alert"){
          console.log("type: alert additional data i received",data.additionalData.additionalData);
            console.log('type: alert original data',data);
          
          this.nav.push(AlertDetailPage,{alert_id: data.additionalData.additionalData.alert_id});
         //this.rootPage(SettingsPage);
            
        }
        if(data.additionalData.additionalData.type == "checkin"){

             this.nav.push(CheckinPage,{tdsalert : data ,  alert: data.additionalData });   
        }
        
      }
    });
    push.on('error', (e) => {
      this.userProvider.fillRegistration(e.message);
      console.log(e.message);
    });
  }

  openPage(page) {
  
    this.nav.setRoot(page.component);
  }
  goTabs(){
    this.nav.push(SettingsPage);
  }
}