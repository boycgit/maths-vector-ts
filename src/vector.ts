import OperatorSystem, { BigOperatorSystem, Operand } from './operator-system';
import { radian2degree, degree2radian } from './util';

/**
 * Vector - 2D vector class for common vector operations, support [big.js](https://github.com/MikeMcl/big.js) for arbitrary-precision decimal arithmetic
 */

export interface IVector<T> {
  _x: Operand<T>;
  _y: Operand<T>;
}

export type VectorOperand<T> = Vector<T> | Operand<T>;

export default class Vector<T> implements IVector<T> {
  _x: Operand<T>;
  _y: Operand<T>;

  // 设置默认算术体系，默认采用 大数 算术体系
  static SYSTEM = BigOperatorSystem;

  static isVector<U>(vec: VectorOperand<U>): vec is Vector<U> {
    return vec instanceof Vector;
  }

  // 每个实例对应的操作体系
  operatorSystem = Vector.SYSTEM;

  config({ system = BigOperatorSystem }) {
    if (typeof system === 'string') {
      this.operatorSystem = OperatorSystem[system] || Vector.SYSTEM;
    } else {
      this.operatorSystem = system;
    }
  }

  /**
   * Constructor. Will also work without the `new` keyword
   *
   * @param {Number} [x=0] - Value of the x axis
   * @param {Number} [y=0] - Value of the y axis
   * @return {Vector}
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = Vector(42, 1337);
   */
  constructor(x?: Operand<T>, y?: Operand<T>) {
    // 默认采用大数操作
    this._x = x || 0;
    this._y = y || 0;
  }

  get x(): string {
    return this._x.toString();
  }
  set x(v) {
    this._x = this.operatorSystem.create(v);
  }
  get y(): string {
    return this._y.toString();
  }
  set y(v) {
    this._y = this.operatorSystem.create(v);
  }

  // Returns the length
  get length(): string {
    const { sqrt } = this.operatorSystem;
    return sqrt(this.lengthSq).toString();
  }

  // Returns the squared length. If the length is only needed for comparison, this function is faster than length.
  get lengthSq(): string {
    const { plus, multiply } = this.operatorSystem;
    return plus(multiply(this.x, this.x), multiply(this.y, this.y)).toString();
  }

  get angle(): string {
    return Math.atan2(Number(this.y), Number(this.x)).toString();
  }

  get angleDegree(): string {
    const { multiply } = this.operatorSystem;
    return radian2degree(this.angle, multiply).toString();
  }

  get verticalAngle(): string {
    return Math.atan2(Number(this.x), Number(this.y)).toString();
  }

  get verticalAngleDegree(): string {
    const { multiply } = this.operatorSystem;
    return radian2degree(this.verticalAngle, multiply).toString();
  }

  /**
   * Creates a new instance from an array
   * @static
   * @param {Array} arr - Array with the x and y values at index 0 and 1 respectively
   * @returns {Vector}
   * @memberof Vector
   * @example
   *    var vec = Vector.fromArray([42, 21]);
   *
   *     vec.toString();
   *     // => x:42, y:21
   */
  static fromArray<U>(arr): Vector<U> {
    return new Vector<U>(arr[0] || 0, arr[1] || 0);
  }

  /**
   * Creates a new instance from an object
   *
   * @static
   * @param {Object} obj - Object with the values for x and y
   * @returns {Vector} - The new instance
   * @memberof Vector
   * @example
   *     var vec = Vector.fromObject({ x: 42, y: 21 });
   *
   *     vec.toString();
   *     // => x:42, y:21
   *
   */
  static fromObject<U>(obj): Vector<U> {
    return new Vector<U>(obj.x || 0, obj.y || 0);
  }

  /**
   * # Manipulation
   *
   * These functions are chainable.
   */

