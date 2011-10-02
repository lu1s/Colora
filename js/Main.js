			var colora = new Colora({autoLoad:false});
			var closeHelp = function(){
				$(".blacky").fadeOut();
				$("#instructions").fadeOut();
				setCookie("instructions","1",365*5);
				_gaq.push(["_trackEvent","global","instructions_close"]);
			};
			var colorifyCounter = 0;
			var colorifyTo;
			var colorify = function(){
				colorifyTo = window.setTimeout(function(){
					var hex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
					var col = "#";
					for(var i=0;i<6;i++)
						col+=hex[Math.floor(Math.random()*hex.length)];
					$("#title > h1 > span:eq("+colorifyCounter+")").animate({
						color:col
					},1800)
					colorifyCounter++;
					if(colorifyCounter == 6)
						colorifyCounter=0;
					colorify();
				},1000)
			}
			var bar = new Notifier({
				timeout:5000
			});
			var state = {
				points:null,
				level:null
			}
			/*
			* function getPicture.
			* Search Flickr for a picture related to a certain
			* tag and puts it as the body background
			*/
			var getPicture = function(tag){
				//is preloaded image then put it as background
				if(preloadPicture.length>0)
					$("body").css({background:"url("+(preloadPicture.pop()).src+") no-repeat center center fixed"});
				//send JSON request to flicr
				var apiKey = "2bea2ad9f279cfd4b24aefaddb577951";
				$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+apiKey+"&tags="+tag+",funny&tag_mode=all&amp;safe_search=1&content_type=1&format=json&jsoncallback=?",function(data){
				    //get the actual image URL from the id and append it to the document
				    $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+apiKey+"&photo_id="+data.photos.photo[Math.floor(Math.random()*data.photos.photo.length)].id+"&format=json&jsoncallback=?",function(pdata){
					  	if(getPictureFirstTime){
					   		$("body").css({background:"url("+pdata.sizes.size[5].source+") no-repeat center center fixed"});
							$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+apiKey+"&photo_id="+data.photos.photo[Math.floor(Math.random()*data.photos.photo.length)].id+"&format=json&jsoncallback=?",function(pdata){
								var image = document.createElement("image");
								image.src = pdata.sizes.size[5].source;
								preloadPicture.push(image);
							});
							getPictureFirstTime = false;
						}
						else{
							var image = document.createElement("image");
							image.src = pdata.sizes.size[5].source;
							preloadPicture.push(image);
						}
					})
				});
			};
			var tagArray = ["popart","modern","paint","wood","puzzle"];
			var preloadPicture = [];
			var getPictureFirstTime = true;
			/*
			* Test functions.
			* Use the test() function to test the app via javascript console.
			* It runs the app and stops when almost reaching the next level.
			*/
			var testFlag = false;
			var testRun = function(){
				window.setTimeout(function(){
					colora.run();
					window.setTimeout(function(){
						for(var i=0;i<3;i++)
							colora.stop();
					},60)
					if(colora.points <= ((state.level*1000)-600) && !testFlag)
						testRun();
				},100)
			}
			var test = function(howmany){
				var tempTimeout = colora.options.timeout;
				colora.options.timeout = 10;
				state.points = colora.points;
				state.level = colora.level;
				testRun();
				colora.options.timeout = tempTimeout;
				_gaq.push(["_trackEvent","global","test_function"]);
			}
			/*
			* End of test functions.
			*/
			
			
			$("document").ready(function(){	

				$("#instructions > button").bind("click",function(){
					closeHelp();
				});
				$(".blacky").bind("click",function(){
					closeHelp();
				});
				if(!getCookie("instructions"))
					$(".blacky").fadeIn(200,function(){$("#instructions").fadeIn();})
				if(getCookie("level")){
					colora.level = parseInt(getCookie("level"));
					_gaq.push(["_trackEvent","cookie","level","loaded",colora.level]);
				}
				if(getCookie("points")){
					colora.points = parseInt(getCookie("points"));
					_gaq.push(["_trackEvent","cookie","points","loaded",colora.points]);
				}
				if(getCookie("colors")){
					colora.options.colors = JSON.parse(getCookie("colors"));
					_gaq.push(["_trackEvent","cookie","colors"]);
				}
				colora.loadGUI();
				state.level = colora.level;
				state.points = colora.points;
				$("#helpme").bind("click",function(){
					if(!$(".blacky").is(":visible"))
						$(".blacky").fadeIn(200,function(){$("#instructions").fadeIn();_gaq.push(["_trackEvent","global","instructions_open"]);})
				})
				$("#bottom > button").bind("click",function(){
					jConfirm("You will loose all your points, colors and levels reached","Really reset app?",function(d){
						if(d){
							deleteCookies(["colors","points","level"]);
							_gaq.push(["_trackEvent","global","reset"]);
							window.location.reload();
						}
					})
				})
				var word = ["C","O","L","O","R","A"];
				var st = $("<h1/>");
				for(var i in word)
					st.append($("<span/>").css({
						color:"white",
						opacity:0.87
					}).html(word[i]));
				$("#title").html(st)
				if (/*@cc_on!@*/false) {
				    document.onfocusin = function(){colorify();}
				    document.onfocusout = function(){window.clearTimeout(colorifyTo);}
				} else {
				    window.onfocus = function(){colorify();}
				    window.onblur = function(){window.clearTimeout(colorifyTo);}
				}
				$("#colora_play").bind("click",function(){
					switch(colora.state){
						case 0:
							$(this).html("STOP");
							colora.run();
							colora.state++;
							_gaq.push(["_trackEvent","game","play"]);
						break;
						case 1:
							colora.stop();
							colora.state++;
							_gaq.push(["_trackEvent","game","stop_first"]);
						break;
						case 2:
							colora.stop();
							colora.state++;
							_gaq.push(["_trackEvent","game","stop_second"]);
						break;
						case 3:
							colora.stop();
							colora.state = 0;
							setCookie("level",colora.level,3650);
							setCookie("points",colora.points,3650);
							setCookie("colors",JSON.stringify(colora.options.colors),3650);
							if(colora.points > state.points && colora.level > state.level){
								bar.show("Gained "+(colora.points-state.points)+" points!<br/>New level: "+colora.level+"<br/>New Color: <div style='margin:5px auto;border:solid 1px white;width:40px;height:40px;background:"+colora.options.colors[colora.options.colors.length-1]+";color:"+colora.options.colors[colora.options.colors.length-1]+"'>.</div>");
								state.points = colora.points;
								state.level = colora.level;
								getPicture(tagArray[Math.floor(Math.random()*tagArray.length)]);
								_gaq.push(["_trackEvent","game","increased_level"]);
							}
							else if(colora.points > state.points){
								if(colora.points - state.points == 200){
									bar.show((colora.points-state.points)+"<br/>New image!",800);
									state.points = colora.points;
									getPicture(tagArray[Math.floor(Math.random()*tagArray.length)]);
									_gaq.push(["_trackEvent","game","points_200"]);
								}
								else{
									bar.show((colora.points-state.points),800);
									state.points = colora.points;
									if((colora.points-state.points) == 50)
										_gaq.push(["_trackEvent","game","points_50"]);
									else if((colora.points-state.points) == 100)
										_gaq.push(["_trackEvent","game","points_200"]);
								}
							}
							$(this).html("PLAY");
							_gaq.push(["_trackEvent","game","stop_final"]);
						break;
					}
				})	
				colorify();
				getPicture(tagArray[Math.floor(Math.random()*tagArray.length)]);
			})