// log
import store from '../store'
import web3 from 'web3'

const fetchDataRequest = () => {
  return {
    type: 'CHECK_DATA_REQUEST',
  }
}

const fetchDataSuccess = (payload) => {
  return {
    type: 'CHECK_DATA_SUCCESS',
    payload: payload,
  }
}

const fetchDataFailed = (payload) => {
  return {
    type: 'CHECK_DATA_FAILED',
    payload: payload,
  }
}

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest())
    try {
      const mintable = await store
        .getState()
        .blockchain.smartContract.methods.mintable()
        .call()

      dispatch(
        fetchDataSuccess({
          mintable,
        })
      )
    } catch (err) {
      console.log(err)
      dispatch(fetchDataFailed('Could not load data from contract.'))
    }
  }
}
