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
    case 'add':add($data,"task");
                break;
    case 'addRoutine':add($data,"routine");
                break;
    case 'query':query($data,"task");
                break;
    case 'update':update($data,"task");
                break;
    case 'routine':query($data,"routine");
                break;
    case 'updateRoutine':update($data,"routine");
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

function add($data,$table){
    $sql = new SQL();
    $sql->type = 'i';
    $sql->table = $table;
    $addData =(array) $data->data;
    $key = array_keys($addData);
    $n = count($key);
    for ($i=0;$i<$n;$i++)
        if ($addData[$key[$i]])
            $sql->add($key[$i],$addData[$key[$i]]);
    $sql->add('usn',$data->usn);
    $result = mysqli_run($sql);
    $response=array();
    if (gettype($result)=='integer'){
        $response['status']=1;
        $response['id']=$result;
        $response['type']=$table;
    } else {
        $response['status']=0;
        $response['error']=$result;
    }
    echo json_encode($response);
}

function query($data,$table){
    $sql = new SQL();
    $sql->type = 's';
    $sql->table = $table;
    $sql->add('usn',$data->usn);
    $sql->add_not('status','finish');
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

function update($data,$table){
    $sql = new SQL();
    $sql->type = 'u';
    $sql->table = $table;
    $sql->add($table.'_id',$data->id);
    
    $updateData = (array)$data->data;
    $key = array_keys($updateData);
    $n = count($key);
    for ($i=0;$i<$n;$i++){
        if ($updateData[$key[$i]])
            $sql->add_update_col($key[$i],$updateData[$key[$i]]);
    }

    $result=mysqli_run($sql);
    $response=array();
    if (gettype($result)=='integer'){
        $response['status']=1;
        $response['id']=$result;
        $response['type']=$table;
    } else {
        $response['status']=0;
        $response['error']=$result;
        $response['type']=$table;
    }
    echo json_encode($response);
}


?>