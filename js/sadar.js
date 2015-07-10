(function() {
  var clockGroup, fields, height, offSetX, offSetY, pi, render, scaleHours, scaleMins, scaleSecs, vis, width, radius, green, tweetData, tempDiv;

  fields = function() {
    var currentTime, data, hour, minute, second;
    currentTime = new Date();
    second = currentTime.getSeconds()%4*1000+currentTime.getMilliseconds();
    minute = currentTime.getMinutes();
    hour = currentTime.getHours() + minute / 60;
    return data = [
      {
        "unit": "seconds",
        "numeric": second
      }, {
        "unit": "minutes",
        "numeric": minute
      }, {
        "unit": "hours",
        "numeric": hour
      }
    ];
  };

  width = $(window).width();
  height = $(window).height();
  offSetX = width/2;// - width/30;
  offSetY = height/2;// - height/30;
  radius = Math.min(offSetX,offSetY);
  theta = .75;
  tweetData = [{"polar": ["0.87", 2], "id": "402964382969114624", "user": {"profile_image_url": "http://pbs.twimg.com/profile_images/378800000707450229/62283428fd84da9b0d2de465317c6095_normal.jpeg", "id": "353571694", "screen_name": "bitabunny"}, "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>", "text": "lol"},{"polar": ["0.87", 1], "id": "402964382969114624", "user": {"profile_image_url": "http://pbs.twimg.com/profile_images/378800000707450229/62283428fd84da9b0d2de465317c6095_normal.jpeg", "id": "353571694", "screen_name": "bitabunny"}, "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>", "text": "lol"},{"polar": ["0.87", 6], "id": "402964382969114624", "user": {"profile_image_url": "http://pbs.twimg.com/profile_images/378800000707450229/62283428fd84da9b0d2de465317c6095_normal.jpeg", "id": "353571694", "screen_name": "bitabunny"}, "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>", "text": "lol"},{"polar": ["0.57", 3.652276201123398], "id": "402964382969114624", "user": {"profile_image_url": "http://pbs.twimg.com/profile_images/378800000707450229/62283428fd84da9b0d2de465317c6095_normal.jpeg", "id": "353571694", "screen_name": "bitabunny"}, "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>", "text": "lol"}];
  pi = Math.PI;
  green = "#EEEEEE";
  
  scaleSecs = d3.scale.linear().domain([1, 3999]).range([0, 2 * pi]);
  
  vis = d3.selectAll(".chart").append("svg:svg").attr("width", width).attr("height", height);
  clockGroup = vis.append("svg:g").attr("transform", "translate(" + offSetX + "," + offSetY + ")");
  clockGroup.append("svg:circle").attr("r", radius).attr("fill", "none").attr("class", "clock outercircle").attr("stroke", green).attr("stroke-width", 2);
  clockGroup.append("svg:circle").attr("r", 2).attr("fill", green).attr("class", "clock innercircle");
  
  
  var circ = clockGroup.selectAll("ellipse")
		.data(tweetData)
		.enter().append("ellipse");
		
  render = function(data) {
    var hourArc, minuteArc, secondArc;
	//console.log(scaleSecs(data[0].numeric));
    clockGroup.selectAll(".clockhand").remove();
    secondArc = d3.svg.arc().innerRadius(0).outerRadius(radius).startAngle(function(d) {
      return scaleSecs(d.numeric);
    }).endAngle(function(d) {
      return scaleSecs(d.numeric);
    });
    return clockGroup.selectAll(".clockhand").data(data).enter().append("svg:path").attr("d", function(d) {
      if (d.unit === "seconds") {
        return secondArc(d);
      }
    }).attr("class", "clockhand").attr("stroke", green).attr("stroke-width", function(d) {
      if (d.unit === "seconds") {
        return 3;
      }
    }).attr("fill", "none");
  };

  setInterval(function() {
    var data;
    data = fields();
		lineAngle = scaleSecs(data[0].numeric);
			
	  circ.attr('cx', function(d, i) { return( radius * d.polar[0] * Math.cos(d.polar[1])); })
	  .attr('cy', function(d, i) { return( radius * d.polar[0] * Math.sin(d.polar[1])); })
	  .attr('rx', function(d) {if((2*pi+lineAngle) - (d.polar[1]+5*pi*.5)%(2*pi) <= 2*pi) { return (d.polar[1]+5*pi*.5)%(2*pi)-lineAngle+3}else return 2*pi-(lineAngle - (d.polar[1]+5*pi*.5)%(2*pi))+3;})
	  .attr('ry', function(d) {if((2*pi+lineAngle) - (d.polar[1]+5*pi*.5)%(2*pi) <= 2*pi) { return (d.polar[1]+5*pi*.5)%(2*pi)-lineAngle+3}else return 2*pi-(lineAngle - (d.polar[1]+5*pi*.5)%(2*pi))+3;})
	  .attr('fill', green)
	  .style('opacity',function(d) {if((2*pi+lineAngle) - (d.polar[1]+5*pi*.5)%(2*pi) <= 2*pi) { return (2*pi-((2*pi+lineAngle) - (d.polar[1]+5*pi*.5)%(2*pi)))/(2*pi);}else return (2*pi-(lineAngle - (d.polar[1]+5*pi*.5)%(2*pi)))/(2*pi);})
	  .on("click", function(d) {
		window.open("http://twitter.com/"+d.user.screen_name+"/status/"+d.id);
	  });
	  /*.on("mouseover", function(d) {
			if(tempDiv)
				tempDiv.parentElement.removeChild(tempDiv);
			tempDiv = document.createElement("div");
			tempDiv.className = "tempDiv";
			userN = document.createElement("p");
			userN.innerHTML = d.user.screen_name+":";
			userN.style.color = "#0033ff";
			tempP = document.createElement("p");
			tempP.style.padding = 2;
			tempP.style.margin = 0;
			tempP.innerHTML = d.text;
			tempDiv.appendChild(userN);
			tempDiv.appendChild(tempP);
			var position = $(this).position();
			tempDiv.style.left = position.left;
			tempDiv.style.top = position.top;
			document.body.appendChild(tempDiv);
	  })
	  .on("mouseout", function(d) {
			//tempDiv.parentElement.removeChild(tempDiv);
	  });*/
	  
	  circ.append("svg:title")
		.text(function (d) {
			return d.text;
		});
	  return render(data);
  }, 20);
}).call(this);