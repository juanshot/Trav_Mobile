import { Component } from '@angular/core';
import { Http} from '@angular/http';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import {EndPoint} from '../../providers/end-point';
import {Country} from '../../../data/country';
import {MapPage} from '../map/map';
import {SearchPage} from '../search/search';
import {CitySectionPage} from '../city-section/city-section';
import {FullInfoCountryPage} from '../full-info-country/full-info-country';
import {ContactsPage} from '../contacts/contacts'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { OauthProvider } from '../../providers/oauth-provider';
import { SubscriptionOptionsPage } from '../subscription-options/subscription-options';
import { CountryAlertsPage } from '../country-alerts/country-alerts';
import { SectionPage } from '../section/section';


@Component({
  selector: 'page-full-city-info',
  templateUrl: 'full-city-info.html'
})
export class FullCityInfoPage {
  countries : any;
  city_name: any;
  sections:any;
  overview:any;
  section_heading:any;
  section_content:any;
  risk_rating:any;
  countryInfo:any;
  countryFatherInfo:any;
  shownItem: any ="false";
  option:string ="overview";
  coords:any;
  lat:any;
  lng:any;
  resultCountry:any[];
  alertCount:any;

 constructor(public navCtrl: NavController, public navParams: NavParams,  public endPoint:EndPoint,public loadingCtrl:LoadingController,public http: Http,public oauth:OauthProvider,public loading:LoadingController) {
              
           this.getCity(this.navParams.get('city'));
           this.countryFatherInfo = this.navParams.get('countryFromSearch');
              


}
countryCollection :any[];


  getCity(name:string){
    let loadingC = this.loading.create({});
    loadingC.present();
    this.oauth.getToken().then(token=>{
       this.endPoint
        .getCityByName(name,token)
        .then(
          count=>{
            this.countries = count[0];
            console.log(count[0])
            this.city_name = count[0].city_name;
            this.sections = count[0].sections;
            this.overview = count[0].sections[0];
            this.section_heading = this.overview.section_heading;
            this.section_content = this.overview.section_content;
              this.endPoint.getAlertsByCityName(this.city_name,token)
                    .then(alerts=>{
                          this.alertCount = alerts.total;
                          loadingC.dismiss();
                    });


          //  this.content_heading = this.overview.section_heading; 
            console.log(this.overview);
            
            

            
            this.endPoint
                .getCountry(this.countries.country_iso,token)
                .then(resultCountry=>{ 
                  this.resultCountry = resultCountry; 
                  this.risk_rating = resultCountry[0].risk_rating; 
                  
                  
                })
          }
        );
      
    })
   

 
  }

  getCountryWithName(countryName:string){
        this.oauth.getToken().then(token=>{
             this.endPoint
        .getCountryWithName(countryName,token)
        .then(count=>{this.countries = count; this.countryInfo = count});

        })
       
  }
  goToMap(country){
    var longitude = country.country_location.split(",").pop();
    var latitude = country.country_location.substr(0,country.country_location.indexOf(','));
    var flag = country.flag;
    this.navCtrl.push(MapPage,{latitude: latitude , longitude: longitude,flag: flag});
  }
  goToAlerts(){
      this.navCtrl.push(CountryAlertsPage,{city:this.city_name});
  }

  detailedInfo(detail){

         
  }
  goToContacts(country){
        this.oauth.getToken().then(token=>{
              this.endPoint.getCountry(this.countryFatherInfo.country_iso,token)
                      .then((countryData)=>{
             
                        this.navCtrl.push(ContactsPage,{country:countryData[0]});
                    })

        })
        
        
  }
   goToSubscribe(country){

        this.navCtrl.push(SubscriptionOptionsPage,{iso: this.countryFatherInfo.country_iso, flag : this.countryFatherInfo.country_flag , city_name:this.city_name})

  }


