document.addEventListener("DOMContentLoaded", () => {
    // 1. Light Theme Controller (Forced light theme)
    applyTheme("light");

    function applyTheme(theme) {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        localStorage.setItem("theme", "light");
    }

    // 2. Setup Student Profile Progress Chart
    const progressChartEl = document.getElementById("progressChart");
    if (progressChartEl) {
        const rawDates = JSON.parse(progressChartEl.dataset.dates || "[]");
        const rawCounts = JSON.parse(progressChartEl.dataset.counts || "[]");

        let textCol = "#1e293b";
        let gridCol = "rgba(0,0,0,0.08)";

        const ctx = progressChartEl.getContext("2d");
        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: rawDates,
                datasets: [{
                    label: "Cumulative Solved",
                    data: rawCounts,
                    borderColor: "#39d353",
                    backgroundColor: "rgba(57, 211, 83, 0.1)",
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: gridCol
                        },
                        ticks: {
                            color: textCol,
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        grid: {
                            color: gridCol
                        },
                        ticks: {
                            color: textCol
                        }
                    }
                }
            }
        });
    }

    // 3. Setup Student Compare Radar Chart
    const compareChartEl = document.getElementById("compareChart");
    if (compareChartEl) {
        const student1Name = compareChartEl.dataset.s1Name || "Student 1";
        const student2Name = compareChartEl.dataset.s2Name || "Student 2";
        
        const s1Stats = JSON.parse(compareChartEl.dataset.s1Stats || "[]");
        const s2Stats = JSON.parse(compareChartEl.dataset.s2Stats || "[]");
        
        // Stats format: [Total, Easy, Medium, Hard, Acceptance, Streak, ContestRating/10]
        const labels = ["Total Solved", "Easy", "Medium", "Hard", "Acceptance %", "Streak", "Contest Rating"];
        
        let textCol = "#1e293b";
        let gridCol = "rgba(0,0,0,0.08)";

        const ctx = compareChartEl.getContext("2d");
        const chart = new Chart(ctx, {
            type: "radar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: student1Name,
                        data: s1Stats,
                        backgroundColor: "rgba(57, 211, 83, 0.2)",
                        borderColor: "#39d353",
                        borderWidth: 2,
                        pointBackgroundColor: "#39d353"
                    },
                    {
                        label: student2Name,
                        data: s2Stats,
                        backgroundColor: "rgba(255, 46, 99, 0.2)",
                        borderColor: "#ff2e63",
                        borderWidth: 2,
                        pointBackgroundColor: "#ff2e63"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: textCol
                        }
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            color: gridCol
                        },
                        grid: {
                            color: gridCol
                        },
                        pointLabels: {
                            color: textCol,
                            font: {
                                size: 11,
                                weight: '600'
                             }
                        },
                        ticks: {
                            backdropColor: "transparent",
                            color: textCol,
                            display: false // hide labels since scales are different
                        }
                    }
                }
            }
        });
    }
});
