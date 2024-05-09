import React, { useContext, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { ServerContext } from "../contexts/Server";
import "../styles/AddImpact.scss";
import { AuthAdContext } from "../contexts/AuthAd";

const AddImpact = () => {
  const [impactName, setImpactName] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedImpact, setSelectedImpact] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [verifCHoix, setVerifCHoix] = useState(false);
  const [units, setUnits] = useState([]);
  const [nomEvent, setNomEvent] = useState([]);
  const { getServerAddress } = useContext(ServerContext);
  const { myTokenAd } = useContext(AuthAdContext);

  // Function to remove all double quotes from a string
  const removeDoubleQuotes = (input) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected a string as input.");
    }
    return input.replace(/"+/g, "");
  };

  // Function to remove duplicates from an array based on a specific key
  const removeDuplicatesByKey = (array, key) => {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  };

  // Fetch all impact names from the server
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
      const uniqueImpacts = removeDuplicatesByKey(
        sanitizedResults,
        "id_impact"
      );
      setImpactName(uniqueImpacts);
    } else {
      console.log("Error fetching impact names");
    }
  };

  // Fetch data once on component mount
  useEffect(() => {
    fetchAllName();
  }, []);

  // Update the search input value and make the dropdown visible
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    setDropdownVisible(true);
  };

  // Select the impact and show the quantity input
  const handleImpactSelect = (impact) => {
    setSelectedImpact(impact);
    setDropdownVisible(false);
    setSearchInput(impact.nom_impact); // Update the search input to the name string
    setVerifCHoix(true);
  };

  // Update the selected quantity value
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  // Update the selected unit value
  const handleUnitChange = (e) => {
    setSelectedUnit(e.target.value);
  };

  // Filter results based on search input
  const filteredImpacts = impactName.filter((impact) =>
    impact.nom_impact.toLowerCase().includes(searchInput.toLowerCase())
  );

  const AddAnImpact = async () => {
    if (!selectedImpact || !quantity || !selectedUnit) {
      console.log("Please fill in all fields");
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
          id_evenement: 1, // Replace with actual event ID
          id_impact: selectedImpact.id_impact,
          valeur: quantity,
          nombre_personnes: 1, // Replace with actual number of people
        }),
      });

      if (result.ok) {
        console.log("Impact added successfully");
        setSelectedImpact(null);
        setQuantity("");
        setSelectedUnit("");
      } else {
        console.log("Error adding impact");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Fetch units when an impact is selected
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
          console.log("Units:", resultContent);
          setUnits(resultContent); // Assuming `resultContent` is an array of unit names
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
    if (!selectedImpact) {
      return;
    }
    async function getEvents() {
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
          console.log("Events:", resultContent);
          setNomEvent(resultContent); // Assuming `resultContent` is an array of event names
        } else {
          console.log("Error fetching events");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    getEvents();
  }, [selectedImpact]);

  return (
    <div className="add-impact">
      <Sidebar />
      <div className="content">
        <h1>Add Impact</h1>
        <form>
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
                className="quantity-input"
              />
            </div>
          )}

          {selectedImpact && (
            <div className="choice_event">
              <select>

              </select>
            </div>
          )}

          {selectedImpact && (
            <button type="button" onClick={AddAnImpact}>
              Add Impact
            </button>
          )}
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

export default AddImpact;
