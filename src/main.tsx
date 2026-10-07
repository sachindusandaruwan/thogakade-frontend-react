import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

/*

main.tsx
   ↓
Provider
   ↓
Redux Store
   ↓
Entire React App

App එක ඇතුළේ තියෙන ඕනෑම component එකකට Redux state access කරන්න පුළුවන්

ex-:
App
 ├── CustomerPage    → Redux
 ├── ItemPage        → Redux
 └── OrderPage       → Redux

 */