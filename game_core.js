//Ostatnie zmiany - 07-02-2016 23:00
 var tab = '<tr class="topRow"><th></th>';
 var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']; //tablica liter do generowania plansz
 var your_move = true; //zmienna decydująca o tym kto ma ruch
 var Total_Ships_Hit = 0;
 var Total_MyShips_Hit = 0;
 var ShipsSet = 0; //liczba ustawionych statków
 var player_id; //id gracza - prawdopodobnie do zlikwidowania w przyszłości na rzecz socket_id
 
 function OznaczPudla(maszty, ship_id, grid_id) { //wywołanie: OznaczPudla(data.maszty, data.ship_id, grid_id='Enemy_Ships' lub null);
	if(grid_id == 'Enemy_Ships') tab = EnemyShips; else tab = MyShips;
 	$.each(tab[maszty][ship_id], function(i, v) { //odnalezienie trafianego masztu w tablicy i oznaczenie go jako trafiony 
		var vectors = [[1, -1], [1, 0], [1, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1], [0, 1]];
		for (index in vectors)
        {
		    var checkXCoordinate = parseInt(v.x) + vectors[index][0];
            var checkYCoordinate = parseInt(v.y) + vectors[index][1];
			if (IsNotHit(checkXCoordinate, checkYCoordinate, grid_id)) 
				GetCell(checkXCoordinate, checkYCoordinate, grid_id).html('<span class="glyphicon glyphicon-certificate"></span>');
 	}
 });
}
 
function fillAround(shipSize) {    //Obrysowanie wstawianego statku na planszy
     jQuery.each(MyShips[shipSize], function(i, ship) {
         jQuery.each(ship, function(j, mast) {
            var mastX = mast['x'];
            var mastY = mast['y'];
            if (IsOnGrid(mastX, mastY))
                MarkBorderForMast(mastX, mastY);
         })
     });
 }

 function IsOnGrid(x, y)
 {
    return x > 0 && y > 0;
 }
function IsNotHit(x,y, grid_id)
{
	return !GetCell(x,y, grid_id).hasClass('maszt-hit');
}
 function MarkBorderForMast(mastXCoordinate, mastYCoordinate)
 {
        var vectors = [[1, -1], [1, 0], [1, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1], [0, 1]];
        for (index in vectors)
        {
            var checkXCoordinate = parseInt(mastXCoordinate) + vectors[index][0];
            var checkYCoordinate = parseInt(mastYCoordinate) + vectors[index][1];
            if (!IsMarkedAsMast(checkXCoordinate, checkYCoordinate))
                MarkAsBorder(checkXCoordinate, checkYCoordinate);
        }
 }

