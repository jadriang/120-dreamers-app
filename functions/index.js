const functions = require('firebase-functions')
const getTradesModule = require('./getTrades')
const getCalendarModule = require('./getCalendar')

const logger = require('firebase-functions/logger')
const admin = require('firebase-admin')
const cors = require('cors')
admin.initializeApp()

const firestore = admin.firestore()

const corsHandler = cors({ origin: true })

const globalConnection = {} // Declare the global variable to store the connection

async function getGlobalConnection (token, accountId, uid) {
  if (globalConnection[uid]) {
    return globalConnection[uid] // If a connection already exists, return it
  }

  const MetaApi = require('metaapi.cloud-sdk').default
  const metaApi = new MetaApi(token)
  const account = await metaApi.metatraderAccountApi.getAccount(accountId)

  await account.waitConnected()
  globalConnection[uid] = account.getRPCConnection()

  await globalConnection[uid].connect()
  await globalConnection[uid].waitSynchronized()

  return globalConnection[uid]
}

exports.getTrades = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    getTradesModule.handler(req, res, logger, admin, firestore, getGlobalConnection)
  })
})

exports.getCalendar = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    getCalendarModule.handler(req, res, logger, admin, firestore, getGlobalConnection)
  })
})
