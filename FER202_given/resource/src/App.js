import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/courses" />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/detail/:id" element={<CourseDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;