<?php
//this is the class definition of sql class
function real_value($a)
{
	$result='';
	if (gettype($a)!='string')
		$result.=$a;
	else $result.='\''.$a.'\'';
	return $result;
}


class SQL
{
	private $case=array();
	private $values=array();
	private $col=array();
	private $col_values=array();
	private $query_num=0;
	private $col_num=0;
	private $flag=array();
	public $table='';
	public $type='';

	public function add($a,$b)//a is case,b is value
	{

		$this->case[$this->query_num]=$a;
		$this->values[$this->query_num]=$b;
		$this->query_num++;
		return $this->query_num;
	}

	//public function pop($num);//num is pop subscript

	public function add_col($a)
	{
		$this->col[$this->col_num]=$a;
		$this->col_num++;
		return $this->col_num;
	}

	public function add_update_col($a,$b)
	{
		$this->col[$this->col_num]=$a;
		$this->col_values[$this->col_num]=$b;
		$this->col_num++;
		return $this->col_num;
	}

	public function get_case()
	{
		return $this->case;
	}

	public function get_values()
	{
		return $this->values;
	}

	public function get_num()
	{
		return $this->query_num;
	}

	public function get_flag()
	{
		return $this->flag;
	}

	private function where_generate($sql)
	{
		for ($i=0;$i<$this->query_num-1;$i++)
			$sql.=$this->case[$i].'= ? AND ';
		$sql.=$this->case[$this->query_num-1].'= ?';
		return $sql;
	}

	public function generate()
	{
		if ($this->col_num==0)//origin query head
		{
			if ($this->type=='s')//tyep is select
				$sql='SELECT * FROM '.$this->table;

			if ($this->type=='i')
				$sql='INSERT INTO '.$this->table;
		}
		else //add col query
		{
			if ($this->type=='s')
				{
					$sql='SELECT ';
					for ($i=0;$i<$this->col_num-1;$i++)
						$sql.=$this->col[$i].', ';
					$sql.=$this->col[$this->col_num-1];
					$sql.=' FROM '.$this->table;
				}

		}
		//select where logic
		if ($this->type=='s')
		{
			if ($this->query_num==0) 
			{
				$this->flag['all']=true;
				return $sql;
			}
			$sql.=' WHERE ';
			$sql=$this->where_generate($sql);
			//$sql.=real_value($this->values[$this->query_num-1]).';';
			return $sql;
		}

		if ($this->type=='i')//insert logic
		{
			$sql.=' (';
			for ($i=0;$i<$this->query_num-1;$i++)
				$sql.=$this->case[$i].', ';
			$sql.=$this->case[$this->query_num-1].') ';
			$sql.='VALUES (';
			for ($i=0;$i<$this->query_num-1;$i++)
				$sql.='?, ';
			$sql.='?);';
			return $sql;
		}
		//update logic
		if ($this->type=='u')
		{
			$sql='UPDATE '.$this->table.' SET ';
			for ($i=0;$i<$this->col_num-1;$i++)
				$sql.=$this->col[$i].' = ? ,';
			$sql.=$this->col[$this->col_num-1].' = ? ';
			$sql.='WHERE ';
			$sql=$this->where_generate($sql);
			return $sql;
		}
		//delete logic
		if ($this->type=='d')
		{
			$sql='DELETE FROM '.$this->table.' WHERE ';
			$sql=$this->where_generate($sql);
			return $sql;
		}

		if ($this->type=='c')
		{
			$sql='SELECT COUNT (';
			if ($this->col_num==0)
			{
				$this->flag['all']=true;
				$sql.='*) FROM '.$this->table;
			}
			else 
			{
				$sql.=$this->col[0].') ';
				$sql.='FROM '.$this->table;
			}
			if ($this->query_num>0)
			{
				$sql.=' WHERE ';
				$sql=$this->where_generate($sql);
			}
			return $sql;

		}
	}

	public function get_params()
	{
		$type='';
		foreach ($this->values as $value)
			switch (gettype($value))
			 {
				case 'string':$type.='s';break;
				case 'integer':$type.='i';break;
				case 'double':$type.='d';break;
			}
		$param=$this->values;
		array_unshift($param, $type);
		return $param;
	}

	public function get_update_params()
	{
		$type='';
		foreach ($this->col_values as $value)
			switch (gettype($value))
			 {
				case 'string':$type.='s';break;
				case 'integer':$type.='i';break;
				case 'double':$type.='d';break;
			}
		foreach ($this->values as $value) 
			switch (gettype($value))
			 {
				case 'string':$type.='s';break;
				case 'integer':$type.='i';break;
				case 'double':$type.='d';break;
			}
		$param=array_merge($this->col_values,$this->values);
		array_unshift($param, $type);
		return $param;
	}
}

?>