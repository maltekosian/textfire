<?php
	if ($_POST["submit"] == "speichern") {
		echo "<div>".$_POST["title"]."<br /><br />".$_POST["text"]."<hr /></div>";
		$filename = $_POST["title"];
		$file = fopen($filename.".txt", "w");
		//$inhalt = fread($file, filesize('datei.txt');
		//chmod($_POST["title"].".txt", 0777);
		fwrite($file, $_POST["text"]);
		fflush($file);
		//$filecontent = fread($file, filesize($filename));
		fclose($file);
		$file = fopen($filename.".txt", "r");
		$filecontent = fread($file, filesize($filename.".txt"));
		fclose($file);
	}
?>
<html>
<head>
<script type="text/javascript">
	window.addEventListener('load', function () {
		initCanvas();
	}, false);

	function countLength(id) {
		var element = document.getElementById(id);

		var maxlength = 55;
		
		if (id == 'textarea')
		{
			maxlength = 255;
		}

		document.getElementById(id+"_length").innerHTML = ""+element.value.length;
		if (element.value.length > (maxlength - 10))
		{
			document.getElementById(id+"_length").style.color = '#c00';
		} else {
			document.getElementById(id+"_length").style.color = '#090';
		}

		if (element.value.length > maxlength)
		{
			element.value = element.value.substring(0, maxlength);
			document.getElementById(id+"_length").style.color = '#c00';
			document.getElementById(id+"_length").innerHTML = ""+element.value.length;
		}
	}

	var mx = false;
	var my = false;
	var canvas = false;
	var context = false;

	function getCanvasImageData() {
		var dataURL = canvas.toDataURL("image/png");
		return {"0":dataURL,"1":dataURL.replace(/^data:image\/(png|jpg);base64,/, "")};
	}

	function mouseDown(event) {
		
		event = evCanvas(event);
		context.fillStyle = '#999'; // blue
		context.strokeStyle = '#000'; // red
		context.lineWidth = 1;	
		mx = event._x;
		my = event._y;
		context.beginPath();
		context.moveTo(mx, my);
	}

	function mouseMove(event) {
		event = evCanvas(event);
		if (mx != false)
		{
			var ctx = canvas.getContext('2d');
			mx = event._x;
			my = event._y;
			
			context.lineTo(mx, my);
			context.stroke();
			
		}
	}

	function mouseUp(event) {
		event = evCanvas(event);
		if (mx != false)
		{	
			mx = event._x;
			my = event._y;
			context.lineTo(mx, my);
			context.stroke();
			context.fill();
			mx = false;
			my = false;
			//context.restore();
			//context = false;
			document.getElementById('canvas_image').src=getCanvasImageData()[0];
			document.getElementById('canvas_output').innerHTML=getCanvasImageData()[0];
		}
	}

	function initCanvas() {
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		canvas.addEventListener('mousedown', mouseDown, false);
		canvas.addEventListener('mousemove', mouseMove, false);
		canvas.addEventListener('mouseup', mouseUp, false);
	}

	function evCanvas(ev) {
		var element = ev.target; 
		ev._x = ev.pageX - element.offsetLeft;
		ev._y = (ev.pageY - element.offsetTop ) / 2;
		//why y has to be the half?
		return ev;
	}
</script>
<style type="text/css">
body, div, form, input, a, table, tr, td, p, select, option, br, textarea, span {
	font-family: monospace; 	
	font-size: 12px;
	color: #006;
	text-decoration: none;
	margin: 0px;
}

body {
	background: #ddd;
}

input, textarea, table, div {
	width: 300px;
}

a:hover {
	color: #00f;
	background: #fff;
}

#canvas {
	width: 300px;
	height: 300px;
	background: transparent;
	border: solid 1px #666;
}
</style>
</head>
<body >
<div style="float: left;">
<form action="index.php" method="post">
	<input id="inputtitle" name="title" style="width: 300px;" value="<?php echo $filename; ?>" onKeyUp="countLength('inputtitle');"/> <span id="inputtitle_length"><?php echo strlen($filename); ?></span><br />
	<textarea id="textarea" name="text" style="width: 300px; height: 150px;" onKeyUp="countLength('textarea');"><?php echo $filecontent; ?></textarea> <span id="textarea_length"><?php echo strlen($filecontent); ?></span><br />
	<input type="submit" name="submit" value="speichern"/>
</form>
<div>
The Title is used as an human readable identifier. Index values are unique, titles may not, especially in a multi-language, multi-user enviroment.
<br /><br />
Crossreferences may be founded on text to text indexing or keyword based.
<br /><br />
Dialogs should be handeled like other objects? Images and micro games for an example.
</div>
</div>
<div style="float: right;">
<canvas id="canvas" ></canvas>
<br />
<img id="canvas_image" src="" style="width: 300px; height: 300px; border: 0px; background: #fff;">
<div id="canvas_output" style="overflow: auto; height: 150px; border: 1px solid #666;"></div>
</div>
</body>
</html>