import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const CreateGoal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    category: 'general',
    description: '',
    frequency: 'monthly'
  });

  const categories = [
    { id: 'general', label: 'General Savings', icon: 'savings', color: '#6f9c16' },
    { id: 'emergency', label: 'Emergency Fund', icon: 'emergency', color: '#dc2626' },
    { id: 'vacation', label: 'Vacation', icon: 'flight', color: '#2563eb' },
    { id: 'education', label: 'Education', icon: 'school', color: '#7c3aed' },
    { id: 'home', label: 'Home Purchase', icon: 'home', color: '#059669' },
    { id: 'car', label: 'Car Purchase', icon: 'directions_car', color: '#d97706' },
    { id: 'wedding', label: 'Wedding', icon: 'favorite', color: '#ec4899' },
    { id: 'retirement', label: 'Retirement', icon: 'elderly', color: '#6b7280' }
  ];

  const frequencies = [
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'yearly', label: 'Yearly' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating savings goal:', formData);
    navigate('/savings');
  };

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
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
            onClick={() => navigate('/savings')}
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
            Create Goal
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
              
              {/* Goal Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A3F22',
                  marginBottom: '8px'
                }}>
                  Goal Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Emergency Fund, Vacation Savings"
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

              {/* Target Amount */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A3F22',
                  marginBottom: '8px'
                }}>
                  Target Amount
                </label>
                <input
                  type="text"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={(e) => {
                    const formatted = formatAmount(e.target.value);
                    setFormData({ ...formData, targetAmount: formatted });
                  }}
                  placeholder="$0.00"
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

              {/* Target Date */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A3F22',
                  marginBottom: '8px'
                }}>
                  Target Date
                </label>
                <input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleChange}
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

              {/* Category */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A3F22',
                  marginBottom: '12px'
                }}>
                  Category
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => setFormData({ ...formData, category: category.id })}
                      style={{
                        backgroundColor: formData.category === category.id ? '#f0f9ff' : 'white',
                        borderRadius: '16px',
                        padding: '16px',
                        border: formData.category === category.id ? '2px solid #6f9c16' : '1px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: `${category.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px auto'
                      }}>
                        <span className="material-symbols-outlined" style={{ 
                          color: category.color, 
                          fontSize: '20px' 
                        }}>
                          {category.icon}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                        {category.label}
                      </h3>
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
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add notes about your savings goal..."
                  rows={3}
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

              {/* Contribution Frequency */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A3F22',
                  marginBottom: '12px'
                }}>
                  Contribution Frequency
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {frequencies.map((freq) => (
                    <label key={freq.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="frequency"
                        value={freq.id}
                        checked={formData.frequency === freq.id}
                        onChange={handleChange}
                        style={{ marginRight: '12px' }}
                      />
                      <span style={{ fontSize: '14px', color: '#1A3F22' }}>{freq.label}</span>
                    </label>
                  ))}
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
                Create Goal
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

export default CreateGoal;
