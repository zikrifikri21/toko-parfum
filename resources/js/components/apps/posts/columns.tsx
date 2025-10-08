import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Post } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, EllipsisVertical, Pencil } from 'lucide-react';

const ShortData = ({
    name,
    callback,
}: {
    name: string;
    callback: () => void;
}) => {
    return (
        <Button variant="ghost" onClick={callback}>
            {name}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
};
type ActionHandlers = {
    onEdit: (data: Post) => void;
    onDelete: (id: string) => void;
};
export const getColumns = ({ onEdit }: ActionHandlers): ColumnDef<Post>[] => [
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <ShortData
                    name="Nama"
                    callback={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                />
            );
        },
        cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => {
            return (
                <ShortData
                    name="Deskripsi"
                    callback={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                />
            );
        },
        cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
    {
        accessorKey: 'image',
        header: () => <p className="text-center">Gambar</p>,
        cell: ({ row }) => {
            const image = row.getValue('image') as string;
            return (
                <div className="flex items-center justify-center gap-2">
                    {image ? (
                        <img
                            src={
                                image?.startsWith('default')
                                    ? image
                                    : `/storage/${image}`
                            }
                            alt={row.getValue('title') as string}
                            className="h-10 w-10 rounded-md object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                            <span className="text-sm text-muted-foreground">
                                No Image
                            </span>
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'action',
        header: 'Aksi',
        cell: ({ row }) => {
            const data = row.original;
            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                <EllipsisVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="me-4 w-16"
                            side="bottom"
                            align="end"
                        >
                            <DropdownMenuItem
                                className="flex justify-between"
                                onClick={() => onEdit(data)}
                            >
                                Edit <Pencil className="h-4 w-4" />
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                                className="flex justify-between"
                                onClick={() => onDelete(data.id)}
                            >
                                Hapus <Trash className="h-4 w-4" />
                            </DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            );
        },
    },
];
