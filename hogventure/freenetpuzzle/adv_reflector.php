<?php
/*
'p',uzzle adventure

10 levels
xhtt'p', re'q',uest via loadnsave.'p',h'p',
'p',ost "c" 4 command
0 -> start
1 -> click command. may return the next level or any other reaction

'p',ost "x" the x coordinate
a number
'p',ost "y" the y coordinate
a number

id_guest | o'p',tional_id_'p',layer | savelevel | 'p',oints | date

level is retruned as an evalutable js-scri'p',t:
*/
$method = $_POST["m"];
$param = $_POST["s"];

$hint = "'A is for loosers.<br /><a href=\"javascript: game.makeSelection(\'x\');\">X.</a>'";
$quest = "['Make your decission!<br /><a href=\"javascript: game.makeSelection(\'a\');\" onmouseup=\"game.makeSelection(\'a\');\">A.</a><br /><a href=\"javascript: game.makeSelection(\'b\');\" onmouseup=\"game.makeSelection(\'b\');\">B.</a><br />', 'b', false, ]";

$level = "[
	[false, 'f', 'p', 'c', 'c', 'c', 'f', 'f'],
	['f', 'f', 'c', 'c', 'c', 'c', 'f', 'f'],
	['f', 'c', 'c', 'c', 'c', 'c', 'c', 'f'],
	['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
	['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
	['c', 'c', 'f', 'c', 'c', 'f', 'c', 'c'],
	['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
	['c', 'c', 'c', 'f', 'f', 'c', 'c', 'c'],
	['f', 'c', 'c', 'c', 'c', 'c', 'c', 'f'],
	['f', 'f', 'c', 'c', 'c', 'c', 'f', 'f'],
	['f', 'f', 'c', 'c', 'c', 'd', 'f', 'f']
]";

$rndCard = 12;

switch ($param) {

case 0:
$level = "[
	['p','c','c','c','c','c'],
	['c','c','c','c','c','c'],
	['c','c','c','c','c','c'],
	['c','c','c','c','c','c'],
	['c','c','c','c','c','c'],
	['c','c','c','c','c','d']
]";
	$hint = "'Es sind mehr als man denkt.<br /><a href=\"javascript: game.makeSelection(\'x\');\">X.</a>'";
	$quest = "['Wir brauchen noch einen Programmierer für freenet das Webportal. Hast du eigentlich eine Ahnung, wie viel Prozent der Deutschen Internet-User auf freenet.de surfen?<br /><br />".
			"<a href=\"javascript: game.makeSelection(\'a\');\" onmouseup=\"game.makeSelection(\'a\');\">A.</a>5%<br />".
			"<a href=\"javascript: game.makeSelection(\'b\');\" onmouseup=\"game.makeSelection(\'b\');\">B.</a>10%<br />".
			"<a href=\"javascript: game.makeSelection(\'c\');\" onmouseup=\"game.makeSelection(\'c\');\">C.</a>20%'".
", 'c', false,]";
$rndCard = 8;
//$task = rand(8);
break;
case 1:
$level = "[
	['f','c','c','c','c','c','f'],
	['p','f','c','c','c','c','c'],
	['c','c','c','c','c','c','c'],
	['c','c','c','c','c','c','c'],
	['c','c','c','c','c','c','q'],
	['c','c','c','c','c','c','c'],
	['c','c','c','c','c','f','c'],
	['h','f','c','c', 'c','f', 'b'],
	['f','f','c','c','c', 'b','d']
]";
	$hint = "'<!--Es handelt sich zwar um Papageien, doch heißen sie nicht so.-->Frei ist englisch mit dabei.<br /><a href=\"javascript: game.makeSelection(\'x\');\">X.</a>'";
	$quest = "['Ich plane eine neue freenet TV Kampagne mit zwei grünen Papageien. Rate, was ich mir für Namen ausgedacht habe?<br /><br />".
			"<a href=\"javascript: game.makeSelection(\'a\');\" onmouseup=\"game.makeSelection(\'a\');\">A.</a>Freed und Freeda<br />".
			"<a href=\"javascript: game.makeSelection(\'b\');\" onmouseup=\"game.makeSelection(\'b\');\">B.</a>Folly und Polly<br />".
			"<a href=\"javascript: game.makeSelection(\'c\');\" onmouseup=\"game.makeSelection(\'c\');\">C.</a>Papa und Geia'".
", 'a', false,]";
$rndCard = 10;
//$task = rand(10);
break;
case 2:
$level = "[
	['p', 'b','c', 'c','f','c','h','d'],
	[ 'b','c','c', 'c','f','c','c','c'],
	['c','c', 'b', 'c','f','c','c','c'],
	['c','c','c', 'c','f','c','c','q'],
	['c','c','c', 'c','f','c','c','c'],
	['c','c','c', 'c','f','c','c','c'],
	['c','c','c', 'c','f','c','c','c'],
	['c','c','c','c', 'b','c','c','c'],
	['c','c','c', 'c','f','c','c','c'],
	['c','c','c', 'c','f','c','c','c'],
	['c','c','c','c', 'b','c','c','c']
]";
	$hint = "'Ich habe schon Aktien gekauft von Freenet!<br /><a href=\"javascript: game.makeSelection(\'x\');\">X.</a>'";
	$quest = "['Hallo, Karsten. Ich frage mich gerade , welche Gesellschaftsform hatte Freenet bei der Gründung nur gewählt - was meinen Sie?<br /><br />".
			"<a href=\"javascript: game.makeSelection(\'a\');\" onmouseup=\"game.makeSelection(\'a\');\">A.</a>GmbH<br />".
			"<a href=\"javascript: game.makeSelection(\'b\');\" onmouseup=\"game.makeSelection(\'b\');\">B.</a>AG<br />".
			"<a href=\"javascript: game.makeSelection(\'c\');\" onmouseup=\"game.makeSelection(\'c\');\">C.</a>OHG'".
