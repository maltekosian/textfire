<?php
	$turnier_submit = $_POST["turnier_submit"];
	if (!$turnier_submit) $turnier_submit = "login";
?>
<html>
<head>
<style type="text/css">
/***************************htmltags***********************************/

ul {margin: 0px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 12px; border: solid 1px #dddddd; overflow: hidden; }
li {margin: 0px; margin-left: 25px; padding: 0px; font-family: Courier New, Courier, typewriter, monospaced; font-size: 12px; background: #dddddd; }
form { margin: 0px; padding: 0px; font-family: Arial; font-size: 10px; background: #ddffdd; visibility: hidden; display: none; }
input {margin: 0px; padding: 0px; width: 300px; font-family: Arial; font-size: 10px; background: #eeff99; border: solid 1px #333333; }
select {margin: 0px; padding: 0px; width: 300px; font-family: Arial; font-size: 10px; background: #eeff99; border: solid 1px #333333; }
option {margin: 0px; padding: 0px; font-family: Arial; font-size: 10px; background: #eeff99; border: solid 0px #333333;}
b {margin: 0px; padding: 0px; font-family: Arial; font-size: 10px; font-weight: bold; background-color: #ff9999;}

/***************************classes***********************************/

.input_readonly {margin: 0px; padding: 0px; width: 300px; font-family: Arial; font-size: 10px; background: #ddee33; border: solid 1px #333333;}

/***************************ids***********************************/

#output_amount_mitspieler {margin: 0px; padding: 0px; font-family: Arial; font-size: 10px; font-weight: bold; background-color: #ff9999;}
#output_amount_freunde {margin: 0px; padding: 0px; font-family: Arial; font-size: 10px; font-weight: bold; background-color: #ff9999;}
#spiel_punkte {margin: 0px; padding: 0px; font-family: Arial; font-size: 10px; font-weight: bold; background-color: #ff9999;}
#spiel_gewonnen {margin: 0px; padding: 0px; font-family: Arial; font-size: 10px; font-weight: bold; background-color: #ff9999;}
#spieler_ergebnisse {margin: 0px; padding: 0px; font-family: Arial; font-size: 10px; font-weight: bold; background-color: #ff9999;}
#output_nicknamen_mitspieler {margin: 0px; padding: 0px; font-family: Arial; font-size: 10px; background-color: #eeff99; width: 300px; height: 50px; border: solid 1px #333333; overflow: scroll; overflow-y: scroll; overflow-x: hidden; }
#output_spielergebniss {margin: 0px; padding: 0px; font-family: Arial; font-size: 10px; background-color: #eeff99; width: 300px; height: 50px; overflow: always; border: solid 1px #333333; overflow: scroll; overflow-y: scroll; overflow-x: hidden; }
#turnier_widerspruch {margin: 0px; padding: 0px; font-family: Arial; font-size: 10px; font-weight: bold; background-color: #eeff99; width: 300px; height: 50px; overflow: always; border: solid 1px #333333; }
</style>
<?php
	echo '<style type="text/css">';
	switch ($turnier_submit) {
		case "spiel aussuchen": echo '#turnier_form_freund_einladen '; break;
		case "anmelden": echo '#turnier_form_spiel_aussuchen '; break;
		case "login": 
		default: echo '#turnier_form_login ';
			break;
	}
	echo '{visibility: visible; display: block;}</style>';
?>
</head>
<body>
<div style="width: 400px;">
<?php echo $turnier_submit.'<br />'; ?>
<ul>
<li>anmelden<br /><form id="turnier_form_login" action="turniermod.php" method="post" ><input type="text" value="nickname.oder@adresse.de" name="nick_mail"><br /><input type="password" value="passwort" name="pass"><br /><input type="submit" value="anmelden" name="turnier_submit"></form></li>
<li>spiel aussuchen<form id="turnier_form_spiel_aussuchen" action="turniermod.php" method="post" ><input type="text" value="meine.email@adresse.de" name="turnier_email" class="input_readonly" readonly="readonly"><br /><select name="turnier_idgame"><option value="1">ein spiel</option><option value="2">noch n spiel</option></select><br /><input type="submit" value="spiel aussuchen" name="turnier_submit"></form></li>
<li>mitspieler finden
	<ul>
	<li>einen freund einladen (email) <br />
	<form id="turnier_form_freund_einladen" action="turniermod.php" method="post" style="visibility: hidden;">Du hast schon<span id="output_amount_freunde"> 0 </span>von<b> 5 </b>Freunden eingeladen.<br />Pro Runde kannst du nur einen Freund einladen.<br/>
	<input type="text" value="meine.email@adresse.de" name="turnier_email" class="input_readonly" readonly="readonly" /><br />
	<input type="text" value="die.email@meines-frendes.de" name="turnier_email" /><br />
	<input type="submit" value="einladen" name="turnier_submit" /><br />
	</form>
	</li> 
	<li> mitspieler herausfordern (liste) <br />
	<form id="turnier_form_herausfordern" action="turniermod.php" method="post" style="visibility: hidden;">Du hast schon<span id="output_amount_mitspieler"> 0 </span>von<b> 3 </b>Mitspielern herrausgefordert.<br/><div id="output_nicknamen_mitspieler"></div><br /><select name="turnier_spieler"><option value="nickseinname_1">nickseinname_1</option><option value="nick[HTF]name">nick[HTF]name</option><option value="nick_1meinname_1">nick_1meinname</option><option value="nickname_nochsoeiner">nickname_nochsoeiner</option><option value="nicknamen_ftp">nicknamen_ftp</option><option value="nickseinname_2341">nickseinname_2341</option></select><br /><input type="submit" value="spieler herausfordern" name="turnier_submit" /><br /></form></li>
	</ul>
</li>
<li>spiel beginnen<br />
Das System erzeugt bei Bestätigung der Email eine EMail, die den Link zum Spiel und zur Session vom Turnier-Spiel und zur Session vom Spieler (Autologin) enthält.
	<form action="turniermod.php" method="post">
		Im Falle der E-Mail-Einladung als eingeladender Neuspieler und von Herausforderungen muss der Spielsession händisch begetreten werden.
		<input type="text" value="noch n spiel" name="turnier_spielname" class="input_readonly" readonly="readonly" />
		<br />
		<input type="text" value="mein nickname" name="spieler_nickname" class="input_readonly" readonly="readonly" />
		<br />
		<input type="hidden" value="123456789" name="turnier_session" />
		<input type="hidden" value="9182736450" name="spieler_session" />
		<input type="submit" value="spiel starten" name="turnier_spiel_starten" /><br />
	</form>
</li>
<li>spielstand 
	<ul><li>ansehen<br /><div id="output_spielergebniss" style="width: 300px; height: 50px; font-family: Arial; font-size: 10px;">Du hast in dem Spiel "noch n spiel" mit<span id="spiel_punkte"> 0000 </span>Punkten <span id="spiel_gewonnen">gewonnen</span>.<br> Deine Mitspieler waren: <div id="spieler_ergebnisse">keiner mit 0 Punkten.<br /></div><br /></div></li>
	<li>eintragen<br /> <form action="turniermod.php" method="post">Das Spielergebnis kann nur eingetragen werden, wenn dieses Spiel nicht automatisch zugeordnet wurde.</form></li>
	<li>bestätigen<br /> <form action="turniermod.php" method="post">Bei automatischer Zuordnung, ist eine Bestätigung nicht notwendig. Man kann nur dem Spielergebnis begründet widersprechen. Screenshots, verständliche Sprache und eine klare Darstellung des Sachverhalts sind Voraussetzung. <br />
	Unbegründete, unhöfliche oder unsachliche Widersprüche können zum Ausschluss vom Spielbetrieb führen.<br />
	<textarea id="turnier_widerspruch"></textarea><br />
	<input type="text" value="meine.email@adresse.de" class="input_readonly" readonly="readonly" name="turnier_spielername" /><br />
	<input type="text" value="noch n spiel" class="input_readonly" readonly="readonly" name="turnier_spielname" /><input type="hidden" value="123456789" name="turnier_session" /><br /><input type="submit" value="spieler herausfordern" name="turnier_heraufordern" /><br />
	</form>
	</li></ul>
</li>
</ul>
</div>
</body>
</html>