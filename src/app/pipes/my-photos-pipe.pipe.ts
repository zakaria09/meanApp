import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../posts/post.model';

@Pipe({
  name: 'myPhotosPipe'
})
export class MyPhotosPipePipe implements PipeTransform {

  transform(pictures: Array<Post>, userId): any {
    let usersPictures = [];
    usersPictures = pictures.filter(p => p.creator === userId);
    return usersPictures;
  }
}
