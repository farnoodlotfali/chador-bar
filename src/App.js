import { redirect, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { lazy, Suspense } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { Box } from "@mui/material";

function lazyLoadRoutes(componentName, src = "pages") {
  const LazyElement = lazy(() => import(`${src}/${componentName}`));

  // Wrapping around the suspense component is mandatory
  return (
    <Suspense
      fallback={
        <Box bgcolor="background.default" height={"100vh"}>
          <LoadingSpinner />
        </Box>
      }
    >
      <LazyElement />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    element: lazyLoadRoutes(
      "PanelLayout",
      `layouts/versions/${process.env.REACT_APP_VERSION_CODE}`
    ),
    path: "/",
    children: [
      {
        index: true,
        loader: () => {
          if (!Cookies.get("token")) {
            return redirect("/login");
          }
          return redirect("/desktop");
        },
      },
      {
        path: "desktop",
        element: lazyLoadRoutes("Desktop"),
      },
      {
        path: "test",
        element: lazyLoadRoutes("Test"),
      },
      {
        path: "contract",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("Contract"),
          },
          {
            path: "new",
            element: lazyLoadRoutes("Contract/NewContract"),
          },
          {
            path: ":id",
            element: lazyLoadRoutes("Contract/Contract"),
          },
        ],
      },
      {
        path: "project",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("Project"),
          },
          {
            path: "new",
            element: lazyLoadRoutes("Project/NewProject"),
          },
          {
            path: "shipping-plan-new",
            element: lazyLoadRoutes("ShippingPlanning/NewShippingPlanning"),
          },
          {
            path: ":id",
            element: lazyLoadRoutes("Project/SingleProject"),
          },
        ],
      },
      {
        path: "person",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("SenderReceiver"),
          },
          {
            path: "new",
            element: lazyLoadRoutes("SenderReceiver/NewPerson"),
          },
        ],
      },
      {
        path: "request",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("Request"),
          },
          {
            path: "new",
            element: lazyLoadRoutes("Request/NewRequest"),
          },
          {
            path: "/request/salon",
            element: lazyLoadRoutes("Request/Salon"),
          },
          {
            path: ":id",
            element: lazyLoadRoutes("Request/Request"),
          },
          {
            path: "fleet-allocation",
            element: lazyLoadRoutes("Request/FleetAllocation"),
          },
          {
            path: "new-tune",
            element: lazyLoadRoutes("Request/NewTune"),
          },
          {
            path: "tune",
            children: [
              {
                index: true,
                element: lazyLoadRoutes("Request/TuneList"),
              },
              {
                path: ":id",
                element: lazyLoadRoutes("Request/SingleTune"),
              },
            ],
          },
        ],
      },
      {
        path: "shippingCompany",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("ShippingCompany"),
          },
          {
            path: ":id",
            element: lazyLoadRoutes("Request"),
          },
        ],
      },
      {
        path: "fleet",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("Fleet"),
          },
          {
            path: "free",
            element: lazyLoadRoutes("Fleet/FreeFleet"),
          },
          {
            path: "new",
            element: lazyLoadRoutes("Fleet/NewFleet"),
          },

          {
            path: "group",
            element: lazyLoadRoutes("Fleet/Group"),
          },
          {
            path: ":id",
            element: lazyLoadRoutes("Fleet/SingleFleet"),
          },
        ],
      },
      {
        path: "customer",

        children: [
          {
            index: true,
            element: lazyLoadRoutes("Customer"),
          },
          {
            path: ":id",
            element: lazyLoadRoutes("Customer/Customer"),
          },
          {
            path: "new",
            element: lazyLoadRoutes("Customer/NewCustomer"),
          },
        ],
      },
      {
        path: "driver",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("Driver"),
          },
          {
            path: ":id",
            element: lazyLoadRoutes("Driver/Driver"),
          },
          {
            path: "new",
            element: lazyLoadRoutes("Driver/NewDriver"),
          },
        ],
      },
      {
        path: "vehicle",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("Vehicle"),
          },
          {
            path: "category",
            element: lazyLoadRoutes("Vehicle/VehicleCategory"),
          },
          {
            path: "type",
            element: lazyLoadRoutes("Vehicle/VehicleType"),
          },
          {
            path: "brand",
            element: lazyLoadRoutes("Vehicle/VehicleBrand"),
          },
          {
            path: "model",
            element: lazyLoadRoutes("Vehicle/VehicleModel"),
          },
          {
            path: "schematic",
            element: lazyLoadRoutes("Vehicle/Schematic"),
          },
          {
            path: "photo",
            element: lazyLoadRoutes("Vehicle/VehiclePhotos"),
          },
          {
            path: "refueling",
            element: lazyLoadRoutes("Vehicle/Refueling"),
          },
          {
            path: ":id",
            element: lazyLoadRoutes("Vehicle/SingleVehicle"),
          },
        ],
      },
      {
        path: "user",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("User"),
          },
        ],
      },
      {
        path: "superApp",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("SuperApp"),
          },
        ],
      },
      {
        path: "role",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("Role"),
          },
        ],
      },
      {
        path: "event",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("Event"),
          },
        ],
      },
      {
        path: "waybill",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("Waybill"),
          },
          {
            path: "newWaybill",
            element: lazyLoadRoutes("Waybill/NewWaybill"),
          },
          {
            path: "draft",
            element: lazyLoadRoutes("Waybill/Draft"),
          },
          {
            path: "newDraft",
            element: lazyLoadRoutes("Waybill/NewDraft"),
          },
          {
            path: ":id",
            element: lazyLoadRoutes("Waybill/Waybill"),
          },
        ],
      },
      {
        path: "survey",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("Survey"),
          },
        ],
      },
      {
        path: "beneficiary",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("Beneficiary"),
          },
        ],
      },
      {
        path: "product",
        children: [
          {
            index: true,
            element: lazyLoadRoutes("products"),
          },
          {
            path: "unit",
            element: lazyLoadRoutes("products/Units"),
          },
          {
            path: "group",
            element: lazyLoadRoutes("products/Groups"),
          },
        ],
      },
      {
        path: "profile",
        element: lazyLoadRoutes("Profile/Profile"),
      },
      {
        path: "/server-error",
        element: lazyLoadRoutes("Error/ServerError"),
      },
      {
        path: "/not-found",
        element: lazyLoadRoutes("Error/NotFound"),
      },

      {
        path: "*",
        element: lazyLoadRoutes("Error/NotFound"),
      },
    ],
  },

  {
    element: lazyLoadRoutes("BlankLayout", "layouts"),
    path: "/",
    children: [
      {
        path: "login",
        element: lazyLoadRoutes("Login"),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
