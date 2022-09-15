import useGetQuantileStatistics from "../../hooks/useGetQuantileStatistics";
import { formatNumber } from "../../utils";
import styled from "styled-components";
import colors from "../../config/colors";

const Th = ({ children, ...props }) => <th {...props}>{children}</th>;
const Td = ({ children, ...props }) => <td {...props}>{children}</td>;
const TableEntry = ({ type, items, cellProps, rowProps }) => {
    const Cell = type === 'body' ? Td : Th;
    return (
        <tr {...rowProps}>
            {items.map((item, idx) => (
                <Cell {...cellProps} key={`cell-entry-${idx}`}>{!isNaN(+item) ? formatNumber(+item) : item}</Cell>
            ))}
        </tr>
    );
};
const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    tr:nth-child(even) {
        background: rgba(0,0,0,0.05);
    }
    th {
        text-align: left;
        white-space: nowrap;
    }
    td, th {
        padding: .25em;
        border-left: 1px dashed ${colors.gray}33;
    }
    tr td:nth-of-type(1), tr th:nth-of-type(1) {
        border-left: none;
    }
`

export const Table = ({ children, ...props }) => <StyledTable {...props}><tbody>{children}</tbody></StyledTable>;
export const TableHeader = (props) => <TableEntry type="header" {...props} />;
export const TableRow = (props) => <TableEntry type="body" {...props} />;

const MetricsRow = ({ metric, geoid, neighborGroups, includedColumns, dateIndex, dataset, getStateStats, ...props }) => {
    const data = useGetQuantileStatistics({
        variable: metric,
        dataset,
        geoid,
        getStateStats,
        neighborGroups,
        dateIndex,
    });
    const dataReady = Object.keys(data).length;
    const items = dataReady ? includedColumns.map(column => data[column.accessor]) : []
    // if (dataReady) debugger;
    return dataReady ? <TableRow {...{ items, ...props }} /> : null
}

export const MetricsTable = ({ tableProps={}, rowProps={}, metrics=[], includedColumns=[], ...props }) => {
    return <Table {...{tableProps}}>
        <TableHeader items={includedColumns.map(f => f.header)} {...{rowProps}} />
        {metrics.map((metric,idx) => <MetricsRow key={`${metric}-table-row-${idx}`} {...{ metric, includedColumns, rowProps, ...props }} />)}
    </Table>
};
