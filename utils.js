

function getResponseInterval(min, max) {
	return Math.random() * (max - min) + min;
}

module.exports = { getResponseInterval };
