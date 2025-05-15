export const Http = {
    Status: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500,
        NOT_IMPLEMENTED: 501,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503,
        GATEWAY_TIMEOUT: 504
    },

    Api: {
        Auth: {
            GOOGLE_LOGIN: "/api/auth/google-login",
            SET_USERNAME: "/api/users/username",
            GET_USER: "/api/users/me"
        },
        Google: {
            AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth",
            SCOPES: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email"
            ]
        }
    }
}; 