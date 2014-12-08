var _regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var userMe = {
  id : 0,
  name : ''
};

	function sendLoginRequest() {			
		var ps = document.getElementById('login_password').value;
		var shaObj = new jsSHA(ps, "ASCII");
    var p = shaObj.getHash("SHA-512", "HEX");
    console.log('send login '+p);
		var e = document.getElementById('login_email').value;
		if (!validateEmail(e))
		{
			return;
		}
		document.getElementById('login_email').value ='';
		document.getElementById('login_password').value = '';
		$.ajax({
			url: 'http://textfire.co/merger/xhr_login.php?email='+encodeURI(e)+'&p='+p,
			cache: false,
			type: "POST",
			async: true,
			crossDomain: true,
			dataType: "jsonp",
			jsonp: "callback",
			jsonpCallback: "loginHog"//this is the function name
		});
	}

  function showRegisterRequest() {
    getElement('login_passrepeat').className = 'visible'; 
    getElement('login_username').className = 'visible'; 
    getElement('login_register').className = 'visible';
    getElement('login_login').className = 'hidden'; 
    getElement('login_passrequest').className = 'hidden'; 
    getElement('login_password').className = 'visible'; 
  }

	function sendRegisterRequest() {
		console.log('sendRegisterRequest()');
		var ps = document.getElementById('login_password').value;
		var shaObj = new jsSHA(ps, "ASCII");
    var p = shaObj.getHash("SHA-512", "HEX");
		if (document.getElementById('login_password').value != document.getElementById('login_passrepeat').value )
		{
			document.getElementById('login_password').value = 'passwords does not match';
		  document.getElementById('login_passrepeat').value = '';
      return;
		}  
		console.log('send register '+p);
		var u = document.getElementById('login_username').value;
		if (u.length < 6)
		{
			return;
		}
		var e = document.getElementById('login_email').value;
		if (!validateEmail(e))
		{
			getElement('login_email').innerHTML = 'wrong email';
			return;
		}
		document.getElementById('login_username').value = '';
		document.getElementById('login_password').value = '';
		document.getElementById('login_passrepeat').value = '';
		document.getElementById('login_email').value = '';
		$.ajax({
			url: 'http://textfire.co/merger/xhr_register.php?email='+encodeURI(e)+'&p='+p+'&u='+encodeURI(u),
			cache: false,
			type: "POST",
			async: true,
			crossDomain: true,
			dataType: "jsonp",
			jsonp: "callback",
			jsonpCallback: "loginHog"//this is the function name
		});		
	} 

	function validateEmail(email) { 
		return _regex.test(email);
	} 

	function loginHog(data) {
    console.log(data.username+', '+data.userid);
    userMe.id = data.userid;
    userMe.name = data.username;
		setCookie('hogventure', 'username:'+data.username+', userid:'+data.userid, 2);
		getElement('login_prompt').className = 'hidden';
    
    initWebsocket();
    //onlineLogin = true;
    //showOnlineProjects();
	}

  function hogRegistered(last) {
    console.log(last);
    getElement('login_passrepeat').className = 'hidden'; 
    getElement('login_username').className = 'hidden'; 
    getElement('login_register').className = 'hidden';
    getElement('login_login').className = 'visible'; 
    getElement('login_passrequest').className = 'hidden'; 
    getElement('login_password').className = 'visible'; 
  }

	function setCookie(c_name,value,exhours) {
		var exdate = new Date();
		exdate.setTime(Date.now() + 3600000 * exhours);
		var c_value = escape(value) + ((exhours == null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
	}

	function getCookie(c_name) {
		var i, x, y, ARRcookies = document.cookie.split(";");
		for (i = 0; i < ARRcookies.length; i++)
		{
			x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
			y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x = x.replace(/^\s+|\s+$/g,"");
			if (x == c_name)
			{
				return unescape(y);
			}
		}
	}
//password reset functions
function showPasswordRequest() {
  getElement('login_passrepeat').className = 'hidden'; 
  getElement('login_password').className = 'hidden'; 
  getElement('login_username').className = 'hidden'; 
  getElement('login_register').className = 'hidden';
  getElement('login_login').className = 'hidden';
  getElement('login_passrequest').className = 'visible';
}

function sendPasswordRequest() {
  //send xhr
  //feedback email send
  //close prompt
  var email = getElement('login_email').value;
  //validate email
  if (!validateEmail(email)) {
    return;
  }
  $.ajax({
			url: 'http://textfire.co/merger/xhr_request_password.php?email='+encodeURI(email),
			cache: false,
			type: "POST",
			async: true,
			crossDomain: true,
			dataType: "jsonp",
			jsonp: "callback",
			jsonpCallback: "closePasswordRequest"//this is the function name
		});		
}

function closePasswordRequest(data) {
  getElement('login_prompt').className = 'hidden';
  var args = [];
  args[0] = document.createTextNote(data);
  showPrompt('password request:',args,[['closePrompt();','close']]);
}
//send invite functions
function showInvite() {
  var args = [];
  args[0] = document.createElement('input');//new_user.email
  args[0].setAttribute('id', 'new_user_email');
  args[0].setAttribute('placeholder', 'email of the invited user');
  args[0].style.width = '96.5%';
  args[0].style.maxWidth = '96.5%';
  args[0].style.margin = '0.5%';
  args[0].style.textAlign = 'left';
  args[0].style.cssFloat = 'left';
  args[0].style.fontSize = '100%';
  args[1] = document.createElement('input');
  args[1].setAttribute('id', 'new_user_name');
  args[1].setAttribute('placeholder', 'the real name of the invited user.');
  args[1].style.width = '96.5%';
  args[1].style.maxWidth = '96.5%';
  args[1].style.margin = '0.5%';
  args[1].style.textAlign = 'left';
  args[1].style.cssFloat = 'left';
  args[1].style.fontSize = '100%';
  args[2] = document.createElement('textarea');//user.text
  args[2].setAttribute('id', 'project_text');
  args[2].setAttribute('placeholder', 'add a personal message');
  args[2].style.width = '96.5%';
  args[2].style.height = '26.5%';
  args[2].style.maxWidth = '96.5%';
  args[2].style.margin = '0.5%';
  args[2].style.textAlign = 'left';
  args[2].style.cssFloat = 'left';
  args[2].style.fontFamily = 'monospace';
  args[2].style.fontSize = '75%';
  args[3] = document.createTextNode('The default text contains your email address and user name. It will be attached to the invitation email.');// (pm)
  //send button -> sendInvite()
  //dismiss button
  showPrompt('invite one person to the current project "'+project.getTitle()+'"', args, [['sendInvite()','send invite'],['closePrompt();','dismiss']]);
}

function sendInvite() {
	//userMe.id
	//project.uid
	//new_user.email
	//user.text
	//xhr request to xhr_invite.php
	//POST
	//json
	//closeInvite
  var nue = getElement('new_user_email').value;
  if (nue.split(',').length > 1 || !validateEmail(nue))
  {
    closePrompt();
    return;
  }
  var nu = getElement('new_user_name').value;
  var ptx = getElement('project_text').value;
  $.ajax({
			url: 'http://textfire.co/merger/xhr_invite.php?nue='+encodeURI(nue)+'&nu='+Base64.encode(nu)+ 
        '&pun='+Base64.encode(userMe.Name)+'&ptx='+Base64.encode(ptx)+'&pid='+encodeURI(project.uid)+
        '&pt='+Base64.encode(project.getTitle())+'&puid='+userMe.id,
			cache: false,
			type: "POST",
			async: true,
			crossDomain: true,
			dataType: "jsonp",
			jsonp: "callback",
			jsonpCallback: "closeInvite"//this is the function name
		});		
}

function closeInvite(data) {
  console.log('closeInvite = '+data);
	data = (data == 'success' ? 'email invite has been send.' : 'sending the email failed.');

  showPrompt(data, null, [['closePrompt();','done']]);
}
//view invites functions
function requestInvitesList() {
	//xhr -> request_invites userMe.id
	//json
	//POST
	//showInvitesList
  //return;
  $.ajax({
			url: 'http://textfire.co/merger/xhr_request_invites.php?uid='+userMe.id,
			cache: false,
			type: "POST",
			async: true,
			crossDomain: true,
			dataType: "jsonp",
			jsonp: "callback",
			jsonpCallback: "showInvitesList"//this is the function name
		});		
}

function showInvitesList(data) {
  var invite_list = [];
  invite_list[0] = data;
  //if (invite_list.length > 0) {
  if (invite_list[0].project_id != null) {
    var args = [];
    var i = 0;
    //for (var i = 0; i < invite_list.length; i++) {
      args[i] = document.createElement('div');
      args[i].appendChild(document.createTextNode('accept '));
      var e =	document.createElement('input');
      e.setAttribute('type','checkbox');
      e.setAttribute('value', invite_list[i].project_id);
      e.setAttribute('id','check_'+i+'_accept');
      args[i].appendChild(e);
      args[i].appendChild(document.createTextNode(' | deny '));
      e =	document.createElement('input');
      e.setAttribute('type','checkbox');
      e.setAttribute('value', invite_list[i].project_id);
      e.setAttribute('id','check_'+i+'_deny');
      args[i].appendChild(e);
      e =	document.createElement('br');
      //
      args[i].appendChild(e);
      e =	document.createElement('span');
      e.setAttribute('id', 'title_'+invite_list[i].project_id);
      e.setAttribute('name', invite_list[i].project_title);
      e.appendChild(document.createTextNode('Title: '+Base64.decode(invite_list[i].project_title)));
      args[i].appendChild(e);
      args[i].style.border = 'solid #999 1px';
      args[i].style.borderRadius = '5px';
      args[i].style.boxShadow = '3px 3px 5px #999';
      args[i].style.background = 'rgba(224,224,224,0.8)';
      args[i].style.width = '95.5%';
      args[i].style.maxWidth = '95.5%';
      args[i].style.margin = '1%';
      args[i].style.fontSize = '100%';
    //}
    showPrompt('select invites to accept the invitation, so you join the project, '+
                'leave the checkboxes blank for a future decission, or check delete to ignore the invite.',
                args,[['closeInvitesList();','select invites'],['closePrompt();','dismiss']]);
    //with list of project invites
    //user may join activly any project he is invited to.
  } else {
    showPrompt('No invites.', null, [['closePrompt();', 'close']]);
  }
}

function closeInvitesList() {
  //read the selected values and add the accepted projects to the 
  //firebase(projects/userMe.id/) list done
  //delete all invites denied or accepted -> xhr_delete_invite.php
  var i = 0;
  //var myref_projects_list = myref.child('projects/'+userMe.id); // the user must be logged in!
  while (getElement('check_'+i+'_accept') != null)
  {
    var a = getElement('check_'+i+'_accept').checked;
    var d = getElement('check_'+i+'_deny').checked;
    console.log('closeInvitesList accept '+a+' ,deny '+d);
    if (a == 'checked' || a) {
      var a_id = getElement('check_'+i+'_accept').value;
      var a_title = getElement('title_'+a_id).innerHTML;
      a_title = a_title.substr(7, a_title.length - 1);
      console.log('title_'+a_id+' => '+a_title);
      //myref_projects_list.child(a_id).set({title : ''+Base64.encode(a_title)});
      var data = { callback: 'saveProjectToList', data:{projectId: a_id, userId: userMe.id, title :  ''+Base64.encode(a_title)}};
      wsSend(JSON.stringify(data), true);
    }
    i++;
  }
  closePrompt();
}