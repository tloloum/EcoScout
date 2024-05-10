// ObjectiveCreationComponent.js

import React, { useState } from 'react';

function ObjectiveCreate() {
  const [objectiveData, setObjectiveData] = useState({
    name: '',
    description: ''
    // Add any other properties for the objective as needed
  });

  const handleChange = (e) => {
    setObjectiveData({
      ...objectiveData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventId = 'your_event_id_here'; // Replace with the actual event ID

    try {
      const response = await fetch(`/events/${eventId}/objectives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers as needed, e.g., authentication token
        },
        body: JSON.stringify(objectiveData),
      });

      if (!response.ok) {
        throw new Error('Failed to create objective');
      }

      const responseData = await response.json();
      console.log('Objective created successfully:', responseData);
      // Optionally, you can perform some action after creating the objective, such as updating the UI

    } catch (error) {
      console.error('Error creating objective:', error.message);
      // Optionally, handle the error or show a user-friendly message
    }
  };

  return (
    <div>
      <h2>Create Objective</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={objectiveData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={objectiveData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        {/* Add more input fields for additional properties if needed */}
        <button type="submit">Create Objective</button>
      </form>
    </div>
  );
}

export default ObjectiveCreate;
