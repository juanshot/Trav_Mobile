import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import {FullInfoCountryPage} from '../full-info-country/full-info-country';
import {FullCityInfoPage} from '../full-city-info/full-city-info';
import {EndPoint} from '../../providers/end-point';
import countries from '../../../data/countries';
import { OauthProvider } from '../../providers/oauth-provider';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

      countries:any=[];
      apiCountries:any;
      searchTerm:string;


    constructor(
      private nav:NavController, 
      public  params: NavParams,
      public  endPoint: EndPoint,
      public loadingCtrl:LoadingController,
      public oauth:OauthProvider
      ) {
           this.searchTerm = '';
           this.getCountriesFromApi();
    }


    initializeItems() {

        this.countries = [];

    }
    getCountriesFromApi(){
          let loading = this.loadingCtrl.create();
          loading.present();
          this.oauth.getToken().then(token=>{
            this.endPoint.getCountryCityList(token).then(countries=>{this.apiCountries = countries.countries;
                  loading.dismiss()
          })
          })
    }



    goToFull(country){

         this.nav.push(FullInfoCountryPage,{country:country});

    }
    goToCity(city,country){
       
          this.nav.push(FullCityInfoPage,{city:city,countryFromSearch:country});
    }

    ionViewDidLoad() {
          this.countries = countries;
  }
    

  getItems(searchbar:any) {
        // Reset items back to all of the items
        let query =  searchbar.target.value;
        if (query.trim() == ""){
             this.countries = [];   
        }else{
              let q = query.toLowerCase()
             this.countries = this.apiCountries.filter(
                  (resultCountry)=>{
                        //country result
                  if(resultCountry.country_name.toLowerCase().indexOf(q) > -1){
                        
                         //console.log(resultCountry.city_count);
                        return true
                  }
                  // console.log(resultCountry.country_name,resultCountry.city_count);
                 if(resultCountry.city_count > 0 ){
                         for (let i=0; i < resultCountry.cities.length; i++){
                              if(resultCountry.cities[i].toLowerCase().indexOf(q) > -1){                 
                                                return true
                                    }
                        }
                  }
                  
            }).map((country) => {
                  let ccountry = Object.assign({}, country)
                  if(country.country_name.toLowerCase().indexOf(q) > -1){
                        delete ccountry.cities
                  }
                  else{
                        let city = ccountry.cities.filter(c => {
                              if(c.toLowerCase().indexOf(q) > -1) return true;
                        });
                        ccountry.cities = city
                  }
                  console.log(ccountry);
                  
                  return ccountry;
                  
            })
              
        }
        

 }

}
