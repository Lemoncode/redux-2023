import "./App.css";
import { createStore, compose } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./reducers";
import { UserProfileContainer } from "./user-profile";

// TypeScript: https://www.mydatahack.com/getting-redux-devtools-to-work-with-typescript/
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers());

function App() {
  return (
    <>
      <Provider store={store}>
        <header>Redux 2023 - Boilerplate</header>
        <UserProfileContainer />
      </Provider>
    </>
  );
}

export default App;