", 'b', false,]";
$rndCard = 12;

break;
case 3:
$level = "[
	['f', 'f', 'p', 'c', 'c', 'c', 'f', 'f'],
	['f', 'f', 'c', 'c', 'c', 'c', 'f', 'f'],
	['f', 'c', 'c', 'c', 'c', 'c', 'c', 'f'],
	['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
	['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
	['c', 'c', 'f', 'c', 'c', 'f', 'c', 'c'],
	['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
	['c', 'c', 'c', 'f', 'f', 'c', 'c', 'c'],
	['f', 'c', 'c', 'c', 'c', 'c', 'c', 'f'],
	['f', 'h', 'c', 'c', 'c', 'c', 'q', 'f'],
	['f', 'f', 'c', 'c', 'c', 'd', 'f', 'f']
]";
	$hint = "'Es grünt so grün wenn Spaniens Blüten blühn...<br /><a href=\"javascript: game.makeSelection(\'x\');\">X.</a>'";
	$quest = "['Welches ist eigentlicht die typische Freenet-Farbe?<br /><br />".
			"<a href=\"javascript: game.makeSelection(\'a\');\" onmouseup=\"game.makeSelection(\'a\');\">A.</a>Gelb<br />".
			"<a href=\"javascript: game.makeSelection(\'b\');\" onmouseup=\"game.makeSelection(\'b\');\">B.</a>Rot<br />".
			"<a href=\"javascript: game.makeSelection(\'c\');\" onmouseup=\"game.makeSelection(\'c\');\">C.</a>Grün'".
", 'c', false,]";
$rndCard = 12;

break;
case 4:
$level = "[
	['p', 'b','c', 'c','f','c','h','d'],
	[ 'b','c','c', 'c','f','c','c','c'],
	['c','c', 'b', 'c','f','c','c','c'],
	['c','c','c', 'c','f','c','c','q'],
	['c','c','c', 'c','f','c','c','c'],
	['c','c','c', 'c','f','c','c','c'],
	['c','c','c', 'c','f','c','c','c'],
	['c','c','c','c', 'b','c','c','c'],
	['c','c','c', 'c','f','c','c','c'],
	['c','c','c', 'c','f','c','c','c'],
	['c','c','c','c', 'b','c','c','c']
]";
	$hint = "'Also ich benutze das neueste Smartphone von Mobilcom Debitel.<br /><a href=\"javascript: game.makeSelection(\'x\');\">X.</a>'";
	$quest = "['Was ist eigentlich unser Hauptgeschäft, Karsten?<br /><br />".
			"<a href=\"javascript: game.makeSelection(\'a\');\" onmouseup=\"game.makeSelection(\'a\');\">A.</a>DSL verkaufen<br />".
			"<a href=\"javascript: game.makeSelection(\'b\');\" onmouseup=\"game.makeSelection(\'b\');\">B.</a>Mobilfunkverträge anbieten<br />".
			"<a href=\"javascript: game.makeSelection(\'c\');\" onmouseup=\"game.makeSelection(\'c\');\">C.</a>Telefonkabel verlegen'".
", 'b', false,]";
$rndCard = 12;

break;
}
$task = rand(0,$rndCard-1);

echo base64_encode("game.setLevel(".$level.", ".$rndCard.", ".$hint.", ".$quest.", ".$task.");");
?>