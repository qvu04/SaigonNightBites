declare module 'opening_hours' {
  export default class OpeningHours {
    constructor(value: string);
    getState(date?: Date): boolean;
  }
}
