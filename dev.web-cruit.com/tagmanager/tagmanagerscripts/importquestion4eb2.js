var importQuestionDialog = null;

// jQuery ready
$(function() {
	importQuestionDialog = new WebcruitBootstrapModal("dialog-confirm", "", "");

	// expand the questions view
	$("A.confSectionLink").click(function (event) {
		var sectionId = $(this).attr("data-sectionid");
		event.preventDefault();
		toggleSection(sectionId);
	});
	
	$("input#btnCreateNewTag").click(function (event) {
		confirmRunImport();
	});

	$("input.importQuestionButton").click(function (event) {
		var cnt = $("input.importQuestionButton:checked").length;
		
		if (cnt > 1) {
			setMergeQuestionsStatus(true);
		}
		else {
			setMergeQuestionsStatus(false);
		}
	});

	// find any already imported questions and grey them out
	disabledAlreadyImportedQuestions();
});


setMergeQuestionsStatus = function(enable) {
	var isCurrentlyEnabled = $("#chkMergeQuestions").prop("disabled") == "";
	var actionRequired = enable != isCurrentlyEnabled;

	if (!actionRequired)
		return;

	if (enable) {
		$("#chkMergeQuestions").prop("disabled", "");
		$("#mergeQuestionsCaption").removeClass("disabledText");
	}
	else {
		$("#chkMergeQuestions").prop("disabled", "disabled");
		$("#mergeQuestionsCaption").addClass("disabledText");
	}
}

getAllMergedOptions = function() {
	var questionIdsToTest = [];

	$("input[type='checkbox'].importQuestionButton:checked").each(function() {
		questionIdsToTest.push($(this).val());
	});

	var opts = $(".questionOptions").filter(function (index) {
		var questionId = parseInt($(this).attr("data-questionid"));
		return questionIdsToTest.indexOf($(this).attr("data-questionid")) != -1;
	});

	var options = [];

	opts.each(function () {
		if ($(this).is("input")) {
			var addThisOption = options.indexOf($(this).val()) == -1;
			if (addThisOption)
				options.push($(this).val());
		}
		else if ($(this).is("select")) {
			$(this).find("option").each(function() {
				var addThisOption = options.indexOf($(this).val()) == -1;
				if (addThisOption)
					options.push($(this).val());
			});
		}
	});

	options.sort();
	return options;
}

toggleSection = function(sectionId) {
	var elem  = $("#questionsForSection_" + sectionId);

	elem.slideToggle("slow", function (ev) {
		var questionId = $(this).attr("data-sectionid");
		var expandIconId = $("#confSectionExpandIconFor_" + questionId);

		if ($(this).is(":visible")) {
			expandIconId.removeClass("fa-plus-square").addClass("fa-minus-square");
		}
		else {
			expandIconId.removeClass("fa-minus-square").addClass("fa-plus-square");
		}
			
	})
}


disabledAlreadyImportedQuestions = function() {
	var elems = $(".questionContainer[data-isimported='true']");
	elems.addClass("alreadyImported");

	var inputs = elems.find("input, select");
	inputs.attr("disabled", "disabled");

	var importStatusElems = elems.find(".questionImportStatus");
	importStatusElems.css("display", "block");
}


confirmRunImport = function() {
	var selectedQuestionIds = [];
	var parentSelectedQuestionIds = [];

	// get any selected questions and push them onto an array
	$("input[type='checkbox'].importQuestionButton:checked").each(function() {
		selectedQuestionIds.push($(this).val());
		parentSelectedQuestionIds.push($(this).val());
		// get any id's for sub-questions from selected parents
		var subQuestionElements = $("input[name='ImportQuestionAsTag_" + $(this).val() + "'][type='hidden'].importQuestionButton");

		$(subQuestionElements).each(function() {
			selectedQuestionIds.push($(this).val());
		});
	});

	var mergeTags = $("#chkMergeQuestions").is(":checked") && selectedQuestionIds.length > 1; // no point merging one tag

	if (selectedQuestionIds.length > 0)
	{
		var fnOk = function() { 
			$("#selectedQuestionIdList").val(parentSelectedQuestionIds.join(","));
			runQuestionImportWizard(selectedQuestionIds, existingTagFieldNames, mergeTags);
		}; 

		importQuestionDialog.setTitle("Create a new tag?");
		importQuestionDialog.setBodyHtml("<p>Are you sure you want to create a new tag from the selected question(s)?</p>");
		importQuestionDialog.setOkCallback(fnOk);
		importQuestionDialog.show();
	}
	else
	{
		importQuestionDialog.setTitle("No questions selected for import!");
		importQuestionDialog.setBodyHtml("<p>No questions selected for import.</p>");
		importQuestionDialog.setOkCallback(null);
		importQuestionDialog.show();
	}
}

