import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  standalone: true,
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent implements OnInit {
  input: string = '';
  result: string = '';

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;
    if (this.isNumeric(key)) {
      this.pressNum(key);
    } else if (key === '.' || key === ',') {
      this.pressNum('.');
    } else if (['+', '-', '*', '/'].includes(key)) {
      this.pressOperator(key);
    } else if (key === 'Enter') {
      this.getAnswer();
    } else if (key === 'Backspace') {
      this.clear();
    } else if (key === ' ') {
      event.preventDefault(); // Prevent space from triggering scroll
      this.allClear();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent) {
    const key = event.key;
    if (key === 'Backspace') {
      event.preventDefault(); // Prevent browser navigation
      this.clear();
    }
  }

  isNumeric(str: any): boolean {
    if (typeof str != 'string') return false;
    return !isNaN(str as any) && !isNaN(parseFloat(str));
  }

  pressNum(num: string) {
    if (num === '.' && this.getLastOperand()?.includes('.')) return;
    if (
      num === '0' &&
      (this.input === '' || ['/', '*', '-', '+'].includes(this.input.slice(-1)))
    )
      return;
    this.input += num;
    this.calcAnswer();
  }

  getLastOperand(): string | undefined {
    const operands = this.input.split(/[\+\-\*\/]/);
    return operands.length > 0 ? operands.pop() : undefined;
  }

  pressOperator(op: string) {
    const lastChar = this.input.slice(-1);
    if (['/', '*', '-', '+'].includes(lastChar)) {
      return;
    }
    this.input += op;
    this.calcAnswer();
  }

  clear() {
    if (this.input) {
      this.input = this.input.slice(0, -1);
      this.calcAnswer();
    }
  }

  allClear() {
    this.result = '';
    this.input = '';
  }

  calcAnswer() {
    try {
      this.result = eval(this.input) || '';
    } catch {
      this.result = '';
    }
  }

  getAnswer() {
    this.calcAnswer();
    this.input = this.result.toString();
    if (this.input === '0') this.input = '';
  }

  constructor() {}

  ngOnInit(): void {}
}
