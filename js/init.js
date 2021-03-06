var o = {
	
	init: function(){
		this.diagram();
	},
	random: function(l, u){
		return Math.floor((Math.random()*(u-l+1))+l);
	},
	diagram: function(){
		var host = 'http://192.168.1.102:8080/rookie/';
		 $.getUrlParam = function(name)
		 {
			 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			 var r = window.location.search.substr(1).match(reg);
			 if (r!=null) return unescape(r[2]); return null;
		 }
		 var cityid = $.getUrlParam('cityid');
		 var userid = $.getUrlParam('userid');
		
		var r = Raphael('diagram', 600, 600),
			rad = 73,
			defaultText = 'Beat Other \nTravellers',
			speed = 250;
		
		r.circle(300, 300, 85).attr({ stroke: 'none', fill: '#193340' });
		
		var title = r.text(300, 300, defaultText).attr({
			font: '20px Arial',
			fill: '#fff'
		}).toFront();
		
		r.customAttributes.arc = function(value, color, rad){
			var v = 3.6*value,
				alpha = v == 360 ? 359.99 : v,
				random = o.random(91, 240),
				a = (random-alpha) * Math.PI/180,
				b = random * Math.PI/180,
				sx = 300 + rad * Math.cos(b),
				sy = 300 - rad * Math.sin(b),
				x = 300 + rad * Math.cos(a),
				y = 300 - rad * Math.sin(a),
				path = [['M', sx, sy], ['A', rad, rad, 0, +(alpha > 180), 1, x, y]];
			return { path: path, stroke: color }
		}
		
		var colors = ["#88B8E6", "#BEDBE9", "#EDEBEE", "#97BE0D", "#D84F5F"];
		
		$.ajax( {  
		 url: host + 'api/getBeatInfo/' + userid,  
		 type: "GET",
         dataType: 'json',
		 async : false,
		 success:function(data) {  			
			var info = data.beatinfo;			
			for (var i = 0; i < info.length; i++) {				
								
				$("#issue_"+i).text(info[i].beat_issue);				
				$("#percentage_"+i).attr("value", info[i].beat_percentage);
				$("#color_"+i).attr("value", colors[i]);
				$("#count_"+i).attr("value", info[i].issue_count);								
			}					
			
		  },  
		  error : function() {  
		  
			alert('fail');
			
		  }  
		});	
		
		$('.get').find('.arc').each(function(i){
			var t = $(this), 
				color = t.find('.color').val(),
				value = t.find('.percent').val(),
				count = t.find('.count').val(),
				desc = t.find('.text').text();
			
			rad += 30;	
			var z = r.path().attr({ arc: [value, color, rad], 'stroke-width': 26 });
			
			z.mouseover(function(){
                this.animate({ 'stroke-width': 50, opacity: .75 }, 1000, 'elastic');
                if(Raphael.type != 'VML') //solves IE problem
				this.toFront();
				title.stop().animate({ opacity: 0 }, speed, '>', function(){
					this.attr({ text: desc + ' \n : '+ count + '.\n Beat ' + value + '% \n travellers' }).animate({ opacity: 1 }, speed, '<');
				});
            }).mouseout(function(){
				this.stop().animate({ 'stroke-width': 26, opacity: 1 }, speed*4, 'elastic');
				title.stop().animate({ opacity: 0 }, speed, '>', function(){
					title.attr({ text: defaultText }).animate({ opacity: 1 }, speed, '<');
				});	
            });
		});

		
	}
}
$(function(){ o.init(); });