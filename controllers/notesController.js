import Note from '../models/Note.js'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import mongoose from 'mongoose'
import moment from 'moment'
const createNote = async (req, res) => {
  const { title, content } = req.body

  if (!title || !content) {
    throw new BadRequestError('Please provide all values')
  }
  req.body.createdBy = req.user.userId
  const note = await Note.create(req.body)
  res.status(StatusCodes.CREATED).json({ note })
}
const getAllNotes = async (req, res) => {
  const { status, noteType, sort, search } = req.query

  const queryObject = {
    createdBy: req.user.userId,
  }
  // add stuff based on condition

  if (status && status !== 'all') {
    queryObject.status = status
  }
  if (noteType && noteType !== 'all') {
    queryObject.noteType = noteType
  }
  if (search) {
    queryObject.title = { $regex: search, $options: 'i' }
  }
  // NO AWAIT

  let result = Note.find(queryObject)

  // chain sort conditions

  if (sort === 'latest') {
    result = result.sort('-createdAt')
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt')
  }
  if (sort === 'a-z') {
    result = result.sort('title')
  }
  if (sort === 'z-a') {
    result = result.sort('-title')
  }

  //

  // setup pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const notes = await result

  const totalNotes = await Note.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalNotes / limit)

  res.status(StatusCodes.OK).json({ notes, totalNotes, numOfPages })
}
const updateNote = async (req, res) => {
  const { id: noteId } = req.params
  const { content, title } = req.body

  if (!title || !content) {
    throw new BadRequestError('Please provide all values')
  }
  const note = await Note.findOne({ _id: noteId })

  if (!note) {
    throw new NotFoundError(`No note with id :${noteId}`)
  }
  // check permissions

  checkPermissions(req.user, note.createdBy)

  const updatedNote = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(StatusCodes.OK).json({ updatedNote })
}
const deleteNote = async (req, res) => {
  const { id: noteId } = req.params

  const note = await Note.findOne({ _id: noteId })

  if (!note) {
    throw new NotFoundError(`No note with id :${noteId}`)
  }

  checkPermissions(req.user, note.createdBy)

  await note.remove()

  res.status(StatusCodes.OK).json({ msg: 'Success! Note removed' })
}
const showStats = async (req, res) => {
  let stats = await Note.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr
    acc[title] = count
    return acc
  }, {})

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  }

  let monthlyApplications = await Note.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ])
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y')
      return { date, count }
    })
    .reverse()

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

export { createNote, deleteNote, getAllNotes, updateNote, showStats }
