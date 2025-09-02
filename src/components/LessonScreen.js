import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Alert, ProgressBar, Badge, Row, Col, Form } from "react-bootstrap";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import lessonData from "../data/lessons.json";

const ItemTypes = { MATCH: "match" };

function DraggableMatch({ id, content }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.MATCH,
    item: { id, content },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id]);

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: 8,
        marginBottom: 8,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: 4,
        cursor: "move"
      }}
    >
      {content}
    </div>
  );
}

function DroppableTerm({ term, assigned, onDrop }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.MATCH,
    drop: (item) => onDrop(term, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [term]);

  return (
    <div
      ref={drop}
      style={{
        minHeight: 60,
        padding: 10,
        marginBottom: 12,
        backgroundColor: isOver ? "#e0f7fa" : "#f8f9fa",
        border: "1px dashed #ccc",
        borderRadius: 4
      }}
    >
      <strong>{term}</strong>
      {assigned && (
        <div className="mt-2 p-2 bg-white border rounded shadow-sm">{assigned.content}</div>
      )}
    </div>
  );
}

export default function LessonScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = lessonData.find((l) => l.id === parseInt(id));

  const [step, setStep] = useState("intro");
  const [stageIndex, setStageIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [matches, setMatches] = useState({});
  const [availableMatches, setAvailableMatches] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [fillInput, setFillInput] = useState("");

  useEffect(() => {
    const storedStage = localStorage.getItem(`lesson-${id}-stage`);
    if (storedStage) {
      setStageIndex(parseInt(storedStage));
    }
  }, [id]);

  const stages = lesson?.stages || [];
  const currentStage = stages[stageIndex];
  const currentQuestion = currentStage?.questions[questionIndex];
  const questionType = currentQuestion?.type || currentStage?.type;
  const totalQuestions = currentStage?.questions.length || 1;
  const totalAllQuestions = stages.reduce((sum, s) => sum + s.questions.length, 0);
  const xpPerQuestion = Math.round((lesson?.xp || 0) / totalAllQuestions);
  const progress = Math.round(((stageIndex + questionIndex / totalQuestions) / stages.length) * 100);

  useEffect(() => {
    if (step === "quiz" && questionType === "match" && currentQuestion?.pairs) {
      const initialMatches = {};
      currentQuestion.pairs.forEach(({ term }) => {
        initialMatches[term] = null;
      });
      setMatches(initialMatches);
      setAvailableMatches(shuffle(currentQuestion.pairs.map(p => ({ id: p.match, content: p.match }))));
    }
  }, [questionIndex, stageIndex, step]);

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const handleDropMatch = (term, item) => {
    setMatches(prev => ({ ...prev, [term]: item }));
    setAvailableMatches(prev => prev.filter(m => m.id !== item.id));
  };

  const checkMatchAnswers = () => {
    const correctPairs = currentQuestion.pairs || [];
    const allCorrect = correctPairs.every(({ term, match }) => matches[term]?.content === match);
    setIsCorrect(allCorrect);
    if (allCorrect) {
      setScore(prev => prev + 1);
      setEarnedXP(prev => prev + xpPerQuestion);
    }
    setShowFeedback(true);
  };

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
  
    let correct = false;
  
    if (questionType === "truefalse") {
      const normalizedAnswer = currentQuestion.answer === true ? "True" : "False";
      correct = option === normalizedAnswer;
    } else {
      correct = option === currentQuestion.answer;
    }
  
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
      setEarnedXP((prev) => prev + xpPerQuestion);
    }
    setShowFeedback(true);
  };
  

  const handleFillSubmit = () => {
    const userAnswer = (fillInput || '').trim().toLowerCase();
    const correctAnswer = (currentQuestion?.answer || '').trim().toLowerCase();
  
    const correct = userAnswer === correctAnswer;
  
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
      setEarnedXP((prev) => prev + xpPerQuestion);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setMatches({});
    setAvailableMatches([]);
    setSelectedAnswer(null);
    setFillInput("");
    setIsCorrect(null);

    if (questionIndex < totalQuestions - 1) {
      // Move to the next question in current stage
      setQuestionIndex(prev => prev + 1);
    } else if (stageIndex < stages.length - 1) {
      // ✅ Move to next stage
      setStageIndex(prev => prev + 1);
      setQuestionIndex(0);
      localStorage.setItem(`lesson-${id}-stage`, stageIndex + 1);
    } else {
      // ✅ Lesson finished
      setStep("summary");
    }
  };

  const formatType = (type) => {
    switch(type) {
      case "multiple": return "Multiple Choice";
      case "truefalse": return "True or False";
      case "fill": return "Fill in the Blank";
      case "match": return "Matching";
      default: return "Quiz";
    }
  };

  return (
    <div className="container py-4">
      <Card className="p-4 shadow">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="mb-0">{lesson.title}</h4>
          <Badge bg="warning" text="dark">⭐ {lesson.xp} XP</Badge>
        </div>
        <ProgressBar now={progress} label={`${progress}%`} className="mb-3" />

        {step === "intro" && (
          <>
            <p className="text-muted">{lesson.intro}</p>
            <Button onClick={() => setStep("explanation")} variant="primary">Continue</Button>
          </>
        )}

        {step === "explanation" && (
          <>
            <p className="text-muted small">{lesson.explanation}</p>
            <Button onClick={() => setStep("quiz")} variant="primary">Start Quiz</Button>
          </>
        )}

        {step === "quiz" && currentQuestion && (
          <>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-primary mb-3">Question Type: {formatType(questionType)}</h6>
              <span className="text-muted">Question {questionIndex + 1} of {totalQuestions}</span>
            </div>

            {questionType === "match" && (
              <DndProvider backend={HTML5Backend}>
                <Row>
                  <Col md={6}>
                    {currentQuestion.pairs.map(({ term }) => (
                      <DroppableTerm
                        key={term}
                        term={term}
                        assigned={matches[term]}
                        onDrop={handleDropMatch}
                      />
                    ))}
                  </Col>
                  <Col md={6}>
                    <h6>Available Matches</h6>
                    {availableMatches.map((item) => (
                      <DraggableMatch key={item.id} id={item.id} content={item.content} />
                    ))}
                  </Col>
                </Row>
                <Button className="mt-3" onClick={checkMatchAnswers} disabled={Object.values(matches).some(v => !v)}>
                  Submit Matches
                </Button>
              </DndProvider>
            )}

            {(questionType === "multiple" || questionType === "truefalse") && (
              <div>
                <h5>{currentQuestion.text}</h5>
                {currentQuestion.hint && <p className="text-muted">Hint: {currentQuestion.hint}</p>}
                {(currentQuestion.options || ["True", "False"]).map((option) => (
                  <Button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    variant={selectedAnswer === option ? "primary" : "outline-secondary"}
                    className="d-block my-2"
                    disabled={showFeedback}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {questionType === "fill" && (
              <div>
                <h5>{currentQuestion.text}</h5>
                {currentQuestion.hint && <p className="text-muted">Hint: {currentQuestion.hint}</p>}
                <Form.Control
                  type="text"
                  placeholder="Type your answer..."
                  value={fillInput}
                  onChange={(e) => setFillInput(e.target.value)}
                  className="my-2"
                  disabled={showFeedback}
                />
                <Button onClick={handleFillSubmit} disabled={showFeedback || !fillInput.trim()}>
                  Submit Answer
                </Button>
              </div>
            )}

            {showFeedback && (
              <>
                <Alert variant={isCorrect ? "success" : "danger"} className="mt-3">
                  {isCorrect ? "✅ Correct!" : `❌ Incorrect. The correct answer is "${currentQuestion.answer}".`}
                </Alert>
                <Button className="mt-2" onClick={handleNextQuestion}>Next</Button>
              </>
            )}
          </>
        )}

        {step === "summary" && (
          <div className="text-center">
            <h4 className="mb-3">🎉 Lesson Complete!</h4>
            <p>You answered {score} questions correctly.</p>
            <p><strong>Total XP Earned:</strong> ⭐ {earnedXP} XP</p>
            <Button variant="primary" onClick={() => navigate("/map")}>Back to Skill Tree</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
