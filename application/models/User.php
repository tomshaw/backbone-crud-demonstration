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
        
        if (isset($data['identity']) && $data['identity'] != '' && $data['identity'] != '-1') {
        	$select->where('identity = ?', intval($data['identity']));
        }
        
        if (isset($data['verified']) && $data['verified'] != '' && $data['verified'] != '-1') {
            $select->where('verified = ?', intval($data['verified']));
        }
        
        if (isset($data['created']) && !empty($data['created'])) {
            $select->where('created >= ?', date("Y-m-d", strtotime($data['created'])));
        }
        
        $select->order($order . ' ' . strtoupper($sort));
        
        return $select;
    }
    
    public function nameSearch($userName)
    {
        $select = $this->select()
            ->setIntegrityCheck(false)
            ->distinct(true)
            ->from($this->getTableName(), array('username'))
            ->where('LOWER(username) = ?', strtolower($userName));
        return $this->fetchRow($select);
    }
    
    public function emailSearch($email)
    {
        $select = $this->select()
            ->setIntegrityCheck(false)
            ->distinct(true)
            ->from($this->getTableName(), array('email'))
            ->where('LOWER(email) = ?', strtolower($email));
        return $this->fetchRow($select);
    }
    
}