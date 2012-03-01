var Hosts = {};

var applicationName = 'Download Statusbar';
var isFirefox = 'undefined' == typeof chrome;
var isChrome = !isFirefox;

var root, save_as, recent;

if (isFirefox) {
	/* localStorage is not available in FF XUL pages, implement a simple
	replacement using FF preference system */
	var pref = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefBranch);
	var prefix = 'downbar.cloud.hosts.';

	window.cloudSavePreference = {
		getItem: function(key) {
			if (!key) return null;
			try {
				return unescape(pref.getCharPref(prefix + escape(key)));
			} catch (e) {
				return null;
			}
		},
		setItem: function(key, val) {
			if (!key) return;
			if ('' === val || null === val || undefined === val)
				this.removeItem(key);

			try {
				pref.setCharPref(prefix + escape(key), escape(val));
			} catch (e) {}
		},
		removeItem: function(key) {
			if (!key) return;
			try {
				pref.clearUserPref(prefix + escape(key));
			} catch (e) {}
		}
	}

	/* Firefox 3.* doesn't have a console object built-in, add this to suppress
	errors in older version of Firefox, it's not meant to function exactly like console.log */
	if ('undefined' === typeof window.console) {
		window.console = {
			log: function() {
				var i, str = arguments[0].toString();
				for (i = 1; i < arguments.length; str = str.replace(/%[sd]/, arguments[i++].toString()));
				dump(str + '\n');
			},
			warn: function() {
				this.log.apply(this, arguments);
			},
			error: function() {
				this.log.apply(this, arguments);
			}
		}
	}

	/* Firefox 3.* doesn't have Object.keys(), copied from:
	https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys#Compatiblity */
	if (!Object.keys) Object.keys = function(o) {
		if (o !== Object(o))
			throw new TypeError('Object.keys called on non-object');
		var ret= [], p;
		for(p in o) if (Object.prototype.hasOwnProperty.call(o, p)) ret.push(p);
		return ret;
	};

	/* Firefox 3.* doesn't have Function.prototype.bind(), copied from:
	https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind */
	if (!Function.prototype.bind) Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}
		
		var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this, fNOP = function () {},
			fBound = function () {
				return fToBind.apply(this instanceof fNOP ? this : oThis || window,
					aArgs.concat(Array.prototype.slice.call(arguments)));
        	};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		
		return fBound;
	};
} else {
	window.cloudSavePreference = {
		getItem: function(key) {
			return localStorage.getItem(key);
		},
		setItem: function(key, val) {
			localStorage.setItem(key, val);
		},
		removeItem: function(key) {
			localStorage.removeItem(key);
		}
	}
}

/* incomplete authentication data may lead to authentication failure, this problem will persist
even after re-installing the extension, the only solution is to clear locally stored data, this
function is provided for each host to check it's local data */
window.cloudSavePreference.unifyItems = function(keys) {
	/* all values of specified keys must be either all-null or all-not-null */
	for (var k in keys) {
		if (null === window.cloudSavePreference.getItem(keys[k])) {
			for (var k2 in keys)
				window.cloudSavePreference.removeItem(keys[k2]);
			break;
		}
	}
}


if (isChrome) {
	/* Google Chrome */
	root = chrome.contextMenus.create({
		"title" : "Cloud Save",
		"contexts" : ["page", "image", "link", "selection"]
	});

	save_as = chrome.contextMenus.create({
		"title": "Save As...",
		"contexts": ["all"],
		"parentId": root
	});

	chrome.contextMenus.create({
		"type": "separator",
		"contexts": ["all"],
		"parentId": root
	});
} else {
	/* Mozilla Firefox */
	$(window).load(function() {
		root = $('#dsbCmContainer').attr('id');
		save_as = $('#dsbCmSaveAs').attr('id');
	});
}


//todo: add more
var original = {
  "image": {
    picasa: 'Picasa',
    twitpic: 'TwitPic',
    flickr: 'Flickr',
    posterous: 'Posterous',
    twitrpix: 'Twitrpix',
    twitgoo: 'Twitgoo',
    facebook: 'Facebook',
    imgly: 'Imgly'
  },
  "all": {
    box: 'Box.net',
    sugarsync: 'SugarSync',
    dropbox: 'Dropbox',
    gdocs: 'Google Docs',
    minus: 'Min.us',
    cloudapp: 'CloudApp',
 	  clouddrive: 'Amazon Cloud',
    droplr: 'Droplr',
    skydrive: 'SkyDrive',
    webdav: 'WebDAV'
  }, 
  "link": {
    dropdo: 'Dropdo' //this one is peculiar because it works differently from all the other hosts
  }
};


