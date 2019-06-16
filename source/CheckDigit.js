const Alphabet = require('@konfirm/alphabet');

/**
 * Calculate check digits
 *
 * @class CheckDigit
 */
class CheckDigit {
	/**
	 * Create a new check digit based on the provided value
	 *
	 * @name    create
	 * @access  public static
	 * @param   {String}    value
	 * @param   {Alphabet}  [alphabet=Alphabet]
	 * @return  {string}    check digit prefixed value
	 */
	static create(value, alphabet = Alphabet) {
		return this.calculate(value, alphabet) + value;
	}

	/**
	 * Calculate the check digit
	 *
	 * @name    calculate
	 * @access  public static
	 * @param   {String}    value
	 * @param   {Alphabet}  [alphabet=Alphabet]
	 * @result  {String}    check digit
	 */
	static calculate(value, alphabet = Alphabet) {
		const limit =
			alphabet.MAX_CHECKDIGIT_INDEX ||
			Math.min(23, Math.floor(alphabet.length * 0.9));

		return alphabet.charAt(value.replace(this) % limit);
	}

	/**
	 * Verify the check digit of the value
	 *
	 * @name    verify
	 * @access  public static
	 * @param   {String}    value
	 * @param   {Alphabet}  [alphabet=Alphabet]
	 * @return  {Boolean}   verifies
	 */
	static verify(value, alphabet = Alphabet) {
		const match = String(value).match(this);

		return (
			match !== null && match[1] === this.calculate(match[2], alphabet)
		);
	}

	/**
	 * Allow the CheckDigit class to be used as a string matcher
	 *
	 * @name    [Symbol.match]
	 * @access  public static
	 * @param   {String}  value
	 * @return  {Array}   matches
	 * @note    This method is implicitly invoked when used as String.match
	 *          argument, e.g.: 'myString'.match(CheckDigit)
	 */
	static [Symbol.match](value) {
		return value.length > 1 ? [value, value[0], value.substr(1)] : null;
	}

	/**
	 * Allow the CheckDigit class to be used as a string replacer
	 *
	 * @name    [Symbol.replace]
	 * @access  public static
	 * @param   {String}      value
	 * @param   {Function|*} [replacer]
	 * @return  {Number}     check digit
	 * @note    This method is implicitly invoked when used as String.replace
	 *          argument, e.g.: 'myString'.replace(CheckDigit)
	 * @note    If the replacer argument is provided and of type Function, it
	 *          will be invoked on every character in the value with the arguments:
	 *          - `num`    the intermediate check digit for the character)
	 *          - `char`   the original character
	 *          - `index`  the index of the character
	 *          The return value of the replacer function is always cast to Number
	 */
	static [Symbol.replace](value, replacer) {
		return value.split('').reduce((carry, char, index, all) => {
			const num = char.charCodeAt(0) * (all.length - index + 1);

			return (
				carry +
				Number(
					typeof replacer === 'function'
						? replacer(num, char, index)
						: num
				)
			);
		}, 0);
	}
}

module.exports = CheckDigit;
