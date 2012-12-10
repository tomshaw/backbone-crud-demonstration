<?php 

class Model_Customer extends Zend_Db_Table_Abstract
{
    protected $_name = 'customer';
    
    public function getTableName()
    {
        return $this->_name;
    }
    
    public function getColumns()
    {
        return $this->info(self::COLS);
    }
    
    public function getPrimary()
    {
        return $this->info(self::PRIMARY);
    }
    
    public function getCustomers()
    {
    	$select = $this->select()
    		->from($this->getTableName(), array('*'));
    	return $select;
    }
    
}