import { Component, Input } from '@angular/core';
import * as PollutantLevels from '../assets/data/pollutant-levels.json';
import { PollutantInfoPipe } from '../pipes/pollutant-info.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pollutant-indicator',
  standalone: true,
  imports: [
    CommonModule,
    PollutantInfoPipe
  ],
  templateUrl: './pollutant-indicator.component.html',
  styleUrl: './pollutant-indicator.component.css'
})
export class PollutantIndicatorComponent {

  @Input() pollutant!:{
    parameter: string;
    value: number;
    unit: string;
    lastUpdated: string;
    sourceName: string;
    averagingPeriod: {
      value: number;
      unit: string;
    }
  };

  barLengthPercent: number = 0;
  maxBarLength: number = 100;
  minBarLength: number = 0;
  barColor: 'bg-green-400' | 'bg-yellow-600' | 'bg-red-300' = 'bg-green-400';

  ngOnInit() {
    this.barLengthPercent = this.pollutant.value / (PollutantLevels as Record<string,any>)[this.pollutant.parameter]['moderate'] * 100;
    this.maxBarLength = (PollutantLevels as Record<string,any>)[this.pollutant.parameter]['moderate'] as number;
    this.barColor = this.getBarColor();
  }

  getBarColor() {
    if (this.pollutant.value > (PollutantLevels as Record<string,any>)[this.pollutant.parameter]['moderate']) {
      return 'bg-red-300';
    }
    if (this.pollutant.value > (PollutantLevels as Record<string,any>)[this.pollutant.parameter]['good']) {
      return 'bg-yellow-600';
    }
    return 'bg-green-400';
  }

  get barLength() {
   return this.barLengthPercent + '%';
  }

}
