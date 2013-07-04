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
@version 2013-06-30

@namespace Main
@namespace window
@since 2013-06-24
*/ 
/*
Available 'pages' to track with google 
analytics to visualize the user flow
editText
newText

lectureOne
lectureTwo
login
membership
about

we track pages even it is just a function
_gaq.push(['_trackPageview', '/use/about']);
*/
 
  (
  function(_pe) {
    /**
    @field pageEditor.dialogPage
    */
    _pe.dialogPage = null;
    /**
    @field pageEditor.dialogPage
    */
    _pe.userId = null;
    /**
    @field pageEditor.keyModifier 
    */
    _pe.keyModifier = false;
    /**
    @method pageEditor.navigateModifier
    
    @param eve
    */
    _pe.navigateModifier = function(eve) {
      //console.log('navigateModifier -> '+eve.keyCode);
      if (eve.keyCode == 17 && !_pe.keyModifier) { 
        _pe.keyModifier = true; 
      }
    }
    /**
    @method pageEditor.navigateTo

    @param eve
    */
    _pe.navigateTo = function(eve) {
      var kc = eve.keyCode;
      console.log('kc = '+kc+' '+_pe.keyModifier);
      if (!_pe.keyModifier) {
        var elem = eve.target;
        //console.log(elem);
        if (kc == 13) {
          //close or select textarea | or select option of menu, list, etc.
          
          if (elem == document.activeElement) {
            _pe.editText(elem.id, elem.getAttribute('data-index'));
          }
          _gaq.push(['_trackPageview', '/use/navigateTo/'+kc]);
        }
        if (kc == 37 || kc == 38 || kc == 39 || kc == 40) {
          //on key up|right|left|down        
          if (elem != document.body) {elem.blur();}
          var index = elem.tabIndex;
          console.log('tabindex = '+index);
          if (kc == 39 || kc == 40 ) {
            elem = _pe.getTabIndex(index+1);//up|right
          } else {
            elem = _pe.getTabIndex(index-1);//down|left
          }
          if (elem == null) {
            elem = (eve.target == document.body ? _pe.getTabIndex(0) : eve.target);
          }
          //console.log(elem);
          elem.focus();  
          _gaq.push(['_trackPageview', '/use/navigateTo/'+kc]);
        }
      } else {
        //keyboard shortcuts on 'ctrl' - 'Strg'

        //p - person

        //c - copy

        //v - paste

        //l - link

        //m - open/close menu
        if (kc == 77) {
          elem = getElement('menu_div');          
          if (elem.style.display == 'block') {
            elem.style.display = 'none';
          } else {
            elem.style.display = 'block'; console.log(elem.style.display); 
                    
          }        
          _pe.keyModifier = false; 
        }
        //e - edit if editable element

        //t - title

        //alt e | alt p - switch between edit and play mode

      }
      if (kc == 17) {
        _pe.keyModifier = false;
      }
    }
    /**

    */
    _pe.getTabIndex = function(_index) {
      var eles = document.getElementsByName('tab');
      //console.log('eles.length '+eles.length);
      for (var i = 0; i < eles.length; i++) {
        if (eles[i].tabIndex == _index) {
          return eles[i];
        }
      }
      return null;
    }
    /**

    */
    _pe.setTabIndeces = function() {
      var eles = document.getElementsByName('tab');
      for (var i = 0; i < eles.length; i++) {
        eles[i].setAttribute('tabindex', ''+i);
      }
      return null;
    }
    /**
    @method pageEditor.showMenu
    */
    _pe.showMenu = function() {    
      getElement('menu_div').style.display = 'block';
    }
    /**
    @method pageEditor.hashChanged
    */
    _pe.hideMenu = function() {
      getElement('menu_div').style.display = 'none';
    }
    /**
    @method pageEditor.

    @param _eve
    */
    _pe.hashChanged = function(_eve) {
      //console.log('hashChanged->new='+_eve.newURL);
      //console.log('hashChanged->old='+_eve.oldURL);
      console.log(_eve);
      var url = _eve.newURL;
      var hash = url.split('#')[1];
      switch (hash) {
        case 'github':
          _gaq.push(['_trackPageview', '/use/'+hash]);
          location.href = 'https://github.com/maltekosian/textfire/wiki';
        break;
        /*case 'login':
        break;
        case 'about':
        break;
        case 'membership':
        break;*/
        default:          
          //callChapter(hash);
        break;
      }
      _gaq.push(['_trackPageview', '/use/'+hash]);
    }
    /**
    @method pageEditor.addItem

    @param _item
    */    
    _pe.addItem = function(_item) {
      var all_items = localStorage.getItem(_item.uid);
      all_items.push({ value: _item, timestamp: Date.now() });
      localStorage.setItem(all_items);
    }
    /**
    @method pageEditor.hasItem

    @param _id
    @return {boolean}
    */
    _pe.hasItem = function(_id) {
      return (localStorage.getItem(_id) != null);
    }
    /**
    @method pageEditor.removeItem

    @param _id
    */
    _pe.removeItem = function(_id) {
      localStorage.removeItem(_id);
    }
    /**
    @method pageEditor.getItem

    @param _id
    @param _stamp optional
    */
    _pe.getItem = function(_id, _stamp) {
      var all_items = localStorage.getItem(_id);
      var item = all_items[all_items.length - 1];
      for (var i = all_items.length - 1; i >= 0; i--) {
        if (item.timestamp < all_items[i].timestamp) {
          item = all_items[i];
        }      
      }    
      return item;
    }
    /**
    @method pageEditor.getAllItemsForId

    @param _id
    */
    _pe.getAllItemsForId = function(_id) {
      return localStorage.getItem(_id);
    }
    /**
    @method pageEditor.formatText

    @param _text
    */
    _pe.formatText = function(_ele, _text) { 
      //_text = _text.replace(/\\t/g, '  ');
      var texts = _text.split('\\n');
      var spc = String.fromCharCode(160);
      _ele.appendChild(createTextNode(texts[0].replace(/\\t/g, spc+spc) ));
      if (texts.length > 1) {
        for (var i = 1; i < texts.length; i++) {
          _ele.appendChild(createElement('br'));
          _ele.appendChild(createTextNode(texts[i].replace(/\\t/g, spc+spc) ));
        }
      }   
    }
    /**

    */
    _pe.reformatText = function(_text) {
      _text = _text.replace(/<br>/g, '\\n');      
      _text = _text.replace(/&nbsp;&nbsp;/g, '\\t');
      return _text;
    }
    /**
    @method pageEditor.splitText

    @param _text
    */
    _pe.splitText = function(_text) {
      var texts = _text.split('\\'+'s');
      return texts;
    }
    /**
    @method pageEditor.showToolTip

    @param _id
    */
    _pe.showToolTip = function (_id, _text) {
      var ele = getElement(_id);
      //console.log(ele.offsetTop + '-' +ele.offsetLeft);
      var body = document.body;
      var n_ele = createElement('span');
      n_ele.setAttribute('id', 'tt_'+_id);
      n_ele.appendChild(createTextNode(_text));
      n_ele.style.position = 'absolute';
      n_ele.style.top = (ele.offsetTop-25)+'px';
      n_ele.style.left = (ele.offsetLeft)+'px';
      n_ele.style.background = 'rgba(254,254,255,0.95)';
      n_ele.style.zIndex = 10;
      n_ele.style.borderRadius = '10px';
      n_ele.style.padding = '5px';
      n_ele.style.boxShadow = '-1px -1px 1px rgba(51,51,51,0.5),' + 
                              '-1px 1px 1px rgba(51,51,51,0.5),' +
                              '1px -1px 1px rgba(51,51,51,0.5),' +
                              '2px 2px 2px rgba(51,51,51,0.5)';
      body.appendChild(n_ele);
    }
    /**
    @method pageEditor.hideToolTip

    @param _id
    */
    _pe.hideToolTip = function(_id) {
      try {
        //console.log('tt_'+_id);
        var ele = getElement('tt_'+_id);
        ele.parentNode.removeChild(ele);
      } catch (e) {
      }
    }
    /**
    @method pageEditor.editText

    @param _id
    */
    _pe.editText = function(_id, _index) {
      console.log('editText -> '+ _id);
      var ele = getElement(_id);
      var text = '';
      var textarea = createElement('textarea');
      if (_id == 'new_text') {
        _index = 0;
        _id = 'text_'+Date.now();
        ele.setAttribute('id', _id);
        ele.className = 'div';
        ele.style.color = '#000';
        ele.style.fontStyle = 'normal';
        //remove 'new text' textNode
        ele.removeChild(ele.childNodes[0]);
        ele.removeAttribute('onclick');
        var j_ele = createElement('li');
        j_ele.setAttribute('id', _id+'_'+_index);
        j_ele.setAttribute('tabindex', _index);
        j_ele.setAttribute('data-index', _index);
        j_ele.setAttribute('name', 'tab');
        //onclick
        //j_ele.setAttribute('onclick', 'pageEditor.editText(this.id, '+_index+');');        
        ele.appendChild(j_ele);        
        textarea.setAttribute('name', _id);
        textarea.setAttribute('id', 'area_'+_id+'_'+_index);
        textarea.setAttribute('data-index', _index);
        textarea.className = 'text-area';
        textarea.style.height = ele_height + 'px';          
        textarea.addEventListener('keyup', function(eve) { pageEditor.setEditText(eve); }, true);
        j_ele.appendChild(textarea);
        var _ele = createElement('li');
        _ele.setAttribute('id', 'new_text');
        _ele.className = 'div_25';
        _ele.setAttribute('onclick','pageEditor.editText(this.id, 0);');
        _ele.appendChild(createTextNode('new text'));
        document.body.appendChild(_ele);
        _gaq.push(['_trackPageview', '/use/newText']);
      } else {
        var parent_id = ele.parentNode.id.split('_');
        parent_id = parent_id[0]+'_'+parent_id[1];
        console.log('parent_id -> '+parent_id+', '+_index);
        text = JSON.parse(localStorage.getItem(parent_id))[_index];//ele.innerHTML;      
        var ele_height = ele.offsetHeight;
        console.log('ele_height -> '+ele_height);      
        ele.removeAttribute('onclick');
        ele.removeAttribute('onkeydown');
        ele.removeAttribute('onkeyup');
        textarea.value = this.reformatText(text.trim());
        textarea.setAttribute('name', parent_id);
        textarea.setAttribute('id', 'area_'+_id);
        textarea.setAttribute('data-index', _index);
        textarea.className = 'text-area';
        textarea.style.height =  ele_height + 'px';          
        textarea.addEventListener('keyup', function(eve) { pageEditor.setEditText(eve); }, true);
        var nodes = ele.childNodes;
        //remove the nodes, if this a new text even
        for (var j = nodes.length - 1; j >= 0; j--) {
          if (typeof(nodes[j]) != 'function' && typeof(nodes[j]) != 'undefined') {
            ele.removeChild(nodes[j]);
          } 
        }
        //add the textarea
        ele.appendChild(textarea);
        _gaq.push(['_trackPageview', '/use/editText']);
      }      
      this.setTabIndeces();
      textarea.focus();
    } 
    /**
    @method pageEditor.setEditText

    @param _eve
    */
    _pe.setEditText = function(_eve) {
      console.log('setEditText -> '+ _eve.target.id);
      console.log('setEditText -> '+ _eve.keyCode);
      var keycode = _eve.keyCode;
      if (keycode != 13) {
        ele = getElement(_eve.target.id);
        var text = ele.value;
        console.log('setEditText -> '+ text);
      } else {
        ele = getElement(_eve.target.id);
        var text = ele.value.replace(/\n/g,'');       
        var index = ele.getAttribute('data-index');
        var parent_id = _eve.target.name;
        console.log(parent_id + '->' + index +' '+_eve.target.id);
        ele = getElement(parent_id);
        //console.log(ele);
        ele.removeChild(getElement(_eve.target.id.replace(/area_/,'')));
        try {
          this.hideToolTip(parent_id);
        } catch(e) {
          console.log(e);
        }
        if (text.trim() != '') {
          var _texts = this.splitText(text);//do this only since lecture 3
          var texts = JSON.parse(localStorage.getItem(parent_id) );
          if (texts == null) {
            //case new text
            texts = _texts;
            //index = -1;
            _gaq.push(['_trackPageview', '/use/createNewText']);
          } 
          if (_texts.length > 1 && texts != null) {
            //do this only since lecture 3
            for (var i = 0; i < _texts.length; i++) {
              texts.splice(index, 1, _texts[i]);
              index++;
            }
            //selection text insert
            _gaq.push(['_trackPageview', '/use/insertSelectText']);
          } else {
            texts[index] = _texts[0];
          } 
          var nodes = ele.childNodes;
          for (var j = nodes.length - 1; j >= 0; j--) {
            if (typeof(nodes[j]) != 'function' && typeof(nodes[j]) != 'undefined') {
              ele.removeChild(nodes[j]);
            } 
          }
          for (var j = 0; j < texts.length; j++) {
            var j_ele = createElement('li');
            this.formatText(j_ele, texts[j]);             
            j_ele.setAttribute('id', parent_id+'_'+j);
            j_ele.setAttribute('tabindex', j);
            j_ele.setAttribute('data-index', j);
            j_ele.setAttribute('name','tab');
            j_ele.setAttribute('onclick', 'pageEditor.editText(this.id, '+j+');');
            j_ele.addEventListener('keydown', this.navigateModifier, true);
            j_ele.addEventListener('keyup', this.navigateTo, true);
            ele.appendChild(j_ele);
          }
          localStorage.setItem(parent_id, JSON.stringify(texts) );
          
          if (!this.hasTextInPage(parent_id)) {
            this.dialogPage.uids.push(parent_id);
            localStorage.setItem('dialogPage', JSON.stringify(this.dialogPage));
          }
        } else {
          
          var texts = JSON.parse(localStorage.getItem(parent_id) );
          if (texts == null || texts.length == 1) {          
            //full delete
            document.body.removeChild(ele);
            localStorage.removeItem(parent_id);
            this.deleteTextFromPage(parent_id);
            localStorage.setItem('dialogPage', JSON.stringify(this.dialogPage));
            _gaq.push(['_trackPageview', '/use/deleteFullText']);
          } else {
            //a splited text delete
            texts.splice(index, 1);
            var nodes = ele.childNodes;
            console.log(nodes);
            for (var j = nodes.length - 1; j >= 0; j--) {
              if (typeof(nodes[j]) != 'function' && typeof(nodes[j]) != 'undefined') {
                ele.removeChild(nodes[j]);
              } 
            }
            for (var j = 0; j < texts.length; j++) {
              var j_ele = createElement('li');
              this.formatText(j_ele, texts[j]);             
              j_ele.setAttribute('id', parent_id+'_'+j);
              j_ele.setAttribute('tabindex', j);
              j_ele.setAttribute('data-index', j);
              j_ele.setAttribute('name','tab');
              j_ele.setAttribute('onclick', 'pageEditor.editText(this.id, '+j+');');
              j_ele.addEventListener('keydown', this.navigateModifier, true);
              j_ele.addEventListener('keyup', this.navigateTo, true);
              ele.appendChild(j_ele);
            }
            localStorage.setItem(parent_id, JSON.stringify(texts) );
            _gaq.push(['_trackPageview', '/use/deleteSelectText']);
          }
        }   
        this.setTabIndeces();
        
        ele = getElement(_eve.target.id.replace(/area_/, ''));
        console.log(ele);
        ele.focus();
      }
      //keycode != 13
    }
    /**
    @method pageEditor.deleteTextFromPage

    @param _id
    */
    _pe.deleteTextFromPage = function(_id) {
      for (var i = this.dialogPage.uids.length - 1; i >= 0; i--) {
        if (this.dialogPage.uids[i] == _id) {
          this.dialogPage.uids.splice(i, 1);
        }
      }
    }
    /**
    @method pageEditor.hasTextInPage

    @param _id
    @return {boolean}
    */
    _pe.hasTextInPage = function(_id) {
      for (var i = this.dialogPage.uids.length - 1; i >= 0; i--) {
        //console.log('hasTextInPage -> "'+_id+'" "'+_pe.dialogPage.uids[i]+'"');
        if (this.dialogPage.uids[i] == _id) {
          return true;
        }
      }
      return false;
    }
    /**
    @method pageEditor.init
    */
    _pe.init = function() {
      window.addEventListener('hashchange', pageEditor.hashChanged, true);
      try {
        _pe.userId = JSON.parse(localStorage.getItem('userId'));
        if (_pe.userId == null) {
          _pe.userId = 'user_'+Date.now();
        }
        _pe.dialogPage = JSON.parse(localStorage.getItem('dialogPage'));
        if (_pe.dialogPage.userId == null) {
          //_pe.dialogPage.userId = 'user_'+Date.now();?
        }
        console.log(_pe.dialogPage);
      } catch (e) {
        console.log(e); 
      }   
      
      if (_pe.dialogPage == null) {
        //_pe.dialogPage = {userId: 'user_'+Date.now(), uids: [], timestamp: Date.now(), lan: 'en-us'};
        _pe.dialogPage = {uids: [], timestamp: Date.now(), lan: 'en-us'};
      }
      var bodies = document.body.childNodes;
      var new_text = null
      var save = false;
      for (var i = bodies.length - 1; i >= 0; i--) {
        var _id = bodies[i].id;
        if (typeof(_id) != 'undefined' && _id != 'new_text' &&
            _id != 'menu_div' && _id != 'menu_button' && 
            _id != null && _id != '') //if _id
        {        
          if (!_pe.hasTextInPage(_id)) {
            var eles = bodies[i].childNodes;
            var texts = [];
            var eles_id = null;
            for (var j = 0; j < eles.length; j++) {
              eles_id = eles[j].id;
              if (typeof(eles_id) != 'undefined' && eles_id != null && eles_id != '') {      
                texts.push(eles[j].innerHTML.trim());
              }
            }
            localStorage.setItem(_id, JSON.stringify(texts));
            _pe.dialogPage.uids.push(_id);
            save = true;
          }
          document.body.removeChild(bodies[i]);
        }
        if (_id == 'new_text') {
          new_text = bodies[i];
        }
      } //if _id end
      if (save) {
        _pe.dialogPage.uids.reverse();
        localStorage.setItem('dialogPage', JSON.stringify(_pe.dialogPage));
      }       
      var ele = null;
      var tabindex = 0;
      for (var i = 0; i < _pe.dialogPage.uids.length; i++) {
        ele = createElement('div');
        ele.setAttribute('id', _pe.dialogPage.uids[i]);
        //ele.appendChild( createTextNode(localStorage.getItem(_pe.dialogPage.uids[i]) ) ); 
        var texts = JSON.parse(localStorage.getItem(_pe.dialogPage.uids[i]) );
        if (texts != null) //a intermediate fix - remove after you fixed the text editing
        for (var j = 0; j < texts.length; j++) {
          var j_ele = createElement('li');
          _pe.formatText(j_ele, texts[j]); 
          
          j_ele.setAttribute('id', _pe.dialogPage.uids[i]+'_'+j);
          j_ele.setAttribute('name', 'tab');
          j_ele.setAttribute('tabindex', tabindex);
          j_ele.setAttribute('data-index', j);
          j_ele.setAttribute('onclick', 'pageEditor.editText(this.id, '+j+');');
          j_ele.addEventListener('keydown', _pe.navigateModifier, true);
          j_ele.addEventListener('keyup', _pe.navigateTo, true);
          ele.appendChild(j_ele);
          tabindex++;
        }
        ele.className = 'div';
       
        ele.setAttribute('onmouseover', 'pageEditor.showToolTip(this.id, this.id);'); 
        ele.setAttribute('onmouseout', 'pageEditor.hideToolTip(this.id);');
        document.body.appendChild(ele);
      }
      new_text.addEventListener('keydown', _pe.navigateModifier, true);
      new_text.addEventListener('keyup', _pe.navigateTo, true);
      document.body.appendChild(new_text);
      document.addEventListener('keyup', _pe.navigateTo, true);
      document.addEventListener('keydown', _pe.navigateModifier, false);
    }
    //return the instance of pageEditor
    return _pe;
  }   
  )(pageEditor);

  /***/
  function getElement(_id) {
    return document.getElementById(_id);
  }
  /***/
  function createElement(_type) {
    return document.createElement(_type);
  }
  /***/
  function createTextNode(_txt) {
    return document.createTextNode(_txt);
  }
