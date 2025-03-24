import React, { useState } from "react";
import "./FeedbackForm.css";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback, rating }),
      });
      if (response.ok) {
        setFeedback("");
        setRating(0);
        setStatus("Feedback submitted successfully!");
      } else {
        setStatus("Error submitting feedback.");
      }
    } catch (error) {
      setStatus("An error occurred.");
    }
  };

  return (
    <div className="feedback-container">
      <h2>Submit Your Feedback</h2>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Your feedback"
          required
        />
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={0}>Rate your experience</option>
          <option value={1}>1 - Very Bad</option>
          <option value={2}>2 - Bad</option>
          <option value={3}>3 - Neutral</option>
          <option value={4}>4 - Good</option>
          <option value={5}>5 - Excellent</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default FeedbackForm;
