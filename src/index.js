import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from "mobx-react";

import App from './App';
import Chess from './stores/Chess';

const chess = new Chess();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Provider><App rootStore={chess} /></Provider>);
