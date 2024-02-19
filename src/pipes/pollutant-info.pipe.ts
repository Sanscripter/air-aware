import { Pipe, PipeTransform } from '@angular/core';

enum Pollutant {
  CO = "CO",
  NO2 = "NO2",
  O3 = "O3",
  PM10 = "PM10",
  PM25 = "PM25",
  SO2 = "SO2"
};

@Pipe({
  name: 'pollutantInfo',
  standalone: true
})
export class PollutantInfoPipe implements PipeTransform {

  transform(value: string | undefined): string {
    if (!value) return "";
    const pollutant = Pollutant[value.toUpperCase() as keyof typeof Pollutant];
    switch (pollutant) {
      case Pollutant.CO:
        return 'CO <br> <p class="text-xs"> (Carbon Monoxide)</p>';
      case Pollutant.NO2:
        return 'NO<sub>2</sub> <br> <p class="text-xs"> (Nitrogen Dioxide)</p>';
      case Pollutant.O3:
        return 'O<sub>3</sub> <br> <p class="text-xs"> (Ozone)</p>';
      case Pollutant.PM10:
        return 'PM<sub>10</sub> <br> <p class="text-xs"> (Particulate Matter 10)</p>';
      case Pollutant.PM25:
        return 'PM<sub>2.5</sub> <br> <p class="text-xs"> (Particulate Matter 2.5)</p>';
      case Pollutant.SO2:
        return 'SO<sub>2</sub> <br> <p class="text-xs"> (Sulfur Dioxide)</p>';
    }
  }

}
