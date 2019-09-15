import { Injectable } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { map, retryWhen } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
      // keep resubscribing (retrying) if request fails
      .pipe(retryWhen(() => interval(5000)),
        map(postData => {
          return { posts: postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator
            }
          }),
          maxPosts: postData.maxPosts
        };
      })
    )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title, content, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe(responseData => {
        this.router.navigate(['/'])
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe(responseData => {
        this.router.navigate(['/'])
      });
  }

  deletePost(postId: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`)
  }

  downloadImage(imagePath: string) {
    const body = { filename: imagePath };
    return this.http.post('http://localhost:3000/api/posts/download', body, {
       responseType: "blob",
       headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
