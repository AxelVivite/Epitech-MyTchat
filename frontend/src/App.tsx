import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";
import Views from './services/navigation/views';
import Login from './components/views/Login';
import Test1 from './components/views/Test1';
import PageNotFound from './components/views/PageNotFound';
import Register from './components/views/Register';

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
