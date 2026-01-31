# LearnAI Roadmap

**LearnAI Roadmap** is an AI-powered web application that generates **personalized, time-aware learning roadmaps** for any goal.

Users enter what they want to learn, their current skill level, and how much time they can dedicate daily. The application then uses **__Google Gemini 3__** (via Firebase Genkit) to generate a **structured, step-by-step curriculum** with realistic time estimates, practical guidance, and clear completion criteria.

The goal is to turn learning from a vague intention into a **clear, actionable plan**.

---

## 🚀 Core Features

- **Personalized Goal Input**  
  Define your learning goal, skill level (Beginner, Intermediate, Advanced), and daily time commitment.

- **AI Roadmap Generation (Powered by __Google Gemini 3__)**  
  Learning roadmaps are generated server-side using **Google Gemini 3**, producing structured JSON output with realistic time estimates for each step.

- **Interactive Roadmap Display**  
  Clean split-screen UI where roadmap steps appear on the left and detailed explanations on the right.

- **In-Depth Step Details**  
  Each step includes:
  - what you will learn  
  - practical first steps  
  - practice methods  
  - mastery time and completion criteria  
  Users can ask the AI to **“Go Deeper”**, which regenerates the step with more detail using Gemini 3.

- **User Authentication**  
  Secure sign-up and login with Email/Password or Google.

- **Save & View Roadmaps**  
  Authenticated users can save generated roadmaps and revisit them from their personal dashboard.

- **Share Roadmaps**  
  Generate a public link to share learning roadmaps with others.

---

## 🧠 Google Gemini 3 Integration (Explicit)

This application is **built directly on __Google Gemini 3__ using Firebase Genkit**.

All AI logic is implemented server-side in the following directory: src/ai/flows/


### Key Gemini-Powered Files

- **`generate-learning-roadmap.ts`**  
  Uses Gemini 3 to generate full, structured learning roadmaps based on the user’s goal, skill level, and time commitment.

- **`regenerate-step-details.ts`**  
  Uses Gemini 3 to regenerate and expand a single roadmap step with deeper, beginner-friendly explanations.

These files use `ai.definePrompt` and `ai.defineFlow`, which execute **Gemini 3 inference calls** through Genkit. All outputs are validated using strict Zod schemas to ensure predictable, structured JSON responses.

### Security Notes

- The **`GEMINI_API_KEY` is never exposed to the frontend**
- All Gemini 3 calls are executed **server-side only**
- Prompts are defined locally and executed at runtime for performance and security

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI:** **__Google Gemini 3__** via [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 🧪 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/jabaere/LearnAI-Roadmap.git
   cd LearnAI-Roadmap

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add your Firebase and Google AI credentials. You can get these from your Firebase project settings and Google AI Studio.
    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=

    # Google AI (Gemini) API Key
    GEMINI_API_KEY=
    ```

### Running the Development Server

Start the development server with the following command:

```sh
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### Images
<img width="1915" height="916" alt="main page" src="https://github.com/user-attachments/assets/67922157-eaad-4e90-aa50-7b7d9e66a051" />

<img width="1920" height="1898" alt="LearnAI-Roadmap-01-12-2026_07_25_PM" src="https://github.com/user-attachments/assets/d338a211-c8e0-416e-bf41-c8c799d0c524" />

