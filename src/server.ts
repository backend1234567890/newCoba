import express, { json, Request, Response } from 'express';
import path from 'path'
import cors from 'cors';
import morgan from 'morgan';
import { echo } from './echo';
import { port, url } from './config.json';
import {adding, show} from './logic';


const PORT: number = parseInt(process.env.PORT || port);
const HOST: string = process.env.IP || '127.0.0.1';

const app = express();

// Use middleware that allows for access from other domains (needed for frontend to connect)
app.use(cors());
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware to log (print to terminal) incoming HTTP requests (OPTIONAL)
app.use(morgan('dev'));

// Root URL
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../index.html'))
});

/**
 * READ THIS ROUTE AS WELL AS
 * - echo.ts
 * - echo.test.ts
 * BEFORE STARTING!!!
 */
app.get('/echo/echo', (req: Request, res: Response) => {
  // For GET/DELETE requests, data are passed in a query string.
  // You will need to typecast for GET/DELETE requests.
  const message = req.query.message as string;

  // Logic of the echo function is abstracted away in a different
  // file called echo.ts.
  const response = echo(message);

  // If { error: 'some relevant error' } is returned, we parse the status to 400.
  // Later in the course we will explore throwing/raising exceptions which will simplify this process
  if ('error' in response) {
    // Note also that the 'return' statement is necessary here since res.json() alone does not terminate
    // this route, and we don't want to risk sending a response twice.
    return res.status(400).json(response);
  }
  res.json(echo(message));
});

// ========================================================================= //
// YOUR ROUTES SHOULD BE DEFINED BELOW THIS DIVIDER
// ========================================================================= //
app.post('/add', (req: Request, res: Response) => {
    const {a,b} = req.body;

    const response = adding(parseInt(a), parseInt(b));
    res.json(response);
});

app.get('/show', (req: Request, res: Response) => {
  const response = show();
  res.json(response);
});

// TODO: Remaining routes

// ....

// ========================================================================= //
// YOUR ROUTES SHOULD BE DEFINED ABOVE THIS DIVIDER
// ========================================================================= //

/*
 * 404 Not Found Middleware
 *
 * This should be put at the very end (after all your routes are defined),
 * although still above errorHandlers (if any) and app.listen().
 */
app.use((req: Request, res: Response) => {
  const error = `
    404 Not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

/**
 * Start server
 */
const server = app.listen(PORT, () => {
  console.log(`Express Server started and awaiting requests at the URL: ${PORT}'`);
});

/**
 * Handle Ctrl+C gracefully
 */
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});
