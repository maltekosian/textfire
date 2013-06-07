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
  

