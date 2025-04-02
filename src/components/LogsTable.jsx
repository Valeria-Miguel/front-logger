import React from 'react';
import './LogsTable.css';

const LogsTable = ({ logs, loading, error, serverType }) => {
    if (loading) return <div className="loading-table">Cargando logs...</div>;
    if (error) return <div className="error-table">{error}</div>;
    if (logs.length === 0) return <div className="no-logs">No se encontraron logs</div>;

    return (
        <div className="logs-table-container">
            <div className="table-header">
                <h3>Logs del {serverType === 'server1' ? 'Servidor 1 (Con Rate Limit)' : 'Servidor 2 (Sin Rate Limit)'}</h3>
                <div className="logs-count">Total: {logs.length} logs</div>
            </div>
            
            <div className="table-responsive">
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Nivel</th>
                            <th>Método</th>
                            <th>Status</th>
                            <th>Tiempo Resp.</th>
                            <th>Protocolo</th>
                            <th>URL</th>
                            <th>Query</th>
                            <th>User Agent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={index} className={`log-row log-${log.logLevel}`}>
                                <td>{new Date(log.Timestamp).toLocaleString()}</td>
                                <td className="log-level">{log.logLevel.toUpperCase()}</td>
                                <td className="log-method">{log.method}</td>
                                <td className={`log-status status-${Math.floor(log.status/100)}xx`}>
                                    {log.status}
                                </td>
                                <td className="log-response">{log.responseTime}ms</td>
                                <td className="log-protocol">{log.protocol}</td>
                                <td className="log-url">{log.url}</td>
                                <td className="log-query">
                                    {log.query ? JSON.stringify(log.query) : 'N/A'}
                                </td>
                                <td className="log-user-agent">
                                    {log.userAgent ? log.userAgent.substring(0, 50) + (log.userAgent.length > 50 ? '...' : '') : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogsTable;