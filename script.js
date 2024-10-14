// Function to parse CSV and create datasets
function parseCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const rows = text.split('\n').map(row => row.split(','));
            const labels = rows.map(row => row[0]);
            const data = rows.map(row => parseFloat(row[1]));
            resolve({ labels, data });
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// Variables to store chart instances
let barChart, lineChart, pieChart;

// Function to create the charts
async function createCharts() {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a CSV file.");
        return;
    }

    // Display uploaded file name
    fileNameDisplay.textContent = `Uploaded file: ${file.name}`;

    const { labels, data } = await parseCSV(file);

    // Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bar Chart',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy'
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    }
                }
            }
        }
    });

    // Line Chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Line Chart',
                data: data,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy'
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    }
                }
            }
        }
    });

    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pie Chart',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            return `${tooltipItem.label}: ${tooltipItem.raw}`;
                        }
                    }
                }
            }
        }
    });
}

// Function to reset zoom for all charts
function resetZoom() {
    if (barChart) barChart.resetZoom();
    if (lineChart) lineChart.resetZoom();
    if (pieChart) pieChart.resetZoom();
}

// Function to export a specific chart as PNG
function exportChartAsPNG(chart) {
    if (chart) {
        const link = document.createElement('a');
        link.href = chart.toBase64Image(); // Get the image in base64 format
        link.download = 'chart.png'; // Set the default download filename
        document.body.appendChild(link); // Append link to the body
        link.click(); // Trigger the download
        document.body.removeChild(link); // Remove the link after triggering download
    } else {
        alert("No chart available for export.");
    }
}

// Function to handle download action
function handleDownload() {
    const selectedChart = document.getElementById('chartSelect').value;
    let chart;

    // Determine which chart to use based on selection
    switch (selectedChart) {
        case 'bar':
            chart = barChart;
            break;
        case 'line':
            chart = lineChart;
            break;
        case 'pie':
            chart = pieChart;
            break;
        default:
            alert("Invalid chart selected.");
            return;
    }

    exportChartAsPNG(chart);
}

// Event listener for file upload
document.getElementById('fileInput').addEventListener('change', createCharts);

// Event listener for reset zoom button
document.getElementById('resetZoom').addEventListener('click', resetZoom);

// Event listener for download button
document.getElementById('downloadPNG').addEventListener('click', handleDownload);
