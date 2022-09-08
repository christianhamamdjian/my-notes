import { useEffect, useState } from 'react';
import Loading from './Loading';
import Note from './Note';
import Wrapper from '../assets/wrappers/NotesContainer';
import GridView from '../assets/wrappers/GridView';
import ListView from '../assets/wrappers/ListView';
import PageBtnContainer from './PageBtnContainer';
import { useSelector, useDispatch } from 'react-redux';
import { getAllNotes } from '../features/allNotes/allNotesSlice';
import { BsFillGridFill, BsList } from 'react-icons/bs'

const NotesContainer = () => {
  const [gridView, setGridView] = useState(true);
  const [listView, setListView] = useState(false);
  const {
    notes,
    isLoading,
    page,
    totalNotes,
    search,
    searchStatus,
    searchType,
    sort,
    numOfPages,
  } = useSelector((store) => store.allNotes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllNotes());
    // eslint-disable-next-line
  }, [page, search, searchStatus, searchType, sort]);
  if (isLoading) {
    return <Loading center />;
  }

  if (notes.length === 0) {
    return (
      <Wrapper>
        <h2>No notes to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h5>
        {totalNotes} note{notes.length > 1 && 's'} found
      </h5>
      <div>
        <div className='btn-container'>
          <button
            onClick={() => {
              setListView(false);
              setGridView(true);
            }}
          > <BsFillGridFill />
          </button>
          <button
            onClick={() => {
              setListView(true);
              setGridView(false);
            }}
          ><BsList />
          </button>
        </div>
        {gridView && <GridView><div className='notes'>
          {notes.map((note) => {
            return <Note key={note._id} {...note} />;
          })}
        </div></GridView>}
        {listView && <ListView><div className='notes'>
          {notes.map((note) => {
            return <Note key={note._id} {...note} />;
          })}
        </div></ListView>}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default NotesContainer;