function IsMarkedAsMast(x, y)
 {
    return GetCell(x, y, 'shipgrid').hasClass('maszt-marked');
 }

 function MarkAsBorder(x, y)
 {
    GetCell(x, y, 'shipgrid').addClass('maszt-otoczenie').prop('maszt_o', 'true');
 }

 function GetCell(x, y, ship_id)
 {
    return $('#'+ship_id).find('td[x=' + x + '][y=' + y + ']');
 }
 function ExistsAdjacentMast(x, y) {    //Sprawdzenie czy obok pola o podanych x i y znajduje sie już pole z masztem
    var vectors = [[1, 0], [0, -1], [-1, 0], [0, 1]];
    for (index in vectors)
    {
        if (IsMarkedAsMast(parseInt(x) + vectors[index][0], parseInt(y) + vectors[index][1]))
            return true;
    }

    return false;
 }

 function makeGrid(param) {	//Generowanie planszy
 //param=2 -> dwie plansze dla gracza i przeciwnika, 
 //param<>2 -> jedna plansza do ustawiania statków
 
 	tab = '<tr class="topRow"><td></td>';
 	$.each(letters, function() {

 		tab += '<td>' + this + '</td>';
 		if (this == 'J') tab += '</tr>';
 	});
 	if (param == 2) {
 		$("#My_Ships").append(tab);
 		$("#Enemy_Ships").append(tab);
 		tab = '';
 	} else {$("#shipgrid").append(tab); }
 	tab = '';
 	for (var y = 1; y < 11; y++) {
 		tab += "<tr><td class='cyfry'>" + y + "</td>";
 		for (var x = 1; x < 11; x++)
 		tab += "<td x=" + x + " y=" + y + " shipf='false'></td>";
 		tab += "</tr>";
 	}
 	if (param == 2) {
 		$("#My_Ships").append(tab);
 		$("#Enemy_Ships").append(tab);
 	} else $("#shipgrid").append(tab);
 	tab = '';
 }

 function Enemy_Move() {	//Przekazanie ruchu przeciwnikowi
 	your_move = false;
	$("#mask").css('display', 'block');
 	$("#move-info").removeClass("alert-success").addClass('alert-warning').html('Ruch przeciwnika');
 }

 function Your_Move() {		//Twój ruch
 	your_move = true;
	$("#mask").css('display', 'none');
 	$("#move-info").removeClass("alert-warning").addClass('alert-success').html('Twój ruch');
 }

 function StartGame() {	//start gry
	player_id=channel.members.myID;
 	$("#shipgrid").off("td");
 	gamestate = 3;
 	$("body").empty();
 	$('body').append('<div class="alert alert-info" role="alert" id="move-info"></div>');
 	$('body').append("<div id='statki-main'>");
	$('#statki-main').append('<div id="my_ship_legend"><div class="ship-4"><span class="maszt-legend"></span><span class="maszt-legend"></span><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-3" style="float:left"><span class="maszt-legend"></span><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-3" style="margin-left:50px;"><span class="maszt-legend"></span><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-2" style="float:left"><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-2" style="float:left;margin-left:15px;"><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-2" style="margin-left:80px;"><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-1" style="float:left"><span class="maszt-legend"></span></div><div class="ship-1" style="float:left"><span style="margin-left:10px;" class="maszt-legend"></span></div><div class="ship-1" style="float:left"><span style="margin-left:10px;" class="maszt-legend"></span></div><div class="ship-1" style="float:left"><span style="margin-left:10px;" class="maszt-legend"></span></div></div>');
	$('#statki-main').append("<table id='My_Ships'><tr><td></td><td colspan='10' class='topRow'>Twoje statki</td></tr></table><div id='mask'></div></div>");
 	$('#statki-main').append("<table id='Enemy_Ships'><tr><td></td><td colspan='10' class='topRow'>Statki przeciwnika</td></tr></table>");
	$('#statki-main').append('<div id="enemy_ship_legend"><div class="ship-4"><span class="maszt-legend"></span><span class="maszt-legend"></span><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-3" style="float:left"><span class="maszt-legend"></span><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-3" style="margin-left:50px;"><span class="maszt-legend"></span><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-2" style="float:left"><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-2" style="float:left;margin-left:15px;"><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-2" style="margin-left:80px;"><span class="maszt-legend"></span><span class="maszt-legend"></span></div><div class="ship-1" style="float:left"><span class="maszt-legend"></span></div><div class="ship-1" style="float:left"><span style="margin-left:10px;" class="maszt-legend"></span></div><div class="ship-1" style="float:left"><span style="margin-left:10px;" class="maszt-legend"></span></div><div class="ship-1" style="float:left"><span style="margin-left:10px;" class="maszt-legend"></span></div></div>');
	$('body').append('<div id="" style="position:absolute; background-color:red;color:white;top:0;left:0">Total_MyShips_Hit: <span id="myshipshit"></span><br>'+
	'Total_Ships_Hit: <span id="totalshipshit"></span>'+
	'</div>');
 	$("#Enemy_Ships").on("click", "td[x]", MakeHit);
 	makeGrid(2);
 	for (var k = 1; k < 5; k++) {	//Narysowanie własnych statków na planszy
 		jQuery.each(MyShips[k], function(i, val) {
 			jQuery.each(val, function(j, v2) {
 				if (typeof v2 == 'number') {
 					this_x = v2;
 					this_y = v2;
 				} else {
 					this_x = v2['x'];
 					this_y = v2['y'];
 				}

 				$('#My_Ships').find('td[x=' + (parseInt(this_x)) + '][y=' + (parseInt(this_y)) + ']').css('border', '3px solid #000').attr('shipF', 'true').attr('maszty', k).attr('ship_id', i);
 			})
 		});
 	}
 }
 var EnemyShips = {
 	'1': {
 		0: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		1: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		2: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		3: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		}
 	},
 	'2': {
 		0: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		1: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		2: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		}
 	},
 	'3': {
 		0: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			2: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		1: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			2: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		}
 	},
 	'4': {
 		0: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			2: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			3: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		}
 	}
 };
 var MyShips = {
 	'1': {
 		0: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		1: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		2: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		3: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		}
 	},
 	'2': {
 		0: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		1: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		2: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		}
 	},
 	'3': {
 		0: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			2: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		},
 		1: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			2: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		}
 	},
 	'4': {
 		0: {
 			0: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			1: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			2: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			},
 			3: {
 				'x': 0,
 				'y': 0,
 				'hit': false
 			}
 		}
 	}
 };
 var gamestate = 1; //1 - ustawianie statków
 var channel = null;
 var EnemyID = null;
 var pusher = new Pusher('875a535db554ca357be9', { //inicjalizacja usługi websocketów
 	encrypted: true,
	authEndpoint: 'pusher_auth.php' 
 });
 Pusher.log = function(message) { //włączenie logowania zdarzeń do konsoli
 	if (window.console && window.console.log) {
 		window.console.log(message);
 	}
 };
 var socketId = null; //id połączenia

 pusher.connection.bind('connected', function() { //przypisanie każdemu uczestnikowi unikalnego id połączenia
 		socketId = pusher.connection.socket_id;
	if(window.location.search.length>0) {
		userId=window.location.search.substring(1, window.location.search.length);
		$.each($('input[name=ship_radio]'), function(v,i) { $(this).prop("disabled", null); });
		$("#connection_id").val(window.location.href);
	} else {
		
		userId=socketId.split('.')[1];
		console.log(userId);
		console.log(socketId);
		$("#connection_id").val(window.location.href+'?'+userId); }
		channel = pusher.subscribe('presence-id'+userId); //subskrybcja kanału nasłuchu w websocket
		//channel2 = pusher.subscribe('presence-activegame');
	channel.bind('pusher:member_removed', function(member) {

  if(EnemyID==member.id && gamestate == 3)
  {
		$("body").empty();
		$('body').append('<div class="alert alert-warning" role="alert" id="move-info">Przeciwnik opuścił grę. <a href="'+window.location.href+'">Utwórz nową</a>.</div>');

  }
});

channel.bind('pusher:subscription_succeeded', function(members) {	//zdarzenie wykonywane po wejściu dowolnego użytkownika na kanał
	console.log(members);
 });
channel.bind('pusher:member_added', function(member) {
		$(".overlay").css('display', 'none');
	});
channel.bind('pusher:subscription_error', function(status) {
  console.log(status);
});
channel.bind('client-remaining_ships', function(data) {	//Odebranie informacji o pozostałych statkach na końcu gry
	
		var json = $.parseJSON(data.json_str);
				$(json).each(function(i,val){
					$.each(val,function(k,v){
						$('#Enemy_Ships').find('td[x=' + (parseInt(val.x)) + '][y=' + (parseInt(val.y)) + ']').addClass('maszt-nothit');      
					});
				});
});
 channel.bind('client-hit_t', function(data) {	//Obsługa odpowiedzi strzału w statek

 if(data.p == player_id)
 		if (data.ship_hit == 'true') { //statek trafiony
 			EnemyShips[data.maszty][data.ship_id][data.id_maszt].hit = true;
 			EnemyShips[data.maszty][data.ship_id][data.id_maszt].x = data.x;
 			EnemyShips[data.maszty][data.ship_id][data.id_maszt].y = data.y;
 			if (data.entire_ship_hit == true) {
 				OznaczPudla(data.maszty, data.ship_id, 'Enemy_Ships'); //obrysowanie statku pudłami
				
 				Total_Ships_Hit++;
				$("#totalshipshit").html(Total_Ships_Hit);
				$("#myshipshit").html(Total_MyShips_Hit);
 				if (Total_Ships_Hit == 10) //jeśli trafiono wszystkie statki
 				{
					if(typeof window.location.href.split('?')[1] != 'undefined')
					addrRoom = window.location.href;
					else
					addrRoom = window.location.href+'?'+socketId.split('.')[1];
 					$("#move-info").removeClass("alert-info").removeClass("alert-warning").addClass('alert-success').addClass('won-info').html('Wygrana. <a href="'+addrRoom+'">Zagraj jeszcze raz</a>');
 					$("#Enemy_Ships").off("click", "td[x]", MakeHit);
				//wysłanie informacji do drugiego gracza o pozostałych statkach na samym końcu gry w json
				var ships_remaining='[';
					for (var k = 1; k < 5; k++) {
						jQuery.each(MyShips[k], function(i,val) {
							jQuery.each(val, function(j,vv) {
								if(!vv.hit) {
									ships_remaining+='{"x":"'+vv.x+'", "y":"'+vv.y+'"},';
								}
						})
					});
				}
				ships_remaining=ships_remaining.substring(0, ships_remaining.length - 1);
				ships_remaining+=']';
				 channel.trigger('client-remaining_ships', {
					json_str: ships_remaining
				});
					gamestate = 4;
 				}
				var mark_ship = $('#enemy_ship_legend').find('.ship-'+data.maszty)[data.ship_id];
				$.each($(mark_ship).find('span'), function(v,i) {
					$(this).removeClass('maszt-legend').addClass('maszt-legend-hit');
				});
				
 			}
 			$('#Enemy_Ships').find('td[x=' + (parseInt(data.x)) + '][y=' + (parseInt(data.y)) + ']').addClass('maszt-hit').css('border', '2px solid #F00');
 			$('#Enemy_Ships').find('td[x=' + (parseInt(data.x)) + '][y=' + (parseInt(data.y)) + ']').html('<span class="glyphicon glyphicon-remove" style="color: red;"></span>');
 			your_move = true;
 		} else {

 			$('#Enemy_Ships').find('td[x=' + (parseInt(data.x)) + '][y=' + (parseInt(data.y)) + ']').html('<span class="glyphicon glyphicon-certificate"></span>');
			Enemy_Move(); //przekazanie ruchu przeciwnikowi

 		}
 });
 channel.bind('client-find_player', function(data) {	//Odebranie gotowości drugiego gracza
	if (ShipsSet == 10) {
	     if(data.confirm=='true') {
		 
		 StartGame();
		 Your_Move();
		  
		 EnemyID=data.id;
		 }
		 channel.trigger('client-cofirm_ready', {	//Potwierdzenie gotowości 
				id: channel.members.myID,
 				socket_id: socketId
 			});
	}
 });
  channel.bind('client-cofirm_ready', function(data) {
	if (ShipsSet == 10) {
		EnemyID=data.id;
		StartGame();
		Enemy_Move();
	}
 });
 channel.bind('client-hit', function(data) {	//odebranie strzału przeciwnika i przygotowanie odpowiedzi
 if(data.id == EnemyID) {
 		var this_ship = $('#My_Ships').find('td[x=' + (parseInt(data.x)) + '][y=' + (parseInt(data.y)) + ']');
 		if ($(this_ship).attr('shipf') == 'true') //jezeli maszt jest trafiony
 		{
 			$(this_ship).addClass('maszt-hit');
 			$(this_ship).html('<span class="glyphicon glyphicon-remove" style="color: red;"></span>');
 			var maszty_count = $(this_ship).attr('maszty');
 			var ship_id = $(this_ship).attr('ship_id');
 			var this_x = data.x;
 			var this_y = data.y;
 			var not_hit_count = 0; //liczba wciąz nietrafionych masztów
 			$.each(MyShips[maszty_count][ship_id], function(i, v) { //odnalezienie trafianego masztu w tablicy i oznaczenie go jako trafiony oraz zliczenie trafionych masztów w tym statku
 				if (v.x == data.x && v.y == data.y) {
 					v.hit = true;
 					id_maszt = i;
 				}
 				if (v.hit == false) not_hit_count++;
 			});
 			if (not_hit_count == 0) { //trafiono cały statek
 				var entire_ship_hit = true;
				OznaczPudla(maszty_count, ship_id, 'My_Ships'); //obrysowanie statku pudłami
 				Total_MyShips_Hit++;
				$("#totalshipshit").html(Total_Ships_Hit);
				$("#myshipshit").html(Total_MyShips_Hit);
				var mark_ship = $('#my_ship_legend').find('.ship-'+maszty_count)[ship_id];
				$.each($(mark_ship).find('span'), function(v,i) {
					$(this).removeClass('maszt-legend').addClass('maszt-legend-hit');
				});
				
 				if (Total_MyShips_Hit == 10) //jeśli trafiono wszystkie statki - gra skończona
 				{
					if(window.location.href.split('?').length<2)
						addrParam = '?'+socketId.split('.')[1];
						else
						addrParam = '';
 					$("#move-info").removeClass("alert-info").removeClass("alert-warning").addClass('alert-danger').html('Przegrana. <a href="'+window.location.href+addrParam+'">Rewanż</a>'); //poinformowanie gracza
 					$("#Enemy_Ships").off("click", "td[x]", MakeHit); //wyrejestrowanie zdarzenia kliknięcia z planszy
					gamestate = 4;
				
				$('#mask').css('display', 'none');
				}
 			} else var entire_ship_hit = false;
 			var ship_hit = 'true';
 			channel.trigger('client-hit_t', {
 				x: this_x,
 				y: this_y,
 				p: data.id,
 				ship_hit: ship_hit,
 				ship_id: ship_id,
 				id_maszt: id_maszt,
 				entire_ship_hit: entire_ship_hit,
 				maszty: maszty_count,
 				socket_id: socketId
 			});
 		} else if ($(this_ship).attr('shipf') == 'false') {
 			$(this_ship).html('<span class="glyphicon glyphicon-certificate"></span>');
 			var this_x = data.x;
 			var this_y = data.y;
 			var ship_hit = 'false';
 			channel.trigger('client-hit_t', {
 				x: this_x,
 				y: this_y,
 				p: data.id,
 				ship_hit: ship_hit,
 				socket_id: socketId
 			});
 			Your_Move();
 			
 		}
		$('.last').removeClass('last');
		$(this_ship).addClass('last');
		return 0;
}

 });
	});
