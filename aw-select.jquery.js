;(function($){


	$.fn.AWScrollTo = function(elem) { 
	    $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top); 
	    return this; 
	};


	$.fn.AWSelect = function(options) {

			var defaults = {

				
				selectedValue        : null,
				selectClassName      : 'aw-select', 
				selectHeaderAllowHtml: true,
				filterShow           : true,
				filterText           : 'Find ...',
				filterNoResult       : 'Sorry, no results ...',


				onCreate: function(fakeSelect, nativeSelect) {

				},
				
				onOpen: function(fakeSelect, nativeSelect) {

				},
				
				onChoseItem: function(fakeSelect, nativeSelect, item) {

				},
				
				onClose: function(fakeSelect, nativeSelect) {

				},

				selectOptionText: function(option, optionText) {

					return optionText;
				}

			};
			
			options  = $.extend(defaults, options);


			function makeUrl(s)
			{

				var nodiac = { 'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i', 'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z' };
				s = s.toLowerCase();
			    var s2 = '';
			    for (var i=0; i < s.length; i++) {
			        s2 += (typeof nodiac[s.charAt(i)] != 'undefined' ? nodiac[s.charAt(i)] : s.charAt(i));
			    }

			    return s2;
			    //return s2.replace(/[^a-z0-9_]+/g, '-').replace(/^-|-$/g, '');
			}



			function NativeSelect($select)
			{
				this.select       = $select;
				this.options      = this.select.children("option");
				this.optionsTotal = this.options.length;
			}


			function FakeSelect(nativeSelect) {

				this.searchInput     = '<div class="'+options.selectClassName+'-search"><input type="text" placeholder="'+options.filterText+'" /></div>';
				this.searchNoResults = '<div class="'+options.selectClassName+'-search-noresults">'+options.filterNoResult+'</div>';
				this.template        = $('<div class="'+options.selectClassName+'"><div class="header"></div><div class="body"></div></div>');
				this.header          = this.template.find(".header");
				this.body            = this.template.find(".body");
				this.ul              = $("<ul>");
				this.nativeSelect    = nativeSelect;

		
				this.getTemplate = function() {
					return this.template;
				};

				this.getHeader = function() {
					return this.header;
				};			

				this.getBody = function() {
					return this.body;
				};

				this.getList = function() {
					return this.ul;
				};

				this.createList = function() {

					var $ul = this.ul;
					var list = [];
					this.nativeSelect.options.each(function(index){

						var $option = $(this);
						var $li     = $("<li>", {
						'html'      : options.selectOptionText.call(this, $option, $option.text()),
						'data-value': $option.val()
						});

						
						list.push($li);
					});

					$ul.append(list);

					this.getBody().append($ul);

					// add filter search
					if (options.filterShow)
					{
						this.getBody().prepend(this.searchNoResults);
						this.getBody().prepend(this.searchInput);
					}

				};

				this.setSelected =  function($selectedItem) {

					$selectedItem.siblings().removeClass("selected");
					$selectedItem.addClass("selected");
				
				};


				this.open = function() {

					this.template.addClass('opened');
				};

				this.close = function() {

					// reset search input
					if (this.nativeSelect.select.data('options').filterShow)
					{
						this.template.find('input').val('').trigger('keyup');
					}

					this.template.removeClass('opened');
				};

			}
			

			return this.each(function(){

				// cache select element
				var $select      = $(this);

				// select init & store & prepare
				var nativeSelect = new NativeSelect($select);
				
				// fakeselect (wrapper) for fake select
				var fakeSelect   = new FakeSelect(nativeSelect);
				fakeSelect.createList();

				$select.data('nativeSelect', nativeSelect)
				$select.data('fakeSelect', fakeSelect);
				$select.data('options', options);


				// set default text
				fakeSelect.getHeader().text($select.children("option").eq(0).text());

				// click on fake select
				fakeSelect.getTemplate().on('click', function(e){


					var openedSelects = $('.' + options.selectClassName).not(this).filter('.opened');
					if (openedSelects.length)
					{
						openedSelects.each(function(){

							// reset 
							var openSelect = $(this);
							openSelect.trigger('click');
						});
					}



					if ($(this).hasClass('opened'))
					{
						fakeSelect.close();
						options.onClose.call(this, fakeSelect.getTemplate(), $select);

					}
					else
					{
						fakeSelect.open();
						options.onOpen.call(this, fakeSelect.getTemplate(), $select);

					}

					//fakeSelect.getBody().scrollTop(0); // scroll up again
					// set scrollbar position 
					fakeSelect.getList().AWScrollTo(fakeSelect.getBody().find('li.selected'));


				});



				// click on list item
				fakeSelect.getList().find('li').on('click', function(e){

					e.stopPropagation();

					var $selectedItem = $(this);

					fakeSelect.setSelected($selectedItem);
					options.selectHeaderAllowHtml ? fakeSelect.getHeader().html($selectedItem.html()) : fakeSelect.getHeader().text($selectedItem.text());
					$select.val($selectedItem.data('value'));

					options.onChoseItem.call(this, fakeSelect.getTemplate(), $select, $selectedItem);
					options.onClose.call(this, fakeSelect.getTemplate(), $select);				

					fakeSelect.close();
				});	



				// click on search
				fakeSelect.getTemplate().find('input').on('click', function(e){

					e.stopPropagation();
					var $searchInput = $(this);

					$searchInput.on('keyup', function(){

						var searchWord     = makeUrl($.trim($searchInput.val()));
						var nothingFounded = true;

						fakeSelect.getList().find('li').each(function(){

							var $li         = $(this);
							var $textNodiac = makeUrl($li.text());
							
							if ($textNodiac.match(searchWord))
							{
								nothingFounded = false;
								$li.show();
							}
							else
							{
								$li.hide();
							}
						});

						fakeSelect.getTemplate().find('.' + options.selectClassName +'-search-noresults')[nothingFounded ? 'show' : 'hide']();
					
					});

				});



				// selectd value
				var $selectedOption = $('option:selected', $select);
				var $selectedItem   = fakeSelect.getList().find('li[data-value='+$selectedOption.val()+']');


				// explicit way = selected value by option settings
				if (options.selectedValue !== null)
				{
					var $selectedItem   = fakeSelect.getList().find('li[data-value='+options.selectedValue+']');
				}



				if ($selectedItem.length)
				{
					fakeSelect.setSelected($selectedItem);
					options.selectHeaderAllowHtml ? fakeSelect.getHeader().html($selectedItem.html()) : fakeSelect.getHeader().text($selectedItem.text());
					
					$select.val($selectedItem.data('value'));
				}
			


				// close select on document area click
				$(document).on('click', function(e){


					var $target = $(e.target);
					var $parent = $target.closest('.' + options.selectClassName);
					
					if (!$parent.length)
					{
						fakeSelect.close();
						options.onClose.call(this, fakeSelect.getTemplate(), $select);
					}
				});

				// final output, hide native select
				fakeSelect.getTemplate().insertAfter($select);


				// onCreated
				options.onCreate.call(this, fakeSelect.getTemplate(), $select);



				$select.hide();


			});

	};

})(jQuery);