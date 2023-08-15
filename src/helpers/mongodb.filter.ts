import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { MongoError } from 'mongodb';
import { Response } from "express";

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 11000:
        // @ts-ignore
        const field = Object.keys(exception.keyValue);
        const error = `An entity with that ${field} already exists.`;
        response
          .status(409)
          .send({messages: error, fields: field})
        break;
      default:
        response
          .status(500)
          .send({messages: 'Unknown error'})
        break;
    }
  }
}