$(window).bind('beforeunload', function(){	//Okienko informujące o trwającej rozgrywce przy próbie zamknięcia lub odświeżenia strony
	if(gamestate==3)
        return "Rozgrywka zostanie utracona."
});
 $(document).ready(function() { //Funkcja uruchamiana po otwarciu strony
 		
	makeGrid();	//Rysowanie planszy
	  $("#resetBtn").click(function() {		//Obsługa przycisku reset
		for (var k = 1; k < 5; k++) {
			jQuery.each(MyShips[k], function(i,val) {	//zresetowanie obiektu współrzędnych statków
				jQuery.each(val, function(j) {
					MyShips[k][i][j]['x']=0;
					MyShips[k][i][j]['y']=0;
					MyShips[k][i][j]['hit']=false;
				})
			});
		}
		 $("#loading").css('display', 'none');
		 $("#readyBtn").prop("disabled","disabled");
			ShipsSet=0;			//Wyzerowanie zmiennej przechowującej liczbę już ustawionych w całości statków
			deleteOldGrid();	//Usunięcie planszy
			makeGrid();		//Rysowanie nowej planszy
			delete(ShipPartLeft);	//Usunięcie zmiennej przechowującej liczbę pozostałych do wstawienia masztów statku
			
		});
	 $("#readyBtn").click(function() {//obsługa gotowości, oczekiwanie na gracza.

			$("#loading").show();
			$("#readyBtn").prop('disabled');
			channel.trigger('client-find_player', {
					confirm: 'true',
					id: channel.members.myID,
					socket_id: socketId
			}); 
		});
 });

