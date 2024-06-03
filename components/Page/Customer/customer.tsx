'use client';
import { useEffect, useState } from 'react';
import SelectFilter from './selecterMenuFilter';
import SearchField from './searchField';
import { CustomerWithFillerKey } from '@/types/customer.type';
import { useMutation, useQuery } from '@tanstack/react-query';
import { changeStatusCustomerAPI, getListCustomerWithFillerAPI } from '@/api/customer';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Button } from '@mui/material';
import Loading from '../LoadingPage/Loading';
import { toast } from 'react-toastify';
import AddCustomer from './addCustomer';

export default function Customer() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAttribute, setFilterAttribute] = useState<CustomerWithFillerKey>('fullName');
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['/customer', rowsPerPage, page, searchTerm, filterAttribute],
        queryFn: () => getListCustomerWithFillerAPI(rowsPerPage, page, searchTerm, filterAttribute.toString()),
        retry: 1,
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [inputValue]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const changeStatusCustomerMutation = useMutation({
        mutationKey: ['/customer/status'],
        mutationFn: changeStatusCustomerAPI,
    });

    const onStatusChange = async (isActive: boolean, customerId: string) => {
        try {
            await changeStatusCustomerMutation.mutateAsync({ isActive, customerId }, {
                onSuccess: (data) => {
                    refetch();
                    toast.success(data.data.message);
                },
            });
        } catch (error: any) {
            toast.error(error.message);
        }
    }


    return (
        <div className='bg-white h-full w-full flex flex-col items-center justify-center p-5 gap-5 border rounded-md shadow-md'>
            <h1 className='text-2xl font-semibold'>Customer List</h1>
            <div className='flex flex-row gap-3 justify-between'>
                <SelectFilter filterAttribute={filterAttribute} setFilterAttribute={setFilterAttribute} />
                <SearchField inputValue={inputValue} setInputValue={setInputValue} />
            </div>
            <div className='flex flex-row gap-3 items-center justify-center w-full'>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => refetch()}
                    disabled={changeStatusCustomerMutation.isPending}
                >
                    Refresh
                </Button>
                <AddCustomer disabled={changeStatusCustomerMutation.isPending} refetch={refetch} />
            </div>
            {isLoading && <Loading />}
            {isError && <p>Error: {error.message}</p>}
            {isSuccess && (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.data.data?.map((row) => (
                                <TableRow key={row.customerId}>
                                    <TableCell>{row.fullName}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.phone}</TableCell>
                                    <TableCell>
                                        {row.customerType === 'PAID' ? (
                                            <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded w-16 text-center">
                                                Paid
                                            </span>
                                        ) : row.customerType === 'FREE' ? (
                                            <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded w-16 text-center">
                                                Free
                                            </span>
                                        ) : (
                                            <span>{row.customerType}</span>
                                        )}</TableCell>
                                    <TableCell>
                                        {row.statusCustomer === 'ACTIVE' ? (
                                            <span className="p-1 pl-2 pr-2 rounded-xl inline-block w-16 text-center" style={{ color: '#62a34f', backgroundColor: '#dcfce7' }}>Active</span>
                                        ) : row.statusCustomer === 'INACTIVE' ? (
                                            <span className="p-1 pl-2 pr-2 rounded-xl inline-block w-16 text-center" style={{ color: '#fcca46', backgroundColor: '#fef9c3' }}>Inactive</span>
                                        ) : (
                                            <span>{row.statusCustomer}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-row gap-3'>
                                            {row.statusCustomer === 'INACTIVE' &&
                                                <Button
                                                    sx={{
                                                        backgroundColor: '#3b82f6',
                                                        color: 'white',
                                                        width: '80px',
                                                        '&:disabled': {
                                                            backgroundColor: 'grey',
                                                            color: 'white',
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: '#2563eb',
                                                        }
                                                    }}
                                                    onClick={() => onStatusChange(true, row.customerId)}
                                                    disabled={changeStatusCustomerMutation.isPending}
                                                >
                                                    Active
                                                </Button>
                                            }
                                            {row.statusCustomer === 'ACTIVE' &&
                                                <Button
                                                    sx={{
                                                        backgroundColor: '#ef4444',
                                                        color: 'white',
                                                        width: '80px',
                                                        '&:disabled': {
                                                            backgroundColor: 'grey',
                                                            color: 'white',
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: '#dc2626',
                                                        }
                                                    }}
                                                    onClick={() => onStatusChange(false, row.customerId)}
                                                    disabled={changeStatusCustomerMutation.isPending}
                                                >
                                                    Deactive
                                                </Button>
                                            }
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.data.totalRecord || -1}
                        page={page - 1}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            )}
        </div>
    );
}