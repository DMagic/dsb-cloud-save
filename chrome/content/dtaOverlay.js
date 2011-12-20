/* Copyright 2011 Enzymatic Software, LLC.  All Rights Reserved. */
 
 
window.addEventListener("load", downbarDTAOverlayInit, true);
var ORIGstartDownloads;

function downbarDTAOverlayInit() {
	//d('loaded dta overlay');
		
	// Check if integration is enabled
	var db_pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	if(db_pref.getBoolPref("downbar.integration.enableDTA")) {
		
		// Replace the DTA "startDownloads" function, keeping it the same, but just adding my function call at the end
		// Allows me to detect when new DTA downloads are started. 
		ORIGstartDownloads = window.startDownloads;
		var NEWstartDownloads = function(start, downloads) {ORIGstartDownloads(start, downloads); db_dtaAddProgressDownloads();};
		window.startDownloads = NEWstartDownloads;
		
		window.setTimeout(function() {
			db_dtaAddProgressDownloads();
		}, 1);
		
	}
}

function downbarDTAOverlayDisable() {
	//d('overlay disable');
	window.startDownloads = ORIGstartDownloads;
}

function db_dtaAddProgressDownloads() {
	//d('in db_dtaAddProgressDownloads');
	//d(Tree._downloads.length);
	
	// Add in progress, paused and queued downloads from DTA to downbar
	var id, target, name, source, state, startTime, referrer;
	// Tree is the list of downloads in the DTA window, each download is a queueItem object
	for (let e in Tree.all) {
		//d(e);
		//d(e.state);
		
		// State is paused, in progress, or queued - add it to downbar
		if(e.state == 2 | e.state == 4 | e.state == 64) {
			
			id = "dta_" + e.dbId;
			target = e._destinationFile;
			name = e._destinationName;
			source = e.urlManager.usable;
			state = e.state;	
			startTime = e.startDate.getTime();	
			referrer = e.referrer.host.toString();
			
		/* Now keeping the DTA state instead	
			// Covert DTA state to the state values used by the firefox download manager
			if(e.state == 2) fxState = 4;
			if(e.state == 4) fxState = 0;
			if(e.state == 64) fxState = 5;  // should I use 0 or -1 "not started" state here?
		*/
		
			// Make sure the filetype isn't on the ignore list
			var db_fileext = target.split(".").pop().toLowerCase();
			var db_ignoreList = new Array ( );
			
			var db_pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var ignoreRaw = db_pref.getCharPref("downbar.function.ignoreFiletypes");
			ignoreRaw = ignoreRaw.toLowerCase().replace(/\s/g,'');  // remove all whitespace
			db_ignoreList = ignoreRaw.split(",");
			
			var ignoreThisOne = false;
			// If it's on the ignore list, don't show it on the downbar
			for (var i=0; i<=db_ignoreList.length; ++i) {
					if (db_fileext == db_ignoreList[i])	
						ignoreThisOne = true;
			}
			if(ignoreThisOne)
				continue; // stop this iteration of the loop and continue on with the next
			
			//d("adding: " + id + "  " + target + "  " + name + "  " + source + "  " + state + "  " + startTime + "  " + referrer);
			
			var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
			var browsers = wm.getEnumerator("navigator:browser");
			var win, winElem;
			
			while (browsers.hasMoreElements()) {
				win = browsers.getNext();
				
				if(!win.document.getElementById(id)) {  // make sure this download doesn't already exist
					win.db_dtaInsertNewDownload(id, target, name, source, state, startTime, referrer);
					win.db_dtaUpdateDLrepeat(e);
				}
				
			}
		}
		

	}
	

}

// Dump a message to Javascript Console
function d(msg){
	var acs = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	acs.logStringMessage(msg);
}