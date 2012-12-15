<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    protected function _initAppAutoload()
    {
        $loader = new Zend_Application_Module_Autoloader(array(
            'namespace' => '',
            'basePath' => APPLICATION_PATH
        ));
        return $loader;
    }
    
    protected function _initCache()
    {
        $frontendOptions = array(
            'lifetime' => 7200,
            'automatic_serialization' => true
        );
        $backendOptions  = array(
            'cache_dir' => APPLICATION_PATH . '/../data/cache/'
        );
        Zend_Registry::set('cache', Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions));
    }   
}