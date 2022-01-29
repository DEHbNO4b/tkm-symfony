<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="nodes")
 * @ORM\Entity(repositoryClass="App\Repository\NodesRepository")
 */
class Nodes
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
     * @ORM\Column(type="integer")
     */
	private $treeId;
	
	/**
     * @ORM\Column(type="integer")
     */
	private $parentId;
	
	/**
     * @ORM\Column(type="integer")
     */
	private $personId;
	
	/**
     * @ORM\Column(type="integer")
     */
	private $spouseId;
	
	/**
     * @ORM\Column(type="datetime")
     */
    private $dateAdded;
    
    /**
     * @ORM\Column(type="datetime")
     */
    private $lastUpdate;
	
	public function getTreeId()
    {
        return $this->treeId;
    }
	
	public function setTreeId($treeId){
		$this->treeId = $treeId;
	}
	
	public function getParentId()
    {
        return $this->parentId;
    }
	
	public function setParentId($parentId){
		$this->parentId = $parentId;
	}
	
	public function getPersonId()
    {
        return $this->personId;
    }
	
	public function setPersonId($personId){
		$this->personId = $personId;
	}
	
	public function getSpouseId()
    {
        return $this->spouseId;
    }
	
	public function setSpouseId($spouseId){
		$this->spouseId = $spouseId;
	}
	
	public function getDateAdded()
    {
        return $this->dateAdded;
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