var additional = {
	"image": {
		imageshack: 'Imageshack',
		imgur: 'Imgur',
		immio: 'Imm.io'
	},
	"all": {
		hotfile: 'Hotfile'
	}
};

var classes = clone_r(original);

function clone(obj){ //very shallow cloning
  var n = {};
  for(var i in obj) n[i] = obj[i]; //we are the knights who say ni!
  return n;
}

function clone_r(obj){ //not so shallow cloning
	if(typeof obj != 'object') return obj;
  var n = {};
  for(var i in obj) n[i] = clone(obj[i]); //we are the knights who say ni!
  return n;
}





function handle_click(info, tab){
  console.log(arguments);
  var url = info.srcUrl || info.linkUrl || info.pageUrl;
  console.log('Source URL', url);
  var name = unescape(decodeURIComponent(
							unescape(unescape(unescape(url)))
								.replace(/\s/g, '+')
		            .replace(/^.*\/|\?.*$|\#.*$|\&.*$/g,'') || 
		          url.replace(/.*\/\/|www./g,'')
		             .replace(/[^\w]+/g,'_')
		             .replace(/^_*|_*$/g,''))
             ).replace(/\+/g, ' ');
  console.log('Processed name', name);
  if(info.selectionText){
  	url = 'data:text/plain,'+encodeURIComponent(info.selectionText);
  }
  var host = menu_ids[info.menuItemId];
  if(Hosts[host] || 'dropdo' == host){
		if(host == 'dropdo'){
			if (isChrome) {
				chrome.tabs.create({
					url: 'http://dropdo.com/upload?link='+url
				})
			} else if (isFirefox) {
				gBrowser.selectedTab = gBrowser.addTab('http://dropdo.com/upload?link='+url);
			}
		}else{
		  if(host == 'dropbox' && cloudSavePreference.getItem('folder_prefix')){
		    name = cloudSavePreference.getItem('folder_prefix') + name;
		  }
		  if(info.parentMenuItemId == save_as){
		    //woot save as stuff
		    console.log('save as');
		    name = prompt('Save file as...', name);
		    if(!name) return;
		  };
		  
		  if(name.indexOf('/') != -1){
		    cloudSavePreference.setItem('folder_prefix', name.replace(/[^\/]+$/,''));
		  }
		  
		  upload(host, url, name);
		}
		console.log(host, url, name);
		recent.push(host);
		recent.shift();
		cloudSavePreference.setItem('cloudsave_recent', JSON.stringify(recent));
		updateMenus();
  }else{
		alert("Could not find host "+host);
  }
}

var title_map = {};
var menu_ids = {};


function updateMenusFirefox(sorted, others) {
	var i, j, k, el, sib, sep, ctx, id, recent, recentMore, saveAs, saveAsMore;
	var recentRoot = $('#dsbCmContainer'),
		recentMoreRoot = $('#dsbCmMore'),
		saveAsRoot = $('#dsbCmSaveAs'),
		saveAsMoreRoot = $('#dsbCmSaveAsMore');
	var context = {
		image: ['image'],
		link: ['image', 'link', 'selection'],
		all: ['image', 'link', 'selection', 'page']
	};
	var prefixes = ['#dsbCmItem-recent-', '#dsbCmItem-recentMore-', '#dsbCmItem-saveAs-', '#dsbCmItem-saveAsMore-'];

	if (0 == recentRoot.find('.host').length) {
		menu_ids = {};
		for (ctx in classes) {
			for (id in classes[ctx]) {
				recent = $('<menuitem></menuitem>').attr('label', classes[ctx][id]);
				recentMore = recent.clone();
				saveAs = recent.clone();
				saveAsMore = recent.clone();

				recent[0].context = recentMore[0].context = saveAs[0].context = saveAsMore[0].context = context[ctx];
				recent.attr('id', 'dsbCmItem-recent-' + id).attr('class', 'recent host');
				recentMore.attr('id', 'dsbCmItem-recentMore-' + id).attr('class', 'recent more host');
				saveAs.attr('id', 'dsbCmItem-saveAs-' + id).attr('class', 'save-as host');
				saveAsMore.attr('id', 'dsbCmItem-saveAsMore-' + id).attr('class', 'save-as more host');

				recentRoot.children('.entries-before-me').before(recent);
				saveAsRoot.children('.entries-before-me').before(saveAs);
				if ('image' === ctx) {
					/* image only hosting services are listed above the separator */
					recentMoreRoot.children('.image-host-sep').before(recentMore);
					saveAsMoreRoot.children('.image-host-sep').before(saveAsMore);
				} else {
					/* generic hosting services go below the separator */
					saveAsMoreRoot.append(saveAsMore);
					/* there is an "Add/Remove" button at the bottom */
					sep = recentMoreRoot.children('.image-host-sep');
					sib = sep.next('.host');
					if (sib.length) sep.siblings('.host').last().after(recentMore);
					else sep.after(recentMore);
				}
				menu_ids[recent.attr('id')] = id;
				menu_ids[recentMore.attr('id')] = id;
				menu_ids[saveAs.attr('id')] = id;
				menu_ids[saveAsMore.attr('id')] = id;
			}
		}
	}

	/* show recent entries in sorted order */
	for (i = 0; i < sorted.length; ++i) {
		id = sorted[i];

		el = $('#dsbCmItem-recent-' + id)[0];
		el.hidden = false;
		recentRoot.children('.entries-before-me').before(el);
		el = $('#dsbCmItem-saveAs-' + id)[0];
		el.hidden = false;
		saveAsRoot.children('.entries-before-me').before(el);
		/* hide stale entries */
		$('#dsbCmItem-recentMore-' + id)[0].hidden = true;
		$('#dsbCmItem-saveAsMore-' + id)[0].hidden = true;
	}

	/* show stale entries in sorted order */
	for (i = 0; i < others.length; ++i) {
		id = others[i];

		el = $('#dsbCmItem-recentMore-' + id)[0];
		el.hidden = false;
		if ('image' === el.context.join(''))
			recentMoreRoot.children('.image-host-sep').before(el);
		else
			recentMoreRoot.children('.image-host-sep').siblings('.host').last().after(el);

		el = $('#dsbCmItem-saveAsMore-' + id)[0];
		el.hidden = false;
		if ('image' === el.context.join(''))
			saveAsMoreRoot.children('.image-host-sep').before(el);
		else
			saveAsMoreRoot.append(el);

		/* hide recent entries */
		$('#dsbCmItem-recent-' + id)[0].hidden = true;
		$('#dsbCmItem-saveAs-' + id)[0].hidden = true;
	}

	/* show/hide additional hosts */
	if (cloudSavePreference.getItem('additional') != 'yes') {
		for (i in additional)
			for (j in additional[i])
				for (k in prefixes) {
					$(prefixes[k] + j).attr('hidden', true);
				}
	}
}

function updateMenus(){
	title_map = {};
	for(var i in classes){
		for(var h in classes[i]){
		  title_map[h] = classes[i][h]; //flatten it out
		}
	}

  for(var unique = [], freqmap = {}, i = 0; i < recent.length;i++){
  	if(title_map[recent[i]]){
		  if(!freqmap[recent[i]]){
		    freqmap[recent[i]] = 1;
		    unique.push(recent[i]);
		  }
		  freqmap[recent[i]]++;
    }
  }
  var dilation_factor = 100;
  function grade(result){
    return freqmap[result] + recent.lastIndexOf(result) / dilation_factor;
  }
  var sorted = unique.sort(function(a,b){
    return grade(b) - grade(a);
  });
  console.log(recent);
  console.log(unique.map(function(a){
    return a + ' ' + grade(a)  
  }));
  var others = Object.keys(title_map).sort().filter(function(x){
    return unique.indexOf(x) == -1;
  });

	/* build menu in Firefox */
	if (isFirefox) {
		updateMenusFirefox(sorted, others);
		return;
	}

	/* build menu in Chrome */
	Object.keys(menu_ids).reverse().forEach(function(item){
		chrome.contextMenus.remove(parseInt(item));
	});
  menu_ids = {};

  for(var i = 0; i < sorted.length; i++){
    var prop = {
      "title": title_map[sorted[i]],
      "onclick": handle_click
    };
    prop.contexts = classes.image[sorted[i]] ? 
                    ['image'] : 
                  (classes.link[sorted[i]]? 
                    ['image', 'link', 'selection']:  ['page', 'link', 'image', 'selection']);
    prop.parentId = root;
    menu_ids[chrome.contextMenus.create(clone(prop))] = sorted[i];
    prop.parentId = save_as;
    menu_ids[chrome.contextMenus.create(clone(prop))] = sorted[i];
  }
  /*
  menu_ids[chrome.contextMenus.create({
    "type": "separator",
    "contexts": ["all"],
    "parentId": root
  })] = 42;
  menu_ids[chrome.contextMenus.create({
    "type": "separator",
    "contexts": ["all"],
    "parentId": save_as
  })] = 42;
  //*/
  var save_as_more = chrome.contextMenus.create({
    "title": "More",
    "parentId": save_as,
    "contexts": ["all"]
  });
  menu_ids[save_as_more] = 'save_as_more';
  var root_more = chrome.contextMenus.create({
    "title": "More",
    "parentId": root,
    "contexts": ["all"]
  });
  menu_ids[root_more] = 'root_more';
  function add_more(host){
		var prop = {
      "title": title_map[host],
      "onclick": handle_click
    };
    prop.contexts = classes.image[host] ? 
                    ['image'] : 
                  (classes.link[host]? 
                    ['image', 'link']:  ['page', 'link', 'image']);
    prop.parentId = root_more;
    menu_ids[chrome.contextMenus.create(clone(prop))] = host;
    prop.parentId = save_as_more;
    menu_ids[chrome.contextMenus.create(clone(prop))] = host;
  }
  
  for(var i = 0; i < others.length; i++){
    if(classes.image[others[i]]){
      add_more(others[i])
    }
  }
  menu_ids[chrome.contextMenus.create({
    "type": "separator",
    "contexts": ["image"],
    "parentId": root_more
  })] = 42;
  menu_ids[chrome.contextMenus.create({
    "type": "separator",
    "contexts": ["image"],
    "parentId": save_as_more
  })] = 42;
  for(var i = 0; i < others.length; i++){
    if(!classes.image[others[i]]){
      add_more(others[i])
    }
  }
  //*
  menu_ids[chrome.contextMenus.create({
    "type": "separator",
    "contexts": ["all"],
    "parentId": root_more
  })] = 42;
  menu_ids[chrome.contextMenus.create({
    "title": "Add/Remove",
    "contexts": ["all"],
    "parentId": root_more,
    "onclick": open_settings
  })] = 'add_remove'; //*/
}


function open_settings(){
	chrome.tabs.create({url: "settings.html"})
}

//shamelessly stolen from john resig.
function wbr(str, num) {
  return str.replace(RegExp("(\\w{" + num + "})(\\w)", "g"), function(all,text,char){ 
		/* Can't set innerHTML for Firefox XUL elements, I have to mark possible
		word breaks with special characters here and replace it with <wbr> later,
		see DsbNotification.update() */
    return text + (isFirefox ? '\n' : "<wbr>") + char; 
  }); 
}

var INDETERMINATE = {};


/* deprecated */
function updateNotification(id, arg1, arg2){
	function main(){
		var wins = chrome.extension.getViews({type:"notification"})
		var matches = wins.filter(function(win) {
			return win.location.search.substr(1) == id
		});
		if(id == 42) matches = wins; //please coding gods dont kill me
		if(matches.length){
			if(typeof arg1 == 'number' || arg1 == INDETERMINATE){
				matches[0].document.getElementById('progress').style.display = '';
				matches[0].document.getElementById('progress').value = arg1 == INDETERMINATE ? null : arg1;
			}else if(arg2){
				matches[0].document.getElementById('status').innerHTML = arg2;
				matches[0].document.body.style.backgroundImage = 'url('+arg1+')';
				matches[0].document.getElementById('progress').style.display = 'none'
			}else{
				matches[0].document.getElementById('status').innerHTML = arg1;
			}
		}else{
			return false
		}
		return true
	}
	if(!main()){
		console.log('Error! Could not locate notification', id, arg1, arg2);
		var count = 0;
		function looper(){
			if(!main() && count++ < 100) setTimeout(looper, 10);
		}
		looper();
	}
}


var urlid = {
	'todo_fix_this': 42
	//this is a sort of hack. it uses the file download urls
	//as a sort of state callback whatnot stuff.
};

function uploadProgress(url, evt){
	if (urlid[url] && urlid[url].update)
		urlid[url].update({
			progress: evt.lengthComputable ? { value: evt.loaded/evt.total/2+0.5 } : { mode: 'undetermined' }
		});
}

function downloadProgress(url, evt){
	if (urlid[url] && urlid[url].update)
		urlid[url].update({
			progress: evt.lengthComputable ? { value: evt.loaded/evt.total/2 } : { mode: 'undetermined' }
		});
}

/* hopefully normalize notification systems in Chrome and Firefox */
function DsbNotification(args) {
	/* previously updateNotification() */
	this.constructor.prototype.update = function(args) {
		var doc = this.wnd.document, prog, status, box, osX, osY;

		args = args || {};
		if (args.progress) {
			prog = doc.getElementById('progress');
			if ('undefined' !== typeof args.progress.display) prog.style.display = args.progress.display;
			if ('undefined' !== typeof args.progress.mode) prog.setAttribute('mode', args.progress.mode);
			if ('undefined' !== typeof args.progress.value) {
				if (isChrome)
					prog.setAttribute('value', args.progress.value);
				else {
					var val = args.progress.value, max = parseInt(prog.getAttribute('max'));
					prog.setAttribute('value', val * max);
				}
			}
		}
		if (args.status) {
			if (isChrome) {
				status = doc.getElementById('status');
				status.innerHTML = args.status;
			} else {
				status = doc.getElementById('alertTextLabel');
				/* updating inner text in XUL is tedious */
				var i, texts = args.status.split('\n');
				for (i = status.childNodes.length; i > 0; status.removeChild(status.childNodes[--i]));
				for (i = 0; i < texts.length; ++i) {
					status.appendChild(doc.createTextNode(texts[i]));
					status.appendChild(doc.createElement('wbr'));
				}
			}
		}
		if (args.image) {
			if (isChrome) doc.body.style.backgroundImage = 'url(' + args.image + ')';
			else doc.getElementById('alertImage').setAttribute('src', 'chrome://downbar/skin/cloud/' + args.image);
		}
		/* update event handlers */
		if (args.events) {
			for (var ev in args.events) {
				if (/^on(display|click|close)$/.test(ev)) {
					if (isChrome) this.wnd[ev] = args.events[ev];
					else {
						var ev1 = 'ondisplay' == ev ? 'load' : ev.replace(/^on/, '');
						this.wnd.removeEventListener(ev1, this.events[ev], false);
						this.wnd.addEventListener(ev1, args.events[ev], false);
					}
					this.events[ev] = args.events[ev];
				}
			}
		}

		/* adjust box size */
		if (isFirefox) {
			box = doc.getElementById("alertBox").boxObject;
			osX = this.wnd.innerWidth - box.width;
			osY = this.wnd.innerHeight - box.height;
			this.wnd.innerWidth = box.width;
			this.wnd.innerHeight = box.height;
			this.wnd.moveBy(osX, osY);
		}
	};

	this.constructor.prototype.show = function() {
		if (isChrome) this.wnd.show();
		else {
			this.wnd = this.wnd.openWindow(null,
				'chrome://downbar/content/cloud/notification.xul',
				'_blank', 'chrome,titlebar=no,popup=yes', null);
			this.wnd.arguments = [
				'chrome://downbar/skin/cloud/icon/64.png',
				'', 'Download Stausbar is preparing to save your file to Cloud.'
			]
			if (args.ondisplay)
				this.wnd.addEventListener('load', args.ondisplay, false);
			if (args.onclick)
				this.wnd.addEventListener('click', args.onclick, false);
			if (args.onclose)
				this.wnd.addEventListener('close', args.onclose, false);

			var instance = this;
			this.wnd.addEventListener('load', function(e) {
				instance.wnd.document.getElementById('close-button').addEventListener('click', function(e) {
					e.stopPropagation();
					instance.cancel();
				}, false);
			}, false);
		}
	}

	this.constructor.prototype.cancel = function() {
		if (isChrome) this.wnd.cancel();
		else this.wnd.animateCloseAlert();
	}

	args = args || {};

	this.events = {};
	this.events.ondisplay = args.ondisplay;
	this.events.onclick = args.onclick;
	this.events.onclose = args.onclose;
	if (isChrome) {
		this.wnd = webkitNotifications.createHTMLNotification('popup.html?' + args.id);
		this.wnd.ondisplay = args.ondisplay ? args.ondisplay : function() {};
		this.wnd.onclick = args.onclick ? args.onclick : function() {};
		this.wnd.onclose = args.onclose ? args.onclose : function() {};
	}	else {
		this.wnd = Components.classes['@mozilla.org/embedcomp/window-watcher;1'].
				getService(Components.interfaces.nsIWindowWatcher);
	}
}

function upload(host, url, name) {
	var id = Math.random().toString(36).substr(3);
	var has_uploaded = false;
	var upload_callback = function(){};
	var mimeType = null;

	/* url from firefox preference panel are objects */
	if (typeof url !== 'string') {
		mimeType = url.type;
		url = url.url;
	}

	var notification = new DsbNotification({
		ondisplay: function() {
			notification.update({
				image: 'icon/throbber.gif', 
				status: "The file '"+wbr(name,8)+"' is being saved to "+title_map[host]+"...",
				progress: { display: '', value: null }
			});
		},
		onclick: function() {
			if (has_uploaded) {
				openFile()
			} else {
				notification.update({
					status: "Opening file '"+wbr(name,8)+"' on "+title_map[host] +" in a few seconds..."
				});
				upload_callback = openFile;
			}
		},
		onclose: function() {
			delete urlid[url];
		},
		id: id
	});
	
	function openFile(){
		if (isChrome) chrome.tabs.create({url: has_uploaded});
		else gBrowser.selectedTab = gBrowser.addTab(has_uploaded);
	}

	notification.show();
	urlid[url] = isChrome? id : notification;

  Hosts[host]({
    url: url,
		type: mimeType,
    name: name
  }, function(e){
	  has_uploaded = e && e.url;
	  setTimeout(function(){ upload_callback(); }, 200);
    console.log('uploaded file yay', e);
    if(e && typeof e == "string" && e.indexOf('error:') != -1){
      notification.update({
				image: 'icon/64sad.png',
				status: "The file '"+wbr(name,8)+"' could not be uploaded to "+title_map[host]+". "+e.substr(6),
				progress: { display: 'none' }
			})
		/* respond to click event doesn't make sense anymore */
		notification.update({
			events: { onclick: function() {} }
		})
    }else{
	    notification.update({
				image: 'icon/64.png',
	    	status: "The file '"+wbr(name,8)+"' has been uploaded to "+title_map[host]+".",
				progress: { value: 1.0, display: 'none' }
	    });
	    setTimeout(function(){
	    	notification.cancel();
			}, 5.4 * 1000) //May the fourth be with you.
    }
  })
}


function install_additional(state){
	if(state){
		for(var i in additional){
			for(var ii in additional[i])
				classes[i][ii] = additional[i][ii];
		}
	}else{
		classes = clone_r(original);
	}
	updateMenus();
}

window.addEventListener('load', function() {
	//an order which shoudl theoretically work, but isnt optimal
	//in any stretch of the imagination
	/*
		general idea: 
			1. quantity (2 > 1)
			2. position (end > beginning)
	*/
	try {
		recent = JSON.parse(cloudSavePreference.getItem('cloudsave_recent'));
	}catch(err){
	}
	if (!recent) {
		recent = [
			'gdocs',
			'facebook',
			'dropbox',
			'flickr',
			'box',
			'clouddrive',
			'picasa',
			'gdocs',
			'dropbox'
		];
	}

	if(cloudSavePreference.getItem('additional') == 'yes' || isFirefox){
		/* always install additional hosts in Firefox, hide them later if disabled */
		install_additional(true);
	}else{
		updateMenus();
	}
}, false);
