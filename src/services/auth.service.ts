import * as jwt from "jsonwebtoken";
import { UserService } from "./user.service";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";

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
  private static GOOGLE_CERT_URL = "https://www.googleapis.com/oauth2/v3/certs";
  private static GOOGLE_AUD = process.env.GOOGLE_CLIENT_ID;

  private static googleCerts: { [key: string]: string } | null = null;
  private static certExpiryTime: number = 0;

  static async decodeGoogleJWT(token: string): Promise<GoogleTokenPayload> {
    try {
      const decoded = jwt.decode(token, { complete: true });

      if (!decoded || typeof decoded !== "object" || !decoded.payload) {
        throw ErrorUtils.unauthorized(Message.Error.Token.INVALID_FORMAT);
      }

      const payload = decoded.payload as GoogleTokenPayload;

      return payload;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorUtils.unauthorized(
          `${Message.Error.Token.INVALID_TOKEN}: ${error.message}`
        );
      }
      throw ErrorUtils.unauthorized(Message.Error.Token.INVALID_TOKEN);
    }
  }

  static async getGoogleJWT(code: string): Promise<string> {
    try {
      const baseUrl = "https://oauth2.googleapis.com/token";

      const options = {
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        redirect_uri: process.env.GOOGLE_REDIRECT_URL ?? "",
        grant_type: "authorization_code",
      };

      const params = new URLSearchParams(options);

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await response.json();

      return data.id_token;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorUtils.unauthorized(
          `${Message.Error.Token.INVALID_TOKEN}: ${error.message}`
        );
      }
      throw ErrorUtils.unauthorized(Message.Error.Token.INVALID_TOKEN);
    }
  }

  static async loginWithGoogle(
    googleCode: string
  ): Promise<{ token: string; user: any; requiresUsername: boolean }> {
    const googleJwt = await this.getGoogleJWT(googleCode);

    const payload = await this.decodeGoogleJWT(googleJwt);

    const googleId = payload.sub;

    if (!googleId) {
      throw ErrorUtils.unauthorized(Message.Error.Token.MISSING_USER_ID);
    }

    const user = await UserService.findOrCreateUser(googleId);

    const requiresUsername = !user.username;
    const userWithRole = await UserService.getUserWithRoleById(user.user_id);

    return {
      token: googleJwt,
      user: userWithRole,
      requiresUsername,
    };
  }

  static async getUserFromToken(
    token: string
  ): Promise<{ id: number; role: string }> {
    try {
      const payload = await this.decodeGoogleJWT(token);

      const user = await UserService.getUserByGoogleId(payload.sub);

      if (!user) {
        throw ErrorUtils.unauthorized(
          Message.Error.Base.USER_NOT_AUTHENTICATED
        );
      }

      const userWithRole = await UserService.getUserWithRoleById(user.user_id);

      return {
        id: user.user_id,
        role: userWithRole.role_name,
      };
    } catch (error) {
      throw ErrorUtils.unauthorized(Message.Error.Token.EXPIRED);
    }
  }
}
