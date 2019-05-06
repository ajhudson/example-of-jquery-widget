function getObjectKeysLength(obj) {
	if (Object.keys) {
		return Object.keys(obj).length;
	} else {
		var keys = [];

		for (var k in keys) {
			if (obj.hasOwnProperty(k)) {
				keys.push(k);
			}
		}

		return keys.length;
	}
}