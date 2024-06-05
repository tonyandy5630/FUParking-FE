'use client';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { CardProps } from "@/types/card.type";
import { useQuery } from "@tanstack/react-query";
import { listCardAPI } from "@/api/card";
import { useEffect, useState } from "react";
import Loading from "../LoadingPage/Loading";
import SelectFilter from "@/components/Common/selectFilter";
import SearchField from "@/components/Common/searchField";
import EditCard from "./EditCard";
import DeleteCard from "./DeleteCard";
import AddCard from "./AddCard";

export type CardKey = keyof CardProps;

export default function CardTable() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const keys = [
        'Card Number',
        'Plate Number',
        'Created Date'
    ];
    const [disable, setDisable] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAttribute, setFilterAttribute] = useState<keyof CardProps>('cardNumber');
    const filterOptions = [
        { display: 'Card Number', value: 'cardNumber' },
        { display: 'Plate Number', value: 'plateNumber' }
    ];
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage + 1);
    };
    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    const handleFilterAttributeChange = (value: string) => {
        setFilterAttribute(value as keyof CardProps);
    };
    const {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
        refetch
    } = useQuery({
        queryKey: ['/cards', rowsPerPage, page, searchTerm, filterAttribute],
        queryFn: () => listCardAPI(rowsPerPage, page, searchTerm, filterAttribute.toString()),
        retry: 1
    })

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [inputValue]);

    return (
        <div className="flex flex-col gap-5">
            {isLoading && <Loading />}
            {isError && <p>Error: {error.message}</p>}
            {isSuccess && (
                <>
                    <div className='flex flex-row gap-3 items-center justify-center w-full'>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => refetch()}
                            disabled={false}
                        >
                            Refresh
                        </Button>
                        <AddCard refetch={refetch} setIsPending={setDisable} disable={disable} />
                    </div>
                    <div >
                        <div className='flex flex-row gap-3 justify-center'>
                            <SelectFilter
                                filterAttribute={filterAttribute}
                                setFilterAttribute={handleFilterAttributeChange}
                                listFilter={filterOptions}
                            />
                            <SearchField inputValue={inputValue} setInputValue={setInputValue} />
                        </div>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {keys.map((key) => (
                                            <TableCell key={key} className='text-left text-sm font-medium text-slate-600'>{key}</TableCell>
                                        ))}
                                        <TableCell className='text-left text-sm font-medium text-slate-600'>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.data.data?.map((card: CardProps) => (
                                        <TableRow key={card.id}>
                                            <TableCell>{card.cardNumber}</TableCell>
                                            <TableCell>{card.plateNumber}</TableCell>
                                            <TableCell>{new Date(card.createdDate).toLocaleDateString('en-GB')}</TableCell>
                                            <TableCell>
                                                <div className='flex flex-row space-x-2'>
                                                    <EditCard id={card.id} refetch={refetch} setIsPending={setDisable} disable={disable} />
                                                    <DeleteCard id={card.id} refetch={refetch} setIsPending={setDisable} disable={disable} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={data?.data.totalRecord || -1}
                                page={page - 1}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </div>
                </>
            )}
        </div>
    )
}