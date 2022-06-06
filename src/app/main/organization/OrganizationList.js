import FuseUtils from "@fuse/utils";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OrganizationListItem from "./OrganizationListItem";

import { selectOrganizations } from "./store/organizationsSlice";

function OrganizationList() {
  const organizations = useSelector(selectOrganizations);
  const searchText = useSelector(
    ({ organizationsApp }) => organizationsApp.organizations.searchText
  );

  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return organizations;
      }
      return FuseUtils.filterArrayByString(organizations, _searchText);
    }

    if (organizations) {
      setFilteredData(getFilteredArray(organizations, searchText));
    }
  }, [organizations, searchText]);

  return !filteredData || filteredData.length === 0 ? (
    <div className="flex items-center justify-center h-full">
      <Typography color="textSecondary" variant="h5">
        There are no organization setup!
      </Typography>
    </div>
  ) : (
    <div className="flex flex-wrap w-full space-x-24">
      {filteredData.map((org, index) => (
        <OrganizationListItem
          key={index}
          organization={org}
          className="w-full rounded-20 shadow mb-16"
        />
      ))}
    </div>
  );
}

export default OrganizationList;
