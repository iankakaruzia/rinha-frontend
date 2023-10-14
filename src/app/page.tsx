"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [fileContent, setFileContent] = useState<object>();
  const [showError, setShowError] = useState(false);

  const handleClick = () => {
    setShowError(false);
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (event.target.files?.length) {
      const firstFile = event.target.files[0];

      if (firstFile.type !== "application/json") {
        setShowError(true);
        return;
      }

      setFile(event.target.files[0]);
    }
  }

  useEffect(() => {
    let reader: FileReader;
    let cancel = false;
    if (file) {
      reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && !cancel) {
          setFileContent(JSON.parse(event.target.result as string));
        }
      };
      reader.readAsText(file);
    }

    return () => {
      cancel = true;
      if (reader && reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    };
  }, [file]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 pt-6 text-center md:px-11">
      <h1 className="text-4xl font-bold md:text-5xl">JSON Tree Viewer</h1>
      <p className="text-xl md:text-2xl">
        Simple JSON Viewer that runs completely on-client. No data exchange
      </p>
      <button
        onClick={handleClick}
        className="bg-button rounded-[5px] border border-solid border-black bg-opacity-70 px-3 py-[6px] font-medium leading-none"
      >
        Load JSON
      </button>
      <input
        onChange={handleChange}
        ref={inputRef}
        type="file"
        className="hidden"
        // accept="application/json"
      />
      {fileContent && <pre>{JSON.stringify(fileContent, null, 2)}</pre>}

      {showError && (
        <span className="text-red-700">
          Invalid file. Please load a valid JSON file.
        </span>
      )}
    </main>
  );
}
