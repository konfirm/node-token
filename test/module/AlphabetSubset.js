/* global source*/

const Alphabet = require('@konfirm/alphabet');

class AlphabetSubset extends Alphabet {
	constructor(source = 'aeiouyAEIOUY01') {
		super(source);
	}
}

module.exports = AlphabetSubset;
