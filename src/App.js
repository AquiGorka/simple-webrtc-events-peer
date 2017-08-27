import Peer from 'peerjs'
import queryString from 'query-string'
import config from '../config'
import React, { Component } from 'react'
import Hammer from 'hammerjs'
import './App.css'

class App extends Component {
  
  state = { status: '', data: {}, conn: null }

  sendData = ev => {
    const { conn } = this.state
    if (conn) {
      // 2 left, 8 up, 4 right, 16 down
      let dir = 'swipe-down'
      switch(ev.direction){
        case 2:
          dir = 'swipe-left'
          break
        case 4:
          dir = 'swipe-right'
          break
        case 8:
          dir = 'swipe-up'
          break
      }
      // console.log('Sending: ', dir)
      conn.send(dir)
    }
  }

  componentDidMount() {
    this.setState({ status: 'Init' })
    // gestures
    const hammertime = new Hammer(this.refs.app);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    // p2p
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
      hammertime.off('swipe', this.sendData)
      hammertime.on('swipe', this.sendData);
    })
  }

  render() {
    const { status, data } = this.state
    return <div className="App" ref="app">
      {`Status: ${status}; Data: ${JSON.stringify(data)}`}
    </div>
  }
}

export default App
