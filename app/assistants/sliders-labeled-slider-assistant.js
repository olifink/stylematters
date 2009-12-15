SlidersLabeledSliderAssistant = Class.create( ExampleAssistantBase, {
	fwl : {'launchToScene':'slider'},
	setup : function($super){
		$super();
		this.controller.setupWidget('ringvolume', this.attributes,this.ringtoneVolumeModel);
		this.controller.setupWidget('systemvolume', this.attributes1,this.systemVolumeModel);
	}
});