import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { EndPoint } from '../../providers/end-point';
import { UserProvider } from '../../providers/user-provider';
import { CheckinPage } from '../checkin/checkin';
import { LocationTracker } from '../../providers/location-tracker';
import { GeoLocationProvider } from '../../providers/geo-location-provider';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import { LoginPage } from '../login/login';
import { SubscriptionsService } from '../../providers/subscriptions-service';
import { FullInfoCountryPage } from '../full-info-country/full-info-country';
import { OauthProvider } from '../../providers/oauth-provider';
import { AlertDetailPage } from '../alert-detail/alert-detail';


@Component({
  selector: 'page-my-alerts',
  templateUrl: 'my-alerts.html'
})
export class MyAlertsPage {

  loading: any;
  alerts: any;
  userStorage:any;

  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public endPoint : EndPoint,
    public navParams: NavParams,
    public userProvider:UserProvider,
    public location:LocationTracker,
    public geo:GeoLocationProvider,
    public storage:Storage,
    public subsService:SubscriptionsService,
    public oauth:OauthProvider,

  ) {

    
    
  }


  ionViewCanEnter(){
 
  }
  ionViewDidLoad(){

        
        this.checkRegistration();

        

  }




  goToDetail(alert){
      this.nav.push(AlertDetailPage,{alert_id:alert});
  }
  /**
   * 
   * LM 2017-03-31 add the checkin data to push to Checkinpage
   */
  goToCheckin(alert,tdsalert,checkin){
    this.nav.push(CheckinPage,{alert:alert,tdsalert:tdsalert,checkin:checkin});
      
  }
  checkRegistration(){
    let loading = this.loadingCtrl.create({
      
        });
        loading.present();
    
    this.endPoint.checkRegistration().then(
        result =>{
          if (result == true){
            this.oauth.getToken().then(token=>{
                  if(this.userProvider.user !=null){
                                this.endPoint.fillCheckins(this.userProvider.user.user_id,this.userProvider.user.account_id,token).then(result=>{
                                  if(this.endPoint.checkins.alerts.length > 0){
                                        this.alerts = this.endPoint.checkins.alerts;
                                        this.subsService.fillSubscriptions(this.userProvider.user.user_id,this.userProvider.user.account_id,token).then(result=>{
                                         this.endPoint.subscriptions = result.subscriptions;
                                          loading.dismiss();
                                        })
                                        
                                  }else{
                                      this.alerts = [];
                                      loading.dismiss();
                                      this.nav.push(FullInfoCountryPage);
                                  }
                                  
              
            });
                 
                 

                  }else{

                                   this.storage.get('user').then(result=>{
                                     if(result !=null){
                                         this.userStorage = result;
                                    this.endPoint.fillCheckins(result.user_id,result.account_id,token).then(result=>{
                                     this.alerts = this.endPoint.checkins.alerts;
                                      this.subsService.fillSubscriptions(this.userStorage.user_id,this.userStorage.account_id,token).then(result=>{
                                        this.endPoint.subscriptions = result.subscriptions;
                                        loading.dismiss()
                                         if(this.alerts.length == 0){
                                           loading.dismiss()
                                        this.nav.push(FullInfoCountryPage);
                                        }
           
                                      })
              
                                            });
                                       
                                     }else{
                                  
                                        this.nav.push(FullInfoCountryPage);
                                        

                                     }
                                    


                        })







                  }
        
              
              //has to be on top for mobile   
                  })
                 
               
                 
           // this.nav.setRoot(AlertDetailPage,{alert_id: "RED24-16070"}); 
          }else{
            console.log('you are not registered');
            loading.dismiss();
            this.nav.setRoot(LoginPage);
          }
        }
      )
  }

}