  /**
   * Adds another vector's X axis or certain number to this one,
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number you want to add to this one,
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(10, 10);
   *     var vec2 = new Vector(20, 30);
   *     vec1.addX(vec2).toString();
   *     // => x:30, y:10
   *
   *     vec1.addX(40).toString(); // notice vec1 is immutable
   *     // => x:50, y:10
   */
  addX(vec: VectorOperand<T>): Vector<T> {
    const { isVector } = Vector;
    const { plus } = this.operatorSystem;
    const targetX = plus(this.x, isVector<T>(vec) ? vec.x : vec);
    return new Vector<T>(targetX, this.y);
  }

  /**
   * Adds another vector's Y axis or certain number to this one,
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number you want to add to this one,
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(10, 10);
   *     var vec2 = new Vector(20, 30);
   *     vec1.addY(vec2).toString();
   *     // => x:10, y:40
   *
   *     vec1.addY(40).toString(); // notice vec1 is immutable
   *     // => x:10, y:50
   */
  addY(vec: VectorOperand<T>): Vector<T> {
    const { isVector } = Vector;
    const { plus } = this.operatorSystem;
    const targetY = plus(this.y, isVector<T>(vec) ? vec.y : vec);
    return new Vector<T>(this.x, targetY);
  }

  /**
   * Adds another vector or number to this one
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number you want to add to this one,
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(10, 10);
   *     var vec2 = new Vector(20, 30);
   *
   *     vec1.add(vec2).toString(); // notice vec1, vec2 is both immutable
   *     // => x:30, y:40
   *
   */
  add(vec: VectorOperand<T>): Vector<T> {
    return this.addX(vec).addY(vec); // operator is chainable
  }

  /**
   * minus another vector's X axis or certain number to this one,
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number you want to minus to this one,
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(20, 30);
   *     vec1.subtractX(vec2).toString();
   *     // => x:80, y:50
   *
   *     vec1.subtractX(40).toString(); // notice vec1 is immutable
   *     // => x:60, y:10
   */
  subtractX(vec: VectorOperand<T>): Vector<T> {
    const { isVector } = Vector;
    const { minus } = this.operatorSystem;
    const targetX = minus(this.x, isVector<T>(vec) ? vec.x : vec);
    return new Vector<T>(targetX, this.y);
  }

  /**
   * minus another vector's Y axis or certain number to this one,
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number you want to minus to this one,
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(20, 30);
   *     vec1.subtractY(vec2).toString();
   *     // => x:100, y:20
   *
   *     vec1.subtractY(40).toString(); // notice vec1 is immutable
   *     // => x:100, y:10
   */
  subtractY(vec: VectorOperand<T>): Vector<T> {
    const { isVector } = Vector;
    const { minus } = this.operatorSystem;
    const targetY = minus(this.y, isVector<T>(vec) ? vec.y : vec);
    return new Vector<T>(this.x, targetY);
  }

  /**
   * minus another vector or certain number to this one,
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number you want to minus to this one,
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(20, 30);
   *     vec1.subtract(vec2).toString();
   *     // => x:80, y:20
   *
   *     vec1.subtract(40).toString(); // notice vec1 is immutable
   *     // => x:60, y:10
   */
  subtract(vec: VectorOperand<T>): Vector<T> {
    return this.subtractX(vec).subtractY(vec); // operator is chainable
  }

  /**
   * Divides X axis by another vector's X axis or certain number
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(2, 2);
   *     vec1.divideX(vec2).toString();
   *     // => x:50, y:50
   *
   *     vec1.divideX(4).toString(); // notice vec1 is immutable
   *     // => x:25, y:50
   */
  divideX(vec: VectorOperand<T>): Vector<T> {
    const { isVector } = Vector;
    const { divide } = this.operatorSystem;
    const targetX = divide(this.x, isVector<T>(vec) ? vec.x : vec);
    return new Vector<T>(targetX, this.y);
  }

  /**
   * Divides Y axis by another vector's Y axis or certain number
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(2, 2);
   *     vec1.divideY(vec2).toString();
   *     // => x:100, y:25
   *
   *     vec1.divideY(4).toString(); // notice vec1 is immutable
   *     // => x:100, y:12.5
   */
  divideY(vec: VectorOperand<T>): Vector<T> {
    const { isVector } = Vector;
    const { divide } = this.operatorSystem;
    const targetY = divide(this.y, isVector<T>(vec) ? vec.y : vec);
    return new Vector<T>(this.x, targetY);
  }

