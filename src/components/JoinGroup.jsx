import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const JoinGroup = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const availableGroups = [
    {
      id: 1,
      name: 'St. Mary\'s Church Fund',
      type: 'church',
      description: 'Monthly contributions for church development',
      members: 45,
      goal: 50000,
      current: 32000,
      privacy: 'public'
    },
    {
      id: 2,
      name: 'Family Emergency Fund',
      type: 'family',
      description: 'Emergency savings for family members',
      members: 12,
      goal: 25000,
      current: 18000,
      privacy: 'private'
    },
    {
      id: 3,
      name: 'Tech SACCO',
      type: 'sacco',
      description: 'Savings and credit for tech professionals',
      members: 89,
      goal: 100000,
      current: 75000,
      privacy: 'public'
    },
    {
      id: 4,
      name: 'College Friends Fund',
      type: 'friends',
      description: 'Reunion and travel fund',
      members: 8,
      goal: 15000,
      current: 12000,
      privacy: 'private'
    }
  ];

  const filteredGroups = availableGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGroupIcon = (type) => {
    const iconMap = {
      church: 'church',
      family: 'cottage',
      sacco: 'work',
      friends: 'groups',
    };
    return iconMap[type] || 'groups';
  };

  const getGroupGradient = (type) => {
    const gradientMap = {
      church: 'linear-gradient(135deg, #1A3F22, #58761B)',
      family: 'linear-gradient(135deg, #58761B, #D99201)',
      sacco: 'linear-gradient(135deg, #D99201, #905A01)',
      friends: 'linear-gradient(135deg, #1A3F22, #D99201)',
    };
    return gradientMap[type] || 'linear-gradient(135deg, #1A3F22, #58761B)';
  };

  const handleJoinGroup = (group) => {
    console.log('Joining group:', group);
    navigate('/community');
  };

  return (
    <div style={{ color: '#1A3F22' }}>
      <div style={{
        maxWidth: '384px',
        margin: '0 auto',
        backgroundColor: 'white',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
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
              backgroundColor: '#f3f4f6'
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#1A3F22', fontSize: '20px' }}>
              arrow_back
            </span>
          </button>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1A3F22',
            margin: 0
          }}>
            Join Group
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
          
          {/* Search */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
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
              <span 
                className="material-symbols-outlined" 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#6b7280', 
                  fontSize: '20px' 
                }}
              >
                search
              </span>
            </div>
          </div>

          {/* Available Groups */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Available Groups ({filteredGroups.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {/* Group Header */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: getGroupGradient(group.type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>
                        {getGroupIcon(group.type)}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A3F22', margin: 0 }}>
                        {group.name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        {group.members} members • {group.privacy}
                      </p>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: group.privacy === 'public' ? '#059669' : '#d97706',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: group.privacy === 'public' ? '#dcfce7' : '#fef3c7'
                    }}>
                      {group.privacy}
                    </span>
                  </div>

                  {/* Group Description */}
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                    {group.description}
                  </p>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Progress</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#1A3F22' }}>
                        ${group.current.toLocaleString()} / ${group.goal.toLocaleString()}
                      </span>
                    </div>
                    <div style={{
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        style={{
                          height: '8px',
                          background: getGroupGradient(group.type),
                          width: `${(group.current / group.goal) * 100}%`,
                          transition: 'width 0.8s ease-in-out',
                          borderRadius: '4px'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={() => handleJoinGroup(group)}
                    style={{
                      width: '100%',
                      backgroundColor: '#6f9c16',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7a12'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#6f9c16'}
                  >
                    Join Group
                  </button>
                </div>
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#E9F0E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '24px' }}>
                    search_off
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 8px 0' }}>
                  No groups found
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default JoinGroup;
