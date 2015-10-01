;(function($){

	$.fn.AWSelect = function(options) {

			var defaults = {


				selectedValue: null,
				selectClassName: 'aw-select', 
				selectHeaderAllowHtml: true,

				onCreate: function(selectDiv, select) {

				},
				
				onOpen: function(selectDiv, select) {

				},
				
				onChoseItem: function(selectDiv, select, item) {

				},
				
				onClose: function(selectDiv, select) {

				},

				selectOptionText: function(option, optionText) {

					return optionText;
				}

			};
			
			options  = $.extend(defaults, options);


			function Select($select)
			{
				this.select       = $select;
				this.options      = this.select.children("option");
				this.optionsTotal = this.options.length;

				this.getOptions =  function() {

					return this.options;
				};

				this.selectedItem =  function($selectedItem) {

					$selectedItem.siblings().removeClass("selected");
					$selectedItem.addClass("selected");

				};

			}


			function Template(select) {

				this.template       = $('<div class="'+options.selectClassName+'"><div class="header"></div><div class="body"></div></div>');
				this.templateHeader = this.template.find(".header");
				this.templateBody   = this.template.find(".body");
				this.ul             = $("<ul>");
				this.select         = select;

		
				this.getTemplate = function() {
					return this.template;
				};

				this.getHeader = function() {
					return this.templateHeader;
				};			

				this.getBody = function() {
					return this.templateBody;
				};

				this.getList = function() {

					return this.ul;
				};

				this.createList = function() {

					var $ul = this.ul;
					var list = [];
					this.select.getOptions().each(function(index){

						var $option = $(this);
						var $li     = $("<li>", {
						'html'      : options.selectOptionText.call(this, $option, $option.text()),
						'data-value': $option.val()
						});

						
						list.push($li);
					});

					$ul.append(list);

					this.getBody().append($ul);

				}

			}

			return this.each(function(){


				// cache select element
				var $select  = $(this);
				
				// select init & store & prepare
				var _select = new Select($select);
				
				// template for fake select
				var _template = new Template(_select);
				_template.createList();


				// set default text
				_template.getHeader().text($select.children("option").eq(0).text());

				// click on fake select
				_template.getTemplate().on('click', function(e){

					var openedSelects = $('.' + options.selectClassName).not(this).filter('.opened');
					if (openedSelects.length)
					{
						openedSelects.each(function(){
							$(this).trigger('click');
						});
					}


					if ($(this).hasClass('opened'))
					{
						$(this).removeClass('opened');
						options.onClose.call(this, _template.getTemplate(), $select);
					}
					else
					{
						$(this).addClass('opened');
						options.onOpen.call(this, _template.getTemplate(), $select);
					}

					_template.getBody().scrollTop(0); // scroll up again
					
				});



				// click on list item
				_template.getList().find('li').on('click', function(e){

					e.stopPropagation();

					var $selectedItem = $(this);

					_select.selectedItem($selectedItem);
					options.selectHeaderAllowHtml ? _template.getHeader().html($selectedItem.html()) : _template.getHeader().text($selectedItem.text());
					$select.val($selectedItem.data('value'));

					options.onChoseItem.call(this, _template.getTemplate(), $select, $selectedItem);
					options.onClose.call(this, _template.getTemplate(), $select);				

					$(document).trigger('click');
				});	


				// selectd value
				var $selectedOption = $('option:selected', $select);
				var $selectedItem   = _template.getList().find('li[data-value='+$selectedOption.val()+']');


				// explicit way = selected value by option settings
				if (options.selectedValue !== null)
				{
					var $selectedItem   = _template.getList().find('li[data-value='+options.selectedValue+']');
				}



				if ($selectedItem.length)
				{
					_select.selectedItem($selectedItem);
					options.selectHeaderAllowHtml ? _template.getHeader().html($selectedItem.html()) : _template.getHeader().text($selectedItem.text());
					
					$select.val($selectedItem.data('value'));
				}
			


				// close select on document area click
				$(document).on('click', function(e){

					var $target = $(e.target);
					var $parent = $target.closest('.' + options.selectClassName);
					
					if (!$parent.length)
					{
						_template.getTemplate().removeClass('opened');
						options.onClose.call(this, _template.getTemplate(), $select);
					}
				});

				// final output, hide native select
				_template.getTemplate().insertAfter($select);


				// onCreated
				options.onCreate.call(this, _template.getTemplate(), $select);


				$select.hide();


			});

	};

})(jQuery);