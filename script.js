// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function () {
    // Initialize default data
    const defaultLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const defaultBarData = [12, 19, 3, 5, 2, 3, 7];
    const defaultLineData = [12, 19, 3, 5, 2, 3, 7];
    const defaultPieData = [300, 50, 100];
    const defaultPieLabels = ['Red', 'Blue', 'Yellow'];

    // Initialize Bar Chart with Zoom and Pan
    const ctxBar = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: defaultLabels,
            datasets: [{
                label: '# of Votes',
                data: defaultBarData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    // Ensures the x-axis doesn't wrap text
                    ticks: {
                        autoSkip: false
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        enabled: true,
                        mode: 'x',  // Allow zooming on the x-axis
                        speed: 0.05,
                        drag: false,
                        pinch: {
                            enabled: true
                        },
                        wheel: {
                            enabled: true
                        }
                    },
                    pan: {
                        enabled: true,
                        mode: 'x',  // Allow panning on the x-axis
                        speed: 0.05
                    }
                },
                legend: {
                    display: true
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    // Initialize Line Chart with Zoom and Pan
    const ctxLine = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: defaultLabels,
            datasets: [{
                label: 'Data Points',
                data: defaultLineData,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        autoSkip: false
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        enabled: true,
                        mode: 'xy',  // Allow zooming on both axes
                        speed: 0.05,
                        drag: false,
                        pinch: {
                            enabled: true
                        },
                        wheel: {
                            enabled: true
                        }
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',  // Allow panning on both axes
                        speed: 0.05
                    }
                },
                legend: {
                    display: true
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    // Initialize Pie Chart (Pie charts typically don't benefit from zoom/pan)
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: defaultPieLabels,
            datasets: [{
                label: 'Population',
                data: defaultPieData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    // Function to parse CSV data
    function parseCSV(data) {
        const lines = data.trim().split('\n');
        const headers = lines[0].split(',');

        // Assuming first column is labels and second column is values
        const labels = [];
        const values = [];

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length >= 2) {  // Ensure there are at least two columns
                labels.push(cols[0].trim());
                const value = parseFloat(cols[1].trim());
                values.push(isNaN(value) ? 0 : value);
            }
        }

        return { labels, values };
    }

    // Function to update charts with new data
    function updateCharts(data) {
        if (data.labels.length === 0 || data.values.length === 0) {
            alert('No valid data found in the CSV.');
            return;
        }

        // Update Bar Chart
        barChart.data.labels = data.labels;
        barChart.data.datasets[0].data = data.values;
        barChart.update();

        // Update Line Chart
        lineChart.data.labels = data.labels;
        lineChart.data.datasets[0].data = data.values;
        lineChart.update();

        // Update Pie Chart
    pieChart.data.labels = data.labels;
    pieChart.data.datasets[0].data = data.values;
    pieChart.update();

    }

    // Event listener for file upload
    document.getElementById('fileInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                const parsedData = parseCSV(csvData);
                updateCharts(parsedData);
            };
            reader.onerror = function () {
                alert('Unable to read ' + file.name);
            };
            reader.readAsText(file);
        }
    });

    // Event listener for Reset Zoom button
    document.getElementById('resetZoom').addEventListener('click', function () {
        barChart.resetZoom();
        lineChart.resetZoom();
    });
});
