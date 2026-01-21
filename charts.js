// Charts Configuration and Initialization
let chartInstances = {};

// Wait for both DOM and Chart.js to be ready
function initChartsWhenReady() {
    if (typeof Chart !== 'undefined' && document.readyState === 'complete') {
        initializeCharts();
    } else if (typeof Chart !== 'undefined') {
        // Chart.js is loaded, wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCharts);
        } else {
            initializeCharts();
        }
    } else {
        // Wait for Chart.js
        setTimeout(initChartsWhenReady, 100);
    }
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChartsWhenReady);
} else {
    initChartsWhenReady();
}

function initializeCharts() {
    // Market Chart
    const marketCtx = document.getElementById('marketChart');
    if (marketCtx) {
        chartInstances.marketChart = new Chart(marketCtx, {
            type: 'doughnut',
            data: {
                labels: ['Chile', 'México', 'Perú'],
                datasets: [{
                    data: [45, 35, 20],
                    backgroundColor: [
                        'rgba(0, 51, 102, 0.8)',
                        'rgba(0, 102, 204, 0.8)',
                        'rgba(255, 215, 0, 0.8)'
                    ],
                    borderColor: [
                        'rgba(0, 51, 102, 1)',
                        'rgba(0, 102, 204, 1)',
                        'rgba(255, 215, 0, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: { size: 11 }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribución de Mercado',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Risk Chart
    const riskCtx = document.getElementById('riskChart');
    if (riskCtx) {
        chartInstances.riskChart = new Chart(riskCtx, {
            type: 'bar',
            data: {
                labels: ['Costo', 'Confianza', 'Regulatorio', 'Reputación', 'Operacional', 'Datos'],
                datasets: [{
                    label: 'Nivel de Riesgo',
                    data: [9, 8, 9, 7, 8, 9],
                    backgroundColor: 'rgba(255, 68, 68, 0.6)',
                    borderColor: 'rgba(255, 68, 68, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Análisis de Riesgos',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Incident Timeline Chart
    const timelineCtx = document.getElementById('incidentTimelineChart');
    if (timelineCtx) {
        chartInstances.incidentTimelineChart = new Chart(timelineCtx, {
            type: 'line',
            data: {
                labels: ['08:15', '08:40', '09:20', '09:45'],
                datasets: [{
                    label: 'Severidad del Incidente',
                    data: [2, 5, 8, 9],
                    borderColor: 'rgba(255, 215, 0, 1)',
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: 'rgba(255, 215, 0, 1)',
                    pointBorderColor: 'rgba(255, 255, 255, 1)',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Evolución del Incidente',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Triage Progress Chart
    const triageCtx = document.getElementById('triageProgressChart');
    if (triageCtx) {
        updateTriageChart();
    }
    
    // Evidence Flow Chart
    const evidenceCtx = document.getElementById('evidenceFlowChart');
    if (evidenceCtx) {
        chartInstances.evidenceFlowChart = new Chart(evidenceCtx, {
            type: 'pie',
            data: {
                labels: ['Logs', 'Metadatos', 'Capturas', 'Otros'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: [
                        'rgba(0, 102, 204, 0.8)',
                        'rgba(255, 215, 0, 0.8)',
                        'rgba(0, 170, 0, 0.8)',
                        'rgba(255, 136, 0, 0.8)'
                    ],
                    borderColor: [
                        'rgba(0, 102, 204, 1)',
                        'rgba(255, 215, 0, 1)',
                        'rgba(0, 170, 0, 1)',
                        'rgba(255, 136, 0, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: { size: 10 }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribución de Evidencia',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Playbook Flow Chart
    const playbookCtx = document.getElementById('playbookFlowChart');
    if (playbookCtx) {
        chartInstances.playbookFlowChart = new Chart(playbookCtx, {
            type: 'bar',
            data: {
                labels: ['Detección', 'Confirmación', 'Contención', 'Eradicación', 'Recuperación', 'Post-Incidente'],
                datasets: [{
                    label: 'Tiempo Estimado (minutos)',
                    data: [15, 10, 30, 60, 240, 120],
                    backgroundColor: [
                        'rgba(0, 102, 204, 0.8)',
                        'rgba(255, 215, 0, 0.8)',
                        'rgba(255, 68, 68, 0.8)',
                        'rgba(255, 136, 0, 0.8)',
                        'rgba(0, 170, 0, 0.8)',
                        'rgba(128, 128, 128, 0.8)'
                    ],
                    borderColor: [
                        'rgba(0, 102, 204, 1)',
                        'rgba(255, 215, 0, 1)',
                        'rgba(255, 68, 68, 1)',
                        'rgba(255, 136, 0, 1)',
                        'rgba(0, 170, 0, 1)',
                        'rgba(128, 128, 128, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 },
                            callback: function(value) {
                                return value + ' min';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Tiempos del Playbook',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Data Protection Chart
    const dataProtectionCtx = document.getElementById('dataProtectionChart');
    if (dataProtectionCtx) {
        chartInstances.dataProtectionChart = new Chart(dataProtectionCtx, {
            type: 'radar',
            data: {
                labels: ['Confidencialidad', 'Integridad', 'Disponibilidad', 'Cumplimiento', 'Notificación'],
                datasets: [{
                    label: 'Nivel de Protección',
                    data: [9, 8, 9, 9, 8],
                    backgroundColor: 'rgba(0, 102, 204, 0.3)',
                    borderColor: 'rgba(0, 102, 204, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 215, 0, 1)',
                    pointBorderColor: 'rgba(255, 255, 255, 1)',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 },
                            stepSize: 2
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: { size: 10 }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Protección de Datos',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Standards Chart
    const standardsCtx = document.getElementById('standardsChart');
    if (standardsCtx) {
        chartInstances.standardsChart = new Chart(standardsCtx, {
            type: 'bar',
            data: {
                labels: ['ISO 27001', 'NIST', 'PCI DSS', 'Mejores Prácticas'],
                datasets: [{
                    label: 'Nivel de Implementación',
                    data: [85, 90, 70, 95],
                    backgroundColor: [
                        'rgba(0, 102, 204, 0.8)',
                        'rgba(255, 215, 0, 0.8)',
                        'rgba(0, 170, 0, 0.8)',
                        'rgba(255, 136, 0, 0.8)'
                    ],
                    borderColor: [
                        'rgba(0, 102, 204, 1)',
                        'rgba(255, 215, 0, 1)',
                        'rgba(0, 170, 0, 1)',
                        'rgba(255, 136, 0, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 },
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Implementación de Estándares',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Governance Chart
    const governanceCtx = document.getElementById('governanceChart');
    if (governanceCtx) {
        chartInstances.governanceChart = new Chart(governanceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Comité Crisis', 'CSIRT', 'Otros Roles'],
                datasets: [{
                    data: [5, 5, 4],
                    backgroundColor: [
                        'rgba(255, 215, 0, 0.8)',
                        'rgba(0, 102, 204, 0.8)',
                        'rgba(0, 170, 0, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 215, 0, 1)',
                        'rgba(0, 102, 204, 1)',
                        'rgba(0, 170, 0, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: { size: 10 }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribución de Roles',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Severity Chart
    const severityCtx = document.getElementById('severityChart');
    if (severityCtx) {
        chartInstances.severityChart = new Chart(severityCtx, {
            type: 'bar',
            data: {
                labels: ['Severity 1', 'Severity 2', 'Severity 3', 'Severity 4'],
                datasets: [{
                    label: 'MTTR (horas)',
                    data: [2, 4, 8, 24],
                    backgroundColor: [
                        'rgba(255, 0, 0, 0.8)',
                        'rgba(255, 136, 0, 0.8)',
                        'rgba(255, 170, 0, 0.8)',
                        'rgba(0, 170, 0, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 0, 0, 1)',
                        'rgba(255, 136, 0, 1)',
                        'rgba(255, 170, 0, 1)',
                        'rgba(0, 170, 0, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 },
                            callback: function(value) {
                                return value + 'h';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Tiempos de Respuesta por Severidad',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Stakeholder Chart
    const stakeholderCtx = document.getElementById('stakeholderChart');
    if (stakeholderCtx) {
        chartInstances.stakeholderChart = new Chart(stakeholderCtx, {
            type: 'pie',
            data: {
                labels: ['Internos', 'Reguladores', 'Clientes', 'Partners', 'Otros'],
                datasets: [{
                    data: [35, 20, 25, 15, 5],
                    backgroundColor: [
                        'rgba(0, 102, 204, 0.8)',
                        'rgba(255, 215, 0, 0.8)',
                        'rgba(255, 68, 68, 0.8)',
                        'rgba(0, 170, 0, 0.8)',
                        'rgba(128, 128, 128, 0.8)'
                    ],
                    borderColor: [
                        'rgba(0, 102, 204, 1)',
                        'rgba(255, 215, 0, 1)',
                        'rgba(255, 68, 68, 1)',
                        'rgba(0, 170, 0, 1)',
                        'rgba(128, 128, 128, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: { size: 10 }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribución de Stakeholders',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Recovery Chart
    const recoveryCtx = document.getElementById('recoveryChart');
    if (recoveryCtx) {
        chartInstances.recoveryChart = new Chart(recoveryCtx, {
            type: 'line',
            data: {
                labels: ['Backup', 'Validación', 'Restauración', 'Validación', 'Monitoreo'],
                datasets: [{
                    label: 'Tiempo (minutos)',
                    data: [0, 15, 60, 90, 240],
                    borderColor: 'rgba(0, 170, 0, 1)',
                    backgroundColor: 'rgba(0, 170, 0, 0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: 'rgba(0, 170, 0, 1)',
                    pointBorderColor: 'rgba(255, 255, 255, 1)',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 },
                            callback: function(value) {
                                return value + ' min';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Proceso de Recuperación',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Metrics Chart
    const metricsCtx = document.getElementById('metricsChart');
    if (metricsCtx) {
        chartInstances.metricsChart = new Chart(metricsCtx, {
            type: 'radar',
            data: {
                labels: ['MTTD', 'MTTR', 'MTTC', 'Recuperación', 'Notificación'],
                datasets: [{
                    label: 'Objetivo vs Real',
                    data: [1, 0.5, 2, 4, 24],
                    backgroundColor: 'rgba(255, 215, 0, 0.3)',
                    borderColor: 'rgba(255, 215, 0, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 215, 0, 1)',
                    pointBorderColor: 'rgba(255, 255, 255, 1)',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 25,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 },
                            stepSize: 5
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: { size: 10 }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'KPIs de Respuesta',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // Improvements Chart
    const improvementsCtx = document.getElementById('improvementsChart');
    if (improvementsCtx) {
        chartInstances.improvementsChart = new Chart(improvementsCtx, {
            type: 'bar',
            data: {
                labels: ['Quick Wins', 'Estructurales', 'Cumplimiento'],
                datasets: [{
                    label: 'Progreso (%)',
                    data: [75, 45, 60],
                    backgroundColor: [
                        'rgba(0, 170, 0, 0.8)',
                        'rgba(0, 102, 204, 0.8)',
                        'rgba(255, 215, 0, 0.8)'
                    ],
                    borderColor: [
                        'rgba(0, 170, 0, 1)',
                        'rgba(0, 102, 204, 1)',
                        'rgba(255, 215, 0, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 },
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Progreso de Mejoras',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        });
    }
}

function updateTriageChart() {
    const triageCtx = document.getElementById('triageProgressChart');
    if (!triageCtx) return;
    
    // Only count checkboxes in the triage slide (slide 3)
    const triageSlide = document.querySelector('.slide[data-slide="3"]');
    if (!triageSlide) return;
    
    const checkboxes = triageSlide.querySelectorAll('.interactive-checkbox');
    const total = checkboxes.length;
    let completed = 0;
    
    checkboxes.forEach(cb => {
        if (cb.getAttribute('data-checked') === 'true') {
            completed++;
        }
    });
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    if (chartInstances.triageProgressChart) {
        chartInstances.triageProgressChart.destroy();
    }
    
    chartInstances.triageProgressChart = new Chart(triageCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completado', 'Pendiente'],
            datasets: [{
                data: [completed, total - completed],
                backgroundColor: [
                    'rgba(0, 170, 0, 0.8)',
                    'rgba(255, 255, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 170, 0, 1)',
                    'rgba(255, 255, 255, 0.3)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 10 }
                    }
                },
                title: {
                    display: true,
                    text: `Progreso: ${percentage}%`,
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: { size: 12, weight: 'bold' }
                }
            }
        }
    });
}

function updateCharts() {
    // Update charts that depend on content
    updateTriageChart();
    
    // Re-initialize all charts if needed
    Object.keys(chartInstances).forEach(key => {
        if (chartInstances[key] && typeof chartInstances[key].update === 'function') {
            chartInstances[key].update();
        }
    });
    
    // ROI Chart - Return on Investment del Plan
    const roiCtx = document.getElementById('roiChart');
    if (roiCtx) {
        chartInstances.roiChart = new Chart(roiCtx, {
            type: 'bar',
            data: {
                labels: ['Sin Plan', 'Con Plan'],
                datasets: [{
                    label: 'Costo Estimado (Millones CLP)',
                    data: [500, 50],
                    backgroundColor: [
                        'rgba(255, 0, 0, 0.8)',
                        'rgba(0, 170, 0, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 0, 0, 1)',
                        'rgba(0, 170, 0, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'ROI: Ahorro Estimado 450M CLP',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Costo: ' + context.parsed.y + 'M CLP';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 },
                            callback: function(value) {
                                return value + 'M';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 10 }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Export for external use
if (typeof window !== 'undefined') {
    window.updateCharts = updateCharts;
    window.updateTriageChart = updateTriageChart;
}
