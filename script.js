// Function to parse CSV and create datasets
function parseCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const rows = text.split('\n').map(row => row.split(','));
            
            // Validate CSV rows
            if (rows.length < 2 || rows[0].length < 2) {
                reject("Invalid CSV format. Please ensure there are at least two rows and two columns.");
                return;
            }
            
            const labels = rows.map(row => row[0].trim()).filter(label => label); // Trim whitespace and filter out empty labels
            const data = rows.map(row => parseFloat(row[1])).filter(value => !isNaN(value)); // Filter out invalid numbers

            if (labels.length === 0 || data.length === 0) {
                reject("No valid data found. Please ensure your CSV has correct values.");
                return;
            }
            
            resolve({ labels, data });
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// Variables to store chart instances
let barChart, lineChart;

// Function to reset zoom
function resetZoom() {
    if (barChart) {
        barChart.resetZoom();
    }
    if (lineChart) {
        lineChart.resetZoom();
    }
}

// Function to create the charts
async function createCharts() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a CSV file.");
        return;
    }

    const { labels, data } = await parseCSV(file);

    // Destroy previous charts if they exist
    if (barChart) barChart.destroy();
    if (lineChart) lineChart.destroy();

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
                            enabled: true // Enable zooming with mouse wheel
                        },
                        pinch: {
                            enabled: true // Enable zooming with pinch gestures
                        },
                        mode: 'xy' // Allow zooming on both axes
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy' // Allow panning on both axes
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
                            enabled: true // Enable zooming with mouse wheel
                        },
                        pinch: {
                            enabled: true // Enable zooming with pinch gestures
                        },
                        mode: 'xy' // Allow zooming on both axes
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy' // Allow panning on both axes
                    }
                }
            }
        }
    });

    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
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

// Event listener for file upload
document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = file.name; // Display the file name
    } else {
        document.getElementById('fileName').textContent = ''; // Clear if no file selected
    }
    createCharts(); // Proceed to create charts
});

// Event listener for reset zoom button
document.getElementById('resetZoom').addEventListener('click', resetZoom);


// Event listener for file upload
document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = file.name; // Display the file name
    } else {
        document.getElementById('fileName').textContent = ''; // Clear if no file selected
    }
    createCharts(); // Proceed to create charts
});
