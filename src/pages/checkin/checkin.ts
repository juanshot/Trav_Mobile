import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { EndPoint } from '../../providers/end-point';
import { AlertDetailPage } from '../alert-detail/alert-detail';
import { UserProvider } from '../../providers/user-provider';
import { MyAlertsPage } from '../my-alerts/my-alerts';
import { LocationTracker } from '../../providers/location-tracker';
import { OauthProvider } from '../../providers/oauth-provider';


@Component({
  selector: 'page-checkin',
  templateUrl: 'checkin.html'
})
export class CheckinPage {
  option:string ="OK"; 
  alert:any;
  tdsalert:any;
  checkin:any=null;//Checkin: previous info entered by the user
   shownItem: any ="false";
   request:any = {};
   message:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
            public endPoint: EndPoint,public loading:LoadingController,
            public toast: ToastController,
            public userProvider:UserProvider,
            public oauth:OauthProvider
    ) {

        if(this.alert = this.navParams.get('alert') === undefined){
            this.alert = {incident_headline:"hello"}
           this.tdsalert = {incident_headline:"hello"}
        } else{

              this.alert = this.navParams.get('alert');
            this.tdsalert = this.navParams.get('tdsalert');
            this.checkin=this.navParams.get('checkin');
          //  console.log(this.tdsalert);

        }  
           
        if(this.checkin!=null){
          //I check that the status is OK or HELP, otherwise I use the default valuess
          if(this.checkin.checkin_status=="OK"||this.checkin.checkin_status=="HELP"){
            this.option=this.checkin.checkin_status;
            this.message=this.checkin.checkin_status_msg;
          }
        }
         console.log("tdsalert",this.tdsalert);
        console.log("alert",this.alert);
        console.log("checkin",this.checkin);

        
  }

  showToast() {
    let toast = this.toast.create({
      message: 'You have responded successfully',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
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

  goToDetail(id){
  //  console.log(this.alert.alert_id);
      this.navCtrl.push(AlertDetailPage,{alert_id:id});
  }
  saveCheckin(){
    this.request.account_id = this.userProvider.user.account_id;
     this.request.user_id = this.userProvider.user.user_id;
     if(this.tdsalert.alert_id == undefined){
            this.request.alert_id = this.tdsalert.additionalData.additionalData.alert_id;

     }else{
         this.request.alert_id= this.tdsalert.alert_id;
     }
     if(this.alert.alert_id == undefined){
            this.request.alert_origin = this.tdsalert.additionalData.additionalData.alert_origin;

     }else{
         this.request.alert_origin=this.alert.alert_id;
     } 
     
     this.request.checkin_status =this.option;
     this.request.checkin_message =this.message;

     console.log('this is the request',this.request);
     

     // send current location

    // this.request.current_location= "";

     //send country_iso

    // this.request.country_iso ="";


     /*this.request.account_id = "A1FE770DCC48D4A1D4F7DB512884B2FA";
     this.request.user_id = "1598";
     this.request.alert_id="TDSCHK-1488475071";
     this.request.alert_origin="RED24-15610";
     this.request.checkin_status =this.option;
     this.request.checkin_message =this.message;*/
   
      

     
      let loading = this.loading.create({});
      loading.present();
      this.oauth.getToken().then(token=>{
            this.endPoint.saveCheckin(this.request,token).then(
                result =>{
                  console.log(result);
                  
                  //LM not showing the message, Meeting request by 2017-03-31
                  //this.showToast();
                  
                  this.endPoint.fillCheckins(this.userProvider.user.user_id,this.userProvider.user.account_id,token).then(result=>{
                     this.navCtrl.setRoot(MyAlertsPage)
                  })
                  

                  loading.dismiss();
                }
              )

      })
      



  }

}
