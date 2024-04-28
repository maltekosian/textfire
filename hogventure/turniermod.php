<?php
	$turnier_submit = $_POST["turnier_submit"];
	if (!$turnier_submit) $turnier_submit = "login";

	/**fake datenbank**/
	$turnier_game_data = array (3 => 'spielerei', 20 => 'ein spiel', 45 => 'noch n spiel');
?>
<html>
<head>
<style type="text/css">
/***************************htmltags***********************************/

ul {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 12px; border: solid 1px #dddddd; overflow: hidden; }
li {margin: 0px; margin-left: 25px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 12px; background: #dddddd; }
form { margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; background: #ddffdd; visibility: hidden; display: none; }
input {margin: 0px; padding: 0px; width: 300px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; background: #eeff99; border: solid 1px #333333; }
select {margin: 0px; padding: 0px; width: 300px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; background: #eeff99; border: solid 1px #333333; }
option {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; background: #eeff99; border: solid 0px #333333;}
b {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; font-weight: bold; background-color: #ff9999;}
a {text-decoration: none; font-family: Courier New, Courier, typewriter, monospaced; font-size: 12px; color: #333366; }
a:hover {text-decoration: none; font-family: Courier New, Courier, typewriter, monospaced; font-size: 12px; color: #333366; background-color: #ddeeff;}
/***************************classes***********************************/

.input_readonly {margin: 0px; padding: 0px; width: 300px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; background: #ddee33; border: solid 1px #333333;}
.aktiv { visibility: visible; display: block; }
.inaktiv { visibility: hidden; display: none; }
/***************************ids***********************************/

#output_amount_mitspieler {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; font-weight: bold; background-color: #ff9999;}
#output_amount_freunde {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; font-weight: bold; background-color: #ff9999;}
#spiel_punkte {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; font-weight: bold; background-color: #ff9999;}
#spiel_gewonnen {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; font-weight: bold; background-color: #ff9999;}
#spieler_ergebnisse {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; font-weight: bold; background-color: #ff9999;}
#output_nicknamen_mitspieler {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; background-color: #eeff99; width: 300px; height: 50px; border: solid 1px #333333; overflow: scroll; overflow-y: scroll; overflow-x: hidden; }
#input_mitspieler {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; background-color: #eeff99; width: 300px; height: 50px; border: solid 1px #333333; overflow: scroll; overflow-y: scroll; overflow-x: hidden; }
#output_spielergebniss {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; background-color: #eeff99; width: 300px; height: 75px; overflow: always; border: solid 1px #333333; visibility: hidden; display: none; overflow: scroll; overflow-y: scroll; overflow-x: hidden; }
#turnier_widerspruch {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 11px; font-weight: bold; background-color: #eeff99; width: 300px; height: 50px; overflow: always; border: solid 1px #333333; }


</style>
<?php
	echo '<script type="text/javascript">';
	switch ($turnier_submit) {
		case "spiel starten": echo 'var aktivelement = \'output_spielergebniss\'; </script><style type=\"text/css\">#output_spielergebniss '; break;
		case "spieler herausfordern":
		case "freund einladen": echo 'var aktivelement = \'turnier_form_spiel_starten\'; </script><style type="text/css">#turnier_form_spiel_starten '; break;
		case "spiel aussuchen": echo 'var aktivelement = \'turnier_form_freund_einladen\'; </script><style type=\"text/css\">#turnier_form_freund_einladen '; break;
		case "anmelden": echo 'var aktivelement = \'turnier_form_spiel_aussuchen\'; </script><style type="text/css">#turnier_form_spiel_aussuchen '; break;
		case "login": 
		default: echo 'var aktivelement = \'turnier_form_login\'; </script><style type="text/css">#turnier_form_login ';
			break;
	}
	echo '{visibility: visible; display: block; }</style>';
?>
<script type="text/javascript">

	function setFormVisible(ename, ename2) {
		var element = document.getElementById(ename);
		var element2 = document.getElementById(ename2);
		var a_element = document.getElementById(aktivelement);
		if ( ename == aktivelement) {
			if (aktivelement != '') {
				a_element.style.visibility = "hidden";
				a_element.style.display = "none";
			}
			element.style.visibility = "hidden";
			element.style.display = "none";
			aktivelement = ename2;
			if (ename2 != '') {
				element2.style.visibility = "visible";
				element2.style.display = "block";
			}
		} else {
			if (aktivelement != '') {
				a_element.style.visibility = "hidden";
				a_element.style.display = "none";
			}
			if (ename2 != '') {
				element2.style.visibility = "hidden";
				element2.style.display = "none";
			}
			element.style.visibility = "visible";
			element.style.display = "block";
			aktivelement = ename;
		}
	}

	var spielernamen = new Array();

	function containsSpieler(spielername) {
		for (var i = 0; i < spielernamen.length; i++) {
			if (spielernamen[i] == spielername) {
				return true;
			}
		}
		return false;
	}

	function addSpieler(spielername) {
		if (!containsSpieler(spielername) && spielernamen.length < 3) {
			spielernamen[spielernamen.length] = spielername ;
		}
		printSpieler();
	}

	function printSpieler() {
		var element = document.getElementById('output_nicknamen_mitspieler');
		element.innerHTML = '<input type="hidden" value="'+spielernamen.length+'" name="mitspieler_max" >';
		for (var i = 0; i < spielernamen.length; i++) {
			element.innerHTML = element.innerHTML +'<span onclick="removeSpieler(\''+spielernamen[i]+'\');">'+ spielernamen[i] +'</span><input type="hidden" value="'+ spielernamen[i] +'" name="mitspieler_'+ i +'"/ ><br />';
		}	
		document.getElementById('output_amount_mitspieler').innerHTML = ' '+spielernamen.length+' ';
	}

	function removeSpieler(spielername) {
		var spn = new Array();
		var j = 0;
		for (var i = 0; i < spielernamen.length; i++) {
			if (spielernamen[i] == spielername) {
				spielernamen[i] = '';
			} else {
				spn[j] = spielernamen[i];
				j++;
			}
		}
		spielernamen = spn;
		printSpieler();
	}
</script>
</head>
<body>
<div style="width: 400px;">
<?php echo '<!--'.$turnier_submit.'<br /-->'; ?>
<ul >
<li>anmelden<br /><form id="turnier_form_login" class="inaktiv" action="turniermod.php" method="post" ><input type="text" value="nickname.oder@adresse.de" name="turnier_email"><br /><input type="password" value="passwort" name="pass"><br /><input type="submit" value="anmelden" name="turnier_submit"></form></li>
<li>Spiel aussuchen<form id="turnier_form_spiel_aussuchen" class="inaktiv" action="turniermod.php" method="post" ><input type="text" value="<?php echo $_POST["turnier_email"]; ?>" name="turnier_email" class="input_readonly" readonly="readonly"><br /><select name="turnier_game">
<?php
	foreach ($turnier_game_data as $key => $value)
	echo'<option value="'.$key.'">'.$value.'</option>';
?>
</select><br /><input type="submit" value="spiel aussuchen" name="turnier_submit"></form></li>
<li>Mitspieler finden
	<ul class="inaktiv" id="ul_mitspieler_finden">
	<li><a href="javascript:setFormVisible('turnier_form_freund_einladen', 'turnier_form_herausfordern')">einen Freund einladen</a> (E-Mail) <br />
	<form id="turnier_form_freund_einladen" action="turniermod.php" method="post" >Du hast schon<span id="output_amount_freunde"> 0 </span>von<b> 5 </b>Freunden eingeladen.<br />Pro Runde kannst du nur einen Freund einladen.<br/>
	<input type="text" value="<?php echo $_POST["turnier_email"]; ?>" name="turnier_email" class="input_readonly" readonly="readonly" /><br />
	<input type="text" value="<?php echo $turnier_game_data[$_POST["turnier_game"]]; ?>" class="input_readonly" readonly="readonly" /><input type="hidden" value="<?php echo $_POST["turnier_game"]; ?>" name="turnier_game"/><br />
	<input type="text" value="die.email@meines-freundes.de" name="turnier_freundes_email" /><br />
	<input type="submit" value="freund einladen" name="turnier_submit" /><br />
	</form>
	</li> 
	<li><a href="javascript:setFormVisible('turnier_form_herausfordern', 'turnier_form_freund_einladen')">Mitspieler herausfordern</a> (Liste) <br />
	<form id="turnier_form_herausfordern" action="turniermod.php" method="post" >Du hast schon<span id="output_amount_mitspieler"> 0 </span>von<b> 3 </b>Mitspielern herrausgefordert.<br/><div id="output_nicknamen_mitspieler"></div><br />
	<input type="text" value="<?php echo $_POST["turnier_email"]; ?>" name="turnier_email" class="input_readonly" readonly="readonly" /><br />
	<input type="text" value="<?php echo $turnier_game_data[$_POST["turnier_game"]]; ?>" class="input_readonly" readonly="readonly" /><input type="hidden" value="<?php echo $_POST["turnier_game"]; ?>" name="turnier_game"/><br />
	<div id="input_mitspieler">
		<span onclick="addSpieler('nickseinname_1');">nickseinname_1</span><br />
		<span onclick="addSpieler('nick[HTF]name');">nick[HTF]name</span><br />
		<span onclick="addSpieler('nick_1meinname_1');">nick_1meinname</span><br />
		<span onclick="addSpieler('nickname_nochsoeiner');">nickname_nochsoeiner</span><br />
		<span onclick="addSpieler('nicknamen_ftp');">nicknamen_ftp</span><br />
		<span onclick="addSpieler('nickseinname_2341');">nickseinname_2341</span><br />
	</div>
	<br /><input type="submit" value="spieler herausfordern" name="turnier_submit" /><br /></form></li>
	</ul>
</li>
<li>Spiel starten<br />

	<form id="turnier_form_spiel_starten" class="inaktiv" action="turniermod.php" method="post">
		Das System erzeugt bei Bestätigung der Freundes-Einladung eine E-Mail, die den Link zum Spiel, d.h. zur Session vom Turnier-Spiel und zur Session vom Spieler (Autologin), enthält.<br />
		Im Falle der E-Mail-Einladung als eingeladender Neuspieler und von Herausforderungen muss der Spielsession händisch begetreten werden.
		<input type="text" value="<?php echo $turnier_game_data[$_POST["turnier_game"]]; ?>" class="input_readonly" readonly="readonly" />
		<br />
		<input type="text" value="mein nickname" name="spieler_nickname" class="input_readonly" readonly="readonly" />
		<br />
		<input type="hidden" value="<?php echo $_POST["turnier_game"]; ?>" name="turnier_game" />
		<input type="hidden" value="123456789" name="turnier_session" />
		<input type="hidden" value="9182736450" name="spieler_session" />
		<input type="submit" value="spiel starten" name="turnier_submit" /><br />
	</form>
</li>
<li>Spielstand 
	<ul class="inaktiv" id="ul_spielstand"><li><a href="javascript:setFormVisible('output_spielergebniss', '')">ansehen</a><br />
		<div id="output_spielergebniss">Du hast in dem Spiel "<?php echo $turnier_game_data[$_POST["turnier_game"]]; ?>" mit<span id="spiel_punkte"> 0000 </span>Punkten <span id="spiel_gewonnen">gewonnen</span>.<br> Deine Mitspieler waren: <div id="spieler_ergebnisse">keiner mit 0 Punkten.<br /></div><br /></div>
	</li>
	<li><a href="javascript:setFormVisible('turnier_form_eintragen', 'output_spielergebniss')">eintragen</a><br /> <form id="turnier_form_eintragen" action="turniermod.php" method="post">Das Spielergebnis kann nur eingetragen werden, wenn dieses Spiel nicht automatisch zugeordnet wurde.</form></li>
	<li><a href="javascript:setFormVisible('turnier_form_widerspruch', 'output_spielergebniss')">bestätigen</a><br /> <form id="turnier_form_widerspruch" action="turniermod.php" method="post">Bei automatischer Zuordnung, ist eine Bestätigung nicht notwendig. Man kann nur dem Spielergebnis begründet widersprechen. Screenshots, verständliche Sprache und eine klare Darstellung des Sachverhalts sind Voraussetzung. <br />
	Unbegründete, unhöfliche oder unsachliche Widersprüche können zum Ausschluss vom Spielbetrieb führen.<br />
	<textarea id="turnier_widerspruch"></textarea><br />
	<input type="text" value="meine.email@adresse.de" class="input_readonly" readonly="readonly" name="turnier_spielername" /><br />
	<input type="text" value="noch n spiel" class="input_readonly" readonly="readonly" name="turnier_spielname" /><input type="hidden" value="123456789" name="turnier_session" /><br /><input type="submit" value="Widerspruch einlegen" name="turnier_heraufordern" /><br />
	</form>
	</li></ul>
</li>
</ul>
<?php
	echo '<script type="text/javascript">';
	switch ($turnier_submit) {
		case "spiel starten": echo 'var aktivelement = \'output_spielergebniss\'; document.getElementById("ul_spielstand").className = \'aktiv\'; document.getElementById("output_spielergebniss").className = \'aktiv\'; </script><style type=\"text/css\">#output_spielergebniss '; break;
		case "spieler herausfordern":
		case "freund einladen": echo 'var aktivelement = \'turnier_form_spiel_starten\'; </script><style type="text/css">#turnier_form_spiel_starten '; break;
		case "spiel aussuchen": echo 'var aktivelement = \'turnier_form_freund_einladen\'; document.getElementById("ul_mitspieler_finden").className = \'aktiv\'; document.getElementById("turnier_form_freund_einladen").className = \'aktiv\'; </script><style type=\"text/css\">#turnier_form_freund_einladen '; break;
		case "anmelden": echo 'var aktivelement = \'turnier_form_spiel_aussuchen\'; </script><style type="text/css">#turnier_form_spiel_aussuchen '; break;
		case "login": 
		default: echo 'var aktivelement = \'turnier_form_login\'; </script><style type="text/css">#turnier_form_login ';
			break;
	}
	echo '{visibility: visible; display: block; }</style>';
?>
</div>
</body>
</html>