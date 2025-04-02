import React, { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl, getApiUrlDos } from '../config/apiConfig';
import './Logs.css';
import LogsCharts from './LogsCharts';
import LogsTable from './LogsTable';
import LogsFilters from './LogsFilters';

const Logs = () => {
    const [logsData, setLogsData] = useState({
        server1: { logs: [], stats: null, loading: true, error: null },
        server2: { logs: [], stats: null, loading: true, error: null }
    });
    const [activeTab, setActiveTab] = useState('server1');
    const [showCharts, setShowCharts] = useState(true);
    const [timeRange, setTimeRange] = useState('hour');
    const [filters, setFilters] = useState({
        logLevel: 'all',
        method: 'all',
        status: 'all',
        minResponseTime: '',
        maxResponseTime: '',
        searchTerm: ''
    });

    const applyFilters = (logs) => {
        return logs.filter(log => {
            if (filters.logLevel !== 'all' && log.logLevel !== filters.logLevel) return false;
            if (filters.method !== 'all' && log.method !== filters.method) return false;
            if (filters.status !== 'all' && log.status !== parseInt(filters.status)) return false;
            if (filters.minResponseTime && log.responseTime < parseInt(filters.minResponseTime)) return false;
            if (filters.maxResponseTime && log.responseTime > parseInt(filters.maxResponseTime)) return false;
            if (filters.searchTerm && !JSON.stringify(log).toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
            return true;
        });
    };
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        
        const fetchData = async (server, apiUrl) => {
            try {
                const [logsRes, statsRes] = await Promise.all([
                    axios.get(apiUrl('/api/logs'), {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { limit: 1000 }
                    }),
                    axios.get(apiUrl('/api/logs/stats'), {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { period: timeRange }
                    })
                ]);
                return {
                    logs: logsRes.data,
                    stats: statsRes.data,
                    loading: false,
                    error: null
                };
            } catch (err) {
                return {
                    logs: [],
                    stats: null,
                    loading: false,
                    error: err.response?.data?.message || "Error al obtener datos"
                };
            }
        };

        const fetchAllData = async () => {
            const [server1Data, server2Data] = await Promise.all([
                fetchData('server1', getApiUrl),
                fetchData('server2', getApiUrlDos)
            ]);
            setLogsData({
                server1: server1Data,
                server2: server2Data
            });
        };

        fetchAllData();

        const setupSSE = (server, apiUrl) => {
            const eventSource = new EventSource(`${apiUrl('/api/logs/stream')}?token=${token}&serverType=${server}`);
            
            eventSource.addEventListener('newLog', (e) => {
                try {
                    const newLog = JSON.parse(e.data);
                    setLogsData(prev => ({
                        ...prev,
                        [server]: {
                            ...prev[server],
                            logs: [newLog, ...prev[server].logs.slice(0, 999)],
                            stats: updateStats(prev[server].stats, newLog)
                        }
                    }));
                } catch (error) {
                    console.error(`Error procesando nuevo log (${server}):`, error);
                }
            });

            eventSource.onerror = () => {
                console.error(`Error en SSE (${server})`);
                eventSource.close();
            };

            return eventSource;
        };

        const eventSource1 = setupSSE('server1', getApiUrl);
        const eventSource2 = setupSSE('server2', getApiUrlDos);

        return () => {
            eventSource1.close();
            eventSource2.close();
        };
    }, [timeRange]);

    function updateStats(currentStats, newLog) {
        if (!currentStats) return null;
        
        return {
            ...currentStats,
            logLevels: {
                ...currentStats.logLevels,
                [newLog.logLevel]: (currentStats.logLevels[newLog.logLevel] || 0) + 1
            },
            methods: {
                ...currentStats.methods,
                [newLog.method]: (currentStats.methods[newLog.method] || 0) + 1
            },
            responseTimes: {
                ...currentStats.responseTimes,
                ...(newLog.responseTime < 100 ? { '<100ms': currentStats.responseTimes['<100ms'] + 1 } :
                    newLog.responseTime < 500 ? { '100-500ms': currentStats.responseTimes['100-500ms'] + 1 } :
                    newLog.responseTime < 1000 ? { '500-1000ms': currentStats.responseTimes['500-1000ms'] + 1 } :
                    { '>1000ms': currentStats.responseTimes['>1000ms'] + 1 })
            }
        };
    }

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    const currentServerData = logsData[activeTab];
    const filteredLogs = applyFilters(currentServerData.logs);

    return (
        <div className="logs-container">
            <h1>Monitor de Logs</h1>
            
            <div className="controls">
                <div className="server-tabs">
                    <button onClick={() => setActiveTab('server1')} className={`tab-button ${activeTab === 'server1' ? 'active' : ''}`}>
                        Servidor 1 (Con Rate Limit)
                        {logsData.server1.loading && <span className="loading-indicator"></span>}
                    </button>
                    <button onClick={() => setActiveTab('server2')} className={`tab-button ${activeTab === 'server2' ? 'active' : ''}`}>
                        Servidor 2 (Sin Rate Limit)
                        {logsData.server2.loading && <span className="loading-indicator"></span>}
                    </button>
                </div>
                
                <button onClick={() => setShowCharts(!showCharts)} className="toggle-charts">
                    {showCharts ? 'Ocultar Gráficas' : 'Mostrar Gráficas'}
                </button>
            </div>

            {showCharts && (
                <LogsCharts 
                    server1Stats={logsData.server1.stats} 
                    server2Stats={logsData.server2.stats}
                    timeRange={timeRange}
                    onTimeRangeChange={handleTimeRangeChange}
                />
            )}
            
            <LogsFilters 
                filters={filters}
                onFilterChange={setFilters}
            />
            
            <LogsTable 
                logs={filteredLogs} 
                loading={currentServerData.loading}
                error={currentServerData.error}
                serverType={activeTab}
            />
        </div>
    );
};

export default Logs;
