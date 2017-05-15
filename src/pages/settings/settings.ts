import { Component} from '@angular/core';
import { NavController, NavParams , ModalController,ViewController, AlertController,ToastController,LoadingController,ActionSheetController , ItemSliding, Item } from 'ionic-angular';
import {EndPoint} from '../../providers/end-point';
import {SubscriptionEditPage} from '../subscription-edit/subscription-edit';
import { UserProvider } from '../../providers/user-provider';
import { LocationTracker } from '../../providers/location-tracker';
import { Storage } from '@ionic/storage';
import { NewSubscriptionPage } from '../new-subscription/new-subscription';
import { SubscriptionsService } from '../../providers/subscriptions-service';
import { GeoSettingsPage } from '../geo-settings/geo-settings';
import { OauthProvider } from '../../providers/oauth-provider';
import { GeoLocationProvider } from '../../providers/geo-location-provider';




@Component({
  selector: 'page-settings',
  templateUrl: "settings.html",

})
export class SettingsPage {

  // Mock data from interface
  countries:any; 
  countryInfo:any;
  lat:any;
  lng: any;
  subscriptionList:any;
  subscriptionsUser:any;
  subscriptionsTds:any;
  user:any = {};
  request:any = {};
  geoId :any;
  userId :any ;
  geoStatus:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl:ModalController,
    public alertCtrl:AlertController,
    public toastCtrl:ToastController,
    public loadingCtrl:LoadingController,
    public endPoint: EndPoint,
    public userProvider:UserProvider,
    public alert:AlertController,
    public location: LocationTracker,
    public storage:Storage,
    public subsService:SubscriptionsService,
    public oauth:OauthProvider,
    public actionSheet:ActionSheetController
    
    ) {
         
         
      
      
      
      this.loadCurrentMap();
     
      this.userId = userProvider.user.mobile_identifier;
      this.geoStatus = this.location.current_status;
      //console.log(this.endPoint.countries.countries);
      

  }

   ionViewCanEnter() {
    
     this.countries = this.endPoint.countries;
     this.oauth.getToken().then(token=>{
      this.endPoint.setSubscriptions(this.userProvider.user.user_id,token);
     }).then(result=>{

            this.subscriptionList = this.endPoint.subscriptions;
            this.subscriptionsUser = this.subscriptionList.filter(x=>x.subData.created_by != 'tds' );
            this.subscriptionsTds = this.subscriptionList.filter(x=>x.subData.created_by == 'tds');
            console.log('list of subscriptions',this.subscriptionList);
            console.log('list of user subscriptions',this.subscriptionsUser);
            console.log('list of tds subscriptions',this.subscriptionsTds);
       
     })
     
       
       
  }

  removeSubscription(id){

      for(let i=0; i < this.subscriptionList.length; i++){

            if(this.subscriptionList[i].id == id){

                  this.subscriptionList.splice(i,1);
                   this.oauth.getToken().then(token=>{
                        this.endPoint.setSubscriptions(this.userProvider.user.user_id,token);
                      })

            }
      }
  
  }


   showConfirm(subscription) {

      let confirm = this.alertCtrl.create({
      title: 'CONFIRM',
      message: 'Do you want to delete this subscription?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteSubscription(subscription.id);
          }
        }
      ]
    }); 

    confirm.present();
          
                
    
  }


  showToast(country) {
    let toast = this.toastCtrl.create({
      message: 'You are not subscribed to '+ country.name+' anymore',
      duration: 3000
    });
    toast.present();
  }
  showSubscribingModal(){
        let modal = this.modalCtrl.create(MyModal,this.countries);
        modal.present();
  }
  showSettings(country){
    let modal = this.modalCtrl.create(MyModalSettings,country);
    modal.present();
    console.log(country);
    
  }
  getCountryWithIso(countryIso:string){
          this.oauth.getToken().then(token=>{
                this.endPoint
                .getCountry(countryIso,token)
                .then(count=>{this.countries = count; this.countryInfo = count ;
                });
          })
        
  }

  matchIsoFlag(iso){



  return this.endPoint.countries.filter(x=>x.country_iso == iso && x.country_flag != undefined)[0].country_flag;
  
  
      
  }
  matchIsoName(iso){

        return this.endPoint.countries.filter(x=>x.country_iso == iso)[0].country_name;
  }

  public open(itemSlide: ItemSliding, item: Item) {

        // reproduce the slide on the click
        itemSlide.setElementClass("active-sliding", true);
        itemSlide.setElementClass("active-slide", true);
        itemSlide.setElementClass("active-options-right", true);
        item.setElementStyle("transform", "translate3d(-144px, 0px, 0px)")

    }
    public openUserSub(itemSlide: ItemSliding, item: Item) {

        // reproduce the slide on the click
        itemSlide.setElementClass("active-sliding", true);
        itemSlide.setElementClass("active-slide", true);
        itemSlide.setElementClass("active-options-right", true);
        item.setElementStyle("transform", "translate3d(-200px, 0px, 0px)")

    }
     public close(item: ItemSliding) {
        item.close();
        item.setElementClass("active-slide", false);
        item.setElementClass("active-slide", false);
        item.setElementClass("active-options-right", false);
    }
  


  getSubscriptionsUser(userId:string){

     this.endPoint.getSubscriptions(userId).then(result =>{
        this.subscriptionList = result.subscriptions ;     

      })
  }


  
  deleteSubscription(id){

     let loading = this.loadingCtrl.create({
      
        });
      loading.present();
      this.oauth.getToken().then(token=>{
              this.endPoint
        .deleteSubscription(id,token)
        .then(count=>{ 
            if(count.status == "OK"){

                this.removeSubscription(count.message);
                this.storage.set('subscriptions',this.endPoint.subscriptions);
                
                        loading.dismiss();
                  
                  console.log(count);
                  
                  
               
            }
            
        });

      })
    

         
    
      

  }

  saveGeoSubs(iso:string,lat,lng){
      
      this.request.country_iso = iso;
      this.request.current_location =lat+ ','+lng;
      this.user.user_id = '0050';
      this.user.account_id = 'pedro321kfmoctjaqw';
      this.request.user = this.user;
      this.request.subs_start = new Date('yyyy-MM-DD hh:mm:ss');
      console.log(this.request.subs_start);
      this.request.severities = [
        "High",
        "Extreme",
        "Low"

      ]

  
        this.oauth.getToken().then(token=>{
                  this.endPoint
                    .saveGeoSubscription(this.request,token)
                    .then(count=>{ 
                          this.geoId = count._id;
                          console.log(count);
              
              
        });

        })
  
  }


  goToNewSubscription(){
        this.navCtrl.push(NewSubscriptionPage);
  }

  goToGeoSettings( countryName,countryFlag){
    this.navCtrl.push(GeoSettingsPage,{countryName:countryName,countryFlag:countryFlag});
  }
  goToSettings(subscription,countryName,countryFlag){

    this.navCtrl.push(SubscriptionEditPage,{subscription: subscription,countryName:countryName,countryFlag:countryFlag}); 

  
}
goToSettingsCity(subscription,city_name,countryFlag){

    this.navCtrl.push(SubscriptionEditPage,{subscription: subscription,city_name:city_name,countryFlag:countryFlag}); 

  
}

  changeGeoStatus(){
    console.log(this.geoStatus);
    if(this.geoStatus){
      this.location.current_status = true; this.location.startTracking();
      this.geoStatus = this.location.current_status;
    }else{
      this.location.current_status = false; 
      this.location.stopTracking();
      this.geoStatus = this.location.current_status;
    }
    
  }
  

    openMenuSubscription(subscription,countryName,countryFlag){
    let actionSheet = this.actionSheet.create({
     title: 'OPTIONS',
     buttons: [
       {
         text: 'UNSUBSCRIBE',
         icon:'md-remove',
         cssClass:'actionSheetButton',
         role: 'destructive',
         handler: () => {
                this.showConfirm(subscription)
         }
       },
        {
         text: 'SETTINGS',
         icon:'md-settings',
         cssClass:'actionSheetButton',
         role: 'destructive',
         handler: () => {
             this.goToSettings(subscription,countryName,countryFlag);
         }
       },
       {
         text: 'Cancel',
         role: 'cancel',
         cssClass:'actionSheetButton',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });

   actionSheet.present()
  }
 


  

  

    loadCurrentMap(){
    let loading = this.loadingCtrl.create({
    
    });

    loading.present();
 
    this.lat = this.location.lat;
    this.lng = this.location.lng;
        this.oauth.getToken().then(token=>{

              this.endPoint.getTdsGeocode(this.lat,this.lng,token).then(result=>{

            this.getCountryWithIso(result.iso3);
            loading.dismiss();
            return
         

              
        });

        })
        
        
         
         
 
 
  }






disableGeoSubs(){
  this.location.stopTracking();
  this.geoStatus = this.location.current_status;
}


  


}

//modal subscribing component configuration

@Component({
    template: `
    <ion-header>

    <ion-toolbar color="primary">
        <ion-title> New Subscription</ion-title>
        <ion-buttons end>
        <button ion-button  (click)="closeModal()" ><ion-icon [name]="'close'" color="light" outline round ></ion-icon></button>
    </ion-buttons>
    </ion-toolbar>

    </ion-header>
  <ion-content padding>
    <ion-searchbar (ionInput)="getItems($event)"></ion-searchbar>
      <ion-list>
        <ion-item *ngFor="let country of countries">
          <ion-thumbnail item-left>
                  <img src="assets/images/{{country.flag}}"/>
                </ion-thumbnail>
                <h2>{{country.name}}</h2>
                <p>{{country.overall}}</p>
             
             <ion-icon name="add" color="primary" (click)="showConfirm(country)" item-right></ion-icon>
              </ion-item>
      </ion-list>

  </ion-content>`
})

export class MyModal {
    countries: any[];
    constructor(private nav:NavController, private viewCtrl:ViewController,private navP:NavParams) {
            this.countries = navP.data;
    }

    closeMe() {
     
    }
    closeModal(){
      this.viewCtrl.dismiss();
      
    }
}

//modal settings component configuration

@Component({
    template: `
    <ion-header>

    <ion-toolbar color="primary">
        <ion-title>{{country.name}} subscription Management</ion-title>
        <ion-buttons end>
        <button ion-button  (click)="closeModal()" ><ion-icon [name]="'close'" color="light" outline round ></ion-icon></button>
    </ion-buttons>
    </ion-toolbar>

    </ion-header>

  <ion-content padding>

  
              <ion-grid>
                  <ion-row>
                        <ion-col> Severity </ion-col><ion-col>Alert me</ion-col><ion-col>Email me</ion-col>
                  </ion-row>



                  <ion-row>
                        <ion-col> Extreme </ion-col><ion-col><ion-checkbox></ion-checkbox></ion-col><ion-col><ion-checkbox></ion-checkbox></ion-col>
                  </ion-row>
                  <ion-row>
                        <ion-col> High </ion-col><ion-col><ion-checkbox></ion-checkbox></ion-col><ion-col><ion-checkbox></ion-checkbox></ion-col>
                  </ion-row>
                  <ion-row>
                        <ion-col> Medium </ion-col><ion-col><ion-checkbox></ion-checkbox></ion-col><ion-col><ion-checkbox></ion-checkbox></ion-col>
                  </ion-row>
                  <ion-row>
                        <ion-col> Low </ion-col><ion-col><ion-checkbox></ion-checkbox></ion-col><ion-col><ion-checkbox></ion-checkbox></ion-col>
                  </ion-row>

                  <ion-row>
                        <ion-col> </ion-col><ion-col><button (click)="saveSettings()" ion-button>Save</button></ion-col><ion-col></ion-col>
                  </ion-row>
          

              </ion-grid>
           

        
    
  </ion-content>`,
  styles:[`
              ion-page.modal {
              padding: 30px;
              background: rgba(0,0,0,0.5);
            }
            .disabledfeature{
              color: #8f8f8f;
            }
  `]
})

export class MyModalSettings {
    country:any;
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
