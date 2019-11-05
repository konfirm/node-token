/* global describe, it, expect, source */

const Token = source('Token');
const AlphabetSubset = require('../module/AlphabetSubset');

describe('Token', () => {
	it('has a numeric static DEFAULT_LENGTH provider', (next) => {
		expect(Token.DEFAULT_LENGTH).to.be.number();

		next();
	});

	it('creates verifiable tokens', (next) => {
		const signed = Token.create();

		expect(signed).to.be.instanceof(Token);
		expect(String(signed)).to.equal(signed.value);
		expect(signed.length).to.equal(Token.DEFAULT_LENGTH);
		expect(JSON.stringify(signed)).to.equal(`"${signed}"`);

		expect(signed.verify()).to.equal(true);

		next();
	});

	it('creates verifiable tokens with different length', (next) => {
		const signed = Token.create(7);

		expect(signed).to.be.instanceof(Token);
		expect(String(signed)).to.equal(signed.value);
		expect(signed.length).to.equal(7);
		expect(JSON.stringify(signed)).to.equal(`"${signed}"`);

		expect(signed.verify()).to.equal(true);

		expect(() => Token.create(0)).to.throw(
			Error,
			'Cannot create without length'
		);
		expect(() => Token.create(-1)).to.throw(
			Error,
			'Cannot create without length'
		);

		next();
	});

	it('creates verifiable tokens from string input', (next) => {
		const one = Token.fromString('foo');
		const two = Token.fromString('foo');

		expect(one).to.be.instanceof(Token);
		expect(two).to.be.instanceof(Token);
		expect(String(one)).to.equal(String(two));
		expect(JSON.stringify(one)).to.equal(`"${one}"`);
		expect(JSON.stringify(two)).to.equal(`"${two}"`);

		next();
	});

	it('refuses to create from empty value', (next) => {
		expect(() => Token.fromString('')).to.throw(
			Error,
			'Cannot create token from empty value'
		);

		expect(() => Token.fromString(0)).not.to.throw();
		expect(() => Token.fromString(false)).not.to.throw();
		expect(() => Token.fromString(null)).not.to.throw();

		expect(() => Token.fromString('foo', 0)).to.throw(
			Error,
			'Cannot create without length'
		);
		expect(() => Token.fromString('foo', -1)).to.throw(
			Error,
			'Cannot create without length'
		);

		next();
	});

	it('refuses to create from string but without length', (next) => {
		expect(() => Token.fromString('foo', 0)).to.throw(
			Error,
			'Cannot create without length'
		);
		expect(() => Token.fromString('foo', -1)).to.throw(
			Error,
			'Cannot create without length'
		);

		next();
	});

	it('refuses to create without length', (next) => {
		expect(() => Token.fromString('')).to.throw(
			Error,
			'Cannot create token from empty value'
		);

		expect(() => Token.fromString(0)).not.to.throw();
		expect(() => Token.fromString(false)).not.to.throw();
		expect(() => Token.fromString(null)).not.to.throw();

		next();
	});

	it('creates verifiable tokens of different lengths', (next) => {
		[3, 7, 11, 13, 17, 32, 64, 128, 256].forEach((length) => {
			const signed = Token.create(length);

			expect(signed).to.be.instanceof(Token);
			expect(String(signed)).to.equal(signed.value);
			expect(signed.length).to.equal(length);
			expect(String(signed).length).to.equal(length);
			expect(JSON.stringify(signed)).to.equal(`"${signed}"`);

			expect(signed.verify()).to.equal(true);
		});

		next();
	});

	it('allows the use of a custom alphabet', (next) => {
		const length = 9;
		const alphabet = new AlphabetSubset();
		const signed = Token.create(length, alphabet);
		const regex = new RegExp(`^[${alphabet.characters}]{${length}}$`);

		expect(signed).to.be.instanceof(Token);
		expect(String(signed)).to.equal(signed.value);
		expect(signed.length).to.equal(length);
		expect(String(signed).length).to.equal(length);
		expect(JSON.stringify(signed)).to.equal(`"${signed}"`);
		expect(String(signed)).to.match(regex);

		expect(signed.verify()).to.equal(true);

		next();
	});
});
