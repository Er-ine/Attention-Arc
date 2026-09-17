import { useState } from "react";
import ArcHero from "./ArcHero";

function Onboarding({ onComplete }) {
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState(null); // 'young' (7-11) or 'teen' (12-16)

  const canContinue = name.trim().length > 0 && ageGroup !== null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canContinue) return;
    onComplete({ name: name.trim(), ageGroup });
  }

  return (
    <div className="screen onboarding-screen">
      <ArcHero />
      <h1 className="headline">Let's get to know you</h1>
      <p className="subtext">
        Just two quick things, then we'll dive in together.
      </p>

      <form onSubmit={handleSubmit} className="onboarding-form">
        <label className="field-label" htmlFor="student-name">
          What's your name?
        </label>
        <input
          id="student-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your name"
          className="text-input"
          autoFocus
        />

        <span className="field-label">How old are you?</span>
        <div className="age-toggle">
          <button
            type="button"
            className={`age-option ${ageGroup === "young" ? "age-option-selected" : ""}`}
            onClick={() => setAgeGroup("young")}
          >
            7–11
          </button>
          <button
            type="button"
            className={`age-option ${ageGroup === "teen" ? "age-option-selected" : ""}`}
            onClick={() => setAgeGroup("teen")}
          >
            12–16
          </button>
        </div>

        <button
          type="submit"
          className="primary-button"
          disabled={!canContinue}
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default Onboarding;
