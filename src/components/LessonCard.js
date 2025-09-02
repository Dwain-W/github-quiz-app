import React from "react";
import { Card, Badge, ProgressBar } from "react-bootstrap";
import { FaLock, FaUnlock, FaCheckCircle } from "react-icons/fa";

export default function LessonCard({ lesson, onClick }) {
  const getDifficultyVariant = (level) => {
    switch (level.toLowerCase()) {
      case "easy": return "success";
      case "medium": return "warning";
      case "hard": return "danger";
      default: return "secondary";
    }
  };

  return (
    <Card
      onClick={onClick}
      style={{ width: "16rem", cursor: lesson.unlocked ? "pointer" : "not-allowed", transition: "transform 0.2s" }}
      className={`lesson-card p-3 shadow ${lesson.unlocked ? "border-success" : "border-secondary"}`}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
          {lesson.unlocked ? (
            <FaUnlock size={18} className="text-success" />
          ) : (
            <FaLock size={18} className="text-muted" />
          )}
          {lesson.completed && <FaCheckCircle size={18} className="text-primary" title="Completed" />}
        </div>
        <Badge bg={getDifficultyVariant(lesson.difficulty)}>{lesson.difficulty}</Badge>
      </div>

      <h6 className="fw-bold mb-2">{lesson.title}</h6>
      <p className="text-muted small">{lesson.description}</p>

      {lesson.progress !== undefined && lesson.progress < 100 && (
        <ProgressBar now={lesson.progress} label={`${lesson.progress}%`} className="mb-2" />
      )}

      <div className="text-end">
        <Badge bg="warning" text="dark">⭐ {lesson.xp} XP</Badge>

        {lesson.progress !== undefined && (
            <ProgressBar
                now={lesson.progress}
                label={`${lesson.progress}%`}
                className="mt-2"
            />
            )}

      </div>
    </Card>
  );
}
