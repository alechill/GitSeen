var GitSeen = (function(){
	
	var _class = function(render_to_id, github_user_id){
		this.user_id = github_user_id;
		this.els = [];
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
			var repos = document.createElement('span');
			repos.appendChild( document.createTextNode(' Repos '))
			var indicator = document.createElement('a');
			indicator.className = 'indicator';
			indicator.href = 'http://github.com/' + this.user_id;
			indicator.title = this.user_id + ' on GitHub';
			indicator.onclick = externalLink;
			var count = document.createElement('strong');
			count.appendChild( document.createTextNode(this.json.repositories.length) );
			indicator.appendChild(count);
			indicator.appendChild(repos);
			this.el.appendChild(indicator);
			for(var r, p, a, s, t, d, i = 0, l = this.json.repositories.length; i < l; i++ ){
				r = this.json.repositories[i];
				if(r.private) continue;
				p = document.createElement('p');
				p.style.display = i ? 'none' : 'block';
				p.className = i ? '' : 'current';
				a = document.createElement('a');
				s = document.createElement('strong');
				t = document.createTextNode(r.name);
				d = document.createTextNode(r.description.length > 50 ? r.description.substr(0,47) + '...' : r.description);
				a.title = r.description;
				a.href = r.url;
				a.onclick = externalLink;
				s.appendChild(t);
				a.appendChild(s);
				a.appendChild(d);
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
	
	var _onWindowLoad = function(){
		for( var c, i = 0, l = GitSeen.config.length; i < l; i++ ){
			c = GitSeen.config[i];
			GitSeen.instances[c.render_to_id] = new GitSeen(c.render_to_id, c.github_user_id);
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

	_class.instances = [];
	
	return _class;
	
})();