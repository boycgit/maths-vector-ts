import BaseOperatorSystem from './base';
import BigOperatorSystem from './big';

export * from './types';
export { BaseOperatorSystem, BigOperatorSystem };
export default {
  base: BaseOperatorSystem,
  big: BigOperatorSystem
};
