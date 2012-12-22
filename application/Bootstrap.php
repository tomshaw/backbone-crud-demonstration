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
    
    public function profiler()
    {
        $profiler = $this->getResource('db')->getProfiler();
        
        $profiles = $profiler->getQueryProfiles();
        
        if (APPLICATION_ENV == 'production') {
            return;
        }
        
        if (!$profiles) {
            return;
        }
        
        if ($profiler->getEnabled() !== true) {
            return;
        }
        
        $msecs    = $profiler->getTotalElapsedSecs();
        $nqueries = $profiler->getTotalNumQueries();
        
        $longestTime = $longestQuery = 0;
        
        $sqlData = array();
        
        $count = 1;
        foreach ($profiles as $query) {
            $elapsedSeconds = $query->getElapsedSecs();
            if ($elapsedSeconds > $longestTime) {
                $longestTime  = $elapsedSeconds;
                $longestQuery = $count;
            }
            $sqlData[] = array(
                'count' => $count,
                'query' => $query->getQuery(),
                'seconds' => $elapsedSeconds
            );
            $count++;
        }
        
        $data = array(
            'queries' => $sqlData,
            'elapsed_milliseconds' => $msecs,
            'average_query_time' => ($msecs / $nqueries),
            'queries_per_second' => ($nqueries / $msecs),
            'longest_query_time' => $longestTime,
            'longest_query_id' => $longestQuery
        );
        
        return $data;
    }
}