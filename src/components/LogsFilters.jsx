import React, { useState, useEffect } from 'react';
import './LogsFilters.css';

const LogsFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        logLevel: 'all',
        method: 'all',
        status: 'all',
        minResponseTime: '',
        maxResponseTime: '',
        searchTerm: ''
    });

    // Usar debounce para evitar múltiples llamadas mientras se escribe
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange(filters);
        }, 300); // Esperar 300ms después del último cambio
        
        return () => clearTimeout(timer);
    }, [filters, onFilterChange]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetFilters = () => {
        const resetFilters = {
            logLevel: 'all',
            method: 'all',
            status: 'all',
            minResponseTime: '',
            maxResponseTime: '',
            searchTerm: ''
        };
        setFilters(resetFilters);
        // No necesitamos llamar onFilterChange aquí porque el useEffect se encargará
    };

    return (
        <div className="logs-filters">
            <h3>Filtros</h3>
            
            <div className="filter-grid">
                <div className="filter-group">
                    <label>Nivel de Log:</label>
                    <select 
                        name="logLevel" 
                        value={filters.logLevel} 
                        onChange={handleChange}
                        className="filter-select"
                    >
                        <option value="all">Todos</option>
                        <option value="error">Error</option>
                        <option value="warn">Warning</option>
                        <option value="info">Info</option>
                        <option value="debug">Debug</option>
                    </select>
                </div>
                
                <div className="filter-group">
                    <label>Método HTTP:</label>
                    <select 
                        name="method" 
                        value={filters.method} 
                        onChange={handleChange}
                        className="filter-select"
                    >
                        <option value="all">Todos</option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                    </select>
                </div>
                
                <div className="filter-group">
                    <label>Status Code:</label>
                    <select 
                        name="status" 
                        value={filters.status} 
                        onChange={handleChange}
                        className="filter-select"
                    >
                        <option value="all">Todos</option>
                        <option value="200">200 (OK)</option>
                        <option value="201">201 (Created)</option>
                        <option value="400">400 (Bad Request)</option>
                        <option value="401">401 (Unauthorized)</option>
                        <option value="404">404 (Not Found)</option>
                        <option value="500">500 (Server Error)</option>
                    </select>
                </div>
                
                <div className="filter-group">
                    <label>Tiempo Resp. Mín (ms):</label>
                    <input 
                        type="number" 
                        name="minResponseTime" 
                        value={filters.minResponseTime}
                        onChange={handleChange}
                        placeholder="Mínimo"
                        min="0"
                        className="filter-input"
                    />
                </div>
                
                <div className="filter-group">
                    <label>Tiempo Resp. Máx (ms):</label>
                    <input 
                        type="number" 
                        name="maxResponseTime" 
                        value={filters.maxResponseTime}
                        onChange={handleChange}
                        placeholder="Máximo"
                        min="0"
                        className="filter-input"
                    />
                </div>
                
                <div className="filter-group search-group">
                    <label>Buscar:</label>
                    <input 
                        type="text" 
                        name="searchTerm" 
                        value={filters.searchTerm}
                        onChange={handleChange}
                        placeholder="Término de búsqueda"
                        className="filter-input search-input"
                    />
                </div>
                
                <div className="filter-group reset-group">
                    <button 
                        onClick={resetFilters} 
                        className="reset-filters"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogsFilters;