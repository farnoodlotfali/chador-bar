import { Box, Tooltip } from "@mui/material";
import FormTypography from "Components/FormTypography";
import { SvgSPrite } from "Components/SvgSPrite";
import ZoneMap from "Components/ZoneMap";
import Modal from "Components/versions/Modal";
import { useState } from "react";
import { useController } from "react-hook-form";

export const ChooseZone = ({
  control,
  name,
  rules,
  sourceColor,
  destinationColor,
  level,
  height,
  bothColor,
  openByIcon,
}) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules: rules,
    defaultValue: {
      destination_zones: [],
      source_zones: [],
    },
  });
  const [showModal, setShowModal] = useState(false);

  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      {openByIcon ? (
        <Tooltip title="فیلتر زون" placement="top">
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1,
              bgcolor: !!field.value?.length
                ? "primary.main"
                : "background.paper",
              color: !!field.value?.length
                ? "primary.contrastText"
                : "text.primary",
              display: "flex",
              boxShadow: 1,
              cursor: "pointer",
              position: "relative",
              width: 44,
              height: 44,
            }}
            onClick={toggleShowModal}
          >
            <SvgSPrite color="inherit" icon="map-location-dot" size={20} />
            {!!field.value?.length && (
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  bgcolor: "red",
                  position: "absolute",
                  right: 10,
                  bottom: 10,
                }}
              />
            )}
          </Box>
        </Tooltip>
      ) : (
        // TODO: form input will here
        <></>
        // <FormControl variant="outlined" sx={{ width: "100%" }}>
        //   <InputLabel>زون</InputLabel>
        //   <OutlinedInput
        //     sx={{ width: "100%" }}
        //     label={"زون"}
        //     name={name}
        //     value={renderValue()}
        //     readOnly
        //     error={!!error}
        //     endAdornment={
        //       <InputAdornment position="end">
        //         <Button color="secondary" onClick={toggleShowModal}>
        //           انتخاب
        //         </Button>
        //       </InputAdornment>
        //     }
        //   />
        //   {!!error?.message && (
        //     <FormHelperText error variant="outlined">
        //       {error.message}
        //     </FormHelperText>
        //   )}
        // </FormControl>
      )}

      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب زون</FormTypography>

        <ZoneMap
          error={error}
          inputRef={field.ref}
          setData={field.onChange}
          data={field.value}
          bothIds={field.value?.destination_zones?.filter((value) =>
            field.value?.source_zones?.includes(value)
          )}
          sourceColor={sourceColor}
          destinationColor={destinationColor}
          bothColor={bothColor}
          level={level}
          height={height}
        />
      </Modal>
    </>
  );
};
