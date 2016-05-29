var ttlData =  function (ttl,maxRetries){

	this.properties = {preloaded:false,loadTime:new Date(),ttl:ttl, data:{}, retries:0, maxRetries:maxRetries};

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

	this.doCached = function(loadData,finalize,error){

		var props = this.properties;

		var finish = function(data){
			if (arguments.length>0)
			{
				props.preloaded = true;
				props.loadTime = new Date();
				props.data = data;
				props.retries = 0;
				finalize(data);
			} else {
				if(props.retries<maxRetries)
				{
					console.log(props.retries);
					props.retries++;
					loadData(finish);
				} else {
					props.retries=0;
					error();
				}
			}
		};

		if(this.renew()){
			loadData(finish);		
		} else {
			finalize(this.properties.data);
		}
	};

};


module.exports = ttlData;