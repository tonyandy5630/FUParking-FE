'use client';
import { getListVehicleTypeAPI } from "@/api/vehicleType"
import { VehicleTypeProps } from "@/types/vehicleType.type";
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import Loading from "../LoadingPage/Loading";
import SearchField from "@/components/Common/searchField";
import SelectFilter from "@/components/Common/selectFilter";
import { Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";
import CreateVehicleType from "./CreateVehicleType";
import EditVehicleType from "./EditVehicleType";
import DeleteVehicleType from "./DeleteVehicleType";


export default function VehicleTypeTable() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const keys = [
        'Name',
        'Description',
        'Created Date'
    ];
    const [disable, setDisable] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAttribute, setFilterAttribute] = useState<keyof VehicleTypeProps>('name');
    const filterOptions = [
        { display: 'Name', value: 'name' }
    ];
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage + 1);
    };
    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    const handleFilterAttributeChange = (value: string) => {
        setFilterAttribute(value as keyof VehicleTypeProps);
    };
    const {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
        refetch
    } = useQuery({
        queryKey: ['/vehicle-types', rowsPerPage, page, searchTerm, filterAttribute],
        queryFn: () => getListVehicleTypeAPI(rowsPerPage, page, searchTerm, filterAttribute.toString()),
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
            <div className='flex flex-row gap-3 justify-center'>
                <SelectFilter
                    filterAttribute={filterAttribute}
                    setFilterAttribute={handleFilterAttributeChange}
                    listFilter={filterOptions}
                />
                <SearchField inputValue={inputValue} setInputValue={setInputValue} />
            </div>
            <div className='flex flex-row gap-3 items-center justify-center w-full'>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => refetch()}
                    disabled={false}
                >
                    Refresh
                </Button>
                <CreateVehicleType refetch={refetch} setIsPending={setDisable} disable={disable} />
            </div>
            {isLoading && <Loading />}
            {isError && <p>Error: {error.message}</p>}
            {isSuccess && (

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
                            {data?.data.data?.map((vehicleType: VehicleTypeProps) => (
                                <TableRow key={vehicleType.id}>
                                    <TableCell>{vehicleType.name}</TableCell>
                                    <TableCell>{vehicleType.description}</TableCell>
                                    <TableCell>{new Date(vehicleType.createdDate).toLocaleDateString('en-GB')}</TableCell>
                                    <TableCell>
                                        <div className='flex flex-row space-x-2'>
                                            <EditVehicleType id={vehicleType.id} refetch={refetch} setIsPending={setDisable} disable={disable} />
                                            <DeleteVehicleType id={vehicleType.id} refetch={refetch} setIsPending={setDisable} disable={disable} />
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
            )}
        </div>
    )
}

