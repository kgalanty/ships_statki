<?php 
require('Pusher.php');

$app_id = '142419';
$app_key = '875a535db554ca357be9';
$app_secret = 'd97dd660cfe8f4e8a900';

$pusher = new Pusher($app_key, $app_secret, $app_id);

if(isset($_GET['check_players'])) {
	
	$players=$_POST['p']+1;

	$data['message'] = $players;
	
	if($players==2) {$data['id'] = 1;  } else { $data['id'] = 2; }
	
	//$pusher->trigger('statki', 'check_player', $_POST['p']);
	if($players==2 or $players == 3) 
		$pusher->trigger('statki', 'check_player', $data);
}
elseif(isset($_GET['update_status']))
{

	$data['val'] = intval(ceil($_POST['s']*100/10));
	$data['id'] = $_POST['p'];
	//file_put_contents('log.txt', $data['val'].'-'.$data['id']);
	$pusher->trigger('statki', 'update_status', $data);
}
elseif(isset($_GET['both_ready']))
{
	$data['message']='r';
	$pusher->trigger('statki', 'both_ready', $data);
}
elseif(isset($_GET['hit']))
{
	$data['x']=$_POST['x'];
	$data['y']=$_POST['y'];
	$data['id']=$_POST['p'];
	
	$pusher->trigger('statki', 'hit', $data, $_POST['socket_id']);
}
elseif(isset($_GET['hit_t'])) {
	$data['x']=$_POST['x'];
	$data['y']=$_POST['y'];
	$data['id']=$_POST['p'];
	$data['maszty']=$_POST['maszty'];	//liczba masztów - pierwszy indeks w tablicy
	$data['ship_id']=$_POST['ship_id'];	//id statku - drugi indeks w tablicy
	$data['id_maszt']=$_POST['id_maszt']; //id masztu - trzeci indeks w tablicy
	$data['entire_ship_hit']=$_POST['entire_ship_hit']; //czy zdjęto statek w całości? true/false
	$data['ship_hit']=$_POST['ship_hit']; //czy statek trafiony? true/false
	$pusher->trigger('statki', 'hit_t', $data, $_POST['socket_id']);
}
?>