import * as jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { ErrorUtils } from '../utils/error.utils';

interface GoogleTokenPayload {
  iss: string;
  sub: string; 
  azp: string;
  aud: string;
  iat: number;
  exp: number;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export class AuthService {
  private static GOOGLE_CERT_URL = 'https://www.googleapis.com/oauth2/v3/certs';
  private static GOOGLE_AUD = process.env.GOOGLE_CLIENT_ID;
  
  private static googleCerts: { [key: string]: string } | null = null;
  private static certExpiryTime: number = 0;


  static async verifyGoogleToken(token: string): Promise<GoogleTokenPayload> {
    try {
      
    const decoded = jwt.decode(token, { complete: true });
      
      if (!decoded || typeof decoded !== 'object' || !decoded.payload) {
        throw ErrorUtils.unauthorized('Invalid token format');
      }
      
      const payload = decoded.payload as GoogleTokenPayload;

      if (payload.iss !== 'https://accounts.google.com' && 
          payload.iss !== 'accounts.google.com') {
        throw ErrorUtils.unauthorized('Invalid token issuer');
      }
      
      // if (payload.aud !== this.GOOGLE_AUD) {
      //   throw ErrorUtils.unauthorized('Invalid token audience');
      // }
      
      // const now = Math.floor(Date.now() / 1000);
      // if (payload.exp < now) {
      //   throw ErrorUtils.unauthorized('Token expired');
      // }
      
      // need to lookinto validiating the sig
      
      return payload;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorUtils.unauthorized(`Invalid Google token: ${error.message}`);
      }
      throw ErrorUtils.unauthorized('Invalid Google token');
    }
  }


  static async loginWithGoogle(googleToken: string): Promise<{ token: string, user: any, requiresUsername: boolean }> {
    const payload = await this.verifyGoogleToken(googleToken);
    
    const googleId = payload.sub;
    
    if (!googleId) {
      throw ErrorUtils.unauthorized('Invalid Google token: missing user ID');
    }
    
    const user = await UserService.findOrCreateUser(googleId);
    
    const requiresUsername = !user.username;
    const userWithRole = await UserService.getUserWithRoleById(user.user_id);
    
    return {
      token: googleToken,
      user: userWithRole,
      requiresUsername
    };
  }


  static async getUserFromToken(token: string): Promise<{ id: number, role: string }> {
    try {
      const payload = await this.verifyGoogleToken(token);
      
      const user = await UserService.getUserByGoogleId(payload.sub);
      
      if (!user) {
        throw ErrorUtils.unauthorized('User not found for this token');
      }
      
      const userWithRole = await UserService.getUserWithRoleById(user.user_id);
      
      return {
        id: user.user_id,
        role: userWithRole.role_name
      };
    } catch (error) {
      throw ErrorUtils.unauthorized('Invalid or expired token');
    }
  }
}