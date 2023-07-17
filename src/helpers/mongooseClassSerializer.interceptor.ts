import {
    ClassSerializerInterceptor,
    PlainLiteralObject,
    Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';
import { PaginationResult } from "./types";

export function MongooseClassSerializerInterceptor(
    classToIntercept: Type,
): typeof ClassSerializerInterceptor {
    return class Interceptor extends ClassSerializerInterceptor {
        private changePlainObjectToClass(document: PlainLiteralObject) {
            if (!(document instanceof Document)) {
                return document;
            }

            return plainToClass(classToIntercept, document.toJSON());
        }

        private prepareResponse(
            response: PlainLiteralObject | PlainLiteralObject[] | PaginationResult<PlainLiteralObject>,
        ) {
            // @ts-ignore
            if (response && response.results && Array.isArray(response.results)) {
                return {
                    ...response,
                    // @ts-ignore
                    results: response.results.map(this.changePlainObjectToClass)
                }
            }
            if (Array.isArray(response)) {
                return response.map(this.changePlainObjectToClass);
            }

            return this.changePlainObjectToClass(response);
        }

        serialize(
            response: PlainLiteralObject | PlainLiteralObject[],
            options: ClassTransformOptions,
        ) {
            return super.serialize(this.prepareResponse(response), options);
        }
    };
}