keyPressInWizard = function(event) {
	var keyStrokes = {
		returnKey: 13,
		escapeKey: 120 
	};

	var key = ('charCode' in event) ? event.charCode : event.keyCode;
	
	if (key == keyStrokes.returnKey && !event.shiftKey) {
		var nextBtn = $("#wizard > .actionBar > a.buttonNext");
		var isDisabled = nextBtn.prop("disabled") == "disabled";

		if (isDisabled)
			nextBtn =  $("#wizard > .actionBar > a.buttonFinish");

		nextBtn.trigger("click");
	}
	else if (key == keyStrokes.returnKey && event.shiftKey) 
		$("#wizard > .actionBar > a.buttonPrevious").trigger("click");
	else if (key == keyStrokes.escapeKey && event.shiftKey)
		$("#wizard > .actionBar > a.buttonCancel").trigger("click");
}

generateWizardHtmlForMultipleTagImport = function(selectedQuestionIds) {

	var wizardStepHtml = "";
	var wizardContentsHtml = "";
	var wizardFinishHtml = "";
	var questionsText = selectedQuestionIds.length == 1 ? "question" : "questions"; 

	var buildContentHtml = [];
	var buildStepHtml = [];

	for (var i = 0; i < selectedQuestionIds.length; i++)
	{
		var questionId = selectedQuestionIds[i];
		var questionTitle = $("#questionTitleCaptionFor_" + questionId).html();
		var questionText =  $("#questionTextContentFor_" + questionId).html();
		var stepId = (i + 1);

		buildStepHtml.push("<li>");
		buildStepHtml.push("<a id=\"wizardstepfor_" + stepId + "\" data-questionid=\"" + questionId + "\" href=\"#step-" + stepId + "\">");
		buildStepHtml.push("<span data-questionid=\"" + questionId + "\" class=\"stepDesc\">");
		buildStepHtml.push($("#questionTitleCaptionFor_" + questionId).html() + "<br />");
		buildStepHtml.push("<small>" + questionTitle  + "</small>");
		buildStepHtml.push("</span>");
		buildStepHtml.push("</a>");
		buildStepHtml.push("</li>");

		buildContentHtml.push("<div id=\"step-" + stepId + "\">");
		buildContentHtml.push("<h2 class=\"StepTitle\">Enter a tag name for the imported '" + questionTitle + "'</h2>");
		buildContentHtml.push("<p>Please choose a name for the tag to be linked to the question:</p><p><b>'" + questionText + "'</b></p>");
		buildContentHtml.push("<input type=\"text\" data-questionid=\"" + questionId + "\" data-importquestionstep_" + stepId + "=\"" + questionId + "\" id=\"txtNewTagNameForQuestion" + questionId + "\" size=\"80\" maxlength=\"80\" onKeyPress=\"keyPressInWizard(event);\">");
		buildContentHtml.push("<div id=\"importQuestionForStep_" + stepId + "\" class=\"redp\"></div>");
		buildContentHtml.push("</div>");

		wizardFinishHtml += "<li><strong>" + questionTitle + ":</strong> " + questionText + "</li>";
	}

	var lastStepId = stepId + 1;

	buildStepHtml.push("<li>");
	buildStepHtml.push("<a id=\"wizardstepfor_" + lastStepId + "\" href=\"#step-" + lastStepId + "\">");
	buildStepHtml.push("<span class=\"stepDesc\">");
	buildStepHtml.push("Confirm import");
	buildStepHtml.push("</span>");
	buildStepHtml.push("</a>");
	buildStepHtml.push("</li>");

	buildContentHtml.push("<div id=\"step-" + lastStepId + "\">");
	buildContentHtml.push("<h2 class=\"StepTitle\">Complete application form question import</h2>");
	buildContentHtml.push("<p>Click on <strong>'Finish'</strong> to complete the import, or click <strong>'Previous'</strong> to edit tag names before importing.</p>");
	buildContentHtml.push("<p>You cannot edit tag names once they are imported, but you can de-activate tags and re-import them.</p>");
	buildContentHtml.push("<p>Click <strong>'Cancel'</strong> if you do not wish to import the " + questionsText + ".</p>");
	buildContentHtml.push("<p>The questions you are about to import are: </p>");
	buildContentHtml.push("<ul>");
	buildContentHtml.push(wizardFinishHtml);
	buildContentHtml.push("</ul>");
	buildContentHtml.push("</div>");

	return {
		stepHtml: buildStepHtml.join(""),
		contentHtml: buildContentHtml.join("")
	};
}

