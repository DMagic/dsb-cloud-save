/* provide cloud save functionality to other modules */
if ('undefined' === typeof DsbCSProvider) {
	var DsbCSProvider = function(args) {
		this.hostContainer = document.getElementById(args.hostContainer);
		this.hostSelect = document.getElementById(args.hostSelect);
	}

	DsbCSProvider.prototype = {
		/* need to get an instance of a browser window to get access to DSB's global functions */
		browser: Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator)
			.getMostRecentWindow("navigator:browser"),

		/* (re)populate hosts */
		populate: function(showAdditional) {
			var i, elem, ctx, host, hosts = this.hostContainer;
			var browser = this.browser;

			if ('undefined' === typeof showAdditional) {
				showAdditional = 'yes' === pref.getCharPref('downbar.cloud.hosts.additional');
			}

			if (hosts.getElementsByTagName('menuitem').length > 0) {
				/* repopulate, just show/hide additional hosts according to the latest setting */
				elem = hosts.getElementsByClassName('additional');
				for (i = 0; i < elem.length; elem[i++].hidden = !showAdditional);
			} else {
				/* construct hosts */
				for (ctx in browser.original)
					/* ignore link type hosts (just dropdo) as they only save remote files */
					if ('link' !== ctx)
						for (host in browser.original[ctx]) {
							elem = document.createElement('menuitem');
							elem.setAttribute('label', browser.original[ctx][host]);
							elem.setAttribute('value', host);
							elem.context = ctx;
							hosts.appendChild(elem);
						}
				for (ctx in browser.additional)
					for (host in browser.additional[ctx]) {
						elem = document.createElement('menuitem');
						elem.setAttribute('label', browser.additional[ctx][host]);
						elem.setAttribute('value', host);
						elem.setAttribute('class', 'additional');
						elem.context = ctx;
						elem.hidden = !showAdditional;
						hosts.appendChild(elem);
					}
			}
		},

		/* save a file, file can be local or remote
		* for local files, a FileList or an array of absolute file paths is expected,
		* for remote files, an array of URLs is expected */
		save: function(files, local) {
			var i, url, file, mime, host = this.hostSelect.selectedItem;
			var browser = this.browser;

			if (!host || !host.value) return alert('Please select a host service first');

			for (i = 0; i < files.length; ++i) {
				file = files[i];
				if ('string' !== typeof file) {
					/* File object */
					if (browser.createObjectURL) {
						url = browser.createObjectURL(file);
					} else if (browser.createBlobURL) {
						url = browser.createBlobURL(file);
					} else if (browser.URL && browser.URL.createObjectURL) {
						url = browser.URL.createObjectURL(file);
					} else if (browser.webkitURL && browser.webkitURL.createObjectURL) {
						url = browser.webkitURL.createObjectURL(file);
					} else {
						/* Firefox 3.*, AGAIN! */
						url = file.getAsDataURL();
					}
					if (!/^image\//i.test(file.type) && 'image' == host.context) {
						alert(host.label + ' accepts images only, ' + file.name + ' will be skipped.');
						continue;
					}
					/* also send mime type for it's required by some hosts (i.e., Picasa) */
					browser.upload(host.value, {url: url, type: file.type}, file.name);
				} else if (local) {
					/* convert to file uri */
					url = file;
					if (!/^file:\/\/\//i.test(url))
						url = 'file:///' + url.replace(/^\//, '');
					url = url.replace('\\', '/');
					/* get file name */
					file = url.replace(/.+\//, '');

					/* TODO: better way to provide mime type */
					if (/\.(gif|j(p|pe|e)g|png|bmp|tif?f)$/i.test(file))
						mime = 'image/' + file.replace(/^.*$/, function(a) {
							var ext = a.replace(/^.*\./, '');
							if (/^j(p|pe|e)g$/i.test(ext)) return 'jpeg';
							if (/^tif?f$/i.test(ext)) return 'tiff';
							return ext.toLowerCase();
						});
					else if ('image' === host.context) {
						alert(host.label + ' accepts images only, ' + file + ' will be skipped.');
						continue;
					} else
						mime = 'application/octet-stream';
					browser.upload(host.value, {url: url, type: mime}, file);
				} else {
					/* remote file */
					browser.upload(host.value, file, file.replace(/.+\//, ''));
				}
			}
		}
	}
}