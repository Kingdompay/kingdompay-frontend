import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import BottomNav from './BottomNav';

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('/api/community/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching community groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const getGroupIcon = (type) => {
    const iconMap = {
      church: 'church',
      family: 'cottage',
      sacco: 'work',
    };
    
    return iconMap[type] || 'groups';
  };

  const getGroupGradient = (type) => {
    const gradientMap = {
      church: 'linear-gradient(135deg, #1A3F22, #58761B)',
      family: 'linear-gradient(135deg, #58761B, #D99201)',
      sacco: 'linear-gradient(135deg, #D99201, #905A01)',
    };
    
    return gradientMap[type] || 'linear-gradient(135deg, #1A3F22, #58761B)';
  };

  return (
    <div style={{ backgroundColor: '#1A3F22' }}>
      <div style={{
        maxWidth: '384px',
        margin: '0 auto',
        backgroundColor: '#F7F7F7',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Fixed Header */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          maxWidth: '384px',
          margin: '0 auto',
          zIndex: 10
        }}>
          <div style={{
            background: 'rgba(26, 63, 34, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '48px 24px 20px 24px',
            borderBottom: '1px solid rgba(217, 146, 1, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/home" style={{ color: '#D99201', opacity: 0.8, transition: 'opacity 0.3s', textDecoration: 'none' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
              </Link>
              <h1 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                margin: 0
              }}>Community Wallets</h1>
              <button 
                onClick={() => navigate('/create-group')}
                style={{ color: '#D99201', opacity: 0.8, transition: 'opacity 0.3s', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>add</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div style={{
          flexGrow: 1,
          paddingTop: '128px',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <div style={{
                  animation: 'spin 1s linear infinite',
                  borderRadius: '12px',
                  height: '32px',
                  width: '32px',
                  borderBottom: '2px solid #D99201',
                  margin: '0 auto'
                }}></div>
                <p style={{ color: 'white', marginTop: '8px', margin: '8px 0 0 0' }}>Loading groups...</p>
              </div>
            ) : groups.length > 0 ? (
              groups.map((group, index) => (
                <div 
                  key={index} 
                  style={{
                    background: getGroupGradient(group.type),
                    padding: '20px',
                    borderRadius: '16px',
                    boxShadow: hoveredCard === `group-${index}` ? '0 20px 40px -8px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: 'white',
                    transform: hoveredCard === `group-${index}` ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredCard(`group-${index}`)}
                  onMouseLeave={() => setHoveredCard('')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{group.name}</h2>
                      <p style={{ fontSize: '14px', opacity: 0.8, margin: '4px 0 0 0' }}>{group.description}</p>
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', opacity: 0.9 }}>
                      {getGroupIcon(group.type)}
                    </span>
                  </div>
                  
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>Group Balance</p>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px', margin: '4px 0 0 0' }}>
                      ${group.balance?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px', fontSize: '14px', opacity: 0.8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '4px' }}>groups</span>
                    <span>{group.members?.length || 0} Members</span>
                  </div>
                  
                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <button 
                      onClick={() => navigate('/quick-save')}
                      style={{
                        flex: 1,
                        backgroundColor: '#D99201',
                        color: '#1A3F22',
                        fontWeight: 'bold',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                      }}
                    >Contribute</button>
                    
                    <button 
                      onClick={() => navigate('/send-money')}
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    >Withdraw</button>
                    
                    {(group.type === 'church' || group.type === 'sacco') && (
                      <button 
                        onClick={() => navigate('/request-money')}
                        style={{
                          flex: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontWeight: 'bold',
                          padding: '8px 12px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >Fundraise</button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <p style={{ color: 'white', margin: 0 }}>No community groups yet</p>
              </div>
            )}
          </div>
          
          {/* Announcements Section */}
          <div style={{ padding: '0 24px', marginTop: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>Announcements & Updates</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <span className="material-symbols-outlined" style={{ color: '#1A3F22', fontSize: '20px' }}>campaign</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', color: '#1A3F22', margin: 0 }}>Church Fundraiser Update</p>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', margin: '4px 0 0 0' }}>
                      We've reached 75% of our goal for the new community hall! Thank you for your generous contributions.
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', margin: '8px 0 0 0' }}>2 hours ago</p>
                  </div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <span className="material-symbols-outlined" style={{ color: '#905A01', fontSize: '20px' }}>event</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', color: '#1A3F22', margin: 0 }}>Family Vacation Plan</p>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', margin: '4px 0 0 0' }}>
                      Reminder: Please vote on the destination for our family trip by this Friday. Check the group chat for the poll.
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', margin: '8px 0 0 0' }}>Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Community;