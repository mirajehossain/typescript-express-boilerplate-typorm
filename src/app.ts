import "reflect-metadata";
import express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import routesV1 from "./api/v1/index";
import cors from 'cors';
import morgan from 'morgan';
import {Logger, ILogger} from './utils/logger';
import config from "./config/config";
import {createConnection} from "typeorm";
import nodeErrorHandler from "./middlewares/nodeErrorHandler";
import utilsRouter from './utils/utilsRouter';

export class Application {
    app: express.Application;
    config = config;
    logger: ILogger;

    constructor() {
        this.logger = new Logger(__filename);
        this.app = express();
        this.app.locals.name = this.config.name;
        this.app.locals.version = this.config.version;

        const corsOptions = {
            origin: true,
            methods: "GET, PUT, DELETE, OPTIONS, PATCH",
            credentials: true,
            exposedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "x-api-key"],
        };


        this.app.use(cors(corsOptions));
        this.app.use(morgan('dev', {
            skip: (() => process.env.NODE_ENV === 'test')
        }));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        process.on("uncaughtException", (e) => {
            this.logger.error('uncaughtException', e);
        });



        this.app.get("/", (req: Request, res: Response) => {
            res.status(200).json({ message: config.messages.helloWorld });
        });
        this.app.use("/static", express.static("uploads"));

        this.app.use("/api/utils", utilsRouter);
        this.app.use("/api/v1", routesV1);

        // catch 404 and forward to error handler
        this.app.use((req, res) =>
            res.status(404).send({ success: false, message: "url not found" })
        );

        // Middleware Error Handler
        this.app.use((err: Error, req: Request, res: Response) => {
            if (process.env.NODE_ENV === "development") {
                this.logger.error(err.message, err);
                return res.status(500).send({ success: false, message: err.message });
            }
            return res
                .status(500)
                .send({ success: false, message: "something went wrong" });
        });
    }

    setupDbAndServer = async () => {
        const conn = await createConnection();
        this.logger.info(`Connected to database. Connection: ${conn.name} / ${conn.options.database}`);
        await this.startServer();
    }

    startServer(): Promise<boolean> {
        return new Promise((resolve) => {
            this.app.listen(+this.config.port, this.config.host, () => {
                this.logger.info(`Server started at http://${this.config.host}:${this.config.port}`);
                resolve(true);
            }).on('error', nodeErrorHandler);
        });
    }

}
