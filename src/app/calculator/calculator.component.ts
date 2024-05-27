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
    if (key === ' ') {
      event.preventDefault();
    }
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
    } else if (key === 'c') {
      this.allClear();
    } else if (key === '-') {
      this.toggleSign();
    } else if (key === 's') {
      this.getSquareRoot();
    } else if (key === 'p') {
      this.insertPi();
    } else if (key === 'l') {
      this.calculateLogarithm10();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent) {
    const key = event.key;
    if (key === ' ') {
      event.preventDefault();
    }
    if (key === 'Backspace') {
      event.preventDefault();
      this.clear();
    }
  }

  toggleSign() {
    if (this.input !== '' && this.input !== '0') {
      const firstChar = this.input.charAt(0);
      if (firstChar === '-') {
        this.input = this.input.slice(1);
      } else {
        this.input = '-' + this.input;
      }
      this.calcAnswer();
    }
  }

  // scientific operations

  calculateSquare() {
    if (this.input !== '') {
      const number = parseFloat(this.input);
      const square = number * number;
      this.input = square.toString();
      this.calcAnswer();
    }
  }

  getSquareRoot() {
    if (this.input !== '' && this.input !== '0') {
      const result = Math.sqrt(parseFloat(this.input));
      if (!isNaN(result)) {
        this.result = result.toString();
        this.input = this.result;
      } else {
        this.result = '';
      }
    }
  }
  calculateLogarithm10() {
    if (this.input !== '' && this.input !== '0') {
      const num = parseFloat(this.input);
      if (!isNaN(num) && num > 0) {
        const result = Math.log10(num);
        this.result = result.toString();
        this.input = this.result;
      } else {
        this.result = '';
      }
    }
  }

  insertPi() {
    if (this.input === '') {
      this.input += Math.PI.toString();
      this.calcAnswer();
    }
  }

  isNumeric(str: any): boolean {
    if (typeof str != 'string') return false;
    return !isNaN(str as any) && !isNaN(parseFloat(str));
  }

  pressNum(num: string) {
    if (this.input.length >= 20) return; // Limit input to 20 digits
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
