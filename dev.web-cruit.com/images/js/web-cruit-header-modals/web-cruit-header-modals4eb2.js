jQuery.validator.addMethod("applicantsearchbyname", function(value, element, params) {
	var el = $(element);
	var otherEl = $("#" + params);
	
	var thisVal = $.trim(el.val());
	var otherVal = $.trim(otherEl.val());

	return thisVal.length > 1 || otherVal.length > 1;

}, "<p>Either Firstname or Surname must be entered with at least 2 characters.</p>");

$(function() {
	var candidateSearchInProgressModal = new WebcruitBootstrapModal("candidateSearchInProgressModal", "Search in Progress", generateHtmlForWaitDialog());
	var vacancySearchInProgressModal = new WebcruitBootstrapModal("vacancySearchInProgressModal", "Search in Progress", generateHtmlForWaitDialog());
	candidateSearchInProgressModal.hideOkButton();
	candidateSearchInProgressModal.hideCancelButton();
	vacancySearchInProgressModal.hideOkButton();
	vacancySearchInProgressModal.hideCancelButton();

	function generateHtmlForWaitDialog() {
		var html = [
			"<div id=\"timerContainer\" style=\"margin-left: 25%; margin-right: 25%; width: 50%;\">",
  			"<img id=\"pleaseWaitTimer\" src=\"/images/web-cruit-timer.gif\" style=\"vertical-align: middle;\">",
  			"<span id=\"waitMsg\" style=\"padding-left: 10px;\">Please wait whilst the search is in progress...</span>",
			"</div>"
		];

		return html.join("");
	}

	$("#searchByIDModal").click(function() {
		var okCallback = function() {
			var frm = $("#modalsearchForm");

			if (!frm.valid()) {
				return false;
			}

			frm.submit();
			candidateSearchInProgressModal.show();
			return true;
		};

		var searchByIdModalDialog = new WebcruitBootstrapModal("searchByIdModalDialog", "Search by Applicant ID", generateHtmlForSearchByIDDialog(), okCallback);
		

		var openCallback = function() {
			searchByIdModalDialog.modalEl.find("#txtApplicantId").focus();
			var frm = searchByIdModalDialog.modalEl.find("#modalsearchForm");

			$(frm).validate({
				rules: {
					txtApplicantId: {
						required: true,
						digits: true,
						maxlength: 15
					}
				},
				messages: {
					txtApplicantId: {
						required: "<p>Applicant ID is required.",
						digits: "<p>Applicant ID can only contain numbers.",
						maxlength: "<p>Applicant ID cannot be more than 15 characters."
					}
				}
			});
		};

		searchByIdModalDialog.show(openCallback);
	});
		
	function generateHtmlForSearchByIDDialog() {
		var html = [
			
			"<form action=\"" + protocolRelativeBaseUrl + "candidate_search_service.cfm?newSearch=true\" id=\"modalsearchForm\" method=\"POST\" class=\"form-horizontal\">",	
			"	<input type=\"hidden\" name=\"newSearch\" value=\"true\">",	
			"	<input type=\"hidden\" name=\"TopCompanyId\" id=\"TopCompanyId\" value=\" " + topCompanyID + " \">",
			"	<input type=\"hidden\" name=\"CompUserId\" id=\"CompUserId\" value=\" " + compUserID + " \">",
			"	<input type=\"hidden\" name=\"radAccount\" value=\"ALL\">",
			"   <input type=\"text\" style=\"display: none;\">",
			"   <div class=\"panel-group\">",
			"		<div class=\"panel panel-info\">",
			"			<div class=\"panel-body\">",
			"				<div class=\"form-group\">",
			"					<label class=\"control-label col-md-4\" for=\"ApplicantID\">Applicant ID</label>",
			"					<div class=\"col-sm-6\"><input type=\"text\" class=\"form-control\" name=\"txtApplicantId\" id=\"txtApplicantId\" size=\"30\" value=\"\"></div>",
			"				</div>",
			"			</div>",
			"		</div>",
			"	</div>",		
			"</form> "
		];

		return html.join("");
	}
	
	$("#searchByEmailModal").click(function() {
		var okCallback = function() {
			var frm = $("#modalsearchByEmailForm");
			var isValid = frm.valid();

			if (!isValid) {
				return false;
			}

			frm.submit();
			candidateSearchInProgressModal.show();
			return true;
		};
		
		var searchByEmailModalDialog = new WebcruitBootstrapModal("searchByEmailModalDialog", "Search by e-mail address", generateHtmlForSearchByEmailDialog(), okCallback);
		
		var openCallback = function() {
			searchByEmailModalDialog.modalEl.find("#txtEmailAddress").focus();
			var frm = searchByEmailModalDialog.modalEl.find("#modalsearchByEmailForm");
			
			$(frm).validate({
				rules: {
					txtEmailAddress: {
						required: true,
						email: true
					}
				},
				messages: {
					txtEmailAddress: {
						required: "<p>Email address is required.</p>",
						email: "<p>Email address is not valid.</p>"
					}
				}
			});
		};

		searchByEmailModalDialog.show(openCallback);
	});
	
	function generateHtmlForSearchByEmailDialog() {
		var html = [
			
			"<form action=\"" + protocolRelativeBaseUrl + "candidate_search_service.cfm?newSearch=true\" id=\"modalsearchByEmailForm\" method=\"POST\" class=\"form-horizontal\">",		
			"	<input type=\"hidden\" name=\"newSearch\" value=\"true\">",
			"	<input type=\"hidden\" name=\"TopCompanyId\" id=\"TopCompanyId\" value=\" " + topCompanyID + " \">",
			"	<input type=\"hidden\" name=\"CompUserId\" id=\"CompUserId\" value=\" " + compUserID + " \">",
			"	<input type=\"hidden\" name=\"radAccount\" value=\"ALL\">",
			"	<input type=\"hidden\" name=\"radExactMatchFor_txtEmailAddress\" value=\"EXACT\">",
			"	<input type=\"hidden\" name=\"radVacancyStatus\" value=\"\">",
			"	<input type=\"hidden\" name=\"selAgencySource\" value=\"All\">",
			"	<input type=\"hidden\" name=\"selApplicationDirectOrAgency\" value=\"0\">",
			"	<input type=\"hidden\" name=\"selApplicationSource\" value=\"0\">",
			"	<input type=\"hidden\" name=\"selApplicationStatus\" value=\"0\">",
			"	<input type=\"hidden\" name=\"selCountry\" value=\"0\">",
			"	<input type=\"hidden\" name=\"selVacancies\" value=\"0\">",
			"	<input type=\"hidden\" name=\"txtAppliedFromDt\" value=\"\">",
			"   <input type=\"text\" style=\"display: none;\">",
			"   <div class=\"panel-group\">",
			"		<div class=\"panel panel-info\">",
			"			<div class=\"panel-body\">",
			"				<div class=\"form-group\">",
			"					<label class=\"control-label col-md-4\" for=\"txtEmailAddress\">Email Address</label>",
			"					<div class=\"col-sm-6\"><input type=\"text\" class=\"form-control\" name=\"txtEmailAddress\" id=\"txtEmailAddress\" size=\"30\" value=\"\"></div>",
			"				</div>",
			"			</div>",
			"		</div>",
			"	</div>",		
			"</form> "
		];

		return html.join("");
	}
	
	$("#searchByNameModal").click(function() {
		var okCallback = function() {
			var frm = $("#modalsearchByNameForm");
			var isValid = frm.valid();

			if (!isValid) {
				return false;
			}

			frm.submit();
			candidateSearchInProgressModal.show();
			return true;
		};

		var searchByNameModalDialog = new WebcruitBootstrapModal("searchByNameModalDialog", "Search by name", generateHtmlForSearchByNameDialog(), okCallback);

		var openCallback = function() {
			searchByNameModalDialog.modalEl.find("#txtApplicantForename").focus();
			var frm = searchByNameModalDialog.modalEl.find("#modalsearchByNameForm");

			$(frm).validate({
				errorLabelContainer: "#messageBox",
				rules: {
					txtApplicantForename: {
						applicantsearchbyname: "txtApplicantSurname"
					}
				}
			});
		};

		searchByNameModalDialog.show(openCallback);
	});
	
		
	function generateHtmlForSearchByNameDialog() {
		var html = [
			
			"<form action=\"" + protocolRelativeBaseUrl + "candidate_search_service.cfm?newSearch=true\" id=\"modalsearchByNameForm\" method=\"POST\" class=\"form-horizontal\">",		
			"	<input type=\"hidden\" name=\"newSearch\" value=\"true\">",
			"	<input type=\"hidden\" name=\"TopCompanyId\" id=\"TopCompanyId\" value=\" " + topCompanyID + " \">",
			"	<input type=\"hidden\" name=\"CompUserId\" id=\"CompUserId\" value=\" " + compUserID + " \">",
			"	<input type=\"hidden\" name=\"radAccount\" value=\"ALL\">",
			"	<input type=\"hidden\" name=\"radExactMatchFor_txtApplicantForename\" value=\"EXACT\">",
			"	<input type=\"hidden\" name=\"radExactMatchFor_txtApplicantSurname\" value=\"EXACT\">",
			"	<input type=\"hidden\" name=\"radVacancyStatus\" value=\"\">",
			"	<input type=\"hidden\" name=\"selAgencySource\" value=\"All\">",
			"	<input type=\"hidden\" name=\"selApplicationDirectOrAgency\" value=\"0\">",
			"	<input type=\"hidden\" name=\"selApplicationSource\" value=\"0\">",
			"	<input type=\"hidden\" name=\"selApplicationStatus\" value=\"0\">",
			"	<input type=\"hidden\" name=\"selCountry\" value=\"0\">",
			"	<input type=\"hidden\" name=\"selVacancies\" value=\"0\">",
			"	<input type=\"hidden\" name=\"txtAppliedFromDt\" value=\"\">",
			"   <div class=\"panel-group\">",
			"		<div class=\"panel panel-info\">",
			"			<div class=\"panel-body\">",
			"				<div class=\"form-group\">",
			"					<label class=\"control-label col-md-2\" for=\"txtApplicantForename\">First Name</label>",
			"					<div class=\"col-md-10\"><input type=\"text\" class=\"form-control\" name=\"txtApplicantForename\" id=\"txtApplicantForename\" size=\"30\" value=\"\"></div>",
			"				</div>",
			"				<div class=\"form-group\">",
			"					<label class=\"control-label col-md-2\" for=\"txtApplicantSurname\">Surname</label>",
			"					<div class=\"col-md-10\"><input type=\"text\" class=\"form-control\" name=\"txtApplicantSurname\" id=\"txtApplicantSurname\" size=\"30\" value=\"\"></div>",
			"				</div>",
			"				<span id=\"messageBox\"></span>",
			"			</div>",
			"		</div>",
			"	</div>",	
			"</form> "
		];

		return html.join("");
	}
});