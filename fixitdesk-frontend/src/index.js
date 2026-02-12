
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // 👈 Add this

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <BrowserRouter> {/* 👈 Wrap App inside BrowserRouter */}
      <App />
    </BrowserRouter>
);

reportWebVitals();


//<React.StrictMode></React.StrictMode>