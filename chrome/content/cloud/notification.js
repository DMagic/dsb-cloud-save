/* based on chrome://global/content/alerts/alert.js */
//@line 38 "e:\builds\moz2_slave\rel-m-rel-w32-bld\build\toolkit\components\alerts\resources\content\alert.js"

// Copied from nsILookAndFeel.h, see comments on eMetric_AlertNotificationOrigin
const NS_ALERT_HORIZONTAL = 1;
const NS_ALERT_LEFT = 2;
const NS_ALERT_TOP = 4;

var gFinalSize;
var gCurrentSize = 1;

var gSlideIncrement = 1;
var gSlideTime = 10;
var gOpenTime = 3000; // total time the alert should stay up once we are done animating.
var gOrigin = 0; // Default value: alert from bottom right, sliding in vertically.

var gAlertListener = null;
var gAlertTextClickable = false;
var gAlertCookie = "";

function prefillAlertInfo()
{
  // unwrap all the args....
  // arguments[0] --> the image src url
  // arguments[1] --> the alert title
  // arguments[2] --> the alert text
  // arguments[3] --> is the text clickable?
  // arguments[4] --> the alert cookie to be passed back to the listener
  // arguments[5] --> the alert origin reported by the look and feel
  // arguments[6] --> an optional callback listener (nsIObserver)

  switch (window.arguments.length)
  {
    default:
    case 7:
      gAlertListener = window.arguments[6];
    case 6:
      gOrigin = window.arguments[5];
    case 5:
      gAlertCookie = window.arguments[4];
    case 4:
      gAlertTextClickable = window.arguments[3];
      if (gAlertTextClickable) {
        document.getElementById('alertNotification').setAttribute('clickable', true);
        document.getElementById('alertTextLabel').setAttribute('clickable', true);
      }
    case 3:
      document.getElementById('alertTextLabel').appendChild(document.createTextNode(window.arguments[2]));
    case 2:
      document.getElementById('alertTitleLabel').setAttribute('value', window.arguments[1]);
    case 1:
      document.getElementById('alertImage').setAttribute('src', window.arguments[0]);
    case 0:
      break;
  }
}

function d(msg){
  var acs = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
  acs.logStringMessage(msg);
}


function onAlertLoad()
{

  prefillAlertInfo();

  //d('onalertload');
  // Read out our initial settings from prefs.
  try
  {
    var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService();
    prefService = prefService.QueryInterface(Components.interfaces.nsIPrefService);
    var prefBranch = prefService.getBranch(null);
    gSlideIncrement = prefBranch.getIntPref("alerts.slideIncrement");
    gSlideTime = prefBranch.getIntPref("alerts.slideIncrementTime");
    gOpenTime = prefBranch.getIntPref("alerts.totalOpenTime");
  }
  catch (ex)
  {
  }

  d('gOrigin: ' + gOrigin);
  d('NS_ALERT_HORIZONTAL: ' + NS_ALERT_HORIZONTAL);
  d('NS_ALERT_LEFT: ' + NS_ALERT_LEFT);
  d('NS_ALERT_TOP: ' + NS_ALERT_TOP);
  d('screen: ' + screen.width + 'x' + screen.height);



  // Make sure that the contents are fixed at the window edge facing the
  // screen's center so that the window looks like "sliding in" and not
  // like "unfolding". The default packing of "start" only works for
  // vertical-bottom and horizontal-right positions, so we change it here.
  // if (gOrigin & NS_ALERT_HORIZONTAL)
  // {
  //   if (gOrigin & NS_ALERT_LEFT)
  //     document.documentElement.pack = "end";

  //   d('setting horizontal orientation');

  //   // Additionally, change the orientation so the packing works as intended
  //   document.documentElement.orient = "horizontal";
  // }
  // else
  // {
  //   d('not setting horizontal');

  //   if (gOrigin & NS_ALERT_TOP)
  //     document.documentElement.pack = "end";
  // }

  var alertBox = document.getElementById("alertBox");
  d('before:' + alertBox.orient);
  //alertBox.orient = (gOrigin & NS_ALERT_HORIZONTAL) ? "vertical" : "horizontal";
  d('after:' + alertBox.orient);

  sizeToContent();

  // Work around a bug where sizeToContent() leaves a border outside of the content
  var contentDim = document.getElementById("alertBox").boxObject;
  if (window.innerWidth == contentDim.width + 1)
    --window.innerWidth;

  // Start with a 1px width/height, because 0 causes trouble with Gk1/2
  gCurrentSize = 1;

  // Determine final size
  if (gOrigin & NS_ALERT_HORIZONTAL)
  {
    gFinalSize = window.outerWidth;
    //window.outerWidth = gCurrentSize;
  }
  else
  {
    gFinalSize = window.outerHeight;
    //window.outerHeight = gCurrentSize;
  }

  d('gFinalSize/window.outerHeight: ' + gFinalSize + '/' + window.outerHeight);
  d('determine x: ' + (gOrigin & NS_ALERT_LEFT));
  d('determine y: ' + (gOrigin & NS_ALERT_TOP));

  d ('determining y: ' + screen.availTop + ' + ' + screen.availHeight + ' - ' + window.outerHeight);

  // Determine position
  var x = gOrigin & NS_ALERT_LEFT ? screen.availLeft :
          screen.availLeft + screen.availWidth - window.outerWidth;
  var y = gOrigin & NS_ALERT_TOP ? screen.availTop :
          screen.availTop + screen.availHeight;// - window.outerHeight;

  d('x,y: ' + x + ',' + y);

  // Offset the alert by 10 pixels from the edge of the screen
  if (gOrigin & NS_ALERT_HORIZONTAL)
    y += gOrigin & NS_ALERT_TOP ? 10 : -10;
  else
    x += gOrigin & NS_ALERT_LEFT ? 10 : -10;

  d('screeny: ' + window.screenY);
  window.moveTo(x, y);
  d('screeny: ' + window.screenY);
  d('x,y: ' + x + ',' + y);
  d('gSlideTime: ' + gSlideTime);

//  setTimeout(function() { animateAlert(); }, gSlideTime);
  setTimeout(animateAlert, gSlideTime);

}


function watcher () {
  d('sY: ' + window.screenY);
}
//setInterval(watcher, 300);

function animate(step)
{
  d('animate: ' + window.screenY + '/ ' + window.outerHeight);

  gCurrentSize += step;

  if (gOrigin & NS_ALERT_HORIZONTAL)
  {
    if (!(gOrigin & NS_ALERT_LEFT))
      window.screenX -= step;
    //window.outerWidth = gCurrentSize;
  }
  else
  {
    if (!(gOrigin & NS_ALERT_TOP))
      window.screenY -= step;
    //window.outerHeight = gCurrentSize;
  }
}

function animateAlert()
{

  if (gCurrentSize < gFinalSize)
  {
    animate(gSlideIncrement);
  setTimeout(animateAlert, gSlideTime);
//    setTimeout(function() { animateAlert(); }, gSlideTime);
  }
  else
                /* do not close automatically */
    //setTimeout(animateCloseAlert, gOpenTime);
                ;
}

function animateCloseAlert()
{
// TEMP / NO CHECKIN
 // return;

  if (gCurrentSize > 1)
  {
    animate(-gSlideIncrement);
    setTimeout(animateCloseAlert, gSlideTime);
    //setTimeout(function() { animateCloseAlert(); }, gSlideTime);
  }
  else
    closeAlert();
}

function closeAlert() {
  if (gAlertListener)
    gAlertListener.observe(null, "alertfinished", gAlertCookie);
  window.close();
}

function onAlertClick()
{
//  if (gAlertListener && gAlertTextClickable)
//    gAlertListener.observe(null, "alertclickcallback", gAlertCookie);
//  closeAlert();
}
