CollapsibledividersExampleAssistant = Class.create( ExampleAssistantBase, {
	setup : function($super){
		$super();
		this.examplesModel = {listTitle: $L('Examples'), items:this.kExamples};
		this.controller.setupWidget('examples',
									{
										dividerTemplate: 'collapsibledividers-example/divider',
										dividerFunction: this.exampleCategory,
										itemTemplate: 'collapsibledividers-example/entry'
									},
									this.examplesModel);
		this.controller.listen('examples', Mojo.Event.listTap, this.handleListTap.bindAsEventListener(this));
	},
	exampleCategory : function(modelItem) {
		return modelItem.category;
	},
	activate : function($super){
		$super();
		this.kExamples.each(this.attachHandler.bind(this));
	},
	attachHandler : function(item, index){
		//attach a compressor handler to each collapsable divider
		var compress = this.controller.get('compress'+item.category);
		var compressable = this.controller.get('compressable'+item.category).hide();
		if(!compress.hasClassName('compressor')){
			compress.addClassName('compressor')
			compress.compressorID = item.category;
			this.controller.listen(compress, Mojo.Event.tap, this._handleDrawerSelection.bind(this, compressable, item.category));
		}
		var categoryItems = this.getElementsOfCategory(item.category);
		categoryItems.each(this.moveElementsIntoDividers.bind(this));
			
	},
	getElementsOfCategory : function(category){
		return this.kExamples.findAll(function(example){
		 	return example.category == category;
		});
	},
	moveElementsIntoDividers : function(item, index){
		//mv elements into their appropriate collapsable dividers element#{id}
		var compressable = this.controller.get('compressable'+item.category);
		compressable.insert(this.controller.get('element'+item.id));
		this.controller.get('element'+item.id).show();
	},
	moveElementsOutOfDividers : function(item, index){
		//mv elements back into their original holders element_holder#{id}
		this.controller.get('element_holder'+item.id).insert(this.controller.get('element'+item.id));
	},
	handleListTap: function(listTapEvent) {
		var example = listTapEvent.item;
		Mojo.Log.info(listTapEvent.item.id + ' tapped');
		//listTapEvent.stop();
	},
	kExamples : [{
		"id": 1,
	    "category": "Three",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem()
	    },
	  	{
		"id": 2,
	    "category": "Three",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem()
	    },
	  	{
		"id": 3,
	    "category": "Example",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem() 
	    },
	  	{
		"id": 4,
	    "category": "Example",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem()  
	    },
	  	{
		"id": 5,
	    "category": "Dividers",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem()  
	    },
	  	{
		"id": 6,
	    "category": "Dividers",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem()  
	    },
	  	{
		"id": 7,
	    "category": "Dividers",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem()  
	    },
	  	{
		"id": 8,
	    "category": "Dividers",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem()  
	    },
	  	{
		"id": 9,
	    "category": "Dividers",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem()  
	    },
	  	{
		"id": 10,
	    "category": "Dividers",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem()  
	    },
	  	{
		"id": 11,
	    "category": "Dividers",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem()  
	    },
	  	{
		"id": 12,
	    "category": "Dividers",                                                       
		"title": "Example",
		"description": "An example",
		"hiddenIfo":randomLorem()  
	    }
	],
	_handleDrawerSelection: function(drawer, category, event) {
		
		
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
			var show = toggleButton.className;
			Mojo.Log.info("handleSoftwareSelection open/close " + show );
			this._toggleShowHideFolders(targetRow,this.controller.window.innerHeight,null,category);
		}
	},

	_toggleShowHideFolders: function (rowElement, viewPortMidway,noScroll, category) {
		if (!rowElement.hasClassName("details")) {
			return;
		}

		var toggleButton = rowElement.down("div.arrow_button");
		if (!toggleButton.hasClassName('palm-arrow-expanded') && !toggleButton.hasClassName('palm-arrow-closed')) {
			return;
		}

		var categoryItems = this.getElementsOfCategory(category);
		//Mojo.Log.info(category);
		//console.dir(categoryItems);
		
		var showFavorites = toggleButton.hasClassName('palm-arrow-closed');
		var folderContainer = rowElement.down('.collapsor');
		if (showFavorites) {
			var maxHeight = folderContainer.getHeight();
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
			categoryItems.each(this.moveElementsIntoDividers.bind(this));
			var maxHeight = folderContainer.getHeight();
		}
		
      var options = {reverse: !showFavorites,
					   onComplete: this._animationComplete.bind(this, showFavorites, categoryItems, folderContainer),
					   curve: 'over-easy',
					   from: 1,
					   to: maxHeight,
					   duration: 0.4};
		Mojo.Animation.animateStyle(folderContainer, 'height', 'bezier', options);
	},
	
	_animationComplete: function(showFavorites, categoryItems, folderContainer) {
		if (!showFavorites) {
			folderContainer.hide();
		}else{
			categoryItems.each(this.moveElementsOutOfDividers.bind(this));
		}
		folderContainer.setStyle({height:'auto'});
	}

});
