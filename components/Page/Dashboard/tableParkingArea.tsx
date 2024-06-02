'use client';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Modal from '@/components/modal/modal';
import { useState } from "react";

interface DashBoardProps {
    Area: string;
    Capacity: number;
    Available: number;
    Mode: string;
}

export default function TableParkingArea() {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    let data: DashBoardProps[] = [
        {
            Area: 'A',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'B',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'C',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'D',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'E',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'F',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'G',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'H',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'I',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'J',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'K',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'L',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'M',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'N',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'O',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'P',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'Q',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        },
        {
            Area: 'R',
            Capacity: 100,
            Available: 50,
            Mode: 'Normal'
        }
    ];


    return (
        <TableContainer component={Paper}>
            <Table className='w-full' aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className='text-base text-slate-600'>Area</TableCell>
                        <TableCell align="right" className='text-base text-slate-600'>Capacity</TableCell>
                        <TableCell align="right" className='text-base text-slate-600'>Available</TableCell>
                        <TableCell align="right" className='text-base text-slate-600'>Mode</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {item.Area}
                            </TableCell>
                            <TableCell align="right">{item.Capacity}</TableCell>
                            <TableCell align="right">{item.Available}</TableCell>
                            <TableCell align="right">{item.Mode}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* <h1>Dashboard</h1> */}
            {/* Add your dashboard content here */}
            {/* <button onClick={handleOpen}>Open Modal</button>
            <Modal onClose={handleClose} open={isOpen} setOpen={setIsOpen}>
                <button onClick={handleClose}>Close Modal</button>
                <h1>Modal Content</h1>
            </Modal> */}
        </TableContainer>
    );
}