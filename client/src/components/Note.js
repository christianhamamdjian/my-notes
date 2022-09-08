import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Note';
import NoteInfo from './NoteInfo';
import { useDispatch } from 'react-redux';
import { deleteNote } from '../features/allNotes/allNotesSlice';
import { setEditNote } from '../features/note/noteSlice';
const Note = ({
  _id,
  title,
  content,
  noteLocation,
  category,
  createdAt,
  status,
}) => {
  const dispatch = useDispatch();
  let date = moment(createdAt);
  date = date.format('MMM Do, YYYY');

  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{content.charAt(0)}</div>
        <div className='info'>
          <h5>{title}</h5>
          <p>{content}</p>
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          <NoteInfo icon={<FaLocationArrow />} text={noteLocation} />
          <NoteInfo icon={<FaCalendarAlt />} text={date} />
          <NoteInfo icon={<FaBriefcase />} text={category} />
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className='actions'>
            <Link
              to='/add-note'
              className='btn edit-btn'
              onClick={() => {
                dispatch(
                  setEditNote({
                    editNoteId: _id,
                    title,
                    content,
                    noteLocation,
                    category,
                    status,
                  })
                );
              }}
            >
              Edit
            </Link>
            <button
              type='button'
              className='btn delete-btn'
              onClick={() => {
                dispatch(deleteNote(_id));
              }}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Note;
