import { useLayoutEffect, useMemo } from "react";
import useGetCovidStatistics from "../../../../hooks/useGetCovidStatistics";
import useGetSdohStatistics from "../../../../hooks/useGetSdohStatistics";
import { useTable } from "react-table";
import styled from "styled-components";
import { CovidVarMapping } from "./constants";

const TableContainer = styled.div``;

const Table = styled.table`
  border-collapse: collapse;

  tr,
  th,
  td {
    padding: 0.25em 0.5em;
  }
  tr:nth-child(even) {
    background: rgba(0, 0, 0, 0.05);
  }
  tr {
    td:nth-of-type(n + 2) {
      border-left: 1px solid rgba(0, 0, 0, 0.25);
    }
  }
`;
const StatsTableInner = ({ data, columns }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <TableContainer>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableContainer>
  );
};

const CovidStatsTable = ({
  geoid,
  metrics,
  includedColumns,
  ids,
  dateIndex,
  loadedCallback = () => {},
}) => {
  const [data, columns, dataReady] = useGetCovidStatistics({
    geoid,
    includedColumns,
    neighborIds: ids,
    dateIndex,
  });

  useLayoutEffect(() => {
    loadedCallback(dataReady);
  }, [dataReady]);

  const currVariables = metrics.map((metric) => CovidVarMapping[metric]).flat();
  const filteredData = data.filter((d) => currVariables.includes(d.variable));
  const innerTable = useMemo(
    () => <StatsTableInner data={filteredData} columns={columns} />,
    [dataReady, geoid]
  );
  return innerTable;
};

const SdohStatsTable = ({
  geoid,
  metrics,
  includedColumns,
  ids,
  dateIndex,
}) => {
  const [data, columns, dataReady] = useGetSdohStatistics({
    geoid,
    includedColumns,
    neighborIds: ids,
    dateIndex,
  });
  console.log(data, columns, dataReady);
  const filteredData = data.filter((d) => metrics.includes(d.variable));
  const innerTable = useMemo(
    () => <StatsTableInner data={filteredData} columns={columns} />,
    [dataReady, geoid]
  );
  return innerTable;
};

export default function StatsTable({
  geoid = 17031,
  topic = "COVID",
  metrics = [],
  includedColumns,
  ids = [],
  dateIndex,
}) {
  console.log("topic", topic);
  switch (topic) {
    case "SDOH":
      return (
        <SdohStatsTable
          {...{ metrics, geoid, includedColumns, ids, dateIndex }}
        />
      );
    default:
      return (
        <CovidStatsTable
          {...{ metrics, geoid, includedColumns, ids, dateIndex }}
        />
      );
  }
}
