import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Comments } from '../model/comment';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AppCommentService {
  constructor(private http: HttpClient) {
  }

  createComment(comment) {
    return this.http.post(environment.API_ENDPOINT + `todo/comment/${comment.entityId}`, comment);
  }

  getCommentById(id) {
    return this.http.get(environment.API_ENDPOINT + `comment/${id}`);
  }

  deleteComment(id) {
    return this.http.delete(environment.API_ENDPOINT + `todo/comment/id/${id}`);
  }

  updateComment(id, comment) {
    return this.http.put(environment.API_ENDPOINT + `todo/comment/id/${id}`, comment);
  }

  getAllComments() {
    return this.http.get(environment.API_ENDPOINT + `comment/list/1/100`);
  }

  getCommentsByEntityAndId(entity, id) {
    return this.http.get<Comments[]>(environment.API_ENDPOINT + 'comment/list/1/100').pipe(
      map((x) => {
        return x.filter((p) => p.entityName === entity && p.entityId === id);
      })
    );
  }

  /** To-do comments new √ */
  getSingleTodoCommentsList(todoId) {
    return this.http.get(environment.API_ENDPOINT + `todo/comment/list/id/${todoId}` + '/' + environment.page + '/' + environment.perPage);
  }
}
