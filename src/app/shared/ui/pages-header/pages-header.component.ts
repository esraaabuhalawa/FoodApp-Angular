import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pages-header',
  templateUrl: './pages-header.component.html',
  styleUrls: ['./pages-header.component.css']
})
export class PagesHeaderComponent {
  @Input() title1:string = ''
  @Input() title2:string = ''
  @Input() description:string = ''
}
