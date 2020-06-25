import React from 'react';
import { Button } from 'reactstrap';
import { Filter, VisibilityFilter } from 'ui/modules/todos/types';
import cn from 'classnames';

import classes from './visibility-filter.module.scss';

const Filters = [
  {
    label: 'All',
    value: Filter.ALL,
  },
  {
    label: 'Active',
    value: Filter.ACTIVE,
  },
  {
    label: 'Completed',
    value: Filter.COMPLETED,
  },
];

type Props = {
  filter?: VisibilityFilter;
  setVisibilityFilter: Function;
};

export const VisibilityFilterView: React.FC<Props> = ({
  filter,
  setVisibilityFilter,
}) => (
  <div className={classes.visibilityFilter}>
    {Filters.map(({ label, value }) => (
      <Button
        key={value}
        className={cn(
          classes.filterButton,
          filter?.visibilityFilter === value && classes.activeButton
        )}
        onClick={() => {
          setVisibilityFilter({ variables: { visibilityFilter: value } });
        }}>
        {label}
      </Button>
    ))}
  </div>
);
