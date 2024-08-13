import { ParseInput, ParseReturnType, UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny, objectInputType, objectOutputType } from "zod";
import { NonUndefinedOptional } from "./index";
export declare class ZodObjectExactOption<T extends ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny, Output extends object = objectOutputType<T, Catchall, UnknownKeys>, Input extends object = objectInputType<T, Catchall, UnknownKeys>> extends ZodObject<T, UnknownKeys, Catchall, Output, Input> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    private __parseSync;
}
declare module "zod" {
    interface ZodObject<T extends ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny, Output extends object = objectOutputType<T, Catchall, UnknownKeys>, Input extends object = objectInputType<T, Catchall, UnknownKeys>> {
        exactOptions(): ZodObjectExactOption<T, UnknownKeys, Catchall, NonUndefinedOptional<Output>, NonUndefinedOptional<Input>>;
    }
}
