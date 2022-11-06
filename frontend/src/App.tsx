import React from 'react';
import { ToastContainer } from 'react-toastify';

import {
  BrowserRouter as Router,
  Routes, // replaces "Switch" used till v5
  Route,
} from 'react-router-dom';

import Home from './components/views/Tchat';
import Login from './components/views/Login';
import PageNotFound from './components/views/PageNotFound';
import Register from './components/views/Register';

import 'react-toastify/dist/ReactToastify.min.css';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/sign-in" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <ToastContainer />
      </Router>
    </div>
  );
}

export default App;
