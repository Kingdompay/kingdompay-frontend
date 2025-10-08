import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import BottomNav from './BottomNav';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    name: '',
    type: 'church',
    description: '',
    goal: '',
    privacy: 'public'
  });

  const groupTypes = [
    { id: 'church', label: 'Church', icon: 'church', description: 'Religious community group' },
    { id: 'family', label: 'Family', icon: 'cottage', description: 'Family savings group' },
    { id: 'sacco', label: 'SACCO', icon: 'work', description: 'Savings and credit cooperative' },
    { id: 'friends', label: 'Friends', icon: 'groups', description: 'Friend group savings' },
    { id: 'business', label: 'Business', icon: 'business', description: 'Business investment group' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating group:', formData);
    navigate('/community');
  };

  return (
    <div style={{ color: isDarkMode ? 'var(--text-primary)' : '#1A3F22' }}>
      <div style={{
        maxWidth: '384px',
        margin: '0 auto',
        backgroundColor: isDarkMode ? 'var(--bg-primary)' : 'white',
        boxShadow: isDarkMode ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: isDarkMode ? 'var(--bg-surface)' : 'white',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '16px 24px',
          borderBottom: isDarkMode ? '1px solid var(--border-color)' : '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => navigate('/community')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isDarkMode ? 'var(--bg-secondary)' : '#f3f4f6'
            }}
          >
            <span className="material-symbols-outlined" style={{ color: isDarkMode ? 'var(--text-primary)' : '#1A3F22', fontSize: '20px' }}>
              arrow_back
            </span>
          </button>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: isDarkMode ? 'var(--text-primary)' : '#1A3F22',
            margin: 0
          }}>
            Create Group
          </h1>
          <div style={{ width: '40px' }}></div>
        </header>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          paddingBottom: '100px'
        }}>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Group Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isDarkMode ? 'var(--text-primary)' : '#1A3F22',
                  marginBottom: '8px'
                }}>
                  Group Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter group name"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: isDarkMode ? '2px solid var(--border-color)' : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: isDarkMode ? 'var(--bg-surface)' : '#f9fafb',
                    color: isDarkMode ? 'var(--text-primary)' : '#1A3F22',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6f9c16'}
                  onBlur={(e) => e.target.style.borderColor = isDarkMode ? 'var(--border-color)' : '#e5e7eb'}
                />
              </div>

              {/* Group Type */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A3F22',
                  marginBottom: '12px'
                }}>
                  Group Type
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {groupTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setFormData({ ...formData, type: type.id })}
                      style={{
                        backgroundColor: formData.type === type.id ? '#f0f9ff' : 'white',
                        borderRadius: '16px',
                        padding: '16px',
                        border: formData.type === type.id ? '2px solid #6f9c16' : '1px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: formData.type === type.id ? '#E9F0E1' : '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px'
                        }}>
                          <span className="material-symbols-outlined" style={{ 
                            color: formData.type === type.id ? '#58761B' : '#6b7280', 
                            fontSize: '20px' 
                          }}>
                            {type.icon}
                          </span>
                        </div>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                            {type.label}
                          </h3>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A3F22',
                  marginBottom: '8px'
                }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your group's purpose..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: '#f9fafb',
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6f9c16'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Savings Goal */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A3F22',
                  marginBottom: '8px'
                }}>
                  Savings Goal (Optional)
                </label>
                <input
                  type="number"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  placeholder="Enter target amount"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: '#f9fafb',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6f9c16'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Privacy Settings */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A3F22',
                  marginBottom: '12px'
                }}>
                  Privacy
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={formData.privacy === 'public'}
                      onChange={handleChange}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#1A3F22' }}>Public - Anyone can join</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={formData.privacy === 'private'}
                      onChange={handleChange}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#1A3F22' }}>Private - Invite only</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#6f9c16',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7a12'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6f9c16'}
              >
                Create Group
              </button>
            </div>
          </form>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default CreateGroup;
