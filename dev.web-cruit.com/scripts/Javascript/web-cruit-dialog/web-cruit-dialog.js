registerWebcruitDialog = function(titleText, bodyHtml) {
	var dialogHtml = [
	    '<div class="container">',              
		'<div class="modal-dialog-webcruit">',
		'	<div class="modal-dialog-webcruit-title">' + titleText + '</div>',
		'	<div class="modal-dialog-webcruit-body">',
		'		<div class="modal-dialog-webcruit-body-timer"><img src="images/web-cruit-timer.gif" /></div>',
		'		<div class="modal-dialog-webcruit-body-msg"><p>' + bodyHtml + '</p></div>',
		'	</div>',
		'</div>',
		'</div>'
	];
	
	$("#modal-dialog-webcruit").append(dialogHtml.join(''));
}

showWebcruitDialog = function() {
	$("body").append('<div id="modal-dialog-webcruit-background"></div>');
    $("div.modal-dialog-webcruit").show();
}

hideWebcruitDialog = function() {
	$("div.modal-dialog-webcruit").hide();
	$("#modal-dialog-webcruit-background").remove();
}