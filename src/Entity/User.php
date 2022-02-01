<?php
namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use PhpParser\Node\Expr\Array_;
use Serializable;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;


/**
 * @ORM\Table(name="users")
 * @ORM\Entity(repositoryClass=UserRepository::class)
 */
class User implements UserInterface,
                            Serializable,
                                PasswordAuthenticatedUserInterface
{
	 const PASSWORD_MIN_LENGTH = 2;
	 const NAMES_MIN_LENGTH = 2;
	
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=30)
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=100)
     */
    private $passwordHash;

    /**
     * @ORM\Column(type="string", length=255, nullable=true )
     */
    private $passwordSalt;

    /**
     * @ORM\Column(type="string", length=40, unique=true)
     */
    private $phone;

    /**
     * @ORM\Column(type="string", length=100, unique=true)
     */
    private $email;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateAdded;
    
    /**
     * @ORM\Column(type="datetime", options={"default": "CURRENT_TIMESTAMP"})
     */
    private $lastUpdate;
    
    
    public function __construct()
    {
        
    }

    public function getId()
    {
        return $this->id;
    }
    
    public function getFirstname()
    {
        return $this->firstname;
    }
    
    public function setFirstname($name)
    {
        $this->firstname = $name;
    }
    
    public function getLastname()
    {
        return $this->lastname;
    }
    
    public function setLastname($name)
    {
        $this->lastname = $name;
    }

    public function getPhone()
    {
        return $this->phone;
    }
    
    public function setPhone($phone)
    {
        $this->phone = $phone;
    }

    public function getEmail()
    {
        return $this->email;
    }
    
    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getDateAdded()
    {
        return $this->dateAdded;
    }
    
    public function setDateAdded($date)
    {
        $this->dateAdded = $date;
    }
    public function setLastUpdate($date)
    {
        $this->lastUpdate = $date;
    }

    public function getLastUpdate()
    {
        return $this->lastUpdate;
    }

    public function getSalt(): ?string
    {
        return $this->passwordSalt;
    }
    /**
     * @return string the hashed password for this user
     */
    public function getPassword() :string
    {
        return $this->passwordHash;
    }

    public function setPassword($plainPassword)
    {
        // $salt = $this->createSalt();
        // $this->passwordSalt = $salt;
//        $this->passwordHash = $this->createPasswordHash($plainPassword, $salt);
        $this->passwordHash =$plainPassword;
    }

    public function checkPassword($plainPassword)
    {        
        return $this->createPasswordHash($plainPassword, $this->getSalt()) === $this->getPassword();
    }

    public function getRoles() :array
    {
        return array('isUser');
    }

    public function eraseCredentials()
    {
    }

    /** @see \Serializable::serialize() */
    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->phone,
            $this->passwordHash,
            // смотрите раздел о соли ниже
            // $this->salt,
        ));
    }

    /** @see \Serializable::unserialize() */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->phone,
            $this->passwordHash,
            // смотрите раздел о соли ниже
            // $this->salt
        ) = unserialize($serialized);
    }

    public function getUsername(): string
    {
        return $this->getFirstname().' '.$this->getLastname();
    }

    /**
     * @return string
     */
    public function getUserIdentifier(): string
    {
        // TODO: Implement getUserIdentifier() method.
        return (string) $this->phone;
    }
    protected function createSalt()
    {
        return base_convert(sha1(uniqid(mt_rand(), true)), 16, 36);
    }

    protected function createPasswordHash($plainPassword, $salt)
    {
        $hash = sha1($plainPassword|$salt);
        $first4chars = substr($hash, 0, 4);
        $last6chars = substr($hash, -6, 6);

        return $last6chars.substr($hash, 4, strlen($hash)-10).$first4chars;
    }


}