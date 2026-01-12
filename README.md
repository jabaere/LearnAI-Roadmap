# LearnAI Roadmap

LearnAI Roadmap is an AI-powered application designed to help users generate personalized learning roadmaps for any goal. Simply input what you want to learn, your current skill level, and your time commitment, and our AI will generate a structured, step-by-step curriculum to guide you from start to finish.

## Core Features

- **Personalized Goal Input**: Specify your learning goal, skill level (Beginner, Intermediate, Advanced), and daily time commitment.
- **AI Roadmap Generation**: Leverages Google's Gemini AI to create a detailed learning path with realistic time estimates for each step.
- **Interactive Roadmap Display**: View your generated roadmap in a clean, split-screen layout. Steps are on the left, and detailed information is on the right.
- **In-Depth Step Details**: Click on any step to see what you'll learn, practical first steps, practice exercises, and criteria for completion. You can even ask the AI to "Go Deeper" for more detailed explanations.
- **User Authentication**: Securely sign up or log in using email/password or Google to save and manage your roadmaps.
- **Save & View Roadmaps**: Authenticated users can save their generated roadmaps and view them later from their personal dashboard.
- **Share Roadmaps**: Generate a public link to share your learning roadmaps with others.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/learnai-roadmap.git
    cd learnai-roadmap
    ```

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

