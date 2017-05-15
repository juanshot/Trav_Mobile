import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { EndPoint } from '../../providers/end-point';
import { DatePipe } from '@angular/common';
import { UserProvider } from '../../providers/user-provider';
import { Storage } from '@ionic/storage';
import { SettingsPage } from '../settings/settings';
@Component({
  selector: 'page-geo-settings',
  templateUrl: 'geo-settings.html'
})
export class GeoSettingsPage {
   name:any;
  flag:any;
  subscription:any;
   myStartDate:any;
  myEndDate:any  ;
  request:any = {};
  user:any = {};
  myStartDateUnformat:any;
  myEndDateUnformat:any;
  dPickerStartDate ="";
  dPickerEndDate ="";
  preferenceExtreme ={
      notification_types:[],
      severity:"extreme"
    }
    preferenceHigh ={
      notification_types:[],
      severity:"high"
    }
    preferenceMedium ={
      notification_types:[],
      severity:"medium"
    }
    preferenceLow ={
      notification_types:[],
      severity:"low"
    }
    preferenceMinimal ={
      notification_types:[],
      severity:"minimal"
    }
    pushExtreme 
    pushHigh 
    pushMedium 
    pushLow
    pushMinimal 

    emailExtreme
    emailHigh

    emailMedium 
    emailLow 
    emailMinimal

  showDate = true;
  showDateEnd = true;
  categories: any[];


 crime_check = true;
  civil_unrest_check = true;
 travel_transport_check = true;
  terrorism_check = true;
  



  political_check = false;
  conflict_check = false;
  natural_hazard_check = false;
  kidnapping_check = false;
  infrastructure_check = false;
  unnatural_hazard_check = false;
  piracy_check = false;
  health_check = false;
  risk_rating_check = false;



