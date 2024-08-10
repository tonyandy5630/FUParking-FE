'use client';

export default function TotalCarParkedToday() {
    return (
        <div className='flex flex-col items-end justify-center rounded-md border shadow-lg bg-white min-w-96 pr-14 gap-2'>
            <p>Total vehicles parked today</p>
            <p className="text-3xl font-extrabold">1000/2000</p>
            <p style={{color: '#D9D9D9'}}>Update: 08:20 08/10/2024</p>
        </div>
    );
}