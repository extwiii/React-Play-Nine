import React, { Component } from 'react';
import { Game } from './Game.js';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
  render() {
    return (
      <div >
        <h1 className='text-center'>  Play Nine </h1>
        <br />
        <Game />
      </div>
    );
  }
}

export default App;
