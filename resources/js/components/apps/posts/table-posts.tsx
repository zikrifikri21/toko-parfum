import { DataTable } from '@/components/apps/data-table';
import { Post } from '@/types';
import { Column } from '@tanstack/react-table';
import React from 'react';
import { getColumns } from './columns';

type ActionHandlers = {
    onEdit: (data: Post) => void;
    onDelete: (id: string) => void;
};

type TableMonitoringProps = {
    data: Post[];
    actionHandlers: ActionHandlers;
};

export default function TableListPosts({
    data,
    actionHandlers,
}: TableMonitoringProps) {
    const columns = React.useMemo(
        () => getColumns(actionHandlers),
        [actionHandlers],
    );

    return (
        <DataTable
            data={data}
            perPage={[10, 20, 50, 100]}
            columns={columns as Column<unknown>[]}
        />
    );
}
