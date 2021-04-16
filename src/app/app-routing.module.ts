import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WorkComponent } from './work/work.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'home', component: WelcomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'work', component: WorkComponent},
  { path: 'questionnaire/new/:qid', component: QuestionnaireComponent},
  { path: 'questionnaire/:currentSudentQuestionId', component: QuestionnaireComponent}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
