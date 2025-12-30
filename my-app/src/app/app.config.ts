import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient,withFetch, withInterceptors  } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './core/interceptors/auth.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
              provideHttpClient(  withFetch(),
                                  withInterceptors([authInterceptor]) // 👈 registrar interceptor
              ),
              provideRouter(routes), 
              provideClientHydration(withEventReplay())]
};

/*
PROVIDE HTTP CLIENT()
>> registrar el provider
>> nadie puede usar el HTTPCLIENT si no lo registramos. Si falta el provideHttpClient() → Angular no sabe cómo crearlo y explota en runtime con error de inyección:
 
>> registra el provider en el inyector global de Angular, o sea, le dice a Angular:
“si alguien pide un HttpClient (ya sea en un constructor o con inject()), vos sabés cómo fabricarlo y con qué dependencias configurarlo
>> registra a HttpClient con sus dependencias, nos referimos a que Angular no solo crea un objeto HttpClient “pelado”, sino que lo inicializa con todo lo que necesita para funcionar.*/