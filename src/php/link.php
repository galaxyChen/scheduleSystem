<?php

function link_db($mysqli)//link data base and set utf-8
{
	$mysqli->connect('localhost','root','root','test');
	$mysqli->set_charset('UTF8');
}
?>