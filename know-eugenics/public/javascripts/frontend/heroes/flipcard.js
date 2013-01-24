/**
 * FlipCard
 * (c) 2012 Ben McMahen
 *
 * FlipCard may be freely distributed under the MIT license.
 * TO DO: Pagination. 
 */

$(function() {

	FlipCard = (function(Backbone, _, $) {

		var Browser = {};

		Browser.version = "0.0.2";

		Browser.options = {
			boxesPerRow: 5,
			paddingWidth: 20,
			paddingHeight: 40,
			boxHeight: 180,
			boxWidth: 150,
			wrapper: "#browser",
			toolbar: "#browser-toolbar",
			searchField: "#browser-search",
			filterClass: ".browser-filter",
			sortClass: ".browser-sort",
			cardViewTemplate: "",
			toolbarTemplate: "",
			justified: false
		};


/*
	Basic model for each card, only responsible for setting hide attribute. 
*/
		Browser.Card = Backbone.Model.extend({

			defaults: {
				selected: false
			},

			hide: function() {
				this.set({ hide: true });
			},

			show: function() {
				this.set({ hide: false });
			}

		});

/*
	Represents a collection of cards, and the primary logic for 
	filtering, sorting, and determining the location fo each card. 
*/

		Browser.Cards = Backbone.Collection.extend({

			model: Browser.Card,

			filterCards: function(query, field) {

				var filtered, modelsToHide; 

				if (this.hidden) this.showHiddenModels();

				console.log(field)

				if (typeof field != 'undefined') {
					var re = new RegExp(query, "i");
					filtered = this.filter(function(card) {
						return re.test(card.get(field));
					});
				} else {
					filtered = this.filter(function(card) {
						var field = card.get('tags');
						return _.contains(field, query);
					})
				}


				if (_.isUndefined(this.originalModels)) {
					this.originalModels = new Browser.Cards(this.models);
				}


				if (typeof field != 'undefined'){
					modelsToHide = this.reject(function(card) {
						return re.test(card.get(field));
					});
				} else {
					modelsToHide = this.reject(function(card){
						return _.contains(card.get('tags'), query)
					});
				}

				this.reset(filtered);
				this.filtered = true;
				this.determineLocation();

				this.hidden = new Browser.Cards();
				this.hidden.reset(modelsToHide).hideModels();
			},

			// Compute # Boxer Per Row (BPR)
			getBoxesPerRow: function() {

				var containerWidth = $(Browser.options.wrapper).width(),
					boxWidth = Browser.options.boxWidth,
					paddingWidth = Browser.options.paddingWidth;

				var getJustified = function(){
					var width = (containerWidth - (boxWidth * 2));
					return Math.floor(width/(boxWidth + paddingWidth)) + 2;
				}

				var getCentered = function(){
					return Math.floor(containerWidth/(boxWidth + paddingWidth));
				}

				// Use either get Justified or Centering logic to compute boxes per
				// row, depending on user settings.
				return Browser.options.justified ? getJustified() : getCentered()
			},

			// MX = left and right padding width of container, for centering. 
			getPaddingWidth: function() {

				var containerWidth = $(Browser.options.wrapper).width(),
					boxWidth = Browser.options.boxWidth,
					paddingWidth = Browser.options.paddingWidth,
					boxesPerRow = this.getBoxesPerRow();

				return (containerWidth - (boxesPerRow * boxWidth) - (boxesPerRow - 1) * paddingWidth) * 0.5;
			},

			// Determine location of a card
			determineLocation: function() {

				var mx = this.getPaddingWidth(),
					boxesPerRow = this.getBoxesPerRow(),
					paddingWidth = Browser.options.paddingWidth,
					paddingHeight = Browser.options.paddingHeight,
					boxHeight = Browser.options.boxHeight,
					boxWidth = Browser.options.boxWidth,
					containerWidth = $(Browser.options.wrapper).width();

				this.each(function(cardModel, index) {
					var r = Math.floor(index / boxesPerRow),
						c = index % boxesPerRow;

					var getCentered = function(){
						return mx + (c * (boxWidth + paddingWidth));	
					};

					var getJustified = function(){
						if (c === 0) return 0;
						else if (c === boxesPerRow - 1) return containerWidth - boxWidth;
						else {
							var remainingSpace = containerWidth - (boxWidth * boxesPerRow);
							var padding = remainingSpace / (boxesPerRow - 1);
							return boxWidth + (c * padding) + ((c - 1) * boxWidth)
						}
					}

					// Use either Centered logic or Justified logic for determining left position
					// of card elements.
					var left = Browser.options.justified ? getJustified() : getCentered()
					var top = ((r * boxHeight) + (r + 1) * paddingHeight);	

					cardModel.set({
						position_top: top,
						position_left: left
					});

				});

				return this;
			},

			// Determine height of wrapper DIV and trigger view event
			determineWrapperHeight: function() {

				var totalNumber = this.models.length,
					paddingHeight = Browser.options.paddingHeight,
					boxHeight = Browser.options.boxHeight,
					boxWidth = Browser.options.boxWidth,
					boxesPerRow = this.getBoxesPerRow();

				var totalRows = Math.ceil(totalNumber / boxesPerRow);
				var height = totalRows * (boxHeight + paddingHeight);

				this.trigger("setHeight", height);
				return height;

			},

			// Hides each model in the collection. 
			hideModels: function() {
				this.each(function(model) {
					model.hide();
				});
			},

			// Helper function for restoring models in collection.
			restoreModels: function() {
				this.reset(this.originalModels.models);
				this.filtered = false;
			},

			// Helper function for showing and restoring models in collection.
			showHiddenModels: function() {
				this.restoreModels();
				this.each(function(model) {
					model.show();
				});
			},

			// Sets comparator, activates it, and determines location.
			sortModels: function(field) {
				this.comparator = function(model) {
					// splits datestring and returns first digits
					if (field === 'dates') {
						var string = model.get(field);
						var dateArray = string.split(/-/);
						return dateArray[0];
					}
					return model.get(field);
				};
				this.sort().determineLocation();
			}
		});

/*
	Primarily the wrapper view for each Card View. Render should only be called
	when entire collection is being re-rendered. (i.e., the first load);
*/
		Browser.CardsView = Backbone.View.extend({

			tagName: "div",
			
			className: "cards",
			
			initialize: function(options) {
				this.collection.on('setHeight', this.setHeight, this);
			},
			
			render: function() {
				var views = this.collection.map(function(card) {

					var newCard = new Browser.CardView({
						model: card
					});

					return newCard.render().el;	
				});

				this.$el.append(views);
				return this;
			},
			
			setHeight: function(height) {
				this.$el.height(height);
			}

		});
/*
	CardView class represents each individual card and is responsible
	for the drawing each card. 
*/
		Browser.CardView = Backbone.View.extend({

			tagName: 'div',

			className: 'card',

			initialize: function() {
				this.template = Browser.options.cardViewTemplate;
				this.model.on('change:selected', this.selectClass, this);
				this.model.on('change:position_top', this.redraw, this);
				this.model.on('change:position_left', this.redraw, this);
				this.model.on('change:hide', this.redraw, this);
			},

			render: function(options) {
				var json = this.model.toJSON();
				json.id = this.model.cid; 
				this.$el.html(this.template(json));
				this.redraw();
				return this;
			},

			redraw: function() {
				this.changePosition().showOrHideCard();
			},

			selectClass: function() {
				if (this.model.get('selected')) this.$el.addClass('selected');
				else this.$el.removeClass('selected');
			},

			changePosition: function() {
				this.$el.css({
					'top': this.model.get("position_top"),
					'left': this.model.get("position_left")
				});
				return this;
			},

			showOrHideCard: function() {
				if (this.model.get("hide")) {
					this.$el.addClass('minimize').attr('aria-hidden', true);
				}
				else this.$el.removeClass('minimize').attr('aria-hidden', false);
				return this;
			},

			flipCard: function(event) {
				var $card = $(event.currentTarget);
				$card.hasClass('flip') ? $card.removeClass('flip') : $card.addClass('flip')
			},

			showDetail: function(event){
				var detailView = new Browser.DetailView({
					model: this.model,
				});

				Browser.options.app.transitionViews(detailView, this.model);
			}
		});

/*
	Represents a detailed view of the card clicked on.  
*/

		Browser.DetailView = Backbone.View.extend({

			initialize: function(attrs){
				this.template = Browser.options.detailViewTemplate;

			},

			render: function(options) {
				this.$el.html(this.template(this.model.toJSON()));
				return this; 
			},

			close: function(){
				this.remove();
				this.unbind(); 
			}
		});

/*
	The filterview provides built-in methods and events for using filters
	with the collection data. This needs to be generalized. 
*/
		Browser.FilterView = Backbone.View.extend({
			
			initialize: function(){
				this.template = Browser.options.toolbarTemplate;
			},

			className: 'toolbar',

			render: function() {
				this.$el.html(this.template({}));
				return this;
			},
		
			events: function(){
				var _events = {};

				_events[ 'keyup ' + Browser.options.searchField ] = 'searchCards';
				_events[ 'change ' + Browser.options.filterClass ] = 'filterCards';
				_events[ 'click ' + Browser.options.sortClass ] = 'sortCards';

				return _events;
			},
			
			filterCards: function(event) {
				event.preventDefault();
				var filterField = $(Browser.options.filterClass + ' :selected').val()

				if (filterField === "all") {
					this.collection.showHiddenModels();
					this.collection.determineLocation();
				}
				else this.collection.filterCards(filterField);
			},
			
			sortCards: function(event) {
				event.preventDefault();

				var sortField = $(event.target).data('sort-field');

				if (!_.isUndefined(sortField)) this.collection.sortModels(sortField);
			},
			
			searchCards: function(event) {
				event.preventDefault();

				var query = $(Browser.options.searchField).val();
				this.collection.filterCards(query, 'name');
			}
		});

/*
	The appview handles initialization of the browser by creating the
	necessary collections and views. It also handles options/defaults.
*/
		Browser.AppView = Backbone.View.extend({

			initialize: function(data, options) {

				// Set Browser Options
				Browser.options = _.defaults(options, Browser.options);
				Browser.options.app = this; 

				// Create new Cards collection, add data, and determine location.
				this.cards = new Browser.Cards();
				this.cards.add(data).determineLocation();

				this.detailView = new Browser.DetailView({
					model: this.cards.at(0)
				});

				// Create the view with the data and append to DOM
				this.cardsView = new Browser.CardsView({
					collection: this.cards
				});

				this.cards.determineWrapperHeight();
				$(Browser.options.wrapper).append(this.cardsView.render().el);

				// Create filters/sorts/search view and append to DOM
				var filterView = new Browser.FilterView({
					collection: this.cards
				});
				$(Browser.options.toolbar).append(filterView.render().el);
			},

			redraw: function() {
				this.cards.determineLocation();
			},

			transitionViews: function(view, model) {
				model.set('selected', true);

				if (this.currentModel){
					if (!_.isEqual(this.currentModel, model)) {
						this.currentModel.set('selected', false);
					}
				}

				if (this.currentView) this.currentView.close();
				$(Browser.options.detailView).html(view.render().el);

				this.currentView = view; 
				this.currentModel = model; 
			}
		});

		return Browser;

	})(Backbone, _, window.jQuery || window.Zepto || window.ender);

});