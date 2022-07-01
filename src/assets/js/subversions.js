const chart = new Chart(document.getElementById('graphSubversions'), {
    type: 'doughnut',
    data: {
        labels: Object.keys(subversions),
        datasets: [{
            data: Object.values(subversions),
            backgroundColor: ['#002352', '#0066CC', '#2196F3', '#082048'],
            hoverOffset: 4
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false,
            }
        }
    }
});

var table = document.getElementById('tableSubversions');
for (var sv of Object.keys(subversions))
    table.innerHTML += `<tr> <td>${sv}</td> <td>${subversions[sv]}</td> </tr>`;