  /**
   * Divides by another vector's or certain number
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(2, 2);
   *     vec1.divide(vec2).toString();
   *     // => x:50, y:25
   *
   *     vec1.divide(4).toString(); // notice vec1 is immutable
   *     // => x:25, y:12.5
   */
  divide(vec: VectorOperand<T>): Vector<T> {
    return this.divideX(vec).divideY(vec); // operator is chainable
  }

  /**
   * multiplies X axis by another vector's X axis or certain number
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(2, 2);
   *     vec1.multiplyX(vec2).toString();
   *     // => x:200, y:50
   *
   *     vec1.multiplyX(4).toString(); // notice vec1 is immutable
   *     // => x:400, y:10
   */
  multiplyX(vec: VectorOperand<T>): Vector<T> {
    const { isVector } = Vector;
    const { multiply } = this.operatorSystem;
    const targetX = multiply(this.x, isVector<T>(vec) ? vec.x : vec);
    return new Vector<T>(targetX, this.y);
  }

  /**
   * multiplies Y axis by another vector's Y axis or certain number
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(2, 2);
   *     vec1.multiplyY(vec2).toString();
   *     // => x:100, y:100
   *
   *     vec1.multiplyY(4).toString(); // notice vec1 is immutable
   *     // => x:100, y:200
   */
  multiplyY(vec: VectorOperand<T>): Vector<T> {
    const { isVector } = Vector;
    const { multiply } = this.operatorSystem;
    const targetY = multiply(this.y, isVector<T>(vec) ? vec.y : vec);
    return new Vector<T>(this.x, targetY);
  }

  /**
   * multiplies by another vector's or certain number
   *
   *
   * @param {(Vector| Number)} vec - The other vector or number
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(2, 2);
   *     vec1.multiply(vec2).toString();
   *     // => x:200, y:100
   *
   *     vec1.multiply(4).toString(); // notice vec1 is immutable
   *     // => x:400, y:200
   */
  multiply(vec: VectorOperand<T>): Vector<T> {
    return this.multiplyX(vec).multiplyY(vec); // operator is chainable
  }

  /**
   * inverts X axis
   *
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(2, 2);
   *     vec1.invertX().toString();
   *     // => x:-100, y:100
   */
  invertX(): Vector<T> {
    return this.multiplyX(-1);
  }
  /**
   * inverts Y axis
   *
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     vec1.invertY().toString();
   *     // => x:100, y:-50
   */
  invertY(): Vector<T> {
    return this.multiplyY(-1);
  }
  /**
   * inverts both axis
   *
   * @return {Vector}
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     vec1.invert().toString();
   *     // => x:-100, y:-50
   */
  invert(): Vector<T> {
    return this.multiply(-1);
  }

  /**
   * Normalize to unit vector
   *
   * @returns {Vector}
   * @memberof Vector
   */
  normalize(): Vector<T> {
    return this.divide(this.length);
  }
  /**
   * alais of normalize
   *
   * @memberof Vector
   */
  norm(): Vector<T> {
    return this.normalize();
  }

  /**
   * Rotates the vector to a certain angle, in radians CCW from +X axis.
   *
   * @param {Number} angle - Number angle Angle in radians
   * @memberof Vector
   * @example
   *  var vec = new Vector(100, 0);
   *  vec.rotate(-Math.PI).toString(); // vec is immutable
   *  // => x: -100, y: 0
   */
  rotate(angle: number): Vector<T> {
    const { multiply, plus, minus } = this.operatorSystem;

    //
    const nx = minus(
      multiply(this.x, Math.cos(angle)),
      multiply(this.y, Math.sin(angle))
    );
    const ny = plus(
      multiply(this.x, Math.sin(angle)),
      multiply(this.y, Math.cos(angle))
    );
    return new Vector(nx, ny);
  }

