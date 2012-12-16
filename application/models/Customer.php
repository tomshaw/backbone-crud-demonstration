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
    
    public function getCustomers($data = array(), $order = 'customer_id', $sort = 'DESC')
    {
        $select = $this->select()
            ->setIntegrityCheck(false)
            ->from(array('customer' => $this->getTableName()), array('*'))
            ->joinLeft(array('address' => 'address'), 'customer.address_id = address.address_id', array('*'))
            ->joinLeft(array('city' => 'city'), 'address.city_id = city.city_id', array('*'))
            ->joinLeft(array('country' => 'country'), 'city.country_id = country.country_id', array('*'))
            ->order($order . ' ' . strtoupper($sort));
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