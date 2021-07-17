import express from 'express';
import service from './service';
import { unsubscribe } from './controllers/subscriptionController';

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get('/unsubscribe/:id', (req, res) => {
  res.send(`your account with address : ${req.params.id} was unsubscribed`);
  unsubscribe(req.params.id, []);
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  service.start().catch((err) => console.log(err));
});
