import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  currentPage = 1;
  totalPosts = 0;
  postsPerPage = 2;
  pageSize = [1, 2 , 5];
  currentUserIsAuth = false;
  private authListenerSubs: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.currentUserIsAuth = this.authService.authStatus;
    this.authListenerSubs = this.authService.authState
      .subscribe(isAuth => this.currentUserIsAuth = isAuth); // true upon siginin
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
  }

  onDownload(ImagePathUrl: string) {
    const relativePath = ImagePathUrl.split('images');
    const path = relativePath.join().split('/')[4];
    this.postsService.downloadImage(path)
      .subscribe(
        res => saveAs(res, path),
        error => console.log(error)
      );
  }

  onChangePage(pageData) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
