import api from "@/services/api";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "apusfly_access_token";

export type AccountType = "customer" | "pilot";

export interface ApusFlyUser {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: "active" | "suspended" | "deactivated";
  email_verified_at: string | null;
  profile_photo_path: string | null;
  roles: string[];
  permissions: string[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
}

interface AuthResult {
  user: ApusFlyUser;
  token: string;
  token_type: "Bearer";
}

export interface RegisterPayload {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  phone?: string | null;
  password: string;
  password_confirmation: string;
  account_type: AccountType;
}

export const authService = {
  async register(payload: RegisterPayload) {
    const response = await api.post<ApiResponse<ApusFlyUser>>(
      "/auth/register",
      payload,
    );

    return response.data.data;
  },

  async login(email: string, password: string) {
    const response = await api.post<ApiResponse<AuthResult>>("/auth/login", {
      email,
      password,
    });

    const result = response.data.data;

    await SecureStore.setItemAsync(TOKEN_KEY, result.token);

    return result.user;
  },

  async googleLogin(idToken: string) {
    const response = await api.post<
      ApiResponse<AuthResult & { is_new_user: boolean }>
    >("/auth/google", {
      id_token: idToken,
    });

    const result = response.data.data;

    await SecureStore.setItemAsync(TOKEN_KEY, result.token);

    return result;
  },

  async me() {
    const response = await api.get<ApiResponse<ApusFlyUser>>("/auth/me");

    return response.data.data;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  },

  async getToken() {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
};
