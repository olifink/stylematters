ActivityIndicatorsLargeAssistant = Class.create( ExampleAssistantBase, {
	fwl : {'launchToScene':'activity'},
	exampleSpinner1 : 'example-activity-spinner1',
	exampleSpinnerAttrs: {
		spinnerSize: Mojo.Widget.spinnerLarge
	},
	setup : function($super){
		$super();
		this.controller.setupWidget(this.exampleSpinner1, this.exampleSpinnerAttrs, {});
	},
	ready : function(){
		this.controller.get(this.exampleSpinner1).mojo.start();
	}
});