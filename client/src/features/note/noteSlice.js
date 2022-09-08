import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';
import { getUserFromLocalStorage } from '../../utils/localStorage';
import { getTokenFromLocalStorage } from '../../utils/localStorage';

const initialState = {
  isLoading: false,
  title: '',
  content: '',
  noteLocation: getUserFromLocalStorage()?.location || '',
  categoryOptions: ['info', 'reminder', 'note', 'fun'],
  category: 'info',
  statusOptions: ['action', 'urgent', 'todo'],
  status: 'todo',
  isEditing: false,
  editNoteId: '',
};

export const createNote = createAsyncThunk(
  'note/createNote',
  async (note, thunkAPI) => {
    try {
      const resp = await customFetch.post('/notes', note, {
        headers: {
          authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      });
      thunkAPI.dispatch(clearValues());
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);
export const editNote = createAsyncThunk(
  'note/editNote',
  async ({ noteId, note }, thunkAPI) => {
    try {
      const resp = await customFetch.patch(`/notes/${noteId}`, note, {
        headers: {
          authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      });
      thunkAPI.dispatch(clearValues());
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => {
      return {
        ...initialState,
        noteLocation: getUserFromLocalStorage()?.location || '',
      };
    },
    setEditNote: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },
  extraReducers: {
    [createNote.pending]: (state) => {
      state.isLoading = true;
    },
    [createNote.fulfilled]: (state, action) => {
      state.isLoading = false;
      toast.success('Note Created');
    },
    [createNote.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [editNote.pending]: (state) => {
      state.isLoading = true;
    },
    [editNote.fulfilled]: (state) => {
      state.isLoading = false;
      toast.success('Note Modified...');
    },
    [editNote.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { handleChange, clearValues, setEditNote } = noteSlice.actions;

export default noteSlice.reducer;
