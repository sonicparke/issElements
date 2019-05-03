import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'iss-temperature-gauge',
  templateUrl: './temperature-gauge.component.html',
  styleUrls: ['./temperature-gauge.component.scss']
})
export class TemperatureGaugeComponent implements OnInit {

  @Input() public unit = 'fahrenheit';
  @Input() public stationComponent = 'discombubulator';
  @Output() public hiTemp = new EventEmitter();

  public currentTemp: any[];
  public currentTempDisplay: string;
  public unitToDisplay: string;
  public view: any[];
  public showXAxis = true;
  public showYAxis = true;
  public showLegend = false;
  public gradient = false;
  public showXAxisLabel = false;
  public xAxisLabel = 'Station Component';
  public showYAxisLabel = false;
  public yAxisLabel: string;

  public colorScheme = {
    domain: ['#b71c1c']
  };

  constructor(
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.view = [300, 500];
    this.firestoreService.createDocument(this.stationComponent, this.unit);
    this.firestoreService.currentTemp.subscribe(
      (item) => {
        this.currentTemp = [{
          name: this.titleCase(this.stationComponent),
          value: this.getCalculatedTemp(item.value, item.name)
        }];
        this.currentTempDisplay = this.currentTemp[0].value;
        this.unitToDisplay = this.titleCase(this.unit);
        this.yAxisLabel = `Degrees in ${this.titleCase(this.unit)}`;
      }
    );
  }

  public getScaleMax(): number {
    if (this.unit === 'celsius') {
      return 100;
    } else {
      return 200;
    }
  }

  public getScaleMin(): number {
    if (this.unit === 'celsius') {
      return -10;
    } else {
      return -20;
    }
  }

  private getCalculatedTemp(temp: number, storedUnit: string): number {
    if (this.unit === 'celsius') {
      let convertedTemp = temp;
      if (storedUnit !== 'celsius') {
        convertedTemp = this.convertToCelsuis(temp);
      }
      if (convertedTemp > 50) {
        this.hiTemp.emit(this.currentTemp[0]);
      } else {
        this.hiTemp.emit(false);
      }
      return convertedTemp;
    } else if (this.unit === 'fahrenheit') {
      let convertedTemp = temp;
      if (storedUnit !== 'fahrenheit') {
        convertedTemp = this.convertToFahrenheit(temp);
      }
      if (convertedTemp >= 100) {
        this.hiTemp.emit(this.currentTemp[0]);
      } else {
        this.hiTemp.emit(false);
      }
      return convertedTemp;
    } else {
      return temp;
    }
  }

  private convertToCelsuis(fahrenheit: number) {
    const celsius = Math.round((fahrenheit - 32) * (5 / 9));
    return celsius;
  }

  private convertToFahrenheit(celsius: number) {
    const fahrenheit = Math.round((celsius * 9 / 5) + 32);
    return fahrenheit;
  }

  private titleCase(str: string) {
    return str.toLowerCase().split(' ').map((word: string) => {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

}
