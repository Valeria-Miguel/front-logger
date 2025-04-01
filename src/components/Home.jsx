import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Home.css';
import { getApiUrl } from '../config/apiConfig';

const Home = () => {
    const [systemInfo, setSystemInfo] = useState({
        nodeVersion: "",
        alumno: {
            nombreCompleto: "",
            grupo: ""
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSystemInfo = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log("Token actual:", token); // Debug
                
                if (!token) {
                    navigate("/login");
                    return;
                }
               
               const response = await axios.get(getApiUrl ('/api/getInfo'), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache' // Evitar caché
                    },
                    timeout: 5000 // Timeout de 5 segundos
                });
    
                // Verificar respuesta
                if (!response.data.studentInfo) {
                    throw new Error("Estructura de respuesta inválida");
                }
    
                setSystemInfo({
                    nodeVersion: response.data.nodeVersion,
                    alumno: {
                        nombreCompleto: response.data.studentInfo.fullName,
                        grupo: response.data.studentInfo.group
                    }
                });
            } catch (err) {
                console.error("Detalles del error:", {
                    message: err.message,
                    response: err.response,
                    stack: err.stack
                });
                
                if (err.response?.status === 401 || err.message.includes("token")) {
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    setError("Error al obtener la información del sistema. Intenta recargar la página.");
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchSystemInfo();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) return <div className="loading">Cargando información del sistema...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="home-container">
            <header>
                <h1>Panel de Control</h1>
                <button onClick={handleLogout} className="logout-btn">
                    Cerrar Sesión
                </button>
            </header>

            <div className="info-section">
                <h2>Información del Sistema</h2>
                <div className="info-card">
                    <h3>Versión de Node.js</h3>
                    <p>{systemInfo.nodeVersion}</p>
                </div>
            </div>

            <div className="info-section">
                <h2>Información del Alumno</h2>
                <div className="info-card">
                    <h3>Nombre Completo</h3>
                    <p>{systemInfo.alumno.nombreCompleto}</p>
                    
                    <h3>Grupo</h3>
                    <p>{systemInfo.alumno.grupo}</p>
                </div>
            </div>

            <nav className="navigation">
                <Link to="/logs" className="nav-link">
                    Ver Registros del Sistema
                </Link>
            </nav>
        </div>
    );
};

export default Home;