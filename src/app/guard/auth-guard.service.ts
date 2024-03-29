import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../service/auth.service";

@Injectable()
export class AuthGuardService implements CanActivate{

    constructor(private authService: AuthService,
                private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if(this.authService.isLoggedIn()){
            return true;

        }else{
            this.router.navigate(['/login']);
            return false;
        }
    }
}