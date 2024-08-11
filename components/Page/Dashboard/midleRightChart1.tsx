"use client";

import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import { getStatistic1 } from '@/api/statistic';

Chart.register(...registerables);

export default function MidleLeftChart1() {

    //nhan api
    const {
        data, isLoading, isError, isSuccess, error, refetch
    } = useQuery({
        queryKey: ['/statistic/session'],
        queryFn: () => getStatistic1(),
        retry: 1
    });


    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (isLoading || isError || !data || !chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        console.log(data?.data.data);
        if (!ctx) return;

        // Generate an array of the last 30 days
        const today = new Date();
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            return date;
        }).reverse();

        // Create a map from the API data for quick lookup
        const dataMap = new Map(data?.data.data?.map((item: any) => {
            const date = new Date(item.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
            return [formattedDate, item.totalSession];
        }));

        // Prepare chart labels and data, filling in 0 where necessary
        const labels = last30Days.map(date => `${date.getDate()}/${date.getMonth() + 1}`);
        const chartData = last30Days.map(date => {
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
            return dataMap.get(formattedDate) || 0;
        });

        // Cấu hình biểu đồ
        const config: ChartConfiguration = {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Sessions',
                        data: chartData,
                        borderColor: 'rgba(243, 112, 33, 0.5)',
                        backgroundColor: 'rgba(255, 247, 239, 1)',
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 3, 
                        pointHoverRadius: 6,
                    },
                ],
            },
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
    }, [data, isLoading, isError]);

    return (
        <div className="flex flex-col min-h-64 max-h-80 bg-white rounded-md border shadow-lg p-5 items-center justify-center" style={{ minWidth: "720px" }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
