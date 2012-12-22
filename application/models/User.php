<?php

class Model_User extends Zend_Db_Table_Abstract
{
    protected $_name = 'user';
    
    protected static $_identities = array(0 => 'Anonymous', 1 => 'Member', 2 => 'Employee', 3 => 'Supervisor', 4 => 'Administrator');
    
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
    
    public static function fetchIdentities()
    {
        return self::$_identities;
    }
    
    public function getUsers($data = array(), $order = 'id', $sort = 'DESC')
    {
        $select = $this->select()
            ->setIntegrityCheck(false)
            ->from($this->getTableName(), array('*'));
        
        if (isset($data['letter']) && !empty($data['letter'])) {
            $select->where('SUBSTRING(LOWER(username), 1, 1) = ?', strval($data['letter']));
        }
        
        if (isset($data['username']) && !empty($data['username'])) {
            $select->where('LOWER(username) LIKE ?', '%' . strtolower($data['username']) . '%');
        }
        
        if (isset($data['name']) && !empty($data['name'])) {
            $select->where('LOWER(first_name) LIKE ?', '%' . strtolower($data['name']) . '%');
            $select->orWhere('LOWER(last_name) LIKE ?', '%' . strtolower($data['name']) . '%');
        }
        
        if (isset($data['email']) && !empty($data['email'])) {
            $select->where('LOWER(email) LIKE ?', '%' . strtolower($data['email']) . '%');
        }
        
        if (isset($data['verified']) && $data['verified'] != '') {
            $select->where('verified = ?', intval($data['verified']));
        }
        
        if (isset($data['identity']) && $data['identity'] != '') {
            $select->where('identity = ?', intval($data['identity']));
        }
        
        if (isset($data['created']) && !empty($data['created'])) {
            $select->where('LOWER(created) LIKE ?', '%' . strtolower($data['created']) . '%');
        }
        
        $select->order($order . ' ' . strtoupper($sort));
        
        return $select;
    }
    
    public function fetchStores()
    {
        $select = $this->select()
            ->setIntegrityCheck(false)
            ->distinct(true)
            ->from('store', array('store_id','store_name'))
            ->order('store_id ASC');
        return $this->getAdapter()->fetchPairs($select);
    }
    
}