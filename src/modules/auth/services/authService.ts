import { apiCaller } from '@/api/caller/apiCaller';
import { JWT_LOCAL_STORAGE_KEY } from '@/api/constants'; 
import type { AccessTokenDto } from '../api/models/AccessTokenDto';
import type { LoginRequest } from '../api/models/LoginRequest';
import type { RegisterRequest } from '../api/models/RegisterRequest';
import type { UserResponse } from '../api/models/UserResponse';
import { AUTH_LOGIN_ENDPOINT, AUTH_REGISTER_ENDPOINT } from '../api/routes/authApiRoutes';
import { useAuth } from '../hooks/useAuth'; 
import useLocalStorage from '@/modules/core/hooks/useLocalStorage';


export const useAuthService = () => {
  const [_rawToken, setRawToken] = useLocalStorage<string | null>(JWT_LOCAL_STORAGE_KEY, null);
  const zustandLogin = useAuth((state) => state.login);
  const zustandLogout = useAuth((state) => state.logout);

  const register = async (data: RegisterRequest): Promise<UserResponse> => {
    const response = await apiCaller<AccessTokenDto>({
      url: AUTH_REGISTER_ENDPOINT,
      method: 'POST',
      data,
    });
    return response.user_response;
  };

  const login = async (data: LoginRequest): Promise<UserResponse> => {
    const response = await apiCaller<AccessTokenDto>({
      url: AUTH_LOGIN_ENDPOINT,
      method: 'POST',
      data,
    });
    setRawToken(response.access_token);
    zustandLogin(response.user_response); 
    return response.user_response;
  };

  const logout = () => {
    setRawToken(null);
    zustandLogout(); 
  };

  return { register, login, logout };
};