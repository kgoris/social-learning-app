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
  public questionnaires_locked = this.questionnaires_url + '/find_locked'

  public student_questions_by_student_url = this.student_question_url + '/find-by-student';
  public student_questions_create = this.student_question_url + '/create-by-questionnaireId-and-student';
  public student_questions_next = this.student_question_url + '/next';
  public student_questions_previous = this.student_question_url + '/previous';
  public student_questions_lock = this.student_question_url + '/lock';
  public student_questions_results = this.student_question_url + '/results';
  public student_questions_reset = this.student_question_url + '/reset';
  public student_questions_visit = this.student_question_url + '/visit';
  public student_questions_save = this.student_question_url + '/save';

  public websocket_ws = environment.backUrl + '/gkz-stomp-endpoint';
}
