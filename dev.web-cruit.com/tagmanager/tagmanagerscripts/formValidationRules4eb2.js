// this plug-in has a dependency on http://jqueryvalidation.org/ - here we add some custom validation rules
jQuery.validator.addMethod("alphanumeric", function (value, element) {
	return this.optional(element) || (!/[^A-Za-z0-9\s]/.test(value)); // if any non-valid matches then we have to flag as invalid
}, "<span class='redp' style=\"float: left;\">Only alphanumeric characters are allowed.</span>");

// rule to ensure two options cannot have the same name in a hierarchy
jQuery.validator.addMethod("uniquetagoroption", function (value, element) {
	var allTagNamesAndOptions = $(".optionControl[data-optiontext], .tag[data-tagname]").map(function() {
		return $(this).attr("data-tagname") !== undefined ? $(this).attr("data-tagname") : $(this).attr("data-optiontext");
	});

	var matches = $.grep(allTagNamesAndOptions, function (name, index) {
		return $.trim(name.toLowerCase()) == $.trim(value.toLowerCase());
	});

	return matches.length == 0;
}, "<span class='redp' style=\"float: left;\">You already have either a tag or an option with the same name in this hierarchy.</span>");

// rule to ensure when adding multiple options, that they are also unique before adding them all at once
jQuery.validator.addMethod("uniquemultipleoption", function (value, element) {
	var currEl = $(element),
		addOptionContainerEl = $(element).closest("#addOptionTable"),
		allOptionTextBoxes = addOptionContainerEl.find("input[type='text'][id^='txtNewTagOptionName']");

	// if there is only one text box, then there cannot be any others to compare against, so return as validated
	if (allOptionTextBoxes.length == 1) {
		return true;
	}

	var otherValues = allOptionTextBoxes.filter(function() {
		return $(this).attr("id") != currEl.attr("id");
	}).map(function() {
		return $(this).val();
	});

	var matches = $.grep(otherValues, function (name, index) {
		return $.trim(name.toLowerCase()) == $.trim(value.toLowerCase());
	});

	return matches.length == 0;
}, "<span class='redp' style=\"float: left;\">Option is not unique</span>");

// when creating a new tag, ensure the tag is unique
jQuery.validator.addMethod("createnewtagisunique", function(value, element, params) {
	
	var alreadyExists = false;
	for (var i = 0; i < params.roottagnames.length; i++) {
		if (params.roottagnames[i].toLowerCase() == value.toLowerCase()) {
			alreadyExists = true;
			break;
		}
	}

	return !alreadyExists;
}, "<span class='redp' style=\"float: left;\">There is already a tag with the same name. Please choose another.</span>");