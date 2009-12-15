TextfieldsRichTextAssistant = Class.create( ExampleAssistantBase, {
	fwl : {'launchToScene':'textfield'},
	setup: function($super) {
		$super();
		this.controller.setupWidget('richtext-editor', {} , {});
	}
});