import { Component } from '@angular/core';
// not using for now import {Http} from '@angular/http';
import {FormControl} from '@angular/forms';
import { NavController, NavParams, LoadingController,ModalController,ViewController } from 'ionic-angular';
import {ConnectivityService} from '../../providers/connectivity-service';
import {Geolocation} from 'ionic-native';
import {AlertDetailPage} from '../alert-detail/alert-detail';
import {CountryDescriptionPage} from '../country-description/country-description';
import {SearchPage} from '../search/search';
import {FullInfoCountryPage} from '../full-info-country/full-info-country';
import {OverallPage} from '../overall/overall';
import {CheckinPage} from '../checkin/checkin';



declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage  {
//declarations
   lat: number;
    lng: number;
  zoom : number = 6;
  currentLocation:any ;
  showMap = true;
  flag:string;



  constructor(
    public navCtrl: NavController,
     public loadingCtrl: LoadingController, 
     public navParams: NavParams, 
     public connectivityService: ConnectivityService,
     public modalCtrl:ModalController
     ) {
            this.lat = +this.navParams.get('latitude');
            this.lng = +this.navParams.get('longitude');
            this.flag = this.navParams.get('flag');
  }
  //initilize dummy data

//style for the map
  mapStyles =[
          {
            stylers: [
                { saturation: -70 }
            ]
          },{
            featureType: "road",
            elementType: "geometry",
            stylers: [
                { lightness: 100 },
                { visibility: "simplified" }
            ]
          },{
            featureType: "road",
            elementType: "labels",
            stylers: [
                { visibility: "on" }
            ]
          },{
            featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
          }
  ];
  

  
// load the map method 

  ionViewDidLoad() {

    
  }

  //receive the geolocation info shows on the map

  loadCurrentMap(){
    let loading = this.loadingCtrl.create({
     content: `
     Searching for your Location...`,
    });

    loading.present();

    Geolocation.getCurrentPosition().then((position) => {

        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        //this.http.get('https://maps.googleapis.com/maps/api/geocode/json?'+this.lat+','+this.lng+'&key=AIzaSyAD-u8RjZs7jh31RH7uTp2dyWOGD2KOv2A');
         loading.dismiss();
         
    }, (err) => {
      console.log(err);
    });
 
  }
 
  //redirects to alert 
  goToAlerts(){
    this.navCtrl.push(AlertDetailPage);
  }
    //redirects to country details
  goToCountryDetails(country:any){
      this.navCtrl.push(CountryDescriptionPage,country);
  }
  //redirects to Searching
  goToSearching(){
      this.navCtrl.push(SearchPage,{},{animate:true,direction: 'foward'});
  }
  //show search modal
// go to full info
   goToFull(country){
      
      this.navCtrl.push(FullInfoCountryPage,country);
 }
 goToOverall(){
   this.navCtrl.push(OverallPage);
 }
 // show/hide map info
  showHideMap(){
    if(this.showMap == true){
          this.showMap = false;
    }else{
        this.showMap  = true
    }
       
  }
// go to checkin
  goToCheckin(alert){
        this.navCtrl.push(CheckinPage,alert);
  }

  
}


//modal component configuration

@Component({
    selector:`my-search-modal`,
    template: `
        <ion-header>

    <ion-toolbar>
        <ion-title> <span></span> </ion-title>
        <ion-buttons end>
        <button ion-button  (click)="closeModal()" ><ion-icon [name]="'close'" color="light" outline round ></ion-icon></button>
    </ion-buttons>
    </ion-toolbar>

    </ion-header>
  <ion-content class="searching-content">
 <ion-searchbar [(ngModel)]="searchTerm" (input)="getItems($event)" placeholder="country/city name" placeholder="Search"></ion-searchbar>
          <ion-list>
              <ion-item *ngFor="let country of countries " >
                <ion-thumbnail item-left (click)="goToFull(country)">
                  <img src="assets/images/{{country.flag}}"/>
                </ion-thumbnail>
                <h2 (click)="goToFull(country)">{{country.name}}</h2>
                <p (click)="goToFull(country)">{{country.overall}}</p>
                <ion-item-divider>
                    Cities of {{country.name}}
                  </ion-item-divider>
                  <ion-item *ngFor="let city of country.cities" (click)="goToFull(city)">
                      {{city.name}}
                  </ion-item>
                  <ion-item-divider>
                  .
                  </ion-item-divider>
              
               
          
                <button ion-button clear item-right><ion-icon name="arrow-dropright"></ion-icon></button>
              </ion-item>
          </ion-list>

  </ion-content>
    `,
    styles:[
'color:red'
    ]
})

export class MySearchModal {

      countries:any;
      searchTerm:string;
      searchControl : FormControl;
      mockMarkers = [
        {
          lat : -2.882273,
          lng : -78.984961
        
      }
      ];

    constructor(
      private nav:NavController, 
      private viewCtrl:ViewController,
      public  params: NavParams
      ) {
          this.countries = this.params.get('alerts');
          this.searchControl = new FormControl;
           this.searchTerm = '';
          this.initializeItems();
    }
    initializeItems() {
        this.countries = this.params.get('alerts');
    }

    closeMe() {
     
    }
    closeModal(){
      this.viewCtrl.dismiss(

      );
      
    }

    goToFull(country){

      this.nav.push(FullInfoCountryPage,country);

    }
    

  getItems(searchbar:any) {
  // Reset items back to all of the items
  let q = searchbar.target.value;
  this.initializeItems();
  // set q to the value of the searchbar

  // if the value is an empty string don't filter the items
  if (q.trim() == '') {
    return;
  }

   this.countries = this.countries.filter((v) => {

    if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
       return true;
      }

      return false;
    })

 }

}
