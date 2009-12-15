FullscreenErrorAssistant = Class.create( OrientationHandlerAssistant, {
	initialize : function() {
	
	},
	
	setup : function() {
		// a local object for button attributes
		this.buttonAttributes = {
			type: Mojo.Widget.defaultButton
		};

		// a local object for button model
		this.buttonModel = {
		    buttonLabel : 'Help',
		    buttonClass : '',
		    disabled : false
		    };


		// set up the button
	//	this.controller.setupWidget("helpButton", this.buttonAttributes, this.buttonModel);
	}
	
});
