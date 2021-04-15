import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {

  private _api_url = environment.backUrl;

  public refresh_token_url = this._api_url + '/refresh';

  public login_url = this._api_url + '/login';

  public logout_url = this._api_url + '/logout';



  public student_url = this._api_url + '/students';
  public questionnaires_url = this._api_url + '/questionnaires';
  public student_question_url = this._api_url + '/student-questions';

  public reset_credentials_url = this.student_url + '/reset-credentials';
  public whoami_url = this.student_url + '/whoami';
  public change_password_url = this.student_url + '/changePassword';
  public questionnaires_find_by_questionnaire_query = this.questionnaires_url + '/find_by_student_and_access_type';

  public student_questions_by_student_url = this.student_question_url + '/find-by-student';
  public student_questions_create = this.student_question_url + '/create-by-questionnaireId-and-student'
  


}
