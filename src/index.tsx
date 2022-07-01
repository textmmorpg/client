import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
  <GoogleOAuthProvider clientId="797291709791-3u14qu9midq1pp234q5f3roo9h322bqe">
    <Main />
  </GoogleOAuthProvider>,
document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
