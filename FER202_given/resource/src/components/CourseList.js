import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import Header from './Header';
import CourseCard from './CourseCard';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [semesters, setSemesters] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:9000/courses');
            setCourses(response.data);
            const uniqueSemesters = [...new Set(response.data.map(c => c.semester))].filter(Boolean);
            setSemesters(uniqueSemesters);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = 
            (course.code && course.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (course.nameEn && course.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (course.nameVi && course.nameVi.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesSemester = selectedSemester === '' || course.semester === selectedSemester;
        
        return matchesSearch && matchesSemester;
    });

    return (
        <Container className="mt-3">
            <Header />
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="text-muted">Welcome back, lecturer</h5>
                    <h2>My courses</h2>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Form.Select 
                        value={selectedSemester} 
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        style={{ width: '200px' }}
                    >
                        <option value="">All Semesters</option>
                        {semesters.map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                        ))}
                    </Form.Select>
                    <Button variant="primary" onClick={fetchData}>Refresh</Button>
                </div>
            </div>

            <Row className="mb-4">
                <Col md={6}>
                    <InputGroup>
                        <Form.Control
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={6} className="d-flex align-items-center">
                    <span className="text-muted">{filteredCourses.length} courses</span>
                </Col>
            </Row>

            <Row>
                {filteredCourses.map(course => (
                    <Col key={course.id} lg={3} md={4} sm={6} className="mb-4">
                        <CourseCard course={course} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CourseList;
