import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SchedulerService {
  public emitEventUpdate: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient) {}

  /**
   * Create event function
   *
   * @param event SchedulerEvent
   */
  /* public createEvent(event: SchedulerEvent) {
    return this.http.post(app_endpoint + 'app/scheduler/create', event);
  } */

  /**
   * Update event function
   *
   * @param event SchedulerEvent
   * @param id Number
   */
  /* public updateEvent(event: SchedulerEvent, id: number) {
    return this.http.put(app_endpoint + 'app/scheduler/update/' + id, event);
  } */

  /**
   * Delete event function
   *
   * @param id Number
   */
  /* public deleteEvent(id: number) {
    return this.http.delete<SchedulerEvent>(app_endpoint + 'app/scheduler/delete/' + id);
  } */

  /**
   * Get events function
   */
  /* public getEvents(): Observable<SchedulerEvent[]> {
    return this.http.get<SchedulerEvent>(app_endpoint + 'app/scheduler/list').pipe(
      map((response: any) => {
        return response.data;
      })
    );
  } */

  /**
   * Create event function API v2
   *
   * @param event SchedulerEvent
   */
  public createEvent(event: any) {
    return this.http.post(environment.API_ENDPOINT + 'scheduler', event);
  }

  /**
   * Delete Event By Id API v2
   *
   * @param Id Number
   */
  public deleteEvent(id: number) {
    return this.http.delete<SchedulerEvent>(environment.API_ENDPOINT + 'scheduler/' + id);
  }
  /**
   * Update Event By Id API v2
   *
   * @param Id Number
   * @param event SchedulerEvent
   */
  public updateEvent(id: number, event: any) {
    return this.http.put(environment.API_ENDPOINT + 'scheduler/' + id, event);
  }
  /**
   * Get All Events API v2
   */
  public getEvents(name: string) {
    /* return this.http.get(environment.API_ENDPOINT + 'scheduler/list/all'); */
    /* return this.http.get(environment.API_ENDPOINT + `company/${serviceType}/list/all/1/100`); */
    return this.http.get(environment.API_ENDPOINT + `${name}/list/all`);
  }
  /**
   * Get Event By Id API v2
   */
  public getEventById(id: number) {
    return this.http.get(environment.API_ENDPOINT + `scheduler/${id}/all`);
  }
}
