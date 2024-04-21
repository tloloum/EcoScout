import React, {useState} from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const switchSidebar = () => {
    setIsOpen(!isOpen);
  };

  const structures = [
    { id: 1, name: "Structure 1" },
    { id: 2, name: "Structure 2" },
    { id: 3, name: "Structure 3" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="toggle-button" onClick={switchSidebar}>
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
