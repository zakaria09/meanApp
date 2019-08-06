import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private router: Router
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

  addPost(title, content, image: File) {
    const postData = new FormData();
    postData.append('title', title);    
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', postData)
      .subscribe(responseData => {
        const post: Post = { id: responseData.postId, title: title, content: content};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/'])
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
        this.router.navigate(['/'])
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
