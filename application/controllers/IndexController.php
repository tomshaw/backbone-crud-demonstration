<?php

class IndexController extends Zend_Controller_Action
{
    public $_page;
    
    public function init()
    {
        $this->addScript('app');
        
        $this->loadStores();
        
        $request = $this->getRequest();
        
        $this->_page = $request->getParam('page', '1');
    }
    
    public function indexAction()
    {
    }
    
    public function listAction()
    {
        $this->norender();
        
        $model = new Model_Customer();
        
        $select = $model->getCustomers();
        
        $paginator = Zend_Paginator::factory($select);
        
        $paginator->setCurrentPageNumber($this->_page);
        
        $paginator->setItemCountPerPage(20);
        
        $response          = array();
        $response['items'] = $paginator->getIterator()->toArray();
        $response['pages'] = get_object_vars($paginator->getPages('Jumping'));
        
        $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode($response));
    }
    
    public function addAction()
    {
        $this->norender();
        
        $request = $this->getRequest();
        
        $model = new Model_Customer();
        
        if ($request->isPost()) {
        	
            $post = Zend_Json::decode($request->getRawBody());
            
            $post['address_id'] = 5; // foreign key restraint
            
            $lastInsertId = $model->insert($post);
            
            $post['customer_id'] = $lastInsertId;
            
            $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode($post));
            
        }
    }
    
    public function editAction()
    {
        $this->norender();
        
        $request = $this->getRequest();
        
        $customerId = $request->getParam('customer_id');
        
        $model = new Model_Customer();
        
        $row = $model->fetchRow('customer_id = ' . $customerId);
        
        if ($request->isPut()) {
        	
            $put = Zend_Json::decode($request->getRawBody());
            
            $data                = array();
            $data['customer_id'] = $put['customer_id'];
            $data['first_name']  = $put['first_name'];
            $data['last_name']   = $put['last_name'];
            $data['email']       = $put['email'];
            $data['store_id']    = $put['store_id'];
            
            $row->setFromArray($data);
            
            $row->save();
            
            $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode($data));
            
            return;
        }
        
        $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode($row->toArray()));
    }
    
    public function deleteAction()
    {
        $this->norender();
        
        $delete = $this->getRequest();
        
        $customerId = intval($delete->getParam('customer_id'));
        
        if ($customerId) {
        	
            $model = new Model_Customer();
            
            try {
                $model->delete('customer_id = ' . $customerId);
            }
            catch (Exception $e) {
                $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode(array(
                    'message' => $e->getMessage()
                )));
                return;
            }
        }
        
        $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode(array(
            'customer_id' => $customerId
        )));
    }
    
    private function loadStores()
    {
        $cache = Zend_Registry::get('cache');
        
        if (!($stores = $cache->load('stores'))) {
            $model  = new Model_Customer();
            $stores = $model->fetchStores();
            $cache->save($stores, 'stores');
        }
        
        $this->view->headScript()->appendScript('var stores = ' . str_replace('\\/', '/', Zend_Json::encode($stores)));
        
        return $this;
    }
    
    private function addScript($javascriptFile)
    {
        $scripts = $this->view->inlineScript();
        $scripts->appendFile('/javascripts/' . $javascriptFile . '.js');
        return $this;
    }
    
    private function norender()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->getHelper('layout')->disableLayout();
    }
}
