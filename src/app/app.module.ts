import { NgModule, ErrorHandler } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//pages
import {LoginPage,InfoModal} from '../pages/login/login';
import {MapPage} from '../pages/map/map';
import {SearchPage} from '../pages/search/search';
import {SettingsPage} from '../pages/settings/settings';
import { FullInfoCountryPage } from '../pages/full-info-country/full-info-country';
import { FullCityInfoPage } from '../pages/full-city-info/full-city-info';
import{AlertDetailPage} from '../pages/alert-detail/alert-detail';
import {CheckinPage} from '../pages/checkin/checkin';
import {SectionPage} from '../pages/section/section';
import {ContentInfoPage} from '../pages/content-info/content-info';
import { CitySectionPage } from '../pages/city-section/city-section';
import {ContactsPage} from '../pages/contacts/contacts';
import {NewSubscriptionPage} from '../pages/new-subscription/new-subscription';
import {SubscriptionOptionsPage} from '../pages/subscription-options/subscription-options';
import {SubscriptionEditPage} from '../pages/subscription-edit/subscription-edit';
import { MyAlertsPage } from '../pages/my-alerts/my-alerts';
import { InfoPage } from '../pages/info-page/info-page';
import { AlertNotification } from '../pages/alert-notification/alert-notification';
import { CountryAlertsPage } from '../pages/country-alerts/country-alerts';


//modules
import {AgmCoreModule} from 'angular2-google-maps/core';
import { IonicImageLoader } from 'ionic-image-loader';
import { PreloadImage } from '../components/preload-image/preload-image';
import { DatePickerModule } from 'datepicker-ionic2';
import { Storage } from '@ionic/storage';

// services 

import {EndPoint} from '../providers/end-point';
import { UserProvider } from '../providers/user-provider';
import { LocationTracker } from '../providers/location-tracker';
import { GeoLocationProvider } from '../providers/geo-location-provider';
import { GLIonic2EnvConfigurationModule } from 'gl-ionic2-env-configuration';
import { ConfigurationProvider } from '../providers/configuration-provider';
import { SubscriptionsService } from '../providers/subscriptions-service';
import { GeoSettingsPage } from '../pages/geo-settings/geo-settings';
import { OauthProvider } from '../providers/oauth-provider';





@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    MapPage,
    SettingsPage,
    SearchPage,
    FullInfoCountryPage,
    FullCityInfoPage,
    AlertDetailPage,
    CheckinPage,
    SectionPage,
    ContentInfoPage,
    PreloadImage,
    CitySectionPage,
    ContactsPage,
    CountryAlertsPage,
    NewSubscriptionPage,
    SubscriptionOptionsPage,
    SubscriptionEditPage,
    MyAlertsPage,
    GeoSettingsPage,
    InfoPage,
    AlertNotification
  ],
  imports: [
    IonicModule.forRoot(MyApp,
    {
      platforms:{
        android:{
           scrollAssist: false,    // Valid options appear to be [true, false]
            autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
        }
      }
    }
    ),
    GLIonic2EnvConfigurationModule,
    DatePickerModule,
    IonicImageLoader,
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyAD-u8RjZs7jh31RH7uTp2dyWOGD2KOv2A'
    })

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    MapPage,
    SettingsPage,
    GeoSettingsPage,
    SearchPage,
    FullInfoCountryPage,
    FullCityInfoPage,
    AlertDetailPage,
    CheckinPage,
    SectionPage,
    ContentInfoPage,
    CitySectionPage,
    ContactsPage,
    CountryAlertsPage,
    NewSubscriptionPage,
    SubscriptionOptionsPage,
    SubscriptionEditPage,
    MyAlertsPage,
    GeoSettingsPage,
    InfoPage,
    AlertNotification
  ],
  providers: [ Storage, SubscriptionsService,OauthProvider, ConfigurationProvider, GeoLocationProvider, LocationTracker, UserProvider,EndPoint, DatePipe,{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
