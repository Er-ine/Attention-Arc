import { useState } from "react";
import Onboarding from "./components/Onboarding";
import Upload from "./components/Upload";
import TutoringChat from "./components/TutoringChat";
import QuizStep from "./components/QuizStep";
import "./App.css";

function App() {
  const [step, setStep] = useState("onboarding"); // 'onboarding' | 'upload' | 'tutoring' | 'quiz' | 'done'
  const [student, setStudent] = useState({ name: "", ageGroup: null });
  const [quizAnswers, setQuizAnswers] = useState([]);

  function handleOnboardingComplete({ name, ageGroup }) {
    setStudent({ name, ageGroup });
    setStep("upload");
  }

  function handleUploadComplete({ fileName }) {
    console.log("Uploaded:", fileName, "for", student);
    setStep("tutoring");
  }

  function handleTutoringFinished() {
    setStep("quiz");
  }

  function handleQuizComplete(answers) {
    setQuizAnswers(answers);
    console.log("Quiz answers:", answers);
    setStep("done"); // placeholder until the Learning Map screen is built
  }

  return (
    <div className="app-shell">
      {step === "onboarding" && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {step === "upload" && (
        <Upload studentName={student.name} onComplete={handleUploadComplete} />
      )}

      {step === "tutoring" && (
        <TutoringChat
          ageGroup={student.ageGroup}
          onFinished={handleTutoringFinished}
        />
      )}

      {step === "quiz" && <QuizStep onComplete={handleQuizComplete} />}

      {step === "done" && (
        <div className="screen">
          <h1 className="headline">Nice work, {student.name}!</h1>
          <p className="subtext">Next up: your learning map goes here.</p>
        </div>
      )}
    </div>
  );
}

export default App;
