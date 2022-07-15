import React from "react";
import styled from "styled-components";
import { Box } from "@mui/system";
import { Button, Grid, Typography } from "@mui/material";
import colors from "../../config/colors";

const sortByValue = ([_a, a], [_b, b]) => b - a;
const containsProperties = ["tags", "state"];
const SidebarContainer = styled(Grid)`
    /* max-height: 80vh;
    overflow-y:auto;
    margin-top:1em;
    padding-right:1em;
    
    ::-webkit-scrollbar {
            width: .5rem;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: #eee;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: url("${process.env.PUBLIC_URL}/icons/grip.png"), #ccc;
            background-position: center center;
            background-repeat: no-repeat, no-repeat;
            background-size: 50%, 100%;
            transition: 125ms all;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: url("${process.env.PUBLIC_URL}/icons/grip.png"), #aaa;
            background-position: center center;
            background-repeat: no-repeat, no-repeat;
            background-size: 50%, 100%;
        } */
`;

const FilterSection = ({ title, counts, handleFilter, filters }) => {
  return (
    <Box sx={{ pb: 4 }}>
      <Typography sx={{ textTransform: "capitalize" }} variant="h6">
        {title}
      </Typography>
      <hr />
      {Object.entries(counts)
        .sort(sortByValue)
        .map(([value, count], i) => (
          <FilterRow
            key={i}
            property={title}
            count={count}
            value={value}
            handleFilter={handleFilter}
            filters={filters}
          />
        ))}
    </Box>
  );
};

const FilterRow = ({ property, value, count, handleFilter, filters }) => {
  const isFiltered = !!filters.find(
    (f) => f.property === property && f.value === value
  );

  return (
    <Button
      onClick={() => handleFilter({ property, value })}
      sx={
        isFiltered
          ? {
              color: "black",
              px: 0.5,
              py: 0.25,
              my: 0.25,
              textTransform: "none",
              width: "100%",
              justifyContent: "space-between",
              background: colors.skyblue,
            }
          : {
              color: "black",
              px: 0.5,
              py: 0.25,
              my: 0.25,
              textTransform: "none",
              width: "100%",
              justifyContent: "space-between",
            }
      }
    >
      <Box>
        {value}
        {isFiltered && (
          <span style={{ marginLeft: ".5rem", fontWeight: "bold" }}>
            &times;
          </span>
        )}
      </Box>
      <Box>{count}</Box>
    </Button>
  );
};

export const ArchiveSidebar = ({ counts, filters, setFilters }) => {
  const handleFilter = ({ property, value }) => {
    setFilters((filters) => {
      const prevIndex = filters.findIndex(
        (f) => f.property === property && f.value === value
      );
      if (prevIndex !== -1) {
        return filters.slice(0, prevIndex).concat(filters.slice(prevIndex + 1));
      } else {
        return [
          ...filters,
          {
            property,
            value,
            operation: containsProperties.includes(property)
              ? "contains"
              : "match",
          },
        ];
      }
    });
  };
  return (
    <SidebarContainer item xs={12} md={3}>
      {Object.entries(counts).map(([title, values], i) => (
        <FilterSection
          key={i}
          filters={filters}
          title={title}
          counts={values}
          handleFilter={handleFilter}
        />
      ))}
    </SidebarContainer>
  );
};
