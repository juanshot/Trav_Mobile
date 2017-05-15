import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {EndPoint} from '../../providers/end-point';
import {ModalController , LoadingController, ToastController,ViewController} from 'ionic-angular';
import {SubscriptionOptionsPage} from '../subscription-options/subscription-options';
@Component({
  selector: 'page-new-subscription',
  templateUrl: 'new-subscription.html'
})
export class NewSubscriptionPage {

    searchTerm:string;
    countries: any;
    countriesService:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public endPoint:EndPoint, 
    public loading: LoadingController,
    public modal:ModalController,
    public toast:ToastController
    ) {
      this.countriesService = this.endPoint.countries;
      
      this.searchTerm ="";

  }

   getItems(searchbar:any) {
        // Reset items back to all of the items
        let query =  searchbar.target.value;
        if (query.trim() == ""){
             this.countries = [];   
        }else{
              let q = query.toLowerCase()
               this.countries = this.countriesService.filter(
                  (resultCountry)=>{
                        //country result
                  if(resultCountry.country_name.toLowerCase().indexOf(q) > -1){
                        
                        return true
                  }
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
                  
                  return ccountry;
                  
            })
              
        }
        

 }

 showOptions(country){
  
       this.navCtrl.push(SubscriptionOptionsPage,{iso:country.country_iso,flag:country.country_flag,name:country.country_name})
      
    
  }
   goToSubscriptionC(country,city){
  
       this.navCtrl.push(SubscriptionOptionsPage,{iso:country.country_iso,flag:country.country_flag,city_name: city})
      
    
  }



}

//modal settings component configuration

@Component({
    template: `
    <ion-header>

    <ion-navbar>
      <ion-title>
            <div>
                  <div class="title">
                        {{country.country_name}}
                  </div>
                  
            <div class="subtitle">Subscription</div>
                  <div class="clear"></div>
                  
            </div>
      </ion-title>
        <ion-buttons end>
        <button ion-button  (click)="closeModal()" ><ion-icon [name]="'close'" color="light" outline round ></ion-icon></button>
    </ion-buttons>
    </ion-navbar>
    </ion-header>
    <ion-content class="modalContent">

    </ion-content>
    


 `,
  styles:[`
      ion-header {
		@include header-styles(color($colors, header-alt, base), color($colors, header-alt, contrast));
	}

      .title{

		width: 90%;

	

	}
	.subtitle{
		display: block;
		font-size: 0.5em;
		color : $white-b;
		margin: 0px;

	}
	.clear{
		clear: both
	}

      .modalContent{
           background-color: $white-d;
      }

  `]
})

export class ModalOptions {
    country:any;
    dateStart:any;
    dateFinish:any;
    constructor(private nav:NavController, private viewCtrl:ViewController, private navParams: NavParams,private toast:ToastController) {
          this.country = this.navParams.data;
    }

    closeMe() {
     
    }
    closeModal(){
      this.viewCtrl.dismiss();
      
    }
    saveSettings(){
            this.showToast();        
            this.viewCtrl.dismiss();
            
    }
    showToast() {
    let toast = this.toast.create({
      message: 'Settings saved',
      duration: 3000
    });
    toast.present();
  }

  

}
