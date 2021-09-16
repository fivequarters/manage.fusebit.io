export interface BaseTableProps {
    selected: string[];
    loading: boolean;
    rows: {
        id: string;
        collapsableContent?: React.ReactNode | React.ReactText;
        [x: string]: React.ReactNode | React.ReactText;
    }[];
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteAll: () => void;
    onClickNew?: () => void;
    headers: string[];
    entityName: string;
    onSelectRow: (e: any, id: string) => void;
    isSelected: (id: string) => boolean;
    rowsPerPage: any;
    page: any;
    emptyTableText: string;
    handleChangePage: (e: any, newPage: number) => void;
    handleChangeRowsPerPage: (e: any) => void;
    collapseTrigger?: string;
    isCollapsible?: boolean;
}