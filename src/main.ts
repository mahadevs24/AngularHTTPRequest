import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent, } from './app/app.component';
import { HttpEventType, HttpHandler, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs';

function loggingInterCepter(request:HttpRequest<unknown>,next:HttpHandlerFn)
{   
    console.log(request)
    return next(request).pipe(
        tap({
            next:event=>{
                    if(event.type === HttpEventType.Response)    
                        {
                            console.log("[Response intereptor]")
                            console.log(event.status)
                            console.log(event.body)
                        }    
            }
        })
    )
}

bootstrapApplication(AppComponent, 
    { providers: [provideHttpClient(withInterceptors([loggingInterCepter]))] })
    .catch((err) => console.error(err))