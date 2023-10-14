export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center md:px-11">
      <h1 className="text-4xl font-bold md:text-5xl">JSON Tree Viewer</h1>
      <p className="text-xl md:text-2xl">
        Simple JSON Viewer that runs completely on-client. No data exchange
      </p>
      <button className="bg-button rounded-[5px] border border-solid border-black bg-opacity-70 px-3 py-[6px] font-medium leading-none">
        Load JSON
      </button>

      {/* <span className="text-red-700">
        Invalid file. Please load a valid JSON file.
      </span> */}
    </main>
  );
}
