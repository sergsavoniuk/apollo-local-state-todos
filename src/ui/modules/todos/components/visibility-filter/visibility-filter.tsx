import React from 'react';
import { CustomInput } from 'reactstrap';
import gql from 'graphql-tag';

import { Filter, VisibilityFilter } from 'ui/modules/todos/types';

import classes from './visibility-filter.module.scss';
import { useQuery, useMutation } from '@apollo/react-hooks';

const Filters = [
  {
    label: 'All',
    value: Filter.ALL,
  },
  {
    label: 'Completed',
    value: Filter.COMPLETED,
  },
  {
    label: 'Uncompleted',
    value: Filter.UNCOMPLETED,
  },
];

export const GET_VISIBILITY_FILTER = gql`
  query GetVisibilityFilter {
    visibilityFilter @client
  }
`;

export const SET_VISIBILITY_FILTER = gql`
  mutation SetVisibilityFilter($visibilityFilter: Filter) {
    setVisibilityFilter(visibilityFilter: $visibilityFilter) @client
  }
`;

export const VisibilityFilterView = () => {
  const { data } = useQuery<VisibilityFilter>(GET_VISIBILITY_FILTER);
  const [setVisibilityFilter] = useMutation(SET_VISIBILITY_FILTER);

  return (
    <div className={classes.visibilityFilter}>
      {Filters.map(({ label, value }) => (
        <CustomInput
          key={value}
          id={value}
          type='radio'
          className='mr-4'
          checked={data?.visibilityFilter === value}
          onChange={() => {
            setVisibilityFilter({ variables: { visibilityFilter: value } });
          }}>
          {label}
        </CustomInput>
      ))}
    </div>
  );
};
