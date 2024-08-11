"use client";

import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import { getStatistic2 } from '@/api/statistic';

Chart.register(...registerables);

export default function MidleLeftChart2() {
    const chartRef1 = useRef<HTMLCanvasElement | null>(null);
    const chartRef2 = useRef<HTMLCanvasElement | null>(null);

    const {
        data, isLoading, isError, isSuccess, error, refetch
    } = useQuery({
        queryKey: ['/statistic/payment/method'],
        queryFn: () => getStatistic2(),
        retry: 1
    });

    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const ctx1 = chartRef1.current?.getContext('2d');
        const ctx2 = chartRef2.current?.getContext('2d');
        if (!ctx1 || !ctx2) return;

        const data2 = {
            labels: ['Red', 'Blue'],
            datasets: [
                {
                    label: 'Transaction',
                    data: [8, 15],
                    backgroundColor: [
                        'rgba(165, 165, 165, 0.8)',
                        'rgba(255, 127, 80, 0.8)'
                    ],
                    borderWidth: 1,
                },
            ],
        };

        const dataMap1 = new Map(data?.data.data?.map((item: any) => {
            return [item.paymentMethod, item.totalPayment];
        }));

        const data1 = {
            labels: Array.from(dataMap1.keys()),
            datasets: [
                {
                    label: 'Transactions',
                    data: Array.from(dataMap1.values()),
                    backgroundColor: [
                        'rgba(255, 180, 0, 0.8)',
                        'rgba(237, 125, 49, 0.8)'
                    ],
                    borderWidth: 1,
                },
            ],
        };

        const config1: ChartConfiguration<'pie'> = {
            type: 'pie',
            data: data1,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Payment Method Usage Ratio Chart in the Month',
                        color: 'black',
                    },
                },
            },
        };

        const config2: ChartConfiguration<'pie'> = {
            type: 'pie',
            data: data2,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Revenue Share Chart Across Parking Areas in the Month',
                        color: 'black',
                    },
                },
            },
        };

        const myChart1 = new Chart(ctx1, config1);
        const myChart2 = new Chart(ctx2, config2);

        return () => {
            myChart1.destroy();
            myChart2.destroy();
        };
    }, [data, isLoading, isError, isSuccess, error]);

    return (
        <div className="min-h-64 max-h-80 bg-white rounded-md border shadow-lg gap-4 flex items-center justify-around p-5" style={{ minWidth: "720px" }}>
            <div>
                    <canvas ref={chartRef1}></canvas>
                </div>
                <div className='h-40 w-px' style={{backgroundColor: '#D9D9D9'}}></div>
                <div>
                    <canvas ref={chartRef2}></canvas>
                </div>
        </div>
    );
}
