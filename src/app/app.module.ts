import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WelcomeService } from './welcome/welcome.service';
import { ConfigService } from './service/config.service';
import { HttpClient, HttpClientModule, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './service/api.service';
import { UserService } from './service/user.service';
import { HeaderComponent } from './header/header.component';
import { WorkComponent } from './work/work.component';
import { StudentQuestionService } from './service/student-question-service';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ResultsComponent } from './results/results.component';
import { WebsocketServiceService } from './websocket-service.service';
import { ActivityService } from './service/activity.service';
import { StudentService } from './service/student.service';
import { ObserveComponent } from './observe/observe.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializer } from './app-init';
import { AuthGuard } from './guard/auth-guard';
import { ChoosingComponent } from './choosing/choosing.component';
import { LearningComponent } from './learning/learning.component';
import { QuestionnaireService } from './service/questionnaire.service';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    WorkComponent,
    HeaderComponent,
    QuestionnaireComponent,
    ResultsComponent,
    ObserveComponent,
    ChoosingComponent,
    LearningComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    WelcomeService,
    ConfigService,
    HttpClient,
    ApiService,
    UserService,
    StudentQuestionService,
    WebsocketServiceService,
    ActivityService,
    MenuController,
    StudentService,
    
    QuestionnaireService,
    AuthGuard,
   /**{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },*/
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [KeycloakService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
