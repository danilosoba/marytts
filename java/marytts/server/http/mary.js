function GetXmlHttpObject()
{
    var xmlHttp=null;
    try
    {
        // Firefox, Opera 8.0+, Safari
        xmlHttp=new XMLHttpRequest();
    }
    catch (e)
    {
        // Internet Explorer
        try
        {
            xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e)
        {
            xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}

function addOption(id, text)
{
	var opt=document.createElement('option');
  	opt.text=text
    var x=document.getElementById(id);
    try {
        x.add(opt,null); // standards compliant
    } catch(ex) {
        x.add(opt); // IE only
    }
}

function initForm()
{
    document.getElementById('VOICE_SELECTIONS').selectedIndex = 0;
    document.getElementById('INPUT_TYPE').selectedIndex = 0;
    document.getElementById('OUTPUT_TYPE').selectedIndex = 0;
    document.getElementById('AUDIO_OUT').selectedIndex = 0;
    document.getElementById('INPUT_TEXT').value = '';
    document.getElementById('OUTPUT_TEXT').value = '';
    document.getElementById('LOCALE').value = 'en_US';
    document.getElementById('VOICE').value = 'cmu-slt-arctic';
    fillVoices();
    fillTypes();
    fillAudioFormats();
    fillEffects();
	setInputText("TEXT");
	setVisibilities("AUDIO");
	setAudio("WAVE_FILE");
};


function fillVoices()
{
	var xmlHttp = GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    url = "voices";
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState==4) {
        	if (xmlHttp.status == 200) {
	            var response = xmlHttp.responseText;
	            var lines = response.split('\n');
	            for (l in lines) {
	            	var line = lines[l];
	            	if (line.length > 0)
		            	addOption("VOICE_SELECTIONS", line);
	            }
        	} else {
        		alert(xmlHttp.responseText);
        	}
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function fillTypes()
{
	var xmlHttp = GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    url = "datatypes";
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState==4) {
        	if (xmlHttp.status == 200) {
	            var response = xmlHttp.responseText;
	            var lines = response.split('\n');
	            for (l in lines) {
	            	var line = lines[l];
	            	if (line.length > 0) {
		            	var fields = line.split(' ', 1);
		            	if (line.indexOf('INPUT') != -1) {
			            	addOption("INPUT_TYPE", fields[0]);
			            	if (fields[0]=="TEXT") {
			            		var sel = document.getElementById("INPUT_TYPE");
			            		sel.selectedIndex = sel.length - 1;
			            	}
		            	}
		            	if (line.indexOf('OUTPUT') != -1) {
		            		addOption("OUTPUT_TYPE", fields[0]);
			            	if (fields[0]=="AUDIO") {
			            		var sel = document.getElementById("OUTPUT_TYPE");
			            		sel.selectedIndex = sel.length - 1;
			            	}
		            	}
	            	}
	            }
        	} else {
        		alert(xmlHttp.responseText);
        	}
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function fillAudioFormats()
{
    var xmlHttp = GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    url = "audioformats";
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState==4) {
        	if (xmlHttp.status == 200) {
	            var response = xmlHttp.responseText;
	            var lines = response.split('\n');
	            for (l in lines) {
	            	var line = lines[l];
	            	if (line.length > 0)
		            	addOption("AUDIO_OUT", line);
	            }
        	} else {
        		alert(xmlHttp.responseText);
        	}
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}



function fillEffects()
{
    var xmlHttp = GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    url = "audioeffects";
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState==4) {
        	if (xmlHttp.status == 200) {
	            var response = xmlHttp.responseText;
	            var lines = response.split('\n');
	            for (l in lines) {
	            	var line = lines[l];
	            	if (line.length > 0) {
		            	addEffect(line);
	            	}
	            }
        	} else {
        		alert(xmlHttp.responseText);
        	}
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function addEffect(line)
{
	var iSpace = line.indexOf(" ");
	var effect = line.substring(0, iSpace);
	var params = line.substring(iSpace+1);
	var effectsTable = document.getElementById('effectsTable');
	var row = effectsTable.insertRow(effectsTable.rows.length);
	row.setAttribute("id", "effect_"+effect);
	var checkboxCell = row.insertCell(0);
	var checkbox = document.createElement("input");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("id", "effect_"+effect+"_selected");
	checkbox.setAttribute("name", "effect_"+effect+"_selected");
	checkbox.checked = false;	
	checkboxCell.appendChild(checkbox);
	var nameCell = row.insertCell(1);
	nameCell.innerHTML = effect;
	var paramCell = row.insertCell(2);
	var textarea = document.createElement("textarea");
	textarea.setAttribute("rows", "1");
	textarea.setAttribute("cols", "20");
	textarea.setAttribute("id", "effect_"+effect+"_parameters");
	textarea.setAttribute("name", "effect_"+effect+"_parameters");
	textarea.value = params;
	paramCell.appendChild(textarea);
	var defaultCell = row.insertCell(3);
	var defaultButton = document.createElement("input");
	defaultButton.setAttribute("type", "button");
	defaultButton.setAttribute("id", "effect_"+effect+"_default");
	defaultButton.setAttribute("name", "effect_"+effect+"_default");
	defaultButton.setAttribute("value", "Default");
	defaultButton.setAttribute("onClick", "defaultEffectParams(this)");
	defaultCell.appendChild(defaultButton);	
	var helpCell = row.insertCell(4);
	var helpButton = document.createElement("input");
	helpButton.setAttribute("type", "button");
	helpButton.setAttribute("id", "effect_"+effect+"_help");
	helpButton.setAttribute("name", "effect_"+effect+"_help");
	helpButton.setAttribute("value", "Help");
	helpButton.setAttribute("onClick", "helpEffect(this)");
	helpCell.appendChild(helpButton);	
}

function defaultEffectParams(button)
{
	var parts = button.getAttribute("id").split("_");
	var effect = parts[1];
    var xmlHttp = GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    url = "audioeffect-default-param?effect="+effect;
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState==4) {
        	if (xmlHttp.status == 200) {
                document.getElementById('effect_'+effect+'_parameters').value = xmlHttp.responseText;
        	} else {
        		alert(xmlHttp.responseText);
        	}
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function helpEffect(button)
{
	var parts = button.getAttribute("id").split("_");
	var effect = parts[1];
    var xmlHttp = GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    url = "audioeffect-help?effect="+effect;
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState==4) {
        	if (xmlHttp.status == 200) {
                document.getElementById('HELP_TEXT').value = xmlHttp.responseText;
        	} else {
        		alert(xmlHttp.responseText);
        	}
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}


function inputTypeChanged()
{
    var inputTypeSelect = document.getElementById('INPUT_TYPE');
    var inputType = inputTypeSelect.options[inputTypeSelect.selectedIndex].text;
	setInputText(inputType);
}

function setInputText(inputType)
{
    var xmlHttp = GetXmlHttpObject();
    if (xmlHttp==null) {
        alert ("Your browser does not support AJAX!");
        return;
    }
    url = "exampletext?datatype=";
    url = url + inputType;
    url = url + "&locale=en_US";
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState==4) {
        	if (xmlHttp.status == 200) {
	            document.getElementById('INPUT_TEXT').value = xmlHttp.responseText;
        	} else {
        		alert(xmlHttp.responseText);
        	}
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function outputTypeChanged()
{
	var select = document.getElementById("OUTPUT_TYPE");
    var outputType = select.options[select.selectedIndex].text;
	setVisibilities(outputType);
}

function setVisibilities(outputType)
{
    if (outputType == "AUDIO") {
    	document.getElementById("outputSection").style.display = 'none';
    	document.getElementById("audioEffectsSection").style.display = 'inline';
    	document.getElementById("helpSection").style.display = 'inline';
    	document.getElementById("PROCESS").style.display = 'none';
    	document.getElementById("SPEAK").style.display = 'inline';
    	document.getElementById("audioDestination").style.display = 'inline';
    } else {
    	document.getElementById("outputSection").style.display = 'inline';
    	document.getElementById("audioEffectsSection").style.display = 'none';
    	document.getElementById("helpSection").style.display = 'none';
    	document.getElementById("PROCESS").style.display = 'inline';
    	document.getElementById("SPEAK").style.display = 'none';
    	document.getElementById("audioDestination").style.display = 'none';
    }
};


function voiceChanged()
{
	var select = document.getElementById('VOICE_SELECTIONS');
	var voice = select.options[select.selectedIndex].text;
	var items = voice.split(' ', 2);
	document.getElementById('VOICE').value = items[0];
	document.getElementById('LOCALE').value = items[1];
    doSubmit();
};

function audioOutChanged()
{
	var select = document.getElementById('AUDIO_OUT');
    setAudio(select.options[select.selectedIndex].text);
    requestSynthesis();
}

function setAudio(value)
{
    document.getElementById('AUDIO').value = value;
}


function doSubmit()
{
    document.getElementById('maryWebClient').submit();
}

function requestSynthesis()
{
    var url = "process";
    var param = "";
	var maryForm=document.getElementById("maryWebClient");
	for (var i=0;i<maryForm.length;i++) {
		var element = maryForm.elements[i];
		var key = element.name;
		var value;
		if (element.nodeName == "SELECT") {
			value = element.options[element.selectedIndex].text
		}
		else if (element.getAttribute("type") == "checkbox")
		    value = element.checked ? "on" : "";
		else
		    value = element.value;
		
    	if (param.length > 0) param = param + "&";
        param = param + key + "=" + encodeURIComponent(value);
    }
	
	var select = document.getElementById("OUTPUT_TYPE");
	var outputType = select.options[select.selectedIndex].text;
	if (outputType == "AUDIO") {
        //doSubmit();
        url = url + "?" + param;
        var audioDestination = document.getElementById("audioDestination");
        while (audioDestination.childNodes.length > 0) {
        	audioDestination.removeChild(audioDestination.firstChild);
        }
        audioDestination.innerHTML = '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" '
          + ' codebase="http://www.apple.com/qtactivex/qtplugin.cab" width="200" height="16">'
          + '<param name="src" value="' + url + '" />'
		  + '<param name="controller" value="true" />'
		  + '<param name="qtsrcdontusebrowser" value="true" />'
		  + '<param name="autoplay" value="true" />'
		  + '<param name="autostart" value="1" />'
		  + '<param name="pluginspage" value="http://www.apple.com/quicktime/download/" />\n'
		  + '<!--[if !IE]> <-->\n'
		  + '<object data="'+url+'" width="200" height="16">'
		  + '<param name="src" value="' + url + '" />'
		  + '<param name="controller" value="true" />'
		  + '<param name="autoplay" value="true" />'
		  + '<param name="autostart" value="1" />'
		  + '<param name="pluginurl" value="http://www.apple.com/quicktime/download/" />'
	      + '</object>\n'
		  + '<!--> <![endif]-->\n'
		  +'</object>';
	    // alert(audioDestination.innerHTML);
        var fallback = document.createElement("a");
        fallback.setAttribute("href", url);
		var fallbackText = document.createTextNode("Save audio file");
		fallback.appendChild(fallbackText);
        var div = document.createElement("div");
        div.appendChild(fallback);
        audioDestination.appendChild(div);
	} else {
		// for non-audio types, fill OUTPUT_TEXT via AJAX
        var xmlHttp = GetXmlHttpObject();
	    if (xmlHttp==null) {
	        alert ("Your browser does not support AJAX!");
	        return;
	    }
	    xmlHttp.onreadystatechange = function() {
	        if (xmlHttp.readyState==4) {
	        	if (xmlHttp.status == 200) {
		            document.getElementById('OUTPUT_TEXT').value = xmlHttp.responseText;
	        	} else {
	        		alert(xmlHttp.responseText);
	        	}
	        }
	    };
	    xmlHttp.open("POST", url, true);
	    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xmlHttp.send(param);
	}
}



