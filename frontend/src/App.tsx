import React from 'react';

import {
  BrowserRouter as Router,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";

import Home from './components/views/Tchat';
import Login from './components/views/Login';
import PageNotFound from './components/views/PageNotFound';
import Register from './components/views/Register';

import './App.scss';
import './MuiOverride.scss';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
