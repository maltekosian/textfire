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

@namespace Editor
@namespace window
@since 2013-06-06
*/ 
  /**

  */
  var version = '20130607';
  /**
  the actual dialog, we work on
  @since 20130606
  */
  var currentDialog = null;
  /**
  a pseudo format
  {uid : 'uid auto generated', texts: [{uid: 'uid auto generated', text:'reference on base64 in textmanager', next: 'a uid reference', wrong: false, points : 0, method: '?here?or'}], image: 'null or a image src or reference', x:null, y:null, w:null, h: null, color:null}
  we will see how this going to be formated in real
  @since 20130606
  */
  var data = [];
  /**
  static array of possible methods to be called
  unsupported are 'showInput','showFinalSelect'
  @since 20130606
  */
  var methods = ['-default-','showText','showKeyInput','showSelect','showTimer','clearScreen'];
  
  /**
  @method addText

  an editor function

  @param _method the method to be used or -default- which is a synonym for showText
  @since 20130606
  */
  function addText(_method) {
    console.log('addText '+_method);
    if (_method == 'showSelect') {
      getElement('add_text_btn').setAttribute('onclick', 'addText(\''+_method+'\');');
      getElement('add_text_btn').style.visibility = 'visible';
    } else {
      getElement('add_text_btn').style.visibility = 'hidden';
    }
    var currentTexts = currentDialog.texts;
    var ele = getElement('text_box');
    var _ele = createElement('input');
    _ele.setAttribute('type','text');
    _ele.setAttribute('id','text_'+currentTexts.length);
    _ele.setAttribute('onchange','setText(\'text_'+currentTexts.length+'\');');
    ele.appendChild(_ele);
    _ele = createElement('select');
    _ele.setAttribute('id','text_'+currentTexts.length+'_dialog_next');
    _ele.setAttribute('onchange','setNextDialog(\'text_'+currentTexts.length+'\');');
    var __ele = null;
    //instead updateNextDialogSelects is used
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
    _ele.setAttribute('onchange','this.style.background!=\'rgb(0, 51, 51)\'|\'#003333\'?this.style.background=\'rgb(0, 51, 51)\':this.style.background=\'#fff\'');
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
    for (var j = 0; j < currentDialog.texts.length; j++) {    
      ele = getElement('text_'+j+'_dialog_next');
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

  adds and creates a new GameDialog to data
  @see saveDialog
  @see currentDialog
  @see newDialog
  @since 20130606
  */
  function addDialog() {
    saveDialog(currentDialog, newDialog);
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
    data.push(_dialog);   
    if (callback != null) {
      callback();
    }
  }
  /**
  @method newDialog

  an editor function

  creates a new currentDialog that will be saved if you call
  saveDialog or addDialog
  @since 20130606
  */
  function newDialog() {
    currentDialog = new GameDialog('dial_'+data.length);
    //data.push(currentDialog);
    getElement('text_box').innerHTML = '';
    addText(getElement('text_general_method').value);
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
  

