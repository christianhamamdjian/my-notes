import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Register, Landing, Error, ProtectedRoute } from './pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Profile,
  SharedLayout,
  Stats,
  AllNotes,
  AddNote
} from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          {/* <Route index element={<Stats />} /> */}
          <Route index element={<AllNotes />} />
          <Route path='all-notes' element={<AllNotes />} />
          <Route path='add-note' element={<AddNote />} />
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='/register' element={<Register />} />
        <Route path='/landing' element={<Landing />} />
        <Route path='*' element={<Error />} />
      </Routes>
      <ToastContainer autoClose={1000} position='top-center' />
    </BrowserRouter>
  );
}

export default App;
