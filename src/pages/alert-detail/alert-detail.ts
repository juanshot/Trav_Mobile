import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { EndPoint } from '../../providers/end-point';
import { LocationTracker } from '../../providers/location-tracker';
import { InAppBrowser } from 'ionic-native';
import { OauthProvider } from '../../providers/oauth-provider';

import {FullInfoCountryPage} from '../full-info-country/full-info-country';

@Component({
  selector: 'page-alert-detail',
  templateUrl: 'alert-detail.html'
})
export class AlertDetailPage {

   alerts:any;
  option:any = "overview";
  short_headline:any;
  shownItem: any ="false";
  lat:any;
  long:any;
  zoom
  affected_range
  incident_type


  constructor(public navCtrl: NavController, public navParams: NavParams,public endPoint:EndPoint,public location: LocationTracker,public oauth:OauthProvider,public loading:LoadingController) {
          let loadingA = this.loading.create({});
          loadingA.present();
          this.oauth.getToken().then(token=>{

                 this.endPoint.getAlertsById(this.navParams.get('alert_id'),token).then(result=>{
                this.alerts = result.alerts;
                console.log(this.alerts);
                
                    this.affected_range = result.alerts[0].affected_range;
                    this.incident_type = result.alerts[0].incident_type;
                    this.short_headline = this.alerts[0].incident_headline.substring(this.alerts[0].incident_headline.indexOf(':') +1 , this.alerts[0].incident_headline.length);
                    loadingA.dismiss();
                    if(this.alerts[0].affected_area != null){

                              if(this.alerts[0].affected_area.length > 0 ){
                          if(this.alerts[0].affected_area.length == 1){
                                this.lat = this.alerts[0].affected_area[0].coordinates[1];
                                 this.long = this.alerts[0].affected_area[0].coordinates[0];
                                 if( parseInt(this.alerts[0].affected_area[0].radius) < 100 ){
                                         this.zoom = 12; //LM change from 15 -> 13 (2017-04-01)
                                          
                                 }else{

                                       this.zoom = 12; //LM change from 14 -> 12 (2017-04-01)

                                 }
                           }else{

                             this.lat = this.alerts[0].affected_area[0].coordinates[1];
                              this.long = this.alerts[0].affected_area[0].coordinates[0];
                              this.zoom = 6;



                           }

                        }
                        else{
                          this.oauth.getToken().then(token=>{
                                    this.endPoint.getCountry(this.alerts[0].countries_iso3[0],token).then(result=>{
                                  console.log(result[0].country_zoom[0] );
                                  this.lat =  parseInt( result[0].country_location.substr(0, result[0].country_location.indexOf(','))) ;
                                  this.long = parseInt(result[0].country_location.substr(result[0].country_location.indexOf(',') +1, result[0].country_location.length )) ;
                               //   this.zoom = result[0].country_zoom[0];
                                  //LM change max zoom 15 -> 13 (2017-04-01)
                                if(result[0].country_zoom[0]>=13){                                
                                    this.zoom = result[0].country_zoom[0]-2
                                  }else{
                                    this.zoom = result[0].country_zoom[0]
                                  }
                                
                            })

                          })
                           
                        }

                    }
                        
                
        });

        })
       
        this.lat = this.location.lat;
        this.long = this.location.lng;
        console.log(this.lat,this.long);
        
  }

  toggleItem(item) {
    if (this.isItemShown(item)) {
      this.shownItem = null;
    } else {
      this.shownItem = item;
    }
  };

    setCenter(marker){
        if(parseInt(marker.radius)  < 100){
              this.zoom = 13;//LM change 15->13
              this.lat = marker.coordinates[1];
              this.long = marker.coordinates[0];
        }else{
            this.zoom = 12;
              this.lat = marker.coordinates[1];
              this.long = marker.coordinates[0];
        }
        console.log(marker);
        
         
  }
  mapBack(marker){
    if(this.alerts[0].affected_area.length == 1){
          this.zoom = 13//LM change 15->13
    }else{
          this.zoom = 6;
    }
    
  }
  
  
  isItemShown (item) {
    return this.shownItem === item;
  };
   openInAppBrowser(website: string){
    new InAppBrowser(website, '_blank', "location=yes");
  }
   goToCountryDetail(iso){
  
    let country=this.endPoint.countries.filter(x=>x.country_iso == iso)[0]
    this.navCtrl.push(FullInfoCountryPage,{country:country});
  }
  matchIsoFlag(iso){



  return this.endPoint.countries.filter(x=>x.country_iso == iso && x.country_flag != undefined)[0].country_flag;
  
  
      
  }
  matchIsoName(iso){

        return this.endPoint.countries.filter(x=>x.country_iso == iso)[0].country_name;
  }

}
