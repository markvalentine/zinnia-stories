import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'storyText'
})
export class StoryTextPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    console.log(value);
    console.log()
    let newString = this.replaceAll(value, '\n\n\n\n\n', '</p><p>', false);
    newString = this.replaceAll(newString, '\n\n\n\n', '</p><p>', false);
    newString = this.replaceAll(newString, '\n\n\n', '</p><p>', false);
    newString = this.replaceAll(newString, '\n\n', '</p><p>', false);
    newString = this.replaceAll(newString, '\n', '</p><p>', false);
    // newString = this.replaceAll(newString, '\n', '</p><p style=\"margin-bottom: 0px; margin-top: 0px\">', false);
    return ("<p>"+newString+"</p>");
    // return ("<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+value.replace('\n\n', '</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')+"</p>").replace('\n', '</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
  }

  replaceAll(value: string, str1: string, str2: string, ignore: boolean): string {
    return value.replace(new RegExp(str1.replace(/([\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, function(c){return "\\" + c;}), "g"+(ignore?"i":"")), str2);
  }

}
