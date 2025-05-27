
export interface AdminUser {
  id: string;
  user_id: string;
  created_at: string;
}

export interface AdminLoginFormData {
  email: string;
  password: string;
}

export interface AdminLoginResult {
  success: boolean;
  userId?: string;
  error?: string;
}
