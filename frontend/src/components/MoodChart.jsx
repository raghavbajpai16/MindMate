import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const MoodChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center text-muted">No mood data available for this week.</div>;
    }

    const chartData = {
        labels: data.map(d => d.date),
        datasets: [
            {
                label: 'Average Mood Score',
                data: data.map(d => d.average_score),
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly Mood Trends',
            },
        },
        scales: {
            y: {
                min: 1,
                max: 5,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <Line options={options} data={chartData} />
        </div>
    );
};

export default MoodChart;
