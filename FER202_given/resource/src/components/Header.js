import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    return (
        <div className="mb-4">
            <Nav variant="tabs" activeKey={location.pathname}>
                <Nav.Item>
                    <Nav.Link as={Link} to="/courses" eventKey="/courses">Courses</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="project">Project</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="review">Review</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="title-confirmation">Title Confirmation</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="reference">Reference</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default Header;