generateWizardHtmlForMergedImport = function(selectedQuestionIds, usesCandidateTagging, usesAppFormSolr) {
	var i = 0;
	var buildStepHtml = [];

	buildStepHtml = createStepHtmlForMergedImport(buildStepHtml, "Import and merge multiple questions");
	buildStepHtml = createStepHtmlForMergedImport(buildStepHtml, "Enter a tag name for the imported questions");

	if (usesCandidateTagging) {
		buildStepHtml = createStepHtmlForMergedImport(buildStepHtml, "Choose how to display the imported questions");	
	}
	
	buildStepHtml = createStepHtmlForMergedImport(buildStepHtml, "Confirmation");

	var stepId = 1;
	var buildContentHtml = [];
	buildContentHtml.push("<div id=\"step-" + stepId + "\">");
	buildContentHtml.push("<h2 class=\"StepTitle\">Merge multiple questions into a single tag</h2>");
	buildContentHtml.push("<div id=\"mergeAllOptionsWizard\">");
	buildContentHtml.push("<p>You have chosen to merge the following questions into one tag:</p>");
	buildContentHtml.push("<ul>");
	for (i = 0; i < selectedQuestionIds.length; i++) {
		var questionId = selectedQuestionIds[i];
		var questionTitle = $("#questionTitleCaptionFor_" + questionId).html();
		var questionText = $("#questionTextContentFor_" + questionId).html();
		buildContentHtml.push("<li>" + questionTitle + "</li>");
	}
	buildContentHtml.push("</ul>");
	buildContentHtml.push("<p>The following options will be used to create a single tag:</p>")
	buildContentHtml.push("<ul>");

	var mergedOptions = getAllMergedOptions();

	for (i = 0; i < mergedOptions.length; i++) {
		buildContentHtml.push("<li>" + mergedOptions[i] + "</li>");
	}

	buildContentHtml.push("</ul>")
	buildContentHtml.push("</div>");
	buildContentHtml.push("</div>");

	stepId++;
	var mergeId = selectedQuestionIds.join(".");
	buildContentHtml.push("<div id=\"step-" + stepId + "\">");
	buildContentHtml.push("<h2 class=\"StepTitle\">Enter a tag name for the imported questions.</h2>");
	buildContentHtml.push("<p>Please choose a name for the tag to be linked to the question:</p>");
	buildContentHtml.push("<input type=\"text\" data-questionid=\"" + mergeId + "\" data-importquestionstep_" + stepId + "=\"" + mergeId + "\" id=\"txtNewTagNameForQuestion" + mergeId + "\" size=\"80\" maxlength=\"80\" onKeyPress=\"keyPressInWizard(event);\">");
	buildContentHtml.push("<div id=\"importQuestionForStep_" + stepId + "\" class=\"redp\"></div>");
	buildContentHtml.push("</div>");

	if (usesCandidateTagging) {
		stepId++;
		buildContentHtml.push("<div id=\"step-" + stepId + "\">");
		buildContentHtml.push("<h2 class=\"StepTitle\">Single drop-down or multiple choice?</h2>");
		buildContentHtml.push("<p>Do you want this tag to be imported as:</p>");
		buildContentHtml.push("<table border=\"0\">");
		buildContentHtml.push("<tr valign=\"top\">");
		buildContentHtml.push("<td>A single drop down</td>");
		buildContentHtml.push("<td><select id=\"exampleDropDown\"><option value=\"1\">Option 1</option><option value=\"2\">Option 2</option><option value=\"3\">Option 3</option></select></td>");
		buildContentHtml.push("</tr>");
		buildContentHtml.push("<tr height=\"10\"><td colspan=\"2\"></td></tr>");
		buildContentHtml.push("<tr valign=\"top\">");
		buildContentHtml.push("<td>or as a multiple select </td>");
		buildContentHtml.push("<td><select id=\"exampleDropDown\" multiple=\"multiple\"><option value=\"1\">Option 1</option><option value=\"2\">Option 2</option><option value=\"3\">Option 3</option></select></td>");
		buildContentHtml.push("</tr>");
		buildContentHtml.push("</table>");
		buildContentHtml.push("<p><input type=\"radio\" name=\"radInputType\" value=\"dropdown\" checked=\"checked\"> Single drop down</p>");
		buildContentHtml.push("<p><input type=\"radio\" name=\"radInputType\" value=\"multiselect\"> Multiple select drop down</p>");
		buildContentHtml.push("<div id=\"importQuestionForStep_" + stepId + "\" class=\"redp\"></div>");
		buildContentHtml.push("</div>");
	}

	stepId++;
	buildContentHtml.push("<div id=\"step-" + stepId + "\">");
	buildContentHtml.push("<h2 class=\"StepTitle\">Complete import of merged questions into a single tag</h2>");
	buildContentHtml.push("<p>Click on <strong>'Finish'</strong> to complete the import, or click <strong>'Previous'</strong> to edit tag names before importing.</p>");
	buildContentHtml.push("<p>You cannot edit tag names once they are imported, but you can de-activate tags and re-import them.</p>");
	buildContentHtml.push("<p>Click <strong>'Cancel'</strong> if you do not wish to import the merged tag.</p>");
	buildContentHtml.push("</div>");

	return {
		stepHtml: buildStepHtml.join(""),
		contentHtml: buildContentHtml.join("")
	};
}

