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
@version 2013-06-06

@namespace Editor
@namespace window
@since 2013-06-06
*/ 
  /**
  the actual dialog, we work on
  */
  var currentDialog = null;
  /**
  a pseudo format
  {uid : 'uid auto generated', texts: [{uid: 'uid auto generated', text:'reference on base64 in textmanager', next: 'a uid reference', wrong: false, points : 0, method: '?here?or'}], image: 'null or a image src or reference', x:null, y:null, w:null, h: null, color:null}
  we will see how this going to be formated in real
  */
  var data = [];
  /**
  static array of possible methods to be called
  unsupported are 'showInput','showFinalSelect'
  */
  var methods = ['-default-','showText','showKeyInput','showSelect','showTimer','clearScreen'];
  
  /**
  @method addText

  an editor function
  */
  function addText() {
    var currentTexts = currentDialog.texts;
    var ele = getElement('text_box');
    var _ele = createElement('input');
    _ele.setAttribute('type','text');
    _ele.setAttribute('id','text_'+currentTexts.length);
    onchange="doNothing(this.id)";
    ele.appendChild(_ele);
    _ele = createElement('select');
    _ele.setAttribute('id','text_'+currentTexts.length+'_next');
    _ele.setAttribute('onchange','doNothing(this.id);');
    var __ele = null;
    /*for (var i = 0; i < data.length; i++) {
      __ele.createElement('option');
      __ele.value = data[i].uid;
      __ele.appendChild(document.createTextNode(data[i].uid + ' ' + (data[i].texts.length ? data[i].texts[0] : '') ));
      _ele.appendChild(__ele);
    }*/
    ele.appendChild(_ele);
    _ele = createElement('input');
    _ele.setAttribute('type','checkbox');
    _ele.setAttribute('onchange','doNothing(this.id);');
    ele.appendChild(_ele);
    _ele.setAttribute('id','wrong_text_'+currentTexts.length);
    _ele.setAttribute('onchange','doNothing(this.id);');
    ele.appendChild(_ele);
    /*_ele = createElement('select');
    _ele.setAttribute('id','text_'+currentTexts.length+'_method');
    for (var i = 0; i < methods.length; i++) {
      __ele = createElement('option');
      __ele.value = methods[i];
      __ele.appendChild(document.createTextNode(methods[i]));
      _ele.appendChild(__ele);
    }
    _ele.setAttribute('onchange','doNothing(this.id);');
    ele.appendChild(_ele);*/
    _ele = createElement('br');
    ele.appendChild(_ele);
    var text = new GameText('text_'+currentTexts.length);
    currentDialog.texts.push(text);
    updateNextTextSelects();
  }
  /**
  @method updateNextTextSelects

  an editor function
  */
  function updateNextTextSelects() {
    var ele = null; 
    var _ele = null; 
    for (var j = 0; j < currentDialog.texts.length; j++) {    
      ele = getElement('text_'+j+'_next');
      ele.innerHTML = '';
      for (var i = 0; i < data.length; i++) {         
        _ele = createElement('option');
        _ele.value = data[i].uid;
        _ele.appendChild(document.createTextNode(data[i].uid + ' ' + (data[i].texts.length > 0 ? data[i].texts[0].text : '') ));
        ele.appendChild(_ele);
      }
    }
  }
  /**
  @method addDialog

  an editor function
  */
  function addDialog() {
    currentDialog = new GameDialog('dial_'+data.length);
    data.push(currentDialog);
    getElement('text_box').innerHTML = '';
    addText();
  }

  /*########################################
    basic functions
  #########################################*/

  function getElement(id) {
    return document.getElementById(id);
  }

  function createElement(type) {
    return document.createElement(type);
  }

  function doNothing(id) {
    console.log('method "'+id+'" not implemented');
  }
  

