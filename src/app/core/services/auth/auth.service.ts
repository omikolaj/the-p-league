import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LOCAL_STORAGE_ITEM } from 'src/app/shared/constants/the-p-league-constants';
import { Login } from '../../models/auth/login.model';
import { ApplicationToken } from '../../models/auth/token/ApplicationToken.model';
import { JwtPayload } from '../../models/auth/token/JwtPayload.model';
import { LocalStorageItem } from '../../models/storage/local-storage.model';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	headers = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};

	private isLoggedInSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	isLoggedIn$ = this.isLoggedInSub.asObservable().pipe(
		map((isLoggedIn) => {
			return this.isLoggedIn;
		})
	);

	constructor(private http: HttpClient) {}

	checkRoles() {
		return this.http.get<string[]>(`users/${this.currentUserId}/roles`);
	}

	authenticate(user: Login): Observable<ApplicationToken> {
		// http request to authenticate admin
		return this.http.post<ApplicationToken>('login', JSON.stringify(user), this.headers).pipe(
			map((appToken) => {
				return this.setSession(appToken);
			}),
			tap((_) => this.isLoggedInSub.next(true)),
			catchError((err) => {
				this.isLoggedInSub.next(false);
				return throwError(err);
			})
		);
	}

	updatePassword(user: Login) {
		return this.http.post<boolean>(`admin/${this.currentUserId}/update-password`, JSON.stringify(user), this.headers);
	}

	logout(): Observable<boolean> {
		return this.http.delete<boolean>('logout').pipe(
			map((res) => {
				localStorage.removeItem(LOCAL_STORAGE_ITEM);
				return res;
			}),
			tap((_) => this.isLoggedInSub.next(false))
		);
	}

	refreshToken(): Observable<ApplicationToken> {
		return this.http.get<ApplicationToken>('token/refresh').pipe(
			map((appToken) => {
				return this.setSession(appToken);
			}),
			tap((_) => this.isLoggedInSub.next(true))
		);
	}

	private setSession(appToken: ApplicationToken): ApplicationToken {
		// Since we are setting new session, remove previous object from storage
		// and re-set it
		localStorage.removeItem(LOCAL_STORAGE_ITEM);

		const expiresAt = moment().add(appToken.expires_in, 'seconds');
		const jwtPayload: JwtPayload = this.decodeJwt(appToken.access_token);
		const localStorageItem: LocalStorageItem = {
			sub: jwtPayload.sub,
			id: jwtPayload.id,
			expires_at: JSON.stringify(expiresAt.valueOf())
		};
		const localStorageItemJSON: string = JSON.stringify(localStorageItem);
		localStorage.setItem(LOCAL_STORAGE_ITEM, localStorageItemJSON);
		return appToken;
	}

	get currentUserId(): string | null {
		const storageItem: LocalStorageItem = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEM)) as LocalStorageItem;
		if (storageItem === null) return null;
		return storageItem.id;
	}

	get wasLoggedIn() {
		return this.getExpiration === null ? null : true;
	}

	get isLoggedOut(): boolean {
		return !this.isLoggedIn;
	}

	get isLoggedIn(): boolean {
		// if this.getExpiration is null user was never logged in OR intentially logged out
		if (this.getExpiration === null) {
			return false;
		}
		return moment().isBefore(this.getExpiration);
	}

	get getExpiration() {
		const localStorageItem: LocalStorageItem = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEM)) as LocalStorageItem;
		if (localStorageItem === null) {
			// if localStorageItem is empty user is logged out
			return null;
		}
		const expiration = JSON.parse(localStorageItem.expires_at);
		return moment(expiration);
	}

	private decodeJwt(jwt: string): JwtPayload {
		try {
			return jwt_decode(jwt) as JwtPayload;
		} catch (error) {
			return null;
		}
	}
}
