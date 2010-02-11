/**
 * GitSeen - Git your repositories seen with a simple, stylish GitHub badge
 * 
 * http://github.com/alechill/GitSeen
 *
 * @author Alec Hill
 */
var GitSeen = (function(){
	
	var _class = function(render_to_id, github_user_id, alignment){
		this.user_id = github_user_id;
		this.els = [];
		this.alignment = alignment || GitSeen.CENTER;
		this.parentEl = document.getElementById(render_to_id);
		this.loadScript('http://github.com/api/v2/json/repos/show/' + github_user_id + '?callback=GitSeen.instances.' + render_to_id + '.onJSON');
	}
	
	_class.prototype = {
		parentEl: null,
		el: null,
		els: null,
		json: null,
		intervalId: null,
		interval: 5000,
		currentIndex: 0,
		alignment: false,
		
		onJSON: function(json){
			this.json = json;
			this.build();
		},
		
		build: function(){
			var externalLink = function(){ 
				window.open(this.href, '_blank'); 
				return false;
			}
			this.el = document.createElement('div');
			this.el.className = 'git_seen git_seen_' + this.alignment;
			var container = document.createElement('div');
			var heading = document.createElement('h5');
			heading.appendChild( document.createTextNode('GitHub - Social coding') );
			container.appendChild(heading);
			var indicator = document.createElement('a');
			indicator.className = 'repos';
			indicator.href = 'http://github.com/' + this.user_id;
			indicator.title = this.user_id + ' on GitHub';
			indicator.onclick = externalLink;
			var count = document.createElement('strong');
			count.appendChild( document.createTextNode(this.json.repositories.length) );
			var repos = document.createElement('span');
			repos.appendChild( document.createTextNode(' Repos '));
			indicator.appendChild(count);
			indicator.appendChild(repos);
			container.appendChild(indicator);
			this.el.appendChild(container);
			for(var r, p, a, s, n, t, d, i = 0, l = this.json.repositories.length; i < l; i++ ){
				r = this.json.repositories[i];
				if(r.private) continue;
				p = document.createElement('p');
				p.style.display = i ? 'none' : 'block';
				p.className = i ? '' : 'current';
				a = document.createElement('a');
				s = document.createElement('strong');
				n = document.createElement('span');
				n.appendChild( document.createTextNode(i+1) );
				s.appendChild(n);
				t = document.createElement('em');
				t.appendChild(document.createTextNode(r.name));
				s.appendChild(t);
				a.appendChild(s);
				a.title = r.description;
				a.href = r.url;
				a.onclick = externalLink;
				p.appendChild(a);
				this.el.appendChild(p);
				this.els.push(p);
			}
			this.parentEl.appendChild(this.el);
			if(this.els.length > 1) this.start();
		},
		
		loadScript: function(src){
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = src;
			this.parentEl.appendChild(script);
		},
		
		start: function(){
			var self = this;
			this.intervalId = setInterval(function(){ self.rotate(); }, this.interval);
		},
		
		stop: function(){
			clearInterval(this.intervalId);
		},
		
		rotate: function(){
			for(var i = 0, l = this.els.length; i < l; i++){
				this.els[i].style.display = 'none';
			}
			this.currentIndex = this.currentIndex + 1 ==  l ? 0 : this.currentIndex + 1;
			this.els[this.currentIndex].style.display = 'block';
		}
		
	}
	
	_class.instances = [];
	
	_class.CENTER = 'center';
	_class.LEFT = 'left';
	_class.RIGHT = 'right';
	
	var _onWindowLoad = function(){
		for( var c, i = 0, l = GitSeen.config.length; i < l; i++ ){
			c = GitSeen.config[i];
			GitSeen.instances[c.render_to_id] = new GitSeen(c.render_to_id, c.github_user_id, c.alignment);
		}
	}
	
	if( window.addEventListener ){
		window.addEventListener('load', _onWindowLoad, false);
	}else if( window.attachEvent ){
		window.attachEvent('onload', _onWindowLoad);
	}else{
		var _old = (window.onload) ? window.onload : function(){};
        window.onload = function(){
			_old();
			_onWindowLoad();
		}
	}
	
	return _class;
	
})();