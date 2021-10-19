import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ChoosingComponent } from './choosing/choosing.component';
import { AuthGuard } from './guard/auth-guard';
import { LearningComponent } from './learning/learning.component';
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
    canActivate: [AuthGuard]
  },
  { 
    path: 'home', 
    component: WelcomeComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'work/:studentUsername/:readonly', 
    component: WorkComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'questionnaire/new/:qid/:studentUsername/:readonly', 
    component: QuestionnaireComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'questionnaire/:currentSudentQuestionId/:studentUsername/:readonly', 
    component: QuestionnaireComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'learning/:studentUsername/:readonly/:currentSudentQuestionId',
    component: LearningComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'choosing/:studentUsername/:readonly/:currentSudentQuestionId',
    component: ChoosingComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'results/:id/:studentUsername/:readonly', 
    component: ResultsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'observe',
    component: ObserveComponent,
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
