/*
*	Notifier
*	Author: Luis Pulido (http://github.com/lu1s)
*	Needs jquery to work
*
*	Parameters:
*	  opts: An object containing:
*		css: An object with the css parameters
*			 defining the style of the notifier div.
*	      Default css values are:
*			display:"none",
*			position:"fixed",
*			bottom:"140px",
*			left:"90px",
*			zIndex:"180",
*			background:"#1E5475",
*			textAlign:"center",
*			padding:"15px 20px",
*			width:"170px",
*			borderRadius:"10px",
*			border:"solid 2px #2C7BAD",
*			color:"white",
*			fontSize:"20px"
*
*		timeout: The time the notifier div will be showing.
*/
var Notifier = function(opts){
	if($("#notifier_bar").size()<1)
		$("body").append($("<div/>").css(((opts && opts.css) ? opts.css : {
			display:"none",
			position:"fixed",
			bottom:"140px",
			left:"90px",
			zIndex:"180",
			background:"#71207D",
			textAlign:"center",
			padding:"15px 20px",
			width:"170px",
			borderRadius:"18px",
			border:"solid 5px #B333C6",
			color:"white",
			fontSize:"20px"
		})).attr("id","notifier_bar"))
	if(opts && opts.timeout)
		this.timeout = opts.timeout;
	else
		this.timeout = 2000;
}
Notifier.prototype = {
	constructor: Notifier,
	to:null,
	/*
	* Show function
	* Shows the notifier with the specified message.
	* Parmeters:
	* 	what: The message to display (can be html).
	*	timeout: The time the notifier div will be showing,
	*			 It will replace the default or initial value.
	*/
	show: function(what,timeout){
		$("#notifier_bar").html(what).show("drop",{direction:"down"},200);
		this.to = window.setTimeout(function(){
			$("#notifier_bar").fadeOut(200,function(){$("#notifier_bar").html("");});
		},(timeout ? timeout : this.timeout))
	},
	/*
	* Hide function
	* Hides the notifier if it's being displaying.
	*/
	hide: function(){
		window.clearTimeout(this.to);
		$("#notifier_bar").fadeOut(200,function(){$("#notifier_bar").html("");});
	}
}