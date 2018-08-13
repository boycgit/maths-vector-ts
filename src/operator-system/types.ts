/**
 * 定义 运算数 数据类型，可以为 number、string、或者 Big 对象
 */
export type Operand<T> = T | string | number;

// 函数类型：一元操作
export type UnaryOperation<T> = (x: T) => T;

// 函数类型：二元操作
export type DualOperation<T> = (x: T, y: T) => T;

/**
 * 定义操作的接口，必须要实现这些个接口
 *
 * @export
 * @interface IOperatorSystem
 * @template T
 */
export interface IOperatorSystem<T> {
  name: string;
  create: UnaryOperation<T>;
  sqrt: UnaryOperation<T>;
  abs: UnaryOperation<T>;
  plus: DualOperation<T>;
  minus: DualOperation<T>;
  divide: DualOperation<T>;
  multiply: DualOperation<T>;
  equal: (x: T, y: T) => boolean;
}
