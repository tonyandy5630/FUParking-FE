import baseURL from ".";

export const GET_LIST_TRANSACTION_API_URL = (
    pageSize: number,
    pageIndex: number,
    SearchInput: string,
    Attribute: string
    ) =>
    `${baseURL}/transaction?PageSize=${pageSize}&PageIndex=${pageIndex}${
        SearchInput ? `&SearchInput=${SearchInput}` : ""
    }&Attribute=${Attribute}`;
    