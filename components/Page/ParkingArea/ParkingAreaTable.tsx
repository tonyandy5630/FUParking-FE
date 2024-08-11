'use client';
import { useQuery } from "@tanstack/react-query";
import SearchField from "@/components/Common/searchField";
import { useEffect, useState } from "react";
import Loading from "../LoadingPage/Loading";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CardProps, TablePagination } from "@mui/material";
import { ParkingAreas } from "@/types/parkingArea.type";
import { getListParkingArea } from "@/api/parkingArea";
import SelectFilter from "@/components/Common/selectFilter";


type FilterOption = {
    display: string;
    value: string;
};

export default function ParkingAreaTable (){

    const [inputValue, setInputValue] = useState('');
    const filterOptions: FilterOption[] = [
        { display: 'Name', value: 'name' },
    ];
    const headTables = [
        'Name',
        'Description',
        'Max capacity',
        'Block',
        'Mode',
        'Status',
        'Created Date',      
        'Create By',
        'Last Modify By',
        'Last Modify Date',
    ];
    const [filterAttribute, setFilterAttribute] = useState<keyof ParkingAreas>('name');   

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage + 1);
    };
    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const handleFilterAttributeChange = (value: string) => {
        setFilterAttribute(value as keyof ParkingAreas);
    };
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');    
    const {
        data, isLoading, isError, isSuccess, error, refetch
    } = useQuery({
        queryKey: ['/areas', rowsPerPage, page, inputValue, filterAttribute],
        queryFn: () => getListParkingArea(rowsPerPage, page, inputValue, filterAttribute),
        retry: 1
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [inputValue]);

    return (
        <>
            <div className="flex flex-col gap-5">
                <div className='flex flex-row gap-3 justify-center'>
                    <SelectFilter
                        filterAttribute={filterAttribute}
                        setFilterAttribute={handleFilterAttributeChange}
                        listFilter={filterOptions}
                    />
                    <SearchField inputValue={inputValue} setInputValue={setInputValue} />
                </div>
            </div>
            <div className='flex flex-row gap-3 items-center justify-center w-full'>

            </div>
            {isLoading && <Loading />}
            {isError && <p>Something wrong, please trying again later...</p>}
            {isSuccess && (
                data.data.totalRecord === 0 ? (
                    <p>There is no data to show.</p>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headTables.map((headTable) => (
                                        <TableCell key={headTable} className='text-left text-sm font-medium text-slate-600'>{headTable}</TableCell>
                                    ))}                                    
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.data.data?.map((area: ParkingAreas) => (
                                    <TableRow key={area.id}>
                                        <TableCell>{area.name}</TableCell>
                                        <TableCell>{area.description}</TableCell>
                                        <TableCell>{area.maxCapacity}</TableCell>                                        
                                        <TableCell>{area.block}</TableCell>
                                        <TableCell>{area.mode}</TableCell>
                                        <TableCell>{area.statusParkingArea}</TableCell>
                                        <TableCell>{new Date(area.createdDate).toLocaleDateString('en-GB')}</TableCell>    
                                        <TableCell>{area.createBy}</TableCell>
                                        <TableCell>{area.lastModifyBy}</TableCell>
                                        <TableCell>{new Date(area.lastModifyDate).toLocaleDateString('en-GB')}</TableCell>                                    
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
                )
            )}
        </>
    )
}

function setFilterAttribute(arg0: string) {
    throw new Error("Function not implemented.");
}