  goToSection(sections,sectionName){

        console.log(sectionName);
        
        switch (sectionName) {
          case "Political Conditions":
          // parent country section

                let politicalSections = this.resultCountry[0].categories[1].category_sections;
                console.log(politicalSections);
                
                this.navCtrl.push(SectionPage,{sections:politicalSections,sectionName: sectionName });
              
                
            
            break;
          case "Security Issues":

                let securitySections = [];
                this.sections.forEach(element => {
                        if(element.section_heading.toLowerCase().indexOf('crime') > -1){
                              
                              var crimeInfo = {
                                section_name: element.section_heading,
                                section_text: element.section_content
                              }
                              securitySections.push(crimeInfo)
                              
                        }
                        if(element.section_heading.toLowerCase().indexOf('civil unrest') > -1){
                              
                              var civilUnrest = {
                                section_name: element.section_heading,
                                section_text: element.section_content
                              }
                              securitySections.push(civilUnrest)
                              
                        } 
                        if(element.section_heading.toLowerCase().indexOf('terrorism') > -1){
                              
                              var terrorism = {
                                section_name: element.section_heading,
                                section_text: element.section_content
                              }
                              securitySections.push(terrorism)
                              
                        }
                        if(element.section_heading.toLowerCase().indexOf('conflict') > -1){
                              
                              var conflict = {
                                section_name: element.section_heading,
                                section_text: element.section_content
                              }
                              securitySections.push(conflict)
                              
                        }
                        if(element.section_heading.toLowerCase().indexOf('kidnapping') > -1){
                              
                              var kidnapping = {
                                section_name: element.section_heading,
                                section_text: element.section_content
                              }
                              securitySections.push(kidnapping)
                              
                        } 
                        if(element.section_heading.toLowerCase().indexOf('scams') > -1){
                              
                              var scams = {
                                section_name: element.section_heading,
                                section_text: element.section_content
                              }
                              securitySections.push(scams)
                              
                        }  
                        if(element.section_heading.toLowerCase().indexOf('areas of concern') > -1){
                              
                              var areasc = {
                                section_name: element.section_heading,
                                section_text: element.section_content
                              }
                              securitySections.push(areasc)      
                        } 
                          
                  
                });

                 this.navCtrl.push(SectionPage,{sections:securitySections,sectionName: sectionName });

            
            break;
          case "Travel Logistic":

               let travelLogistics = [];
                this.sections.forEach(element => {
                        if(element.section_heading.toLowerCase().indexOf('getting around') > -1){
                              
                              var gettingA = {
                                section_name: element.section_heading,
                                section_text: element.section_content
                              }
                              travelLogistics.push(gettingA)
                              
                        }
                        if(element.section_heading.toLowerCase().indexOf('airport information') > -1){
                              
                              var airportI = {
                                section_name: element.section_heading,
                                section_text: element.section_content
                              }
                              travelLogistics.push(airportI)
                              
                        }
                });

                 this.navCtrl.push(SectionPage,{sections:travelLogistics,sectionName: sectionName });

            break;
          case "Cultural Factors":

                 let culturalFactors = this.resultCountry[0].categories[4].category_sections;
                
                this.navCtrl.push(SectionPage,{sections:culturalFactors,sectionName: sectionName });
              
                
            
            break;
          case "Useful Information":

                let usefulInformation = [];
                this.sections.forEach(element => {
                        if(element.section_heading.toLowerCase().indexOf('useful information') > -1){
                              
                              var usefulI = {
                                section_name: element.section_heading,
                                section_text: element.section_content
                              }
                              usefulInformation.push(usefulI)
                              
                        }
                });

                 this.navCtrl.push(SectionPage,{sections:usefulInformation,sectionName: sectionName });
            
            break;
          case "Health Advisory":

                let healthAdvisory = [];
                this.sections.forEach(element => {
                        if(element.section_heading.toLowerCase().indexOf('health concerns') > -1){
                              
                              var hAdvisory = {
                                section_name: element.section_heading,
                                section_text: element.section_content
                              }
                              healthAdvisory.push(hAdvisory)
                              
                        }
                });

                 this.navCtrl.push(SectionPage,{sections:healthAdvisory,sectionName: sectionName });

                
            
            break;
        
          default:
            break;
        }
        
      

      console.log(sections);

     // this.navCtrl.push(SectionPage,{sections:sections,sectionName: sectionName });
      
  }

   toggleItem(item) {
    if (this.isItemShown(item)) {
      this.shownItem = null;
    } else {
      this.shownItem = item;
    }
  };
  
  isItemShown (item) {
    return this.shownItem === item;
  };

  openSearch(){
      this.navCtrl.push(SearchPage);
     //let searchingForm = this.modalCtrl.create(MySearchModal,{alerts:this.alertCollection});
       //  searchingForm.present();
      
  }


  loadCurrentMap(){
    let loading = this.loadingCtrl.create({
     content: ``,
    });

    loading.present();
          this.oauth.getToken().then(token=>{

            this.endPoint.getTdsGeocode(this.lat,this.lng,token).then(result=>{

            this.getCountryWithIso(result.iso3);
            this.endPoint.getAlertsByIso(result.iso3,token)
                    .then(alerts=>{
                     // this.alertCount = alerts.total;
                      loading.dismiss();
                    });

              
        });

          })
        
  }

   getCountryWithIso(countryIso:string){
        this.oauth.getToken().then(token=>{
              this.endPoint
              .getCountry(countryIso,token)
              .then(count=>{
                this.countryInfo = count ;
              });

        })
        
  }
  
  goToCountry(country){

      this.navCtrl.push(FullInfoCountryPage,{country:this.resultCountry[0]});
      
          
  }
  


}
