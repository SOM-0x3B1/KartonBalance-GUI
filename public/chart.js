Chart.defaults.borderColor = '#646464';
Chart.defaults.color = 'white';

/// Setup gyroscope chart
const gyroChart = new Chart("gyroChart", {
    type: "line",
    data: {
        datasets: [
            /*{
                label: "Speed",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgb(255, 99, 132)",
                cubicInterpolationMode: "monotone",
                data: []
            },*/
            {                
                label: "Pitch",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgb(54, 162, 235)",
                cubicInterpolationMode: "monotone",
                data: []
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            // Change options for ALL axes of THIS CHART
            streaming: {
                duration: 2000,
                delay: 10,
            }
        },
        scales: {
            x: {
                type: 'realtime',
                realtime: {
                    duration: 2000
                }
            },
            y: {
                min: -6,
                max: 6,
            }
        }
    }
});

/// Add new data to gyroscope chart
function addToGyroChart(pitch, speed) {
    /*chart.data.datasets[0].data.push({
        x: Date.now(),
        y: speed * 50,
    });*/
    gyroChart.data.datasets[0].data.push({
        x: Date.now(),
        y: pitch,
    });

    gyroChart.update('quiet');
}



/// Setup PID chart
const PIDChart = new Chart("PIDChart", {
    type: "line",
    data: {
        datasets: [
            {
                label: "P",
                backgroundColor: "rgba(6, 188, 0, 0.5)",
                borderColor: "rgb(6, 188, 0)",
                cubicInterpolationMode: "monotone",
                data: []
            },
            {                
                label: "I",
                backgroundColor: "rgba(226, 226, 49, 0.5)",
                borderColor: "rgb(226, 226, 49)",
                cubicInterpolationMode: "monotone",
                data: []
            },
            {                
                label: "D",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgb(255, 99, 132)",
                cubicInterpolationMode: "monotone",
                data: []
            },
            {                
                label: "PID",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgb(54, 162, 235)",
                cubicInterpolationMode: "monotone",
                data: []
            },
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            // Change options for ALL axes of THIS CHART
            streaming: {
                duration: 2000,
                delay: 10,
            }
        },
        scales: {
            x: {
                type: 'realtime',
                realtime: {
                    duration: 2000
                }
            },
            y: {
                min: -1100,
                max: 1100,
            }
        }
    }
});

/// Add new data to PID chart
function addToPIDChart(P, I, D, PID) {
    PIDChart.data.datasets[0].data.push({
        x: Date.now(),
        y: P,
    });
    PIDChart.data.datasets[1].data.push({
        x: Date.now(),
        y: I,
    });
    PIDChart.data.datasets[2].data.push({
        x: Date.now(),
        y: D,
    });
    PIDChart.data.datasets[3].data.push({
        x: Date.now(),
        y: PID,
    });           

    PIDChart.update('quiet');
}