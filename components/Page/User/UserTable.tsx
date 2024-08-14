"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CardProps, TablePagination } from "@mui/material";
import SelectFilter from "@/components/Common/selectFilter";
import SearchField from "@/components/Common/searchField";
import Loading from "../LoadingPage/Loading";
import {Packages} from "@/types/package.type";
import {getListPackage} from "@/api/package";
import {User} from "@/types/user.type";
import {getListUser} from "@/api/user";

type FilterOption = {
    display: string;
    value: string;
};

export default function UserTable () {
    const [inputValue, setInputValue] = useState('');
    const filterOptions: FilterOption[] = [
        { display: 'Name', value: 'name' },
        { display: 'Role', value: 'role' },
        { display: 'Status', value: 'packageStatus' },
    ];

    const headTables = [
        'No.',
        'Full Name',
        'Email',
        'Role',
        'Status',
        'Created Date',
        'Created By',
        'Last Modified Date',
        'Last Modified By',
    ];

    const [filterAttribute, setFilterAttribute] = useState<keyof User>('fullName');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage + 1);
    };
    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const handleFilterAttributeChange = (value: string) => {
        setFilterAttribute(value as keyof User);
    };

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const {
        data, isLoading, isError, isSuccess, error, refetch
    } = useQuery({
        queryKey: ['/user', rowsPerPage, page, inputValue, filterAttribute],
        queryFn: () => getListUser(rowsPerPage, page, inputValue, filterAttribute),
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
                                {data?.data.data?.map((packs: User, index) => (
                                    <TableRow key={packs.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{packs.fullName}</TableCell>
                                        <TableCell>{packs.fullName}</TableCell>
                                        <TableCell>{packs.email}</TableCell>
                                        <TableCell>{packs.role}</TableCell>
                                        <TableCell>{packs.statusUser}</TableCell>
                                        <TableCell>{packs.createdDate}</TableCell>
                                        <TableCell>{packs.createdBy}</TableCell>
                                        <TableCell>{packs.lastModifiedDate}</TableCell>
                                        <TableCell>{packs.lastModifiedBy}</TableCell>
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