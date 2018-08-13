import { IOperatorSystem, Operand } from './types';

const BaseOperatorSystem: IOperatorSystem<number> = {
  name: 'BaseOperatorSystem',
  create: (x: Operand<number>) => {
    return Number(x);
  },
  plus: (x: Operand<number>, y: Operand<number>) => {
    return Number(x) + Number(y);
  },
  minus: (x: Operand<number>, y: Operand<number>) =>{
    return Number(x) - Number(y);
  },
  divide: (x: Operand<number>, y: Operand<number>) =>{
    return Number(x) / Number(y);
  },
  multiply: (x: Operand<number>, y: Operand<number>) => {
    return Number(x) * Number(y);
  },
  sqrt: (x: Operand<number>) => {
    return Math.sqrt(x as number);
  },
  abs: (x: Operand<number>) => {
    return Math.abs(x as number);
  },
  equal: (x: Operand<number>, y: Operand<number>) =>{
    return Number(x) === Number(y);
  }
}

export default BaseOperatorSystem;
