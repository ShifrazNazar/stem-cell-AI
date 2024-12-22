"use client";

import { BodyCheckupAnalysis } from "@/interfaces/body-checkup.interface";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { UploadModal } from "../modals/upload-modal";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function UserReports() {
  const { data: reports } = useQuery<BodyCheckupAnalysis[]>({
    queryKey: ["user-reports"],
    queryFn: () => fetchUserReports(),
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const reportTypeColors: { [key: string]: string } = {
    Employment: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "Non-Disclosure Agreement":
      "bg-green-100 text-green-800 hover:bg-green-200",
    Sales: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Lease: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    Services: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    Other: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };

  const columns: ColumnDef<BodyCheckupAnalysis>[] = [
    {
      accessorKey: "_id",
      header: ({ column }) => {
        return <Button variant={"ghost"}>Report ID</Button>;
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue<string>("_id")}</div>
      ),
    },
    {
      accessorKey: "recommendationScore",
      header: ({ column }) => {
        return <Button variant={"ghost"}>Overall Score</Button>;
      },
      cell: ({ row }) => {
        const score = parseFloat(row.getValue("recommendationScore"));
        return (
          <Badge
            className="rounded-md"
            variant={
              score > 75 ? "success" : score < 50 ? "destructive" : "secondary"
            }
          >
            {score.toFixed(2)} Overall Score
          </Badge>
        );
      },
    },
    {
      accessorKey: "reportType",
      header: "Report Type",
      cell: ({ row }) => {
        const reportType = row.getValue("reportType") as string;
        const colorClass =
          reportTypeColors[reportType] || reportTypeColors["Other"];
        return (
          <Badge className={cn("rounded-md", colorClass)}>{reportType}</Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return <Button variant={"ghost"}>Created At</Button>;
      },
      cell: ({ row }) => {
        const createdAt = row.getValue<string>("createdAt");
        const formattedDate = new Date(createdAt);
        return (
          <div className="font-medium">{formattedDate.toLocaleString()}</div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const report = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/dashboard/report/${report._id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <span className="text-destructive">Delete Report</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your report and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: reports ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const totalReports = reports?.length || 0;
  const averageScore =
    totalReports > 0
      ? (reports?.reduce(
          (sum, report) => sum + (report.recommendationScore ?? 0),
          0
        ) ?? 0) / totalReports
      : 0;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Reports</h1>
        <Button onClick={() => setIsUploadModalOpen(true)}>New Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => table.reset()}
      />
    </div>
  );
}

async function fetchUserReports(): Promise<BodyCheckupAnalysis[]> {
  const response = await api.get("/reports/user-reports");
  return response.data;
}
