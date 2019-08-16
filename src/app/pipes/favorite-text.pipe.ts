import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'favoriteText'
})
export class FavoriteTextPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let isFavorite = args[0];
    if (isFavorite) {
      return value + '* Favorite';
    }
    else {
      return value;
    }
  }

}
