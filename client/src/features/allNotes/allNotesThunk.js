import customFetch from '../../utils/axios';
import { getTokenFromLocalStorage } from '../../utils/localStorage';

export const getAllNotesThunk = async (thunkAPI) => {
  const { page, search, searchStatus, searchType, sort } =
    thunkAPI.getState().allNotes;

  let url = `/notes?page=${page}&status=${searchStatus}&noteType=${searchType}&sort=${sort}`;
  if (search) {
    url = url + `&search=${search}`;
  }
  try {
    const resp = await customFetch.get(url, {
      headers: {
        authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
    });

    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const deleteNoteThunk = async (noteId, thunkAPI, getAllNotes) => {
  try {
    const resp = await customFetch.delete(`/notes/${noteId}`, {
      headers: {
        authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
    });
    thunkAPI.dispatch(getAllNotes());
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};
