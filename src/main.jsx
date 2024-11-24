import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";
import Providers from "../redux/Providers.jsx";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store.js';

createRoot(document.getElementById("root")).render(
  <Providers store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Providers>
);
