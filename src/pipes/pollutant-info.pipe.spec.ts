import { PollutantInfoPipe } from './pollutant-info.pipe';

describe('PollutantInfoPipe', () => {
  it('create an instance', () => {
    const pipe = new PollutantInfoPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the correct pollutant info', () => {
    const pipe = new PollutantInfoPipe();
    let result = pipe.transform('pm10');
    expect(result).toEqual('PM<sub>10</sub> <br> <p class="text-xs"> (Particulate Matter 10)</p>');
    result = pipe.transform('no2');
    expect(result).toEqual('NO<sub>2</sub> <br> <p class="text-xs"> (Nitrogen Dioxide)</p>');
    result = pipe.transform('co');
    expect(result).toEqual('CO <br> <p class="text-xs"> (Carbon Monoxide)</p>');
    result = pipe.transform('no');
    expect(result).toEqual('NO <br> <p class="text-xs"> (Nitric Oxide)</p>');
    result = pipe.transform('o3');
    expect(result).toEqual('O<sub>3</sub> <br> <p class="text-xs"> (Ozone)</p>');
    result = pipe.transform('pm25');
    expect(result).toEqual('PM<sub>2.5</sub> <br> <p class="text-xs"> (Particulate Matter 2.5)</p>');
    result = pipe.transform('so2');
    expect(result).toEqual('SO<sub>2</sub> <br> <p class="text-xs"> (Sulfur Dioxide)</p>');
  });

  it('should not return any information if the pollutant is not found', () => {
    const pipe = new PollutantInfoPipe();
    const result = pipe.transform('notfound');
    expect(result).toEqual('UNKNOWN POLLUTANT');
  });
});
