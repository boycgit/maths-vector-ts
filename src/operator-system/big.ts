import { IOperatorSystem, Operand } from './types';
import Big from 'big.js';

const BigOperatorSystem: IOperatorSystem<Big>  = {
  name: 'BigOperatorSystem',
  create: (x: Operand<Big>) =>{
    return new Big(x);
  },
  plus:(x: Operand<Big>, y: Operand<Big>) => {
    return new Big(x).plus(y);
  },
  minus:(x: Operand<Big>, y: Operand<Big>) =>{
    return new Big(x).minus(y);
  },

  divide:(x: Operand<Big>, y: Operand<Big>) =>{
    return new Big(x).div(y);
  },

  multiply:(x: Operand<Big>, y: Operand<Big>) =>{
    return new Big(x).times(y);
  },
  sqrt: (x: Operand<Big>) =>{
    return new Big(x).sqrt();
  },
  abs: (x: Operand<Big>) =>{
    return new Big(x).abs();
  },
  equal:(x: Operand<Big>, y: Operand<Big>) =>{
    return new Big(x).eq(y);
  }
}

export default BigOperatorSystem;
