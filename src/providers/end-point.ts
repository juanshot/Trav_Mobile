import { Injectable } from '@angular/core';
import { Http , Headers, RequestOptions,URLSearchParams,RequestOptionsArgs} from '@angular/http';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Country} from '../../data/country';
import { UserProvider } from './user-provider';
import { Storage } from '@ionic/storage';
import { ConfigurationProvider } from './configuration-provider';
import { OauthProvider } from './oauth-provider';

@Injectable()
export class EndPoint {

    countries: any;
    categories:any;
    subscriptions : any;
    checkins:any;
    country_name:any;
    country_iso;
    lat:any;
    long:any;
    tdApi:any;
    preferences:any;
    auth_token:any;
    headers:any;
    request:any= 
    {


    }

  
  
  constructor(public http: Http,public loading: LoadingController, public user:UserProvider,
              public storage:Storage, public config:ConfigurationProvider,public oauth:OauthProvider

  ) {

      this.outhRoutine();

      this.storage.get('countries').then(result=>{
          this.countries =result;
      });


     

       this.storage.get('categories').then(result3=>{
          this.categories =result3;
      });

      this.storage.get('geo_preferences').then(result4=>{
          if(result4 == null){
              this.preferences ={

                  preferences: [
                        {
                        notification_types:["email","push"],
                        severity:"low"
                        },
                        {
                        notification_types:["email","push"],
                        severity:"medium"
                      },
                       {
                        notification_types:["email","push"],
                        severity:"high"
                        },
                    

                ],
                created_by : "user",
                categories : [
                                "travel transport",
                                "civil unrest",
                                "political",
                                "terrorism",
                                "conflict",
                                "natural hazard",
                                "crime",
                                "infrastructure",
                                "kidnapping",
                                "unnatural hazard"
                            ]

              }
          }else{
              this.preferences =result4;
          }
          
      });
      this.tdApi = this.config.url;
      console.log('you are pointing to: ',this.tdApi);


  }


outhRoutine(){
       this.oauth.getToken().then(result=>{
           console.log(result.access_token);
           

           let headers = new Headers();
            headers.append( "Authorization", "Bearer "+ result.access_token); 

            this.auth_token = result.access_token;
            this.headers = headers;

         
      
  })
 
  }

setCountries(token){

   return  this.http.get(this.tdApi+'countries?access_token='+token.access_token)
      .toPromise()
      .then(response => { 
          let count = response.json();
          this.countries = count.countries;
          this.storage.set("countries",this.countries);
          
      })
      .catch(this.handleError);

        }
setCategories(token){

        return this.http.get(this.tdApi+'categories?access_token='+token.access_token)
      .toPromise()
      .then(response =>{ let count = response.json();
          this.categories = count.categories;
          console.log(this.categories);
          this.storage.set("categories",this.categories);
      } )
      .catch(this.handleError);

    }
setSubscriptions(userId,token){

    return this.http.get(this.tdApi+'subscribe?query=%7B%22type%22:%22subs%22,%22user_id%22:%22'+userId+'%22,%22account_id%22:%22'+this.user.user.account_id+'%22%7D&access_token='+token.access_token)
        .toPromise()
        .then(response =>{ return response.json() } )
        .catch(this.handleError);

    }
  getSubscriptions(userId:string){

      return this.http.get(this.tdApi+'subscribe?query=%7B%22type%22:%22subs%22,%22user_id%22:%22'+this.user.user.user_id+'%22,%22account_id%22:%22'+this.user.user.account_id+'%22%7D',this.headers)

      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
   //+"&access_token" 

 getCountry(countryIso:string,token): Promise<Country[]> {

    return this.http.get(this.tdApi+'locations?query=%7B%22iso_code%22:%22'+countryIso+'%22%7D&access_token='+token.access_token)
      .toPromise()
      .then(response => response.json() as Country[])
      .catch(this.handleError);
  }
  
  getCountryWithName(countryName:string,token): Promise<Country[]> {

    return this.http.get(this.tdApi+'locations?query=%7B%22country_name%22:%22'+countryName+'%22%7D&access_token='+token.access_token)
      .toPromise()
      .then(response => response.json() as Country[])
      .catch(this.handleError);
  }

  getCityByName(cityName:string,token){

      return this.http.get(this.tdApi+'locations?query=%7B%22city_name%22:%22'+cityName+'%22%7D&access_token='+token.access_token)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
      
  }
  getAlertsByIso(countryIso:string,token){
     var todayDate = new Date().toISOString().slice(0,10);

    var sevenDayBefore = new Date();
    sevenDayBefore.setDate(sevenDayBefore.getDate() - 7);
    let sevenDayBeforeString=sevenDayBefore.toISOString().slice(0,10);

      let query={
          "account_id":"A1FE770DCC48D4A1D4F7DB512884B2FA"
          ,"country_iso":[countryIso]
          ,"limit":50
          ,"sort_field":"alert_timestamp"
          ,"sort_order":"DESC"
          ,"range":{
            "begin":sevenDayBeforeString+" 00:00:00"
            ,"end":todayDate+" 23:59:59"
          }
        
        };
        console.log("query",query)
      let params: URLSearchParams = new URLSearchParams();
      params.set('query', JSON.stringify(query));
      params.set('access_token', token.access_token);
      let options=new RequestOptions({search:params});

      return this.http.get(this.tdApi+'alerts',options)
                           // https://alerts.terradotta.com/api/alerts?query=%7B%22account_id%22:%22A1FE770DCC48D4A1D4F7DB512884B2FA%22,%22country_iso%22:[%22USA%22],%22alert_status%22:%221%22,%22limit%22:%2210%22,%22range%22:%7B%22begin%22:%222017-01-1%2200:00:00%22,%22begin%22:%222017-03-28%2200:00:00%22%7D&access_token='+token.access_token
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
      
  }
  getAlertsByCityName(cityName:string,token){
     var todayDate = new Date().toISOString().slice(0,10);

    var sevenDayBefore = new Date();
    sevenDayBefore.setDate(sevenDayBefore.getDate() - 30);
    let sevenDayBeforeString=sevenDayBefore.toISOString().slice(0,10);

      let query={
          "account_id":"A1FE770DCC48D4A1D4F7DB512884B2FA"
          ,"city_name":[cityName]
          ,"limit":50
          ,"sort_field":"alert_timestamp"
          ,"sort_order":"DESC"
          ,"range":{
            "begin":sevenDayBeforeString+" 00:00:00"
            ,"end":todayDate+" 23:59:59"
          }
        
        };
        console.log("query",query)
      let params: URLSearchParams = new URLSearchParams();
      params.set('query', JSON.stringify(query));
      params.set('access_token', token.access_token);
      let options=new RequestOptions({search:params});

      return this.http.get(this.tdApi+'alerts',options)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
      
  }
 

   getAlertsById(alertId:string,token){
      return this.http.get(this.tdApi+'alerts?query=%7B%22alert_id%22:%22'+alertId+'%22,%22account_id%22:%22ANY%22%7D&access_token='+token.access_token)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  getCheckinRequests(user_id,account_id,token){
            
           return this.http.get(this.tdApi+'alerts?query=%7B%22account_id%22:%22'+this.user.user.account_id+'%22,%22user_id%22:%22'+this.user.user.user_id+'%22,%22limit%22:%22150%22%7D&access_token='+token.access_token)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
  }
  getCountryCityList(token){

    return this.http.get(this.tdApi+'countries?access_token='+token.access_token)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);

  }
  fillCountries(){

    this.http.get(this.tdApi+'countries')
      .toPromise()
      .then(response => { this.countries = response.json();
      })
      .catch(this.handleError);

  }
  searchInCountries(name:string){

         for (let i=0; i < this.countries.length; i++){
                              if(this.countries[i].country_name == name){
                                                
                                                return this.countries[i].country_iso;
                                    }
                        }
  }

 

  fillSubscriptions(userId:string){
      return this.http.get(this.tdApi+'subscribe?query=%7B%22type%22:%22subs%22,%22user_id%22:%22'+userId+'%22,%22account_id%22:%22'+this.user.user.account_id+'%22%7D')

      .toPromise()
      .then(response =>{this.subscriptions = response.json();console.log(this.subscriptions);
       } )
      .catch(this.handleError);
  }

/**
 * List of alerts
 */
   fillCheckins(userId,accountId,token){
      return this.http.get(this.tdApi+'alerts?query=%7B%22account_id%22:%22'+this.user.user.account_id+'%22,%22user_id%22:%22'+this.user.user.user_id+'%22,%22limit%22:%22150%22%7D&access_token='+token.access_token)
            .toPromise()
            .then(response =>{this.checkins = response.json();console.log(this.checkins);
            })
            .catch(this.handleError);
  }

  

  

  saveSubscription(request:any,token){
                let body = JSON.stringify(request);
                return this.http.post(this.tdApi+'subscribe/subs?access_token='+token.access_token, body)
                .toPromise()
                .then(response => { return response.json() }, this.handleError);
   
  }
  saveCheckin(request:any,token){
      
    
                return this.http.post(this.tdApi+'checkin?access_token='+token.access_token, request)
                .toPromise()
                .then(response => { return response.json() }, this.handleError);
  }

  saveGeoSubscription(request:any,token){
      console.log(request);
      
        let body = JSON.stringify(request);        
                return this.http.post(this.tdApi+'subscribe/geosubs?access_token='+token.access_token, body)
                .toPromise()
                .then(response => { return response.json() }, this.handleError);
   
  }

  deleteSubscription(id,token){
         return this.http.delete(this.tdApi+'subscribe/'+'subs'+'/'+id+"/?access_token="+token.access_token)
                .toPromise()
                .then(response => { return response.json() }, this.handleError);

  }

   editSubscription(id,request,token){
        let body = JSON.stringify(request);
        
                return this.http.put(this.tdApi+'subscribe/'+'subs'+'/'+id+"/?access_token="+token.access_token, body, this.headers)
                .toPromise()
                .then(response => { return response.json() }, this.handleError);
     

  }

  fillCategories(){

     this.http.get(this.tdApi+'categories')
      .toPromise()
      .then(response =>{ this.categories = response.json() ; console.log(this.categories);
      } )
      .catch(this.handleError);
  }

  getRegisterInfo(code){
   return this.http.get(this.tdApi+'registration/'+code+'/'+this.user.mobile_id)
      .toPromise()
      .then(response =>{ return response.json() }, this.handleError )
      .catch(this.handleError);
  }

  saveLocation(lat,long){

                 this.oauth.getToken().then(token=>{

                      this.storage.set('coordinates', {lat:lat,long:long});
                this.lat = lat;
                this.long = long;
                this.getTdsGeocode(lat,long,token).then(result=>{
                    this.country_name = result.country;
                    this.storage.set('country_name',this.country_name);
                    this.country_iso = result.iso3;
                    this.storage.set('country_iso',this.country_iso);
                     let request = {
                             country_iso : this.country_iso,
                                user: this.user.user,
                                    preferences: this.preferences.preferences,
                            created_by : "user",
                            categories :this.preferences.categories,
                            current_location :""+lat+","+long+""

            };

            

            this.saveGeoSubscription(request,token).then(response=>{
                this.storage.set('geosub',request);
                
                console.log(response);
                
            });
                })

                 })
                
               
  }
  updateLocation(lat,long){
        this.lat = lat;
        this.long = long;
   
  }
  checkRegistration(){
    return this.storage.get('registered').then(
          result=>{
              if(result == true || this.user.registered == true){
                  return true
              }
          }
          
      )
  }

  getRegistrationInfo(){
        this.storage.get('user').then(result=>{
            this.user.user = result;
            console.log(this.user.user);   
        });
  }
  getTdsGeocode(lat,long,token){
      
       return this.http.get(this.tdApi+'geoinfo?point=%7B%22lat%22:%22'+lat+'%22,%22lon%22:%22'+long+'%22%7D&access_token='+token.access_token)
      .toPromise()
      .then(response =>{ return response.json() }, this.handleError )
      .catch(this.handleError);

  }



  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }


}