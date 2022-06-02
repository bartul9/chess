import { React } from "react";
import { inject, observer } from "mobx-react";
import { Chessboard } from "./components";

import "./App.css";

const App = inject("rootStore")(observer(({ rootStore }) => {

  return (
        <div className="App">
            <Chessboard rootStore={rootStore} />
        </div>
    );
}));

export default App;