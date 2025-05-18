export interface User {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  level: string;
  roles: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  cookie: {
    name: string;
    value: string;
    maxAge: string;
    domain: string | null;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    partitioned: boolean;
    sameSite: string;
  };
  user: User;
}
