import { redirect } from "react-router";
import Cookies from "js-cookie";
import { lazy, Suspense } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { Box } from "@mui/material";

import NotFound from "pages/Error/NotFound";
import { deepCopy } from "Utility/utils";

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

export const BlankLayoutPaths = {
  element: lazyLoadRoutes("BlankLayout", "layouts"),
  path: "/",
  children: [
    {
      path: "login",
      element: lazyLoadRoutes("Login"),
    },
  ],
};
export const BlankLayoutWithAuthPaths = {
  element: lazyLoadRoutes("BlankLayoutWithAuth", "layouts"),
  path: "/",
  children: [
    {
      path: "monitoring",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Monitoring"),
          name: "monitoring.index",
        },
      ],
    },
  ],
};

export const PanelLayoutRoutes = {
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
      name: "",
    },
    {
      path: "desktop",
      element: lazyLoadRoutes("Desktop"),
      name: "desktop",
    },
    {
      path: "test",
      element: lazyLoadRoutes("Test"),
      name: "test",
    },
    {
      path: "contract",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Contract", "pages"),
          name: "contract.index",
        },
        {
          path: "new",
          element: lazyLoadRoutes("Contract/NewContract"),
          name: "contract.store",
        },
        {
          path: "storage",
          element: lazyLoadRoutes("Contract/Storage/"),
          name: "contract.storage",
        },
        {
          path: ":id",
          element: lazyLoadRoutes("Contract/Contract"),
          name: "contract.show",
        },
        {
          path: "report",
          element: lazyLoadRoutes("Contract/Report"),
          name: "contract.report",
        },
        {
          path: "report/:id",
          element: lazyLoadRoutes("Contract/Report"),
          name: "contract.report",
        },
      ],
    },
    {
      path: "project",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Project"),
          name: "project.index",
        },
        {
          path: "new",
          element: lazyLoadRoutes("Project/NewProject"),
          name: "project.store",
        },
        {
          path: "shipping-plan-new",
          element: lazyLoadRoutes("ShippingPlanning/NewShippingPlanning"),
          name: "request.store",
        },

        {
          path: ":id",
          element: lazyLoadRoutes("Project/SingleProject"),
          name: "project.show",
        },
        {
          path: "report/:id",
          element: lazyLoadRoutes("Project/Report"),
          name: "",
        },
        {
          path: "report",
          element: lazyLoadRoutes("Project/Report"),
          name: "",
        },
      ],
    },
    {
      path: "person",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("SenderReceiver"),
          name: "person.index",
        },
        {
          path: "new",
          element: lazyLoadRoutes("SenderReceiver/NewPerson"),
          name: "person.store",
        },
      ],
    },
    {
      path: "request",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Request"),
          name: "request.index",
        },
        {
          path: "new",
          element: lazyLoadRoutes("Request/NewRequest"),
          name: "request.store",
        },
        {
          path: "/request/salon",
          element: lazyLoadRoutes("Request/Salon"),
          name: "salon.index",
        },
        {
          path: ":id",
          element: lazyLoadRoutes("Request/Request"),
          name: "request.show",
        },
        {
          path: "fleet-allocation",
          element: lazyLoadRoutes("Request/FleetAllocation"),
          name: "fleet.allocation",
        },
        {
          path: "new-tune",
          element: lazyLoadRoutes("Request/NewTune"),
          name: "project-plan.store",
        },
        {
          path: "requests-by-products",
          element: lazyLoadRoutes("Request/RequestsByProducts"),
          name: "",
        },
        {
          path: "requests-by-provinces",
          element: lazyLoadRoutes("Request/RequestsByProvinces"),
          name: "",
        },
        {
          path: "requests-by-cities",
          element: lazyLoadRoutes("Request/RequestsByCities"),
          name: "",
        },

        {
          path: "report",
          element: lazyLoadRoutes("Request/Report"),
          name: "",
        },
        {
          path: "tune",
          children: [
            {
              index: true,
              element: lazyLoadRoutes("Request/TuneList"),
              name: "project-plan.index",
            },
            {
              path: ":id",
              element: lazyLoadRoutes("Request/SingleTune"),
              name: "project-plan.show",
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
          name: "shipping-company.index",
        },
        {
          path: ":id",
          element: lazyLoadRoutes("Request"),
          name: "shipping-company.show",
        },
        {
          path: "report",
          element: lazyLoadRoutes("ShippingCompany/Report"),
          name: "",
        },
      ],
    },
    {
      path: "LegalAndCompany",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("LegalAndCompany"),
          name: "company.index",
        },
        {
          path: ":id",
          element: lazyLoadRoutes("Request"),
          name: "company.show",
        },
      ],
    },
    {
      path: "prices",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Pricing"),
          name: "price",
        },
      ],
    },
    {
      path: "settings",
      element: lazyLoadRoutes("Settings"),
      name: "setting.index",
    },
    {
      path: "fleet",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Fleet"),
          name: "fleet.index",
        },
        {
          path: "free",
          element: lazyLoadRoutes("Fleet/FreeFleet"),
          name: "fleet.index",
        },
        {
          path: "new",
          element: lazyLoadRoutes("Fleet/NewFleet"),
          name: "fleet.store",
        },
        {
          path: "group",
          element: lazyLoadRoutes("Fleet/Group"),
          name: "fleet-group.index",
        },
        {
          path: "report",
          element: lazyLoadRoutes("Fleet/Report"),
          name: "",
        },
        {
          path: ":id",
          element: lazyLoadRoutes("Fleet/SingleFleet"),
          name: "fleet.show",
        },
      ],
    },
    {
      path: "owner",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Owner"),
          name: "owner.index",
        },
        {
          path: ":id",
          element: lazyLoadRoutes("Owner/Owner"),
          name: "owner.show",
        },
        {
          path: "new",
          element: lazyLoadRoutes("Owner/NewOwner"),
          name: "owner.store",
        },
        {
          path: "report",
          element: lazyLoadRoutes("Owner/Report"),
          name: "",
        },
      ],
    },
    {
      path: "driver",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Driver"),
          name: "driver.index",
        },
        {
          path: ":id",
          element: lazyLoadRoutes("Driver/Driver"),
          name: "driver.show",
        },
        {
          path: "new",
          element: lazyLoadRoutes("Driver/NewDriver"),
          name: "driver.store",
        },
        {
          path: "report",
          element: lazyLoadRoutes("Driver/Report"),
          name: "",
        },
      ],
    },
    {
      path: "messages",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Message"),
          name: "message.index",
        },
        {
          path: "alerts",
          element: lazyLoadRoutes("Message/Alerts"),
          name: "alert.index",
        },
        {
          path: "my",
          element: lazyLoadRoutes("Message/MyMessages"),
          name: "my-messages.index",
        },
        {
          path: "send",
          element: lazyLoadRoutes("Message/SendMessage"),
          name: "messages.store",
        },
        {
          path: "sendManual",
          element: lazyLoadRoutes("Message/ManualMessage"),
          name: "messages.store",
        },
        {
          path: "templates",
          element: lazyLoadRoutes("Message/MessageTemplates"),
          name: "message-template.index",
        },
      ],
    },

    {
      path: "vehicle",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Vehicle"),
          name: "vehicle.index",
        },
        {
          path: "category",
          element: lazyLoadRoutes("Vehicle/VehicleCategory"),
          name: "vehicle-category.index",
        },
        {
          path: "type",
          element: lazyLoadRoutes("Vehicle/VehicleType"),
          name: "vehicle-type.index",
        },
        {
          path: "brand",
          element: lazyLoadRoutes("Vehicle/VehicleBrand"),
          name: "vehicle-brand.index",
        },
        {
          path: "model",
          element: lazyLoadRoutes("Vehicle/VehicleModel"),
          name: "vehicle-model.index",
        },
        {
          path: "schematic",
          element: lazyLoadRoutes("Vehicle/Schematic"),
          name: "schematic.index",
        },
        {
          path: "photo",
          element: lazyLoadRoutes("Vehicle/VehiclePhotos"),
          name: "vehicle-photo.index",
        },
        {
          path: "refueling",
          element: lazyLoadRoutes("Vehicle/Refueling"),
          name: "refueling.index",
        },
      ],
    },
    {
      path: "user",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("User"),
          name: "user.index",
        },
      ],
    },
    {
      path: "super-app",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("SuperApp"),
          name: "group.index",
        },
        {
          path: ":id",
          element: lazyLoadRoutes("SuperApp/GroupSingle"),
          name: "group.show",
        },
        {
          path: "section",
          element: lazyLoadRoutes("SuperApp/Sections"),
          name: "section.index",
        },
        {
          path: "section/item",
          element: lazyLoadRoutes("SuperApp/ItemsList"),
          name: "item.index",
        },
      ],
    },
    {
      path: "role",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Role"),
          name: "role.index",
        },
      ],
    },
    {
      path: "event",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Event"),
          name: "event.index",
        },
      ],
    },
    {
      path: "waybill",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Waybill"),
          name: "waybill.index",
        },
        {
          path: "newWaybill",
          element: lazyLoadRoutes("Waybill/NewWaybill"),
          name: "waybill.store",
        },
        {
          path: "newGroupWaybill",
          element: lazyLoadRoutes("Waybill/NewGroupWaybill"),
          name: "waybill.store",
        },
        {
          path: "draft",
          element: lazyLoadRoutes("Waybill/Draft"),
          name: "draft.index",
        },
        {
          path: "newDraft",
          element: lazyLoadRoutes("Waybill/NewDraft"),
          name: "draft.store",
        },
        {
          path: ":id",
          element: lazyLoadRoutes("Waybill/Waybill"),
          name: "waybill.index",
        },
      ],
    },
    {
      path: "survey",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Survey"),
          name: "reason.index",
        },
      ],
    },
    {
      path: "beneficiary",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("Beneficiary"),
          name: "beneficiary.index",
        },
      ],
    },
    {
      path: "product",
      children: [
        {
          index: true,
          element: lazyLoadRoutes("products"),
          name: "product.index",
        },
        {
          path: "unit",
          element: lazyLoadRoutes("products/Units"),
          name: "product-unit.index",
        },
        {
          path: "group",
          element: lazyLoadRoutes("products/Groups"),
          name: "product-group.index",
        },
        {
          path: "packing",
          element: lazyLoadRoutes("products/Packing"),
          name: "product-packing.index",
        },
      ],
    },
    {
      path: "financial",
      children: [
        {
          path: "transaction",
          element: lazyLoadRoutes("Financial/TransactionList"),
          name: "transaction.index",
        },
        {
          path: "invoice",
          element: lazyLoadRoutes("Financial/InvoiceList"),
          name: "invoice.index",
        },
        {
          path: "account",
          element: lazyLoadRoutes("Financial/AccountList"),
          name: "account.index",
        },
      ],
    },
    {
      path: "salon",
      children: [
        {
          index: true,
          path: "report",
          element: lazyLoadRoutes("Salon/Report"),
          name: "salon.show",
        },
      ],
    },
    {
      path: "profile",
      element: lazyLoadRoutes("Profile/Profile"),
      name: "profile",
    },
    {
      path: "/server-error",
      element: lazyLoadRoutes("Error/ServerError"),
      name: "server-error",
    },
    {
      path: "/not-found",
      element: lazyLoadRoutes("Error/NotFound"),
      name: "not-found",
    },

    {
      path: "*",
      element: lazyLoadRoutes("Error/NotFound"),
      name: "*",
    },
  ],
};

export const renderPanelRoute = (routes, notPermissions) => {
  const newRoutes = deepCopy(routes);
  filterRoutes(newRoutes.children, notPermissions);
  return newRoutes;
};
const filterRoutes = (routes, notPermissions) => {
  routes.forEach((route) => {
    if (notPermissions.includes(route?.name)) {
      const index = routes.findIndex((r) => r?.name === route?.name);
      if (index > -1) {
        routes[index].element = <NotFound />;
      }
    }

    if (route.children) {
      filterRoutes(route.children, notPermissions);
    }
  });
};
