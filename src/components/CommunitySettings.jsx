import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { generateInviteLink, getCommunityDetails, getCommunityMembers } from '../services/api';

const CommunitySettings = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { communities, user } = useAuth();

  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingInvite, setGeneratingInvite] = useState(false);
  const [inviteError, setInviteError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const id = parseInt(communityId, 10);
        // Try from context first for instant UI
        let found = communities?.find(c => c.id === id) || null;

        // Always refetch latest details from backend
        try {
          const details = await getCommunityDetails(id);
          if (details?.community) {
            found = details.community;
          }
        } catch (e) {
          console.warn('Failed to fetch community details:', e);
        }

        setCommunity(found);

        if (!found) {
          setError('Community not found');
          setLoading(false);
          return;
        }

        // Generate a fresh invite token for this community (owner/admin)
        // Don't block page load if this fails - user can retry with button
        if (found.owner_user_id === user?.id) {
          try {
            const inviteRes = await generateInviteLink(found.id);
            if (inviteRes?.success && inviteRes?.invite?.token) {
              setInviteCode(inviteRes.invite.token);
              setInviteError(''); // Clear any previous errors
            } else {
              console.warn('No token in invite response:', inviteRes);
              setInviteError('Failed to generate invite code. Please try again.');
            }
          } catch (e) {
            console.error('Failed to generate invite link:', e);
            const errorMsg = e?.response?.data?.message || e?.message || 'Failed to generate invite code';
            setInviteError(`Could not generate invite code: ${errorMsg}`);
          }
        }

        // Load member list
        try {
          const membersRes = await getCommunityMembers(id);
          setMembers(membersRes?.members || []);
        } catch (e) {
          console.warn('Failed to load community members:', e);
        }
      } catch (e) {
        console.error(e);
        setError('Failed to load community settings');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [communityId, communities, user]);

  const handleGenerateInvite = async () => {
    if (!community || !user || community.owner_user_id !== user.id) return;
    setGeneratingInvite(true);
    setInviteError('');
    try {
      const inviteRes = await generateInviteLink(community.id);
      if (inviteRes?.success && inviteRes?.invite?.token) {
        setInviteCode(inviteRes.invite.token);
        setInviteError(''); // Clear any errors on success
      } else {
        setInviteError('No invite token received from server');
      }
    } catch (e) {
      console.error('Failed to generate invite link:', e);
      const errorMsg = e?.response?.data?.message || e?.message || 'Failed to generate invite code';
      setInviteError(`Could not generate invite code: ${errorMsg}`);
    } finally {
      setGeneratingInvite(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-[#1A3F22] dark:text-[#81C784] animate-spin">
            progress_activity
          </span>
          <p className="mt-4 text-[#1A3F22] dark:text-[#E8F5E8]">Loading community...</p>
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-300 font-medium mb-4">{error || 'Community not found'}</p>
          <button
            onClick={() => navigate('/community')}
            className="px-4 py-2 rounded-xl bg-[#1A3F22] text-white font-medium border-none cursor-pointer"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] flex justify-center font-sans transition-colors duration-300">
      <div className="w-full max-w-4xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl overflow-hidden">
        <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-[#2D4A32] bg-white/70 dark:bg-[#0D1B0F]/80 backdrop-blur-md">
          <button
            onClick={() => navigate('/community')}
            className="flex items-center gap-1 text-[#1A3F22] dark:text-[#E8F5E8] bg-transparent border-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-lg md:text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">
            Manage Community
          </h1>
          <div className="w-8" />
        </header>

        <main className="p-4 md:p-6 space-y-6">
          {/* Community summary */}
          <section className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-[#2D4A32]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-1">
                  {community.name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-[#A8C4A8] capitalize">
                  {community.type?.toLowerCase()}
                </p>
                {community.settings_json?.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-[#A8C4A8]">
                    {community.settings_json.description}
                  </p>
                )}
              </div>
              {community.owner_user_id === user?.id && (
                <span className="bg-[#D99201]/15 text-[#D99201] text-xs px-2 py-1 rounded-full font-medium">
                  You are the owner
                </span>
              )}
            </div>
          </section>

          {/* Invite code */}
          {community.owner_user_id === user?.id && (
            <section className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-[#2D4A32]">
              <h3 className="text-sm font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">
                Invite Code
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#A8C4A8] mb-3">
                Share this code with others so they can join your community via the Join screen.
              </p>
              {inviteError && (
                <div className="mb-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-600 dark:text-red-400">{inviteError}</p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32]">
                  <span className="font-mono text-sm text-[#1A3F22] dark:text-[#E8F5E8] tracking-wider">
                    {inviteCode || 'No code yet'}
                  </span>
                </div>
                {inviteCode ? (
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(inviteCode)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#1A3F22] text-white text-xs font-medium border-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    Copy
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateInvite}
                    disabled={generatingInvite}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#1A3F22] text-white text-xs font-medium border-none cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {generatingInvite ? 'progress_activity' : 'refresh'}
                    </span>
                    {generatingInvite ? 'Generating...' : 'Generate Code'}
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Members list */}
          <section className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-[#2D4A32]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">
                Members ({members.length})
              </h3>
            </div>
            {members.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-[#A8C4A8]">
                No members yet. Share the invite code to start growing your community.
              </p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-[#2D4A32]">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8] m-0">
                        {m.full_name || 'Member'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">
                        {m.phone_number || '-'}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-[#243B28] text-gray-700 dark:text-[#E8F5E8] capitalize">
                      {m.role?.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default CommunitySettings;

