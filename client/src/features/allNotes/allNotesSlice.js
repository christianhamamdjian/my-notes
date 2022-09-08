import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';
import { deleteNoteThunk, getAllNotesThunk } from './allNotesThunk';
import { getTokenFromLocalStorage } from '../../utils/localStorage';


const initialFiltersState = {
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
};

const initialState = {
  isLoading: false,
  notes: [],
  totalNotes: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  ...initialFiltersState,
};

export const getAllNotes = createAsyncThunk('allNotes/getNotes', (_, thunkAPI) => {
  return getAllNotesThunk(thunkAPI);
});

export const deleteNote = createAsyncThunk(
  'allNotes/deleteNote',
  async (noteId, thunkAPI) => {
    return deleteNoteThunk(noteId, thunkAPI, getAllNotes);
  }
);

export const showStats = createAsyncThunk(
  'allNotes/showStats',
  async (_, thunkAPI) => {
    try {
      const resp = await customFetch.get('/notes/stats', {
        headers: {
          authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      });

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const allNotesSlice = createSlice({
  name: 'allNotes',
  initialState,
  reducers: {
    changePage: (state, { payload }) => {
      state.page = payload;
    },
    handleChange: (state, { payload: { name, value } }) => {
      state.page = 1;
      state[name] = value;
    },
    clearFilters: (state) => {
      return { ...state, ...initialFiltersState };
    },
    clearAllNotesState: () => initialState,
  },
  extraReducers: {
    [getAllNotes.pending]: (state) => {
      state.isLoading = true;
    },
    [getAllNotes.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.notes = payload.notes;
      state.numOfPages = payload.numOfPages;
      state.totalNotes = payload.totalNotes;
    },
    [getAllNotes.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [deleteNote.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteNote.fulfilled]: (state, action) => {
      state.isLoading = false;
      toast.success('Note Removed');
    },
    [deleteNote.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [showStats.pending]: (state) => {
      state.isLoading = true;
    },
    [showStats.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.stats = payload.defaultStats;
      state.monthlyApplications = payload.monthlyApplications;
    },
    [showStats.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { changePage, handleChange, clearFilters, clearAllNotesState } =
  allNotesSlice.actions;

export default allNotesSlice.reducer;
