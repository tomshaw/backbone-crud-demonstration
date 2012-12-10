<?php

class IndexController extends Zend_Controller_Action
{
    public $_page;
    
    public function init()
    {
        $request = $this->getRequest();
        
        $this->_page = $request->getParam('page', '1');
    }
    
    public function indexAction()
    {
        $this->addScript('app');
    }
    
    public function customersAction()
    {
        $this->norender();
        
        $this->addScript('app');
        
        $model = new Model_Customer();
        
        $select = $model->getCustomers();
        
        $paginator = Zend_Paginator::factory($select);
        
        $paginator->setCurrentPageNumber($this->_page);
        
        $paginator->setItemCountPerPage(10);
        
        $response          = array();
        $response['items'] = $paginator->getIterator()->toArray();
        $response['pages'] = get_object_vars($paginator->getPages('Jumping'));
        
        $this->getResponse()->setHttpResponseCode(200)->appendBody(Zend_Json::encode($response));
    }
    
    private function addScript($javascriptFile)
    {
        $scripts = $this->view->inlineScript();
        $scripts->appendFile('/javascripts/' . $javascriptFile . '.js');
    }
    
    private function norender()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->getHelper('layout')->disableLayout();
    }
}

