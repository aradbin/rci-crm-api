import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          // If the response is an array, remove the fields from each item in the array
          return data.map((item) => this.removeFields(item));
        } else {
          // If the response is a single object, remove the fields from that object
          return this.removeFields(data);
        }
      }),
    );
  }

  private removeFields(data: any) {
    // Remove the `user` and `whatsapp_setting` fields from the object
    const { user, whatsapp_setting, ...dataWithoutFields } = data;
    return dataWithoutFields;
  }
}
