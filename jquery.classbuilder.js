(function($){
	$.buildClass = function(){
		var argc = 0;
		
		//Methods of the current class
		var methods = arguments[argc]?arguments[argc++]:{};
		
		//Definition of the upper class or empty class if no one is provided
		var P = $.isFunction(arguments[argc])?arguments[argc]:function(){};
		
		//Class of the object uber
		var Uber = function(base){
			if(P.prototype.__U) this.uber = new P.prototype.__U(base);
			this.__o = base;
		}
		
		//For each function defined in the parent class, we have to dynamically generate one for the uber object throw eval
		for(var f in P.prototype){
			if($.isFunction(P.prototype[f])){
				//Use eval to generate all functions « on the fly ». Otherwize you're screwed up.
				Uber.prototype[f] = eval('(function(){return function(){return P.prototype[\''
								+ f.replace(/\\'/g, '\\\'').replace(/\\/g, '\\')
								+ '\'].apply(this.__o, arguments);};})();' );
			}
		}
		
		var Constructor = function(){
			//Set the uber object
			this.uber = new Uber(this);
			
			//Run the provided contructor if it exists
			if(methods.constructor) methods.constructor.apply(this, arguments);
		}
		
		//create a new prototype for our class
		var F = function(){}
		F.prototype = P.prototype;
		Constructor.prototype = new F();
		
		//Set assign methods to this prototype
		$.extend(Constructor.prototype, methods, { __U : Uber });
		Constructor.prototype.constructor = Constructor;
		
		return Constructor;
	}
})(jQuery);

