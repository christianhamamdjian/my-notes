import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/user/userSlice';
import noteReducer from './features/note/noteSlice';
import allNotesReducer from './features/allNotes/allNotesSlice';

const rootReducer = {
  user: userReducer,
  note: noteReducer,
  allNotes: allNotesReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});
