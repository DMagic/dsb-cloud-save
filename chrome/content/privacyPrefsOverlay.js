/* Copyright 2011 Enzymatic Software, LLC.  All Rights Reserved. */


window.addEventListener("load", db_initPrefChanges, true);

function db_initPrefChanges() {
	
	try{
		var prefWindow = document.getElementById('BrowserPreferences');
	    db_newPaneLoad(prefWindow.lastSelected);
	
	    eval("prefWindow.showPane ="+prefWindow.showPane.toString().replace(
	    'this._outer._selectPane(this._pane);',
	    '$& db_newPaneLoad(this._pane.id);'
	    ));
	} catch(e){}

}

function db_newPaneLoad(newPane) {
	
	// In the privacy pane, we need to have the "Remember what I've downloaded" option obey the downbar.function.keepHistory pref
	// instead of the browser.download.mananger.retention pref. <-- This pref needs to always be 2 (keep history) so that
	// the default download manager doesn't remove downloads before download statusbar is done with it
	// See browser/content/preferences/privacy.js for original readDownloadRetention and writeDownloadRetention functions
	
	if(newPane == "panePrivacy") {
		
		//var retentionElem = document.getElementById('browser.download.manager.retention');
		try {
			//eval("gPrivacyPane.readDownloadRetention = function(){var db_pref = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);return db_pref.getBoolPref('downbar.function.keepHistory');}");
			eval("gPrivacyPane.readDownloadRetention = function(){}");
			eval("gPrivacyPane.writeDownloadRetention = function(){var db_pref = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);var checkbox = document.getElementById('rememberDownloads');db_pref.setBoolPref('downbar.function.keepHistory', checkbox.checked);return 2;}");
			//alert(gPrivacyPane.readDownloadRetention);
			//alert(gPrivacyPane.writeDownloadRetention);
			
			// The download history checkbox isn't shown unless the "custom history settings" menulist is selected
			// Need to try to set the checkbox when it changes
			var histMenuList = document.getElementById("historyMode");
			var origCommand = histMenuList.getAttribute("oncommand");
			histMenuList.addEventListener("command", origCommand + "db_setDLHistoryCheckbox();");
			
			// Add label here so people know where to complain if something goes wrong...
			var checkbox = document.getElementById("rememberDownloads");
			checkbox.label = checkbox.label + " - (Download Statusbar)";
			
			db_setDLHistoryCheckbox();
			
		} catch(e){}		
	}
	
}

function db_setDLHistoryCheckbox() {
	
	var db_pref = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			
	var checkbox = document.getElementById("rememberDownloads");
	checkbox.checked = db_pref.getBoolPref('downbar.function.keepHistory');
}