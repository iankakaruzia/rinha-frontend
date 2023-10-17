"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const BYTES_PER_PAGE = 1024 * 10;

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [fileContent, setFileContent] = useState("");
  const [showError, setShowError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  function handleClick() {
    setShowError(false);
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  }

  const handleFileRead = (content: string) => {
    setFileContent((prevContent) => prevContent + content);
    setIsLoading(false);
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setFileContent("");
    if (event.target.files?.length) {
      const firstFile = event.target.files[0];

      if (firstFile.type !== "application/json") {
        setShowError(true);
        return;
      }

      setFile(firstFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleFileRead(event.target.result as string);
        }
      };
      const blob = firstFile.slice(0, BYTES_PER_PAGE); // First bytes
      reader.readAsText(blob);
    }
  }

  function loadNextPage() {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (event) => {
        if (event.target?.result) {
          handleFileRead(event.target.result as string);
        }
      };
      const blob = file.slice(
        currentPage * BYTES_PER_PAGE,
        (currentPage + 1) * BYTES_PER_PAGE,
      );
      setIsLoading(true);
      reader.readAsText(blob);
      setCurrentPage((prevPage) => prevPage + 1);

      if (blob.size === 0) {
        setIsLoading(false);
      }
    }
  }

  function handleScroll() {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || document.body.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 50 && !isLoading) {
      loadNextPage();
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, file]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 pt-6 text-center md:px-11">
      <h1 className="text-4xl font-bold md:text-5xl">JSON Tree Viewer</h1>
      <p className="text-xl md:text-2xl">
        Simple JSON Viewer that runs completely on-client. No data exchange
      </p>
      <button
        onClick={handleClick}
        className="rounded-[5px] border border-solid border-black bg-opacity-70 bg-button px-3 py-[6px] font-medium leading-none"
      >
        Load JSON
      </button>
      <input
        onChange={handleChange}
        ref={inputRef}
        type="file"
        className="hidden"
        accept="application/json"
      />
      {fileContent && (
        <>
          <div>{fileContent}</div>
        </>
      )}

      {showError && (
        <span className="text-red-700">
          Invalid file. Please load a valid JSON file.
        </span>
      )}

      {isLoading && <Loading />}
    </main>
  );
}

function Loading() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="mr-2 inline h-8 w-8 animate-spin fill-black text-gray-200"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
