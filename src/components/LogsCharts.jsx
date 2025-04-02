import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './LogsCharts.css';

Chart.register(...registerables);

const LogsCharts = ({ server1Stats, server2Stats, timeRange, onTimeRangeChange }) => {
    if (!server1Stats || !server2Stats) {
        return <div className="loading-charts">Cargando gráficas...</div>;
    }

    // Configuración de colores
    const colors = {
        server1: {
            primary: 'rgba(54, 162, 235, 0.7)',
            border: 'rgba(54, 162, 235, 1)',
            error: 'rgba(255, 99, 132, 0.7)',
            warn: 'rgba(255, 206, 86, 0.7)',
            info: 'rgba(75, 192, 192, 0.7)'
        },
        server2: {
            primary: 'rgba(153, 102, 255, 0.7)',
            border: 'rgba(153, 102, 255, 1)',
            error: 'rgba(255, 159, 64, 0.7)',
            warn: 'rgba(255, 205, 86, 0.7)',
            info: 'rgba(54, 162, 235, 0.7)'
        }
    };

    // Gráfica 1: Niveles de Log comparativos
    const logLevelData = {
        labels: ['Error', 'Warning', 'Info', 'Debug'],
        datasets: [
            {
                label: 'Servidor 1 (Rate Limit)',
                data: [
                    server1Stats.logLevels.error || 0,
                    server1Stats.logLevels.warn || 0,
                    server1Stats.logLevels.info || 0,
                    server1Stats.logLevels.debug || 0
                ],
                backgroundColor: colors.server1.primary,
                borderColor: colors.server1.border,
                borderWidth: 1,
                barThickness: 20,
                maxBarThickness: 30
            },
            {
                label: 'Servidor 2 (Sin Rate Limit)',
                data: [
                    server2Stats.logLevels.error || 0,
                    server2Stats.logLevels.warn || 0,
                    server2Stats.logLevels.info || 0,
                    server2Stats.logLevels.debug || 0
                ],
                backgroundColor: colors.server2.primary,
                borderColor: colors.server2.border,
                borderWidth: 1,
                barThickness: 20,
                maxBarThickness: 30
            }
        ]
    };

    // Gráfica 2: Tiempos de respuesta
    const responseTimeData = {
        labels: ['<100ms', '100-500ms', '500-1000ms', '>1000ms'],
        datasets: [
            {
                label: 'Servidor 1',
                data: [
                    server1Stats.responseTimes['<100ms'] || 0,
                    server1Stats.responseTimes['100-500ms'] || 0,
                    server1Stats.responseTimes['500-1000ms'] || 0,
                    server1Stats.responseTimes['>1000ms'] || 0
                ],
                backgroundColor: [
                    colors.server1.info,
                    colors.server1.primary,
                    colors.server1.warn,
                    colors.server1.error
                ],
                borderWidth: 1,
                barThickness: 20,
                maxBarThickness: 30
            },
            {
                label: 'Servidor 2',
                data: [
                    server2Stats.responseTimes['<100ms'] || 0,
                    server2Stats.responseTimes['100-500ms'] || 0,
                    server2Stats.responseTimes['500-1000ms'] || 0,
                    server2Stats.responseTimes['>1000ms'] || 0
                ],
                backgroundColor: [
                    colors.server2.info,
                    colors.server2.primary,
                    colors.server2.warn,
                    colors.server2.error
                ],
                borderWidth: 1,
                barThickness: 20,
                maxBarThickness: 30
            }
        ]
    };

    // Gráfica 3: Barras de tiempo de errores
    const timelineData = {
        labels: server1Stats.timeline.map(item => item.timestamp),
        datasets: [
            {
                label: 'Servidor 1 - Errores',
                data: server1Stats.timeline.map(item => item.byLevel.error || 0),
                backgroundColor: colors.server1.error,
                borderColor: colors.server1.border,
                borderWidth: 1,
                barThickness: 20,
                maxBarThickness: 30
            },
            {
                label: 'Servidor 2 - Errores',
                data: server2Stats.timeline.map(item => item.byLevel.error || 0),
                backgroundColor: colors.server2.error,
                borderColor: colors.server2.border,
                borderWidth: 1,
                barThickness: 20,
                maxBarThickness: 30
            }
        ]
    };

    // Gráfica 4: Métodos HTTP como barras
    const httpMethodsData = {
        labels: Object.keys(server1Stats.methods),
        datasets: [
            {
                label: 'Servidor 1',
                data: Object.values(server1Stats.methods),
                backgroundColor: colors.server1.primary,
                borderColor: colors.server1.border,
                borderWidth: 1,
                barThickness: 20,
                maxBarThickness: 30
            },
            {
                label: 'Servidor 2',
                data: Object.values(server2Stats.methods),
                backgroundColor: colors.server2.primary,
                borderColor: colors.server2.border,
                borderWidth: 1,
                barThickness: 20,
                maxBarThickness: 30
            }
        ]
    };

    // Opciones base para todas las gráficas de barras
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="advanced-charts-container">
            <div className="chart-controls">
                <div className="time-range-selector">
                    <span>Rango de tiempo:</span>
                    <button 
                        className={timeRange === 'hour' ? 'active' : ''}
                        onClick={() => onTimeRangeChange('hour')}
                    >
                        1 Hora
                    </button>
                    <button 
                        className={timeRange === 'day' ? 'active' : ''}
                        onClick={() => onTimeRangeChange('day')}
                    >
                        24 Horas
                    </button>
                    <button 
                        className={timeRange === 'week' ? 'active' : ''}
                        onClick={() => onTimeRangeChange('week')}
                    >
                        1 Semana
                    </button>
                </div>
            </div>
            
            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Niveles de Log por Servidor</h3>
                    <div className="chart-wrapper">
                        <Bar 
                            data={logLevelData} 
                            options={{
                                ...barChartOptions,
                                scales: {
                                    ...barChartOptions.scales,
                                    y: { ...barChartOptions.scales.y, title: { display: true, text: 'Cantidad' } },
                                    x: { ...barChartOptions.scales.x, title: { display: true, text: 'Niveles de Log' } }
                                }
                            }} 
                        />
                    </div>
                </div>
                
                <div className="chart-container">
                    <h3>Distribución de Tiempos de Respuesta</h3>
                    <div className="chart-wrapper">
                        <Bar 
                            data={responseTimeData} 
                            options={{
                                ...barChartOptions,
                                scales: {
                                    ...barChartOptions.scales,
                                    y: { ...barChartOptions.scales.y, title: { display: true, text: 'Cantidad' } },
                                    x: { ...barChartOptions.scales.x, title: { display: true, text: 'Tiempo de Respuesta' } }
                                }
                            }} 
                        />
                    </div>
                </div>
                
                <div className="chart-container">
                    <h3>Evolución de Errores en el Tiempo</h3>
                    <div className="chart-wrapper">
                        <Bar 
                            data={timelineData} 
                            options={{
                                ...barChartOptions,
                                scales: {
                                    ...barChartOptions.scales,
                                    y: { ...barChartOptions.scales.y, title: { display: true, text: 'Errores' } },
                                    x: { ...barChartOptions.scales.x, title: { display: true, text: 'Tiempo' } }
                                }
                            }} 
                        />
                    </div>
                </div>
                
                <div className="chart-container">
                    <h3>Métodos HTTP Utilizados</h3>
                    <div className="chart-wrapper">
                        <Bar 
                            data={httpMethodsData} 
                            options={{
                                ...barChartOptions,
                                scales: {
                                    ...barChartOptions.scales,
                                    y: { ...barChartOptions.scales.y, title: { display: true, text: 'Cantidad' } },
                                    x: { ...barChartOptions.scales.x, title: { display: true, text: 'Métodos HTTP' } }
                                }
                            }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogsCharts;