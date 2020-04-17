/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-11
 */
import "reflect-metadata";
import hydrate from "../hydrate";
import instantiate from "../instantiate";
import { Constructor } from "../meta";

export default <T>(
  InjectedClass?: Constructor<T> | (() => Constructor<T>),
  ...args: any[]
): any => (target: any, property: string) => {
  const symbol = Symbol(property);

  if (!InjectedClass) {
    InjectedClass = Reflect.getMetadata("design:type", target, property);
    /* istanbul ignore next */
    if (!InjectedClass) {
      throw new SyntaxError(
        "You must pass a Class for injection while you are not using typescript!" +
          'Or you may need to add "emitDecoratorMetadata: true" configuration to your tsconfig.json'
      );
    }
  }

  return {
    enumerable: true,
    configurable: true,
    get(this: any) {
      if (typeof InjectedClass === "function") {
        InjectedClass = InjectedClass();
      }

      if (!this[symbol]) {
        const initializedValue = instantiate.apply(this, [
          InjectedClass,
          ...args
        ]);
        this[symbol] = initializedValue;
        return initializedValue;
      } else {
        return hydrate(this[symbol], InjectedClass!, ...args);
      }
    },
    // @formatter:off
    // tslint:disable-next-line
    set() {}
    // @formatter:on
  };
};
