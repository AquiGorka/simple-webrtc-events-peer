import Peer from 'peerjs'
import queryString from 'query-string'
import config from '../config'
import React, { Component } from 'react'

class App extends Component {
  
  state = { status: '', data: {}, conn: null }

  sendData() {
    const { conn } = this.state
    setTimeout(() => conn.send('shake'), 1000)
    setTimeout(() => conn.send('swipe-left'), 2000)
    setTimeout(() => conn.send('swipe-right'), 3000)
    setTimeout(() => conn.send('swipe-up'), 4000)
    setTimeout(() => conn.send('swipe-down'), 5000)
  }

  componentDidMount() {
    this.setState({ status: 'Init' })
    const parsed = queryString.parse(location.search)
    const pid = parsed.pid || 'pid'
    let peer
    // to connect
    this.setState({ status: `Connecting to ${pid}` })
    peer = new Peer(config)
    const conn = peer.connect(pid)
    //
    conn.on('open', () => {
      this.setState({ status: 'Connected', conn })
      this.sendData()
    })
  }

  render() {
    const { status, data } = this.state
    return <div className="App">
      {`Status: ${status}; Data: ${JSON.stringify(data)}`}
    </div>
  }
}

export default App
