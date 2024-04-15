import React, { useContext, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { AuthContext } from "../contexts/Auth";
import { ServerContext } from "../contexts/Server";

const CreateStructure = (props) => {
  const { getServerAddress } = useContext(ServerContext);

  const { myToken } = useContext(AuthContext);

  const [nameStructure, setNameStructure] = useState("");
  const [regionStructure, setRegionStructure] = useState("");
  const [dateStructure, setDateStructure] = useState("");

  const handleNameStructureChange = (event) => {
    setNameStructure(event.target.value);
  };

  const handleRegionStructureChange = (event) => {
    setRegionStructure(event.target.value);
  };

  const handleDateStructureChange = (event) => {
    setDateStructure(event.target.value);
  };

  // const defaultFormData = {
  //   name: "",
  //   region: "",
  //   date: "",
  // };

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: defaultFormData,
  // });

  // console.log(errors);
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    setShowForm(true);
  };

  // const handleUndo = () => {
  //   reset();
  // };

  async function structureSubmit(event) {
    event.preventDefault();
    const serverAddress = getServerAddress();
    console.log(serverAddress + "structures");

    // Creation du compte :
    const resultStructure = await fetch(serverAddress + "structures/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + myToken,
      },
      body: JSON.stringify({
        nom_structure: nameStructure,
      }),
    });

    if (resultStructure.status !== 201) {
      console.log("Erreur lors de la création de la structure");
      return;
    } else {
      console.log(serverAddress + "structures");
      const resultStructureContent = await resultStructure.json();
      console.log(resultStructureContent);
    }

    //   if (resultToken.status !== 200) {
    //     setErreurMessage("Identifiant ou mot de passe incorrect");
    //     return;
    //   } else {
    //     const resultTokenContent = await resultToken.json();
    //     setUserId(resultTokenContent.userId);
    //     setToken(resultTokenContent.token);
    //     login(email, password);
    //     navigate("/chooseadherant");
    //   }
    // }
    setShowForm(false);
  }

  // const onSubmit = (data) => {
  //   console.log(data);
  //   handleUndo();
  //   setShowForm(false);
  // };

  const blueButton = () => {
    return (
      <button className="primaryBtn" onClick={handleClick}>
        Créer une structure
      </button>
    );
  };

  const newStructureButton = () => {
    return <button className="content-void" onClick={handleClick}></button>;

    //return <button className="create-profile" onClick={handleClick}></button>;
  };

  const chooseButton = (props) => {
    const numId = props.argument;
    console.log(numId);
    console.log(typeof numId);

    if (numId === 0) {
      return blueButton();
    } else {
      return newStructureButton();
    }
  };

  /* 
    It's need a button with "onClick={handleClick}"
  */
  const buttonAction = (myButton) => {
    return (
      <main>
        {myButton}
        {showForm && (
          <>
            <div className="darkBG" />
            <div className="centered">
              <div className="modal">
                <div className="modalHeader">
                  <h5 className="heading">Créer une structure</h5>
                </div>
                <button
                  className="closeBtn"
                  onClick={() => {
                    //handleUndo();
                    setShowForm(false);
                  }}
                >
                  <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                <div className="modalContent">
                  <form onSubmit={structureSubmit}>
                    {/* {handleSubmit(onSubmit)}> */}
                    <label>
                      Nom de la structure:
                      <input
                        // {...register("name", {
                        //   required: "Ce champ est obligatoire",
                        // })}
                        type="text"
                        name="name"
                        placeholder="insérer le nom de la structure"
                        value={nameStructure}
                        onChange={handleNameStructureChange}
                      />
                      {/* {errors.region && (
                      <span className="errorMsg">{errors.name.message}</span>
                    )} */}
                    </label>
                    {/* <p className="errorMsg">{errors.name?.message}</p> */}
                    <br />
                    <label>
                      La région:
                      <input
                        // {...register("region", {
                        //   required: " Ce champ est obligatoire",
                        // })}
                        type="region"
                        name="region"
                        placeholder="insérer la région"
                        value={regionStructure}
                        onChange={handleRegionStructureChange}
                      />
                      {/* {errors.region && (
                      <span className="errorMsg">{errors.region.message}</span>
                    )} */}
                    </label>
                    {/* <p className="errorMsg">{errors.name?.message}</p> */}
                    <br />
                    <label>
                      Date de formation:
                      <input
                        // {...register("date")}
                        type="date"
                        name="date"
                        placeholder="insérer la date de création"
                        value={dateStructure}
                        onChange={handleDateStructureChange}
                      />
                    </label>
                    <br />
                    <div className="modalActions">
                      <div className="actionsContainer">
                        <button
                          type="submit"
                          className="submitBtn"
                          // onClick={structureSubmit(handleSubmit(onSubmit))}
                        >
                          Soumettre
                        </button>
                        {/* <button
                        className="undoBtn"
                        onClick={handleUndo}
                      >
                        Annuler
                      </button> */}
                      </div>
                    </div>
                  </form>
                </div>
                {/* <div className="modalActions">
                <div className="actionsContainer">
                  <button
                    className="submitBtn"
                    onClick={structureSubmit(handleSubmit(onSubmit))}
                  >
                    Soumettre
                  </button>
                  <button className="undoBtn" onClick={handleUndo}>
                    Annuler
                  </button>
                </div>
              </div> */}
              </div>
            </div>
          </>
        )}
      </main>
    );
  };

  return <div>{buttonAction(chooseButton(props))}</div>;
};

export default CreateStructure;
//export { CreateStructure, buttonAction };
