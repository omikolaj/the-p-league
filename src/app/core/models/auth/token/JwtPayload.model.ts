export interface JwtPayload {
	jti: string;
	iat: string;
	sub: string;
	id: string;
	roles: string[];
	permissions: string[];
	exp: number;
	iss: string;
	aud: string;
}
