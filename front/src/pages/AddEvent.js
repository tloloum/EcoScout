import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthStContext } from '../contexts/AuthSt';
import { ServerContext } from '../contexts/Server';
import Sidebar from '../components/Sidebar';

const AddEvent = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [lieu, setLieu] = useState('');
    const [duree, setDuree] = useState('');
    const [error, setError] = useState(null);
    const { myTokenSt } = useContext(AuthStContext);
    const { getServerAddress } = useContext(ServerContext);
    const navigate = useNavigate();

    const handleNameChange = (event) => {
        setError('');
        setName(event.target.value);
    }

    const handleDescriptionChange = (event) => {
        setError('');
        setDescription(event.target.value);
    }

    const handleDateChange = (event) => {
        setError('');
        setDate(event.target.value);
    }

    const handleLieuChange = (event) => {
        setError('');
        setLieu(event.target.value);
    }

    const handleDureeChange = (event) => {
        setError('');
        setDuree(event.target.value);
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const serverAddress = getServerAddress();
            const response = await fetch(serverAddress + 'events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + myTokenSt,
                },
                body: JSON.stringify({
                    nom_evenement: name,
                    descr: description,
                    date_debut: date,
                    lieu: lieu,
                    duree_evenement: duree,
                }),
            });
            if (response.status !== 201) {
                setError('Erreur lors de la création de l\'événement');
                return;
            } else {
                navigate('/homeStruct');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    return (
        <div className='add-event'>
            <Sidebar />
            <div className='content'>
                <h1>Ajouter un événement</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nom de l'événement :
                        <input type='text' value={name} onChange={handleNameChange} />
                    </label>
                    <label>
                        Description :
                        <input type='text' value={description} onChange={handleDescriptionChange} />
                    </label>
                    <label>
                        Date :
                        <input type='date' value={date} onChange={handleDateChange} />
                    </label>
                    <label>
                        Lieu :
                        <input type='text' value={lieu} onChange={handleLieuChange} />
                    </label>
                    <label>
                        Durée (en jours):
                        <input type='number' value={duree} onChange={handleDureeChange} />
                    </label>
                    <button type='submit'>Ajouter</button>
                </form>
                {error && <p>{error}</p>}
            </div>
        </div>
    )
};

export default AddEvent;