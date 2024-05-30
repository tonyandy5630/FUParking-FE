'use client';
import React, { useEffect, useRef, useState } from 'react';
import Headers from '@/components/layout/header';
import LeftNavbar from '@/components/layout/navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [screenHeight, setScreenHeight] = useState(0);

    useEffect(() => {
        const updateScreenHeight = () => setScreenHeight(window.innerHeight);

        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
        updateScreenHeight();

        window.addEventListener('resize', updateScreenHeight);

        // Clean up the event listener when the component is unmounted
        return () => window.removeEventListener('resize', updateScreenHeight);
    }, []);

    return (
        <div style={{ height: `${screenHeight}px ` }}>
            <div ref={headerRef}>
                <Headers />
            </div>
            <div className="flex flex-row h-full" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
                <div className='overflow-auto bg-gray-800'>
                    <LeftNavbar />
                </div>
                <main className="flex-grow overflow-auto mt-5 mb-5 pl-10 pr-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;