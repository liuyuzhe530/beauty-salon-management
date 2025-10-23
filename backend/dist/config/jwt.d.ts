import { JWTPayload } from '../types/auth';
declare const JWT_SECRET: string;
declare const JWT_EXPIRE: string;
export declare const generateToken: (payload: JWTPayload) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export { JWT_SECRET, JWT_EXPIRE };
//# sourceMappingURL=jwt.d.ts.map