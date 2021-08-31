import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss']
})
export class NoResultsComponent implements OnInit {

  noResultsSvgs = [
    {path: '../../../assets/img/no-results/no_result_svg_one.svg'},
    {path: '../../../assets/img/no-results/no_result_svg_two.svg'},
    {path: '../../../assets/img/no-results/no_result_svg_three.svg'},
    {path: '../../../assets/img/no-results/no_result_svg_four.svg'},
    {path: '../../../assets/img/no-results/no_result_svg_five.svg'},
    {path: '../../../assets/img/no-results/no_result_svg_six.svg'},
    {path: '../../../assets/img/no-results/no_result_svg_seven.svg'},
    {path: '../../../assets/img/no-results/no_result_svg_eight.svg'},
    {path: '../../../assets/img/no-results/no_result_svg_nine.svg'},
  ];
  svgToShow: number;
  noResultsLoaded: boolean;

  
  constructor() { }

  ngOnInit(): void {
    /* Selecte Random Image */
    this.svgToShow = Math.floor(Math.random() * 8) + 1;

    /* Starting Animation Pop Up */
    const interval = setInterval(()=>{
      this.noResultsLoaded = true;
      clearInterval(interval);
    }, 100);
  }
}
