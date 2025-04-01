import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getApiUrl } from '../config/apiConfig';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        // 1. Obtener logs iniciales
        const fetchInitialLogs = async () => {
            try {
                
                const res = await axios.get(getApiUrl ('/api/logs'), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(res.data);
                setLoading(false); // 👈 Actualizar estado de carga
            } catch (err) {
                setError(err.response?.data?.message || "Error al obtener logs");
                setLoading(false); // 👈 Actualizar estado de carga incluso en error
            }
        };
    
        fetchInitialLogs();
       
        // 2. Configurar SSE
        const eventSource = new EventSource(`${getApiUrl('/api/logs/stream')}?token=${token}`);
    
        eventSource.addEventListener('connect', (e) => {
            console.log("Conexión SSE establecida:", JSON.parse(e.data));
        });
    
        eventSource.addEventListener('newLog', (e) => {
            try {
                const newLog = JSON.parse(e.data);
                console.log("Nuevo log recibido:", newLog); // 👈 Debug
                setLogs(prevLogs => {
                    const updatedLogs = [newLog, ...prevLogs];
                    return updatedLogs.length > 50 ? updatedLogs.slice(0, 50) : updatedLogs;
                });
            } catch (error) {
                console.error("Error procesando nuevo log:", error);
            }
        });
    
        eventSource.onerror = (e) => {
            console.error("Error en SSE:", e);
            eventSource.close();
        };
    
        return () => {
            eventSource.close();
        };
    }, []);

    if (loading) return <div>Cargando logs...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="logs-container">
            <h1>Registros del Sistema</h1>
            <Link to="/home">Volver al Inicio</Link>
            
            <table>
                <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Método</th>
                    <th>Ruta</th>
                    <th>Estado</th>
                    <th>IP</th>
                </tr>
                </thead>
                <tbody>
                {logs.map((log, index) => (
                    <tr key={index}>
                    <td>{new Date(log.Timestamp).toLocaleString()}</td>
                    <td>{log.method}</td>
                    <td>{log.url}</td>
                    <td>{log.status}</td>
                    <td>{log.ip}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
    );
};

export default Logs;