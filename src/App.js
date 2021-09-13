import React, { useState, useEffect } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import awsExports from './aws-exports'

import { updateDoge } from './graphql/mutations'
import { getDoge } from './graphql/queries'

import './App.css'
Amplify.configure(awsExports)

function App() {
  const [dogePrice, setDogePrice] = useState(0)

  async function fetchDogePrice() {
    try {
      const dogeData = await API.graphql(graphqlOperation(getDoge, { id: '1' }))
      const dogePrice = dogeData.data.getDoge.price
      setDogePrice(dogePrice)
    } catch (err) {
      console.log('error fetching dogePrice')
      console.log(err)
    }
  }
  useEffect(() => {
    fetchDogePrice()
  }, [])

  async function updateDogePrice() {
    try {
      const dogeData = await API.graphql(graphqlOperation(getDoge, { id: '1' }))
      const dogePrice = dogeData.data.getDoge.price + 0.1

      const updateData = { id: '1', price: dogePrice }
      const updateDogePrice = await API.graphql(
        graphqlOperation(updateDoge, { input: updateData })
      )
      setDogePrice(updateDogePrice.data?.updateDoge?.price)
    } catch (err) {
      console.log('error updating dogePrice')
      console.log(err)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dogecoin Price Predictor</h1>
        <p> One Click = 10 cents</p>
        <h2>$ {dogePrice.toFixed(2)}</h2>
        <button onClick={updateDogePrice}>Doge 🚀</button>
      </header>
    </div>
  )
}

export default App
