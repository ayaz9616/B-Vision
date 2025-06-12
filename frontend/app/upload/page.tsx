'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API;

// console.log("Backend URL:", backendUrl); 

const pollProgress = async (jobId: string) => {
  let done = false;
  while (!done) {
    const res = await fetch(`${backendUrl}/progress/${jobId}`);
    const data = await res.json();
    setProgress(data.progress);
    if (data.progress >= 100 || data.progress < 0) {
      done = true;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

const uploadAndAnalyze = async () => {
  if (!file) return;
  setLoading(true);
  setProgress(0);
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${backendUrl}/analyze`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.job_id) {
    setLoading(false);
    alert(data.error || "Failed to start analysis");
    return;
  }
  const jobId = data.job_id;

  await pollProgress(jobId);

  const resultRes = await fetch(`${backendUrl}/result/${jobId}`);
  const resultData = await resultRes.json();
  localStorage.setItem("analysis", JSON.stringify(resultData));
  setProgress(100);
  setTimeout(() => {
    setLoading(false);
    router.push("/results");
  }, 400);
};

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #17213a 0%, #0a0c23 100%)"
      }}
    >
      <div className="bg-[#0a0c23] rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center border border-[#23243a]">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Upload file</h2>
        <p className="text-blue-100 mb-6 text-center text-base">
          Drag or drop your files here or click to upload
        </p>
        <div
          className={`
            flex items-center justify-center mb-8 rounded-xl border-2 transition-colors duration-200 cursor-pointer w-32 h-32
            ${dragActive ? "border-blue-400 bg-[#181b23]" : "border-[#23243a] bg-[#181b23]"}
          `}
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            disabled={loading}
          />
          {!file ? (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <path fill="#fff" fillOpacity="0.7" d="M12 16V4m0 12-4-4m4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="16" width="18" height="4" rx="2" fill="#fff" fillOpacity="0.1"/>
            </svg>
          ) : (
            <span className="text-blue-300 text-sm text-center px-2 break-all">{file.name}</span>
          )}
        </div>
        <button
          className="bg-[#4f46e5] hover:bg-[#6366f1] text-white font-semibold rounded-xl px-8 py-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 text-lg w-full disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={uploadAndAnalyze}
          disabled={loading || !file}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        {loading && (
          <div className="w-full mt-6">
            <div className="mb-2 text-blue-300 font-semibold text-center">Analyzing... {progress}%</div>
            <div className="w-full bg-[#23243a] rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
