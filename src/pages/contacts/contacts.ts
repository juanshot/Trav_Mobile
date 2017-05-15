import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, } from 'ionic-angular';
import { CallNumber } from 'ionic-native';
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html'
})
export class ContactsPage {
  country:any;
  description:any;
  


  constructor(public navCtrl: NavController, public navParams: NavParams,public actionSheet: ActionSheetController) {
    this.country = this.navParams.get('country');
    console.log(this.country);
    
    this.description =this.country.categories[6].category_sections;
    
    
    
    
  }

  showOptions(number:any){
    let call = parseInt(number);
  let actionSheet = this.actionSheet.create({
      title: 'Contact Options',
      buttons: [
      {
          text: call,
          icon: 'call',
          color:'blue',
          handler: () => {
            this.call(number);
          }
        }
      ]

    });
    
    actionSheet.present();
  }

  call(number: string){
    CallNumber.callNumber(number, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }

 

}
