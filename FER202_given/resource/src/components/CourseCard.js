import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/detail/${course.id}`);
    };

    return (
        <Card onClick={handleClick} style={{ cursor: 'pointer', height: '100%' }} className="shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">
                        <Badge bg="secondary" className="me-2">
                            {course.badge}
                        </Badge>
                        {course.code}
                    </Card.Title>
                    <Badge bg="info">{course.category}</Badge>
                </div>
                <Card.Text className="mb-1 fw-bold">{course.nameEn}</Card.Text>
                <Card.Text className="text-muted small">{course.nameVi}</Card.Text>
                <Button variant="outline-primary" size="sm" className="mt-2" onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}>
                    Get started
                </Button>
            </Card.Body>
        </Card>
    );
};

export default CourseCard;
