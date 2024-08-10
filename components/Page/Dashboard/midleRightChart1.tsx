"use client";

import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export default function MidleLeftChart1() {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) return;

        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Transaction',
                    data: [12, 19, 3, 5, 2, 3, 10, 15, 20, 25, 30, 18], // Dữ liệu số lần check-in trong các tháng
                    borderColor: 'rgba(243, 112, 33, 0.5)',
                    backgroundColor: 'rgba(255, 247, 239, 1)',
                    fill: true,
                },
            ],
        };

        // Cấu hình biểu đồ
        const config: ChartConfiguration = {
            type: 'line',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Times',
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Days',
                        },
                    },
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Bike Parking Vehicle Session in 30 days Chart',
                        color: 'black',
                    },
                },
            },
        };

        // Tạo biểu đồ
        const myChart = new Chart(ctx, config);

        // Hủy biểu đồ khi component unmount
        return () => {
            myChart.destroy();
        };
    }, []);

    return (
        <div className="flex flex-col min-h-64 max-h-80 bg-white rounded-md border shadow-lg p-5 items-center justify-center" style={{ minWidth: "720px" }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
