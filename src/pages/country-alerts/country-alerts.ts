import { Component } from '@angular/core';
import { NavController, LoadingController,NavParams } from 'ionic-angular';
import {EndPoint} from '../../providers/end-point';
import{SearchPage} from '../search/search';
import 'rxjs/Rx';
import { CheckinPage } from '../checkin/checkin';
import { OauthProvider } from '../../providers/oauth-provider';
import { AlertDetailPage } from '../alert-detail/alert-detail';

@Component({
  selector: 'country-alerts-page',
  templateUrl: 'country-alerts.html'
})
export class CountryAlertsPage {

  loading: any;
  alerts: any;
  iso_code:any;
  city_name:any;

  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public endPoint : EndPoint,
    public navParams: NavParams,
    public oauth:OauthProvider

  ) {
    this.loading = this.loadingCtrl.create();

    if (this.navParams.get('country') == undefined && this.navParams.get('city') == undefined){
            this.iso_code = "USA"
            }else if(this.navParams.get('country') != undefined){
                this.iso_code = this.navParams.get('country').iso_code;
            }else if(navParams.get('city') != undefined){
                this.city_name = this.navParams.get('city');
                console.log(this.city_name);
                
            }
    
    
  }

  ionViewDidLoad() {
    if(this.iso_code != undefined){

         this.loading.present();
          this.oauth.getToken().then(token=>{
            this.endPoint
            .getAlertsByIso(this.iso_code,token)
            .then(data => {
              this.alerts = data.alerts;
              this.loading.dismiss();
              console.log(data.alerts);
              
            });

          })


    }else if(this.city_name != undefined){
          this.loading.present();
          this.oauth.getToken().then(token=>{
            this.endPoint
            .getAlertsByCityName(this.city_name,token)
            .then(data => {
              this.alerts = data.alerts;
              this.loading.dismiss();
              console.log(data.alerts);
              
            });

          })
    }
    
   
  }
  goToDetail(alert){
      this.nav.push(AlertDetailPage,{alert_id:alert});
  }
  goToCheckin(alert){

    this.nav.push(CheckinPage,{alert:alert});
      
  }

}
