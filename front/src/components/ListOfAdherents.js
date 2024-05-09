// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../contexts/Auth";
// import { AuthAdContext } from "../contexts/AuthAd";
// import { ServerContext } from "../contexts/Server";

// const ListOfAdherents = (props) => {
//   const { myToken, myUserId } = useContext(AuthContext);
//   const { getServerAddress } = useContext(ServerContext);
//   const { setTokenAd, setUserIdAd, setAdherentId, loginAd, setFirstNameAd } =
//     useContext(AuthAdContext);

//   const navigate = useNavigate();
//   const [adherents, setAdherents] = useState([]);

//   useEffect(() => {
//     const serverAddress = getServerAddress();

//     // Partie recherche des Adherents

//     async function showAdherents() {
//       if (!myToken || !myUserId) {
//         return;
//       }

//       console.log(serverAddress + "user/" + myUserId + "/adherents");

//       const resultAdherent = await fetch(
//         serverAddress + "user/" + myUserId + "/adherents",
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + myToken,
//           },
//         }
//       );

//       if (resultAdherent.status !== 200) {
//         console.log("Erreur lors de la récupération des adhérents");
//         return;
//       } else {
//         const resultAdherentContent = await resultAdherent.json();
//         // console.log(resultAdherentContent);
//         if (resultAdherentContent.length > 0) {
//           setAdherents(resultAdherentContent);
//           //sethaveAd(true);
//         }
//       }
//     }
//     showAdherents();
//   }, [getServerAddress, myToken, myUserId]);

//   async function loginAdherent(adherentId, prenom) {
//     const serverAddress = getServerAddress();
//     console.log(serverAddress + "user/login-adherent");

//     const resultLoginAdherent = await fetch(
//       serverAddress + "user/login-adherent",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + myToken,
//         },
//         body: JSON.stringify({
//           adherentId: adherentId,
//         }),
//       }
//     );

//     if (resultLoginAdherent.status !== 200) {
//       console.log("Erreur lors de la connexion de l'adhérent");
//       return;
//     } else {
//       /* Les fonctions de AuthAd ne sont pas activé*/
//       const resultLoginAdherentContent = await resultLoginAdherent.json();
//       setTokenAd(resultLoginAdherentContent.token);
//       setUserIdAd(resultLoginAdherentContent.userId);
//       setFirstNameAd(prenom);
//       setAdherentId(adherentId);
//       loginAd();
//       navigate("/homead");
//     }
//   }

//   const newAdherent = () => {
//     const buttonNew = props.buttonNew;

//     if (buttonNew === true) {
//       return (
//         <li>
//           <button
//             className="choose-adherant-container"
//             id="create-profile"
//             onClick={() => navigate("/registerAdherent")}
//           ></button>
//         </li>
//       );
//     } else {
//       return;
//     }
//   };

//   return (
//     <div className="choose-adherant">
//       <ul>
//         {adherents.map((adherent) => (
//           <li key={adherent.id_adherent}>
//             <button
//               className="choose-adherant-container"
//               onClick={() => {
//                 loginAdherent(adherent.id_adherent, adherent.prenom_ad);
//               }}
//             >
//               {adherent.nom_ad} {adherent.prenom_ad}
//             </button>
//           </li>
//         ))}
//         {newAdherent()}
//       </ul>
//     </div>
//   );
// };

// export default ListOfAdherents;

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";

const ListOfAdherents = (props) => {
  let i = 0;
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);
  const { setTokenAd, setUserIdAd, setAdherentId, loginAd, setFirstNameAd } =
    useContext(AuthAdContext);

  const navigate = useNavigate();
  const [adherents, setAdherents] = useState([]);
  useEffect(() => {
    const serverAddress = getServerAddress();

    async function fetchAdherents() {
      if (!myToken || !myUserId) {
        return;
      }

      const resultAdherent = await fetch(
        `${serverAddress}user/${myUserId}/adherents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myToken,
          },
        }
      );
      if (resultAdherent.status !== 200) {
        console.log("Erreur lors de la récupération des adhérents");
        return;
      }

      const resultAdherentContent = await resultAdherent.json();
      if (resultAdherentContent.length > 0) {
        console.log("changing adherents");
        console.log(resultAdherentContent);
        setAdherents(resultAdherentContent);
      }
    }

    fetchAdherents();
  }, [getServerAddress, myToken, myUserId]);

  const loginAdherent = async (adherentId, prenom) => {
    const serverAddress = getServerAddress();

    const resultLoginAdherent = await fetch(
      `${serverAddress}user/login-adherent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + myToken,
        },
        body: JSON.stringify({
          adherentId: adherentId,
        }),
      }
    );

    if (resultLoginAdherent.status !== 200) {
      console.log("Erreur lors de la connexion de l'adhérent");
      return;
    }

    const resultLoginAdherentContent = await resultLoginAdherent.json();
    setTokenAd(resultLoginAdherentContent.token);
    setUserIdAd(resultLoginAdherentContent.userId);
    setFirstNameAd(prenom);
    setAdherentId(adherentId);
    loginAd();
    navigate("/homead");
  };

  const handleDeleteAdherent = async (adherentId) => {
    const serverAddress = getServerAddress();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet adhérent ?")) {
      const result = await fetch(
        `${serverAddress}user/${myUserId}/adherents/${adherentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myToken,
          },
        }
      );
      console.log(result.status);
      if (result.status === 200) {
        // Remove the deleted adherent from the local state
        setAdherents((prevAdherents) =>
          prevAdherents.filter(
            (adherent) => adherent.id_adherent !== adherentId
          )
        );
      } else {
        console.log("Erreur lors de la suppression de l'adhérent");
      }
    }
  };

  const newAdherent = () => {
    const buttonNew = props.buttonNew;

    if (buttonNew === true) {
      return (
        <li>
          <button
            className="choose-adherant-container"
            id="create-profile"
            onClick={() => navigate("/registerAdherent")}
          ></button>
        </li>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="choose-adherant">
      <ul>
        {adherents.map((adherent) => (
          <li key={adherent.id_adherent}>
            <button
              className="choose-adherant-container"
              onClick={() => {
                loginAdherent(adherent.id_adherent, adherent.prenom_ad);
              }}
            >
              {adherent.nom_ad} {adherent.prenom_ad}
            </button>
            <center>
              <button
                className="delete-button"
                onClick={() => handleDeleteAdherent(adherent.id_adherent)}
              >
                Supprimer
              </button>
            </center>
          </li>
        ))}
        {newAdherent()}
      </ul>
    </div>
  );
};

export default ListOfAdherents;
