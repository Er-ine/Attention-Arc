import { useState, useEffect } from "react";
import mockConcepts from "../mockConcepts";

function TutoringChat({ ageGroup, onFinished }) {
  const [conceptIndex, setConceptIndex] = useState(0);
  const [messages, setMessages] = useState([]);

  const concepts = mockConcepts; // TODO: replace with real concepts from the backend later
  const isLastConcept = conceptIndex === concepts.length - 1;

  useEffect(() => {
    const concept = concepts[conceptIndex];
    setMessages((prev) => [
      ...prev,
      { id: `${concept.id}-main`, text: concept.explanation[ageGroup] },
    ]);
  }, [conceptIndex]);

  function handleDontGetIt() {
    const concept = concepts[conceptIndex];
    setMessages((prev) => [
      ...prev,
      {
        id: `${concept.id}-simple-${prev.length}`,
        text: concept.simplerExplanation[ageGroup],
      },
    ]);
  }

  function handleNext() {
    if (isLastConcept) {
      onFinished();
    } else {
      setConceptIndex((i) => i + 1);
    }
  }

  return (
    <div className="screen tutoring-screen">
      <h1 className="headline">{concepts[conceptIndex].label}</h1>

      <div className="chat-log">
        {messages.map((m) => (
          <div key={m.id} className="chat-bubble">
            {m.text}
          </div>
        ))}
      </div>

      <div className="button-row">
        <button className="secondary-button" onClick={handleDontGetIt}>
          I don't get this
        </button>
        <button className="primary-button" onClick={handleNext}>
          {isLastConcept ? "Take the quiz" : "Next concept"}
        </button>
      </div>
    </div>
  );
}

export default TutoringChat;
