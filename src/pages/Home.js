import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="container text-center py-5">
      <h1>Welcome to Skill Stacks</h1>
      <Button onClick={() => navigate("/map")}>Go to Skill Tree</Button>
    </div>
  );
}
