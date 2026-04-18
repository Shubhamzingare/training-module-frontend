import React, { useState } from 'react';

const FAQs = ({ faqs = [], loading = false }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (loading) {
    return <div className="faqs-loading">Loading FAQs...</div>;
  }

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className="faqs-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div key={idx} className="faq-item">
            <button
              className="faq-question"
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            >
              <span className="faq-icon">
                {expandedIndex === idx ? '−' : '+'}
              </span>
              <span>{faq.question}</span>
            </button>
            {expandedIndex === idx && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
