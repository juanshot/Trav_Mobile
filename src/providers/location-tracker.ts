import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation } from 'ionic-native';
import 'rxjs/add/operator/filter';
import { EndPoint } from './end-point';
import { Storage } from '@ionic/storage';




@Injectable()
export class LocationTracker {
  public watch: any; 
  public current_status:boolean = true;   
  public lat;
  public lng;
  public init_lat:any;
  public init_long:any;

  constructor(public zone:NgZone,public endpoint:EndPoint,public storage:Storage) {


  }
  startTracking() {
    
    // Background Tracking for Travelers
 
        let config = {
          desiredAccuracy: 0,
          stationaryRadius: 20,
          distanceFilter: 10, 
          debug: false,
          interval: 50000 
        };

      this.current_status = true;

    BackgroundGeolocation.configure((location) => {
 
    console.log('Traveler Geolocation:  ' + location.latitude + ',' + location.longitude);
 
    // Run update inside of Angular's zone
    this.zone.run(() => {
      this.lat = location.latitude;
      this.lng = location.longitude;
    });
 
   }, (err) => {
 
    console.log(err);
 
  }, config);
 
  // Turn ON the background-geolocation system.
  BackgroundGeolocation.start();
 
 
  // Foreground Tracking
 
  let options = { 
    enableHighAccuracy: false,
    interval: 3000
  };
 
  this.watch = Geolocation.watchPosition(options).filter((p) => p.coords !== undefined).subscribe((position: Geoposition) => {
       this.lat = position.coords.latitude;
       this.lng = position.coords.longitude;
       


       this.storage.get('coordinates').then(result=>{

                  if(result != null ){

                  console.log('Last lat and long: ', result.lat,result.long);
                  console.log('your current position : ',position.coords.latitude,position.coords.longitude);
                  
                  if(this.getDistanceFromLatLonInKm(result.lat,result.long,position.coords.latitude,position.coords.longitude) > 20){

                          this.endpoint.saveLocation(position.coords.latitude,position.coords.longitude);
                          
                  }

                  }
           
                  
                    

     
       })
        
    
 
    // Run update inside of Angular's zone
    this.zone.run(() => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
 
  });

}

//stop the tracking (in case that the gps is off)
 
 stopTracking() {
 
  console.log('stopTracking');
  this.current_status =false;
 
  BackgroundGeolocation.finish();
  this.watch.unsubscribe();
 
}

  //calculate distance KM from tho coords

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
  var dLon = this.deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}


 deg2rad(deg) {
  return deg * (Math.PI/180)
}

}