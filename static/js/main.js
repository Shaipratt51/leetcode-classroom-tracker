document.addEventListener("DOMContentLoaded", () => {
    // 1. Light/Dark Theme Controller
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeIcon = document.getElementById("themeIcon");
    const currentTheme = localStorage.getItem("theme") || "dark"; // Default to dark theme

    // Apply the saved theme on page load
    applyTheme(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const activeTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
            applyTheme(activeTheme);
        });
    }

    function applyTheme(theme) {
        if (theme === "dark") {
            document.body.classList.remove("light-theme");
            document.body.classList.add("dark-theme");
            if (themeIcon) themeIcon.className = "bi bi-sun-fill";
        } else {
            document.body.classList.remove("dark-theme");
            document.body.classList.add("light-theme");
            if (themeIcon) themeIcon.className = "bi bi-moon-stars-fill";
        }
        localStorage.setItem("theme", theme);
        
        // Dispatch event so active charts can re-draw with correct text/grid colors if needed
        window.dispatchEvent(new Event('theme-changed'));
    }

    // 2. Setup Student Profile Progress Chart
    const progressChartEl = document.getElementById("progressChart");
    if (progressChartEl) {
        const rawDates = JSON.parse(progressChartEl.dataset.dates || "[]");
        const rawCounts = JSON.parse(progressChartEl.dataset.counts || "[]");

        let textCol = document.body.classList.contains("dark-theme") ? "#f8fafc" : "#1e293b";
        let gridCol = document.body.classList.contains("dark-theme") ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

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

        // Re-theme chart on theme changes
        window.addEventListener('theme-changed', () => {
            const dark = document.body.classList.contains("dark-theme");
            chart.options.scales.x.ticks.color = dark ? "#f8fafc" : "#1e293b";
            chart.options.scales.y.ticks.color = dark ? "#f8fafc" : "#1e293b";
            chart.options.scales.x.grid.color = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
            chart.options.scales.y.grid.color = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
            chart.update();
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
        
        let textCol = document.body.classList.contains("dark-theme") ? "#f8fafc" : "#1e293b";
        let gridCol = document.body.classList.contains("dark-theme") ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

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

        // Re-theme radar chart
        window.addEventListener('theme-changed', () => {
            const dark = document.body.classList.contains("dark-theme");
            chart.options.plugins.legend.labels.color = dark ? "#f8fafc" : "#1e293b";
            chart.options.scales.r.angleLines.color = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
            chart.options.scales.r.grid.color = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
            chart.options.scales.r.pointLabels.color = dark ? "#f8fafc" : "#1e293b";
            chart.update();
        });
    }
});
