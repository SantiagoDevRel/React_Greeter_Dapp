import React, { useState } from 'react'
import {ethers} from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import "./App.css"
const greeterAddress = "0x7119A46134Df276924B4Ff24DcfdF779Cf5BFE59"

function App() {
  const [greeting, setGreetingState] = useState("")

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.getMsj()
        setGreetingState(data)
        console.log('data: ', data)
      } catch (err) {
        console.log('Error: ', err)
      }
    }
  }
  
  async function setGreeting(value) {
    if (!value) return;
    if (!typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setMsj(value)
      await transaction.wait()
      fetchGreeting()
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await setGreeting(event.target.greetingInput.value)
    setGreetingState(event.target.greetingInput.value)
    event.target.greetingInput.value = ""
  }

  return (
    <div className='main'>
      <div className='container-sm text-center'>
        <div className="card">
          <h5 className="card-header">React App</h5>
          <div className="card-body">
            <h5 className="card-title">Get message</h5>
            <button className='btn btn-primary' onClick={fetchGreeting}>Get</button>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Set message</h5>
            <form onSubmit={event=>handleSubmit(event)} className="input-group mb-3">
                <input className="form-control" name="greetingInput" placeholder='Set message here'/>
                <button className="btn btn-primary">Set</button>
              </form>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{greeting}</h5>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default App;
