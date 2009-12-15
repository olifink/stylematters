function exampleCategory (modelItem) {
	return $L(modelItem.category);
}

ListAssistant = Class.create( OrientationHandlerAssistant, {
	setup: function() {
		if (PalmSystem.setWindowOrientation) {
			PalmSystem.setWindowOrientation("free");
		}
		
		var sceneName;
		this.examplesModel = {listTitle: $L('Examples'), items:this.kExamples};
		this.controller.setupWidget('examples',
            				{
                        itemTemplate: 'example',
                        dividerTemplate: 'divider',
                        dividerFunction: exampleCategory,
                        filterFunction: this.filterExamples.bind(this),
                        renderLimit: 80
            				},
            				this.examplesModel);
		this.controller.listen('examples', Mojo.Event.listTap, this.handleListTap.bindAsEventListener(this));
		this.controller.get('mojo-info').innerHTML = Mojo.Version.use+" / "+Mojo.Versions["1"];
	},
	convertSceneName: function(sceneId) {
		return sceneId.gsub("_", "-");
	},
	
	activate: function() {
		var sceneCookie = new Mojo.Model.Cookie("sceneCookie");
		sceneCookie.put("");
	},
	
	filterExamples: function(filterString, listWidget, offset, count) {
		var matching, lowerFilter;
		if (filterString) {
			lowerFilter = filterString.toLocaleLowerCase();
			function matches (example) {
				if(example.title && example.title.toLocaleLowerCase().startsWith(lowerFilter)){
            		return example.title.toLocaleLowerCase().startsWith(lowerFilter);            
				}else if(example.keywords && example.keywords .toLocaleLowerCase().match(lowerFilter)){
            		return example.keywords.toLocaleLowerCase().match(lowerFilter);
				}else{
            		return false;
				}
			}
			matching = this.kExamples.findAll(matches);
		} else {
			matching = this.kExamples;
		}
		this.examplesModel.items = matching;			
		listWidget.mojo.setLength(matching.length);
		listWidget.mojo.setCount(matching.length);
		listWidget.mojo.noticeUpdatedItems(0, matching);
	},

	listElementSelector: 'div[id^="line_"]',

	handleListTap: function(listTapEvent) {
		var example = listTapEvent.item;
		var sceneName = this.convertSceneName(example.name);
		var title = example.title;
		var description = example.description;
		var sceneTemplate = example.sceneTemplate;
		
		Mojo.Log.info(title + " " + description + " " + example.disabled);
		if (sceneName === 'test') {
			Mojo.Test.pushTestScene(this.controller.stageController);
		} else {
			if(listTapEvent.originalEvent.down.shiftKey) {
				this.showSceneHandler = this.showScene.bind(this, sceneName);
				Mojo.Controller.getAppController().createStageWithCallback({name: sceneName, lightweight: true}, this.showSceneHandler);
			} else if(!example.disabled){
				ListAssistant.showScene(sceneName, this.controller.stageController, title, description, sceneTemplate);
				var sceneCookie = new Mojo.Model.Cookie("sceneCookie");
				sceneCookie.put({"name":sceneName,"title":title,"description":description,"sceneTemplate":sceneTemplate});
			}
		}				
		listTapEvent.stop();
	}
});

ListAssistant.showScene = function(sceneName, stageController, title, description, sceneTemplate) {
	stageController.pushScene({'name': sceneName, 'sceneTemplate': sceneTemplate }, $L(title), $L(description));            
}

