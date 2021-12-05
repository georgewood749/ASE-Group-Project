import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import createSagaMiddleware from "redux-saga";
import saga from "./saga";

const sagaMiddleware = createSagaMiddleware();

export default configureStore({
  reducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(saga);


