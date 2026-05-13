import React, { useState } from "react";
import {
  Upload,
  AlertCircle,
  CheckCircle,
  Loader,
  X,
  FileText,
} from "lucide-react";
import { apiFetch } from "@/lib/api-fetch";

interface ProcessedQuestion {
  questionId: string;
  topic: string;
  topicId: string;
  text: string;
  explanation: string;
  confidence: number;
  confidenceLevel: string;
}

interface UploadError {
  questionIndex: number;
  text: string;
  error: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  summary: {
    totalExtracted: number;
    successfullyProcessed: number;
    failed: number;
    successRate: string;
  };
  processedQuestions: ProcessedQuestion[];
  errors?: UploadError[];
  nextSteps: string[];
}

export function PDFQuestionUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UploadResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError(null);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (files[0].type === "application/pdf") {
        setFile(files[0]);
      } else {
        setUploadError("Please drop a PDF file. Other formats are not supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setUploadError("Only PDF files are allowed. Please select a PDF file.");
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        setUploadError("File size exceeds 50MB limit. Please upload a smaller file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiFetch("/api/questions/upload-pdf", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = (await response.json()) as UploadResponse;
      setResults(data);
      setFile(null);
    } catch (error) {
      setUploadError(
        `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setResults(null);
    setFile(null);
    setUploadError(null);
  };

  if (results) {
    return (
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            ✓ Upload Complete
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded p-3 border border-blue-100">
              <p className="text-xs text-gray-600 mb-1">Total Extracted</p>
              <p className="text-2xl font-bold text-blue-600">
                {results.summary.totalExtracted}
              </p>
            </div>
            <div className="bg-white rounded p-3 border border-green-100">
              <p className="text-xs text-gray-600 mb-1">Successful</p>
              <p className="text-2xl font-bold text-green-600">
                {results.summary.successfullyProcessed}
              </p>
            </div>
            <div className="bg-white rounded p-3 border border-red-100">
              <p className="text-xs text-gray-600 mb-1">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {results.summary.failed}
              </p>
            </div>
            <div className="bg-white rounded p-3 border border-indigo-100">
              <p className="text-xs text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-indigo-600">
                {results.summary.successRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Success Questions */}
        {results.processedQuestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Successfully Processed Questions ({results.processedQuestions.length})
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.processedQuestions.slice(0, 5).map((q, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 border border-green-200 rounded p-4 hover:bg-green-100 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-green-900">{q.topic}</p>
                      <p className="text-sm text-gray-700">{q.text}...</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        q.confidence >= 0.9
                          ? "bg-green-200 text-green-800"
                          : q.confidence >= 0.7
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-orange-200 text-orange-800"
                      }`}
                    >
                      {(q.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 bg-white p-2 rounded">
                    <strong>AI Explanation:</strong> {q.explanation}...
                  </p>
                </div>
              ))}
              {results.processedQuestions.length > 5 && (
                <div className="text-center py-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium">
                    +{results.processedQuestions.length - 5} more questions processed
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Questions */}
        {results.errors && results.errors.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Failed to Process ({results.errors.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {results.errors.slice(0, 5).map((e, idx) => (
                <div key={idx} className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-medium text-sm text-red-900">
                    Question #{e.questionIndex}
                  </p>
                  <p className="text-red-700 text-sm">{e.error}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {results.nextSteps && results.nextSteps.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
            <ul className="space-y-1">
              {results.nextSteps.map((step, idx) => (
                <li key={idx} className="text-sm text-blue-800 flex gap-2">
                  <span className="font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={resetUpload}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
        >
          Upload Another PDF
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Past Questions PDF
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm">
            Drag and drop your PDF file here, or click the button below to select.
            The system will automatically extract questions, classify them by topic,
            and generate explanations.
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-input"
          />

          <label htmlFor="pdf-input" className="mb-4">
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Select PDF File
            </button>
          </label>

          <p className="text-xs text-gray-500">
            PDF only • Maximum 50MB • Questions will be saved as drafts for review
          </p>
        </div>

        {file && (
          <div className="mt-6 p-4 bg-white border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setUploadError(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Upload Error</p>
            <p className="text-sm text-red-800">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {file && !loading && (
        <button
          onClick={handleUpload}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
        >
          <Upload className="h-5 w-5 inline mr-2" />
          Upload & Process
        </button>
      )}

      {/* Loading State */}
      {loading && (
        <div className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center gap-2">
          <Loader className="animate-spin h-5 w-5" />
          <span>Processing your PDF... This may take a few minutes.</span>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">How It Works</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ PDF is parsed to extract individual questions</li>
          <li>✓ Each question is classified to the correct topic using AI</li>
          <li>✓ AI generates a concise explanation for each question</li>
          <li>✓ Questions are saved as drafts for your review</li>
          <li>✓ You'll need to add answer options before publishing</li>
        </ul>
      </div>
    </div>
  );
}
