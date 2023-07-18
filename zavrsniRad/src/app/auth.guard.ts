import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable, map } from 'rxjs';
import { DataService } from './service/data.service';

@Injectable(
    { providedIn: 'root' }
)

export class IsAuthenthicatedGuard implements CanActivate {
    constructor(public data: DataService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        if (this.data.jeUlogiran) {
            return true;
        }
        this.router.navigate(["/"])
        return false;

    }


}