ListAssistant.prototype.kExamples =
[
	//scene basics
  	{
	"name": "palmbackdrop",   	
    "category": "Scene Basics",
	"title": "Backdrop",
	"description": "the background of your scene",
	"sceneTemplate":"sublist",
	"keywords":"body background"
    },
	{
	"name": "palmmenudemo",
    "category": "Scene Basics",
	"title": "View & Command menus",
	"description": "floating menu system at the top and bottom of your scene, and the gradient fades behind them",
	"sceneTemplate":"sublist",
	"keywords":"command menu button"
	},
	{
	"name": "fixed-header-example",
  	"category": "Scene Basics",
	"title": "Fixed Header",
	"description": "floating header atop your scene; visually identical to the View Menu",
	"keywords":"header view menu"
	},
	{
	"name": "palmscrollfades",
    "category": "Scene Basics",
	"title": "Scroll Fades",
	"description": "in the absence of view or command menus, these fades at the edge of your scene indicate more content",
	"sceneTemplate":"sublist",
	"keywords":"fades gradient"
	},
	{
	"name": "palmpageheader-example",
	"category": "Scene Basics",
	"title": "Page Header",
	"description": "the topmost element of the scrollable content; commonly used atop preference scenes",
	"keywords":"header scrolling"
    },
	{
	"name": "scrims-example",
	"category": "Scene Basics",
	"title": "Scrims",
	"description": "a translucent layer used to obscure background UI, when modal foreground UI is layered on top of the current scene",
	"keywords":"transparent clear alpha"
    },
	{
	"name": "palmdark-example",
	"category": "Scene Basics",
	"title": "Styling Dark Scenes",
	"description": "framework styling has its dark side",
	"keywords":"dark theme"
    },
	//list basics
	{
	"name": "palmlist",
    "category": "List Basics",
	"title": "Lists & Rows",
	"description": "rows stacked vertically within lists, designed for legibility and touch interaction",
	"sceneTemplate":"sublist",
	"keywords":"rows palm-row"
  	},
	{
	"name": "separators-example",
    "category": "List Basics",
	"title": "Separators",
	"description": "thin lines which visually separate rows",
	"keywords":"lines dividers"
  	},
	{
	"name": "touchfeedback-example",
    "category": "List Basics",
	"title": "Touch Feedback",
	"description": "displaying alternate background images and styling in response to user interaction",
	"keywords":"feedback tf"
  	},
	{
	"name": "reorder-example",
    "category": "List Basics",
	"title": "Reordering List Items",
	"description": "the space in between reordered rows, and row you're moving",
	"keywords":""
  	},
	{
	"name": "swipedelete-example",
    "category": "List Basics",
	"title": "Swipe to Delete Items",
	"description": "the row being deleted and confirmation buttons",
	"keywords":""
  	},
	{
	"name": "add-remove-rows-example",
	"category": "List Basics",
	"title": "Add/Remove Rows",
	"description": "the 'add item' row appended to a list and 'remove item' button for removable rows",
	"keywords":""
	},
	//dividers
	{
	"name": "solid-dividers-example",
  	"category": "Dividers",
	"title": "Solid Dividers",
	"description": "bold lines which divide a scene or list of rows",
	"keywords":"divider"
	},
	{
	"name": "labeleddividers-example",
  	"category": "Dividers",
	"title": "Labeled Dividers",
	"description": "bold lines with labels which divide a scene or list of rows",
	"keywords":"divider"
  	},
	{
	"name": "alphabetical-dividers-example",
  	"category": "Dividers",
	"title": "Alphabetical Dividers",
	"description": "bold lines containing a single character which divide a scene or list of rows",
	"keywords":"divider"
	},
	{
	"name": "collapsibledividers",
  	"category": "Dividers",
	"title": "Collapsible Dividers",
	"description": "dividers which control corresponding drawers of content",
	"sceneTemplate":"sublist",
	"keywords":"divider"
	},
	//Text
	{
    "name": "typography-font-families",
    "category": "Text",
    "title": "Fonts",
    "description": "Mojo uses the Prelude font family",
    "keywords":"text typeface prelude"
    },
    {
    "name": "typography-basic-styles",
    "category": "Text",
    "title": "Basic Text Styles",
    "description": "body copy and informational text styles",
    "keywords":"text body style copy"
    },
	{
	"name": "text-capitalization",
  	"category": "Text",
	"title": "Capitalization",
	"description": "some Mojo widgets and styles shift strings to uppercase or apply capitalization",
	"keywords":"text uppercase title"
  	},
	{
	"name": "text-truncation",
  	"category": "Text",
	"title": "Truncation",
	"description": "force text to fit within the available space, with an ellipsis added as needed",
	"keywords":"text"
  	},
	//page containers
	{
	"name": "labeledgroup",
  	"category": "Page Containers",
	"title": "Labeled Group",
	"description": "visually group a list with a label",
	"keywords":"group container"
  	},
	{
	"name": "unlabeledgroup-example",
 	"category": "Page Containers",
	"title": "Unlabeled Group",
	"description": "visually group a list without a label",
	"keywords":"group container"
  	},
	{
	"name": "drawers",
  	"category": "Page Containers",
	"title": "Drawers",
	"description": "hide UI or lists with an area which animates open and closed",
	"sceneTemplate":"sublist",
	"keywords":"container hide"
	},
	//panels
	{
	"name": "dialog-example",
 	"category": "Panels",
	"title": "Dialogs",
	"description": "a modal panel pinned to the bottom of the scene",
	"keywords":"panel"
  	},
	{
	"name": "submenu-example",
  	"category": "Panels",
	"title": "Submenus",
	"description": "a popup panel containing UI or lists, floating above all other scene UI",
	"keywords":"panel"
  	},
	{
	"name": "menupanel-example",
  	"category": "Panels",
	"title": "Menu Panels",
	"description": "a popup panel containing UI or lists, floating underneath the view or command menu",
	"keywords":""
  	},
  	{
	"name": "dashboard-panels-example",
    "category": "Panels",
	"title": "Dashboard Panels",
	"description": "",
	"keywords":"panel"
  	},
	//ui widgets
  	{
	"name": "checkboxes-example",
    "category": "UI Widgets",
	"title": "Checkboxes",
	"description": "",
	"keywords":"widgets"
  	},
  	{
	"name": "toggle-buttons-example",
    "category": "UI Widgets",
	"title": "Toggle Buttons",
	"description": "",
	"keywords":"widgets"
  	},
 	{
	"name": "buttons-example",
    "category": "UI Widgets",
	"title": "Buttons",
	"description": "",
	"keywords":"widgets"
  	},
  	{
	"name": "radio-buttons-example",
    "category": "UI Widgets",
	"title": "Radio Buttons",
	"description": "",
	"keywords":"widgets"
  	},
  	{
	"name": "widgetlistselectors-example",
    "category": "UI Widgets",
	"title": "List Selectors",
	"description": "",
	"keywords":"widgets"
  	},
  	{
	"name": "sliders",
    "category": "UI Widgets",
	"title": "Sliders",
	"description": "",
	"sceneTemplate":"sublist",
	"keywords":"widgets"
  	},
  	{
	"name": "activity-indicators",
    "category": "UI Widgets",
	"title": "Activity Indicators",
	"description": "",
	"sceneTemplate":"sublist",
	"keywords":"widgets indicators spinner"
  	},
	{
	"name": "multi-value-picker-single-picker",
    "category": "UI Widgets",
	"title": "Integer Picker",
	"description": ""
	},
	{
	"name": "multi-value-picker-date-picker",
    "category": "UI Widgets",
	"title": "Date Picker",
	"description": ""
	},
	{
	"name": "multi-value-picker-time-picker",
    "category": "UI Widgets",
	"title": "Time Picker",
	"description": ""
	},
  	{
	"name": "filter-field-example",
    "category": "UI Widgets",
	"title": "Filter Field",
	"description": "",
	"keywords":"widgets"
  	},
 	{
	"name": "textfields",
    "category": "UI Widgets",
	"title": "Textfields",
	"description": "",
	"sceneTemplate":"sublist",
	"keywords":"widgets"
  	},
  	{
	"name": "file-download-progress-example",
    "category": "UI Widgets",
	"title": "Progress Pill",
	"description": "",
	"keywords":"widgets"
  	},
  //iconography
  	{
	"name": "checkmark-example",
    "category": "iconography",
	"title": "Checkmark",
	"description": "",
	"keywords":"icons"
  	},
	{
	"name": "status-indicators-example",
    "category": "iconography",
	"title": "Status Indicators",
	"description": "",
	"keywords":"icons indicators availability online"
  	},
  	{
	"name": "account-icons-example",
    "category": "iconography",
	"title": "Account Icons",
	"description": "",
	"keywords":"icons"
 	},
	//HANDLING ERRORS
	{
	"name": "form-errors",
    "category": "HANDLING ERRORS",
	"title": "Form Errors",
	"description": "",
	"keywords":"errors"
  	},
  	{
	"name": "dialog-errors",
    "category": "HANDLING ERRORS",
	"title": "Dialog Errors",
	"description": "",
	"keywords":"errors"
  	},
	{
	"name": "menupanel-errors",
    "category": "HANDLING ERRORS",
	"title": "Menu Panel Errors",
	"description": "",
	"keywords":"errors"
  	},
	{
	"name": "dashboard-errors",
    "category": "HANDLING ERRORS",
	"title": "Dashboard Panel Errors",
	"description": "",
	"keywords":"errors"
  	},
	{
	"name": "fullscreen-error",
    "category": "HANDLING ERRORS",
	"title": "Full Screen Errors",
	"description": "",
	"keywords":""
	},
  //tips & tricks
 	{
	"name": "touchability",
    "category": "tips & tricks",
	"title": "Touchability",
	"description": "strategies for creating large, gapless hit targets",
	"keywords":"tips hit target finger touch"
  	},
 	{
	"name": "optimizing-images",
    "category": "tips & tricks",
	"title": "Optimizing Images",
	"description": "",
	"keywords":"tips images png jpg gif"
  	},
  	{
	"name": "nine-tile-images",
    "category": "tips & tricks",
	"title": "9-tile Images",
	"description": "",
	"keywords":"tips nine"
  	},
  	{
	"name": "vertical-alignment",
    "category": "tips & tricks",
	"title": "Vertical Alignment",
	"description": "Aligning text or elements within a DIV",
	"keywords":"tips vertical alignment middle"
  	},
  	{
	"name": "unsupported-css",
    "category": "tips & tricks",
	"title": "Unsupported CSS Properties",
	"description": "",
	"keywords":"tips not supported webkit-border-radius CSS opacity alpha"
  	},
  	{
	"name": "custom-css",
    "category": "tips & tricks",
	"title": "Custom CSS Properties",
	"description": "",
	"keywords":"tips webkit palm ignore"
  	}
];
