import test from 'ava';
import { sayHello } from './hello.js';

test('sayHello returns correct string', t => {
    t.is(sayHello(), 'Hello, world');
});
