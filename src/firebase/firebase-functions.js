import { auth } from './index'
import { LocalStorage } from 'quasar'

const fetchData = async (endpoint) => {
  try {
    // const platform = 'MetaTrader4' // TODO: add more platforms
    const savedBrokerId = LocalStorage.getItem('selectedBrokerId')

    const user = LocalStorage.getItem('user')
    const authToken = await auth.currentUser?.getIdToken() ?? user?.stsTokenManager?.accessToken

    const response = await fetch(`${process.env.BASE_URL}/${endpoint}?platformId=${savedBrokerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken
      }
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    throw error
  }
}

export const getTrades = async () => {
  return fetchData('getTrades')
}

export const getCalendar = async () => {
  return fetchData('getCalendar')
}