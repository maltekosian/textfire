var connection = null;

var streams = [];

function StreamObject(_id) {
  this.streamId = _id;
  this.str = '';
}
 
function getStreamObject(_id) {
  for (var i = 0; i < streams.length; i++) {
    if (streams[i].streamId == _id) {
      return streams[i];
    }
  }
  return null;
}

function addStreamObject(stObj) {
  streams.push(stObj);
}

function removeStreamObject(_id) {
  for (var i = streams.length - 1; i >= 0; i--) {
    if (streams[i].streamId == _id) {
      streams.splice(i, 1);
    }
  }
}

function removeAllStreams() {
  for (var i = streams.length - 1; i >= 0; i--) { 
    streams.splice(i, 1);    
  }
}

function initWebsocket() {
  //"use strict";
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;
  // if browser doesn't support WebSocket, just show some notification and exit
  if (!window.WebSocket) {
    return;
  }

  // open connection
  connection = new WebSocket('ws://'+location.host+':9337');

  connection.onopen = function () {
    // first send userName and userId stored in userMe
    //if (onlinelogin) {
      var msg = {userName: userMe.name, userId: userMe.id};
      connection.send(JSON.stringify(msg));
    //}
  };

  connection.onerror = function (error) {
    // just in there were some problems with conenction...
    console.log('websocket error -> '+error);
  };

  // most important part - incoming messages
  connection.onmessage = function (message) {
    // try to parse JSON message. Because we know that the server always returns
    // JSON this should work without any problem but we should make sure that
    // the massage is not chunked or otherwise damaged.
    try {
        var json = JSON.parse(message.data);
    } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        return;
    }
    
    var goon = false; 
      
    if (json.send != null) {
      //json => {send: 'once|new|data|end', str: dataChunks[i], streamId: streamId}
      switch (json.send) {
        case 'once': 
          json = JSON.parse(json.str);
          goon = true;
        break;
        case 'new': 
          var streamObj = new StreamObject(json.streamId);
          streamObj.str = json.str;
          addStreamObject(streamObj);
        break;
        case 'data': 
          var streamObj = getStreamObject(json.streamId);
          streamObj.str = streamObj.str+json.str;
        break;
        case 'end': 
          var streamObj = getStreamObject(json.streamId);
          streamObj.str = streamObj.str+json.str;
          try {
            json = JSON.parse(streamObj.str);
            goon = true;  
            removeStreamObject(streamObj.streamId);
          } catch (e) {
            console.log(e);
            console.log(streamObj.str);
            goon = false;  
          } 
        break; 
      }
    } else {
      goon = true;  
    }
    if (goon) {
      // NOTE: if you're not sure about the JSON structure
      // check the server source code above
      switch (json.callback) { // first response from the server with user's color
        case 'sockLogin':
          // from now user can start sending messages
          if (json.error != null) {
            console.log('sock login -> '+json.error);
            return;
          }
          console.log('sock login -> '+JSON.stringify(json));
          //TEST ONLY?
          onlineLogin = true;
          currentInterlock = new Interlock();
          //TEST ONLY?
          showOnlineProjects();
        break;
        case 'saveProject':
          console.log('saveProject -> '+JSON.stringify(json));
          //close Prompt here
          closePrompt();
        break;
        case 'loadProject':
          console.log('loadProject -> ');
          //load the Project and do not forget to close the prompt
          sockLoadProject(json.data);
        break;
        case 'saveMemo':
          console.log('saveMemo -> '+JSON.stringify(json));
          sockSaveMemo(json.data);
        break;
        case 'saveMediaManger':
          console.log('saveMediaManager -> '+JSON.stringify(json));
          sockSaveMediaManager(json.data);
        break;
        case 'saveTextManager':
          console.log('saveTextManager -> '+JSON.stringify(json));
          sockSaveTextManager(json.data);
        break;
        case 'saveUidcounter':
          console.log('saveUidcounter -> '+JSON.stringify(json));
          sockSaveUidcounter(json.data);
        break;
        case 'saveInterlock':
          //console.log('saveInterlock -> '+JSON.stringify(json));
          sockSaveInterlock(json.data);
        break;
        case 'listInterlocks':
          console.log('listInterlocks -> '+JSON.stringify(json));
          sockListInterlocks(json.data);
        break;
        case 'saveOverview':
        
        break;
        case 'saveProjectToList':
          //console.log('saveProjectToList -> '+JSON.stringify(json));
        break;
        case 'loadProjectsList':
          console.log('loadProjectsList -> '+JSON.stringify(json));
          listOnlineProjects(json.data);
        break;
        //something went wrong from here on
        case null:
        default:
          console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        break;
      }
    }
  };

  /**
   * Send mesage when user presses Enter key
   */
  /*
  input.addEventListener('keydown',function(e) {
    if (e.keyCode === 13) {
        var msg = {type:'message', data: {text:input.value, time:Date.now()} };
        if (!input.value) {
            return;
        }
        // send the message as an ordinary json//text
        connection.send(JSON.stringify(msg));
        input.value = '';
        // disable the input field to make the user wait until server
        // sends back response
        input.setAttribute('disabled', 'disabled');

        // we know that the first message sent from a user their name
        if (myName === false) {
            myName = msg.data.text;
        }
    }
  }, true);
  */
  /**
   * This method is optional. If the server wasn't able to respond to the
   * in 3 seconds then show some error message to notify the user that
   * something is wrong.
   */
  var intervalId = setInterval(function() {
    //request an intervalListner here instead!
    if (connection.readyState !== 1) {
       //status.innerHTML = 'Error';
       //input.setAttribute('disabled', 'disabled');
       console.log( 'Unable to communicate with the WebSocket server. '+location.host);
       onlineLogin = false;
       removeAllStreams();
       clearInterval(intervalId);
    }
  }, 3000);
};

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function wsSend(dataStr, stream) {
  
  //cut the dataStr into chunks of size 4048(4096 - x)
  //send 'once','new','data' or 'end' parts of the data chunk
  //{send: 'once|new|data|end', str: dataChunks[i], streamId: streamId}
  if (stream == null || !stream) {
    connection.send(dataStr);
  } else {
    var dataChunks = [];
    var j = 0;
    while(dataStr.length > 0) {
      dataChunks[j] = dataStr.substr(0, dataStr.length < 4048 ? dataStr.length : 4048);
      j++;
      dataStr = dataStr.substr(dataStr.length < 4048 ? dataStr.length : 4048);
    }
    var streamId = Date.now();
    for (var i = 0; i < dataChunks.length; i++) {
      if (i == 0) {
        if (i == dataChunks.length - 1) {
          connection.send(JSON.stringify({send: 'once',str: dataChunks[i], streamId: streamId}));
        } else {
          connection.send(JSON.stringify({send: 'new',str: dataChunks[i], streamId: streamId}));
        }
      } else {
        if (i != dataChunks.length - 1) {
          connection.send(JSON.stringify({send: 'data',str: dataChunks[i], streamId: streamId}));
        } else {
          connection.send(JSON.stringify({send: 'end',str: dataChunks[i], streamId: streamId}));
        }
      }
    }
  }
}
