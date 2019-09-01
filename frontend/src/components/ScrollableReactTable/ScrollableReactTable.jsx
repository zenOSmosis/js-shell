import React from 'react';
import Full from '../Full';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import style from './ScrollableReactTable.module.scss';
import classNames from 'classnames';

const ScrollableReactTable = (props) => {
  const { className, data: propsData, columns: propsColumns, ...propsRest } = props;
  const data = propsData ? propsData : {};
  const columns = propsColumns ? propsColumns : [];

  return (
    <Full>
      <ReactTable
        {...propsRest}
        className={classNames(style['scrollable-react-table'], className)}
        data={data}
        columns={columns}
      />
    </Full>
  );
};

export default ScrollableReactTable;