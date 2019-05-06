(function($) {

	$.fn.responsivePagination = function(options) {
		
		var defaults = {
			lastPage: 25,
			currentPage: 1,
			baseHref: "",
			mobileElement: null,
			desktopTruncateWhenMaxPagesAreMoreThan: 10,
			urlParameter: "gotopage",
			staticUrlParameters: {},
			incrementEachPageBy: 1
		};

		var config = {
			truncatePagesVisibleAtEnds: 3,
			truncatePagesVisibleEitherSide: 2,
			visibleWhenTruncated: []
		};

		var settings = $.extend({}, defaults, options);
		var obj = null;

		$(window).resize(function () {
			toggleResponsiveClass();
		});

		return this.each(function() {
			obj = $(this);

			toggleResponsiveClass();
			buildPaginationControls();			
			toggleResponsiveClass();
		});

		function isMobileView() {
			return settings.mobileElement.css("display") == "block";
		}

		function toggleResponsiveClass() {
			var desktopTuncateAnyway = !isMobileView() && (settings.lastPage > settings.desktopTruncateWhenMaxPagesAreMoreThan);
			
			if (isMobileView()) {
				obj.removeClass("pagination-lg");
				obj.removeClass("pull-right");
			}
			else {
				obj.addClass("pagination-lg");
				obj.addClass("pull-right");
			}

			if (desktopTuncateAnyway) {
				truncate();
				return;
			}

			if (!isMobileView()) {
				unTruncate();
			}
			else {
				truncate();
			}
		}

		function buildPaginationControls() {
			// if there is only 1 page then hide the paginator
			if (settings.lastPage == 1) {
				obj.hide();
				return;
			}

			var pageCounter = 1;

			for (var i = 1; i <= settings.lastPage; i++) {
				var listEl = $("<li>", { "class": settings.currentPage == i ? "active" : null });
				var linkEl = $("<a>", { href: settings.currentPage == i ? "#" : buildHref(pageCounter), text: i });
				listEl.append(linkEl);
				obj.append(listEl);
				pageCounter += settings.incrementEachPageBy;
			}
		}

		function addFirstPaginatonControl() {
			var spanEl = $("<span>", { "class": "fa fa-angle-double-left" });
			var linkEl = $("<a>", { href: buildHref(1) }).wrapInner(spanEl);
			var listEl = $("<li>").wrapInner(linkEl);
			obj.prepend(listEl);
		}

		function addLastPaginationControl() {
			var spanEl = $("<span>", { "class": "fa fa-angle-double-right" });
			var linkEl = $("<a>", { href: buildHref(settings.lastPage) }).wrapInner(spanEl);
			var listEl = $("<li>").wrapInner(linkEl);
			obj.append(listEl);
		}

		function buildHref(index) {
			return settings.baseHref + "?" +  buildQueryString(settings.urlParameter, index);
		}

		function buildQueryString(goToPageQueryParamName, goToPageValue) {
			var rawQueryString = $(location)[0].search.replace(/^\?/g, ""); // strip the question mark
			var queryStringParts = rawQueryString.split('&');

			var obj = {};

			$.each(queryStringParts, function (index, element) {
				var parts = element.split('=');
				var queryParameterName = parts[0];
				var queryParameterValue = parts[1];

				if (queryParameterName == goToPageQueryParamName) {
					queryParameterValue = goToPageValue;
				}

				if (queryParameterName.length) {
					obj[queryParameterName] = queryParameterValue;	
				}
			});

			if (obj[goToPageQueryParamName] === undefined) {
				obj[goToPageQueryParamName] = goToPageValue;
			}

			if (settings.staticUrlParameters !== undefined || settings.staticUrlParameters != null) {
				for (p in settings.staticUrlParameters) {
					obj[p] = settings.staticUrlParameters[p];
				}
			}

			return $.param(obj);
		}

		function truncate() {
			resolveTruncatedVisibleItems(1, config.truncatePagesVisibleAtEnds);
			resolveTruncatedVisibleItems(settings.currentPage, config.truncatePagesVisibleEitherSide);
			resolveTruncatedVisibleItems(settings.lastPage, config.truncatePagesVisibleAtEnds);	
			addTruncationAttributeToListItems();
			addAbbreviatedListItems();
			hideItemsOnTruncating();
		}

		function unTruncate() {
			removeAbbreviatedListItems();
			showRestOfPages();
		}

		function resolveTruncatedVisibleItems(referencePage, offSetBy) {
			var rangeStart = 0;
			var rangeEnd = 0;

			if (referencePage == 1) {
				rangeStart = 1;
				rangeEnd = rangeStart + (offSetBy - 1);
			}
			else if (referencePage == settings.lastPage) {
				rangeStart = (settings.lastPage - offSetBy) + 1;
				rangeEnd = settings.lastPage;
			}
			else {
				rangeStart = referencePage - offSetBy;
				rangeEnd = referencePage + offSetBy;
			}

			for (var i = rangeStart; i <= rangeEnd; i++) {
				config.visibleWhenTruncated.push(i);
			}
		}

		function addTruncationAttributeToListItems() {
			var listItemIndexes = config.visibleWhenTruncated;
			var insertMarker = false;

			obj.find("li").each(function (index, element) {
				var page = $(this).text();

				if ($.isNumeric(page)) {
					$(this).attr("data-isnumeric", true);
					if ($.inArray(parseInt(page), listItemIndexes) != -1) {
						$(this).attr("data-showontruncate", true);
					}
				}
				else {
					$(this).attr("data-isnumeric", false);
				}
			});

			obj.find("li:first").attr("data-showontruncate", true);
			obj.find("li:last").attr("data-showontruncate", true);
			obj.find("li:not([data-showontruncate])").attr("data-showontruncate", false);
		}

		function hideItemsOnTruncating() {
			obj.find("li[data-showontruncate='false']").hide();
		}

		function addAbbreviatedListItems() {
			obj.find("li").each(function (index, element) {
				var current = $(this);
				var next = $(this).next();

				if (next.length == 0) {
					return false;
				} 

				var currentShowOnTruncate = Boolean(current.attr("data-showontruncate") == "true");
				var nextShowOnTruncate = Boolean(next.attr("data-showontruncate") == "true");
				if (currentShowOnTruncate && !nextShowOnTruncate) {
					var linkEl = $("<a>", { href: "#", text: "..." });
					var listEl = $("<li>", { "class": "disabled", "data-pageseperator": true }).wrapInner(linkEl);

					current.after(listEl);
				}

			});
		}

		function removeAbbreviatedListItems() {
			obj.find("li[data-pageseperator='true']").remove();
		}
		
		function showRestOfPages() {
			var els = obj.find("li[data-showontruncate='false']").filter(function() {
				return $(this).css("display") == "none";
			});

			els.show();
		}
	};

}(jQuery));