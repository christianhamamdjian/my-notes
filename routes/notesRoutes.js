import express from 'express'
const router = express.Router()

import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
  showStats,
} from '../controllers/notesController.js'

router.route('/').post(createNote).get(getAllNotes)
// remember about :id
router.route('/stats').get(showStats)
router.route('/:id').delete(deleteNote).patch(updateNote)

export default router
