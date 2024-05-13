import "@progress/kendo-theme-bootstrap/dist/all.css";
import React from "react";

import { Provider } from "react-redux";
import store from "./store";

import RoutesComp from "./Routes/RoutesComp";

function App() {
  return (
    <React.Fragment>
      <Provider store={store}>
        <RoutesComp />
      </Provider>
    </React.Fragment>
  );
}

export default App;
