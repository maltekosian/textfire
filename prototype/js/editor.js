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
@version 2013-06-18

@namespace Editor
@namespace window
@since 2013-06-06
*/ 
  /**

  */
  var version = '20130618';

  var ctx = null;

  var canvas = null;
  /**
  the actual dialog, we work on
  @since 20130606
  */
  var currentDialog = null;
  /**
  the real format!
  @type AdventureGame
  @since 20120613
  */
  var game = null;
  /**
  a pseudo format
  {uid : 'uid auto generated', texts: [{uid: 'uid auto generated', text:'reference on base64 in textmanager', next: 'a uid reference', wrong: false, points : 0, method: '?here?or'}], image: 'null or a image src or reference', x:null, y:null, w:null, h: null, color:null}
  we will see how this going to be formated in real
  @since 20130606
  */
  var dialogs = [];
  /**

  @since 20130612
  */
  var persons = [];
  /**

  @since 20130612
  */
  var currentPerson = null;
  /**
  static array of possible methods to be called
  unsupported are 'showInput','showFinalSelect'
  @since 20130606
  */
  var methods = ['-default-','showText','showKeyInput','showSelect','showTimer','clearScreen'];
  
  /**
  @method addText

  an editor function
  addText adds a text and calls showText afterwards 
  called by the button or newDialog

  @param _method the method to be used or --- that is default 
  @since 20130606
  @see showText  
  @see newDialog
  */
  function addText(_method) {
    console.log('addText '+_method);    
    var text = new GameText('text_'+currentDialog.texts.length);
    if (_method == '---') {
      _method = 'showText';
    }
    text.method = _method;
    //currentDialog.method = _method;
    currentDialog.texts.push(text);
    showText(_method);
  }
  /**
  @method showText

  hides or shows the add text button
  showing all texts of the currentDialog

  @since 20130609
  */
  function showText(_method) {
    if (_method == 'showSelect') {
      getElement('add_text_btn').setAttribute('onclick', 'addText(\''+_method+'\');');
      getElement('add_text_btn').style.visibility = 'visible';
    } else {
      if (_method == '---') {
        _method = 'showText';
      }
      getElement('add_text_btn').style.visibility = 'hidden';
    }
    
    var currentTexts = currentDialog.texts;
    var ele = getElement('text_box');
    ele.innerHTML = '';
    for (var i = 0; i < currentTexts.length; i++) {
      var _ele = createElement('input');
      _ele.setAttribute('type','text');
      _ele.setAttribute('id','text_'+i);
      _ele.value = currentTexts[i].text;
      _ele.setAttribute('onchange','setText(\'text_'+i+'\');');
      ele.appendChild(_ele);
      _ele = createElement('select');
      _ele.setAttribute('id','text_'+i+'_dialog_next');
      _ele.setAttribute('onchange','setNextDialog(\'text_'+i+'\');');
      var __ele = null;
      
      ele.appendChild(_ele);
      
      _ele = createElement('br');
      ele.appendChild(_ele);
      _ele = createElement('div');
      _ele.className = 'uploader';
      ele.appendChild(_ele);
      
      __ele = createElement('span');
      __ele.setAttribute('id','upload_output'+i);
      __ele.className = 'upload_output';
      if (currentTexts[i].image == null) {
        __ele.appendChild(document.createTextNode('upload...'));
      } else {
        __ele.appendChild(document.createTextNode(currentTexts[i].image.name));
        ___ele = createElement('div');
        ___ele.style.width = '100px';
        ___ele.style.height = '100px';
        ___ele.style.backgroundImage = 'url('+ currentTexts[i].image.data +')';
        ___ele.style.backgroundSize = 'contain';
        ___ele.style.backgroundRepeat = 'no-repeat';
        ___ele.style.backgroundPosition = 'center center';
        __ele.appendChild(___ele);   
      }
      _ele.appendChild(__ele);
      __ele = createElement('input');
      __ele.setAttribute('type','file');
      __ele.setAttribute('id','upload_input'+i);
      __ele.className = 'upload_input';
      __ele.addEventListener('change', function(eve) { imageUpload(eve); }, true);//setAttribute('onchange','doNothing(this.id);');
      _ele.appendChild(__ele);         
      _ele = createElement('br');
      ele.appendChild(_ele);
      /*
      <div class="uploader" >
    <span id="output" style="width: 240px; margin-left: 5px; height: 20px; font-family: sans-serif;">upload...</span>
    <input type="file" id="image_upload'+i+' accept=".png, .jpg, .jpeg" style="position: relative; height: 20px; top: -20px; left: 0px; opacity: 0.005; width: 250px;" />  
  </div>
      */
    }
    
    updateNextDialogSelects();
  }
  /**
  @method updateNextDialogSelects

  an editor function

  if a new dialog is added this options have to be updated
  @since 20130606
  */
  function updateNextDialogSelects() {
    var ele = null; 
    var _ele = null; 
    var select = getElement('select_dialog');
    var _select = null; 
    var right = getElement('dialogs_inner_right'); 
    var _right = null;     
    for (var j = 0; j < currentDialog.texts.length; j++) {    
      ele = getElement('text_'+j+'_dialog_next');
      ele.innerHTML = '';
      right.innerHTML = '';
      select.innerHTML = '';
      for (var i = 0; i < game.dialogs.length; i++) {         
        _ele = createElement('option');
        _ele.value = game.dialogs[i].uid;
        _ele.appendChild(document.createTextNode(game.dialogs[i].uid + ' ' + (game.dialogs[i].texts.length > 0 ? game.dialogs[i].texts[0].text : '') ));
        if (game.dialogs[i].uid == currentDialog.texts[j].next) {
          _ele.setAttribute('selected', 'selected');
        }
        ele.appendChild(_ele);
        _select = createElement('option');
        _select.value = game.dialogs[i].uid;
        _select.appendChild(document.createTextNode(game.dialogs[i].uid + ' ' + (game.dialogs[i].texts.length > 0 ? game.dialogs[i].texts[0].text : '') ));
        if (game.dialogs[i].uid == currentDialog.uid) {
          _select.setAttribute('selected', 'selected');
        }
        select.appendChild(_select);
        _right = createElement('li');
        _right.appendChild(document.createTextNode(game.dialogs[i].uid + ' ' + (game.dialogs[i].texts.length > 0 ? game.dialogs[i].texts[0].text : '') ));
        _right.setAttribute('onclick','selectDialog(\''+game.dialogs[i].uid+'\');');
        right.appendChild(_right);
      }
    }
  }
  /**
  @method addDialog

  an editor function

  adds and creates a new GameDialog to game.dialogs
  @see saveDialog
  @see currentDialog
  @see newDialog
  @since 20130606
  */
  function addDialog() {
    //saveDialog(currentDialog, newDialog);
    newDialog();
  }
  /**
  @method saveDialog

  an editor function

  @param _dialog the currentDialog or ...?
  @param callback a function to call or null if you want to save only
  @since 20130606
  */
  function saveDialog(_dialog, callback) {
    //...?
    game.dialogs.push(_dialog);   
    if (callback != null) {
      callback();
    }
  }
  /**
  @method selectDialog

  interesting facts
  australian lives there since 50.000 bc
  with 250 languages and 600 dialects
  they inventeted smoothed sharped sanded axes 15.000 years 
  before any other human culture. The australian
  culture is the first and therefore oldest living
  culture of the humankind.
  Cooks mind was not sharp enough to understand those facts.

  @since 20130609
  */
  function selectDialog(dialogs_id) {
    var _d = null;
    if (dialogs_id == null) {
      dialogs_id = getElement('select_dialog').value;
      _d = getDialog(dialogs_id);
      if (_d == null) {
        console.log('no Dialog selected');
        return;
      }
    } else {
      _d = getDialog(dialogs_id);
      if (_d == null) {
        console.log('no Dialog for '+dialogs_id);
        return;
      }
    }
    currentDialog = _d;
    getElement('dialog_title').innerHTML = '';
    getElement('dialog_title').appendChild(document.createTextNode('dialog.uid: ' + currentDialog.uid));
    showText(currentDialog.method);//currentDialog.texts[0].method);
  }
  /**
  @method getDialog

  @since 20130609
  */
  function getDialog(dialogs_id) {
    for (var i = 0; i < game.dialogs.length; i++) {
      if (game.dialogs[i].uid == dialogs_id) {
        return game.dialogs[i];
      }
    }
    return null;
  } 
  /**
  @method newDialog

  an editor function

  creates a new currentDialog that will be saved if you call
  saveDialog or addDialog
  @since 20130606
  */
  function newDialog() {
    currentDialog = new GameDialog('dial_'+game.dialogs.length);
    game.dialogs.push(currentDialog);
    getElement('text_box').innerHTML = '';
    getElement('dialog_title').innerHTML = '';
    getElement('dialog_title').appendChild(document.createTextNode('dialog.uid: ' + currentDialog.uid));    
    currentDialog.method = getElement('text_general_method').value;
    currentDialog.method = currentDialog.method == '---' ? 'showText' : currentDialog.method;
    addText(currentDialog.method);
    var y = overview.length % 4;
    var x = (overview.length - y) / 4;
    overview.push(new OverviewBubble(0.015 + x * 0.25, 0.015 + 0.25 * y, 0.22, 0.2, currentDialog.uid));
    drawCanvas();
  }
  /**
  @method imageUpload

  @since 20130619
  @param eve {event} the onchange event registered on the element image_upload
  @see newDialog
  */
  function imageUpload(eve) {
    var elem = eve.target;
    var id = elem.id.replace(/_in/g,'_out');
    var index = parseInt(elem.id.replace(/upload_input/g,''));
    console.log('imageUpload '+ elem.id + ' - ' + id +' . '+index);    
    var file = eve.target.files[0];
    getElement(id).innerHTML = file.name;
    if (!file.type.match('image.*')) {
      return;
    }
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        var ele = createElement('div');
        ele.style.width = '100px';
        ele.style.height = '100px';
        ele.style.backgroundImage = 'url('+ e.target.result +')';
        ele.style.backgroundSize = 'contain';
        ele.style.backgroundRepeat = 'no-repeat';
        ele.style.backgroundPosition = 'center center';
        getElement(id).appendChild(ele);
        currentDialog.texts[index].image = {name : theFile.name, data : e.target.result};
      };
    })(file);
    // Read in the image file as a data URL.
    reader.readAsDataURL(file);
  }
  /**
  @method setText

  an editor function

  gets the text by id form the currentdialog - only from there!
  sets the value form the corresponding input element to [..].text
  (as reference)

  missing: add or update value in the textmanager and
  set the reference by using uidCounter.createNew(), if needed

  @param text_id the id of the text not neccessary the element
  @since 20130606
  */
  function setText(text_id) {
    getText(text_id).text = getElement(text_id).value;
  }
  /**
  @method setNextDialog

  an editor function

  gets the text by id form the currentdialog - only from there!
  sets the value form the corresponding input element 
  to [..].next reference -> a dialog

  @param text_id the id of the text not neccessary the element
  @since 20130607
  */
  function setNextDialog(text_id) {
    getText(text_id).next = getElement(text_id+'_dialog_next').value;
  }
  /**
  @method setIsWrong

  an editor function

  gets the text by id form the currentdialog - only from there!
  sets the value form the corresponding input element 
  to  [..].wrong r= true|false

  obsolete!?!

  @param text_id the id of the text not neccessary the element
  @since 20130607
  */
  function setIsWrong(text_id) {
    console.log('setIsWrong '+getElement('wrong_'+text_id).value);
    getText(text_id).wrong = getElement('wrong_'+text_id).value;
  }
  /**
  @method getText

  @param text_id the uid of the text 
  @return {GameText|null} the corresponding text from the currentdialog or null
  @since 20130607
  */
  function getText(text_id) {
    var currentTexts = currentDialog.texts;
    for (var i = 0; i < currentTexts.length; i++) {
      if (currentTexts[i].uid == text_id) {
        return currentTexts[i];
      }
    }
    return null;
  }
  /**
  @method selectPerson

  @param person_id
  @since 20130612
  */
  function selectPerson(person_id) {
    if (person_id == null) {
      person_id = getElement('select_person').value;
    }
    if (person_id == 'new person') {
      person_id = 'person_'+persons.length;
      persons.push(new GamePerson(person_id));
      var ele = getElement('select_person');
      ele.innerHTML = '';
      var _ele = createElement('option');
      _ele.appendChild(document.createTextNode('new person'));
      _ele.setAttribute('value','new person');
      ele.appendChild(_ele);
      for (var i = 0; i < persons.length; i++) {
        _ele = createElement('option');
        _ele.appendChild(document.createTextNode(persons[i].name));
        _ele.setAttribute('value',persons[i].uid);
        ele.appendChild(_ele);
      }  
      getElement('set_persons_name').value = '';
      getElement('set_persons_name').placeholder = 'a name of a person';
    } else {
      currentPerson = getPerson(person_id);
      currentDialog.personRef = currentPerson.uid;
      getElement('set_persons_name').value = currentPerson.name;
    }
  }
  /**
  @method setPersonsName

  @since 20130612
  */
  function setPersonsName() {
    if (currentPerson == null) {
      person_id = 'person_'+persons.length;
      persons.push(new GamePerson(person_id));
      currentPerson = getPerson(person_id);
    }
    currentPerson.name = getElement('set_persons_name').value;
    var ele = getElement('select_person');
    ele.innerHTML = '';
    var _ele = createElement('option');
    _ele.appendChild(document.createTextNode('new person'));
    _ele.setAttribute('value','new person');
    ele.appendChild(_ele);
    for (var i = 0; i < persons.length; i++) {
      _ele = createElement('option');
      _ele.appendChild(document.createTextNode(persons[i].name));
      _ele.setAttribute('value',persons[i].uid);
      ele.appendChild(_ele);
    }  
  }
  /**
  @method getPerson

  @param person_id
  @since 20130612
  */
  function getPerson(person_id) {
    for (var i = 0; i < persons.length; i++) {
      if (persons[i].uid == person_id) {
        return persons[i];
      }
    }
    return null;
  }
  /*########################################
    canvas functions
  #########################################*/

  /**
  @method canvasLeftBubble

  @since 20130608
  */
  function canvasLeftBubble(btx, x, y, cw, ch, w, h, text) {
    //w = btx.font.textWidth(text);
    //h = btx.font.textHeight(text);
    btx.beginPath();
    btx.moveTo(x * cw, y * cw);
    btx.lineTo(x * cw + w * cw, y * cw);
    btx.bezierCurveTo(x * cw + w * cw, y * cw, x * cw + w * cw + 10, y * cw, x * cw + w * cw + 10, y * cw + 10);
    btx.lineTo(x * cw + w * cw + 10, y * cw + 20 );
    btx.bezierCurveTo(x * cw + w * cw + 10, y * cw + 20, x * cw  + w * cw +10, y * cw + 30, x * cw  + w * cw, y * cw + 30);
    btx.lineTo(x * cw + 10, y * cw + 30);
    btx.lineTo(x * cw, y * cw + 40);
    btx.lineTo(x * cw, y * cw + 30);
    btx.bezierCurveTo(x * cw, y * cw + 30, x * cw - 10, y * cw + 30, x * cw - 10, y * cw + 20);
    btx.lineTo(x * cw - 10, y * cw + 10);
    btx.bezierCurveTo(x * cw - 10, y * cw + 10, x * cw - 10, y * cw, x * cw, y * cw);
  }
  /**
  @method canvasRightBubble

  @since 20130608
  */
  function canvasRightBubble(btx, x, y, cw, ch, w, h, text) {
    //w = btx.font.textWidth(text);
    //h = btx.font.textHeight(text);//fsz * text.length
    btx.beginPath();
    btx.moveTo(x * cw, y * cw);
    btx.lineTo(x * cw + w * cw, y * cw);
    btx.bezierCurveTo(x * cw + w * cw, y * cw, x * cw + w * cw + 10, y * cw, x * cw + w * cw + 10, y * cw + 10);
    btx.lineTo(x * cw + w * cw + 10, y * cw + 20 );
    btx.bezierCurveTo(x * cw + w * cw + 10, y * cw + 20, x * cw  + w * cw +10, y * cw + 30, x * cw  + w * cw, y * cw + 30);
    btx.lineTo(x * cw + w * cw, y * cw + 30);
    btx.lineTo(x * cw + w * cw, y * cw + 40);
    btx.lineTo(x * cw + w * cw - 10, y * cw + 30);
    btx.lineTo(x * cw, y * cw + 30);
    btx.bezierCurveTo(x * cw, y * cw + 30, x * cw - 10, y * cw + 30, x * cw - 10, y * cw + 20);
    btx.lineTo(x * cw - 10, y * cw + 10);
    btx.bezierCurveTo(x * cw - 10, y * cw + 10, x * cw - 10, y * cw, x * cw, y * cw);
  }
  /**
  @method canvasSimpleBubble

  @since 20130608
  */
  function canvasSimpleBubble(btx, x, y, cw, ch, w, h, text) {
    
    //w = btx.font.textWidth(text);
    //h = btx.font.textHeight(text);
    btx.beginPath();
    btx.moveTo(x * cw, y * cw);
    btx.lineTo(x * cw + w * cw, y * cw);
    btx.bezierCurveTo(x * cw + w * cw, y * cw, x * cw + w * cw + 10, y * cw, x * cw + w * cw + 10, y * cw + 10);
    btx.lineTo(x * cw + w * cw + 10, y * cw + 20 );
    btx.bezierCurveTo(x * cw + w * cw + 10, y * cw + 20, x * cw  + w * cw +10, y * cw + 30, x * cw  + w * cw, y * cw + 30);
    btx.lineTo(x * cw, y * cw + 30);
    btx.bezierCurveTo(x * cw, y * cw + 30, x * cw - 10, y * cw + 30, x * cw - 10, y * cw + 20);
    btx.lineTo(x * cw - 10, y * cw + 10);
    btx.bezierCurveTo(x * cw - 10, y * cw + 10, x * cw - 10, y * cw, x * cw, y * cw);
  }
  /**
  @method formatText

  @since 20130616

  @param btx {context2d} the buffered context
  @param text {String} a one line string
  @param textWidth {int} the maximum width

  @return {String[]} the new lines of formated text
  */
  function formatText(btx, text, textWidth) {
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
  @since 20130609
  */
  var overview = [];
  /**
  @since 20130609
  */
  function OverviewBubble(_x, _y, _w, _h, _id) {
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.dialogRef = _id;

    this.moveTo = function(_dx, _dy) {
      this.x = this.x + _dx;
      this.y = this.y + _dy;
    }

    this.isHit = function(_x, _y) {
      return (this.x < _x && this.x + this.w > _x && this.y < _y && this.y + this.h > _y);
    }
  }
  /**
  draws the overview
  @since 20130613
  */
  function drawCanvas() {
    if (ctx == null) {
      canvas = getElement('canvas');
      canvas.width = 480;
      canvas.height = 320;
      ctx = canvas.getContext('2d');
    }
    
    ctx.strokeStyle = 'rgba(205,205,205,0.9)';
    ctx.fillStyle = 'rgba(205,205,205,0.9)';
    for (var i = 0; i < overview.length; i++) {
      ctx.fillRect(overview[i].x * 480, overview[i].y * 320, overview[i].w * 480, overview[i].h * 320);
      ctx.strokeRect(overview[i].x * 480, overview[i].y * 320, overview[i].w * 480, overview[i].h * 320);
    }
  }

  /*########################################
    store and load functions
  #########################################*/

  function saveGame() {
    getElement('data_put').value = JSON.stringify(game);
  }

  function loadGame() {
    //game 
    drawCanvas();
  }

  function newGame() {
    game = new AdventureGame();
    newDialog();
    drawCanvas();
  }

  function copyToClipboard() {
    var text = getElement('data_put').value;
    if (window.clipboardData) // Internet Explorer
    {  
       window.clipboardData.setData("Text", text);
    } else {  
        /*unsafeWindow.netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
        var clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);  
        clipboardHelper.copyString(text);*/
      getElement('data_put').focus();
      getElement('data_put').select();
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
  

