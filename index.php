<!DOCTYPE html>
<html class="no-js">
	<head>
	<meta charset="UTF-8" />
    <title>Select</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" href="https://necolas.github.io/normalize.css/3.0.2/normalize.css" />
	
	<link rel="stylesheet" href="aw-select.css" />		
	<link rel="stylesheet" href="aw-select-dark.css" />		
	
	<script src="jquery.js"></script>
	<script src="aw-select.jquery.js"></script>

	<style>
	p
	{
		margin: -.5em 3em;
		margin-bottom: 1em;
	}
	</style>

	<script>

		$(document).ready(function(){


			$("#countries").AWSelect({


				//selectedValue: 'it',

				onCreate: function(selectDiv, select) {

					$(selectDiv).after("<p>onCreate: vytvořen select z #first-select</p>");
				},

				selectOptionText: function(option, optionText) {

					var $option = $(option);
					var $flag   = $option.data('flag');
					var $users   = $option.data('users');

					return "<img src='flags/"+$flag+"' /> " + optionText + '<span style=\"color: gray; display: inline-block; margin-left: 5px;\">('+$users+')</span>';
				}
			});


			$("#pics").AWSelect({

				selectHeaderAllowHtml: false,
				selectClassName: 'aw-select-dark',
				
				selectOptionText: function(option, optionText) {

					var $option = $(option);
					var $pic   = $option.data('pic');
					optionText = "<h3 style='display: inline-block; color: #fff'>"+optionText+"</h3>";
					return "<img src='pics/"+$pic+"' style=\"width: 100px; height: 100px; vertical-align: middle;\"/> " + optionText;
				}
			});



			$("select.aw-select").AWSelect({

				selectedValue: null,

				onCreate: function(selectDiv, select) {

					console.log('onCreate', selectDiv, select);
				},

				onOpen: function(selectDiv, select) {

					console.log('onOpen', selectDiv, select);
				},

				onClose: function(selectDiv, select) {

					console.log('onClose', selectDiv, select);
				},			

				onChoseItem: function(selectDiv, select, item) {

					console.log('onChoseItem', selectDiv, select, item);
				}
			});		


		});

	</script>	



</head>
<body>

<? print_R($_POST) ?>

<form action="" method="POST">
	

<select name="select1" id="countries">
	<option value="cz" data-flag='cz.png' data-users="10 milionů">Česká republika - hodně dlouhý popisek aby se schválně nevešel a musel být oříznut</option>
	<option value="de" data-flag='de.png' data-users="60 milionů">Německo</option>
	<option value="jp" data-flag='jp.png' data-users="230 milionů">Japonsko</option>
	<option value="it" data-flag='it.png' data-users="33 milionů">Itálie</option>
</select>


<select name="select1-1" id="pics">
	<option value="spider-vepr" data-pic='Spider-Pig-spiderpig-236328_750_580.gif'>Spider vepř</option>
	<option value="teddy" data-pic='teddy.jpg'>Teddy bear</option>
	<option value="frog" data-pic='UG_Frog.jpg'>Mr. Frog</option>
	<option value="carl" data-pic='carel.jpg'>Cárl von Banhoff</option>
</select>




<select name="select2" class="aw-select">
	<? for ($i = 1; $i <= 10; $i++): ?>
	<option value="b<?= $i ?>">Název položky <?= $i ?></option>
	<? endfor; ?>
</select>


<select name="select3" class="aw-select">
	<? for ($i = 1; $i <= 20; $i++): ?>
	<option value="c<?= $i ?>">Název položky <?= $i ?></option>
	<? endfor; ?>
</select>



<select name="select4" class="aw-select">
	<option value="d10">Název položky 10</option>
	<option value="d20" selected>Název položky 20</option>
	<option value="d30">Název položky 30</option>
</select>


<input type="submit" name="submit" value="Odeslat" />

</form>





</body>
</html>