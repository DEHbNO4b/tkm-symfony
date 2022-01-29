<?php
// src/Entity/Tree.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;

use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Table(name="trees")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class Tree implements \Serializable
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=40)
     */
    private $family;

    /**
     * @ORM\Column(type="integer")
     */
    private $adminId;
	
	/**
     * @ORM\Column(type="string", length=40)
     */
	private $nationality;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateAdded;
    
    /**
     * @ORM\Column(type="datetime")
     */
    private $lastUpdate;
    
    
    public function __construct()
    {
        
    }

    public function getId()
    {
        return $this->id;
    }
    
    public function getFamily()
    {
        return $this->family;
    }
    
    public function setFamily($family)
    {
        $this->family = $family;
    }
    
    public function getAdminId()
    {
        return $this->adminId;
    }
    
    public function setAdminId($id)
    {
        $this->adminId = $id;
    }
	
	public function getNationality()
    {
        return $this->nationality;
    }
    
    public function setNationality($nationality)
    {
        $this->nationality = $nationality;
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


    public function eraseCredentials()
    {
    }

    /** @see \Serializable::serialize() */
    public function serialize()
    {
        return serialize([
            $this->id,
            $this->family,
            $this->adminId,
			 $this->nationality,
            $this->dateAdded,
            $this->lastUpdate
        ]);
    }

    /** @see \Serializable::unserialize() */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->family,
            $this->adminId,
			$this->nationality,
            $this->dateAdded,
            $this->lastUpdate
        ) = unserialize($serialized);
    }
}