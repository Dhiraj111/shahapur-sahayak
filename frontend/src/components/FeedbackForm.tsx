import React, { useState } from 'react';
import './FeedbackForm.css';

interface FeedbackData {
  type: 'suggestion' | 'bug' | 'safety' | 'store' | '';
  message: string;
  contact: string;
}

const FeedbackForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData>({
    type: '',
    message: '',
    contact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.type || !feedback.message.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call (in real app, this would send to backend)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, just log to console (in real app, would send to server)
    console.log('Feedback submitted:', feedback);
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
      setFeedback({ type: '', message: '', contact: '' });
    }, 3000);
  };

  const handleInputChange = (field: keyof FeedbackData, value: string) => {
    setFeedback(prev => ({ ...prev, [field]: value }));
  };

  const feedbackTypes = [
    { value: 'suggestion', label: '💡 Suggestion', description: 'Ideas to improve the app' },
    { value: 'bug', label: '🐛 Bug Report', description: 'Something is not working' },
    { value: 'safety', label: '⚠️ Safety Issue', description: 'Report dangerous crossing points' },
    { value: 'store', label: '🏪 Store Info', description: 'Update store details or timings' }
  ];

  if (!isOpen) {
    return (
      <button 
        className="feedback-toggle"
        onClick={() => setIsOpen(true)}
        title="Send Feedback"
      >
        💬 Feedback
      </button>
    );
  }

  return (
    <div className="feedback-overlay">
      <div className="feedback-form">
        <div className="feedback-header">
          <h3>📝 Send Feedback</h3>
          <button 
            className="close-button"
            onClick={() => setIsOpen(false)}
            title="Close"
          >
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h4>Thank you for your feedback!</h4>
            <p>We appreciate your input and will review it soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>What type of feedback is this?</label>
              <div className="feedback-types">
                {feedbackTypes.map((type) => (
                  <label key={type.value} className="feedback-type-option">
                    <input
                      type="radio"
                      name="feedbackType"
                      value={type.value}
                      checked={feedback.type === type.value}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                    />
                    <div className="option-content">
                      <span className="option-label">{type.label}</span>
                      <span className="option-description">{type.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message *</label>
              <textarea
                id="message"
                value={feedback.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Tell us what you think or what needs improvement..."
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact (Optional)</label>
              <input
                type="text"
                id="contact"
                value={feedback.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                placeholder="Phone number or email (if you want a response)"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={!feedback.type || !feedback.message.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Feedback'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;