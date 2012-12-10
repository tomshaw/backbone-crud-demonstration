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
	
}

