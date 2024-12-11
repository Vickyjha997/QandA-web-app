// QandA Project

// QandA is a platform where students can ask questions to tutors or use the Gemini API for instant answers. Tutors can answer student queries, provide support, and view their history. This documentation explains how to set up and run the project locally.

// ## Description

// QandA provides the following features:

// - **Student Features:**
//   - Register and log in to their account.
//   - Raise questions to tutors or get instant AI-generated answers.
//   - Upload images for better explanation of their queries.
//   - View the history of their raised questions and answers.

// - **Tutor Features:**
//   - Register and log in to their account.
//   - View and answer students' questions.
//   - Track the history of their answered questions.
//   - Provide support for issues or queries with attachments.

// The application uses the following stack:

// - **Backend**: Node.js, Express.js
// - **Frontend**: EJS (Embedded JavaScript Templates)
// - **Database**: MongoDB
// - **File Uploads**: Multer for handling file uploads.
// - **AI Integration**: Google Generative AI API for instant answers.

// ## Prerequisites

// Ensure you have the following installed on your system:

// 1. **Node.js** (v14 or higher) - [Download Node.js](https://nodejs.org/)
// 2. **MongoDB** (Running locally or in the cloud) - [Download MongoDB](https://www.mongodb.com/try/download/community)

// ## Installation Steps

// ### Step 1: Clone the Repository (if using Git)

// 1. Open a terminal and navigate to the directory where you want to clone the project.
// 2. Clone the repository and navigate to the project folder:
//    ```bash
//    git clone <repository-url>
//    cd QandA
//    ```

// ### Step 2: Install Dependencies

// Run the following command to install the required npm packages:

// ```bash
// npm install
// ```

// ### Step 3: Set Up Environment Variables

// Create a `.env` file in the root directory of the project:

// ```bash
// touch .env
// ```

// Add the following content to the `.env` file, replacing placeholders with your actual keys:

// ```
// MONGO_URI=mongodb://127.0.0.1:27017/QandA
// PORT=3000
// GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
// ```

// Replace `YOUR_GOOGLE_API_KEY` with your Google Generative AI API key.

// ### Step 4: Start MongoDB

// If you're running MongoDB locally, start the service:

// **On Linux/macOS:**

// ```bash
// mongod
// ```

// **On Windows:**

// Start MongoDB from your installation directory or through services.

// ### Step 5: Start the Application

// Run the following command to start the app:

// ```bash
// node app.js
// ```

// The server should now be running on http://localhost:3000.

// ## Directory Structure

// ```
// QandA/
// ├── models/                # MongoDB models for Student, Tutor, Question, etc.
// ├── public/                # Static files like images, CSS, JS
// │   ├── uploads/           # Uploaded files (created automatically)
// ├── views/                 # EJS templates for rendering pages
// ├── .env                   # Environment variables
// ├── app.js                 # Main server file
// ├── package.json           # Node.js dependencies
// ```

// ## Features and Routes

// **Student Features**

// * Register: `/student/register` (GET, POST)
// * Login: `/student/login` (GET, POST)
// * Ask Question: `/student/:id/raisequestion` (GET, POST)
// * View History: `/student/:id/history` (GET)
// * Instant Answer with AI: `/student/:id/instant-answer` (GET, POST)

// **Tutor Features**

// * Register: `/tutor/register` (GET, POST)
// * Login: `/tutor/login` (GET, POST)
// * Answer Questions: `/tutor/:tid/:qid/answer` (GET, POST)
// * View History: `/tutor/:id/history` (GET)
// * Support Requests: `/tutor/:id/support` (GET, POST)

// ## Additional Notes

// * Uploading Files: Images and files uploaded by users are stored in the `public/uploads/` directory.

// ## Dependencies

// * Express: Web framework.
// * Multer: For file uploads.
// * Mongoose: MongoDB object modeling.
// * EJS: For server-side rendering.
// * Google Generative AI: For instant AI responses.
// * Database: The app uses MongoDB to store user, question, and answer data.

// ## Troubleshooting

// **MongoDB Connection Error**

// Ensure MongoDB is running locally or the URI in .env is correct.
// Check logs for errors and verify the database configuration.

// **Google API Errors**

// Verify your API key in .env.
// Check quota limits on your Google account.

// **Static Files Not Loading**

// Ensure the `public/` directory exists and contains the necessary files.

// **Port Already in Use**

// Modify the `PORT` value in .env or free the port using:


// This project is for educational purposes. You may use and modify it as needed for personal or academic work.