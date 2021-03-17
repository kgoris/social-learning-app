import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {

  private _api_url = environment.backUrl;

  public refresh_token_url = this._api_url + '/refresh';

  public login_url = this._api_url + '/login';

  public logout_url = this._api_url + '/logout';

  public change_password_url = this._api_url + '/changePassword';

  public whoami_url = this._api_url + '/whoami';

  public student_url = this._api_url + '/students';
}
