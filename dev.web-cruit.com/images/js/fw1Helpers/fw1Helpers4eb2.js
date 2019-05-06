function populateSelectWithData(selector, data, value, text) {
	var el = $(selector);

	if (el == null || el === undefined) {
		return;
	}

	el.empty();

	if (data.success) {
		el.append("<option value=''></option>");

		if (!data.data.length) {
			return;
		}

		for (var i = 0; i < data.data.length; i++) {
			var val = data.data[i][value];
			var txt = data.data[i][text];
			el.append("<option value='" + val + "'>" + txt + "</option>");
		}
	}
	else {
		el.append("<option value=''>ERROR: " + data.errmsg  + "</option>");
	}
}