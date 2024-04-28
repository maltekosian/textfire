<?php
	function getFuid() {
		//read the file uids 	
		if (file_exists("fuids")) {
			$file = fopen("fuids", "r");
			$fc = fread($file, filesize("fuids"));
			fclose($file);
			$fuids = explode(",", $fc);
		}
		//create a new one which is not in the array
		$abc = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$str = "";
		while (strlen($str) < 5 || in_array($str,$fuids)) {
			$str = "";
			for ($i = 0; $i < 5; $i++) {
				$rnd = rand(0,strlen($abc)-1);
				$str .=  substr($abc, $rnd, 1);
			}
		}
		//apend the new one and save the fuids
		$fuids[count($fuids)] = $str;
		$fuids = implode(",", $fuids);
		$file = fopen("fuids", "w");
		fwrite($file, $fuids);
		fflush($file);
		fclose($file);
		//return the new fuid
		return $str;
	}
	if ($_POST["submitting"] == "speichern") {
		echo "<div>".$_POST["title"]."<br /><br />".$_POST["text"]."<hr /></div>";
		if (!$_POST["fuid"]) {
			//read the file uids 
			//create a new one which is not in the array
			//apend the new one and svbe the fuids
			$filename = getFuid();
		} else {
			$filename = $_POST["fuid"];
		}
		$fileending = ".txt";
		if ($_POST["filetype"] == 'img') {
			$fileending = ".img";	
		}
		$file = fopen($filename.$fileending, "w");
		//$inhalt = fread($file, filesize($filename.".txt");
		//chmod($filename.".txt", 0777);
		fwrite($file, base64_encode($_POST["title"])."#".base64_encode($_POST["text"]));
		fflush($file);
		fclose($file);
		$file = fopen($filename.$fileending, "r");
		$content = base64_decode( fread($file, filesize($filename.$fileending)) );
		$content = explode("#",$content);
		$filecontent = $content[1];
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
	var ox = false;
	var oy = false;
	var canvas = false;
	var context = false;

	function getCanvasImageData() {
		var dataURL = canvas.toDataURL("image/png");
		return {"0":dataURL,"1":dataURL.replace(/^data:image\/(png|jpg);base64,/, "")};
	}

	function mouseDown(event) {
		event = evCanvas(event);
		if (isRubber)
		{
			rubber(event);
			return;
		}
		context.fillStyle = fillColor; // blue
		context.strokeStyle = strokeColor; // red
		context.lineWidth = lineWidth;	
		context.lineCap = "round"; // "butt", "round", "square"
		context.lineJoin = "round"; // "bevel", "round", "miter"
		mx = event._x;
		my = event._y;
		ox = mx;
		oy = my;
		context.beginPath();
		context.moveTo(mx, my);
	}

	function mouseMove(event) {
		event = evCanvas(event);
		
		if (mx != false)
		{
			if (isRubber)
			{
				rubber(event);
				return;
			}
			//var ctx = canvas.getContext('2d');
			mx = event._x;
			my = event._y;
			if (mx > ox + 1 || mx < ox - 1 || my > oy + 1 || my < oy - 1)
			{
			
				context.lineTo(mx, my);
				
				if (isStroke)
				{
					context.stroke();
				} else if (isFill)
				{
					//context.fill();
					//we need a draw context here (transparent canvas above real canvas)
				} 
				ox = mx;
				oy = my;
			}
		}
	}

	function mouseUp(event) {
		event = evCanvas(event);
		
		if (mx != false)
		{	
			if (isRubber)
			{
				rubber(event);
				mx = false;
				return;
			}
			
			mx = event._x;
			my = event._y;
		
			context.lineTo(mx, my);
			if (isFill)
			{
				context.fill();
				if (!isStroke)
				{
					context.closePath();
				}
			}
			if (isStroke)
			{
				context.stroke();
			}
			mx = false;
			my = false;
			ox = false;
			oy = false;
			//context.restore();
			//context = false;
			document.getElementById('canvas_image').src=getCanvasImageData()[0];
			document.getElementById('canvas_output').value=getCanvasImageData()[0];
		}
	}

	var lineWidth = 1;

	var isRubber = false;

	var fillColor = 'rgba(204,204,204,0.5)';

	var strokeColor = 'rgba(255,255,255,1)';

	var alpha = 1;

	var isStroke = true;

	var isFill = true;

	var imageTitle = '';

	function changeStroke() {
		isStroke = !isStroke;
		if (!isFill && !isStroke)
		{
			isStroke = true;
		}
		document.getElementById('img_stroke').checked = isStroke;
		document.getElementById('img_fill').checked = isFill;
	}

	function changeFill() {
		isFill = !isFill;
		if (!isFill && !isStroke)
		{
			isStroke = true;
		} 
		document.getElementById('img_stroke').checked = isStroke;
		document.getElementById('img_fill').checked = isFill;
	}

	function changeLinewidth() {
		var element = document.getElementById('img_linewidth');
		lineWidth = parseInt(element.value);
		if (context)
		{
			context.lineWidth = lineWidth;
		}
	}

	function changeFillcolor() {
		var element = document.getElementById('img_fillcolor');
		var value = element.value;
		element.options[element.selectedIndex].selected = true;
		element.options[element.selectedIndex].defaultselected = true;
		fillColor = 'rgba('+value+','+alpha+')';
	}

	function changeStrokecolor() {
		var element = document.getElementById('img_strokecolor');
		var value = element.value;
		element.options[element.selectedIndex].selected = true;
		element.options[element.selectedIndex].defaultselected = true;
		strokeColor = 'rgba('+value+','+alpha+')';
	}

	function changeAlpha() {
		alpha = document.getElementById('img_alpha').value;
	}

	function changeImageTitle() {
		imageTitle = document.getElementByid('img_title').value;
	}

	function saveCanvas() {
		document.getElementById('img_form').submit();
	}

	function clearCanvas() {
		context.clearRect(0,0,canvas.width,canvas.height);
		context.restore();
	}

	function activateRubber() {
		isRubber = !isRubber;
	}

	function rubber(event) {
		//event = evCanvas(event);
		mx = event._x;
		var x = event._x;
		var y = event._y;
		var w = context.lineWidth;
		var h = context.lineWidth;
		context.clearRect(x-0.5,y-0.5,w+1,h+1);
		document.getElementById('canvas_image').src=getCanvasImageData()[0];
		document.getElementById('canvas_output').value=getCanvasImageData()[0];	
	} 

	function initCanvas() {
		canvas = document.getElementById('canvas');
		canvas.width = 300;
		canvas.height = 300;
		context = canvas.getContext('2d');
		canvas.addEventListener('mousedown', mouseDown, false);
		canvas.addEventListener('mousemove', mouseMove, false);
		canvas.addEventListener('mouseup', mouseUp, false);
	}

	function evCanvas(ev) {
		var element = ev.target; 
		ev._x = ev.pageX - element.offsetLeft;
		ev._y = (ev.pageY - element.offsetTop ); // / 2;
		//why y has to be the half?
		//canvas standard dimeension is w=300 h=150
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
	<input id="inputtitle" name="title" style="width: 300px;" value="<?php echo $filetitle; ?>" onKeyUp="countLength('inputtitle');"/> <span id="inputtitle_length"><?php echo strlen($filetitle); ?></span><br />
	<textarea id="textarea" name="text" style="width: 300px; height: 150px;" onKeyUp="countLength('textarea');"><?php echo $filecontent; ?></textarea> <span id="textarea_length"><?php echo strlen($filecontent); ?></span><br />
	<input type="hidden" name="fuid" value="<?php echo strlen($filename); ?>"/>
	<input type="submit" name="submitting" value="speichern"/>
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
<div style="">
<input type="checkbox" id="img_stroke" style="width: 30px;" checked="checked" onchange="changeStroke();" />stroke<input type="checkbox" id="img_fill" style=" width: 30px;"  checked="checked"  onchange="changeFill();" />fill
<select id="img_strokecolor" onchange="changeStrokecolor();">
<option>strokecolor</option>
<option style="background: #fff;" value="255,255,255">&nbsp;</option>
<option style="background: #ccc;" value="204,204,204">&nbsp;</option>
<option style="background: #999;" value="153,153,153">&nbsp;</option>
<option style="background: #666;" value="102,102,102">&nbsp;</option>
<option style="background: #333;" value="51,51,51">&nbsp;</option>
<option style="background: #000;" value="0,0,0">&nbsp;</option>
<option style="background: #f00;" value="255,0,0">&nbsp;</option>
<option style="background: #ff0;" value="255,255,0">&nbsp;</option>
<option style="background: #0f0;" value="0,255,0">&nbsp;</option>
<option style="background: #0ff;" value="0,255,255">&nbsp;</option>
<option style="background: #00f;" value="0,0,255">&nbsp;</option>
<option style="background: #f0f;" value="255,0,255">&nbsp;</option>
<option style="background: #f90;" value="255,153,0">&nbsp;</option>
<option style="background: #9f0;" value="153,255,0">&nbsp;</option>
<option style="background: #0f9;" value="0,255,153">&nbsp;</option>
<option style="background: #09f;" value="0,153,255">&nbsp;</option>
<option style="background: #90f;" value="153,0,255">&nbsp;</option>
<option style="background: #f09;" value="255,0,153">&nbsp;</option>
<option style="background: #900;" value="153,0,0">&nbsp;</option>
<option style="background: #090;" value="0,153,0">&nbsp;</option>
<option style="background: #009;" value="0,0,153">&nbsp;</option>
</select> 
<select id="img_alpha" onchange="changeAlpha();">
<option>alpha</option>
<option value="0.1">0.1</option>
<option value="0.25">0.25</option>
<option value="0.33">0.33</option>
<option value="0.5">0.5</option>
<option value="0.66">0.66</option>
<option value="0.75">0.75</option>
<option value="0.87">0.87</option>
<option value="0.95">0.95</option>
<option value="1">1</option>
</select> 
<select id="img_fillcolor" onchange="changeFillcolor();"><option>fillcolor</option>
<option style="background: #fff;" value="255,255,255">&nbsp;</option>
<option style="background: #ccc;" value="204,204,204">&nbsp;</option>
<option style="background: #999;" value="153,153,153">&nbsp;</option>
<option style="background: #666;" value="102,102,102">&nbsp;</option>
<option style="background: #333;" value="51,51,51">&nbsp;</option>
<option style="background: #000;" value="0,0,0">&nbsp;</option>
<option style="background: #f00;" value="255,0,0">&nbsp;</option>
<option style="background: #ff0;" value="255,255,0">&nbsp;</option>
<option style="background: #0f0;" value="0,255,0">&nbsp;</option>
<option style="background: #0ff;" value="0,255,255">&nbsp;</option>
<option style="background: #00f;" value="0,0,255">&nbsp;</option>
<option style="background: #f0f;" value="255,0,255">&nbsp;</option>
<option style="background: #f90;" value="255,153,0">&nbsp;</option>
<option style="background: #9f0;" value="153,255,0">&nbsp;</option>
<option style="background: #0f9;" value="0,255,153">&nbsp;</option>
<option style="background: #09f;" value="0,153,255">&nbsp;</option>
<option style="background: #90f;" value="153,0,255">&nbsp;</option>
<option style="background: #f09;" value="255,0,153">&nbsp;</option>
<option style="background: #900;" value="153,0,0">&nbsp;</option>
<option style="background: #090;" value="0,153,0">&nbsp;</option>
<option style="background: #009;" value="0,0,153">&nbsp;</option>
</select> <select id="img_linewidth" onchange="changeLinewidth();"><option>linewidth</option><!--option value="0.25">0.25</option><option value="0.5">0.5</option--><option value="1">1</option><option value="2">2</option><option value="3">3</option><option  value="4">4</option><option  value="5">5</option><option value="6">6</option><option value="7">7</option value="8"><option>8</option><option value="9">9</option><option value="10">10</option></select> 
<a href="javascript:activateRubber();">rubber</a> 
<form id="img_form" method="post" name="imgform">
<a href="javascript:clearCanvas();">clear</a> title:<input type="text" name="title" id="img_title" onkeyup="changeImageTitle();" style="width: 135px;" maxlength="55" /> <a href="javascript:saveCanvas();">save</a>
<input type="text" value="" name="text" id="canvas_output" style="overflow: auto; border: 1px solid #666;" />
<input type="hidden" value="" name="fuid" />
<input type="hidden" value="img" name="filetype" />		
<input type="hidden" value="speichern" name="submitting" />
</form>
</div>
<br />
<img id="canvas_image" src="" style="width: 300px; height: 300px; border: 0px; background: #fff;">
</div>
</body>
</html>