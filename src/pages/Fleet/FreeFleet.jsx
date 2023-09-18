/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import { useMemo, useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import {
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Box,
  Collapse,
  Button,
  Typography,
  IconButton,
  Divider,
  Chip,
  Tooltip,
} from "@mui/material";
import Table from "Components/versions/Table";

import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  removeInvalidValues,
  renderPlaqueObjectToString,
  renderTimeCalender,
} from "Utility/utils";
import { Helmet } from "react-helmet-async";

import { useForm } from "react-hook-form";
import { useFleet } from "hook/useFleet";

import VehicleDetailModal from "Components/modals/VehicleDetailModal";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { ChooseVType } from "Components/choosers/vehicle/types/ChooseVType";
import { useRef } from "react";
import { toast } from "react-toastify";
import ShowDriverFleet from "Components/modals/ShowDriverFleet";
import { ChooseShippingCompany } from "Components/choosers/ChooseShippingCompany";
import { SvgSPrite } from "Components/SvgSPrite";

const HeadCells = [
  {
    id: "",
    label: "",
  },
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "code",
    label: "کد",
  },
  {
    id: "driver",
    label: "راننده",
  },
  {
    id: "plaque",
    label: "پلاک خودرو",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "inquiry",
    label: "استعلام",
  },
];

export default function FreeFleetList() {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [vehicle, setVehicle] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const {
    data: fleet,
    isLoading,
    isFetching,
    isError,
  } = useFleet({
    active: true,
    free: true,
    timeline: true,
    ...searchParamsFilter,
  });

  if (isError) {
    return <div className="">isError</div>;
  }

  const handleShowVehicleModal = (vehicle) => {
    setShowVehicleModal(true);
    setVehicle(vehicle);
  };

  return (
    <>
      <Helmet title="پنل دراپ - ناوگان آزاد  " />

      <SearchBoxFreeFleet />

      {isLoading || isFetching ? (
        <LoadingSpinner />
      ) : (
        <Table
          {...fleet}
          headCells={HeadCells}
          filters={searchParamsFilter}
          setFilters={setSearchParamsFilter}
        >
          <TableBody>
            {fleet.items?.data.map((row, i) => {
              return (
                <FleetRow
                  key={row.id}
                  row={row}
                  handleShowVehicleModal={handleShowVehicleModal}
                />
              );
            })}
          </TableBody>
        </Table>
      )}

      <VehicleDetailModal
        show={showVehicleModal}
        onClose={() => setShowVehicleModal((prev) => !prev)}
        data={vehicle}
      />
    </>
  );
}

const SearchBoxFreeFleet = () => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [openCollapse, setOpenCollapse] = useState(false);

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: searchParamsFilter,
  });

  const zoneInput = [
    {
      type: "zone",
      name: "zones",
      control: control,
      rules: {
        required: "zones را وارد کنید",
      },
      gridProps: { md: 12 },
      height: "400px",
    },
  ];

  const Inputs = [
    {
      type: "date",
      name: "start_date",
      label: "تاریخ شروع ",
      control: control,
    },
    {
      type: "date",
      name: "end_date",
      label: "تاریخ پایان ",
      control: control,
    },
    {
      type: "custom",
      customView: (
        <ChooseShippingCompany control={control} name={"shipping_company"} />
      ),
      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: (
        <ChooseVType
          control={control}
          name={"vType"}
          label="نوع بارگیر"
          needMoreInfo={true}
        />
      ),
      gridProps: { md: 4 },
    },
  ];
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setSearchParamsFilter(
      removeInvalidValues({
        ...searchParamsFilter,
        end_date: data?.end_date?.end_date,
        start_date: data?.start_date?.start_date,
        source_zone_id: data?.zones?.source_zones,
        destination_zone_id: data?.zones?.destination_zones,
        container_type_id: data?.vType?.id,
        shipping_company_id: data?.shipping_company?.id,
      })
    );
  };

  return (
    <CollapseForm onToggle={setOpenCollapse} open={openCollapse}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 2 }} />
            <Divider sx={{ mt: 2 }} />
            <FormInputs inputs={zoneInput} gridProps={{ md: 12 }} />
            <Stack direction="row" spacing={2} justifyContent={"end"} mt={2}>
              <Button variant="contained" type="submit">
                اعمال فیلتر
              </Button>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </CollapseForm>
  );
};

const FleetRow = ({ row, handleShowVehicleModal }) => {
  const [openFleet, setOpenFleet] = useState(false);
  const [showModalDrivers, setShowModalDrivers] = useState(false);
  const arrayDriverFleet = useRef([]);

  const calender = useMemo(() => {
    return Object.entries(row.timeline).map((item) => {
      const [day, requests] = item;

      return renderTimeCalender(day, requests);
    });
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} key={row.id}>
        <TableCell align="center">
          <Tooltip title="مشاهده تقویم کاری ناوگان" placement="top" arrow>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpenFleet((prev) => !prev)}
            >
              {openFleet ? (
                <SvgSPrite icon="chevron-up" size="small" />
              ) : (
                <SvgSPrite icon="chevron-down" size="small" />
              )}
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell
          align="center"
          scope="row"
          onClick={() => setOpenFleet((prev) => !prev)}
        >
          {enToFaNumber(row.id)}
        </TableCell>
        <TableCell
          align="center"
          scope="row"
          onClick={() => setOpenFleet((prev) => !prev)}
        >
          {enToFaNumber(row.code)}
        </TableCell>
        <TableCell
          align="center"
          scope="row"
          onClick={() => {
            if (row.drivers?.length > 0) {
              arrayDriverFleet.current = row.drivers;
              setShowModalDrivers(!showModalDrivers);
            } else {
              toast.error("راننده ای برای این ناوگان وجود ندارد");
            }
          }}
          sx={{ cursor: "pointer" }}
        >
          {row?.drivers?.length > 0
            ? row?.drivers[0]?.first_name + " " + row?.drivers[0]?.last_name
            : "راننده نامشخص"}
        </TableCell>
        <TableCell align="center" scope="row">
          <Typography
            variant="clickable"
            onClick={() => handleShowVehicleModal(row.vehicle)}
          >
            {renderPlaqueObjectToString(row.vehicle?.plaque)}
          </Typography>
        </TableCell>
        <TableCell align="center" scope="row">
          <Chip
            label={row.status === 1 ? "فعال" : "غیرفعال"}
            color={row.status === 1 ? "success" : "error"}
          />
        </TableCell>
        <TableCell align="center" scope="row">
          <Chip
            label={
              row.vehicle.inquiry === 1
                ? "معتبر"
                : row.vehicle.inquiry === 0
                ? "نامعتبر"
                : "نامشخص"
            }
            color={
              row.vehicle.inquiry === 1
                ? "success"
                : row.vehicle.inquiry === 0
                ? "error"
                : "secondary"
            }
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openFleet} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography my={2} gutterBottom>
                تقویم ناوگان (ماه)
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                {calender}
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <ShowDriverFleet
        show={showModalDrivers}
        data={arrayDriverFleet.current}
        onClose={() => setShowModalDrivers((prev) => !prev)}
      />
    </>
  );
};
