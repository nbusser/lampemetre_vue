export class Color {
  public red: number;

  public green: number;

  public blue: number;

  public transparency: number;

  constructor(red:number, green:number, blue:number, transparency: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.transparency = transparency;
  }

  toString(): string {
    return `rgba(${this.red},${this.green},${this.blue},${this.transparency})`;
  }

  equals(c: Color): boolean {
    return (this.red === c.red
      && this.green === c.green
      && this.blue === c.blue
      && this.transparency === c.transparency);
  }
}

export const colorBible: Color[] = [
  new Color(66, 165, 245, 1.0), // Blue
  new Color(255, 23, 68, 1.0), // Red
  new Color(0, 191, 165, 1.0), // Teal
  new Color(255, 234, 0, 1.0), // Yellow Sun
  new Color(248, 187, 208, 1.0), // Pink
  new Color(0, 229, 255, 1.0), // Cyan
  new Color(118, 255, 3, 1.0), // Light Green
  new Color(213, 0, 249, 1.0), // Purple
  new Color(48, 79, 254, 1.0), // Indigo
  new Color(105, 240, 174, 1.0), // Green
  new Color(255, 145, 0, 1.0), // Orange
  new Color(98, 0, 234, 1.0), // Deep Purple
  new Color(129, 212, 250, 1.0), // Light Blue
  new Color(192, 202, 51, 1.0), // Lime
  new Color(141, 110, 99, 1.0), // Brown
  new Color(84, 110, 122, 1.0), // Blue Grey
];

export const pastelColorBible: Color[] = [
  new Color(0, 0, 255, 0.4), // Blue
  new Color(255, 0, 0, 0.4), // Red
  new Color(0, 128, 21, 0.4), // Dark green
  new Color(77, 0, 153, 0.4), // Purple
  new Color(230, 191, 0, 0.4), // Orange
  new Color(93, 206, 216, 0.4), // Cyan
  new Color(93, 216, 165, 0.4), // Pale green
  new Color(252, 126, 233, 0.4), // Pink
  new Color(130, 69, 5, 0.4), // Brown
];
