import React from "react";
import { CustomInput } from "reactstrap";
import { Filter, VisibilityFilter } from "ui/modules/todos/types";

import classes from "./visibility-filter.module.scss";

const Filters = [
  {
    label: "All",
    value: Filter.ALL,
  },
  {
    label: "Active",
    value: Filter.ACTIVE,
  },
  {
    label: "Completed",
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
}) => {
  return (
    <div className={classes.visibilityFilter}>
      {Filters.map(({ label, value }) => (
        <CustomInput
          key={value}
          id={value}
          type="radio"
          className="mr-4"
          checked={filter?.visibilityFilter === value}
          onChange={() => {
            setVisibilityFilter({ variables: { visibilityFilter: value } });
          }}
        >
          {label}
        </CustomInput>
      ))}
    </div>
  );
};
