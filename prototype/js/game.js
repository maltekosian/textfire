/**
@license
Licensed to hogventure.com under one
<br>or more contributor license agreements.  See the NOTICE file
<br>distributed with this work for additional information
<br>regarding copyright ownership.  The hogventure.com licenses this file
<br>to you under the hogventure.com License, Version 1.0 (the
<br>"License"); you may not use this file except in compliance
<br>with the License. You may obtain a copy of the License at
<br>
<br>         http://www.hogventure.com/purchase.html
<br>
<br>Unless required by applicable law or agreed to in writing,
<br>software distributed under the License is distributed on an
<br>"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
<br>KIND, either express or implied.  See the License for the
<br>specific language governing permissions and limitations
<br>under the License.<br>
*/
/*
@author Malte Kosian
@since 2012-06-01
@version 2013-06-07

@namespace Game
@namespace window
@since 2013-06-06
*/ 
  /**

  */
  var version = '20130607';
  
  /**
  usally only with the use of an Media and Textmanager
  and an UidCounter(Generator for unique Ids)
  */
  function DialogGame() {
    /**

    */
    this.canvas = getElement('canvas');
    /**

    */
    this.ctx = null;
    /**

    */
    this.canvasWidth = 480;
    /**

    */
    this.canvasHeight = 320;
    /**

    */
    this.screenWidth = null;
    /**

    */
    this.screenHeight = null;
    /**

    */
    this.backbuffer = null;//createElement('canvas');
    /**

    */
    this.btx = null;
    /**

    */
    this.bufferWidth = 800;
    /**

    */
    this.bufferHeight = 480;
    /**

    */
    this.intervalId = null;
    /**

    */
    this.intervalListeners = [];
    /**

    */
    this.addIntervalListener = function(_name, _method, _t) {
      this.intervalListeners.push(
        {
          name: _name,
          m: _method,
          t: _t,
          ot: Date.now()
        }
      );
    }
    /**

    */
    this.removeIntervalListener = function(_name) {
      for (var i = 0; i < this.intervalListeners.length; i++) {
        if (this.intervalListeners[i].name == _name) {
          this.intervalListeners[i] = null;
          //the null listeners will be removed in update
        }
      }
    }
    /**

    */
    this.animationOldTime = null;
    /**

    */
    this.animationTime = null;
    /**
    the array of dialog-text dialogs
    each dialogs-set has an unique id a text, a method, a speaker, a next
    posible values are 
    wrongCase and wrongGoto 
    in the case of a select this is necessary
    in the case of input it's posible
    image
    points - default is null
    [{"uid":"dial_0","texts":[{"uid":"text_0","next":null,"text":null,"points":0,"method":"---","audio":null,"logo":null}],"image":null,"audio":null,"x":null,"y":null,"w":null,"h":null,"color":null}]
    */
    this.dialogs = [
      {"uid":"step1","texts":[{"uid":"text_0","next":"step4","text":"Hello, my name is Hans. Who are you?","points":0,"method":"showText","audio":null,"logo":null}],"method":"showText","image":null,"audio":null,"x":null,"y":null,"w":null,"h":null,"color":null},
      {"uid":"step2","texts":[{"uid":"text_0","next":"step4","text":"Welcome to Bizcademy, #name#. Do you have an idea?","points":0,"method":"showText","audio":null,"logo":null}],"method":"showText","image":null,"audio":null,"x":null,"y":null,"w":null,"h":null,"color":null},
      {"uid":"step4","texts":[{"uid":"text_0","next":"step2","text":"Yes, a rockstart idea!","points":0,"method":"showSelect","audio":null,"logo":null},{"uid":"text_1","next":"step1","text":"No, but i want develope one.","points":0,"method":"showSelect","audio":null,"logo":null}],"method":"showSelect","image":null,"audio":null,"x":null,"y":null,"w":null,"h":null,"color":null},
      {}
    ];
    /**
    @since 20130613
    */
    this.game = null;
    /**
    an array of key-value storages
    {key: [..], value: [..]}
    */
    this.keyValues = [];
    /**

    */
    this.historyOfIds = [];
    /**

    */
    this.points = 0;
    /**
    an editor function
    */
    this.setData = function(_data) {
      if (!hasData(_data.uid)) {
        this.dialogs.push(_data);
      } else {
        this.getData(_data.uid) = _data;
      }      
    }
    /**
    running in backwards order through the array is lock save.
    */
    this.getData = function(_id) {
      for (var i = this.dialogs.length - 1; i >= 0; i--) {
        if (this.dialogs[i].uid == _id) {
          return this.dialogs[i];
        }
      }
      return null;
    }
    /**
    an editor function
    running in backwards order through the array is lock save.
    */
    this.removeData = function(_id) {
      for (var i = this.dialogs.length - 1; i >= 0; i--) {
        if (this.dialogs[i].uid == _id) {
          this.dialogs[i].splice(i, 1);
        }
      }
    }
    /**
    running in backwards order through the array is lock save.
    */
    this.hasData = function(_id) {
      for (var i = this.dialogs.length - 1; i >= 0; i--) {
        if (this.dialogs[i].uid == _id) {
          return true;
        }
      }
      return false;
    }
    /**

    */
    this.setKeyValue = function(_k, _v) {
      if (!this.hasKeyValue(_k)) {
        this.keyValues.push({key: _k, value: _v});
      } else {
        this.getKeyValue(_k).value = _v;
      }
    }
    /**

    */
    this.getKeyValue = function(_k) {
      for (var i = this.keyValues.length - 1; i >= 0; i--) {
        if (this.keyValues[i].key == _k) {
          return this.keyValues[i];
        }      
      }
      return null;
    }
    /**

    */
    this.getValueForKey = function(_k) {
      for (var i = this.keyValues.length - 1; i >= 0; i--) {
        if (this.keyValues[i].key == _k) {
          return this.keyValues[i].value;
        }      
      }
      return null;
    }
    /**
    
    */
    this.hasKeyValue = function(_k) {
      for (var i = this.keyValues.length - 1; i >= 0; i--) {
        if (this.keyValues[i].key == _k) {
          return true;
        }      
      }
      return false;
    }
    /**

    */
    this.hasIdInHistory = function(_id) {
      for (var i = 0; i < this.historyOfIds.length; i++) {
        if (this.historyOfIds == _id) {
          return true;
        }
      }
      return false;
    }
    /**

    */
    this.nextData = function(_id) {
      console.log('currentDialog '+_id);
      var currentDialog = this.getData(_id);
      console.log(currentDialog);
      this.historyOfIds.push(_id);
      console.log('this.historyOfIds.length = '+this.historyOfIds.length+', '+game.historyOfIds.length);
      //currentId = id;
      if (null) { 
        alert('no dialogs with "'+_id+'".');
        return;
      }
      if (currentDialog.method == null) {
        currentDialog.method = '';
      }
      switch (currentDialog.method) {
        case 'showKeyInput':
          this.showKeyInput(currentDialog);
        break;
        case 'showInput':
          this.showInput(currentDialog);
        break;
        case 'goto':
          this.nextData(currentDialog.next);
        break;
        case 'showSelect':
          this.showSelect(currentDialog);
        break;
        case 'showFinalSelect':
          this.showFinalSelect(currentDialog);
        break;
        case 'showTimer':
          this.showTimer(currentDialog);
        break;
        case 'clearScreen':
          this.clearScreen(currentDialog);
        break;
        case 'showText':
        default:
          this.showText(currentDialog);
        break;
      } 
    }
    /**

    */
    this.previousData = function() {
      this.nextData(this.historyOfIds[this.historyOfIds.length - 2]);
    }
    /**

    */
    this.scrollToBottom = function() {
      var height = document.getElementById('game-inner').offsetHeight;
      console.log('scrollToBottom '+height);
      if (height > 499) {
         document.getElementById('game-inner').style.top = -(height - 500)+'px';
      }
    }
    /**
    
    */
    this.showText = function(currentDialog) {
      var _ele = document.createElement('div');
      var ele = document.createElement('div');
      ele.className = 'tooltip-arrow';
      _ele.className = 'tooltip fade top in';
      _ele.appendChild(ele);
      ele = document.createElement('div');
      ele.className = 'hans_bubble';
      ele.innerHTML = currentDialog.texts[0].text.replace(/#name#/g, this.getValueForKey('name'));
      _ele.appendChild(ele);
      _ele.style.position = 'relative';
      _ele.style.width = '50%';
      $('#game-inner').append(_ele);      
      $('#game-inner').append(document.createElement('br'));
      this.scrollToBottom();
      if (currentDialog.texts[0].next != null) {
        this.nextData(currentDialog.texts[0].next);
      }
    }
    /**

    */
    this.showKeyInput = function(currentDialog) {
      var _ele = document.createElement('div');
      var ele = document.createElement('div');
      ele.className = 'tooltip-arrow';
      ele.style.borderTopColor = '#ddd863';
      _ele.className = 'tooltip fade top in';  
      _ele.style.marginLeft = '51%';
      _ele.appendChild(ele);
      ele = document.createElement('input');
      ele.addEventListener('keyup', function(eve) {
        game.setKeyInput(eve, this, currentDialog.next, currentDialog.key);
      }, true);
      ele.setAttribute('autofocus', 'autofocus');
      ele.type = 'text';
      ele.className = 'you_input_bubble';
      var __ele = document.createElement('div');
      __ele.appendChild(ele);
      __ele.style.background = '#ddd863';
      __ele.style.borderRadius = '6px';
      __ele.style.width = '90%';
      _ele.appendChild(__ele);
      _ele.style.position = 'relative';
      
      $('#game-inner').append(_ele);
      $('#game-inner').append(document.createElement('br'));

    }
    /**

    */
    this.setKeyInput = function(eve, element, _nextDataId, _key) {
      console.log('setInputVar '+eve.keyCode+' + '+element.value+' + '+_key);
      if (eve.keyCode == 13) {
        this.setKeyValue(_key, element.value);  
        this.nextData(_nextDataId);
      }
    }
    /**

    */
    this.showInput = function(currentDialog) {
    
    }
    /**

    */
    this.validateInput = function(_dataId, _key, _value) {
    
    }    
    /**

    */
    this.showSelect = function(currentDialog) {
      var ele = document.createElement('div');
      ele.className = 'tooltip fade top in';
      ele.style.position = 'relative';
      ele.style.marginLeft = '51%';
      var _ele = document.createElement('div');
        _ele.className = 'tooltip-arrow';
        _ele.style.borderTopColor = '#ddd863'; 
        _ele.style.borderWidth = '9px 9px 0'; 
        _ele.style.bottom = '0'; 
        _ele.style.marginLeft = '0';
        ele.appendChild(_ele);
      for (var i = 0; i < currentDialog.texts.length; i++) {        
        _ele = document.createElement('div');
        _ele.className = 'you_button';
        _ele.setAttribute('onclick','game.nextData(\''+currentDialog.texts[i].next+'\');');
        //$(_ele).click( function() { game.validateSelection(currentDialog.uid, currentDialog.texts[i]); } );
        _ele.innerHTML = currentDialog.texts[i].text;
        ele.appendChild(_ele);
      }
      $('#game-inner').append(ele);
      this.scrollToBottom();
    }
    /**

    */
    this.validateSelection = function(_dataId, _key) {
      var dialogs = this.getData(_dataId);
      console.log(_key+', '+_dataId+', '+dialogs.right);
      if (this.isWrongSelection(dialogs, _key)) {  
        var next_data = this.getData(dialogs.next);
        var _ele = document.createElement('div');
        var ele = document.createElement('div');
        ele.className = 'tooltip-arrow';
        ele.style.borderTopColor = '#e00';
        _ele.className = 'tooltip fade top in';
        _ele.appendChild(ele);
        ele = document.createElement('div');
        ele.className = 'hans_bubble';
        ele.style.background = '#e00';
        ele.innerHTML = n_text.texts[0].text.replace(/#name#/g, this.getValueForKey('name'))
        _ele.appendChild(ele);
        _ele.style.position = 'relative';
        _ele.style.width = '50%';
        $('#game-inner').append(_ele);      
        $('#game-inner').append(document.createElement('br'));
        this.scrollToBottom();
        this.nextData(next_data.uid);
      } else {
        console.log('->text.right ');    
        //setTodoDone(text.todo);
        this.setPoints(dialogs.points);
        this.nextData(dialogs.right); 
      }
    }
    /**

    */
    this.isWrongSelection = function(dialogs, _key) {
      for (var i = 0; i < dialogs.wrong.length; i++) {
        if (dialogs.wrong[i] == _key) {
          return true; 
        }
      }
      return false;
    }
    /**

    */
    this.showTimer = function(currentDialog) {
    
    }
    /**

    */
    this.clearScreen = function(currentDialog) {
      if (currentDialog != null) {  
        //show the last textbox?

      }
    } 
    /**

    */
    this.setPoints = function(_p) {
      this.points = this.points + _p;
    }
    /**

    */
    this.updateInterval = function() {
      var time = Date.now();
      //console.log('updateInterval '+time);
      var len = game.intervalListeners.length;
      if (len > 0) {
        for (var i = len - 1; i >= 0; i--) {
          if (game.intervalListeners[i] != null) {
            if (time + game.intervalListeners[i].t >= game.intervalListeners[i].ot) {
              game.intervalListeners[i].m(time - game.intervalListeners[i].ot);  
              game.intervalListeners[i].ot = time;            
            }
          } else {
            game.intervalListeners.splice(i, 1);
          } 
        }       
      }
      /*if (!game.drawUpdate) {
        return; has to be placed in the loop
        look for gdbb
      }*/
      if (game.backbuffer == null) {
        return;
      }      
      game.ctx.drawImage(game.backbuffer, 0, 0, 480, 320);//screenWidth, screenHeight here 
      //only if it is canvasWidth and height!
    }
    /**
      a method that is the demonstrate the basics of the game-engine
        -requestAnimationFrame and 
        -an intervalListener for non animation related processes aka threads
        -double-buffering  
      missing a real implementation of real data
    */
    this.drawBackBuffer = function(tdif) {
      if (game.backbuffer == null) {
        game.backbuffer = createElement('canvas');
        game.backbuffer.width = game.bufferWidth;
        game.backbuffer.height = game.bufferHeight;
        game.btx = game.backbuffer.getContext('2d');
      }
      //console.log('drawBackBuffer -> '+tdif);
      //if (!game.drawUpdate) return;
      game.btx.fillStyle = 'rgba(169,221,185,0.95)';//#a9d1b9
      game.btx.strokeStyle = 'rgba(224,254,250,0.9)';
      var fontSize = 20;
      var textWidth = canvas.width;
      game.btx.font = 'normal '+fontSize+'px sans-serif';
      game.btx.textAlign = 'center';//'left','right'
      var leftMargin = game.btx.measureText(' ').width;

      var img = new Image();
      img.src = "http://hogventure.com/image/3piggies.jpg";
      game.btx.drawImage(img, 0, 0, game.bufferWidth, game.bufferHeight);//
      
      var cdialog = null;
      var _h = 0.005;
      var hz = 0;
      //console.log('draw game.historyOfIds.length = '+game.historyOfIds.length);
      game.btx.beginPath();
      for (var i = 0; i < game.historyOfIds.length; i++) {
        cdialog = game.getData(game.historyOfIds[i]);
        if (i % 2 == 0) {
          for (var j = 0; j < cdialog.texts.length; j++) {
            h = _h + hz * (21 / game.bufferHeight + 20/game.bufferHeight);
            if (j == cdialog.texts.length - 1) {
              game.canvasLeftBubble(game.btx, 0.025, h, game.bufferWidth, game.bufferHeight, 0.45, 21 / game.bufferHeight, cdialog.texts[j].text);
            } else {
              game.canvasSimpleBubble(game.btx, 0.025, h, game.bufferWidth, game.bufferHeight, 0.45, 21 / game.bufferHeight, cdialog.texts[j].text);
            }
            game.btx.strokeText(cdialog.texts[j].text, (0.025 + 0.225) * game.bufferWidth, fontSize + 1 + (h + 5 / game.bufferHeight) * game.bufferHeight);
            hz ++;
          }
        } else {
          hz += cdialog.texts.length;
          //game.canvasRightBubble(game.btx, 0.55, h, game.bufferWidth, game.bufferHeight, 0.40, 0.25, cdialog.texts[0].text);
        }        
      }      
      game.btx.closePath();
      game.btx.fill();
      game.btx.stroke();      
      
      game.btx.fillStyle = 'rgba(224,220,99,0.95)';//#ddd863
      game.btx.strokeStyle = 'rgba(224,254,250,0.9)';
      _h = 0.085;
      hz = 0;
      game.btx.beginPath();
      for (var i = 1; i < game.historyOfIds.length; i++) {
        cdialog = game.getData(game.historyOfIds[i]);        
        if (i % 2 == 0) {
          //game.canvasLeftBubble(game.btx, 0.05, h, game.bufferWidth, game.bufferHeight, 0.40, 0.25, cdialog.texts[0].text);
          //console.log(i+' '+h);
          hz += cdialog.texts.length;
        } else {
          for (var j = 0; j < cdialog.texts.length; j++) {
            h = _h + hz * (21 / game.bufferHeight + 20 / game.bufferHeight);
            if (j == cdialog.texts.length - 1) {
              game.canvasRightBubble(game.btx, 0.525, h, game.bufferWidth, game.bufferHeight, 0.45, 21 / game.bufferHeight, cdialog.texts[j].text);
            } else {
              game.canvasSimpleBubble(game.btx, 0.525, h, game.bufferWidth, game.bufferHeight, 0.45, 21 / game.bufferHeight, cdialog.texts[j].text);
            }
            game.btx.strokeText(cdialog.texts[j].text, (0.525 + 0.225) * game.bufferWidth, fontSize + 1 + (h + 5 / game.bufferHeight) * game.bufferHeight);
            hz++;
          }
        }
      }      
      game.btx.closePath();
      game.btx.fill();
      game.btx.stroke();   
      
      _h = 0.005;
      hz = 0;
      game.btx.fillStyle = '#000';
      for (var i = 0; i < game.historyOfIds.length; i++) {
        cdialog = game.getData(game.historyOfIds[i]);                
        for (var j = 0; j < cdialog.texts.length; j++) {   
          if (i % 2 == 0) {
          _h = 0.005;
          h = _h + hz * (21 / game.bufferHeight + 20 / game.bufferHeight);
          game.btx.fillText(cdialog.texts[j].text, (0.025 + 0.225) * game.bufferWidth, fontSize + 1 + (h + 5 / game.bufferHeight) * game.bufferHeight);          
          } else {
          _h = 0.085;
          h = _h + (hz - 1) * (21 / game.bufferHeight + 20 / game.bufferHeight);
          game.btx.fillText(cdialog.texts[j].text, (0.525 + 0.225) * game.bufferWidth, fontSize + 1 + (h + 5 / game.bufferHeight) * game.bufferHeight);
          }
          hz++;
          //console.log(cdialog.texts[j].text);
        }
      }
      //game.btx.fill();
      
      //requestAnimationFrame(game.drawBackBuffer);
      /*
      var fontSize = 20;
      var textWidth = canvas.width;
      btx.font = 'normal '+fontSize+'px serif';
      btx.textAlign = 'center';//'left','right'
      btx.fillStyle = '#000';
      btx.strokeStyle = 'rgba(51,51,51,0.75)';
      var leftMargin = ctx.measureText(' ').width;
      var texts = formatText(text, textWidth - 10);
      for (var i = 0; i < texts.length; i++) {
        switch (ctx.textAlign) {
          case 'center':
            btx.strokeText(texts[i], textWidth / 2, fontSize + 1 + fontSize * i);
            btx.fillText(texts[i], textWidth / 2, fontSize + 1 + fontSize * i);
          break;
          case 'right':
            //the right margin is zero, because each word ends with one space.
            btx.strokeText(texts[i], textWidth, fontSize + 1 + fontSize * i);
            btx.fillText(texts[i], textWidth , fontSize + 1 + fontSize * i);
          break;
          case 'left':
          default:
            //the left margin is 5 or one space in font-size.
            btx.strokeText(texts[i], leftMargin, fontSize + 1 + fontSize * i);
            btx.fillText(texts[i], leftMargin, fontSize + 1 + fontSize * i);
          break;
        }
      }
      */
    }
     /*########################################
      canvas functions
    #########################################*/
    
    /**
    @method formatText

    @since 20130616

    @param btx {context2d} the buffered context
    @param text {String} a one line string
    @param textWidth {int} the maximum width

    @return {String[]} the new lines of formated text
    */
    this.formatText = function(btx, text, textWidth) {
      var lines = text.split(/\r\n|\r|\n/g);
      console.log('lines -> '+lines.length);
      var newLines = [];
      var metrics = null;
      var nextLine = '';
      var words = null;    
      for (var j = 0; j < lines.length; j++) {
        words = lines[j].split(' ');
        for (var i = 0; i < words.length; i++) {
          metrics = btx.measureText(nextLine + words[i] + ' ');
          if (metrics.width < textWidth) {
            nextLine = nextLine + words[i] + ' ';
          } else {
            newLines.push(nextLine);
            nextLine = words[i] + ' ';
          } 
        }
        newLines.push(nextLine);
        nextLine = '';
      }
      return newLines;
    }
    /**
    @method canvasLeftBubble
    */
    this.canvasLeftBubble = function(btx, x, y, cw, ch, w, h, text) {
      //w = btx.font.textWidth(text);
      //h = btx.font.textHeight(text);
      
      btx.moveTo(x * cw, y * ch);
      btx.lineTo(x * cw + w * cw, y * ch);
      btx.bezierCurveTo(x * cw + w * cw, y * ch, x * cw + w * cw + 10, y * ch, x * cw + w * cw + 10, y * ch + 10);
      btx.lineTo(x * cw + w * cw + 10, y * ch + h * ch + 10 );
      btx.bezierCurveTo(x * cw + w * cw + 10, y * ch + h * ch + 10, x * cw  + w * cw +10, y * ch + h * ch + 20, x * cw  + w * cw, y * ch + h * ch + 20);
      btx.lineTo(x * cw + 20, y * ch + h * ch + 20);
      btx.lineTo(x * cw, y * ch + h * ch + 40);
      btx.lineTo(x * cw, y * ch + h * ch + 20);
      btx.bezierCurveTo(x * cw, y * ch + h * ch + 20, x * cw - 10, y * ch + h * ch + 20, x * cw - 10, y * ch + h * ch + 10);
      btx.lineTo(x * cw - 10, y * ch + 10);
      btx.bezierCurveTo(x * cw - 10, y * ch + 10, x * cw - 10, y * ch, x * cw, y * ch);
      
    }
    
    this.canvasRightBubble = function(btx, x, y, cw, ch, w, h, text) {
      //w = btx.font.textWidth(text);
      //h = btx.font.textHeight(text);//fsz * text.length
      
      btx.moveTo(x * cw, y * ch);
      btx.lineTo(x * cw + w * cw, y * ch);
      btx.bezierCurveTo(x * cw + w * cw, y * ch, x * cw + w * cw + 10, y * ch, x * cw + w * cw + 10, y * ch + 10);
      btx.lineTo(x * cw + w * cw + 10, y * ch + h * ch + 10 );
      btx.bezierCurveTo(x * cw + w * cw + 10, y * ch + h * ch + 10, x * cw  + w * cw +10, y * ch + h * ch + 20, x * cw  + w * cw, y * ch + h * ch + 20);
      btx.lineTo(x * cw + w * cw, y * ch + h * ch + 20);
      btx.lineTo(x * cw + w * cw, y * ch + h * ch + 40);
      btx.lineTo(x * cw + w * cw - 20, y * ch + h * ch + 20);
      btx.lineTo(x * cw, y * ch + h * ch + 20);
      btx.bezierCurveTo(x * cw, y * ch + h * ch + 20, x * cw - 10, y * ch + h * ch + 20, x * cw - 10, y * ch + h * ch + 10);
      btx.lineTo(x * cw - 10, y * ch + 10);
      btx.bezierCurveTo(x * cw - 10, y * ch + 10, x * cw - 10, y * ch, x * cw, y * ch);
    }

    this.canvasSimpleBubble = function(btx, x, y, cw, ch, w, h, text) {
      //w = btx.font.textWidth(text);
      //h = btx.font.textHeight(text);
      
      btx.moveTo(x * cw, y * ch);
      btx.lineTo(x * cw + w * cw, y * ch);
      btx.bezierCurveTo(x * cw + w * cw, y * ch, x * cw + w * cw + 10, y * ch, x * cw + w * cw + 10, y * ch + 10);
      btx.lineTo(x * cw + w * cw + 10, y * ch + h * ch + 10 );
      btx.bezierCurveTo(x * cw + w * cw + 10, y * ch + h * ch + 10, x * cw  + w * cw +10, y * ch + h * ch + 20, x * cw  + w * cw, y * ch + h * ch + 20);
      btx.lineTo(x * cw, y * ch + h * ch + 20);
      btx.bezierCurveTo(x * cw, y * ch + h * ch + 20, x * cw - 10, y * ch + h * ch + 20, x * cw - 10, y * ch + h * ch + 10);
      btx.lineTo(x * cw - 10, y * ch + 10);
      btx.bezierCurveTo(x * cw - 10, y * ch + 10, x * cw - 10, y * ch, x * cw, y * ch);
      btx.closePath();
    }
    /*
    var overview = [];

    function OverviewBubble(_x, _y, _w, _h) {
      this.x = _x;
      this.y = _y;
      this.w = _w;
      this.h = _h;

      this.moveTo = function(_dx, _dy) {
        this.x = this.x + _dx;
        this.y = this.y + _dy;
      }

      this.isHit = function(_x, _y) {
        return (this.x < _x && this.x + this.w > _x && this.y < _y && this.y + this.h > _y);
      }
    }*/
    /**

    */
    this.requestBackBuffer = function() {
      //console.log('requestBackBuffer');
      //if (!game.drawUpdate) {
      //only animate if needed!
      game.animationOldTime = game.animationTime;
      game.animationTime = Date.now();
      game.drawBackBuffer( game.animationTime - game.animationOldTime);
      //}
      requestAnimationFrame(game.requestBackBuffer);
    }
    /**
    this is the context of the game
    so this is why any function that is called from here
    refers to game instead of this (don't use this. -> use game.)
    */
    this.start = function() {
      //game = this;
      this.canvas = getElement('canvas');
      this.canvas.width = 480;
      this.canvas.height = 320;
      this.ctx = this.canvas.getContext('2d');
      this.intervalListeners = [];
      try {
        this.animationTime = Date.now();        
        //test_requestAnimationFrame(this.requestBackBuffer);
        requestAnimationFrame(this.requestBackBuffer);
      } catch (e) {
        this.addIntervalListener('gdbb', game.drawBackBuffer, 16);
      }    
      this.intervalId = setInterval(this.updateInterval, 10);
      //to abbond an interval call clearInterval!
    }
    /**
    
    */
    this.load = function(json) {
      var game = new GameAdventure();
      game.dialogs = [];
      for (var i = 0; i < json['dialogs'].length; i++) {
        game.dialogs = new GameDialog();
        game.dialogs.load(json['dialogs'][i]);
      }
      game.persons = [];
      for (var i = 0; i < json['persons'].length; i++) {
        game.persons = new GamePerson();
        game.persons.load(json['persons'][i]);
      }
      game.uid = json['uid'];
      game.title = json['title'];
   
      game.startDialog = json['startDialog'];
      game.textmanager = null;
      game.mediamanager = null;
      //this.game = game;
      this.dialogs = game.dialogs;
      //this.persons = game.persons;
    }
    /**
    
    */
    this.store = function() {
    
    }
    /**
    
    */
    this.openGame = function() {
    
    }
    /**
    
    */
    this.saveGame = function() {
    
    }
  }


  /*########################################
    basic functions
  #########################################*/

  /**
  @param id
  @return {HTMLDomElement} or null
  */
  function getElement(id) {
    return document.getElementById(id);
  }
  /**
  @param type
  @return {HTMLDomElement}
  */ 
  function createElement(type) {
    return document.createElement(type);
  }
  /**
  placebo method
  does nothing except that it posts this to the console
  use it for development to see if you have to implement
  an event, method, callback or not

  @param id
  */
  function doNothing(id) {
    console.log('method "'+id+'" not implemented');
  }
  

