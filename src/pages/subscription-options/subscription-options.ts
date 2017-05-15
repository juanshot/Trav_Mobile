import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import {LoadingController,ToastController} from 'ionic-angular';
import {SettingsPage} from '../settings/settings';

import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user-provider';
import { EndPoint } from '../../providers/end-point';
import { OauthProvider } from '../../providers/oauth-provider';
import * as moment from 'moment';

@Component({
  selector: 'page-subscription-options',
  templateUrl: 'subscription-options.html'
})
export class SubscriptionOptionsPage {

  country:any;
  request:any = {};
  user:any ={};
   today = new Date();
   country_iso:any;
   country_flag:any;
    country_name:any;
    city_name:any;


  categories:any[];


  crime_check = false;
  civil_unrest_check = false;
  travel_transport_check = false;
  terrorism_check = false;
  political_check = false;
  conflict_check = false;
  natural_hazard_check = false;
  kidnapping_check = false;
  infrastructure_check = false;
  unnatural_hazard_check = false;
  piracy_check = false;
  health_check = false;
  risk_rating_check = false;



  myStartDate:any;
  myEndDate:any  ;
  showSeverities =true;
   showDates =true
    showCategories =true
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
    pushExtreme = true
    pushHigh = true
    pushMedium = true
    pushLow = true
    pushMinimal = true

    emailExtreme = true
    emailHigh = true
    emailMedium = true
    emailLow = true
    emailMinimal =true


  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public endPoint:EndPoint,
     public loading:LoadingController,
     public toast:ToastController,
     public alert:AlertController,
     public userProvider:UserProvider,
     public storage:Storage,
     public oauth:OauthProvider
     
     ) {

          console.log( this.navParams);
          
          this.country_iso = this.navParams.get('iso');
          this.country_flag = this.navParams.get('flag');
          this.country_name = this.navParams.get('name');
          this.city_name = this.navParams.get('city_name');
          

          console.log(this.country_name);
           this.currentDateFormat();
          this.addMonthFormat();
          
          this.categories = this.endPoint.categories;
          
          
          
  }
  currentDateFormat(){
        var today:any = new Date();
        var dd:any = today.getDate();
        var mm:any = today.getMonth()+1; 

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        var return_date = yyyy+'-'+mm+'-'+dd;
        this.myStartDate = return_date;
  }
  addMonthFormat(){

    var result = moment(this.myStartDate);
    var result2 = result.clone().add(1,'month').format("YYYY-MM-DD");
      this.myEndDate = result2;
      
  }

  showToast() {
    let toast = this.toast.create({
      message: 'You have been subscribed to '+this.country_name+' ',
      duration: 3000,
      showCloseButton: false,
      dismissOnPageChange: false,
      cssClass: "toast",
    });
    toast.present();
  }

  saveSubscription(){
    
      this.request.country_iso = this.country_iso;
      
      (this.city_name != undefined)? this.request.city_name = this.city_name : null;

      this.user = this.userProvider.user;

      //request

      this.request.user = this.user;
      this.request.subs_start= this.myStartDate+" 00:00:00";
      this.request.subs_end= this.myEndDate+" 00:00:00";
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

      this.request.created_by = "usr";
      this.request.categories = this.categories;
      let loading = this.loading.create({
      
        });
      loading.present();

      this.oauth.getToken().then(token=>{
        this.endPoint
        .saveSubscription(this.request,token)
        .then(count=>{ 
              console.log(count);
              if(count.status =="ERROR"){
                loading.dismiss();
                console.log(count.message);
                
              }else{

                let format_save = {id: count._id , subData: this.request}
              this.endPoint.subscriptions.push(format_save);
              this.storage.set('subscriptions',this.endPoint.subscriptions);
              console.log(this.endPoint.subscriptions);
              this.navCtrl.setRoot(SettingsPage);
              
              loading.dismiss();

              }
              
              
           
        });

      })
      
    

  }

   changeSeverities(){
   this.showSeverities = !this.showSeverities;
  }
  changeDates(status){
     this.showDates = !this.showDates;
  }
  changeCategories(status){
      this.showCategories = !this.showCategories;
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

          if(category == "travel transport"){

               
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
          if(category == "unnatural hazard"){

                this.unnatural_hazard_check = true;

          }
          
          if(category == "piracy"){

                this.piracy_check = true;

          }

          if(category == "health"){

                this.health_check = true;

          }

          if(category == "infrastructure"){

                this.infrastructure_check = true;

          }
          if(category == "kidnapping"){

                this.kidnapping_check = true;

          }

          if(category == "risk rating"){

                this.risk_rating_check = true;

          }

          

      }

      alert.addInput({
                      type: 'checkbox',
                      label: 'Civil Unrest',
                      value: 'civil_unrest',
                      checked: this.civil_unrest_check
                      
      });

       alert.addInput({
                      type: 'checkbox',
                      label: 'Conflict',
                      value: 'conflict',
                      checked: this.conflict_check
                       
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Crime',
                      value: 'crime',
                      checked: this.crime_check
                       
      });

       alert.addInput({
                      type: 'checkbox',
                      label: 'Health',
                      value: 'health',
                      checked: this.health_check
                       
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Infrastructure',
                      value: 'infrastructure',
                      checked: this.infrastructure_check
                       
      });

       alert.addInput({
                      type: 'checkbox',
                      label: 'Kidnapping',
                      value: 'kidnapping',
                      checked: this.kidnapping_check
                       
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Natural Hazard',
                      value: 'natural hazard',
                      checked: this.natural_hazard_check
                       
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Piracy',
                      value: 'piracy',
                      checked: this.piracy_check
                       
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Risk Rating',
                      value: 'risk rating',
                      checked: this.risk_rating_check
                       
      });

      alert.addInput({
                      type: 'checkbox',
                      label: 'Unnatural Hazard',
                      value: 'unnatural hazard',
                      checked: this.unnatural_hazard_check
                       
      });

      

      

       alert.addInput({
                      type: 'checkbox',
                      label: 'Terrorism',
                      value: 'terrorism',
                      checked: this.terrorism_check
                       
      });
      

      alert.addInput({
                      type: 'checkbox',
                      label: 'Travel Transport',
                      value: 'travel transport',
                      checked: this.travel_transport_check
                       
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



}
