<?php

class IndexController extends Zend_Controller_Action
{
    public $_page;
    
    public function preDispatch()
    {
    	// http://lvh.me/project/bbcrud/test_js/SpecRunner.html 
        //header('Access-Control-Allow-Origin: *');
        //header('Access-Control-Allow-Methods: "POST,GET,DELETE,PUT,OPTIONS"');
        //header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
    }
    
    public function init()
    {
        $this->addScript('models')->addScript('views')->addScript('router');
        
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
    	
        $request = $this->getRequest();
        
        $order = $request->getParam('order', 'customer_id');
        
        $sort = $request->getParam('sort', 'DESC');
        
        $model = new Model_Customer();
        
        $data = array(); // search array when implemented
        
        $select = $model->getCustomers($data, $order, $sort);
        
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
