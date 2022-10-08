import React from 'react';

import {
  BrowserRouter as Router,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";

import Login from './components/views/Login';
import Test1 from './components/views/Tchat';
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
          <Route path='/test' element={<Test1/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
