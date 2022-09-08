import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';
import {
  addUserToLocalStorage,
  removeUserFromLocalStorage,
  getUserFromLocalStorage,
  getTokenFromLocalStorage,
  getUserLocationFromLocalStorage
} from '../../utils/localStorage';
import { clearAllNotesState } from '../allNotes/allNotesSlice';
import { clearValues, handleChange } from '../note/noteSlice';
const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
  token: getTokenFromLocalStorage(),
  location: getUserLocationFromLocalStorage()
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.post('/auth/register', user);
      thunkAPI.dispatch(
        handleChange({ name: 'noteLocation', value: resp.data.user.location })
      );

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.post('/auth/login', user);
      thunkAPI.dispatch(
        handleChange({ name: 'noteLocation', value: resp.data.user.location })
      );

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.patch('/auth/updateUser', user, {
        headers: {
          authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      });
      thunkAPI.dispatch(
        handleChange({ name: 'noteLocation', value: resp.data.user.location })
      );

      return resp.data;
    } catch (error) {
      console.log(error.response);
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const logoutUserStore = createAsyncThunk(
  'user/logoutUserStore',
  async (_, thunkAPI) => {
    try {
      // logout user
      thunkAPI.dispatch(logoutUser());
      return Promise.resolve();
    } catch (error) {
      // console.log(error);
      return Promise.reject();
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isSidebarOpen = false;
      removeUserFromLocalStorage();
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      const { user, token, location } = payload;
      state.isLoading = false;
      state.user = user;
      state.token = token;
      state.location = location;

      addUserToLocalStorage(user, token, location);
      toast.success(`Hello There ${user.name}`);
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [loginUser.pending]: (state) => {
      state.isLoading = true;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      const { user, token, location } = payload;
      state.isLoading = false;
      state.user = user;
      state.token = token;
      state.location = location;

      addUserToLocalStorage(user, token, location);
      toast.success(`Welcome Back ${user.name}`);
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [updateUser.pending]: (state) => {
      state.isLoading = true;
    },
    [updateUser.fulfilled]: (state, { payload }) => {
      const { user, token, location } = payload;
      state.isLoading = false;
      state.user = user;
      state.token = token;
      state.location = location;

      addUserToLocalStorage(user, token, location);
      toast.success('User Updated');
    },
    [updateUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [logoutUserStore.fulfilled]: () => {
      toast.success('Logout Successful!');
    },
    [logoutUserStore.rejected]: () => {
      toast.error('There was an error...');
    },
  },
});

export const { logoutUser, toggleSidebar } = userSlice.actions;
export default userSlice.reducer;
