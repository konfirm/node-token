/* global describe, it, expect, source */

const CheckDigit = source('CheckDigit');

describe('CheckDigit', () => {
	const words = ['Foo', 'Hello world', 'Quis leget haec'];

	it('prefixes a checkDigit on creation', (next) => {
		words.forEach((value) => {
			const created = CheckDigit.create(value);

			expect(created.length).to.equal(value.length + 1);
			expect(created.substr(1)).to.equal(value);
		});

		next();
	});

	it('calculates the checkDigit', (next) => {
		words.forEach((value) => {
			const created = CheckDigit.create(value);
			const checkDigit = CheckDigit.calculate(value);

			expect(checkDigit.length).to.equal(1);
			expect(created.substr(1)).to.equal(value);
			expect(created).to.equal(`${checkDigit}${value}`);
		});

		next();
	});

	it('verifies the created values, meddling invalidates', (next) => {
		words.forEach((value) => {
			const created = CheckDigit.create(value);
			const meddled = [
				`x${created.substr(1)}`,
				`y${created.substr(1)}`,
				`z${created.substr(1)}`,
				created.toLowerCase(),
				created.toUpperCase()
			];

			meddled.forEach((meddle) => {
				expect(CheckDigit.verify(meddle)).to.equal(false);
			});
		});

		next();
	});

	it('does not verify too short strings or non-string types', (next) => {
		expect(CheckDigit.verify('')).to.equal(false);
		expect(CheckDigit.verify('a')).to.equal(false);
		expect(CheckDigit.verify(1)).to.equal(false);
		expect(CheckDigit.verify(Math.PI)).to.equal(false);
		expect(CheckDigit.verify(Infinity)).to.equal(false);
		expect(CheckDigit.verify(true)).to.equal(false);
		expect(CheckDigit.verify(false)).to.equal(false);
		expect(CheckDigit.verify(null)).to.equal(false);
		expect(CheckDigit.verify(undefined)).to.equal(false);
		expect(CheckDigit.verify([])).to.equal(false);
		expect(CheckDigit.verify(['foo'])).to.equal(false);
		expect(CheckDigit.verify({ a: 1 })).to.equal(false);

		next();
	});

	it('does not match too short strings', (next) => {
		expect(''.match(CheckDigit)).to.equal(null);
		expect('a'.match(CheckDigit)).to.equal(null);

		next();
	});

	it('allows for a replacer function when used as String.replace', (next) => {
		function one(num, char, index) {
			expect(num).to.be.number();
			expect(char).to.be.string();
			expect(index).to.be.number();

			return 1;
		}

		expect(''.replace(CheckDigit, one)).to.equal(0);
		expect('a'.replace(CheckDigit, one)).to.equal(1);
		expect('ab'.replace(CheckDigit, one)).to.equal(2);
		expect('abc'.replace(CheckDigit, one)).to.equal(3);

		next();
	});
});
