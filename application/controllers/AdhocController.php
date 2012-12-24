<?php

class AdhocController extends Zend_Controller_Action
{
    /**
     * Convince Google Chrome into allowing cross origin requests.
     */
    public function preDispatch()
    {
        // http://lvh.me/project/bbcrud/test_js/SpecRunner.html 
        //header('Access-Control-Allow-Origin: *');
        //header('Access-Control-Allow-Methods: "POST,GET,DELETE,PUT,OPTIONS"');
        //header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
    }
    
    /**
     * Used to generate users table from MySQL sakila db.
     */
    public function indexAction()
    {
        $this->norender();
        
        static $domains = array('gmail.com', 'yahoo.com', 'hotmail.com', 'me.com', 'icloud.com', 'live.com', 'rr.com', 'att.net', 'comcast.com', 'charter.com', 'verizon.com', 'suddenlink.com', 'earthlink.net', 'windstream.com', 'cableone.net', 'netzero.net', 'juno.com', 'aol.com', 'msn.com', 'media.com');
        
        $model = new Model_User();
        $rows  = $model->fetchAll();
        
        $i = 0;
        foreach ($rows as $row) {
            if ($i == 25) {
                $i = 0;
            }
            
            $firstName = ucwords(strtolower($row->first_name));
            $lastName  = ucwords(strtolower($row->last_name));
            
            $stringLength = strlen($firstName . $lastName);
            if ($stringLength > 15) {
            	$extra = 15 - $stringLength;
                $row->username = substr($firstName . $lastName, 0, $extra);
            } else {
                $row->username = $firstName . $lastName;
            }
            
            if ($i % 3 == 0) {
                $row->username = strtolower($row->username);
            }
            
            // 0 = anonymous
            // 1 = member
            // 2 = employee
            // 3 = supervisor
            // 4 = administrator
            if ($i == 0) {
                $random = $this->randomNumbersInRange(1, 4, 1);
            } else {
                $random = $this->randomNumbersInRange(1, 2, 1);
            }
            
            $row->identity = $random[0];
            
            $row->first_name = $firstName;
            $row->last_name  = $lastName;
            
            $row->full_name = $firstName . ' ' . $lastName;
            
            $email    = strtolower($row->email);
            $parts    = explode('@', $email);
            $randKey  = array_rand($domains);
            $newEmail = $parts[0] . '@' . $domains[$randKey];
            
            $row->email    = $newEmail;
            $row->password = md5($row->email);
            $row->save();
            
            $i++;
        }
        
        echo 'All Done!';
    }
    
    function randomNumbersInRange($min, $max, $quantity = 5)
    {
        $numbers = range($min, $max);
        shuffle($numbers);
        return array_slice($numbers, 0, $quantity);
    }
    
    private function norender()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->getHelper('layout')->disableLayout();
    }
    
}