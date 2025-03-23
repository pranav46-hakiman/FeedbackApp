import React, { useState } from "react";

const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [sentimentLabel, setSentimentLabel] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, feedback }),
      });

      const responseData = await response.json();
      if (response.ok) {
        setMessage(`Thank you for your feedback, ${name}!`);
        setSentimentLabel(responseData.sentimentLabel);
        setName("");
        setEmail("");
        setPhone("");
        setFeedback("");
      } else {
        setMessage(responseData.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage("Error submitting feedback. Please try again.");
    }
  };

  const getSentimentColor = (label) => { //Further enhancement
    switch (label) {
      case "Positive":
        return "#4caf50"; // Green
      case "Neutral":
        return "#ffa726"; // Orange
      case "Negative":
        return "#e53935"; // Red
      default:
        return "#757575"; // Gray
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundImage: "url('https://centralcityconcern.org/wp-content/uploads/Top-Docs-image-choice-2.png')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        margin: "0",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        color: "white",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "15px",
          width: "100%",
          textAlign: "center",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "28px",
          letterSpacing: "1px",
          borderRadius: "10px",
          textShadow: "0 2px 5px rgba(0,0,0,0.5)",
        }}
      >
        Health Care Feedback Portal
      </header>

      {/* Feedback Form */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          padding: "40px",
          width: "90%",
          maxWidth: "600px",
          color: "#333",
        }}
      >
        <h2
          style={{
            fontSize: "26px",
            marginBottom: "20px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#004d40",
          }}
        >
          Share Your Feedback
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "16px",
              outline: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "16px",
              outline: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
            required
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "16px",
              outline: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
            required
          />
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here..."
            style={{
              width: "100%",
              height: "150px",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "16px",
              outline: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
            required
          ></textarea>
          <button
            type="submit"
            style={{
              background: "linear-gradient(45deg, #43e97b, #38f9d7)", // Stylish gradient button
              color: "white",
              border: "none",
              borderRadius: "25px",
              padding: "15px 40px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              transition: "transform 0.2s",
            }}
          >
            Submit Feedback
          </button>
        </form>
        {message && (
          <p
            style={{
              marginTop: "15px",
              color: sentimentLabel ? getSentimentColor(sentimentLabel) : "#333", //Further enhancement
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {message}
            {sentimentLabel && (
              <span
                style={{
                  display: "block",
                  marginTop: "10px",
                  color: getSentimentColor(sentimentLabel), //Further enhancement
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Sentiment: {sentimentLabel}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "20px",
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "#ffffff",
          textAlign: "center",
          padding: "10px",
          width: "100%",
          borderRadius: "10px",
          fontSize: "16px",
        }}
      >
  © {new Date().getFullYear()} Patient Feedback Form
  </footer>
    </div>
  );
};

export default App;
