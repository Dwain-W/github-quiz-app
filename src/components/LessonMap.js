import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Alert, ProgressBar, Badge } from "react-bootstrap";
import lessonData from "../data/lessons.json";

export default function LessonMap() {
  const navigate = useNavigate();

  const handleResetAllProgress = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("lesson-") && key.endsWith("-stage")) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Skill Tree</h2>
      <div className="row">
        {lessonData.map((lesson) => (
          <div className="col-md-4 mb-3" key={lesson.id}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{lesson.title}</Card.Title>
                <Card.Text>{lesson.description}</Card.Text>
                <Button onClick={() => navigate(`/lesson/${lesson.id}`)} variant="primary">
                  Start Lesson
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <Button
          variant="outline-danger"
          size="sm"
          onClick={handleResetAllProgress}
        >
          🔄 Reset All Lesson Progress (Dev Only)
        </Button>
      </div>
    </div>
  );
} 
