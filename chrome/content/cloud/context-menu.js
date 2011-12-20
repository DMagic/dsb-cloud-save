(function() {
	var pref = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefBranch);

	/* init */
	$(window).load(function(ev) {
		/* add cloud save menu item */
		var menu = $("#contentAreaContextMenu");
		if (menu.length)
			menu.bind("popupshowing", onContextMenu);

		$('#dsbCmSettings').bind('command', openSettings);
	});

	/* build context */
	var onContextMenu = function(e) {
		/* only trigger when the popup menu is the root context menu */
		if ('contentAreaContextMenu' !== e.target.getAttribute('id')) return;

		var el = document.popupNode, imgEl, linkEl;

		/* mimic Chrome OnClickData */
		var info = {
			menuItemId: null, /* The ID of the menu item that was clicked. */
			parentMenuItemId: null, /* The parent ID, if any, for the item clicked. */
			mediaType: null, /* One of 'image', 'video', or 'audio' if the context menu was activated on one of these types of elements. */
			linkUrl: null, /* If the element is a link, the URL it points to. */
			srcUrl: null, /* Will be present for elements with a 'src' URL. */
			pageUrl: null, /* The URL of the page where the menu item was clicked. */
			frameUrl: null, /* The URL of the frame of the element where the context menu was clicked, if it was in a frame. */
			selectionText: null, /* The text for the context selection, if any. */
			editable: null /* A flag indicating whether the element is editable (text input, textarea, etc.). */
		};

		/* mimic Chrome Tab */
		var tab = {
			id: null, /* The ID of the tab. Tab IDs are unique within a browser session. */
			index: null, /* The zero-based index of the tab within its window. */
			windowId: null, /* The ID of the window the tab is contained within. */
			highlighted: null, /* Whether the tab is highlighted. */
			active: null, /* Whether the tab is active in its window. */
			pinned: null, /* Whether the tab is pinned. */
			url: null, /* The URL the tab is displaying. */
			title: null, /* The title of the tab. This may not be available if the tab is loading. */
			favIconUrl: null, /* The URL of the tab's favicon. This may not be available if the tab is loading. */
			status: null, /* Either loading or complete. */
			incognito: null /* Whether the tab is in an incognito window. */
		};

		var wnd = gBrowser.contentWindow;

		info.pageUrl = wnd.location.href;

		if (el.ownerDocument.defaultView != el.ownerDocument.defaultView.top) {
			info.frameUrl = el.ownerDocument.defaultView.location.href;
		}

		info.selectedText = wnd.getSelection();

		tab.url = info.pageUrl;

		if (el instanceof Components.interfaces.nsIImageLoadingContent &&
			el.currentURI) {
			imgEl = el;
			info.srcUrl = el.currentURI.spec;
		}

		while (el) {
			if (el instanceof HTMLAnchorElement && el.href) {
				linkEl = el;
				info.linkUrl = el.href;
				break;
			}
			el = el.parentNode;
		}

		updateMenus();
/*
for (var k in info) {
	dump(k + ': ' + info[k] + '\n');
}
dump("===========\n");
for (var k in tab) {
	dump(k + ': ' + info[k] + '\n');
}
*/
		/* hide/show items based on context, inject arguments */
		$('#dsbCmContainer').find('.host').each(function() {
			var that = $(this);
			if (-1 != this.context.indexOf('image') && info.srcUrl ||
				-1 != this.context.indexOf('link') && info.linkUrl ||
				-1 != this.context.indexOf('page') && info.pageUrl ||
				-1 != this.context.indexOf('selection') && info.selectedText ||
				-1 != this.context.indexOf('all')) {
				that.unbind();
				this.command = (function() {
					return function(e) {
						var el = $(e.target);
						info.menuItemId = el.attr('id');
						/* this id is used to tell whether it's a save-as entry */
						info.parentMenuItemId = el.hasClass('save-as') ?
							'dsbCmSaveAs' : 'dsbCmContainer';
						return handle_click.apply(this, [info, tab]);
					}
				})();
				that.bind('command', this.command);
			} else {
				this.hidden = true;
			}
			/* show/hide separators between image hosting servers and generic hosting services */
			$('.image-host-sep').attr('hidden', !info.srcUrl);
		});
	}

	/* open setting panel */
	var openSettings = function() {
		window.open('chrome://downbar/content/downbarprefs.xul#cloudSaveTab', 'downbar_prefs', 'chrome');
	}
})();
