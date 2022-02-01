/*
This class acts as a simple timer
The user can use it to know if his lamps are hot enough
*/
export default class Timer {
  public secondsLeft = 0;

  public initInterval(): void {
    setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  public resetTimer(duration: number): void {
    this.secondsLeft = duration;
  }

  // Called every second and when initializing Timer class
  public updateTimer(): void {
    if (!this.isOver()) {
      this.secondsLeft -= 1;
    }
  }

  public isOver(): boolean {
    return this.secondsLeft === 0;
  }
}
