import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Trang chủ - công khai */}
                    <Route path="/" element={<Home />} />
                    
                    {/* Trang đăng ký - công khai */}
                    <Route path="/signup" element={<SignUp />} />
                    
                    {/* Trang đăng nhập - công khai */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Trang quản lý user - chỉ cho user đã đăng nhập */}
                    <Route 
                        path="/users" 
                        element={
                            <ProtectedRoute>
                                <UserManagement />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;