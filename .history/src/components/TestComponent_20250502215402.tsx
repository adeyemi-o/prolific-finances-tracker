import React from 'react';

function TestComponent() {
  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Test Component</h1>
      <p>If you can see this, React is rendering correctly.</p>
    </div>
  );
}

export default TestComponent;