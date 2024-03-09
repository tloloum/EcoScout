import React from "react";

const Sidebar = ({ isOpen, onClose, structures }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <button onClick={onClose}>Menu</button>
      <ul>
        {structures.map((structure) => (
          <li key={structure.id}>{structure.name}</li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
