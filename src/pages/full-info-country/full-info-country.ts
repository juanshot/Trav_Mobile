import { Component, OnInit } from '@angular/core';
import { Http} from '@angular/http';
import { NavController, NavParams, ModalController ,LoadingController } from 'ionic-angular';
import {SectionPage} from '../section/section';
import {EndPoint} from '../../providers/end-point';
import { SearchPage } from '../search/search';
import countries from '../../../data/countries';
import {ContactsPage} from '../contacts/contacts';

import {SubscriptionOptionsPage} from '../subscription-options/subscription-options';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { UserProvider } from '../../providers/user-provider';
import { LocationTracker } from '../../providers/location-tracker';
import { OauthProvider } from '../../providers/oauth-provider';
import { CountryAlertsPage } from '../country-alerts/country-alerts';


@Component({
  selector: 'page-full-info-country',
  templateUrl: 'full-info-country.html'
})
export class FullInfoCountryPage implements OnInit{

  countries : any;
  countryInfo:any;
  shownItem: any ="false";
  option:string ="overview";
  coords:any;
  lat:any;
  lng:any;
  alertCount:number;
  showRiskDetail:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl:ModalController, public endPoint:EndPoint,public loadingCtrl:LoadingController,public http: Http,public userProvider:UserProvider,public location:LocationTracker,public oauth:OauthProvider) {

            this.lat =this.location.lat;
            this.lng = this.location.lng;   

                     
           //if the param country is not received

            if (navParams.get('country') == undefined){

                    this.loadCurrentMap();
            }

            else {
                  this.countryInfo = navParams.get('country');
                  if(this.countryInfo.iso_code != undefined){
                      this.getCountry(this.countryInfo.iso_code);
                  }else{
                        this.getCountry(this.countryInfo.country_iso);
                  }
                  
            }
                    

  }
 countryCollection :any[];

    ngOnInit(){
         this.countryCollection = countries;
    }
      //validating if there is no geolocation
  /*  ionViewCanEnter(){
      if(this.location.lat == undefined && this.navParams.get('country')== undefined){
        this.navCtrl.push(SearchPage);
        
      }
      
    }*/

  getCountry(iso:string){

    let loading = this.loadingCtrl.create({
              content: ``,
            });
    loading.present();

    this.oauth.getToken().then(token=>{

          this.endPoint
        .getCountry(iso,token)
        .then(count=>{
                this.countries = count; console.log(count);
                loading.dismiss();
                });


    this.endPoint.getAlertsByIso(iso,token)
                    .then(alerts=>{this.alertCount = alerts.count;console.log(this.alertCount);
                    });

      
    })

  }
  getCountryWithName(countryName:string){
         this.oauth.getToken().then(token=>{
              this.endPoint
              .getCountryWithName(countryName,token)
              .then(count=>{this.countries = count; this.countryInfo = count});

         })
        
  }

  detailedInfo(detail){

         
  }

  goToSection(sections,sectionName){
      


      this.navCtrl.push(SectionPage,{sections:sections,sectionName: sectionName });
      
  }
   toggleItem(item) {
    if (this.isItemShown(item)) {
      this.shownItem = null;
    } else {
      this.shownItem = item;
    }
    if(this.showRiskDetail == true){
          this.showRiskDetail = false;
    }else{
           this.showRiskDetail = true;
    }
  };
  
  isItemShown (item) {
    return this.shownItem === item;
  };
  goToSubscribe(country){

   this.navCtrl.push(SubscriptionOptionsPage,{iso: country.iso_code,flag : country.flag , name : country.country_name})

  }

  openSearch(){
     // console.log(this.countries);
      
     this.navCtrl.push(SearchPage);
     //let searchingForm = this.modalCtrl.create(MySearchModal,{alerts:this.alertCollection});
       //  searchingForm.present();
      
  }
  goToContacts(country){

        this.navCtrl.push(ContactsPage,{country:country});
  }
  openRiskDetail(){
    this.option ="risk"; 
  }
  goToAlerts(country){
      this.navCtrl.push(CountryAlertsPage,{country :country});
  }
  getCountryWithIso(countryIso:string){
       
        
  }

  loadCurrentMap(){
    let loading = this.loadingCtrl.create({
     content: ``,
    });

    loading.present();
     this.oauth.getToken().then(token=>{

          this.endPoint.getTdsGeocode(this.lat,this.lng,token).then(result=>{
                //here is the problem
             this.oauth.getToken().then(token=>{
             return this.endPoint
                  .getCountry(result.iso3,token)
                  .then( count=>{
                    this.countries = count; 
                    this.countryInfo = count ;
                    if(result.iso3 !=undefined){
                          this.endPoint.getAlertsByIso(result.iso3,token)
                          .then(alerts=>{
                            this.alertCount = alerts.total;
                            loading.dismiss();
                          });

                    }
                    
                  });
             })        
        });

     })
  }


}

