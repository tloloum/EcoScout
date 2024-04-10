import React from "react";

const Sidebar = ({ isOpen, onClose, structures, isAuthenticated }) => {
  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="toggle-button" onClick={onClose}>
        {isOpen ? "←" : "→"}
      </div>
      <ul>
        {structures.map((structure) => (
          <li key={structure.id}>{structure.name}</li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
