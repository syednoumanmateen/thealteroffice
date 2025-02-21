git clone <git repo>
cd ../client && npm i && npm run dev
cd ../server && npm i && npm run server //for production
cd ../server && npm i && npm run local //development

if want to login via google-oAuth /auth/login
if want to login manually /auth/login cick register
/auth/register register the page navigate to login page /auth/login login will navigate to task list page




VITE_GOOGLE_CLIENT_ID=//google clientId
VITE_APP_NAME=//application name
VITE_APP_BE_HOST=//backend server localhost

PORT=//server port
NODE_MODE=//server mode
MONGO_URI=//mongo db uri
JWT_SECRET=//jwt secret key