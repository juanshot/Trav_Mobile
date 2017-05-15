import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation } from 'ionic-native';
import { EndPoint } from './end-point';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocationTracker } from './location-tracker';


@Injectable()
export class GeoLocationProvider {

  cache_lat:any
  cache_long:any

  constructor(public http: Http , public endPoint:EndPoint,public alertCtrl:AlertController,public storage:Storage,public tracker:LocationTracker) {
    
  }

  geolocateFirstTime(){
      Geolocation.getCurrentPosition().then((position) => {

        this.endPoint.saveLocation(position.coords.latitude, position.coords.longitude);

         
      }, (err) => {

            this.handleGpsOff(err);
    });
  }


 

  

handleGpsOff(err){
  console.log(err);
  
/*2017-04-04
In phone the app alert this message in loop
    let confirmAlert = this.alertCtrl.create({
          title: 'GPS OFF',
          message: err,
          buttons: [ {
            text: 'Accept',
            handler: () => {
                this.geolocateFirstTime()            }
          }]
        });
        confirmAlert.present();
*/
  }



   checkGeoChanges(){

          this.storage.get('coordinates').then(result=>{
               
                     Geolocation.getCurrentPosition().then((position) => {
                              console.log(position.coords);
                              
                          console.log("Variation in Km: ",this.tracker.getDistanceFromLatLonInKm(position.coords.latitude,position.coords.longitude,result.lat,result.long ));

                          if(this.tracker.getDistanceFromLatLonInKm(position.coords.latitude,position.coords.longitude,result.lat,result.long ) > 25){

                                 this.endPoint.saveLocation(position.coords.latitude,position.coords.longitude);
                                    
                          }
                        
                      }, (err) => {

                            this.handleGpsOff(err);
                    });
                    
                  
              
          })
     
}
         




}
