import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const IdentityVerification = () => {
    const { token } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [documentToReject, setDocumentToReject] = useState(null);
    const [documentImageUrl, setDocumentImageUrl] = useState(null);

    // Fetch pending KYC documents
    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/kyc/pending-documents');
            console.log('KYC Documents:', response.data);
            setDocuments(response.data.documents || []);
            setError('');
        } catch (err) {
            console.error('Failed to fetch KYC documents:', err);
            setError(err.response?.data?.error || 'Failed to load documents');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    // Approve document
    const handleApprove = async (documentId) => {
        try {
            setActionLoading(true);
            await api.post(`/admin/kyc/document/${documentId}/verify`, {
                status: 'approved'
            });
            // Refresh the list
            await fetchDocuments();
            setSelectedDocument(null);
        } catch (err) {
            console.error('Failed to approve document:', err);
            alert(err.response?.data?.error || 'Failed to approve document');
        } finally {
            setActionLoading(false);
        }
    };

    // Reject document
    const handleReject = async () => {
        if (!documentToReject) return;

        // Require a specific rejection reason so users know what to fix
        if (!rejectionReason || !rejectionReason.trim()) {
            alert('Please enter a reason for rejection so the user knows what to fix.');
            return;
        }
        
        try {
            setActionLoading(true);
            await api.post(`/admin/kyc/document/${documentToReject.id}/verify`, {
                status: 'rejected',
                rejection_reason: rejectionReason.trim()
            });
            // Refresh the list
            await fetchDocuments();
            setSelectedDocument(null);
            setShowRejectModal(false);
            setDocumentToReject(null);
            setRejectionReason('');
        } catch (err) {
            console.error('Failed to reject document:', err);
            alert(err.response?.data?.error || 'Failed to reject document');
        } finally {
            setActionLoading(false);
        }
    };

    const openRejectModal = (doc) => {
        setDocumentToReject(doc);
        setShowRejectModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            default: return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDocumentType = (type) => {
        if (!type) return 'Document';
        return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    if (loading) {
        return (
            <div className="animate-fade-in-up flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#1A3F22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-[#A8C4A8]">Loading verification requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-[#E8F5E8] m-0">Identity Verification</h2>
                    <p className="text-gray-500 dark:text-[#A8C4A8] mt-1">Review and approve user identification documents</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={fetchDocuments}
                        className="px-4 py-2 bg-[#E5EBE3] dark:bg-[#0D1B0F] border border-gray-200 dark:border-[#2D4A32] rounded-lg text-gray-600 dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#243B28] font-medium cursor-pointer transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">refresh</span>
                        Refresh
                    </button>
                </div>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
            )}

            <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#1A2E1D] border-b border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                                <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">User</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">Document Type</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">Submitted</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">Status</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-[#A8C4A8]">
                                        <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">fact_check</span>
                                        No pending verification requests found.
                                    </td>
                                </tr>
                            ) : documents.map((doc) => (
                                <tr key={doc.id} className="border-b border-gray-50 dark:border-[#2D4A32] hover:bg-gray-50/50 dark:hover:bg-[#243B28] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 dark:bg-[#243B28] rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-[#E8F5E8] transition-colors">
                                                {doc.user_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">{doc.user_name || 'Unknown User'}</p>
                                                <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">User ID: {doc.user_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-700 dark:text-[#E8F5E8]">{formatDocumentType(doc.document_type)}</td>
                                    <td className="p-4 text-gray-500 dark:text-[#A8C4A8]">{formatDate(doc.uploaded_at)}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)} capitalize`}>
                                            {doc.status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {doc.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(doc.id)}
                                                        disabled={actionLoading}
                                                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors border-none cursor-pointer disabled:opacity-50"
                                                        title="Quick Approve"
                                                    >
                                                        <span className="material-symbols-outlined">check_circle</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openRejectModal(doc)}
                                                        disabled={actionLoading}
                                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border-none cursor-pointer disabled:opacity-50"
                                                        title="Quick Reject"
                                                    >
                                                        <span className="material-symbols-outlined">cancel</span>
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={async () => {
                                                    setSelectedDocument(doc);
                                                    setDocumentImageUrl(null);
                                                    // Load image with auth if it's an image
                                                    if (doc.mime_type?.startsWith('image/')) {
                                                        try {
                                                            const response = await fetch(`${api.defaults.baseURL}/admin/kyc/document/${doc.id}/view`, {
                                                                headers: {
                                                                    'Authorization': `Bearer ${token}`
                                                                }
                                                            });
                                                            if (response.ok) {
                                                                const blob = await response.blob();
                                                                const url = window.URL.createObjectURL(blob);
                                                                setDocumentImageUrl(url);
                                                            }
                                                        } catch (err) {
                                                            console.error('Failed to load document image:', err);
                                                        }
                                                    }
                                                }}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border-none cursor-pointer"
                                                title="View Details"
                                            >
                                                <span className="material-symbols-outlined">visibility</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-[#2D4A32] flex justify-between items-center transition-colors duration-300">
                    <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">
                        {documents.length} document{documents.length !== 1 ? 's' : ''} found
                    </p>
                </div>
            </div>

            {/* Details Modal */}
            {selectedDocument && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
                    setSelectedDocument(null);
                    setDocumentImageUrl(null);
                }}>
                    <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-fade-in-up transition-colors duration-300" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 dark:border-[#2D4A32] flex justify-between items-center transition-colors duration-300">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-[#E8F5E8] m-0">Document Details</h3>
                            <button onClick={() => setSelectedDocument(null)} className="text-gray-400 dark:text-[#A8C4A8] hover:text-gray-600 dark:hover:text-[#E8F5E8] border-none bg-transparent cursor-pointer transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Document Info */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-[#A8C4A8] uppercase tracking-wider mb-3">Document Information</h4>
                                    <div className="bg-gray-50 dark:bg-[#1A2E1D] p-4 rounded-xl space-y-3 transition-colors duration-300">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">Document ID</span>
                                            <span className="font-medium text-gray-900 dark:text-[#E8F5E8]">#{selectedDocument.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">Type</span>
                                            <span className="font-medium text-gray-900 dark:text-[#E8F5E8]">{formatDocumentType(selectedDocument.document_type)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">User ID</span>
                                            <span className="font-medium text-gray-900 dark:text-[#E8F5E8]">{selectedDocument.user_id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">User Name</span>
                                            <span className="font-medium text-gray-900 dark:text-[#E8F5E8]">{selectedDocument.user_name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">Uploaded</span>
                                            <span className="font-medium text-gray-900 dark:text-[#E8F5E8]">{formatDate(selectedDocument.uploaded_at)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">File Size</span>
                                            <span className="font-medium text-gray-900 dark:text-[#E8F5E8]">
                                                {selectedDocument.file_size ? `${(selectedDocument.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">Status</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(selectedDocument.status)}`}>
                                                {(selectedDocument.status || 'pending').toUpperCase()}
                                            </span>
                                        </div>
                                        {selectedDocument.rejection_reason && (
                                            <div className="pt-2 border-t border-gray-200 dark:border-[#2D4A32]">
                                                <span className="text-gray-500 dark:text-[#A8C4A8] text-sm">Rejection Reason:</span>
                                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{selectedDocument.rejection_reason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Document Preview */}
                            <div className="flex flex-col h-full">
                                <h4 className="text-sm font-semibold text-gray-500 dark:text-[#A8C4A8] uppercase tracking-wider mb-3">Document Preview</h4>
                                <div className="flex-grow bg-gray-100 dark:bg-[#1A2E1D] rounded-xl border-2 border-dashed border-gray-200 dark:border-[#2D4A32] flex items-center justify-center min-h-[300px] relative overflow-hidden group transition-colors duration-300">
                                    {selectedDocument.mime_type?.startsWith('image/') && documentImageUrl ? (
                                        <img 
                                            src={documentImageUrl}
                                            alt="Document"
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`text-center p-6 ${selectedDocument.mime_type?.startsWith('image/') && documentImageUrl ? 'hidden' : ''}`}>
                                        {loading && selectedDocument.mime_type?.startsWith('image/') ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 border-4 border-[#1A3F22] border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <p className="text-gray-500 dark:text-[#A8C4A8] text-sm">Loading document...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-6xl mb-2">
                                                    {selectedDocument.mime_type?.includes('pdf') ? 'picture_as_pdf' : 'image'}
                                                </span>
                                                <p className="text-gray-500 dark:text-[#A8C4A8] text-sm">{selectedDocument.mime_type || 'Document'}</p>
                                                <a 
                                                    href={`${api.defaults.baseURL}/admin/kyc/document/${selectedDocument.id}/view`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => {
                                                        // Add auth header to download
                                                        e.preventDefault();
                                                        fetch(`${api.defaults.baseURL}/admin/kyc/document/${selectedDocument.id}/view`, {
                                                            headers: {
                                                                'Authorization': `Bearer ${token}`
                                                            }
                                                        })
                                                        .then(res => res.blob())
                                                        .then(blob => {
                                                            const url = window.URL.createObjectURL(blob);
                                                            const a = document.createElement('a');
                                                            a.href = url;
                                                            a.download = `document-${selectedDocument.id}.${selectedDocument.mime_type?.includes('pdf') ? 'pdf' : 'jpg'}`;
                                                            a.click();
                                                            window.URL.revokeObjectURL(url);
                                                        })
                                                        .catch(err => {
                                                            console.error('Download failed:', err);
                                                            alert('Failed to download document');
                                                        });
                                                    }}
                                                    className="mt-3 inline-block px-4 py-2 bg-[#1A3F22] text-white rounded-lg text-sm font-medium hover:bg-[#14301a] transition-colors cursor-pointer"
                                                >
                                                    Download Document
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {selectedDocument.status === 'pending' && (
                            <div className="p-6 border-t border-gray-100 dark:border-[#2D4A32] bg-gray-50 dark:bg-[#1A2E1D] flex justify-end gap-3 transition-colors duration-300">
                                <button
                                    onClick={() => {
                                        setDocumentToReject(selectedDocument);
                                        setShowRejectModal(true);
                                    }}
                                    disabled={actionLoading}
                                    className="px-6 py-2 bg-[#E5EBE3] dark:bg-[#0D1B0F] border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 font-medium cursor-pointer transition-colors disabled:opacity-50"
                                >
                                    Reject Document
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedDocument.id)}
                                    disabled={actionLoading}
                                    className="px-6 py-2 bg-[#1A3F22] text-white rounded-xl hover:bg-[#14301a] font-medium border-none cursor-pointer shadow-lg shadow-green-900/10 transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? 'Processing...' : 'Approve Document'}
                                </button>
                            </div>
                        )}
                        {selectedDocument.status !== 'pending' && (
                            <div className="p-6 border-t border-gray-100 dark:border-[#2D4A32] bg-gray-50 dark:bg-[#1A2E1D] flex justify-end transition-colors duration-300">
                                <button
                                    onClick={() => setSelectedDocument(null)}
                                    className="px-6 py-2 bg-gray-200 dark:bg-[#243B28] text-gray-700 dark:text-[#E8F5E8] rounded-xl hover:bg-gray-300 dark:hover:bg-[#1A2E1D] font-medium border-none cursor-pointer transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowRejectModal(false)}>
                    <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up transition-colors duration-300" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 dark:border-[#2D4A32]">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-[#E8F5E8] m-0">Reject Document</h3>
                            <p className="text-gray-500 dark:text-[#A8C4A8] mt-1 text-sm">Please provide a reason for rejecting this document.</p>
                        </div>
                        
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#E8F5E8] mb-2">
                                Rejection Reason
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g., Document is blurry, expired, or does not match the user's information"
                                className="w-full p-3 border border-gray-200 dark:border-[#2D4A32] rounded-xl bg-white dark:bg-[#1A2E1D] text-gray-900 dark:text-[#E8F5E8] placeholder-gray-400 dark:placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#1A3F22] resize-none"
                                rows={4}
                            />
                        </div>
                        
                        <div className="p-6 border-t border-gray-100 dark:border-[#2D4A32] bg-gray-50 dark:bg-[#1A2E1D] flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setDocumentToReject(null);
                                    setRejectionReason('');
                                }}
                                className="px-6 py-2 bg-gray-200 dark:bg-[#243B28] text-gray-700 dark:text-[#E8F5E8] rounded-xl hover:bg-gray-300 dark:hover:bg-[#1A2E1D] font-medium border-none cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={actionLoading}
                                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium border-none cursor-pointer transition-colors disabled:opacity-50"
                            >
                                {actionLoading ? 'Rejecting...' : 'Reject Document'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IdentityVerification;