createStepHtmlForMergedImport = function(stepHtmlArray, caption) {

	var newStepId = stepHtmlArray.length + 1;
	stepHtmlArray.push("<li><a id=\"wizardstepfor_" + newStepId + "\" href=\"#step-" + newStepId + "\"><span class=\"stepDesc\">" + caption + "</span></a></li>");
	return stepHtmlArray;
}

runQuestionImportWizard = function(selectedQuestionIds, existingTagFieldNames, mergeTags) {
	// don't do anything if no questions selected
	if (selectedQuestionIds.length == 0)
		return;

	// find out if appformsolr is enabled, or talent pond, or both
	var isUsingCandidateTagging = $.trim($("#IsUsingCandidateTagging").val()).toLowerCase() == "yes";
	var isUsingAppFormSolr = $.trim($("#IsUsingAppFormSolr").val()).toLowerCase() == "yes";

	// we need to dynamically generate html for the wizard here
	var i = 0;
	var wizardStepHtml = "";
	var wizardContentsHtml = "";
	var wizardFinishHtml = "";
	var questionsText = selectedQuestionIds.length > 0 ? "questions" : "question";

	var generatedHtml = mergeTags ? generateWizardHtmlForMergedImport(selectedQuestionIds, isUsingCandidateTagging, isUsingAppFormSolr) : generateWizardHtmlForMultipleTagImport(selectedQuestionIds);

	wizardStepHtml = generatedHtml.stepHtml;
	wizardContentsHtml = generatedHtml.contentHtml;
	wizardStepHtml = "<ul>" + wizardStepHtml + "</ul>";

	var allWizardHtml = wizardStepHtml + wizardContentsHtml;
	$("#wizard").html(allWizardHtml);
	$("div[id^='wizard']").css("display", "block");

	// http://techlaboratory.net/smartwizard/documentation and https://github.com/mstratman/jQuery-Smart-Wizard
	$('#wizard').smartWizard({
		transitionEffect: 'fade',
		includeCancelButton: true,
		onShowStep: function (stepInfo) {
			$("input[id^='txtNewTagNameForQuestion']").first().focus();
		},
		onLeaveStep: function (stepInfo) {
			var currentStep = stepInfo.attr("rel");
			var errorElems = $("#importQuestionForStep_" + currentStep).length;

			if (errorElems == 0)
				return true;

			var errs = [];
			$("#importQuestionForStep_" + currentStep).html("");
			var newTagNameElem = $("#wizard input[data-importquestionstep_" + currentStep + "]");
			var newTagName = $.trim(newTagNameElem.val());
			var questionId = $("#wizard input[data-importquestionstep_" + currentStep + "]").attr("data-questionid");

			var newTagNameValidationPattern = /^([A-Za-z0-9]|\s)+$/;
			var tagNameIsUnique = (existingTagFieldNames.indexOf($.trim(newTagName).toLowerCase()) == -1) ;
			
			if (!tagNameIsUnique)
				errs.push("A tag called '<span style='text-transform:capitalize; font-weight: bold;'>" + newTagName.toLowerCase() + "</span>' already exists, please choose another name.");

			if (!newTagNameValidationPattern.test(newTagName) && newTagNameElem.length > 0) {
				errs.push("You must only use alphabetical and numerical characters for your new tag name.");
			}

			if (!newTagName && newTagNameElem.length > 0) {
				errs.push("You must enter a new name before continuing.");
			}

			if (errs.length > 0) {
				$("#importQuestionForStep_" + currentStep).html(errs.join("<br />"));
				return false;
			}
			
			return true;
		},
		onFinish: function (allStepInfo) {
			$("#wizard input[type='text'][data-questionid]").each(function (index, value) {
				var questionId = $(this).attr("data-questionid");
				var newTagName = $(this).val();
				$("#frmImportQuestionAsTag").append("<input type=\"hidden\" name=\"newTagName_" + questionId + "\" id=\"newTagName_" + questionId + "\" value=\"" + newTagName + "\">");
			});

			var inputTypeForMergedTag = mergeTags ? $("#wizard input[name='radInputType']:checked").val() : "";
			$("#frmImportQuestionAsTag").append("<input type=\"hidden\" name=\"mergedTagInputType\" id=\"mergedTagInputType\" value=\"" + $.trim(inputTypeForMergedTag) + "\">");

			//$("div[id^='wizard']").css("display", "none");
			$("#frmImportQuestionAsTag").submit();
		},
		onCancel: function (inf) {
			$("div[id^='wizard']").css("display", "none");
		}
	});
}