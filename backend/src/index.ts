import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import service from './service';

import config from './config.json';
import management from './routes/subscription';
import authorization from './routes/authorization';

const app = express();
const port = process.env.HTTP_PORT || 8080; // default port to listen

// set body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// set cookie parser
app.use(cookieParser());

// set cors
app.use(cors({ credentials: true, origin: config.ALLOW_ORIGIN }));

// set routes
app.use('/management', management);
app.use('/authorize', authorization);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  service.start().catch((err) => console.log(err));
});
