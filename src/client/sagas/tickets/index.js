/*
 *       .                             .o8                     oooo
 *    .o8                             "888                     `888
 *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
 *    888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
 *    888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
 *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
 *    "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 *  ========================================================================
 *  Author:     Chris Brame
 *  Updated:    2/3/19 11:58 PM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

import { call, put, takeLatest } from 'redux-saga/effects'
import { isUndefined } from 'lodash'
import Log from '../../logger'

import api from '../../api'
import {
  FETCH_SETTINGS,
  CREATE_TICKET_TYPE,
  HIDE_MODAL,
  DELETE_TICKET_TYPE,
  CREATE_PRIORITY,
  DELETE_PRIORITY,
  UPDATE_PRIORITY,
  CREATE_TAG,
  GET_TAGS_WITH_PAGE,
  CREATE_TICKET
} from 'actions/types'

import helpers from 'lib/helpers'

function * createTicket ({ payload }) {
  try {
    const response = yield call(api.tickets.create, payload)
    yield put({ type: CREATE_TICKET.SUCCESS, response })
    yield put({ type: HIDE_MODAL.ACTION })
  } catch (error) {
    const errorText = error.response.data.error
    helpers.UI.showSnackbar(`Error: ${errorText}`, true)
    Log.error(errorText, error.response)
    yield put({ type: CREATE_TICKET.ERROR, error })
  }
}

function * createTicketType ({ payload }) {
  try {
    const response = yield call(api.tickets.createTicketType, payload)
    yield put({ type: CREATE_TICKET_TYPE.SUCCESS, response })
    yield put({ type: HIDE_MODAL.ACTION })
    yield put({ type: FETCH_SETTINGS.ACTION })
  } catch (error) {
    const errorText = error.response.data.error
    helpers.UI.showSnackbar(`Error: ${errorText}`, true)
    Log.error(errorText, error.response)
    yield put({ type: CREATE_TICKET_TYPE.ERROR, error })
  }
}

function * deleteTicketType ({ payload }) {
  try {
    const response = yield call(api.tickets.deleteTicketType, payload)
    yield put({ type: DELETE_TICKET_TYPE.SUCCESS, response })
    yield put({ type: HIDE_MODAL.ACTION })
    yield put({ type: FETCH_SETTINGS.ACTION })
  } catch (error) {
    const errorText = error.response.data.error
    helpers.UI.showSnackbar(`Error: ${errorText}`, true)
    Log.error(errorText, error.response)
    yield put({ type: DELETE_TICKET_TYPE.ERROR, error })
  }
}

function * getTagsWithPage ({ payload }) {
  try {
    const response = yield call(api.tickets.getTagsWithPage, payload)
    yield put({ type: GET_TAGS_WITH_PAGE.SUCCESS, response })
  } catch (error) {
    if (!error.response) return Log.error(error)
    const errorText = error.response.data.error
    helpers.UI.showSnackbar(`Error: ${errorText}`, true)
    yield put({ type: GET_TAGS_WITH_PAGE.ERROR, error })
  }
}

function * createPriority ({ payload }) {
  try {
    const response = yield call(api.tickets.createPriority, payload)
    yield put({ type: CREATE_PRIORITY.SUCCESS, response })
    yield put({ type: HIDE_MODAL.ACTION })
    yield put({ type: FETCH_SETTINGS.ACTION })
  } catch (error) {
    const errorText = error.response.data.error
    helpers.UI.showSnackbar(`Error: ${errorText}`, true)
    Log.error(errorText, error.response)
    yield put({ type: CREATE_PRIORITY.ERROR, error })
  }
}

function * updatePriority ({ payload }) {
  try {
    const response = yield call(api.tickets.updatePriority, payload)
    yield put({ type: UPDATE_PRIORITY.SUCCESS, response })
    yield put({ type: FETCH_SETTINGS.ACTION })
  } catch (error) {
    const errorText = error.response.data.error
    helpers.UI.showSnackbar(`Error: ${errorText}`, true)
    yield put({ type: UPDATE_PRIORITY.ERROR, error })
  }
}

function * deletePriority ({ payload }) {
  try {
    const response = yield call(api.tickets.deletePriority, payload)
    yield put({ type: DELETE_PRIORITY.SUCCESS, response })
    yield put({ type: HIDE_MODAL.ACTION })
    yield put({ type: FETCH_SETTINGS.ACTION })
  } catch (error) {
    const errorText = error.response.data.error
    helpers.UI.showSnackbar(`Error: ${errorText}`, true)
    Log.error(errorText, error.response)
    yield put({ type: DELETE_PRIORITY.ERROR, error })
  }
}

function * createTag ({ payload }) {
  try {
    const response = yield call(api.tickets.createTag, { name: payload.name })
    yield put({ type: CREATE_TAG.SUCCESS, response })
    yield put({ type: HIDE_MODAL.ACTION })
    if (!isUndefined(payload.currentPage)) {
      yield put({ type: GET_TAGS_WITH_PAGE.ACTION, payload: { limit: 16, page: payload.currentPage } })
    }
    helpers.UI.showSnackbar(`Tag ${payload.name} successfully created`)
  } catch (error) {
    if (!error.response) return Log.error(error)
    const errorText = error.response.data.error
    helpers.UI.showSnackbar(`Error: ${errorText}`, true)
    yield put({ type: CREATE_TAG.ERROR, error })
  }
}

export default function * watcher () {
  yield takeLatest(CREATE_TICKET.ACTION, createTicket)
  yield takeLatest(CREATE_TICKET_TYPE.ACTION, createTicketType)
  yield takeLatest(DELETE_TICKET_TYPE.ACTION, deleteTicketType)
  yield takeLatest(CREATE_PRIORITY.ACTION, createPriority)
  yield takeLatest(UPDATE_PRIORITY.ACTION, updatePriority)
  yield takeLatest(DELETE_PRIORITY.ACTION, deletePriority)
  yield takeLatest(GET_TAGS_WITH_PAGE.ACTION, getTagsWithPage)
  yield takeLatest(CREATE_TAG.ACTION, createTag)
}
