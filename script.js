document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvData = e.target.result;
            const parsedData = parseCSV(csvData);
            updateCharts(parsedData);
        };
        reader.readAsText(file);
    }
});

// Function to parse CSV data
function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1);

    const labels = [];
    const values = [];

    rows.forEach(row => {
        const cols = row.split(',');
        labels.push(cols[0]);  // Assuming first column is for labels (e.g., months or categories)
        values.push(parseInt(cols[1]));  // Assuming second column is for values (e.g., data points)
    });

    return { labels, values };
}

// Function to update charts with new data
function updateCharts(data) {
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

// Default data (example)
const defaultLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const defaultData = [12, 19, 3, 5, 2, 3, 7];

// Initialize Bar Chart
const ctxBar = document.getElementById('barChart').getContext('2d');
const barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: defaultLabels,
        datasets: [{
            label: '# of Votes',
            data: defaultData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Initialize Line Chart
const ctxLine = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: defaultLabels,
        datasets: [{
            label: 'Data Points',
            data: defaultData,
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Initialize Pie Chart
const ctxPie = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [{
            label: 'Population',
            data: [300, 50, 100],
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
        responsive: true
    }
});
