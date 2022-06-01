import { React } from "react";
import { inject, observer } from "mobx-react";
import { Chessboard } from "./components";

const App = inject("rootStore")(observer(({ rootStore }) => {

  return (
        <div className="app">
            <Chessboard rootStore={rootStore} />
        </div>
    );
}));

export default App;