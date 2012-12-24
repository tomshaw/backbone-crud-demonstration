<?php

class IndexController extends Zend_Controller_Action
{
    public $_page;
    
    public function preDispatch()
    {
    }
    
    public function init()
    {
        $this->addScript('models')->addScript('collections')->addScript('views')->addScript('router');
        
        $this->loadIdentities();
        
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
        
        $order = $request->getParam('order', 'id');
        
        $sort = $request->getParam('sort', 'DESC');
        
        $letter = $request->getParam('letter', false);
        
        $store = new Zend_Session_Namespace();
        
        $data = ($request->isPost()) ? $request->getPost() : array();
        
        if ($letter != '') {
        	$data['letter'] = $letter;
        }
        
        if (sizeof($data)) {
            foreach ($data as $key => $var) {
                $store->data{$key} = $var;
            }
        }
        
        if (false === ($request->isPost())) {
            if (null === $request->getParam('page') && null === $request->getParam('sort') && null === $request->getParam('letter')) {
                unset($store->data);
            }
        }
        
        $model = new Model_User();
        
        $select = $model->getUsers($store->data, $order, $sort);
        
        $paginator = Zend_Paginator::factory($select);
        
        $paginator->setCurrentPageNumber($this->_page);
        
        $paginator->setItemCountPerPage(20);
        
        $response             = array();
        $response['items']    = $paginator->getIterator()->toArray();
        $response['pages']    = get_object_vars($paginator->getPages('Jumping'));
        $response['profiler'] = $this->getInvokeArg('bootstrap')->profiler();
        
        $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode($response));
    }
    
    public function addAction()
    {
        $this->norender();
        
        $request = $this->getRequest();
        
        $model = new Model_User();
        
        if ($request->isPost()) {
            $post = Zend_Json::decode($request->getRawBody());
            
            $post['created'] = $post['updated'] = new Zend_Db_Expr('NOW()');
            
            $post['password'] = md5($post['password']);
            
            $lastInsertId = $model->insert($post);
            
            $post['id'] = $lastInsertId;
            
            $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode(array_merge($post, array(
                'profiler' => $this->getInvokeArg('bootstrap')->profiler()
            ))));
            
        }
    }
    
    public function editAction()
    {
        $this->norender();
        
        $request = $this->getRequest();
        
        $customerId = $request->getParam('id');
        
        $model = new Model_User();
        
        $row = $model->fetchRow('id = ' . intval($customerId));
        
        if ($request->isPut()) {
            $put = Zend_Json::decode($request->getRawBody());
            
            $data               = array();
            $data['id']         = intval($put['id']);
            $data['username']   = $put['username'];
            $data['fullname']   = $put['fullname'];
            $data['email']      = $put['email'];
            $data['identity']   = intval($put['identity']);
            $data['verified']   = intval($put['verified']);
            
            if (isset($put['password']) && !empty($put['password'])) {
                $data['password'] = md5($put['password']);
            }
            
            $row->setFromArray($data);
            
            $row->save();
            
            $data['profiler'] = $this->getInvokeArg('bootstrap')->profiler();
            
            $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode($data));
            
            return;
        }
        
        $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode(array_merge($row->toArray(), array(
            'profiler' => $this->getInvokeArg('bootstrap')->profiler()
        ))));
    }
    
    public function usernameAction()
    {
    	$this->norender();
    
    	$name = $this->getRequest()->getParam('username');
    
    	$model = new Model_User();
    
    	$row = $model->nameSearch($name);
    	
    	$response = array();
    	$response['profiler'] = $this->getInvokeArg('bootstrap')->profiler();
    
    	if (!sizeof($row)) {
    		$response['isValid'] = true;
    		$response['message'] = 'Your username look good!';
    	} else {
    		$response['isValid'] = false;
    		$response['message'] = 'This username is already taken!';
    	}
    	
    	$this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode($response));
    }
    
    public function emailAction()
    {
    	$this->norender();
    
    	$email = $this->getRequest()->getParam('email');
    
    	$model = new Model_User();
    
    	$row = $model->emailSearch($email);
    	 
    	$response = array();
    	$response['profiler'] = $this->getInvokeArg('bootstrap')->profiler();
    
    	if (!sizeof($row)) {
    		$response['isValid'] = true;
    		$response['message'] = 'Your email address looks good!';
    	} else {
    		$response['isValid'] = false;
    		$response['message'] = 'This email address is already in use!';
    	}
    	 
    	$this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode($response));
    }
    
    public function deleteAction()
    {
        $this->norender();
        
        $delete = $this->getRequest();
        
        $userId = intval($delete->getParam('id'));
        
        if ($userId) {
            $model = new Model_User();
            
            try {
                $model->delete('id = ' . $userId);
            }
            catch (Exception $e) {
                $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode(array(
                    'message' => $e->getMessage()
                )));
                return;
            }
        }
        
        $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode(array(
            'id' => $userId
        )));
    }
    
    public function jasmineAction()
    {
    	$this->_helper->getHelper('layout')->setLayout('jasmine');
    }
    
    private function loadIdentities()
    {
        $cache = Zend_Registry::get('cache');
        
        if (!($identities = $cache->load('identities'))) {
            $identities = Model_User::fetchIdentities();
            $cache->save($identities, 'identities');
        }
        
        $this->view->headScript()->appendScript('var identities = ' . str_replace('\\/', '/', Zend_Json::encode($identities)));
        
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
