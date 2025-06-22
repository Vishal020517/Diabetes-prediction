import React, { useState } from 'react';
import './Form.css';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaHeartbeat } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const PredictionModal = ({ show, onClose, prediction }) => {
    if (!show) {
        return null;
    }

    const riskColor = prediction.prediction_class === 1 ? '#dc3545' : '#28a745';
    const riskText = prediction.prediction_class === 1 ? 'High Risk' : 'Low Risk';

    return (
        <div className="modal-backdrop">
            <script async type='module' src='https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js'></script>
            <zapier-interfaces-chatbot-embed is-popup='false' chatbot-id='cmc806c0d001vhj12hkpn2988' height='600px' width='400px'></zapier-interfaces-chatbot-embed>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Prediction Result</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: riskColor }}>
                        {riskText}
                    </p>
                    <p style={{ fontSize: '1.1em' }}>
                        Probability of Diabetes: <span style={{ fontWeight: 'bold' }}>{(prediction.prediction_probability * 100).toFixed(2)}%</span>
                    </p>
                    <p>{prediction.message}</p>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="modal-button">Close</button>
                </div>
            </div>
        </div>
    );
};


const Form = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        Pregnancies: '',
        Glucose: '',
        BloodPressure: '',
        SkinThickness: '',
        Insulin: '',
        BMI: '',
        DiabetesPedigreeFunction: '',
        Age: '',
    });

    const [predictionResult, setPredictionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);
        setPredictionResult(null);
        setShowModal(false);

        const currentFormData = { ...formData };
        for (const key in currentFormData) {
            if (currentFormData[key] === '' || currentFormData[key] === undefined || currentFormData[key] === null) {
                setError(`Please fill in all fields. Missing: ${key}`);
                setLoading(false);
                return;
            }
            currentFormData[key] = parseFloat(currentFormData[key]);
            if (isNaN(currentFormData[key])) {
                setError(`Invalid input for ${key}. Please enter a valid number.`);
                setLoading(false);
                return;
            }
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentFormData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPredictionResult(data);
            setShowModal(true);

        } catch (err) {
            console.error("Error during prediction:", err);
            setError(err.message || 'Failed to get prediction. Please check your inputs and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <>
            <div className='form-pg'>
                <div className='top-nav-form'>
                    <div className='Logo-diabetes'>
                        <p><FaHeartbeat/></p>
                        <h3>Diabetes Check</h3>
                    </div>
                    <div className='back'>
                        <h2><IoIosArrowRoundBack/></h2>
                        <p onClick={handleBackToHome}>Back To Home</p>
                    </div>
                </div>
                <div className='form-content'>
                    <div className='form-title'>
                        <h2><FaHeartbeat /></h2>
                        <h2>Diabetes Risk Assessment Tool</h2>
                        <p>Enter your health metrics below to receive an assessment of your potential diabetes risk factors.</p>
                    </div>

                    <form className='form-details' onSubmit={handleSubmit}>
                        <div className='details'>
                            <div>
                                <p>Number Of Pregnancies</p>
                                <div className='input-box'>
                                    <input type="text" name="Pregnancies" placeholder='Enter Number Of Pregnancies' value={formData.Pregnancies} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <p>Glucose Level</p>
                                <div className='input-box'>
                                    <input type="text" name="Glucose" placeholder='Enter Your Glucose Level' value={formData.Glucose} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <p>Blood Pressure</p>
                                <div className='input-box'>
                                    <input type="text" name="BloodPressure" placeholder='Enter Your Blood Pressure' value={formData.BloodPressure} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <p>Skin Thickness</p>
                                <div className='input-box'>
                                    <input type="text" name="SkinThickness" placeholder='Enter Your Skin Thickness' value={formData.SkinThickness} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <p>Insulin Level</p>
                                <div className='input-box'>
                                    <input type="text" name="Insulin" placeholder='Enter Your Insulin Level' value={formData.Insulin} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <p>BMI (Body Mass Index)</p>
                                <div className='input-box'>
                                    <input type="text" name="BMI" placeholder='Enter Your BMI' value={formData.BMI} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <p>Diabetes Pedigree Function</p>
                                <div className='input-box'>
                                    <input type="text" name="DiabetesPedigreeFunction" placeholder='Enter Your Diabetes Pedigree Function' value={formData.DiabetesPedigreeFunction} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <p>Age</p>
                                <div className='input-box'>
                                    <input type="text" name="Age" placeholder='Enter Your Age' value={formData.Age} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>
                        <div className='form-btns'>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Checking Risk...' : 'Check Risk'}
                            </button>
                        </div>
                    </form>

                    {loading && <p style={{ textAlign: 'center', marginTop: '20px', color: '#007bff' }}>Loading prediction...</p>}
                    {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Error: {error}</p>}
                </div>
            </div>

            {predictionResult && (
                <PredictionModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    prediction={predictionResult}
                />
            )}
        </>
    );
}

export default Form;
