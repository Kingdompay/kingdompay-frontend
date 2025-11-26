import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';

const VerificationUpload = () => {
    const navigate = useNavigate();
    const { user, uploadDocument } = useAuth();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Determine what needs to be uploaded based on role and current docs
    const getUploadStep = () => {
        if (!user) return null;

        if (user.role === 'institution') {
            return {
                type: 'permit',
                title: 'Business Permit',
                description: 'Upload a valid business permit or registration certificate.',
                icon: 'business_center'
            };
        } else {
            // Regular user
            const docs = user.documents || {};
            if (!docs.id || docs.id === 'rejected') {
                return {
                    type: 'id',
                    title: 'Government ID',
                    description: 'Upload a valid National ID, Passport, or Driver\'s License.',
                    icon: 'badge'
                };
            } else if (!docs.face || docs.face === 'rejected') {
                return {
                    type: 'face',
                    title: 'Selfie Verification',
                    description: 'Take a clear photo of your face to verify your identity.',
                    icon: 'face'
                };
            }
        }
        return null; // All done or pending
    };

    const currentStep = getUploadStep();

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !currentStep) return;

        setLoading(true);
        try {
            await uploadDocument(file, currentStep.type);
            setSuccess(true);

            // If there are more steps, reset success after delay, else redirect
            setTimeout(() => {
                const nextStep = getUploadStep(); // Check if more needed (this logic relies on state update which might be async, but for mock it's fine)

                // In a real app, we'd wait for the context to update. 
                // For this mock, we assume the context update in AuthContext triggers a re-render.
                // However, since we just set success=true, we might want to just reload or let the effect handle it.

                // Simple logic: if we just uploaded ID, we likely need Face next.
                // If we uploaded Permit or Face, we are done.

                if (currentStep.type === 'id') {
                    setSuccess(false);
                    setFile(null);
                } else {
                    navigate('/profile');
                }
            }, 2000);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentStep && !success) {
        // Already pending or verified
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-blue-600 text-4xl">hourglass_top</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#1A3F22] mb-2">Verification Pending</h2>
                    <p className="text-gray-500 mb-6">Your documents are under review. We'll notify you once verified.</p>
                    <button onClick={() => navigate('/profile')} className="px-6 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors border-none cursor-pointer">
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#1A3F22] mb-2">Upload Successful!</h2>
                    <p className="text-gray-500">
                        {currentStep?.type === 'id' ? 'ID uploaded. Please proceed to selfie verification.' : 'Your document is under review.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans flex justify-center">
            <div className="w-full max-w-md md:max-w-6xl bg-white md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative">
                {/* Sidebar (Desktop) */}
                <div className="hidden md:flex md:w-1/3 lg:w-1/4 bg-white border-r border-gray-100 flex-col p-6">
                    <button onClick={() => navigate('/profile')} className="flex items-center text-gray-600 hover:text-[#1A3F22] mb-8 font-medium bg-transparent border-none cursor-pointer">
                        <span className="material-symbols-outlined mr-2">arrow_back</span> Back to Profile
                    </button>
                    <h1 className="text-2xl font-bold text-[#1A3F22]">Identity Verification</h1>
                    <p className="text-gray-500 mt-4">
                        {user?.role === 'institution'
                            ? 'Verify your institution to unlock wallet features and create groups.'
                            : 'Verify your identity to unlock higher limits and wallet features.'}
                    </p>
                </div>

                {/* Main Content */}
                <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-white">
                    {/* Mobile Header */}
                    <div className="md:hidden flex items-center mb-6">
                        <button onClick={() => navigate('/profile')} className="bg-gray-100 border-none rounded-full w-10 h-10 flex items-center justify-center mr-4">
                            <span className="material-symbols-outlined text-[#1A3F22]">arrow_back</span>
                        </button>
                        <h1 className="text-xl font-bold text-[#1A3F22]">Verify Identity</h1>
                    </div>

                    <div className="max-w-lg mx-auto animate-fade-in-up">
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
                            <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                                <span className="material-symbols-outlined mr-2">info</span> Why verify?
                            </h3>
                            <ul className="text-blue-800 text-sm space-y-2 ml-6 list-disc">
                                <li>Access **Wallet** features</li>
                                <li>Create **Groups** (Institutions)</li>
                                <li>Increase daily limits</li>
                                <li>Enhanced account security</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-[#1A3F22] mb-2">{currentStep.title}</h2>
                            <p className="text-gray-500">{currentStep.description}</p>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-[#6f9c16] transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-gray-500 text-3xl">{currentStep.icon}</span>
                            </div>
                            <h3 className="font-bold text-gray-700 mb-1">
                                {file ? file.name : 'Click to upload document'}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                {file ? 'Click to change file' : 'Supported formats: JPG, PNG, PDF'}
                            </p>
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className={`w-full mt-8 py-4 rounded-xl font-bold text-white transition-all border-none cursor-pointer ${!file || loading ? 'bg-gray-300' : 'bg-[#1A3F22] hover:bg-[#14301a] shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {loading ? 'Uploading...' : 'Submit Document'}
                        </button>
                    </div>
                </main>
            </div>
            <div className="md:hidden"><BottomNav /></div>
        </div>
    );
};

export default VerificationUpload;
