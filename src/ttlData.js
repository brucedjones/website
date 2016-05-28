var ttlData =  function (ttl){
	this.preloaded = false;
	this.loadTime = new Date();
	this.ttl = ttl;

	this.renew = function(){
		if(this.preloaded)
		{
			var timeNow = new Date();
			if(timeNow.getTime()-this.loadTime.getTime()<this.ttl)
			{
				return true;
			}
		}
		return false;
	};

	this.getData = function(fnPreloaded,fnNotLoaded){
		if(this.renew()){
			fnPreloaded(this.data);
		} else {
			fnNotLoaded(this);
		}
	};

	this.setData = function(data){
		this.preloaded = true;
		this.loadTime = new Date();
		this.data = data;
	};

};


module.exports = ttlData;