import {Country} from './interfaces';

export class Point {
  public lat: number;
  public lng: number;
  public name: string;
  public address: string;
  public country: Country;

  constructor(lat: number, lng: number, name = '', address = '', country = {
    long_name: '',
    short_name: ''
  }) {
    this.lat = lat;
    this.lng = lng;
    this.name = name;
    this.address = address;
    this.country = country;
  }

  public getLat(): number {
    return this.lat;
  }

  public getLng(): number {
    return this.lng;
  }

  public getName(): string {
    return this.name;
  }

  public getAddress(): string {
    return this.address;
  }

  public getCountry(): Country {
    return this.country;
  }

  public setLat(lat: number): void {
    this.lat = lat;
  }

  public setLng(lng: number): void {
    this.lng = lng;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setAddress(address: string): void {
    this.address = address;
  }

  public setCountry(country: Country): void {
    this.country = country;
  }
}
