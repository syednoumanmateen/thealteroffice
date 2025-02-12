import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import App from './App.tsx';
import './index.css';
import { store } from "./redux/store";

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </Provider>
  // </React.StrictMode>,
)
