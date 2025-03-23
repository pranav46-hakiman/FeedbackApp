const express = require("express");
const bodyParser = require("body-parser");
const mssql = require("mssql");
const cors = require("cors");
const Sentiment = require("sentiment");

const app = express();
app.use(bodyParser.json());
app.use(cors());

//  Database Configuration
const config = {
  user: 'DB1',
  password: 'Whitebeard@23',
  server: 'hpfa1.database.windows.net',
  database: 'HPFA_DB1', 
  options: {
      encrypt: true,
      enableArithAbort: true
  }
};


let pool;

async function connectToDatabase() {
  try {
    pool = await mssql.connect(config);  
    console.log(" Database connected successfully!");
  } catch (err) {
    console.error(" Database connection failed:", err);
    process.exit(1); 
  }
}


const sentiment = new Sentiment();

// Feedback submission route
app.post("/feedback", async (req, res) => {
  const { name, email, phone, feedback } = req.body;

  if (!name || !email || !phone || !feedback) {
    return res.status(400).send({
      success: false,
      message: "All fields (name, email, phone, feedback) are required.",
    });
  }

  let sentimentScore = 0;
  let sentimentLabel = "Neutral";

  try {
    // Perform Sentiment Analysis
    const sentimentResult = sentiment.analyze(feedback);
    sentimentScore = sentimentResult.score;
    sentimentLabel = sentimentScore > 0 ? "Positive" : sentimentScore < 0 ? "Negative" : "Neutral";

    // DB Connection is Active
    if (!pool) {
      return res.status(500).send({
        success: false,
        message: "Database connection is not established.",
      });
    }

    // SQL Query to Insert Feedback
    const query = `
      INSERT INTO dbo.Feedback (userName, email, phone, feedbackText, sentimentScore, sentimentLabel)
      VALUES (@name, @Email, @Phone, @Feedback, @SentimentScore, @SentimentLabel)
    `;

    await pool
      .request()
      .input("name", mssql.NVarChar, name)
      .input("Email", mssql.NVarChar, email)
      .input("Phone", mssql.NVarChar, phone)
      .input("Feedback", mssql.NVarChar, feedback)
      .input("SentimentScore", mssql.Int, sentimentScore)
      .input("SentimentLabel", mssql.NVarChar, sentimentLabel)
      .query(query);

    res.status(201).send({
      success: true,
      message: "Feedback saved successfully.",
    });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).send({
      success: false,
      message: "Error saving feedback. Please try again later.",
    });
  }
});

//  Fetch all feedback route
app.get("/all-feedback", async (req, res) => {
  try {
    // Ensure DB Connection is Active
    if (!pool) {
      return res.status(500).send({
        success: false,
        message: "Database connection is not established.",
      });
    }

    const query = "SELECT * FROM dbo.Feedback";  
    const result = await pool.request().query(query);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(" Error fetching feedback:", err);
    res.status(500).send({
      success: false,
      message: "Error fetching feedback.",
    });
  }
});


async function startServer() {
  await connectToDatabase();
  app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
  });
}

startServer();