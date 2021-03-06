/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017/12/25
 */

import Injector, { Scope } from '../Injector';

test('dump all instance from container', () => {

	const injector = Injector.newInstance();

	class Klass {
		name = 'kuitos';
	}

	class Klass1 {
		age = 18;
	}

	const klass = injector.get(Klass, { name: 'klass', scope: Scope.Singleton });
	const klass1 = injector.get(Klass1, { name: 'klass1', scope: Scope.Singleton });

	const collection = injector.dump();
	expect({ klass, klass1 }).toEqual(collection);
});

test('load container from external', () => {

	const snapshot = {
		klass: { name: 'kuitos', age: 18 },
		klass1: { age: 10 },
	};

	const injector = Injector.newInstance();
	injector.load(snapshot);

	class Klass {
		name: string;
		age: number;

		getName() {
			return this.name;
		}

		getAge() {
			return this.age;
		}

	}

	const instance = injector.get(Klass, { scope: Scope.Singleton, name: 'klass' });
	const instance1 = injector.get(Klass, { scope: Scope.Singleton, name: 'klass1' });
	expect(instance.getName()).toBe(snapshot.klass.name);
	expect(instance.getAge()).toBe(snapshot.klass.age);
	expect(instance1.getAge()).toBe(snapshot.klass1.age);
});

test('singleton getting without a name will throw exception', () => {

	const injector = Injector.newInstance();

	class Klass {
		name = 'kuitos';
		age = 18;
	}

	expect(() => injector.get(Klass, { scope: Scope.Singleton })).toThrow(SyntaxError);
	expect(() => injector.get(Klass, { scope: Scope.Singleton })).toThrow('A singleton injection must have a name!');
});

test('getting without a recognized scope type will throw exception', () => {
	const injector = Injector.newInstance();

	class Klass {
		name = 'kuitos';
		age = 18;
	}

	expect(() => injector.get(Klass, { scope: '' } as any)).toThrow(SyntaxError);
	expect(() => injector.get(Klass, { scope: '' } as any)).toThrow('You must set injected class as a mmlpx recognized model!');
});
