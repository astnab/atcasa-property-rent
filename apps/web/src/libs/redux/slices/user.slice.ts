// import { User } from '@/models/user.model';
import { initialUser } from '../initial';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// import { deleteCookie } from 'cookies-next';
import { Dispatch } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axios.config';
// import { login } from '../slices/user.slice';
import { User, UserLoginPayload } from '@/models/user.model';
import { setAuthCookie } from '@/libs/cookie';
import { deleteCookie, getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

export const userSlice = createSlice({
  name: 'auth',
  initialState: initialUser as User | null,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      return { ...state, ...action.payload };
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state) {
        return { ...state, ...action.payload };
      }
      return state;
    },
    logout: (state) => {
      deleteCookie('access_token', {
        domain: 'purwadhikabootcamp.com',
        sameSite: 'strict',
        secure: true,
      });
      deleteCookie('refresh_token', {
        domain: 'purwadhikabootcamp.com',
        sameSite: 'strict',
        secure: true,
      });
      return initialUser;
    },
  },
});

export const keepLogin = () => {
  return async (dispatch: Dispatch) => {
    try {
      const token = getCookie('access_token');
      if (token) {
        // dispatch(login(jwtDecode(token)));
        const decodedToken = jwtDecode<UserLoginPayload>(token);
        dispatch(login(decodedToken.user));
      }
    } catch (err: any) {
      deleteCookie('access_token', {
        domain: 'purwadhikabootcamp.com',
        sameSite: 'strict',
        secure: true,
      });
      console.error('Error in keepLogin:', err.message);
    }
  };
};

export const { login, updateProfile, logout } = userSlice.actions;
export default userSlice.reducer;
