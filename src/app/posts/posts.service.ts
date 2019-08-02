import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient
  ) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map(postData => {
        return postData.posts.map(post => {
        return { 
          id: post._id,
          title: post.title,
          content: post.content
        }
        })
      }))
      .subscribe(posts => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string }>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe(responseData => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    console.log(id)
    const post: Post = { id: id, title: title, content: content }
    this.http.put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe(responseData => {
        const updatedPosts = [...this.posts];
        const oldPOstIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPOstIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])
      });
  }

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(p => p.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])
      })
  }
}
