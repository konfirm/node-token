/* global source*/

const Alphabet = require('@konfirm/alphabet');

class AlphabetSubset extends Alphabet {
	static get CHARACTERS() {
		return 'aeiouyAEIOUY01';
	}

	static get MAX_CHECKDIGIT_INDEX() {
		return 5;
	}
}

module.exports = AlphabetSubset;