  /**
   * Same as rotate but uses degrees
   *
   * @param {Number} degree - Number angle Angle in radians
   * @memberof Vector
   * @example
   *  var vec = new Vector(100, 0);
   *  vec.rotate(90).toString(); // vec is immutable
   *  // => x: 0, y: 100
   */
  rotateDegree(degree: number): Vector<T> {
    const { divide } = this.operatorSystem;
    const angle = degree2radian(degree, divide);
    return this.rotate(angle);
  }

  /**
   * Calculates the dot product of this vector and another
   *
   * @param {Vector} vec2 - The second vector
   * @returns {Number} - dot product
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(200, 60);
   *
   *     vec1.dot(vec2).toString();
   *     // => 23000
   */
  dot(vec2: Vector<T>): string {
    const { plus, multiply } = this.operatorSystem;
    return plus(multiply(this.x, vec2.x), multiply(this.y, vec2.y)).toString();
  }

  /**
   * Calculates the cross product of this vector and another
   * 在3D图像学中，叉乘的概念非常有用，可以通过两个向量的叉乘，生成第三个垂直于a，b的法向量，从而构建X、Y、Z坐标系
   * 在二维空间中，叉乘还有另外一个几何意义就是：aXb等于由向量a和向量b构成的平行四边形的面积；
   * 定义向量a、b，当aXb<0时（X就表示叉乘），b对应的线段在a的顺时针方向；当aXb=0时，a、b共线；当aXb>0时，b在a的逆时针方向。（注意：aXb=-bXa，因此判断时要注意顺序）
   *
   * @param {Vector} vec2 - The second vector
   * @returns {Number} - cross product
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(200, 60);
   *
   *     vec1.cross(vec2).toString();
   *     // => -4000
   */
  cross(vec2: Vector<T>): string {
    const { minus, multiply } = this.operatorSystem;
    return minus(multiply(this.x, vec2.y), multiply(this.y, vec2.x)).toString();
  }

  /**
   * Projects a vector onto another vector, setting itself to the result.
   *
   * @param {Vector} vec2
   * @returns {Vector}
   * @memberof Vector
   * @example
   *     var vec = new Vector(100, 0);
   *     var vec2 = new Vector(100, 100);
   *     vec.projectOnto(vec2).toString();
   *     // => x:50, y:50
   *
   */
  projectOnto(vec2: Vector<T>): Vector<T> {
    const { multiply, divide } = this.operatorSystem;

    // 求解向量上的分解因子
    var coeff = divide(this.dot(vec2), vec2.lengthSq);
    return new Vector(multiply(coeff, vec2.x), multiply(coeff, vec2.y));
  }

  /**
   * get cos angle between of two angle
   *
   * @param {Vector} vec2
   * @returns {Number} - cos value of angle
   * @memberof Vector
   * @example
   *     var vec = new Vector(1, 1);
   *     var vec2 = new Vector(1, 1);
   *     vec.cosAngleBetween(vec2).toString();
   *     // => 1
   */
  cosAngleBetween(vec2: Vector<T>): string {
    return this.divide(this.length)
      .divide(vec2.length)
      .dot(vec2);
  }

  /**
   * get angle between of two vector， in radians CCW
   *
   * @param {Vector} vec2
   * @returns {Number} - angle between of two vector
   * @memberof Vector
   * @example
   *     var vec = new Vector(1, 0);
   *     var vec2 = new Vector(1, 1);
   *     vec.angleBetween(vec2).toString();
   *     // => PI / 4
   */
  angleBetween(vec2: Vector<T>): string {
    return Math.acos(Number(this.cosAngleBetween(vec2))).toString();
  }

  /**
   * Calculates the distance of the X axis between this vector and another
   *
   * @param {Vector} vec - The second vector
   * @returns {Number} - Distance
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(200, 60);
   *
   *     vec1.distanceX(vec2);
   *     // => -100
   */
  distanceX(vec: Vector<T>): string {
    const { minus } = this.operatorSystem;

    return minus(this.x, vec.x).toString();
  }

