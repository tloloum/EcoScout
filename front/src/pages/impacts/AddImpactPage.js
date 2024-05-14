import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { ServerContext } from "../../contexts/Server";
import { AuthAdContext } from "../../contexts/AuthAd";
import { useNavigate } from "react-router-dom";

const AddImpactPage = () => {
  const [impactName, setImpactName] = useState([]);
  const navigate = useNavigate();
  const { structName: structName } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedImpact, setSelectedImpact] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [nombrePersonne, setNombrePersonne] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [verifCHoix, setVerifCHoix] = useState(false);
  const [event, setEvent] = useState([]);
  const [units, setUnits] = useState([]);
  const { getServerAddress } = useContext(ServerContext);
  const { myTokenAd } = useContext(AuthAdContext);

  const removeDoubleQuotes = (input) => {
    if (typeof input !== "string") {
      return input;
    }
    return input.replace(/"+/g, "");
  };

  const removeDuplicateByName = (impactName) => {
    const uniqueImpact = [];
    impactName.forEach((impact) => {
      if (!uniqueImpact.find((unique) => unique.nom_impact === impact.nom_impact)) {
        uniqueImpact.push(impact);
      }
    });
    return uniqueImpact;
  };

  const fetchAllName = async () => {
    const serverAddress = getServerAddress();
    const result = await fetch(`${serverAddress}impact/allname`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.ok) {
      const resultContent = await result.json();
      const sanitizedResults = resultContent.map((impact) => ({
        ...impact,
        nom_impact: removeDoubleQuotes(impact.nom_impact),
      }));
      const uniqueImpacts = removeDuplicateByName(sanitizedResults);
      setImpactName(uniqueImpacts);
    } else {
      console.log("Error fetching impact names");
    }
  };

  useEffect(() => {
    fetchAllName();
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    setDropdownVisible(true);
  };

  const handleImpactSelect = (impact) => {
    setSelectedImpact(impact);
    setDropdownVisible(false);
    setSearchInput(impact.nom_impact);
    setVerifCHoix(true);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleUnitChange = (e) => {
    setSelectedUnit(e.target.value);
  };

  const handleNombrePersonneChange = (e) => {
    setNombrePersonne(e.target.value);
  };
  
  const handleEventChange = (e) => {
    setSelectedEventId(e.target.value);
  };

  const filteredImpacts = impactName.filter((impact) =>
    impact.nom_impact.toLowerCase().includes(searchInput.toLowerCase())
  );

  const AddAnImpact = async () => {
    if (
      !selectedImpact ||
      !quantity ||
      !selectedUnit ||
      !selectedImpact.id_impact
    ) {
      console.log("Please fill in all fields");
      return;
    }

    if (
      !impactName.find(
        (impact) => impact.id_impact === selectedImpact.id_impact
      )
    ) {
      console.log("Invalid impact selected");
      return;
    }

    try {
      const serverAddress = getServerAddress();
      const result = await fetch(`${serverAddress}impact/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${myTokenAd}`,
        },
        body: JSON.stringify({
          id_evenement: selectedEventId,
          id_impact: selectedImpact.id_impact,
          valeur: quantity,
          nombre_personnes: nombrePersonne,
        }),
      });

      if (result.ok) {
        setSelectedImpact(null);
        setQuantity("");
        setSelectedUnit("");
        setNombrePersonne("");
        setVerifCHoix(false);
        setSelectedEventId("");
        navigate(`/homeStructAd/${structName}`);
      } else {
        console.log("Error adding impact");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    if (!verifCHoix || !selectedImpact) {
      return;
    }
    async function getUnits() {
      try {
        const serverAddress = getServerAddress();
        const result = await fetch(
          `${serverAddress}impact/getallunit/${selectedImpact.id_impact}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (result.ok) {
          const resultContent = await result.json();
          setUnits(resultContent);
        } else {
          console.log("Error fetching impact units");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    getUnits();
  }, [verifCHoix, selectedImpact]);

  useEffect(() => {
    async function getEvent() {
      try {
        const serverAddress = getServerAddress();
        const result = await fetch(`${serverAddress}events/allevents/${structName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${myTokenAd}`,
          },
        });

        if (result.ok) {
          const resultContent = await result.json();
          setEvent(resultContent);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }

    getEvent();
  }, [verifCHoix, selectedImpact]);

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    AddAnImpact(); // Call the function to add the impact
  };

  return (
    <div className="add-impact">
      <Sidebar />
      <div className="content">
        <h1>Add Impact</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="input-container">
            <input
              type="text"
              placeholder="Search for impact name"
              value={searchInput}
              onChange={handleSearchInputChange}
              className="search-bar"
            />
          </div>
          {selectedImpact && (
            <div className="input-container">
              <input
                type="number"
                placeholder={`Enter quantity for ${selectedImpact.nom_impact}`}
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-input"
              />
              <select
                value={selectedUnit}
                onChange={handleUnitChange}
                className="unit-select"
              >
                <option value="">Select Unit</option>
                {units.map((unit, index) => (
                  <option key={index} value={unit.unite}>
                    {unit.unite}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedImpact && (
            <div className="nombre-personne">
              <input
                type="number"
                placeholder="Nombre de personnes"
                value={nombrePersonne}
                onChange={handleNombrePersonneChange}
                className="quantity-input"
              />
            </div>
          )}

          {selectedImpact && (
            <div className="choice_event">
              <select 
                value={selectedEventId}
                onChange={handleEventChange}
                className="event-select"
              >
                <option value="">Choisir un événement</option>
                {event.map((event, index) => (
                  <option key={index} value={event.id_evenement}>
                    {event.nom_evenement} {event.date_debut.slice(0,10)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedImpact && <button type="submit">Add Impact</button>}
        </form>

        {dropdownVisible && (
          <ul className="impact-list">
            {filteredImpacts.map((impact) => (
              <li
                key={impact.id_impact}
                className="impact-item"
                onClick={() => handleImpactSelect(impact)}
              >
                {impact.nom_impact}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddImpactPage;
