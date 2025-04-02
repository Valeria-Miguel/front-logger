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
    const staticInfo = {
        alumno: {
            nombreCompleto: "Dulce Valeria Miguel Juan",
            grado: "8vo cuatrimestre",
            grupo: "IDGS11",
            carrera : "Ingeniería en Desarrollo de Software"
        },
        docente: {
            nombreCompleto: "M.C.C. Emmanuel Martínez Hernández",
            materia: "SEGURIDAD EN EL DESARROLLO DE APLICACIONES"
        },
        appDescription: "Este proyecto final es el desarrollo de un sistema de monitoreo de logs en tiempo real para analizar y comparar el comportamiento de dos servidores backend. El sistema permite visualizar métricas clave a través de la home, facilitando la identificación de patrones y problemas en los servidores. El sistema consta de dos servidores Node.js con los siguientes endpoints: uno para registro de usuarios (POST /api/register), otro para inicio de sesión con autenticación JWT y MFA (POST /api/login), y una ruta para obtener información técnica (GET /api/getInfo). El Servidor 1 implementa un límite de 100 peticiones cada 10 minutos, mientras que el Servidor 2 no tiene restricciones. Ambos servidores registran logs detallados en una base de datos, que incluyen timestamps, métodos HTTP, códigos de estado y tiempos de respuesta. El frontend, desarrollado en React, presenta cuatro vistas principales: Login (autenticación con JWT y MFA), Register (registro con validación de campos), Home (información general sobre el sistema) y Logs (Logs interactivo). En el Logsse pueden observar gráficos comparativos entre los servidores, mostrando la distribución de los niveles de logs, los tiempos de respuesta, los métodos HTTP más utilizados y los códigos de estado devueltos. Este sistema permite monitorear en tiempo real el rendimiento de los servidores, facilitando la detección de problemas y optimización de los servicios web."
    };

    useEffect(() => {
        const fetchSystemInfo = async () => {
            try {
                const token = localStorage.getItem("token");
                
                if (!token) {
                    navigate("/login");
                    return;
                }
               
               const response = await axios.get(getApiUrl ('/api/getInfo'), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache' 
                    },
                    timeout: 5000 
                });

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
                console.error("Ocurrió un error. Inténtalo de nuevo más tarde.");
                
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
                <h1>Panel de Control- Proyecto Final</h1>
                <button onClick={handleLogout} className="logout-btn">
                    Cerrar Sesión
                </button>
            </header>

            
            <div className="info-grid">
              {/*  <div className="info-card">
                    <h2>Información del Alumno</h2>
                    <div className="info-content">
                        <p><strong>Nombre:</strong> {systemInfo.alumno.nombreCompleto}</p>
                        <p><strong>Grupo:</strong> {systemInfo.alumno.grupo}</p>
                        <p><strong>Grado:</strong> 5° Cuatrimestre</p>
                        <p><strong>Carrera:</strong> Ingeniería en Desarrollo de Software</p>
                    </div>
                </div>*/}
                {/* Tarjeta del Alumno */}
                <div className="info-card">
                    <h2>Información del Alumno</h2>
                    <div className="info-content">
                        <div className="info-row">
                            <span className="info-label">Nombre:</span>
                            <span className="info-value">{staticInfo.alumno.nombreCompleto}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Grado:</span>
                            <span className="info-value">{staticInfo.alumno.grado}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Grupo:</span>
                            <span className="info-value">{staticInfo.alumno.grupo}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Carrera:</span>
                            <span className="info-value">{staticInfo.alumno.carrera}</span>
                        </div>
                    </div>
                </div>

                <div className="info-card">
                    <h2>Información del Docente</h2>
                    <div className="info-content">
                        <div className="info-row">
                            <span className="info-label">Nombre:</span>
                            <span className="info-value">{staticInfo.docente.nombreCompleto}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Materia:</span>
                            <span className="info-value">{staticInfo.docente.materia}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="app-description">
                <h2>Acerca de la Aplicación</h2>
                <p>{staticInfo.appDescription}</p>
            </div>

            <div className="action-section">
                <Link to="/logs" className="logs-button">
                    <i className="fas fa-clipboard-list"></i> Ver Registros del Sistema
                </Link>
            </div>
        </div>
    );
};

export default Home;
