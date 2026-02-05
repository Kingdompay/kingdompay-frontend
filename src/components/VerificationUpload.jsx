import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const VerificationUpload = () => {
  const navigate = useNavigate();
  const { user, uploadDocument, kycDocuments, refreshKYCStatus } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Refresh KYC status on mount
  useEffect(() => {
    if (refreshKYCStatus) {
      refreshKYCStatus();
    }
  }, []);

  // Get rejected document info from KYC documents (source of truth)
  const getRejectedDocument = () => {
    if (!kycDocuments || kycDocuments.length === 0) return null;
    return kycDocuments.find((doc) => doc.status === "rejected");
  };

  const rejectedDoc = getRejectedDocument();

  // Determine what needs to be uploaded based on KYC state
  const getUploadStep = () => {
    if (!user) return null;

    // 1) If there's a rejected document from KYC, prompt resubmit for that type
    if (rejectedDoc) {
      return {
        type: rejectedDoc.document_type,
        title:
          rejectedDoc.document_type === "national_id"
            ? "Government ID (Resubmit)"
            : rejectedDoc.document_type
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()) + " (Resubmit)",
        description: `Your previous document was rejected. Please upload a new ${rejectedDoc.document_type.replace(
          /_/g,
          " "
        )}.`,
        icon: "refresh",
        required: true,
        rejectionReason: rejectedDoc.rejection_reason,
      };
    }

    // 2) Institution: ask for business document
    if (user.role === "institution") {
      return {
        type: "utility_bill",
        title: "Business Document",
        description:
          "Upload a valid business permit, utility bill, or registration certificate.",
        icon: "business_center",
        required: true,
      };
    }

    // 3) Regular user: use KYC documents only (ignore legacy user.documents)
    const idDoc = kycDocuments?.find(
      (doc) => doc.document_type === "national_id"
    );

    // If there is a pending national_id document, just show pending UI (handled below)
    if (idDoc && idDoc.status === "pending") {
      return null;
    }

    // If there is an approved national_id, no need to upload again
    if (idDoc && idDoc.status === "approved") {
      return null;
    }

    // Default for new users: ask for government ID
    return {
      type: "national_id",
      title: "Government ID",
      description:
        "Upload a clear photo or scan of your identification card (front and back in a single image or PDF).",
      icon: "badge",
      required: true,
    };

    // Other optional docs (passport, etc.) can be added later if needed
  };

  const currentStep = getUploadStep();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    console.log("=== Starting upload ===");
    console.log("File:", file);
    console.log("Current step:", currentStep);

    if (!file) {
      console.error("No file selected");
      setError("Please select a file first");
      return;
    }

    if (!currentStep) {
      console.error("No current step");
      setError("Unable to determine document type");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Uploading document type:", currentStep.type);
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const result = await uploadDocument(file, currentStep.type);
      console.log("Upload result:", result);

      if (result && result.success) {
        setSuccess(true);
        // Refresh KYC status
        if (refreshKYCStatus) {
          await refreshKYCStatus();
        }
        // Navigate to home after a delay
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        const errorMsg = result?.error || "Upload failed. Please try again.";
        console.error("Upload failed:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Upload exception:", err);
      console.error("Error response:", err.response?.data);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Upload failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!currentStep && !success) {
    // Check if verification is pending - check both kyc_status and verificationStatus
    const isPending =
      user?.kyc_status === "pending" ||
      user?.verificationStatus === "pending" ||
      (user?.documents &&
        Object.values(user.documents).some((status) => status === "pending"));

    if (isPending) {
      return (
        <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] flex items-center justify-center p-4 transition-colors duration-300">
          <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}} .animate-fade-in-up{animation:fadeInUp .6s ease-out forwards}`}</style>
          <div className="text-center animate-fade-in-up max-w-md">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-4xl">
                hourglass_top
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">
              Verification Pending
            </h2>
            <p className="text-gray-500 dark:text-[#A8C4A8] mb-6">
              Your documents are under review. We'll notify you once verified.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/profile")}
                className="px-6 py-2 bg-gray-100 dark:bg-[#1A2E1D] rounded-lg text-gray-700 dark:text-[#E8F5E8] font-medium hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors border-none cursor-pointer"
              >
                Back to Profile
              </button>
              <button
                onClick={() => navigate("/home")}
                className="px-6 py-2 bg-[#1A3F22] rounded-lg text-white font-medium hover:bg-[#14301a] transition-colors border-none cursor-pointer"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Already verified
    return (
      <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] flex items-center justify-center p-4 transition-colors duration-300">
        <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}} .animate-fade-in-up{animation:fadeInUp .6s ease-out forwards}`}</style>
        <div className="text-center animate-fade-in-up max-w-md">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">
              verified
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">
            Already Verified!
          </h2>
          <p className="text-gray-500 dark:text-[#A8C4A8] mb-6">
            Your identity has been verified. You have full access to all
            features.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-[#1A3F22] rounded-lg text-white font-medium hover:bg-[#14301a] transition-colors border-none cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] flex items-center justify-center p-4 transition-colors duration-300">
        <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}} .animate-fade-in-up{animation:fadeInUp .6s ease-out forwards}`}</style>
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">
              check_circle
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">
            Upload Successful!
          </h2>
          <p className="text-gray-500 dark:text-[#A8C4A8]">
            Your document has been submitted for review. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] font-sans flex justify-center transition-colors duration-300">
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}} .animate-fade-in-up{animation:fadeInUp .6s ease-out forwards}`}</style>
      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">
        {/* Sidebar (Desktop) */}
        <div className="hidden md:flex md:w-1/3 lg:w-1/4 bg-[#E5EBE3] dark:bg-[#0D1B0F] border-r border-gray-100 dark:border-[#2D4A32] flex-col p-6 transition-colors duration-300">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center text-gray-600 dark:text-[#A8C4A8] hover:text-[#1A3F22] dark:hover:text-[#E8F5E8] mb-8 font-medium bg-transparent border-none cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>{" "}
            Back to Profile
          </button>
          <h1 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8]">
            Identity Verification
          </h1>
          <p className="text-gray-500 dark:text-[#A8C4A8] mt-4">
            {user?.role === "institution"
              ? "Verify your institution to unlock wallet features and create groups."
              : "Verify your identity to unlock higher limits and wallet features."}
          </p>
        </div>

        {/* Main Content */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0D1B0F] transition-colors duration-300">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center mb-6">
            <button
              onClick={() => navigate("/profile")}
              className="bg-gray-100 dark:bg-[#1A2E1D] border-none rounded-full w-10 h-10 flex items-center justify-center mr-4 transition-colors"
            >
              <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8]">
                arrow_back
              </span>
            </button>
            <h1 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8]">
              Verify Identity
            </h1>
          </div>

          <div className="max-w-lg mx-auto animate-fade-in-up">
            {/* Rejection Notice */}
            {currentStep?.rejectionReason && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 mb-6 transition-colors duration-300">
                <h3 className="font-bold text-red-700 dark:text-red-300 mb-2 flex items-center">
                  <span className="material-symbols-outlined mr-2">error</span>{" "}
                  Document Rejected
                </h3>
                <p className="text-red-600 dark:text-red-400 text-sm mb-3">
                  <strong>Reason:</strong> {currentStep.rejectionReason}
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm">
                  Please upload a new document that addresses the issues
                  mentioned above.
                </p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-6 mb-8 transition-colors duration-300">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center">
                <span className="material-symbols-outlined mr-2">info</span> Why
                verify?
              </h3>
              <ul className="text-blue-800 dark:text-blue-300 text-sm space-y-2 ml-6 list-disc">
                <li>Access **Wallet** features</li>
                <li>Create **Communities** and Campaigns</li>
                <li>Increase daily limits</li>
                <li>Enhanced account security</li>
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">
                {currentStep.title}
              </h2>
              <p className="text-gray-500 dark:text-[#A8C4A8]">
                {currentStep.description}
              </p>

              {currentStep.type === "national_id" && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-xs text-yellow-800 dark:text-yellow-200">
                  <p className="font-semibold mb-1">Tip for faster approval:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Make sure both the <strong>front and back</strong> of your ID are clearly visible.</li>
                    <li>Upload them as <strong>one clear image or PDF</strong> (you can place both sides side-by-side).</li>
                    <li>Avoid glare, blur, or cutting off the edges of the document.</li>
                  </ul>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium flex items-center">
                <span className="material-symbols-outlined mr-2">error</span>
                {error}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 dark:border-[#2D4A32] rounded-3xl p-8 text-center hover:border-[#6f9c16] dark:hover:border-[#6f9c16] transition-colors cursor-pointer relative group">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#1A2E1D] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#E9F0E1] dark:group-hover:bg-[#243B28] transition-colors">
                <span className="material-symbols-outlined text-gray-500 dark:text-[#A8C4A8] text-3xl group-hover:text-[#58761B] dark:group-hover:text-[#E8F5E8] transition-colors">
                  {currentStep.icon}
                </span>
              </div>
              <h3 className="font-bold text-gray-700 dark:text-[#E8F5E8] mb-1">
                {file ? file.name : "Click to upload document"}
              </h3>
              <p className="text-gray-400 dark:text-[#6b7280] text-sm">
                {file
                  ? "Click to change file"
                  : "Supported formats: JPG, PNG, PDF"}
              </p>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full mt-8 py-4 rounded-xl font-bold text-white transition-all border-none cursor-pointer ${
                !file || loading
                  ? "bg-gray-300 dark:bg-gray-600"
                  : "bg-[#1A3F22] hover:bg-[#14301a] shadow-lg hover:shadow-xl"
              }`}
            >
              {loading
                ? "Uploading..."
                : currentStep?.rejectionReason
                ? "Resubmit Document"
                : "Submit Document"}
            </button>

            {/* Skip button for optional steps */}
            {!currentStep.required && (
              <button
                onClick={() => navigate("/profile")}
                disabled={loading}
                className="w-full mt-3 py-3 rounded-xl font-medium text-gray-600 dark:text-[#A8C4A8] bg-gray-100 dark:bg-[#1A2E1D] hover:bg-gray-200 dark:hover:bg-[#243B28] transition-all border-none cursor-pointer"
              >
                Skip for now
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VerificationUpload;
