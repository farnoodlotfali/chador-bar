import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Theme from "./MUI/Theme";
import Toast from "./Toast";
import AppState from "./context/AppState";
import { HelmetProvider } from "react-helmet-async";

// import css;
(function () {
  const version = process.env.REACT_APP_VERSION_CODE;
  import(`./globalcss-versions/${version}/index.css`)
    .then(() => {
      console.log("CSS file loaded successfully");
    })
    .catch((error) => {
      console.error("Error loading CSS file:", error);
    });
})();

const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 10 seconds
      staleTime: 10 * 1000,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      retry: 1,
      retryDelay: 1.5 * 1000,
    },
  },
});
root.render(
  // <React.StrictMode>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AppState>
        <Theme>
          <App />
          <Toast />
        </Theme>
      </AppState>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </HelmetProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
