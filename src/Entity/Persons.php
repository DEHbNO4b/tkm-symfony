<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="persons")
 * @ORM\Entity(repositoryClass="App\Repository\PersonsRepository")
 */
class Persons
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    public function getId()
    {
        return $this->id;
    }
	
	/**
     * @ORM\Column(type="string", length=40)
     */
	private $name;
	
	/**
     * @ORM\Column(type="string")
     */
	private $gender;
	
	/**
     * @ORM\Column(type="datetime")
     */
    private $dateAdded;
    
    /**
     * @ORM\Column(type="datetime")
     */
    private $lastUpdate;
	
	public function getName(){
		return $this->name;
	}
	
	public function setName($name){
		$this->name = $name;
	}
	
	public function getGender(){
		return $this->gender;
	}
	
	public function setGender($gender){
		$this->gender = $gender;
	}
	
	 public function setDateAdded($date)
    {
        $this->dateAdded = $date;
    }

    public function getLastUpdate()
    {
        return $this->lastUpdate;
    }
}
