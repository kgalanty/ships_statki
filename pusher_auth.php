<?php 
require('Pusher.php');

$app_id = '142419';
$app_key = '875a535db554ca357be9';
$app_secret = 'd97dd660cfe8f4e8a900';

$pusher = new Pusher($app_key, $app_secret, $app_id);
list(,$userId)=explode('.', $_POST['socket_id']);
$auth = $pusher->socket_auth($_POST['channel_name'], $userId);
 //$presence_data = array('user_id' => $userId);
 $presence_data = array();
  echo $pusher->presence_auth($_POST['channel_name'], $_POST['socket_id'], $userId, $presence_data);
?>