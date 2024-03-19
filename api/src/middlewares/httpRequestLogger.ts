import morgan, { StreamOptions } from "morgan";
import Logger from "../utils/Logger";

const stream : StreamOptions = {
    write: (message) => Logger.http(message),
};

const httpRequestLogger = morgan('combined', { stream });

export { httpRequestLogger };
