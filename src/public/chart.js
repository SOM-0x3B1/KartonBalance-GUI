Chart.defaults.borderColor = '#646464';
Chart.defaults.color = 'white';
Chart.defaults.elements.point.radius = 0;

/// Setup gyroscope chart
const gyroChart = new Chart("gyroChart", {
    type: "line",
    data: {
        datasets: [            
            {                
                label: "Pitch",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgb(54, 162, 235)",
                data: []
            },
            {
                label: "Target",
                backgroundColor: "rgba(100, 0, 100, 0.5)",
                borderColor: "rgb(100, 0, 100)",
                data: []
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,
        animation: false,
        plugins: {
            // Change options for ALL axes of THIS CHART
            streaming: {
                duration: 2000,
                delay: 40,
                frameRate: 30,
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
function addToGyroChart(pitch, targetAngle) {
    /*chart.data.datasets[0].data.push({
        x: Date.now(),
        y: speed * 50,
    });*/
    gyroChart.data.datasets[0].data.push({
        x: Date.now(),
        y: pitch,
    });

    gyroChart.data.datasets[1].data.push({
        x: Date.now(),
        y: targetAngle,
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
                data: []
            },
            {                
                label: "I",
                backgroundColor: "rgba(226, 226, 49, 0.5)",
                borderColor: "rgb(226, 226, 49)",
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
        spanGaps: true,
        animation: false,
        plugins: {
            // Change options for ALL axes of THIS CHART
            streaming: {
                duration: 2000,
                delay: 10,
                frameRate: 30,
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



const speedChart = new Chart("speedChart", {
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
                label: "Speed",
                backgroundColor: "rgba(180, 0, 0, 0.5)",
                borderColor: "rgb(180, 0, 0)",
                data: []
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,
        animation: false,
        plugins: {
            // Change options for ALL axes of THIS CHART
            streaming: {
                duration: 2000,
                delay: 40,
                frameRate: 30,
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
                min: -0.3,
                max: 0.3,
            }
        }
    }
});

function addToSpeedChart(speed) {
    /*chart.data.datasets[0].data.push({
        x: Date.now(),
        y: speed * 50,
    });*/
    speedChart.data.datasets[0].data.push({
        x: Date.now(),
        y: speed,
    });

    speedChart.update('quiet');
}