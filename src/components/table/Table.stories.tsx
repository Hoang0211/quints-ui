import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, type TableSortDirection } from "./Table";
import { Badge, type BadgeVariant } from "../badge/Badge";

const meta = {
  title: "Components/Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["plain", "striped", "bordered"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Member {
  name: string;
  role: string;
  status: "Active" | "Invited" | "Suspended";
  joined: string;
}

const STATUS_VARIANT: Record<Member["status"], BadgeVariant> = {
  Active: "success",
  Invited: "info",
  Suspended: "alert",
};

const members: Member[] = [
  { name: "Ada Lovelace", role: "Engineer", status: "Active", joined: "2024-03-12" },
  { name: "Grace Hopper", role: "Admin", status: "Active", joined: "2023-11-02" },
  { name: "Alan Turing", role: "Engineer", status: "Invited", joined: "2025-01-20" },
  { name: "Katherine Johnson", role: "Analyst", status: "Active", joined: "2024-07-08" },
  { name: "Linus Torvalds", role: "Viewer", status: "Suspended", joined: "2022-09-15" },
];

const MemberRow = ({ member }: { member: Member }) => (
  <Table.Row>
    <Table.Cell>{member.name}</Table.Cell>
    <Table.Cell>{member.role}</Table.Cell>
    <Table.Cell>
      <Badge variant={STATUS_VARIANT[member.status]}>{member.status}</Badge>
    </Table.Cell>
    <Table.Cell>{member.joined}</Table.Cell>
  </Table.Row>
);

const headerRow = (
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Role</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Joined</Table.Head>
    </Table.Row>
  </Table.Header>
);

const fullComposition = (
  <>
    <Table.Caption>Team members</Table.Caption>
    {headerRow}
    <Table.Body>
      {members.map((member) => (
        <MemberRow key={member.name} member={member} />
      ))}
    </Table.Body>
  </>
);

export const Plain: Story = {
  args: {
    variant: "plain",
    children: fullComposition,
  },
};

export const Striped: Story = {
  args: {
    variant: "striped",
    children: fullComposition,
  },
};

export const Bordered: Story = {
  args: {
    variant: "bordered",
    children: fullComposition,
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: fullComposition,
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    children: fullComposition,
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: fullComposition,
  },
};

export const Hoverable: Story = {
  args: {
    variant: "striped",
    hoverable: true,
    children: fullComposition,
  },
};

const manyMembers = Array.from({ length: 6 }, (_, round) =>
  members.map((member) => ({ ...member, name: `${member.name} ${round + 1}` })),
).flat();

export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
    maxHeight: 280,
    children: (
      <>
        <Table.Caption>All team members</Table.Caption>
        {headerRow}
        <Table.Body>
          {manyMembers.map((member) => (
            <MemberRow key={member.name} member={member} />
          ))}
        </Table.Body>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    variant: "bordered",
    children: (
      <>
        {headerRow}
        <Table.Body>
          {members.map((member) => (
            <MemberRow key={member.name} member={member} />
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={4}>{members.length} members</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </>
    ),
  },
};

type SortKey = keyof Member;

export const Sortable: Story = {
  render: function SortableStory(args) {
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [direction, setDirection] = useState<Exclude<TableSortDirection, "none">>("asc");

    const sorted = [...members].sort((a, b) => {
      const order = a[sortKey].localeCompare(b[sortKey]);
      return direction === "asc" ? order : -order;
    });

    const toggleSort = (key: SortKey) => {
      if (key === sortKey) {
        setDirection(direction === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setDirection("asc");
      }
    };

    const columns: { key: SortKey; label: string }[] = [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "status", label: "Status" },
      { key: "joined", label: "Joined" },
    ];

    return (
      <Table {...args}>
        <Table.Caption>Team members — click a column header to sort</Table.Caption>
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.Head
                key={column.key}
                sortDirection={sortKey === column.key ? direction : "none"}
                onSort={() => toggleSort(column.key)}
              >
                {column.label}
              </Table.Head>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sorted.map((member) => (
            <MemberRow key={member.name} member={member} />
          ))}
        </Table.Body>
      </Table>
    );
  },
  args: {
    hoverable: true,
  },
};
