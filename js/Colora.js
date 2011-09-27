
function Colora(options){
	var opts = {
		level: 1,
		points: 0,
		timeout: 150, //initial color rotation timeout
		colors: ["#6152E0","#EBED45","#44DC32","#71207D","#D9321E"],
		boxes: ["colora_box_1","colora_box_2","colora_box_3"],
		buttonElement: "colora_play",
		levelElement: "colora_level",
		pointsElement: "colora_points",
		resetElement: "colora_reset",
		autoLoad: true
		
	};
	if(options.autoLoad == false)
		opts.autoLoad = false;
/*	if(typeof options == "object" && typeof options.length == "undefined"){
		options.level ? opts.level = options.level : null;
		options.points ? opts.points = options.points : null;
		if(typeof options.colors == "object" && typeof options.colors.length == "number" && options.colors.length>4)
			opts.colors = options.colors;
		if(typeof options.boxes == "object" && typeof options.boxes.length == "number" && options.boxes.length==3){
			var flag = true;
			for(var i in options.boxes)
				if(document.getElementById(options.boxes[i]) == null)
					flag = false;
			if(flag)
				opts.boxes = options.boxes;
			else
				alert("Colora error: One or more of the specified boxes element ids does not exist. Default boxes were set up.")
		}
		if(options.autoload == false)
			opts.autoLoad = false;
	}
*/
	this.options = opts;
	this.points = opts.points;
	this.level = opts.level;
	if(opts.autoLoad)
		this.loadGUI();
}
Colora.prototype = {
	constructor: Colora,
	to: new Array(3),
	stops: 0,
	state: 0,
	runBoxOne: function(){
		this.to[0] = setTimeout((function(self){
			return function(){
				var el = document.getElementById(self.options.boxes[0]);
				var random = Math.floor(Math.random()*self.options.colors.length);
				el.style.backgroundColor = self.options.colors[random]
				self.runBoxOne();
			};
		})(this),this.options.timeout);
	},
	runBoxTwo: function(){
		this.to[1] = setTimeout((function(self){
			return function(){
				var el = document.getElementById(self.options.boxes[1]);
				var random = Math.floor(Math.random()*self.options.colors.length);
				el.style.backgroundColor = self.options.colors[random]
				self.runBoxTwo();
			};
		})(this),this.options.timeout);
	},
	runBoxThree: function(){
		this.to[2] = setTimeout((function(self){
			return function(){
				var el = document.getElementById(self.options.boxes[2]);
				var random = Math.floor(Math.random()*self.options.colors.length);
				el.style.backgroundColor = self.options.colors[random]
				self.runBoxThree();
			};
		})(this),this.options.timeout);
	},
	run: function(){
		this.runBoxOne();
		this.runBoxTwo();
		this.runBoxThree();
	},
	stop: function(){
		if(this.stops==0){
			window.clearTimeout(this.to[0]);
			this.stops++;
		}
		else if(this.stops==1){
			window.clearTimeout(this.to[1]);
			this.stops++;
		}
		else{
			window.clearTimeout(this.to[2]);
			this.stops=0;
			/*
			* Calculate results
			*/
			var finals = [];
			for(var i in this.options.boxes)
				finals.push(document.getElementById(this.options.boxes[i]).style.backgroundColor);
			if(finals[0] == finals[1] && finals[1] == finals[2]){
				this.points+=200;
			}
			else if(finals[0] == finals[1] || finals[1] == finals[2]){
				this.points+=100;
			}
			else if(finals[0] == finals[2]){
				this.points+=50;
			}
			if(this.points >= (this.level*1000)){
				/* TODO: check if new randomly created color is not already on the array */
				this.level++;
				var hex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
				var color = "#";
				for(var i=0;i<6;i++)
					color+=hex[Math.floor(Math.random()*hex.length)];
				this.options.colors.push(color);
				this.refreshColors(false);
			}
			document.getElementById(this.options.levelElement).innerHTML = this.level;
			document.getElementById(this.options.pointsElement).innerHTML = this.points;
		}
	},
	refreshColors: function(isNew){
		/*clear existing colors*/
		for(var i=0; i<document.getElementsByClassName("colora_colors").length;i++){
			var element = document.getElementsByClassName("colora_colors")[i];
			element.innerHTML = "";
		}
		/* Fill all colora_color divs class elements with the colors */
		var colors = document.createElement("div")
		for(var i in this.options.colors){
			var col = document.createElement("div");
			col.setAttribute("class","colora_color");
			col.style.backgroundColor = this.options.colors[i];
			var span = document.createElement("span");
			span.innerHTML = (parseInt(i)+1).toString();
			col.appendChild(span)
			colors.appendChild(col);
		}
		var clear = document.createElement("div");
		clear.setAttribute("class","clear");
		colors.appendChild(clear);
		/* only for first time building GUI */
		for(var i=0; i<document.getElementsByClassName("colora_colors").length;i++){
			var element = document.getElementsByClassName("colora_colors")[i];
			var colorsDiv = colors.cloneNode(true);
			colorsDiv.setAttribute("id","colora_colorsdiv_"+i);
			colorsDiv.setAttribute("class","colora_colorsdiv");
			element.appendChild(colors.cloneNode(true));
		}
		/* End of filling colora_colors */
	},
	loadGUI: function(){
		this.refreshColors(true);
		document.getElementById(this.options.levelElement).innerHTML = this.level;
		document.getElementById(this.options.pointsElement).innerHTML = this.points;
	}
}