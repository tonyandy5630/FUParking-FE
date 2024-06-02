'use client';
import React, { useEffect, useRef, useState } from 'react';
import Headers from '@/components/layout/header';
import LeftNavbar from '@/components/layout/navbar';
import { useMutation } from '@tanstack/react-query';
import { roleAPI } from '@/api/auth';
import { EnumAuthRole } from '@/constant/enum';
import Loading from '@/components/Page/LoadingPage/Loading';
import NotAuth from '@/components/Page/NotAuthPage/NotAuth';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isAuthRole, setIsAuthRole] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const headerHeight = 80;

    const authMutation = useMutation({
        mutationKey: ['/auth'],
        mutationFn: roleAPI,
    });

    useEffect(() => {
        isAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isAuth = async () => {
        try {
            await authMutation.mutateAsync({},
                {
                    onSuccess: (data) => {
                        if (data.data.data.role == EnumAuthRole.MANAGER) {
                            setIsAuthRole(true);
                        } else {
                            setIsAuthRole(false);
                        }
                        setIsLoading(false);
                    }
                });
        } catch (error) {
            setIsAuthRole(false);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return Loading();
    }

    if (!isAuthRole) {
        return NotAuth();
    }

    return (
        <div className='h-screen'>
            <div>
                <Headers isOpen={isOpen} setIsOpen={setIsOpen} height={headerHeight} />
            </div>
            <div className="flex flex-row h-full" style={{ height: `calc(100vh - ${headerHeight}px` }}>
                <div className='overflow-auto bg-gray-800'>
                    <LeftNavbar open={isOpen} />
                </div>
                <main className="flex-grow overflow-auto mt-5 mb-5 pt-2 pb-2 pl-10 pr-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;