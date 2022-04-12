import React from "react";
import { Card, Badge, Row, Col } from "react-bootstrap";

function QuestionCard({ question }) {
  return (
    <Card className="mb-2 px-0">
      <Card.Header>
        {question.tags.map((item, index) => (
          <Badge pill bg="secondary" key={index} className="mx-1">
            {item}
          </Badge>
        ))}
      </Card.Header>
      <Card.Body>
        <Card.Title>{question.title}</Card.Title>
        <Row className="mb-3">
          <Col xs={6}>
            <Card>
              <Card.Body> Asked By {question.owner.display_name}</Card.Body>
            </Card>
          </Col>
          <Col xs={6}>
            <Card>
              <Card.Body>
                {question.is_answered ? "Answered" : "Not answered"}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <i className="fa-solid fa-calendar-day"></i> Asked:{" "}
            {new Date(question.creation_date * 1000).toLocaleDateString()}
          </Col>
          <Col>
            <i className="fa-solid fa-calendar-day"></i> Edited:{" "}
            {new Date(question.last_activity_date * 1000).toLocaleDateString()}
          </Col>
          <Col>
            <i className="fa-solid fa-eye"></i> Views: {question.view_count}
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <a href={question.link} className="btn btn-light" target="_blank">
          Source <i className="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </Card.Footer>
    </Card>
  );
}

export default QuestionCard;
