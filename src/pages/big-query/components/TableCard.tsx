import React, { useState } from "react";
import {
  Checkbox,
  Card,
  Typography,
  IconButton,
  CardHeader,
  Grid,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { useAuth0 } from "@auth0/auth0-react";

import { getTablesSchemas } from "../../../services/big-query-service";
import TableInfo from "./TableInfo";
import Spinner from "../../../components/Spinner";

type TableCardProps = {
  config: { id: number };
  dataset: { id: string };
  tableId: string;
  onCheckboxChange: (tableId: string, isChecked: boolean) => void;
  isPrimary: boolean;
  onPrimaryChange: (newPrimaryTable: string | null) => void;
};

const TableCard: React.FC<TableCardProps> = ({
  config,
  dataset,
  tableId,
  onCheckboxChange,
  isPrimary,
  onPrimaryChange,
}) => {
  const [checked, setChecked] = useState(false);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    onCheckboxChange(tableId, event.target.checked);
  };

  const handleInfoClick = async () => {
    setIsLoading(true);
    try {
      const accessToken = await getAccessTokenSilently();
      const tableInfo = await getTablesSchemas(
        accessToken,
        config.id,
        dataset.id,
        [tableId]
      );
      setTableInfo(tableInfo[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTableInfo(null);
  };

  const handleStarClick = () => {
    if (isPrimary) {
      onPrimaryChange(null);
    } else {
      onPrimaryChange(tableId);
    }
  };

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <Checkbox checked={checked} onChange={handleCheckboxChange} />
      </Grid>
      <Grid item>
        <Card sx={{ width: 325 }}>
          <CardHeader
            action={
              <>
                <IconButton aria-label="star" onClick={handleStarClick}>
                  {isPrimary ? <StarIcon color="error" /> : <StarBorderIcon />}
                </IconButton>
                <IconButton aria-label="info" onClick={handleInfoClick}>
                  {isLoading ? <Spinner /> : <InfoIcon />}
                </IconButton>
              </>
            }
            title={
              <Typography sx={{ fontSize: "16px" }}>
                {tableId.split(".")[1]}
              </Typography>
            }
          />
          {tableInfo && (
            <TableInfo
              open={Boolean(tableInfo)}
              onClose={handleClose}
              tableData={tableInfo}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default TableCard;
