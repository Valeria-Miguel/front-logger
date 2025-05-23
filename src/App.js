import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Login from "./components/Login";
import LogTable from "./components/LogsTable";
import LogsFilters from "./components/LogsFilters";

import Register from "./components/Register";
import Home from "./components/Home";
import Logs from './components/Logs';
import setupAxiosInterceptors from './api/axiosConfig';

function App() {
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/LogTable" element={<LogTable />} />
        <Route path="/LogsFilters" element={<LogsFilters />} />
      </Routes>
    </Router>
  );
}

export default App;