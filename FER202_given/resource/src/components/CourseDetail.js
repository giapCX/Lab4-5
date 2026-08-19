import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Button,
  ListGroup,
  Card,
  Badge,
} from "react-bootstrap";
import axios from "axios";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSlotNumber, setSelectedSlotNumber] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/courses/${id}`);
        setCourse(response.data);
        if (response.data.classes && response.data.classes.length > 0) {
          setSelectedClassId(response.data.classes[0].classId);
          if (
            response.data.classes[0].slots &&
            response.data.classes[0].slots.length > 0
          ) {
            setSelectedSlotNumber(response.data.classes[0].slots[0].slotNumber);
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    fetchCourse();
  }, [id]);

  if (!course)
    return (
      <Container className="mt-4">
        <p>Loading...</p>
      </Container>
    );

  const selectedClass = course.classes?.find(
    (c) => c.classId === selectedClassId,
  );
  const selectedSlot = selectedClass?.slots?.find(
    (s) => s.slotNumber === selectedSlotNumber,
  );

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split("/");
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
    );
  };

  const isPresentOrFuture = (dateStr) => {
    const slotDate = parseDate(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return slotDate >= today;
  };

  const handleToggleStatus = async () => {
    setErrorMsg(""); // Clear previous error
    if (!selectedClass) return;

    if (selectedClass.status === "active") {
      const hasFutureSlots = selectedClass.slots?.some((slot) =>
        isPresentOrFuture(slot.date),
      );
      if (hasFutureSlots) {
        setErrorMsg(
          "All slots must be completed in the past to close the class.",
        );
        return;
      }
    }

    const newStatus = selectedClass.status === "active" ? "inactive" : "active";
    const updatedClasses = course.classes.map((c) =>
      c.classId === selectedClassId ? { ...c, status: newStatus } : c,
    );

    try {
      await axios.patch(`http://localhost:9000/courses/${id}`, {
        classes: updatedClasses,
      });
      setCourse({ ...course, classes: updatedClasses });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteQuestions = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete questions/assignments for this slot?",
      )
    ) {
      if (!selectedClass || !selectedSlot) return;

      const updatedClasses = course.classes.map((c) => {
        if (c.classId === selectedClassId) {
          return {
            ...c,
            slots: c.slots.map((s) => {
              if (s.slotNumber === selectedSlotNumber) {
                return { ...s, questions: [], assignments: [] };
              }
              return s;
            }),
          };
        }
        return c;
      });

      try {
        await axios.patch(`http://localhost:9000/courses/${id}`, {
          classes: updatedClasses,
        });
        setCourse({ ...course, classes: updatedClasses });
      } catch (error) {
        console.error("Error deleting questions:", error);
      }
    }
  };

  return (
    <Container className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/courses")}>
          Courses
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{course.code}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="mb-4">
        <div>
          <h2>
            {course.nameEn} ({course.code})
          </h2>
          <h5 className="text-muted">Selected Class: {selectedClass?.name}</h5>
        </div>
        <div className="d-flex justify-content-start gap-2 mt-3">
          <Button 
            variant="light" 
            onClick={() => navigate("/courses")} 
            style={{ backgroundColor: '#f0f0f0', borderColor: '#dcdcdc' }}
          >
            Back to Courses
          </Button>
          <Button 
            variant="light" 
            onClick={handleDeleteQuestions} 
            style={{ backgroundColor: '#f0f0f0', borderColor: '#dcdcdc' }}
          >
            Delete Questions
          </Button>
          <Button
            variant={selectedClass?.status === "active" ? "warning" : "success"}
            onClick={handleToggleStatus}
          >
            {selectedClass?.status === "active" ? "Close" : "Open"}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      <Row>
        <Col md={3}>
          <h5>Classes</h5>
          <ListGroup className="mb-4">
            {course.classes?.map((cls) => (
              <ListGroup.Item
                key={cls.classId}
                action
                active={cls.classId === selectedClassId}
                onClick={() => {
                  setSelectedClassId(cls.classId);
                  if (cls.slots && cls.slots.length > 0) {
                    setSelectedSlotNumber(cls.slots[0].slotNumber);
                  } else {
                    setSelectedSlotNumber(null);
                  }
                }}
              >
                {cls.name}{" "}
                <Badge bg={cls.status === "active" ? "success" : "secondary"}>
                  {cls.status}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <h5>Slots</h5>
          <ListGroup>
            {selectedClass?.slots?.map((slot) => (
              <ListGroup.Item
                key={slot.slotNumber}
                action
                active={slot.slotNumber === selectedSlotNumber}
                onClick={() => setSelectedSlotNumber(slot.slotNumber)}
              >
                Slot {slot.slotNumber} - {slot.date}
              </ListGroup.Item>
            ))}
            {(!selectedClass?.slots || selectedClass.slots.length === 0) && (
              <p className="text-muted">No slots available</p>
            )}
          </ListGroup>
        </Col>

        <Col md={9}>
          <h5>Class Sesions</h5>
          {selectedSlot ? (
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-0">
                       {selectedSlot.slotNumber}: {selectedSlot.title}
                    </h5>
                    <div className="d-flex align-items-center mt-2 gap-4">
                      <p className="mb-0">
                        <strong></strong> {selectedSlot.date}
                      </p>
                      <p className="mb-0">
                        <strong></strong> {selectedSlot.time}
                      </p>
                    </div>
                  </div>
                 
                </div>
              </Card.Header>
              
              <Card.Body>
                <h6 className="mt-4">Questions / Assignments:</h6>
                {selectedSlot.questions && selectedSlot.questions.length > 0 ? (
                  <ul>
                    {selectedSlot.questions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                ) : selectedSlot.assignments &&
                  selectedSlot.assignments.length > 0 ? (
                  <ul>
                    {selectedSlot.assignments.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">
                    No questions or assignments for this slot.
                  </p>
                )}
              </Card.Body>
            </Card>
          ) : (
            <div className="text-center mt-5 text-muted">
              <p>Select a slot to view details.</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetail;