function deleteOldGrid() {	//funkcja kasująca planszę ze statkami przy zresetowaniu
	var flaga = false; 
	$("#shipgrid").find("tr").each(function(i) {
		if(flaga && $(this).hasClass("topRow")) flaga=false;
		if(!flaga && $(this).hasClass("topRow"))
		 flaga=true;

		if(flaga) $(this).remove();

	} ); 
		//ustawienie początkowych wartości dla radio-buttonów
		$('input[name=ship_radio][value=1]').attr('left', '4');
		$('input[name=ship_radio][value=2]').attr('left', '3');
		$('input[name=ship_radio][value=3]').attr('left', '2');
		$('input[name=ship_radio][value=4]').attr('left', '1');
		$("#ship1-u").text("4");
		$("#ship2-u").text("3");
		$("#ship3-u").text("2");
		$("#ship4-u").text("1");
		//odblokowanie wszystkich radio-buttonów
		$.each($('input[name=ship_radio]'), function(v,i) { $(this).prop("disabled", null); });
	
}
 function selectShipRadio() {	//Zmiana zaznaczenia typu statku na inny typ którego ustawianie nie zostało w pełni ukończone
 	$('input[name=ship_radio]').each(function(index, elem) {
 		if ($(elem).attr('disabled') != 'disabled') {
 			$(elem).prop('checked', true);
 		}
 	});
 }

 function MakeHit() {	//Wykonanie strzału
 	if (your_move == true) {
 		if ($(this).html().length == 0) {
 			$(this).html("<img src='loading.gif'>");
 			your_move = false;
 			var this_x = $(this).attr('x');
 			var this_y = $(this).attr('y');
		channel.trigger('client-hit', {
 				x: this_x,
 				y: this_y,
 				id: channel.members.myID,
 				socket_id: socketId
 		});
 		}
 	}
 }
 if (gamestate == 1) //ustawianie statków
 {	
	//blokada zmiany rodzaju wstawianego statku w trakcie wstawiania statku
	$("input[name=ship_radio]").click( function() {
		if(typeof ShipPartLeft != 'undefined')
		{
			return false;
		}
	});
	//zdarzenie kliknięcia w pole na planszy w celu ustawienia statku
 	$("#shipgrid").on("click", "td[x]", function() {
 		var thisButton = $('input[name=ship_radio]').filter(':checked');
			//Sprawdzenie wybranego radio-buttona - ilo masztowy statek jest wstawiany
 		switch ($(thisButton).val()) {
 			case '1':
 				
 				if ($(thisButton).attr('left') > 0 && !$(this).hasClass('maszt-marked') && !$(this).hasClass('maszt-otoczenie')) {
 					$(this).addClass('maszt-marked');
 					$(thisButton).attr('left', $(thisButton).attr('left') - 1);
 					var this_x = $(this).attr('x');
 					var this_y = $(this).attr('y');
 					$('#shipgrid').find('td[x=' + (parseInt($(this_x).selector) + 1) + '][y=' + (parseInt($(this_y).selector) - 1) + ']').addClass('maszt-otoczenie');
 					$('#shipgrid').find('td[x=' + (parseInt($(this_x).selector) + 1) + '][y=' + (parseInt($(this_y).selector)) + ']').addClass('maszt-otoczenie');
 					$('#shipgrid').find('td[x=' + (parseInt($(this_x).selector) + 1) + '][y=' + (parseInt($(this_y).selector) + 1) + ']').addClass('maszt-otoczenie');
 					$('#shipgrid').find('td[x=' + (parseInt($(this_x).selector)) + '][y=' + (parseInt($(this_y).selector) - 1) + ']').addClass('maszt-otoczenie');
 					$('#shipgrid').find('td[x=' + (parseInt($(this_x).selector) - 1) + '][y=' + (parseInt($(this_y).selector) + 1) + ']').addClass('maszt-otoczenie');
 					$('#shipgrid').find('td[x=' + (parseInt($(this_x).selector) - 1) + '][y=' + (parseInt($(this_y).selector)) + ']').addClass('maszt-otoczenie');
 					$('#shipgrid').find('td[x=' + (parseInt($(this_x).selector) - 1) + '][y=' + (parseInt($(this_y).selector) - 1) + ']').addClass('maszt-otoczenie');
 					$('#shipgrid').find('td[x=' + (parseInt($(this_x).selector)) + '][y=' + (parseInt($(this_y).selector) + 1) + ']').addClass('maszt-otoczenie');
 					$("#ship1-u").html($("#ship1-u").html() - 1);
 					MyShips["1"][$("#ship1-u").html()][0]['x'] = this_x;
 					MyShips["1"][$("#ship1-u").html()][0]['y'] = this_y;
 					ShipsSet++;
 				}
 				if ($(thisButton).attr('left') == 0) {
 					$(thisButton).attr('disabled', true);
 					selectShipRadio();
 				}
 				break;
 			case '2':
 				if ($("#ship2-u").html() != "0" && !$(this).hasClass('maszt-marked') && !$(this).hasClass('maszt-otoczenie')) {
 					var this_x = $(this).attr('x');
 					var this_y = $(this).attr('y');
 					if ($(thisButton).attr('left') != 0 && typeof ShipPartLeft == 'undefined') {
 						ShipPartLeft = 1;
 						$(this).addClass('maszt-marked');
 						MyShips["2"][($(thisButton).attr('left')) - 1][ShipPartLeft]['x'] = this_x;
 						MyShips["2"][($(thisButton).attr('left')) - 1][ShipPartLeft]['y'] = this_y;

 					} else {
 						if (ExistsAdjacentMast(this_x, this_y)) {
 							$(this).addClass('maszt-marked');
 							ShipPartLeft--;
 							MyShips["2"][$(thisButton).attr('left') - 1][ShipPartLeft]['x'] = this_x;
 							MyShips["2"][$(thisButton).attr('left') - 1][ShipPartLeft]['y'] = this_y;
 							if (ShipPartLeft == 0) {
 								$("#ship2-u").html($("#ship2-u").html() - 1);
 								fillAround(2);
 								ShipsSet++;
 								delete(ShipPartLeft);
 								$(thisButton).attr('left', ($(thisButton).attr('left')) - 1);
 								if ($(thisButton).attr('left') == 0) {
 									$(thisButton).attr('disabled', true);
 									selectShipRadio();
 								}
 							}
 						} else alert('nie jest sasiadem');
 					}
 				}
 				break;
 			case '3':
 				if ($("#ship3-u").html() != "0" && !$(this).hasClass('maszt-marked') && !$(this).hasClass('maszt-otoczenie')) {
 					var this_x = $(this).attr('x');
 					var this_y = $(this).attr('y');
 					if ($(thisButton).attr('left') != 0 && typeof ShipPartLeft == 'undefined') {
 						ShipPartLeft = 2;
 						$(this).addClass('maszt-marked');
 						MyShips["3"][($(thisButton).attr('left')) - 1][ShipPartLeft]['x'] = this_x;
 						MyShips["3"][($(thisButton).attr('left')) - 1][ShipPartLeft]['y'] = this_y;

 					} else {
 						if (ExistsAdjacentMast(this_x, this_y)) {
 							$(this).addClass('maszt-marked');
 							ShipPartLeft--;
 							MyShips["3"][$(thisButton).attr('left') - 1][ShipPartLeft]['x'] = this_x;
 							MyShips["3"][$(thisButton).attr('left') - 1][ShipPartLeft]['y'] = this_y;
 							if (ShipPartLeft == 0) {
 								$("#ship3-u").html($("#ship3-u").html() - 1);
 								fillAround(3);
 								ShipsSet++;
 								delete(ShipPartLeft);
 								$(thisButton).attr('left', ($(thisButton).attr('left')) - 1);
 								if ($(thisButton).attr('left') == 0) {
 									$(thisButton).attr('disabled', true);
 									selectShipRadio();
 								}
 							}
 						}
 					}
 				}
 				break;
 			case '4':
 				if ($("#ship4-u").html() == "1" && !$(this).hasClass('maszt-marked') && !$(this).hasClass('maszt-otoczenie')) {
 					var this_x = $(this).attr('x');
 					var this_y = $(this).attr('y');
 					if ($(thisButton).val() == 4 && typeof ShipPartLeft == 'undefined') {
 						ShipPartLeft = 3;
 						$(this).addClass('maszt-marked');
 						MyShips["4"]['0'][ShipPartLeft]['x'] = this_x;
 						MyShips["4"]['0'][ShipPartLeft]['y'] = this_y;
 					} else {

 						if (ExistsAdjacentMast(this_x, this_y)) {
 							$(this).addClass('maszt-marked');

 							ShipPartLeft--;
 							MyShips["4"]['0'][ShipPartLeft]['x'] = this_x;
 							MyShips["4"]['0'][ShipPartLeft]['y'] = this_y;
 							if (ShipPartLeft == 0) {
 								$(thisButton).attr('left', 0);
 								$(thisButton).attr('disabled', true);
 								selectShipRadio();
 								ShipsSet++;
 								delete(ShipPartLeft);
 								fillAround(4);
 								$("#ship4-u").html($("#ship4-u").html() - 1);
 							}
 						}
 					}
 				}
 				break;
 		}
 		if (ShipsSet == 10) {	//Jeśli ustawiono wszystkie statki, odblokowanie przycisku 'Gotowy'
			$('#readyBtn').removeProp('disabled');
 			}
 		});
 }