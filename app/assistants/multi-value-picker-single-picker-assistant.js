MultiValuePickerSinglePickerAssistant = Class.create( ExampleAssistantBase, {
	fwl : {'launchToScene':'datetime'},
	setup : function($super){
		$super();
		this.pickerModel = {time:new Date(), myValue:42};
		this.controller.setupWidget('intpicker', {modelProperty:'myValue', min:30, max:50}, this.pickerModel);
	}
});