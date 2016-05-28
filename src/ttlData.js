var ttlData =  function (ttl){

	this.properties = {preloaded:false,loadTime:new Date(),ttl:ttl, data:{}};

	this.renew = function(){
		if(this.properties.preloaded)
		{
			var timeNow = new Date();
			if(timeNow.getTime()-this.properties.loadTime.getTime()<this.properties.ttl)
			{
				return false;
			}
		}
		return true;
	};

	this.doCached = function(loadData,finalize){

		var props = this.properties;

		finish = function(data){
			props.preloaded = true;
			props.loadTime = new Date();
			props.data = data;
			finalize(data);
		};

		if(this.renew()){
			console.log("getting new data");
			loadData(finish);		
		} else {
			finalize(this.properties.data);
		}
	};

};


module.exports = ttlData;