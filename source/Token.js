const Crypto = require('crypto');
const Alphabet = require('@konfirm/alphabet');
const Random = require('@konfirm/random');
const CheckDigit = require('./CheckDigit.js');

const storage = new WeakMap();

class Token {
	/**
	 * Token constructor
	 *
	 * @name    constructor
	 * @access  constructor
	 * @param   {String}   value
	 * @param   {Alphabet} [alphabet = Alphabet]
	 * @return  {Token}
	 */
	constructor(value, alphabet = Alphabet) {
		storage.set(this, { value, alphabet });
	}

	/**
	 * Get the default length of a token
	 *
	 * @name    DEFAULT_LENGTH
	 * @access  public static (getter)
	 * @return  {Number}  length
	 */
	static get DEFAULT_LENGTH() {
		return 21;
	}

	/**
	 * Get the token length
	 *
	 * @name    length
	 * @access  public (getter)
	 * @return  {Number}  length
	 */
	get length() {
		return this.value.length;
	}

	/**
	 * Get the token value
	 *
	 * @name    value
	 * @access  public (getter)
	 * @return  {String}  value
	 */
	get value() {
		const { value } = storage.get(this);

		return value;
	}

	/**
	 * Get the token alphabet
	 *
	 * @name    alphabet
	 * @access  public (getter)
	 * @return  {Alphabet}  alphabet
	 */
	get alphabet() {
		const { alphabet } = storage.get(this);

		return alphabet;
	}

	/**
	 * Verify the token checkDigit
	 *
	 * @name    verify
	 * @access  public
	 * @return  {Boolean}  verifies
	 */
	verify() {
		return CheckDigit.verify(this.value, this.alphabet);
	}

	/**
	 * Convert the token into a string
	 *
	 * @name    toString
	 * @access  public
	 * @return  {String}  token
	 */
	toString() {
		return this.value;
	}

	/**
	 * Ensure the Token is properly JSON-stringified
	 *
	 * @name    toJSON
	 * @access  public
	 * @return  {String}  token
	 */
	toJSON() {
		return String(this);
	}

	/**
	 * Create a new random Token
	 *
	 * @name    create
	 * @access  public static
	 * @param   {Number}   [length = Token.DEFAULT_LENGTH]
	 * @param   {Alphabet} [alphabet = Alphabet]
	 * @return  {Token}    token
	 */
	static create(length = this.DEFAULT_LENGTH, alphabet = Alphabet) {
		if (length <= 0) {
			throw new Error('Cannot create without length');
		}

		const value = alphabet
			.map(...Random.generate(alphabet.length, length - 1))
			.join('');

		return new Token(CheckDigit.create(value, alphabet), alphabet);
	}

	/**
	 * Create a new Token based on string (consistent)
	 *
	 * @name    create
	 * @access  public static
	 * @param   {String}   input
	 * @param   {Number}   [length = Token.DEFAULT_LENGTH]
	 * @param   {Alphabet} [alphabet = Alphabet]
	 * @return  {Token}    token
	 */
	static fromString(
		input,
		length = this.DEFAULT_LENGTH,
		alphabet = Alphabet
	) {
		const string = String(input);
		const min = Math.max(string.length, length) << 3;
		const chars = [];

		if (!string) {
			throw new Error('Cannot create token from empty value');
		}
		if (length <= 0) {
			throw new Error('Cannot create without length');
		}

		while (chars.length < min) {
			chars.push(
				...Crypto.createHash('sha256')
					.update(string + chars.join(''))
					.digest()
			);
		}

		const reduced = chars.reduce((carry, val, index) => {
			const pos = index % (length - 1);
			carry[pos] = (carry[pos] || 0) + val;

			return carry;
		}, []);

		return new Token(
			CheckDigit.create(alphabet.map(...reduced).join(''), alphabet),
			alphabet
		);
	}
}

module.exports = Token;
