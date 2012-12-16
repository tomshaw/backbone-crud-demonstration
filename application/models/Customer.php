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
            ->joinLeft(array('country' => 'country'), 'city.country_id = country.country_id', array('*'));
        
        if (isset($data['name']) && !empty($data['name'])) {
            $select->where('LOWER(customer.first_name) LIKE ?', '%'.strtolower($data['name']).'%');
            $select->orWhere('LOWER(customer.last_name) LIKE ?', '%'.strtolower($data['name']).'%');
        }
        
        if (isset($data['email']) && !empty($data['email'])) {
            $select->where('LOWER(customer.email) LIKE ?', '%'.strtolower($data['email']).'%');
        }
        
        if (isset($data['city']) && !empty($data['city'])) {
            $select->where('LOWER(city.city) LIKE ?', '%'.strtolower($data['city']).'%');
        }
        
        if (isset($data['country']) && !empty($data['country'])) {
            $select->where('LOWER(country.country) LIKE ?', '%'.strtolower($data['country']).'%');
        }
        
        if (isset($data['create_date']) && !empty($data['create_date'])) {
            $select->where('LOWER(customer.create_date) LIKE ?', '%'.strtolower($data['create_date']).'%');
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