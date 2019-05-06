(function() {
	WebcruitBootstrapModal = function(modalId, titleText, bodyHtml, okCallback) {
		this.modalId = modalId;
		this.modalTitle = titleText;
		this.modalBody = bodyHtml;
		this.modalHtml = "";
		this.modalEl = null;

		init.call(this);

		if (okCallback !== undefined) {
			initOkCallback.call(this, okCallback);	
		}
	};	

	var init = function() {
		// check to see if jQuery is loaded and if it is not found then throw an error
		if (!window.jQuery) {
			logError("WebcruitBootstrapModal requires jQuery and it has not been detected");
			return;
		}

		// check to see if a modal with the id already exists in the DOM, if it does, remove it and create a new one
		var modalExists = $("#" + this.modalId).length > 0;
		if (modalExists) {
			$("body").find("#" + this.modalId).remove();
		}

		renderHtmlForModal.call(this);
		$("body").append($("<div />", { "class": "modal fade", "tabindex": "-1", "role": "dialog", "id": this.modalId }));
		this.modalEl = $("#" + this.modalId);
		this.modalEl.off("show.bs.modal");
		this.modalEl.append(this.modalHtml);
		this.modalEl.modal({
			show: false,
			keyboard: true,
			backdrop: true
		});
	};

	var initOkCallback = function(fn) {
		var currentModal = this;
		if (fn == null) {
			this.modalEl.find("#ok-button").off("click");
			this.modalEl.find("#ok-button").click(function() {
				currentModal.hide();
			});
			return;
		}

		if (!$.isFunction(fn)) {
			logError.call(this, "Attempted to set OK callback for '" + this.modalId + "' but it is not an anonymous function");
			return;
		}

		this.modalEl.find("#ok-button").off("click");
		this.modalEl.find("#ok-button").click(function() {
			var closeModal = fn();

			if (closeModal === undefined || (typeof closeModal === "boolean" && closeModal)) {
				currentModal.hide();	
			}
		});
	};

	var logError = function(errorMessage) {
		console.log("WebcruitBootstrapModal error: " + errorMessage);
	};

	var renderHtmlForModal = function() {
		this.modalHtml = generateModalHtml.call(this);
	};

	var generateModalHtml = function() {
		var content = [
			" <div class=\"modal-dialog modal-lg webcruit-bootstrap-modal\" role=\"document\">",
			"   <div class=\"modal-content\">",
			"     <div class=\"modal-header\">",
			"       <h4 class=\"modal-title\" id=\"action-dialog-title\">" + this.modalTitle + "</h4>",
			"     </div>",
			"     <div class=\"modal-body\">",
			"       " + this.modalBody,
			"		<div id=\"errorLabel\" class=\"redp\"></div>",
			"     </div>",
			"     <div class=\"modal-footer\">",
			"       <button type=\"button\" id=\"ok-button\" class=\"btn btn-primary\">Ok</button>",
			"       <button type=\"button\" id=\"cancel-button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>",
			"     </div>",
			"   </div>",
			" </div>"
		];
		return content.join("");
	};

	WebcruitBootstrapModal.prototype.getTitle = function() {
		return this.modalTitle;
	};

	WebcruitBootstrapModal.prototype.getBodyHtml = function() {
		return this.modalHtml;
	};

	WebcruitBootstrapModal.prototype.setTitle = function(title) {
		this.modalTitle = title;
		this.modalEl.find(".modal-title").html(this.modalTitle);
	};

	WebcruitBootstrapModal.prototype.setBodyHtml = function(bodyHtml) {
		this.bodyHtml = bodyHtml;
		this.modalEl.find(".modal-body").html(this.bodyHtml);
	};

	WebcruitBootstrapModal.prototype.setOkCallback = function(fn) {
		initOkCallback.call(this, fn);
	};

	WebcruitBootstrapModal.prototype.disableOkButton = function() {
		this.modalEl.find("#ok-button").prop("disabled", true);
	};

	WebcruitBootstrapModal.prototype.enableOkButton = function() {
		this.modalEl.find("#ok-button").removeAttr("disabled");
	};

	WebcruitBootstrapModal.prototype.hideOkButton = function() {
		this.modalEl.find("#ok-button").hide();
	};

	WebcruitBootstrapModal.prototype.hideCancelButton = function() {
		this.modalEl.find("#cancel-button").hide();
	};

	WebcruitBootstrapModal.prototype.hideAllButtons = function() {
		this.modalEl.find("[type='button']").hide();
	};

	WebcruitBootstrapModal.prototype.show = function(onOpenCallback) {

		if ($.isFunction(onOpenCallback)) {
			this.modalEl.on("shown.bs.modal", function() {
				onOpenCallback();
			});	
		}
	
		this.modalEl.modal("show");
	};

	WebcruitBootstrapModal.prototype.hide = function() {
		this.modalEl.modal("hide");
	};
}());