import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
// import { PORT } from './config';
import { PORT, corsOptions } from './configs/config';
import { UserRouter } from './routers/user.router';
// import { SampleRouter } from './routers/sample.router';
import reservationRouter from './routers/reservation.router';
import { PropertyRouter } from './routers/property.router';
import { RoomRouter } from './routers/room.router';
import { ReviewRouter } from './routers/review.router';
import { SalesRouter } from './routers/sales.router';
// import propertyRouter from './routers/property.router';
const ngrok = require('ngrok');
export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    // this.app.use(
    //   (err: Error, req: Request, res: Response, next: NextFunction) => {
    //     if (req.path.includes('/api/')) {
    //       console.error('Error : ', err.stack);
    //       res.status(500).send(err.message);
    //     } else {
    //       next();
    //     }
    //   },
    // );

    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          const statusCode = (err as any).statusCode || 500;
          res.status(statusCode).send({
            message: err.message,
          });
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const userRouter = new UserRouter();
    const propertyRouter = new PropertyRouter();
    const roomRouter = new RoomRouter();
    const reviewRouter = new ReviewRouter();
    const salesRouter = new SalesRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/users', userRouter.getRouter());
    this.app.use('/api/properties', propertyRouter.getRouter());
    this.app.use('/api/rooms', roomRouter.getRouter());
    this.app.use('/api/reviews', reviewRouter.getRouter());
    this.app.use('/api/reservations', reservationRouter.getRouter());
    this.app.use('/api/sales', salesRouter.getRouter());
  }

  private configure(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded());
    this.app.use(cors(corsOptions));
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
