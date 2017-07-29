<?php
include 'link.php';
include 'sql.php';


function execute($mysqli_stmt)
{
	if ($mysqli_stmt->execute())//return result
		{
			$mysqli_result=$mysqli_stmt->get_result();
			$result=array();
			$result=$mysqli_result->fetch_all(MYSQLI_ASSOC);
			$mysqli_stmt->close();
			$mysqli_result->free();
			return $result;
		}
		else return $mysqli_stmt->error;
}

/*
 parameter:$sql is an object
including case, values (array) to indicate the query 
including some methods to generate the query data
*/
function mysqli_run($sql)//where multuple where limit order
{
	$mysqli=new mysqli();
	link_db($mysqli);//link data base and set utf-8
	$prepare=$sql->generate();//generate a sql query string with ?
	//select all logic
	$flag=$sql->get_flag();
	if (isset($flag['all']) && $flag['all'])//no ?,execute query directly
	{
		if ($sql->type=='i')
		{
			$mysqli_result=$mysqli->query($prepare);
			if ($mysqli_result && $mysqli_result->num_rows>0)
			{
				$result=array();
				$result=$mysqli_result->fetch_all(MYSQLI_ASSOC);
				return $result;	
			}
			else return 'unknown error';
		}
		if ($sql->type=='c')
		{
			$result=$mysqli->query($prepare);
			if ($mysqli->error=='')
			return $result;
			else return $mysqli->error;
		}
	}

	//stmt prepare
	$mysqli_stmt=$mysqli->prepare($prepare);
	//prepare parameters to be bond.change value to parameters
	$params=array();
	if ($sql->type=='u')
		$a=$sql->get_update_params();//return col,case query array
	else $a=$sql->get_params();//return case query array
	$n=count($a);
	for ($i=0;$i<$n;$i++)
	$params[$i]=&$a[$i];
	call_user_func_array(array($mysqli_stmt,'bind_param'),$params);
	if ($sql->type=='s')
	{
		$result=execute($mysqli_stmt);
		$mysqli->close();
		return $result;
	}
	else 
	{
		if ($mysqli_stmt->execute())
		{
			if ($sql->type=='i')
			return $mysqli_stmt->insert_id;
			else return $mysqli_stmt->affected_rows;
		}
		else return "error:".$mysqli_stmt->error;
	}
	$mysqli->close();
}


?>