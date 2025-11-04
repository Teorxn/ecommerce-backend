export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  preferences?: {
    budget?: number;
    usage?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    preferences: {
      budget: number | string;
      usage: string;
    };
  };
  id: string;
  role: string;
}

export interface UserProfileResponse {
  user: Omit<User, 'password_hash'>;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  preferences?: {
    budget?: number;
    usage?: string;
  };
}