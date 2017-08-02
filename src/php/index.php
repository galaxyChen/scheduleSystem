<?php
header("Access-Control-Allow-Origin: *");
include './model.php';
$data=$GLOBALS['HTTP_RAW_POST_DATA'];
$data=json_decode($data);

switch ($data->ins){
    case 'test':runTest($data);
                break;
    case 'login':login($data);
                break;
    case 'register':register($data);
                break;
    case 'add':add($data);
                break;
    case 'query':query($data);
                break;
    case 'update':update($data);
                break;
}

function runTest($data){
    var_dump($data->data);
}

function login($data){
    $sql = new SQL();
    $sql->type = 's';
    $sql->table = 'user';
    $sql->add('usn',$data->usn);
    $result=mysqli_run($sql);
    $response=array();
    if (gettype($result)=='array'){
        if ($data->password==$result[0]['password'])
            $response['status']=1;
        else {
            $response['status']=0;
            $response['error']="密码错误";
        }
    } else {
        $response['status']=0;
        $response['error']=$result;
    }
    echo json_encode($response);
}

function register($data){
    $sql = new SQL();
    $sql->type = 'i';
    $sql->table = 'user';
    $sql->add('usn',$data->usn);
    $sql->add('password',$data->password);
    $result=mysqli_run($sql);
    $response=array();
    if (gettype($result)=='integer'){
            $response['status']=1;
    } else {
        $response['status']=0;
        $response['error']=$result;
    }
    echo json_encode($response);
}

function add($data){
    $sql = new SQL();
    $sql->type = 'i';
    $sql->table = 'task';
    $addData =(array) $data->data;
    $key = array_keys($addData);
    $n = count($key);
    for ($i=0;$i<$n;$i++)
        $sql->add($key[$i],$addData[$key[$i]]);
    $sql->add('usn',$data->usn);
    $result = mysqli_run($sql);
    $response=array();
    if (gettype($result)=='integer'){
        $response['status']=1;
        $response['id']=$result;
    } else {
        $response['status']=0;
        $response['error']=$result;
    }
    echo json_encode($response);
}

function query($data){
    $sql = new SQL();
    $sql->type = 's';
    $sql->table = 'task';
    $sql->add('usn',$data->usn);
    $result = mysqli_run($sql);
    $response=array();    
    if (gettype($result)=='array'){
        $response['status']=1;
        $response['data']=$result;
    } else {
        $response['status']=0;
        $response['error']=$result;
    }
    echo json_encode($response);
}

function update($data){
    $sql = new SQL();
    $sql->type = 'u';
    $sql->table = 'task';
    $sql->add('task_id',$data->id);
    
    $updateData = (array)$data->data;
    $key = array_keys($updateData);
    $n = count($key);
    for ($i=0;$i<$n;$i++){
        $sql->add_update_col($key[$i],$updateData[$key[$i]]);
    }

    $result=mysqli_run($sql);
    $response=array();
    if (gettype($result)=='integer'){
        $response['status']=1;
        $response['id']=$result;
    } else {
        $response['status']=0;
        $response['error']=$result;
    }
    echo json_encode($response);
}

?>