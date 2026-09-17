
export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user:{
      id: string;
    username: string;
    email: string;

    }
    message:string
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
  }
 
  export interface UserProfile {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
  }
  
  export interface UpdateProfileRequest {
    username?: string;
    email?: string;
    avatarUrl?: string;
  }

  export interface RegisterResponse {
    message: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  }

  interface ApiClientOptions {
    withAuth?: boolean;             // ✅ Attach Token or Not
    enableRefreshToken?: boolean;   // ✅ Refresh Token Handling
  }
  