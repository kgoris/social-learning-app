import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './guard/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { ObserveComponent } from './observe/observe.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ResultsComponent } from './results/results.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WorkComponent } from './work/work.component';

const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: 'home',
    canActivate: [AuthGuardService]
  },
  { 
    path: 'home', 
    component: WelcomeComponent,
    canActivate: [AuthGuardService]
  },
  { 
    path: 'login', 
    component: LoginComponent,  
  },
  { 
    path: 'work/:studentId/:readonly', 
    component: WorkComponent,
    canActivate: [AuthGuardService]
  },
  { 
    path: 'questionnaire/new/:qid/:studentId/:readonly', 
    component: QuestionnaireComponent,
    canActivate: [AuthGuardService]
  },
  { 
    path: 'questionnaire/:currentSudentQuestionId/:studentId/:readonly', 
    component: QuestionnaireComponent,
    canActivate: [AuthGuardService]
  },
  { 
    path: 'results/:id/:studentId/:readonly', 
    component: ResultsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'observe',
    component: ObserveComponent,
    canActivate: [AuthGuardService]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
