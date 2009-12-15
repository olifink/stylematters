ExampleAssistantBase = Class.create( OrientationHandlerAssistant, {
	  title : "",
	  description : "",
 	  hideheader : false,
	  initialize : function($super, title, description) {
	    this.title = title;
	    this.description = description;
		$super();
	  },
	
	activate : function($super){
		$super();
	},

    setup : function($super) {	
		//drop the template into the current window.
		var launchPage = Mojo.View.render({template: 'example-structure'});
		
		try{
			this.controller.get('complete_example').innerHTML = launchPage;
			//set the title and description
			this.controller.get('e_title').innerHTML = this.title;
			this.controller.get('e_description').innerHTML = this.description;

			this.outputDisplay = this.controller.get('html_outputDisplay');

			this.controller.get('style-item').insert(this.controller.get('e_example').innerHTML);
			if(this.controller.get('e_html').empty()){
				var item;
				if( item = this.controller.get('style-item')){
					this.outputDisplay.innerHTML = item.innerHTML.escapeHTML();
				}
			}else{
				this.outputDisplay.innerHTML = this.controller.get('e_html').innerHTML.escapeHTML();
			}

			this.controller.get('about_outputDisplay').insert(this.controller.get('e_about'));
			this.controller.get('css_outputDisplay').insert(this.controller.get('e_css').innerHTML);
			this.controller.get('e_css').remove();
			this.controller.get('e_html').remove();
			this.controller.get('e_example').remove();

			//conditionally hide empty collapsable item
			if(this.controller.get('e_about').empty()){
				this.controller.get('about_section').hide().addClassName('not-used');
			}
			if(this.controller.get('css_outputDisplay').empty()){
				this.controller.get('css_section').hide().addClassName('not-used');
			}
			if(this.controller.get('html_outputDisplay').empty()){
				this.controller.get('html_section').hide().addClassName('not-used');
			}

			//now apply the stylesheet
			if(this.stylesheet && this.stylesheet != ""){
				Mojo.Log.info("loaded style sheet for this scene")
				Mojo.loadStylesheet(this.controller.document,"stylesheets/"+this.stylesheet+".css");
			}
			//set up scrolling for the html view
			this.controller.setupWidget('code_scroller', {mode: 'horizontal'});
			//set up scrolling for the css view
			this.controller.setupWidget('code_scroller_css', {mode: 'horizontal'});

			this.aboutDrawer = this.controller.get('aboutDrawer').hide();
			this.htmlDrawer = this.controller.get('htmlDrawer').hide();
			this.cssDrawer = this.controller.get('cssDrawer').hide();
			
			if(this.fwl){
				this.controller.listen('FWL', Mojo.Event.tap, this.linkToFrameWorkLibrary.bind(this));
			}else{
				this.controller.get('FWL').hide();
			}
			this.controller.listen('about_section', Mojo.Event.tap, this.handleDrawerSelection.bind(this, this.aboutDrawer));
			this.controller.listen('html_section', Mojo.Event.tap, this.handleDrawerSelection.bind(this, this.htmlDrawer));
			this.controller.listen('css_section', Mojo.Event.tap, this.handleDrawerSelection.bind(this, this.cssDrawer));
			
			if(this.hideheader){
				this.controller.get('example-structure-header').hide();
			}
			
			$super();
		}catch(e){
			Mojo.Log.info('Error in scene template, scene '+this.title+' will not load.');
			this.controller.stageController.popScene();
			return;
		}
    },

	ready : function(){
		var collapsables = $$('.collapsible:not(.not-used)');
		if(collapsables.size() == 1){
			this.toggleShowHideFolders(collapsables[0].up(),this.controller.window.innerHeight,true);
		}else if(collapsables.size() > 1 && !this.controller.get('about_section').hasClassName('not-used')){
			this.toggleShowHideFolders(this.controller.get('about_section').up(),this.controller.window.innerHeight,true);
		}
	},

	deactivate : function($super) {
		if(this.stylesheet && this.stylesheet != ""){
			var styleSheetString = 'link[href="stylesheets/'+this.stylesheet+'.css"]';
			var mySheet = $$(styleSheetString)[0];
			mySheet.disabled = true;
			mySheet.remove();
		}
		$super();
	 },
     
	linkToFrameWorkLibrary: function(event) {
		var fwlJSON = Object.toJSON(this.fwl);
		var appcontroller = this.controller.stageController.getAppController();
		appcontroller.launch(ExampleAssistantBase.kFrameworkLibraryURI, fwlJSON, Mojo.doNothing, Mojo.doNothing);
	},

	handleDrawerSelection: function(drawer, event) {

		Mojo.Log.info("handleDrawerSelection ");
		var targetRow = this.controller.get(event.target);
		if (!targetRow.hasClassName("selection_target")) {
			Mojo.Log.info("handleSoftwareSelection !selection_target" );
			targetRow = targetRow.up('.selection_target');
		}		
		
		if (targetRow) {
			var toggleButton = targetRow.down("div.arrow_button");
			if (!toggleButton.hasClassName('palm-arrow-expanded') && !toggleButton.hasClassName('palm-arrow-closed')) {
				return;
			}
			//var show = !drawer.mojo.getOpenState()
			var show = toggleButton.className;
			
			Mojo.Log.info("handleSoftwareSelection open/close " + show );
			this.toggleShowHideFolders(targetRow,this.controller.window.innerHeight);
		}
	},

	toggleShowHideFolders: function (rowElement, viewPortMidway,noScroll) {
		if (!rowElement.hasClassName("details")) {
			return;
		}

		var toggleButton = rowElement.down("div.arrow_button");
		if (!toggleButton.hasClassName('palm-arrow-expanded') && !toggleButton.hasClassName('palm-arrow-closed')) {
			return;
		}

		var showFavorites = toggleButton.hasClassName('palm-arrow-closed');
		var folderContainer = rowElement.down('.collapsor');
		var maxHeight = folderContainer.getHeight();
		if (showFavorites) {
			toggleButton.addClassName('palm-arrow-expanded');
			toggleButton.removeClassName('palm-arrow-closed');
			folderContainer.setStyle({ height:'1px' });
			folderContainer.show();

			// See if the div should scroll up a little to show the contents
			var elementTop = folderContainer.viewportOffset().top;
			var scroller = Mojo.View.getScrollerForElement(folderContainer);
			if (elementTop > viewPortMidway && scroller && !noScroll) {
				//Using setTimeout to give the animation time enough to give the div enough height to scroll to
				var scrollToPos = scroller.mojo.getScrollPosition().top - (elementTop - viewPortMidway);
				setTimeout(function() {scroller.mojo.scrollTo(undefined, scrollToPos, true);}, 200);
			}
		} else {
			folderContainer.setStyle({ height: maxHeight + 'px' });
			toggleButton.addClassName('palm-arrow-closed');
			toggleButton.removeClassName('palm-arrow-expanded');
		}
      var options = {reverse: !showFavorites,
					   onComplete: this.animationComplete.bind(this, showFavorites, rowElement.id, maxHeight),
					   curve: 'over-easy',
					   from: 1,
					   to: maxHeight,
					   duration: 0.4};
		Mojo.Animation.animateStyle(folderContainer, 'height', 'bezier', options);
	},
	
	animationComplete: function(show, accountId, listHeight, folderContainer, cancelled) {
		if (!show) {
			folderContainer.hide();
		}
		folderContainer.setStyle({height:'auto'});
	}
	
});

ExampleAssistantBase.kFrameworkLibraryURI = 'com.palm.app.framework-library';