  showSeverities =true;
   showDates =true
    showCategories =true
    preferences:any;
    registered

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  public endPoint:EndPoint,
     public loading:LoadingController,
     public toast:ToastController,
     public alert: AlertController,
     public datePipe: DatePipe,
     public userProvider:UserProvider,
     public storage:Storage) {

        this.name = this.navParams.get('countryName');
        this.flag = this.navParams.get('countryFlag');
        
        storage.get('geo_preferences').then(result=>{
          console.log(result);
          if(result == null){
                      this.pushExtreme = true; 
                      this.pushHigh = true; 
                      this.pushMedium = true; 
                      this.pushLow = true;
                      this.pushMinimal = true;
                      this.emailMinimal = true; 
                      this.emailExtreme = true;
                      this.emailHigh= true; 
                      this.emailMedium = true; 
                      this.emailLow = true; 
                 this.registered = false;
                 this.categories = this.endPoint.categories;
                  this.crime_check = true;
                    this.civil_unrest_check = true;
                  this.travel_transport_check = true;
                    this.terrorism_check = true;
                    this.political_check = true;
                    this.conflict_check = true;
                    this.natural_hazard_check = true;
                    this.kidnapping_check = true;
                    this.infrastructure_check = true;
                    this.unnatural_hazard_check = true;
                    this.piracy_check = true;
                    this.health_check = true;
                    this.risk_rating_check = true;
          }else{



            this.registered = true;

            this.categories = result.categories;

            for(let i=0; i< result.preferences.length;i++){
                if(result.preferences[i].severity=="extreme"){

                    if(result.preferences[i].notification_types.indexOf('push') > -1){
                            this.pushExtreme = true
                    }
                    if(result.preferences[i].notification_types.indexOf('email') > -1){
                        this.emailExtreme = true
                    }
                }
                if(result.preferences[i].severity=="high"){
                    if(result.preferences[i].notification_types.indexOf('push') > -1){
                        this.pushHigh = true
                    }
                    if(result.preferences[i].notification_types.indexOf('email') > -1){
                        this.emailHigh = true
                    }
                }

                if(result.preferences[i].severity=="medium"){
                    if(result.preferences[i].notification_types.indexOf('push') > -1){
                        this.pushMedium = true
                    }
                    if(result.preferences[i].notification_types.indexOf('email') > -1){
                        this.emailMedium = true
                    }
                }

                if(result.preferences[i].severity=="low"){
                    if(result.preferences[i].notification_types.indexOf('push') > -1){
                        this.pushLow = true
                    }
                    if(result.preferences[i].notification_types.indexOf('email') > -1 ){
                        this.emailLow = true
                    }
                }

                if(result.preferences[i].severity=="minimal"){
                    if(result.preferences[i].notification_types.indexOf('push') > -1){
                        this.pushMinimal = true
                    }
                    if(result.preferences[i].notification_types.indexOf('email') > -1 ){
                        this.emailMinimal = true
                    }
                }

            }
            
          }
          
        })

     }



   showCategoriesAlert(){
    let alert = this.alert.create();
    alert.setTitle('Categories');

    this.crime_check = false;
    this.civil_unrest_check = false;
    this.travel_transport_check = false;
    this.terrorism_check = false;
    this.political_check = false;
    this.conflict_check = false;
    this.natural_hazard_check = false;
    this.kidnapping_check = false;
    this.infrastructure_check = false;
    this.unnatural_hazard_check = false;
    this.piracy_check = false;
    this.health_check = false;
    this.risk_rating_check = false;
      for(let category of this.categories){
        
         if(category == "civil_unrest"||category == "civil unrest"){

                this.civil_unrest_check = true;

          }

          if(category == "crime"){

              this.crime_check = true;


          }

          if(category == "travel transport"||category=="travel_transport"){

               
              this.travel_transport_check = true;

          }

           if(category == "terrorism"){

                this.terrorism_check = true;

          }

          if(category == "political"){

                this.political_check = true;

          }
          if(category == "conflict"){

                this.conflict_check = true;

          }

          if(category == "natural hazard"){

                this.natural_hazard_check = true;

          }
          
          if(category == "piracy"){

                this.piracy_check = true;

          }

          if(category == "health"){

                this.health_check = true;

          }
  



      }

      alert.addInput({
                      type: 'checkbox',
                      label: 'Crime',
                      value: 'crime',
                      checked: this.crime_check
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Civil Unrest',
                      value: 'civil_unrest',
                      checked: this.civil_unrest_check
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Travel Transport',
                      value: 'travel_transport',
                      checked: this.travel_transport_check
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Terrorism',
                      value: 'terrorism',
                      checked: this.terrorism_check
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Natural Hazard',
                      value: 'natural hazard',
                      checked: this.natural_hazard_check
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Conflict',
                      value: 'conflict',
                      checked: this.conflict_check
      });



      alert.addInput({
                      type: 'checkbox',
                      label: 'Piracy',
                      value: 'piracy',
                      checked: this.piracy_check
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Health',
                      value: 'health',
                      checked: this.health_check
      });

    

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.categories = data;
        console.log('Checkbox data:', data);
      }
    });
    alert.present();
  }


  saveSubscription(){
    

      this.user = this.userProvider.user;

      //request

      
      this.request.preferences= []; 



       if(this.pushExtreme == true || this.emailExtreme == true ){
          this.preferenceExtreme.notification_types= [];
          if(this.pushExtreme == true){
              this.preferenceExtreme.notification_types.push('push');
          }
          if(this.emailExtreme == true){
             this.preferenceExtreme.notification_types.push('email'); 
          }
          this.request.preferences.push(this.preferenceExtreme)
          
      }

      if(this.pushHigh == true || this.emailHigh == true ){
          this.preferenceHigh.notification_types= [];
          if(this.pushHigh == true){
              this.preferenceHigh.notification_types.push('push');
          }
          if(this.emailHigh == true){
             this.preferenceHigh.notification_types.push('email'); 
          }
          this.request.preferences.push(this.preferenceHigh)
          
      } 

      if(this.pushMedium == true || this.emailMedium == true ){
          if(this.pushMedium == true){
              this.preferenceMedium.notification_types.push('push');
          }
          if(this.emailMedium == true){
             this.preferenceMedium.notification_types.push('email'); 
          }
          this.request.preferences.push(this.preferenceMedium)
          
      }
      if(this.pushLow == true || this.emailLow == true ){
          if(this.pushLow == true){
              this.preferenceLow.notification_types.push('push');
          }
          if(this.emailLow == true){
             this.preferenceLow.notification_types.push('email'); 
          }
          this.request.preferences.push(this.preferenceLow)
          
      }
      if(this.pushMinimal == true || this.emailMinimal == true ){
          if(this.pushMinimal == true){
              this.preferenceMinimal.notification_types.push('push');
          }
          if(this.emailMinimal == true){
             this.preferenceMinimal.notification_types.push('email'); 
          }
          this.request.preferences.push(this.preferenceMinimal)
          
      }

      this.request.created_by = "user";
      this.request.categories = this.categories;
      this.storage.set('geo_preferences',this.request);
      console.log(this.request);
      
      this.navCtrl.push(SettingsPage);


  }



}
