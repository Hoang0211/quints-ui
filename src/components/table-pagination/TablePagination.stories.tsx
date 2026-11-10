import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "../table/Table";
import { TablePagination } from "./TablePagination";

const meta = {
  title: "Components/Data Display/TablePagination",
  component: TablePagination,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
  args: {
    totalItems: 97,
  },
} satisfies Meta<typeof TablePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const WithoutPageSizeSelector: Story = {
  args: {
    pageSizeOptions: [],
  },
};

export const WithoutFirstLastButtons: Story = {
  args: {
    showFirstLastButtons: false,
  },
};

export const LastPage: Story = {
  args: {
    defaultPage: 10,
  },
};

export const Empty: Story = {
  args: {
    totalItems: 0,
  },
};

const orders = Array.from({ length: 47 }, (_, index) => ({
  id: `ORD-${String(index + 1).padStart(4, "0")}`,
  customer: ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson"][index % 4],
  total: `$${((index * 37) % 400) + 20}.00`,
}));

function PaginatedOrders() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const visible = orders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Table>
        <Table.Caption>Orders</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Order</Table.Head>
            <Table.Head>Customer</Table.Head>
            <Table.Head>Total</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {visible.map((order) => (
            <Table.Row key={order.id}>
              <Table.Cell>{order.id}</Table.Cell>
              <Table.Cell>{order.customer}</Table.Cell>
              <Table.Cell>{order.total}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <TablePagination
        totalItems={orders.length}
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 25]}
        aria-label="Orders pagination"
      />
    </div>
  );
}

export const WithTable: Story = {
  render: () => <PaginatedOrders />,
};
