import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RiCloseLine } from "react-icons/ri";

const CreateStructure = () => {
  const defaultFormData = {
    name: "",
    region: "",
    date: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormData,
  });
  console.log(errors);
  const [showForm, setShowForm] = useState(false);
  const handleClick = () => {
    setShowForm(true);
  };

  const handleUndo = () => {
    reset();
  };

  const onSubmit = (data) => {
    console.log(data);
    handleUndo();
    setShowForm(false);
  };
  return (
    <main>
      <button className="primaryBtn" onClick={handleClick}>
        Créer une structure
      </button>
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
                  handleUndo();
                  setShowForm(false);
                }}
              >
                <RiCloseLine style={{ marginBottom: "-3px" }} />
              </button>
              <div className="modalContent">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <label>
                    Nom de la structure:
                    <input
                      {...register("name", {
                        required: "Ce champ est obligatoire",
                      })}
                      type="text"
                      name="name"
                      placeholder="insérer le nom de la structure"
                    />
                    {errors.region && (
                      <span className="errorMsg">{errors.name.message}</span>
                    )}
                  </label>
                  {/* <p className="errorMsg">{errors.name?.message}</p> */}
                  <br />
                  <label>
                    La région:
                    <input
                      {...register("region", {
                        required: " Ce champ est obligatoire",
                      })}
                      type="region"
                      name="region"
                      placeholder="insérer la région"
                    />
                    {errors.region && (
                      <span className="errorMsg">{errors.region.message}</span>
                    )}
                  </label>
                  {/* <p className="errorMsg">{errors.name?.message}</p> */}
                  <br />
                  <label>
                    Date de formation:
                    <input {...register("date")} type="date" name="date" />
                  </label>
                  <br />
                </form>
              </div>
              <div className="modalActions">
                <div className="actionsContainer">
                  <button
                    className="submitBtn"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Soumettre
                  </button>
                  <button className="undoBtn" onClick={handleUndo}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default CreateStructure;