  /**
   * Same as `distanceX()` but always returns an absolute number
   *
   * @param {Vector} vec - The second vector
   * @returns {Number} - Absolute Distance
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(200, 60);
   *
   *     vec1.absDistanceX(vec2);
   *     // => 100
   */
  absDistanceX(vec: Vector<T>): string {
    const { abs } = this.operatorSystem;
    return abs(this.distanceX(vec)).toString();
  }

  /**
   * Calculates the distance of the Y axis between this vector and another
   *
   * @param {Vector} vec - The second vector
   * @returns {Number} - Distance
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(200, 60);
   *
   *     vec1.distanceY(vec2);
   *     // => -100
   */
  distanceY(vec: Vector<T>): string {
    const { minus } = this.operatorSystem;
    return minus(this.y, vec.y).toString();
  }

  /**
   * Same as `distanceY()` but always returns an absolute number
   *
   * @param {Vector} vec - The second vector
   * @returns {Number} - Absolute Distance
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(200, 60);
   *
   *     vec1.absDistanceY(vec2);
   *     // => 100
   */
  absDistanceY(vec: Vector<T>): string {
    const { abs } = this.operatorSystem;
    return abs(this.distanceY(vec)).toString();
  }

  /**
   * Calculates euclidean distance between this vector and another
   *
   * @param {Vector} vec The second vector
   * @return {Number} Distance
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(200, 60);
   *
   *     vec1.distance(vec2);
   *     // => 10100
   *
   */
  distance(vec: Vector<T>): string {
    const { sqrt } = this.operatorSystem;
    return sqrt(this.distanceSq(vec)).toString();
  }

  /**
   * Calculates the squared euclidean distance between this vector and another
   * If the distance is only needed for comparison, this function is faster than  `distance`.
   *
   * @param {Vector} vec The second vector
   * @return {Number} Distance
   * @memberof Vector
   * @example
   *     var vec1 = new Vector(100, 50);
   *     var vec2 = new Vector(200, 60);
   *
   *     vec1.distanceSq(vec2);
   *     // => 10100
   *
   */
  distanceSq(vec: Vector<T>): string {
    const { plus, multiply } = this.operatorSystem;
    const dx = this.distanceX(vec);
    const dy = this.distanceY(vec);
    return plus(multiply(dx, dx), multiply(dy, dy)).toString();
  }

  /**
   * Returns a true if vector is (0, 0)
   *
   * @returns {Boolean} -
   * @memberof Vector
   * @example
   *     var vec = new Victor();
   *     vec.isZero();
   *     // => true
   *
   */
  isZero(): boolean {
    const { equal } = this.operatorSystem;
    return equal(this.x, 0) && equal(this.y, 0);
  }
  /**
   * Returns a true if this vector is the same as another
   *
   *
   * @return {Boolean}
   * @memberof Vector
   * @example
   *     var vec1 = new Victor(100, 50);
   *     var vec2 = new Victor(100, 50);
   *     vec1.isEqualTo(vec2);
   *
   *     // => true
   *
   */
  isEqualTo(vec2: Vector<T>) : boolean{
    const { equal } = this.operatorSystem;
    return equal(this.x, vec2.x) && equal(this.y, vec2.y);
  }

  /**
   * Returns an string representation of the vector
   *
   * @return {String}
   * @memberof Vector
   * @example
   *     var vec = new Victor(10, 20);
   *     vec.toString();
   *
   *     // => x:10, y:20
   */
  toString(): string {
    return 'x:' + this.x + ', y:' + this.y;
  }
  /**
   * Returns an array representation of the vector
   *
   * @return {Array}
   * @memberof Vector
   * @example
   *     var vec = new Victor(10, 20);
   *     vec.toArray();
   *     // => [10, 20]
   */
  toArray(): Array<Operand<T>> {
    return [this.x, this.y];
  }

  /**
   * Returns an object representation of the vector
   *
   * ### Examples:

    * @return {Object}
    * @memberof Vector
    * @example
    *     var vec = new Victor(10, 20);
    *
    *     vec.toObject();
    *     // => { x: 10, y: 20 }
    *
    */
  toObject() : {x: Operand<T>, y: Operand<T>}{
    return { x: this.x, y: this.y };
  }
}
