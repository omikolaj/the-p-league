import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  roles$: Observable<string[]> = this.http
    .get<string[]>(`users/${this.auth.currentUserId}/roles`);

  constructor(private http: HttpClient, private auth: AuthService) { }
}
