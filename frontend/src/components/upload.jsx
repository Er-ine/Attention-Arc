import { useState } from "react";
import ArcHero from "./ArcHero";

function Upload({ studentName, onComplete }) {
  const [fileName, setFileName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  }

  function handleContinue() {
    if (!fileName) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onComplete({ fileName });
    }, 1200);
  }

  return (
    <div className="screen upload-screen">
      <ArcHero />
      <h1 className="headline">
        Hi {studentName}, let's teach you something new
      </h1>
      <p className="subtext">
        Upload a chapter, notes, or a page from your textbook.
      </p>

      <label
        className={`drop-zone ${fileName ? "drop-zone-filled" : ""}`}
        htmlFor="file-upload"
      >
        {fileName ? (
          <span className="drop-zone-filename">📄 {fileName}</span>
        ) : (
          <span className="drop-zone-placeholder">
            Click to choose a file (PDF or image)
          </span>
        )}
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          hidden
        />
      </label>

      <button
        className="primary-button"
        onClick={handleContinue}
        disabled={!fileName || isProcessing}
      >
        {isProcessing ? "Reading your material…" : "Teach me this"}
      </button>
    </div>
  );
}

export default Upload;
