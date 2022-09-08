import { FormRow, FormRowSelect, FormRowContent } from '../../components';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearValues,
  handleChange,
  createNote,
  editNote,
} from '../../features/note/noteSlice';
import { toast } from 'react-toastify';
const AddNote = () => {
  const {
    isLoading,
    title,
    content,
    noteLocation,
    category,
    categoryOptions,
    status,
    statusOptions,
    isEditing,
    editNoteId,
  } = useSelector((store) => store.note);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !content || !noteLocation) {
      toast.error('Please Fill Out All Fields');
      return;
    }
    if (isEditing) {
      dispatch(
        editNote({
          noteId: editNoteId,
          note: {
            title,
            content,
            noteLocation,
            category,
            status,
          },
        })
      );
      return;
    }
    dispatch(createNote({ title, content, noteLocation, category, status }));
  };
  const handleNoteInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(handleChange({ name, value }));
  };

  return (
    <Wrapper>
      <form className='form'>
        <h4>{isEditing ? 'edit note' : 'add note'}</h4>

        <div className='form-center'>
          {/* title */}
          <FormRow
            type='text'
            name='title'
            value={title}
            handleChange={handleNoteInput}
          />
          {/* location */}
          <FormRow
            type='text'
            labelText='note location'
            name='noteLocation'
            value={noteLocation}
            handleChange={handleNoteInput}
          />
          {/* note status */}
          <FormRowSelect
            name='status'
            value={status}
            handleChange={handleNoteInput}
            list={statusOptions}
          />
          {/* content */}
          <FormRowContent
            name='content'
            value={content}
            handleChange={handleNoteInput}
          />
          {/* note category */}
          <FormRowSelect
            name='category'
            labelText='category'
            value={category}
            handleChange={handleNoteInput}
            list={categoryOptions}
          />
          {/* btn container */}
          <div className='btn-container'>
            <button
              type='button'
              className='btn btn-block clear-btn'
              onClick={() => dispatch(clearValues())}
            >
              clear
            </button>
            <button
              type='submit'
              className='btn btn-block submit-btn'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddNote;
